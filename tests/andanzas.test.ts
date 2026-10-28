import {describe, expect, it} from 'vitest';
import type {Pato} from '../src/hub/andanzas.ts';
import {andar, nacer} from '../src/hub/andanzas.ts';
import {azarConSemilla} from '../src/hub/particulas.ts';

const VENTANA = {ancho: 1280, alto: 800};

/** Un pato caminando hacia un destino lejano, para medirle el paso sin que llegue. */
function caminando(x: number, y: number, destino = {x: 1200, y}): Pato {
  return {x, y, mirando: 1, fase: 'caminando', destino, pausa: 0};
}

function adentro(pato: Pato, ancho: number, alto: number): void {
  for (const punto of [pato, pato.destino]) {
    expect(punto.x).toBeGreaterThan(0);
    expect(punto.x).toBeLessThan(ancho);
    expect(punto.y).toBeGreaterThan(0);
    expect(punto.y).toBeLessThan(alto);
  }
}

/** Lo hace andar de a cuadros de 60 Hz durante tantos segundos. */
function durante(pato: Pato, segundos: number, azar: () => number, ventana = VENTANA): Pato {
  let actual = pato;
  for (let t = 0; t < segundos; t += 1 / 60) actual = andar(actual, ventana, 1 / 60, azar);
  return actual;
}

describe('el pato que pasea', () => {
  it('nace adentro de la ventana, caminando hacia un destino también adentro', () => {
    for (let semilla = 1; semilla <= 20; semilla++) {
      const pato = nacer(VENTANA.ancho, VENTANA.alto, azarConSemilla(semilla));
      expect(pato.fase).toBe('caminando');
      adentro(pato, VENTANA.ancho, VENTANA.alto);
    }
  });

  it('camina hacia su destino a paso de pato, unos 60 px/s', () => {
    const pato = andar(caminando(100, 400), VENTANA, 1, azarConSemilla(1));
    expect(pato.y).toBe(400);
    expect(pato.x - 100).toBeGreaterThan(40);
    expect(pato.x - 100).toBeLessThan(80);
  });

  it('depende del tiempo y no de los cuadros: dos medios segundos llegan adonde llega uno entero', () => {
    const azar = azarConSemilla(1);
    const entero = andar(caminando(100, 400), VENTANA, 1, azar);
    const medio = andar(andar(caminando(100, 400), VENTANA, 0.5, azar), VENTANA, 0.5, azar);
    expect(medio.x).toBeCloseTo(entero.x, 6);
    expect(medio.y).toBeCloseTo(entero.y, 6);
  });

  it('mira para el lado al que camina', () => {
    const azar = azarConSemilla(1);
    expect(andar(caminando(600, 400, {x: 1000, y: 400}), VENTANA, 0.1, azar).mirando).toBe(1);
    expect(andar(caminando(600, 400, {x: 200, y: 400}), VENTANA, 0.1, azar).mirando).toBe(-1);
  });

  it('al llegar se para entre 1 y 4 s, y después elige otro destino adentro de la ventana', () => {
    const azar = azarConSemilla(3);
    const llegado = andar(caminando(600, 400, {x: 603, y: 400}), VENTANA, 0.1, azar);
    expect(llegado.fase).toBe('parado');
    expect(llegado.x).toBe(603);
    expect(llegado.pausa).toBeGreaterThanOrEqual(1);
    expect(llegado.pausa).toBeLessThanOrEqual(4);

    expect(durante(llegado, llegado.pausa - 0.1, azar).fase).toBe('parado');
    const otra = durante(llegado, llegado.pausa + 0.1, azar);
    expect(otra.fase).toBe('caminando');
    expect(otra.destino).not.toEqual(llegado.destino);
    adentro(otra, VENTANA.ancho, VENTANA.alto);
  });

  it('pasea un buen rato sin salirse nunca de la ventana', () => {
    const azar = azarConSemilla(5);
    let pato = nacer(VENTANA.ancho, VENTANA.alto, azar);
    const paradas = new Set<string>();
    for (let segundo = 0; segundo < 120; segundo++) {
      pato = durante(pato, 1, azar);
      adentro(pato, VENTANA.ancho, VENTANA.alto);
      paradas.add(`${pato.destino.x},${pato.destino.y}`);
    }
    expect(paradas.size).toBeGreaterThan(3);
  });

  it('si la ventana se achica, vuelve adentro, y su destino también', () => {
    const azar = azarConSemilla(1);
    const chica = {ancho: 400, alto: 300};
    const pato = andar(caminando(1100, 700, {x: 1200, y: 750}), chica, 1 / 60, azar);
    adentro(pato, chica.ancho, chica.alto);
  });
});
