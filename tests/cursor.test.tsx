// @vitest-environment jsdom
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TEXTOS} from '../src/i18n/textos.ts';
import {Placa} from '../src/placa/Placa.tsx';

const EJEMPLO = readFileSync(resolve(process.cwd(), 'ejemplos/catalogo.json'), 'utf8');
const AUDIO = 'Pasa el audio de una pestaña de Chrome a un canal de voz de Discord.';
const NEONDUEL = 'Shooter 3D uno contra uno en el navegador, con movimiento de Counter-Strike.';

function servir(cuerpo: string): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ok: true, text: async () => cuerpo}) as Response),
  );
}

/** jsdom no trae matchMedia: la placa lo usa para saber si hay que ahorrar movimiento. */
function movimientoReducido(reducido: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((consulta: string) => ({
      matches: reducido && consulta.includes('prefers-reduced-motion'),
      media: consulta,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

async function placaCargada(navegar = vi.fn(), idioma: 'es' | 'en' = 'es') {
  render(<Placa idioma={idioma} navegar={navegar} />);
  await screen.findByRole('heading');
  return navegar;
}

function filaConCursor(): string {
  const actual = screen.getAllByRole('link').filter((fila) => fila.getAttribute('aria-current'));
  expect(actual).toHaveLength(1);
  return (actual[0]?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

beforeEach(() => {
  servir(EJEMPLO);
  movimientoReducido(true);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('el cursor', () => {
  it('arranca en el 01, y la vista previa muestra su ficha', async () => {
    await placaCargada();
    expect(filaConCursor()).toBe('01 Audio');
    expect(screen.getByText(AUDIO)).toBeTruthy();
  });

  it('abajo y arriba lo mueven de a una fila, sin pasarse de las puntas', async () => {
    await placaCargada();
    const usuario = userEvent.setup();
    await usuario.keyboard('{ArrowUp}');
    expect(filaConCursor()).toBe('01 Audio');
    await usuario.keyboard('{ArrowDown}{ArrowDown}');
    expect(filaConCursor()).toBe('03 Neonduel');
    await usuario.keyboard('{ArrowDown}'.repeat(10));
    expect(filaConCursor()).toBe('06 Nonograma');
    await usuario.keyboard('{ArrowUp}');
    expect(filaConCursor()).toBe('05 Museo');
  });

  it('la vista previa muestra sólo la ficha de la fila con el cursor', async () => {
    await placaCargada();
    await userEvent.setup().keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByText(NEONDUEL)).toBeTruthy();
    expect(screen.queryByText(AUDIO)).toBeNull();
  });

  it('pasar el mouse por una fila le lleva el cursor', async () => {
    await placaCargada();
    await userEvent.setup().hover(screen.getByRole('link', {name: /Museo/}));
    expect(filaConCursor()).toBe('05 Museo');
  });

  it('una ficha sin el idioma de la placa muestra el que tiene', async () => {
    servir(
      JSON.stringify({
        version: 1,
        stacks: [
          {
            stack: 'x',
            apagado: false,
            hub: {
              nombre: 'Equis',
              url: 'https://x.nicolasdalessandro.dev/',
              desde: '2026-01-01',
              descripcion: {en: 'Only in English.'},
            },
          },
        ],
      }),
    );
    await placaCargada();
    expect(screen.getByText('Only in English.')).toBeTruthy();
  });
});

describe('la vista previa', () => {
  it('sin vista muestra el relleno de la placa, y con vista muestra el loop de la app', async () => {
    const vista = 'https://museo.nicolasdalessandro.dev/vista.mp4';
    const catalogo = JSON.parse(EJEMPLO);
    catalogo.stacks.find((s: {stack: string}) => s.stack === 'museo').hub.vista = vista;
    servir(JSON.stringify(catalogo));
    const {container} = render(<Placa idioma="es" navegar={vi.fn()} />);
    await screen.findByRole('heading');

    expect(container.querySelector('.vista video')).toBeNull();
    expect(container.querySelector('.vista .relleno')?.textContent).toContain('01');

    await userEvent.setup().hover(screen.getByRole('link', {name: /Museo/}));
    expect(container.querySelector('.vista video')?.getAttribute('src')).toBe(vista);
  });
});

describe('entrar', () => {
  it('cada fila es un link a la url de su ficha', async () => {
    await placaCargada();
    expect(screen.getAllByRole('link').map((fila) => fila.getAttribute('href'))).toEqual([
      'https://audio.nicolasdalessandro.dev/',
      'https://nicolasdalessandro.dev/',
      'https://neonduel.nicolasdalessandro.dev/',
      'https://surf.nicolasdalessandro.dev/',
      'https://museo.nicolasdalessandro.dev/',
      'https://nonograma.nicolasdalessandro.dev/',
    ]);
  });

  it('Enter abre el juego del cursor', async () => {
    const navegar = await placaCargada();
    await userEvent.setup().keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(navegar).toHaveBeenCalledTimes(1);
    expect(navegar).toHaveBeenCalledWith('https://neonduel.nicolasdalessandro.dev/');
  });

  it('un click en una fila entra a ese juego', async () => {
    const navegar = await placaCargada();
    await userEvent.setup().click(screen.getByRole('link', {name: /Museo/}));
    expect(navegar).toHaveBeenCalledTimes(1);
    expect(navegar).toHaveBeenCalledWith('https://museo.nicolasdalessandro.dev/');
  });

  it('con movimiento reducido entra en el acto, sin apagar la pantalla', async () => {
    const {container} = render(<Placa idioma="es" navegar={vi.fn()} />);
    await screen.findByRole('heading');
    fireEvent.keyDown(window, {key: 'Enter'});
    expect(container.querySelector('.pantalla--entrando')).toBeNull();
  });

  it('con movimiento, la pantalla se apaga y recién después entra', async () => {
    movimientoReducido(false);
    const navegar = vi.fn();
    const {container} = render(<Placa idioma="es" navegar={navegar} />);
    await screen.findByRole('heading');
    vi.useFakeTimers();
    fireEvent.keyDown(window, {key: 'Enter'});
    expect(container.querySelector('.pantalla--entrando')).not.toBeNull();
    expect(navegar).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(navegar).toHaveBeenCalledWith('https://audio.nicolasdalessandro.dev/');
  });
});

describe('el pie', () => {
  it('dice cómo elegir y cómo jugar', async () => {
    await placaCargada();
    expect(screen.getByText(TEXTOS.es['pie.elegir'])).toBeTruthy();
    expect(screen.getByText(TEXTOS.es['pie.jugar'])).toBeTruthy();
  });
});
