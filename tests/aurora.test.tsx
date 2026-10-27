// @vitest-environment jsdom
import {cleanup, render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {Aurora} from '../src/hub/Aurora.tsx';

/** jsdom no trae matchMedia: la aurora lo usa para saber si tiene que quedarse quieta. */
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

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('la aurora', () => {
  it('es decorado: queda fuera del árbol de accesibilidad', () => {
    movimientoReducido(false);
    const {container} = render(<Aurora />);
    const aurora = container.firstElementChild;
    expect(aurora?.getAttribute('aria-hidden')).toBe('true');
    expect(aurora?.getAttribute('data-quieta')).toBe('false');
  });

  it('con movimiento reducido, queda quieta', () => {
    movimientoReducido(true);
    const {container} = render(<Aurora />);
    expect(container.firstElementChild?.getAttribute('data-quieta')).toBe('true');
  });

  it('tiene una luz que sigue al puntero, también fuera del árbol de accesibilidad', () => {
    movimientoReducido(false);
    const {container} = render(<Aurora />);
    const luz = container.querySelector('.aurora-luz');
    expect(luz).not.toBeNull();
    expect(luz?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('con movimiento reducido, no hay luz que siga al puntero', () => {
    movimientoReducido(true);
    const {container} = render(<Aurora />);
    expect(container.querySelector('.aurora-luz')).toBeNull();
  });
});
