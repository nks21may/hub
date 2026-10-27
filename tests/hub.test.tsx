// @vitest-environment jsdom
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {TEXTOS} from '../src/i18n/textos.ts';
import {Hub} from '../src/hub/Hub.tsx';

// En jsdom, `import.meta.url` no es una URL file: y readFileSync no la acepta. Vitest corre desde la
// raíz del repo.
const EJEMPLO = readFileSync(resolve(process.cwd(), 'ejemplos/catalogo.json'), 'utf8');
const NEONDUEL = 'https://neonduel.nicolasdalessandro.dev/';

function servir(respuesta: Promise<Response>): ReturnType<typeof vi.fn> {
  const fetch = vi.fn(() => respuesta);
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

function catalogo(cuerpo = EJEMPLO): ReturnType<typeof vi.fn> {
  return servir(Promise.resolve({ok: true, text: async () => cuerpo} as Response));
}

/** Un catálogo con las fichas dadas, todas encendidas, en el formato de ADR-0010. */
function catalogoCon(fichas: {stack: string; hub: Record<string, unknown>}[]): string {
  return JSON.stringify({version: 1, stacks: fichas.map((ficha) => ({...ficha, apagado: false}))});
}

function ficha(stack: string, nombre: string, extra: Record<string, unknown> = {}) {
  return {
    stack,
    hub: {
      nombre,
      url: `https://${stack}.nicolasdalessandro.dev/`,
      desde: '2026-01-01',
      descripcion: {es: `La ficha de ${nombre}.`},
      ...extra,
    },
  };
}

async function hubCargado(navegar = vi.fn(), idioma: 'es' | 'en' = 'es') {
  catalogo();
  render(<Hub idioma={idioma} navegar={navegar} />);
  await screen.findByRole('list', {name: TEXTOS[idioma]['hub.proyectos']});
  return navegar;
}

function nombres(): string[] {
  return screen.getAllByRole('link').map((link) => link.getAttribute('aria-label') ?? '');
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('el hub', () => {
  it('mientras el catálogo no llega, está cargando y no hay recuadros', () => {
    servir(new Promise<Response>(() => {}));
    render(<Hub idioma="es" />);
    expect(screen.getByRole('status').textContent).toContain(TEXTOS.es['hub.cargando']);
    expect(screen.queryAllByRole('link')).toEqual([]);
  });

  it('pide el catálogo a /catalogo.json', () => {
    const fetch = catalogo();
    render(<Hub idioma="es" />);
    expect(fetch).toHaveBeenCalledWith('/catalogo.json', expect.anything());
  });

  it('con el catálogo de ejemplo, el encabezado los cuenta y hay un recuadro por ficha visible, en orden', async () => {
    await hubCargado();
    expect(screen.getByRole('heading', {level: 1}).textContent).toContain('6 proyectos');
    expect(nombres()).toEqual([
      'Audio',
      'Portfolio',
      'Neonduel',
      'Surf & Bhop Daily',
      'Museo',
      'Nonograma',
    ]);
    expect(screen.getAllByRole('link')[2]?.getAttribute('href')).toBe(NEONDUEL);
  });

  it('cada recuadro muestra la descripción en el idioma, el host sin https y la tecla de su número', async () => {
    await hubCargado();
    const recuadro = screen.getByRole('link', {name: 'Neonduel'});
    expect(recuadro.textContent).toContain(
      'Shooter 3D uno contra uno en el navegador, con movimiento de Counter-Strike.',
    );
    expect(recuadro.textContent).toContain('neonduel.nicolasdalessandro.dev');
    expect(recuadro.textContent).not.toContain('https://');
    expect(within(recuadro).getByText('3')).toBeTruthy();
  });

  it('la tecla del número entra directo a ese proyecto', async () => {
    const navegar = await hubCargado();
    fireEvent.keyDown(window, {key: '3'});
    expect(navegar).toHaveBeenCalledWith(NEONDUEL);
  });

  it('una tecla sin proyecto, o con un modificador, no hace nada', async () => {
    const navegar = await hubCargado();
    fireEvent.keyDown(window, {key: '8'});
    fireEvent.keyDown(window, {key: '3', ctrlKey: true});
    fireEvent.keyDown(window, {key: 'a'});
    expect(navegar).not.toHaveBeenCalled();
  });

  it('si el catálogo no llega, dice que no pudo leer la lista y no hay recuadros', async () => {
    servir(Promise.reject(new Error('sin red')));
    render(<Hub idioma="es" />);
    expect(await screen.findByText(TEXTOS.es['hub.sin-lista'])).toBeTruthy();
    expect(screen.queryAllByRole('link')).toEqual([]);
  });

  it('con un catálogo que no es JSON, también dice que no pudo leer la lista', async () => {
    catalogo('<html>nginx</html>');
    render(<Hub idioma="es" />);
    expect(await screen.findByText(TEXTOS.es['hub.sin-lista'])).toBeTruthy();
    expect(screen.queryAllByRole('link')).toEqual([]);
  });

  it('sin fichas, dice que todavía no hay nada publicado', async () => {
    catalogo(catalogoCon([]));
    render(<Hub idioma="es" />);
    expect(await screen.findByText(TEXTOS.es['hub.vacio'])).toBeTruthy();
  });

  it('con vista muestra el loop; sin vista, la captura de prueba sin cartel o un relleno con el nombre', async () => {
    const vista = 'https://neonduel.nicolasdalessandro.dev/vista.mp4';
    catalogo(
      catalogoCon([
        ficha('neonduel', 'Neonduel', {vista}),
        ficha('museo', 'Museo'),
        ficha('nuevo', 'Algo Nuevo'),
      ]),
    );
    const {container} = render(<Hub idioma="es" />);
    await screen.findByRole('list', {name: TEXTOS.es['hub.proyectos']});

    expect(container.querySelector(`video[src="${vista}"]`)).not.toBeNull();
    const museo = screen.getByRole('link', {name: 'Museo'});
    expect(museo.querySelector('img')?.getAttribute('src')).toBe('/prueba/vistas/museo.webp');
    expect(museo.querySelector('.recuadro__vista')?.textContent).toBe('');
    const nuevo = screen.getByRole('link', {name: 'Algo Nuevo'});
    expect(nuevo.querySelector('img, video')).toBeNull();
    expect(nuevo.querySelector('.recuadro__relleno')?.textContent).toBe('Algo Nuevo');
  });

  it('el pie dice sólo el dominio', async () => {
    await hubCargado();
    expect(screen.getByRole('contentinfo').textContent).toBe(TEXTOS.es['hub.marca']);
  });

  it('la pestaña del navegador lleva el título del diccionario, en el idioma del hub', async () => {
    await hubCargado(vi.fn(), 'en');
    expect(document.title).toBe(TEXTOS.en['hub.pestana']);
  });

  it('en inglés, los textos salen del diccionario en inglés', async () => {
    await hubCargado(vi.fn(), 'en');
    expect(screen.getByRole('heading', {level: 1}).textContent).toContain('6 projects');
    const recuadro = screen.getByRole('link', {name: 'Neonduel'});
    expect(recuadro.textContent).toContain('A 1v1 browser 3D shooter with Counter-Strike movement.');
  });
});
