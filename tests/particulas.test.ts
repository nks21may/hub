import {describe, expect, it} from 'vitest';
import type {Particula} from '../src/hub/particulas.ts';
import {apagar, azarConSemilla, empuje, encender, sembrar} from '../src/hub/particulas.ts';

function una(x: number, y: number): Particula {
  return {x, y, tam: 1, base: 0.05, energia: 0, fase: 0};
}

describe('el polvo del cielo', () => {
  it('siembra partículas en toda la ventana, más cuanto más grande, y ninguna afuera', () => {
    const chica = sembrar(400, 300, azarConSemilla(1));
    const grande = sembrar(1600, 900, azarConSemilla(1));
    expect(chica.length).toBeGreaterThan(50);
    expect(grande.length).toBeGreaterThan(chica.length * 8);
    for (const p of grande) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(1600);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(900);
      expect(p.energia).toBe(0);
    }
    // Cubre la ventana: hay polvo en los cuatro cuadrantes.
    const cuadrantes = new Set(grande.map((p) => `${p.x < 800 ? 'i' : 'd'}${p.y < 450 ? 'a' : 'b'}`));
    expect(cuadrantes.size).toBe(4);
  });

  it('con la misma semilla siembra el mismo cielo en cada visita', () => {
    expect(sembrar(800, 600, azarConSemilla(7))).toEqual(sembrar(800, 600, azarConSemilla(7)));
    expect(sembrar(800, 600, azarConSemilla(7))).not.toEqual(sembrar(800, 600, azarConSemilla(8)));
  });

  it('una ventana sin tamaño no siembra nada', () => {
    expect(sembrar(0, 0, azarConSemilla(1))).toEqual([]);
  });

  it('el mouse que se mueve enciende las partículas cerca, más cuanto más cerca, y no toca las lejanas', () => {
    const cerca = una(100, 100);
    const medio = una(180, 100);
    const lejos = una(600, 100);
    encender([cerca, medio, lejos], {x: 100, y: 100}, 1);
    expect(cerca.energia).toBeCloseTo(1);
    expect(medio.energia).toBeGreaterThan(0);
    expect(medio.energia).toBeLessThan(cerca.energia);
    expect(lejos.energia).toBe(0);
  });

  it('si el mouse no se mueve, no enciende nada, y nunca pasa de 1', () => {
    const p = una(100, 100);
    encender([p], {x: 100, y: 100}, 0);
    expect(p.energia).toBe(0);
    for (let i = 0; i < 10; i++) encender([p], {x: 100, y: 100}, 1);
    expect(p.energia).toBeLessThanOrEqual(1);
  });

  it('se apagan solas, dejando estela, sin bajar de cero', () => {
    const p = {...una(0, 0), energia: 1};
    apagar([p], 0.3);
    expect(p.energia).toBeGreaterThan(0.5);
    expect(p.energia).toBeLessThan(1);
    apagar([p], 10);
    expect(p.energia).toBeLessThan(0.01);
    expect(p.energia).toBeGreaterThanOrEqual(0);
  });

  it('el mouse corre las partículas cercanas hacia afuera, y las lejanas no se mueven', () => {
    const derecha = empuje(una(130, 100), {x: 100, y: 100});
    expect(derecha.x).toBeGreaterThan(0);
    expect(Math.abs(derecha.y)).toBeLessThan(1e-9);
    const arriba = empuje(una(100, 60), {x: 100, y: 100});
    expect(arriba.y).toBeLessThan(0);
    expect(empuje(una(900, 900), {x: 100, y: 100})).toEqual({x: 0, y: 0});
    expect(empuje(una(130, 100), undefined)).toEqual({x: 0, y: 0});
  });
});
