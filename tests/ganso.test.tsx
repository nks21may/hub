// @vitest-environment jsdom
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {cleanup, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Hub} from '../src/hub/Hub.tsx';
import {Ganso} from '../src/hub/Ganso.tsx';
import {azarConSemilla} from '../src/hub/particulas.ts';
import type {Idioma} from '../src/i18n/textos.ts';
import {TEXTOS} from '../src/i18n/textos.ts';

/**
 * jsdom no trae matchMedia: el ganso lo usa para saber si tiene que quedarse afuera y si hay un mouse
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
  return document.documentElement.dataset.ganso === 'secuestro';
}

/** Deja correr el reloj de a 100 ms hasta que el ganso se lleva el cursor; devuelve cuánto tardó. */
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

/** Un Web Audio de mentira: cuenta los contextos que se crean y los osciladores que arrancan. */
function conAudio(): {contextos: number; osciladores: number} {
  const registro = {contextos: 0, osciladores: 0};
  const parametro = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  });
  const nodo = () => ({connect: vi.fn((destino: unknown) => destino), disconnect: vi.fn()});
  class ContextoDeMentira {
    state = 'running';
    currentTime = 0;
    destination = nodo();
    constructor() {
      registro.contextos++;
    }
    resume() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
    createOscillator() {
      return {...nodo(), type: 'sine', frequency: parametro(), start: () => registro.osciladores++, stop: vi.fn()};
    }
    createGain() {
      return {...nodo(), gain: parametro()};
    }
    createBiquadFilter() {
      return {...nodo(), type: 'lowpass', frequency: parametro(), Q: parametro(), gain: parametro()};
    }
  }
  vi.stubGlobal('AudioContext', ContextoDeMentira);
  return registro;
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

describe('el ganso del hub', () => {
  it('está desde que carga el hub, aunque el catálogo todavía no haya llegado', () => {
    medios({});
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
    const {container} = render(<Hub idioma="es" />);
    expect(container.querySelector('.ganso')).not.toBeNull();
  });

  it('es decorado: el ganso y la flecha quedan fuera del árbol de accesibilidad', () => {
    medios({});
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    expect(container.children.length).toBeGreaterThan(0);
    for (const hijo of container.children) expect(hijo.getAttribute('aria-hidden')).toBe('true');
  });

  it('camina solo, sin que nadie mueva el mouse', () => {
    medios({});
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    const ganso = container.firstElementChild as HTMLElement;
    const antes = ganso.style.transform;
    expect(antes).not.toBe('');
    vi.advanceTimersByTime(1000);
    expect(ganso.style.transform).not.toBe(antes);
  });

  it('con movimiento reducido no hay ganso', () => {
    medios({reducido: true});
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    expect(container.firstElementChild).toBeNull();
  });

  it.each([
    ['es', '¡JONK!'],
    ['en', 'HONK!'],
  ] as const)('el cartelito grazna en su idioma (%s): %s', (idioma, graznido) => {
    medios({});
    const {container} = render(<Ganso idioma={idioma} azar={azarConSemilla(1)} />);
    expect(container.firstElementChild?.textContent).toContain(graznido);
  });
});

describe('el secuestro del cursor', () => {
  it('pasados los 10 s se lleva el cursor quieto: el real se esconde y la flecha aparece en su lugar', () => {
    medios({fino: true});
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    moverMouse(500, 400);
    const tardo = esperarSecuestro();
    expect(secuestrado()).toBe(true);
    expect(tardo).toBeGreaterThanOrEqual(10_000);
    const flecha = container.querySelector<HTMLElement>('.ganso-flecha');
    expect(flecha?.dataset.visible).toBe('true');
    const donde = posicion(flecha as HTMLElement);
    expect(Math.hypot(donde.x - 500, donde.y - 400)).toBeLessThan(20);
  });

  it.each<Idioma>(['es', 'en'])(
    'al mover el mouse, la flecha vuelve, el puntero reaparece y el ganso grazna (%s)',
    (idioma) => {
      medios({fino: true});
      const {container} = render(<Ganso idioma={idioma} azar={azarConSemilla(1)} />);
      moverMouse(500, 400);
      esperarSecuestro();
      vi.advanceTimersByTime(1000);
      const flecha = container.querySelector<HTMLElement>('.ganso-flecha') as HTMLElement;
      expect(posicion(flecha)).not.toEqual({x: 500, y: 400});

      moverMouse(505, 402);
      const ganso = container.firstElementChild as HTMLElement;
      expect(ganso.dataset.graznido).toBe('true');
      expect(ganso.textContent).toContain(TEXTOS[idioma]['ganso.graznido']);
      expect(posicion(flecha)).toEqual({x: 505, y: 402});
      vi.advanceTimersByTime(200);
      expect(secuestrado()).toBe(false);
      expect(flecha.dataset.visible).toBe('false');
    },
  );

  it('con el dedo pasea pero no se lleva nada', () => {
    medios({fino: false});
    render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    moverMouse(500, 400);
    esperarSecuestro(120_000);
    expect(secuestrado()).toBe(false);
  });

  it('al irse de la página no deja el puntero escondido', () => {
    medios({fino: true});
    const {unmount} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    moverMouse(500, 400);
    esperarSecuestro();
    expect(secuestrado()).toBe(true);
    unmount();
    expect(secuestrado()).toBe(false);
  });

  it('el ganso y la flecha no atajan ningún click: su CSS dice pointer-events: none', () => {
    // jsdom no aplica CSS, así que se lee la hoja. Vitest corre desde la raíz del repo.
    const css = readFileSync(resolve(process.cwd(), 'src/hub/ganso.css'), 'utf8');
    expect(css).toMatch(/\.ganso\s*\{[^}]*pointer-events:\s*none/);
    expect(css).toMatch(/\.ganso-flecha\s*\{[^}]*pointer-events:\s*none/);
  });
});

describe('el graznido con sonido', () => {
  it('antes de un click o una tecla no hay sonido, pero el cartelito del graznido sale igual', () => {
    medios({});
    const audio = conAudio();
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    const ganso = container.firstElementChild as HTMLElement;
    let cartelito = false;
    for (let pasado = 0; pasado < 60_000; pasado += 100) {
      vi.advanceTimersByTime(100);
      cartelito ||= ganso.dataset.graznido === 'true';
    }
    expect(cartelito).toBe(true);
    expect(audio.contextos).toBe(0);
  });

  it.each([
    ['un click', () => window.dispatchEvent(new MouseEvent('pointerdown'))],
    ['una tecla', () => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}))],
  ])('después de %s en la página, cada graznido suena', (_gesto, tocar) => {
    medios({});
    const audio = conAudio();
    render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    tocar();
    vi.advanceTimersByTime(60_000);
    expect(audio.contextos).toBe(1);
    expect(audio.osciladores).toBeGreaterThan(0);
  });

  it('sin Web Audio, como en jsdom, el graznido no rompe nada', () => {
    medios({});
    render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    expect(() => {
      window.dispatchEvent(new MouseEvent('pointerdown'));
      vi.advanceTimersByTime(60_000);
    }).not.toThrow();
  });
});

/** El ganso queda en una caja de 64×64 con la esquina en (100, 100): jsdom no mide nada. */
function gansoEn100(): void {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 100, y: 100, left: 100, top: 100, right: 164, bottom: 164, width: 64, height: 64, toJSON: () => ({}),
  } as DOMRect);
}

describe('el click en el ganso', () => {
  it('un click sobre el ganso lo hace graznar, y suena en ese mismo click', () => {
    medios({});
    const audio = conAudio();
    gansoEn100();
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    const ganso = container.firstElementChild as HTMLElement;
    expect(ganso.dataset.graznido).toBe('false');
    window.dispatchEvent(new MouseEvent('pointerdown', {clientX: 130, clientY: 140}));
    expect(ganso.dataset.graznido).toBe('true');
    expect(audio.osciladores).toBeGreaterThan(0);
  });

  it('un click lejos del ganso no lo hace graznar', () => {
    medios({});
    const audio = conAudio();
    gansoEn100();
    const {container} = render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    window.dispatchEvent(new MouseEvent('pointerdown', {clientX: 600, clientY: 600}));
    expect((container.firstElementChild as HTMLElement).dataset.graznido).toBe('false');
    expect(audio.osciladores).toBe(0);
  });

  it('el click sobre el ganso no se cancela: llega a lo que está debajo', () => {
    medios({});
    conAudio();
    gansoEn100();
    render(<Ganso idioma="es" azar={azarConSemilla(1)} />);
    const debajo = vi.fn();
    document.addEventListener('pointerdown', debajo);
    const click = new MouseEvent('pointerdown', {bubbles: true, cancelable: true, clientX: 130, clientY: 140});
    document.body.dispatchEvent(click);
    document.removeEventListener('pointerdown', debajo);
    expect(debajo).toHaveBeenCalled();
    expect(click.defaultPrevented).toBe(false);
  });
});

/** Cuánto dura la animación de una pata en una fase, leyendo el CSS del ganso; undefined si no hay. */
function pasoDeLaPata(css: string, fase: string, pata: 'atras' | 'adelante'): number | undefined {
  const selector = `.ganso[data-fase='${fase}'] .ganso__pata--${pata}`;
  for (const regla of css.replace(/\/\*[\s\S]*?\*\//g, '').split('}')) {
    const [selectores = '', cuerpo = ''] = regla.split('{');
    if (!selectores.split(',').some((s) => s.trim() === selector)) continue;
    const duracion = /animation:\s*\S+\s+([\d.]+)s/.exec(cuerpo)?.[1];
    if (duracion) return Number(duracion);
  }
  return undefined;
}

describe('las patas del ganso', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/hub/ganso.css'), 'utf8');

  it.each(['caminando', 'yendo', 'arrastrando'])('se mueven las dos cuando está %s', (fase) => {
    expect(pasoDeLaPata(css, fase, 'atras')).toBeGreaterThan(0);
    expect(pasoDeLaPata(css, fase, 'adelante')).toBeGreaterThan(0);
  });

  it('corriendo a buscar el cursor, van más rápido que caminando', () => {
    expect(pasoDeLaPata(css, 'yendo', 'atras')).toBeLessThan(pasoDeLaPata(css, 'caminando', 'atras') ?? 0);
  });

  it('parado, no se mueven', () => {
    expect(pasoDeLaPata(css, 'parado', 'atras')).toBeUndefined();
  });
});
