import {describe, expect, it} from 'vitest';
import {acercar, paralaje} from '../src/hub/puntero.ts';

describe('la luz que sigue al puntero', () => {
  it('sin tiempo, no se mueve', () => {
    expect(acercar({x: 10, y: 20}, {x: 500, y: 400}, 0)).toEqual({x: 10, y: 20});
  });

  it('se acerca al puntero de a poco, sin pasarse', () => {
    let luz = {x: 0, y: 0};
    const puntero = {x: 300, y: -200};
    const distancias: number[] = [];
    for (let cuadro = 0; cuadro < 30; cuadro++) {
      luz = acercar(luz, puntero, 1 / 60);
      distancias.push(Math.hypot(puntero.x - luz.x, puntero.y - luz.y));
      expect(luz.x).toBeLessThanOrEqual(puntero.x);
      expect(luz.y).toBeGreaterThanOrEqual(puntero.y);
    }
    for (let i = 1; i < distancias.length; i++) {
      expect(distancias[i]).toBeLessThan(distancias[i - 1] ?? Infinity);
    }
  });

  it('en un segundo ya llegó, casi', () => {
    let luz = {x: 0, y: 0};
    for (let cuadro = 0; cuadro < 60; cuadro++) luz = acercar(luz, {x: 100, y: 100}, 1 / 60);
    expect(luz.x).toBeGreaterThan(99);
    expect(luz.y).toBeGreaterThan(99);
  });

  it('un cuadro larguísimo, como al volver de otra pestaña, lo deja en el puntero', () => {
    expect(acercar({x: 0, y: 0}, {x: 80, y: 40}, 30)).toEqual({x: 80, y: 40});
  });
});

describe('el paralaje de la aurora', () => {
  it('con el puntero en el centro, no corre nada', () => {
    expect(paralaje({x: 500, y: 300}, 1000, 600)).toEqual({x: 0, y: 0});
  });

  it('en las puntas da ±1, y fuera de la ventana no se pasa', () => {
    expect(paralaje({x: 0, y: 0}, 1000, 600)).toEqual({x: -1, y: -1});
    expect(paralaje({x: 1000, y: 600}, 1000, 600)).toEqual({x: 1, y: 1});
    expect(paralaje({x: -400, y: 9000}, 1000, 600)).toEqual({x: -1, y: 1});
  });

  it('una ventana sin tamaño no rompe nada', () => {
    expect(paralaje({x: 10, y: 10}, 0, 0)).toEqual({x: 0, y: 0});
  });
});
