import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {leerCatalogo} from '../src/catalogo/leer-catalogo.ts';
import type {Lectura} from '../src/catalogo/tipos.ts';

const EJEMPLO = readFileSync(new URL('../ejemplos/catalogo.json', import.meta.url), 'utf8');

function ficha(cambios: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    nombre: 'Museo',
    url: 'https://museo.nicolasdalessandro.dev/',
    desde: '2026-09-25',
    descripcion: {es: 'Shaders de un tuit.', en: 'Tweet-sized shaders.'},
    ...cambios,
  };
}

function entrada(stack: string, hub: unknown, apagado = false): Record<string, unknown> {
  return {stack, apagado, hub};
}

function catalogo(stacks: unknown[]): string {
  return JSON.stringify({version: 1, generado: '2026-10-26T00:00:00Z', stacks});
}

function leida(texto: string): Extract<Lectura, {ok: true}> {
  const lectura = leerCatalogo(texto);
  if (!lectura.ok) throw new Error(`se esperaba una lectura válida: ${lectura.motivo}`);
  return lectura;
}

describe('leerCatalogo', () => {
  it('del catálogo de ejemplo salen los seis juegos visibles, sin la ficha oculta ni la apagada', () => {
    const lectura = leida(EJEMPLO);
    expect(lectura.maquinas.map((m) => m.stack)).not.toContain('minecraft');
    expect(lectura.maquinas).toHaveLength(6);
    expect(lectura.problemas).toEqual([]);
  });

  it('los juegos van por fecha de publicación y el número es su lugar en ese orden', () => {
    const lectura = leida(EJEMPLO);
    expect(lectura.maquinas.map((m) => [m.numero, m.nombre])).toEqual([
      [1, 'Audio'],
      [2, 'Portfolio'],
      [3, 'Neonduel'],
      [4, 'Surf & Bhop Daily'],
      [5, 'Museo'],
      [6, 'Nonograma'],
    ]);
  });

  it('un juego apagado deja su número vacío y no corre a los demás', () => {
    const lectura = leida(
      catalogo([
        entrada('a', ficha({nombre: 'A', desde: '2026-01-01'})),
        entrada('b', ficha({nombre: 'B', desde: '2026-02-01'}), true),
        entrada('c', ficha({nombre: 'C', desde: '2026-03-01'})),
      ]),
    );
    expect(lectura.maquinas.map((m) => [m.numero, m.nombre])).toEqual([
      [1, 'A'],
      [3, 'C'],
    ]);
  });

  it('a igual fecha, desempata el nombre del stack', () => {
    const lectura = leida(
      catalogo([entrada('zeta', ficha({nombre: 'Zeta'})), entrada('alfa', ficha({nombre: 'Alfa'}))]),
    );
    expect(lectura.maquinas.map((m) => m.stack)).toEqual(['alfa', 'zeta']);
  });

  it('un juego trae su nombre, url, descripción y fecha tal como vienen en la ficha', () => {
    const lectura = leida(catalogo([entrada('museo', ficha())]));
    expect(lectura.maquinas[0]).toEqual({
      stack: 'museo',
      numero: 1,
      nombre: 'Museo',
      url: 'https://museo.nicolasdalessandro.dev/',
      desde: '2026-09-25',
      descripcion: {es: 'Shaders de un tuit.', en: 'Tweet-sized shaders.'},
    });
  });

  it('una ficha sin url se descarta con su motivo, sin tirar el resto', () => {
    const sinUrl = ficha();
    delete sinUrl.url;
    const lectura = leida(catalogo([entrada('roto', sinUrl), entrada('museo', ficha())]));
    expect(lectura.maquinas.map((m) => m.stack)).toEqual(['museo']);
    expect(lectura.problemas).toEqual([{stack: 'roto', motivo: expect.stringContaining('url')}]);
  });

  it.each([
    ['una url que no es https', {url: 'http://museo.nicolasdalessandro.dev/'}, 'url'],
    ['una url que no es una url', {url: 'javascript:alert(1)'}, 'url'],
    ['un nombre vacío', {nombre: ''}, 'nombre'],
    ['un nombre de más de 20 caracteres', {nombre: 'Un nombre larguísimo!'}, 'nombre'],
    ['una fecha que no existe', {desde: '2026-13-01'}, 'desde'],
    ['una fecha que no es AAAA-MM-DD', {desde: 'ayer'}, 'desde'],
    ['una descripción sin ningún idioma', {descripcion: {}}, 'descripcion'],
    ['una descripción de más de 90 caracteres', {descripcion: {es: 'x'.repeat(91)}}, 'descripcion'],
    ['una descripción que no es un texto', {descripcion: {es: 42}}, 'descripcion'],
  ])('%s descarta la ficha con su motivo', (_caso, cambios, campo) => {
    const lectura = leida(catalogo([entrada('roto', ficha(cambios))]));
    expect(lectura.maquinas).toEqual([]);
    expect(lectura.problemas).toEqual([{stack: 'roto', motivo: expect.stringContaining(campo)}]);
  });

  it('una descripción con un solo idioma alcanza', () => {
    const lectura = leida(catalogo([entrada('museo', ficha({descripcion: {en: 'Shaders.'}}))]));
    expect(lectura.maquinas[0]?.descripcion).toEqual({en: 'Shaders.'});
  });

  it('una vista en el mismo host que la url llega al juego', () => {
    const vista = 'https://museo.nicolasdalessandro.dev/vista.mp4';
    const lectura = leida(catalogo([entrada('museo', ficha({vista}))]));
    expect(lectura.maquinas[0]?.vista).toBe(vista);
  });

  it.each([
    ['en otro host', 'https://otro.example.com/vista.mp4'],
    ['que no es https', 'http://museo.nicolasdalessandro.dev/vista.mp4'],
  ])('una vista %s se descarta sola y el juego queda sin vista previa', (_caso, vista) => {
    const lectura = leida(catalogo([entrada('museo', ficha({vista}))]));
    expect(lectura.maquinas).toHaveLength(1);
    expect(lectura.maquinas[0]).not.toHaveProperty('vista');
    expect(lectura.problemas).toEqual([{stack: 'museo', motivo: expect.stringContaining('vista')}]);
  });

  it('una ficha oculta no aparece y no es un problema, aunque traiga otros campos', () => {
    const lectura = leida(catalogo([entrada('mc', {...ficha(), oculto: 'whitelist'})]));
    expect(lectura.maquinas).toEqual([]);
    expect(lectura.problemas).toEqual([]);
  });

  it('un oculto sin motivo es un problema', () => {
    const lectura = leida(catalogo([entrada('mc', {oculto: ''})]));
    expect(lectura.maquinas).toEqual([]);
    expect(lectura.problemas).toEqual([{stack: 'mc', motivo: expect.stringContaining('oculto')}]);
  });

  it('un stack repetido se descarta la segunda vez', () => {
    const lectura = leida(
      catalogo([entrada('museo', ficha()), entrada('museo', ficha({nombre: 'Otro'}))]),
    );
    expect(lectura.maquinas.map((m) => m.nombre)).toEqual(['Museo']);
    expect(lectura.problemas).toEqual([{stack: 'museo', motivo: expect.stringContaining('repetido')}]);
  });

  it('una entrada sin stack o sin x-hub se descarta con su motivo', () => {
    const lectura = leida(catalogo([{apagado: false, hub: ficha()}, entrada('museo', undefined)]));
    expect(lectura.maquinas).toEqual([]);
    expect(lectura.problemas).toHaveLength(2);
  });

  it('los campos que la placa no conoce se ignoran', () => {
    const lectura = leida(catalogo([entrada('museo', ficha({genero: 'arte'}))]));
    expect(lectura.maquinas[0]).not.toHaveProperty('genero');
    expect(lectura.problemas).toEqual([]);
  });

  it('un texto que no es JSON da una lectura fallida con su motivo, sin excepción', () => {
    const lectura = leerCatalogo('<html>502 Bad Gateway</html>');
    expect(lectura).toEqual({ok: false, motivo: expect.stringContaining('JSON')});
  });

  it.each([
    ['una versión desconocida', JSON.stringify({version: 2, stacks: []}), 'version'],
    ['sin lista de stacks', JSON.stringify({version: 1}), 'stacks'],
    ['algo que no es un objeto', JSON.stringify([1, 2, 3]), 'objeto'],
  ])('%s da una lectura fallida con su motivo', (_caso, texto, palabra) => {
    expect(leerCatalogo(texto)).toEqual({ok: false, motivo: expect.stringContaining(palabra)});
  });
});
