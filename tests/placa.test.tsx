// @vitest-environment jsdom
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {idiomaPreferido, TEXTOS} from '../src/i18n/textos.ts';
import {Placa} from '../src/placa/Placa.tsx';

// En jsdom, `import.meta.url` no es una URL file: y readFileSync no la acepta. Vitest corre desde la
// raíz del repo.
const EJEMPLO = readFileSync(resolve(process.cwd(), 'ejemplos/catalogo.json'), 'utf8');

/** Lo mínimo de una Response que la placa usa. */
function respuesta(cuerpo: string, ok = true): Response {
  return {ok, text: async () => cuerpo} as Response;
}

function servir(respuestaOFalla: Response | Error): ReturnType<typeof vi.fn> {
  const fetch = vi.fn(async () => {
    if (respuestaOFalla instanceof Error) throw respuestaOFalla;
    return respuestaOFalla;
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

function filas(): string[] {
  return screen
    .queryAllByRole('listitem')
    .map((fila) => (fila.textContent ?? '').replace(/\s+/g, ' ').trim());
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('la placa', () => {
  it('mientras el catálogo no llega, está arrancando y no lista nada', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
    render(<Placa idioma="es" />);
    expect(screen.getByRole('status').textContent).toContain(TEXTOS.es['arranque.catalogo']);
    expect(filas()).toEqual([]);
  });

  it('pide el catálogo a /catalogo.json', () => {
    const fetch = servir(respuesta(EJEMPLO));
    render(<Placa idioma="es" />);
    expect(fetch).toHaveBeenCalledWith('/catalogo.json', expect.anything());
  });

  it('con el catálogo de ejemplo, el título dice cuántos juegos hay y hay una fila numerada por cada uno', async () => {
    servir(respuesta(EJEMPLO));
    render(<Placa idioma="es" />);
    expect(await screen.findByRole('heading', {name: '6 EN 1'})).toBeTruthy();
    expect(filas()).toEqual([
      '01 Audio',
      '02 Portfolio',
      '03 Neonduel',
      '04 Surf & Bhop Daily',
      '05 Museo',
      '06 Nonograma',
    ]);
  });

  it('el título cuenta sólo los juegos visibles, y un apagado deja su número vacío', async () => {
    const ficha = (nombre: string, desde: string) => ({
      nombre,
      url: `https://${nombre.toLowerCase()}.nicolasdalessandro.dev/`,
      desde,
      descripcion: {es: nombre},
    });
    servir(
      respuesta(
        JSON.stringify({
          version: 1,
          stacks: [
            {stack: 'a', apagado: false, hub: ficha('Uno', '2026-01-01')},
            {stack: 'b', apagado: true, hub: ficha('Dos', '2026-02-01')},
            {stack: 'c', apagado: false, hub: ficha('Tres', '2026-03-01')},
          ],
        }),
      ),
    );
    render(<Placa idioma="es" />);
    expect(await screen.findByRole('heading', {name: '2 EN 1'})).toBeTruthy();
    expect(filas()).toEqual(['01 Uno', '03 Tres']);
  });

  it.each([
    ['la red falla', new Error('sin red')],
    ['el servidor contesta un error', respuesta('Bad Gateway', false)],
    ['llega algo que no es un catálogo', respuesta('<html>no</html>')],
  ])('si %s, muestra SIN SEÑAL, sin filas ni título', async (_caso, contestacion) => {
    servir(contestacion);
    render(<Placa idioma="es" />);
    expect(await screen.findByText(TEXTOS.es['senal.titulo'])).toBeTruthy();
    expect(filas()).toEqual([]);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('en inglés, los textos salen del diccionario en inglés', async () => {
    servir(respuesta(EJEMPLO));
    render(<Placa idioma="en" />);
    expect(await screen.findByRole('heading', {name: '6 IN 1'})).toBeTruthy();
    expect(screen.getByRole('list', {name: TEXTOS.en['placa.lista']})).toBeTruthy();
  });
});

describe('idiomaPreferido', () => {
  it.each([
    [['es-AR', 'en'], 'es'],
    [['en-US', 'es'], 'en'],
    [['fr-FR', 'es-ES'], 'es'],
    [['fr-FR'], 'en'],
    [[], 'es'],
  ] as const)('con %j elige %s', (idiomas, esperado) => {
    expect(idiomaPreferido(idiomas)).toBe(esperado);
  });
});
