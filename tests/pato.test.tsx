// @vitest-environment jsdom
import {cleanup, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Hub} from '../src/hub/Hub.tsx';
import {Pato} from '../src/hub/Pato.tsx';
import {azarConSemilla} from '../src/hub/particulas.ts';

/** jsdom no trae matchMedia: el pato lo usa para saber si tiene que quedarse afuera. */
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

beforeEach(() => {
  // El reloj de mentira: los cuadros y `performance.now` avanzan cuando el test lo dice.
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
  });
  // jsdom no trae canvas: sin esto, el polvo del cielo avisa «Not implemented» en cada render.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('el pato del hub', () => {
  it('está desde que carga el hub, aunque el catálogo todavía no haya llegado', () => {
    movimientoReducido(false);
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
    const {container} = render(<Hub idioma="es" />);
    expect(container.querySelector('.pato')).not.toBeNull();
  });

  it('es decorado: queda fuera del árbol de accesibilidad', () => {
    movimientoReducido(false);
    const {container} = render(<Pato azar={azarConSemilla(1)} />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('camina solo, sin que nadie mueva el mouse', () => {
    movimientoReducido(false);
    const {container} = render(<Pato azar={azarConSemilla(1)} />);
    const pato = container.firstElementChild as HTMLElement;
    const antes = pato.style.transform;
    expect(antes).not.toBe('');
    vi.advanceTimersByTime(1000);
    expect(pato.style.transform).not.toBe(antes);
  });

  it('con movimiento reducido no hay pato', () => {
    movimientoReducido(true);
    const {container} = render(<Pato azar={azarConSemilla(1)} />);
    expect(container.firstElementChild).toBeNull();
  });
});
