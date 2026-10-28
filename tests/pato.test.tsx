// @vitest-environment jsdom
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {cleanup, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Hub} from '../src/hub/Hub.tsx';
import {Pato} from '../src/hub/Pato.tsx';
import {azarConSemilla} from '../src/hub/particulas.ts';
import type {Idioma} from '../src/i18n/textos.ts';
import {TEXTOS} from '../src/i18n/textos.ts';

/**
 * jsdom no trae matchMedia: el pato lo usa para saber si tiene que quedarse afuera y si hay un mouse
 * de verdad, con un cursor que robar.
 */
function medios({reducido = false, fino = false}: {reducido?: boolean; fino?: boolean}): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((consulta: string) => ({
      matches:
        (reducido && consulta.includes('prefers-reduced-motion')) ||
        (fino && consulta.includes('pointer: fine')),
      media: consulta,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

function moverMouse(x: number, y: number): void {
  window.dispatchEvent(new MouseEvent('pointermove', {clientX: x, clientY: y}));
}

function secuestrado(): boolean {
  return document.documentElement.dataset.pato === 'secuestro';
}

/** Deja correr el reloj de a 100 ms hasta que el pato se lleva el cursor; devuelve cuánto tardó. */
function esperarSecuestro(maximo = 300_000): number {
  let pasado = 0;
  while (!secuestrado() && pasado < maximo) {
    vi.advanceTimersByTime(100);
    pasado += 100;
  }
  return pasado;
}

/** Dónde está un elemento movido con `translate(x, y)`. */
function posicion(elemento: HTMLElement): {x: number; y: number} {
  const [x = NaN, y = NaN] = (elemento.style.transform.match(/-?[\d.]+/g) ?? []).map(Number);
  return {x, y};
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
    medios({});
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
    const {container} = render(<Hub idioma="es" />);
    expect(container.querySelector('.pato')).not.toBeNull();
  });

  it('es decorado: el pato y la flecha quedan fuera del árbol de accesibilidad', () => {
    medios({});
    const {container} = render(<Pato idioma="es" azar={azarConSemilla(1)} />);
    expect(container.children.length).toBeGreaterThan(0);
    for (const hijo of container.children) expect(hijo.getAttribute('aria-hidden')).toBe('true');
  });

  it('camina solo, sin que nadie mueva el mouse', () => {
    medios({});
    const {container} = render(<Pato idioma="es" azar={azarConSemilla(1)} />);
    const pato = container.firstElementChild as HTMLElement;
    const antes = pato.style.transform;
    expect(antes).not.toBe('');
    vi.advanceTimersByTime(1000);
    expect(pato.style.transform).not.toBe(antes);
  });

  it('con movimiento reducido no hay pato', () => {
    medios({reducido: true});
    const {container} = render(<Pato idioma="es" azar={azarConSemilla(1)} />);
    expect(container.firstElementChild).toBeNull();
  });
});

describe('el secuestro del cursor', () => {
  it('pasados los 10 s se lleva el cursor quieto: el real se esconde y la flecha aparece en su lugar', () => {
    medios({fino: true});
    const {container} = render(<Pato idioma="es" azar={azarConSemilla(1)} />);
    moverMouse(500, 400);
    const tardo = esperarSecuestro();
    expect(secuestrado()).toBe(true);
    expect(tardo).toBeGreaterThanOrEqual(10_000);
    const flecha = container.querySelector<HTMLElement>('.pato-flecha');
    expect(flecha?.dataset.visible).toBe('true');
    const donde = posicion(flecha as HTMLElement);
    expect(Math.hypot(donde.x - 500, donde.y - 400)).toBeLessThan(20);
  });

  it.each<Idioma>(['es', 'en'])(
    'al mover el mouse, la flecha vuelve, el puntero reaparece y el pato hace cuac (%s)',
    (idioma) => {
      medios({fino: true});
      const {container} = render(<Pato idioma={idioma} azar={azarConSemilla(1)} />);
      moverMouse(500, 400);
      esperarSecuestro();
      vi.advanceTimersByTime(1000);
      const flecha = container.querySelector<HTMLElement>('.pato-flecha') as HTMLElement;
      expect(posicion(flecha)).not.toEqual({x: 500, y: 400});

      moverMouse(505, 402);
      const pato = container.firstElementChild as HTMLElement;
      expect(pato.dataset.cuac).toBe('true');
      expect(pato.textContent).toContain(TEXTOS[idioma]['pato.cuac']);
      expect(posicion(flecha)).toEqual({x: 505, y: 402});
      vi.advanceTimersByTime(200);
      expect(secuestrado()).toBe(false);
      expect(flecha.dataset.visible).toBe('false');
    },
  );

  it('con el dedo pasea pero no se lleva nada', () => {
    medios({fino: false});
    render(<Pato idioma="es" azar={azarConSemilla(1)} />);
    moverMouse(500, 400);
    esperarSecuestro(120_000);
    expect(secuestrado()).toBe(false);
  });

  it('al irse de la página no deja el puntero escondido', () => {
    medios({fino: true});
    const {unmount} = render(<Pato idioma="es" azar={azarConSemilla(1)} />);
    moverMouse(500, 400);
    esperarSecuestro();
    expect(secuestrado()).toBe(true);
    unmount();
    expect(secuestrado()).toBe(false);
  });

  it('el pato y la flecha no atajan ningún click: su CSS dice pointer-events: none', () => {
    // jsdom no aplica CSS, así que se lee la hoja. Vitest corre desde la raíz del repo.
    const css = readFileSync(resolve(process.cwd(), 'src/hub/pato.css'), 'utf8');
    expect(css).toMatch(/\.pato\s*\{[^}]*pointer-events:\s*none/);
    expect(css).toMatch(/\.pato-flecha\s*\{[^}]*pointer-events:\s*none/);
  });
});
