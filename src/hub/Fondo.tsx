import {useEffect, useRef} from 'react';
import {sinMovimiento} from './movimiento.ts';
import type {Particula} from './particulas.ts';
import {apagar, azarConSemilla, empuje, encender, sembrar} from './particulas.ts';
import type {Punto} from './puntero.ts';
import {acercar, paralaje} from './puntero.ts';

/** La semilla del polvo: el mismo cielo en cada visita. */
const SEMILLA = 2026;
/** Cuánto tiene que moverse el mouse en un cuadro, en píxeles, para encender del todo. */
const MOVIMIENTO_PLENO = 6;
/** Cuánto sigue el paso a paso después del último movimiento, en milisegundos. */
const INERCIA_MS = 400;

/**
 * El cielo del fondo (ADR-0012): un navy casi negro con luces grandes de azul y de índigo que
 * derivan lento, un grano fino y un polvo de motas que se encienden por donde pasa el mouse, dejan
 * estela y se apagan solas. Es decorado: queda fuera del árbol de accesibilidad. Con movimiento
 * reducido, o con el dedo, el polvo se ve tenue y quieto.
 */
export function Fondo() {
  const quieto = sinMovimiento();
  const cielo = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const contexto = canvas?.getContext('2d');
    if (!canvas || !contexto) return;

    let particulas: Particula[] = [];
    let ancho = 0;
    let alto = 0;
    let escala = 1;
    let color = '';
    let cursor: Punto | undefined;
    let suave: Punto | undefined;
    let ultimoMovimiento = 0;
    let cuadro = 0;
    let antes = 0;

    function dibujar(ahora: number) {
      if (!contexto) return;
      contexto.setTransform(escala, 0, 0, escala, 0, 0);
      contexto.clearRect(0, 0, ancho, alto);
      contexto.fillStyle = color;
      const titila = cuadro !== 0;
      for (const p of particulas) {
        const base = titila ? p.base * (0.75 + 0.25 * Math.sin(p.fase + ahora / 700)) : p.base;
        const alfa = Math.min(1, base + p.energia);
        if (alfa < 0.01) continue;
        const corrido = empuje(p, suave);
        const radio = p.tam * (1 + p.energia);
        const x = p.x + corrido.x;
        const y = p.y + corrido.y;
        // Una mota encendida lleva un halo tenue: se lee como polvo con luz, no como un punto duro.
        if (p.energia > 0.25) {
          contexto.globalAlpha = p.energia * 0.08;
          contexto.beginPath();
          contexto.arc(x, y, radio * 2.6, 0, Math.PI * 2);
          contexto.fill();
        }
        contexto.globalAlpha = alfa;
        contexto.beginPath();
        contexto.arc(x, y, radio, 0, Math.PI * 2);
        contexto.fill();
      }
      contexto.globalAlpha = 1;
    }

    function medir() {
      if (!canvas) return;
      // La caja del canvas y no la ventana: la ventana incluye la barra de scroll.
      const caja = canvas.getBoundingClientRect();
      escala = Math.min(window.devicePixelRatio || 1, 2);
      ancho = caja.width;
      alto = caja.height;
      canvas.width = Math.round(ancho * escala);
      canvas.height = Math.round(alto * escala);
      // El color sale del token --particula, que el CSS le pone al canvas.
      color = getComputedStyle(canvas).color;
      particulas = sembrar(ancho, alto, azarConSemilla(SEMILLA));
      dibujar(performance.now());
    }

    function paso(ahora: number) {
      const segundos = Math.min((ahora - antes) / 1000, 0.1);
      antes = ahora;
      if (cursor) {
        const previo = suave ?? cursor;
        suave = acercar(previo, cursor, segundos);
        const movido = Math.hypot(suave.x - previo.x, suave.y - previo.y);
        encender(particulas, suave, Math.min(1, movido / MOVIMIENTO_PLENO));
        const corrimiento = paralaje(suave, ancho, alto);
        cielo.current?.style.setProperty('--px', corrimiento.x.toFixed(3));
        cielo.current?.style.setProperty('--py', corrimiento.y.toFixed(3));
      }
      apagar(particulas, segundos);
      const encendidas = particulas.some((p) => p.energia > 0);
      const moviendose = ahora - ultimoMovimiento < INERCIA_MS;
      cuadro = encendidas || moviendose ? requestAnimationFrame(paso) : 0;
      dibujar(ahora);
    }

    function alMover(evento: PointerEvent) {
      if (evento.pointerType === 'touch') return;
      cursor = {x: evento.clientX, y: evento.clientY};
      ultimoMovimiento = performance.now();
      if (!cuadro) {
        antes = ultimoMovimiento;
        cuadro = requestAnimationFrame(paso);
      }
    }

    function alSalir(evento: MouseEvent) {
      if (evento.relatedTarget) return;
      cursor = undefined;
      suave = undefined;
    }

    medir();
    window.addEventListener('resize', medir);
    if (!quieto) {
      window.addEventListener('pointermove', alMover);
      document.addEventListener('mouseout', alSalir);
    }
    return () => {
      window.removeEventListener('resize', medir);
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('mouseout', alSalir);
      cancelAnimationFrame(cuadro);
    };
  }, [quieto]);

  return (
    <div className="cielo" ref={cielo} aria-hidden="true" data-quieto={quieto ? 'true' : 'false'}>
      <span className="cielo__luz cielo__luz--azul" />
      <span className="cielo__luz cielo__luz--indigo" />
      <span className="cielo__luz cielo__luz--claro" />
      <canvas className="cielo__polvo" ref={lienzo} />
      <svg className="cielo__grano">
        <filter id="grano-cielo">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grano-cielo)" />
      </svg>
    </div>
  );
}
