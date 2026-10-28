// @vitest-environment jsdom
import {cleanup, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Fondo} from '../src/hub/Fondo.tsx';
import {PUNTERO_DIBUJADO} from '../src/hub/puntero.ts';

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

/** Un canvas 2D de mentira, y el pedido de cuadros espiado: devuelve el espía. */
function conCanvas() {
  const contexto = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
  };
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(
    contexto as unknown as CanvasRenderingContext2D,
  );
  const cuadros = vi.fn<(cuadro: FrameRequestCallback) => number>(() => 1);
  vi.stubGlobal('requestAnimationFrame', cuadros);
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  return cuadros;
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

  it('con movimiento, el polvo se anima solo, sin que nadie mueva el mouse', () => {
    movimientoReducido(false);
    const cuadros = conCanvas();
    render(<Fondo />);
    expect(cuadros).toHaveBeenCalled();
  });

  it('con movimiento reducido, el polvo se dibuja una vez y no pide cuadros', () => {
    movimientoReducido(true);
    const cuadros = conCanvas();
    render(<Fondo />);
    window.dispatchEvent(new MouseEvent('pointermove', {clientX: 200, clientY: 100}));
    expect(cuadros).not.toHaveBeenCalled();
  });

  it('sin canvas, como en jsdom, no rompe: el mouse se mueve y no pasa nada', () => {
    movimientoReducido(false);
    render(<Fondo />);
    expect(() => {
      window.dispatchEvent(new MouseEvent('pointermove', {clientX: 200, clientY: 100}));
      window.dispatchEvent(new Event('resize'));
    }).not.toThrow();
  });

  it('la flecha que arrastra el pato corre las luces y enciende el polvo, igual que el puntero', () => {
    movimientoReducido(false);
    const cuadros = conCanvas();
    const {container} = render(<Fondo />);
    const cielo = container.firstElementChild as HTMLElement;
    const paso = cuadros.mock.calls[0]?.[0];
    expect(paso).toBeDefined();

    paso?.(performance.now() + 16);
    expect(cielo.style.getPropertyValue('--px')).toBe('');

    window.dispatchEvent(new CustomEvent(PUNTERO_DIBUJADO, {detail: {x: 100, y: 100}}));
    paso?.(performance.now() + 32);
    expect(cielo.style.getPropertyValue('--px')).not.toBe('');
  });
});
