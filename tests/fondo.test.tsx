// @vitest-environment jsdom
import {cleanup, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Fondo} from '../src/hub/Fondo.tsx';

/** jsdom no trae matchMedia: el cielo lo usa para saber si tiene que quedarse quieto. */
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

// jsdom no trae canvas: getContext devuelve null, como en un navegador sin 2D.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('el cielo del fondo', () => {
  it('es decorado: el cielo, sus luces y el polvo quedan fuera del árbol de accesibilidad', () => {
    movimientoReducido(false);
    const {container} = render(<Fondo />);
    const cielo = container.firstElementChild;
    expect(cielo?.getAttribute('aria-hidden')).toBe('true');
    expect(cielo?.getAttribute('data-quieto')).toBe('false');
    expect(cielo?.querySelector('canvas')).not.toBeNull();
  });

  it('con movimiento reducido, queda quieto', () => {
    movimientoReducido(true);
    const {container} = render(<Fondo />);
    expect(container.firstElementChild?.getAttribute('data-quieto')).toBe('true');
  });

  it('sin canvas, como en jsdom, no rompe: el mouse se mueve y no pasa nada', () => {
    movimientoReducido(false);
    render(<Fondo />);
    expect(() => {
      window.dispatchEvent(new MouseEvent('pointermove', {clientX: 200, clientY: 100}));
      window.dispatchEvent(new Event('resize'));
    }).not.toThrow();
  });
});
