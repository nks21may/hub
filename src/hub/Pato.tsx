import {useEffect, useRef} from 'react';
import type {Pato as ElPato} from './andanzas.ts';
import {andar, nacer} from './andanzas.ts';
import {sinMovimiento} from './movimiento.ts';
import './pato.css';

/** El tamaño de la ventana, sin la barra de scroll. jsdom no mide el documento: ahí va la ventana. */
function medirVentana(): {ancho: number; alto: number} {
  const raiz = document.documentElement;
  return {ancho: raiz.clientWidth || window.innerWidth, alto: raiz.clientHeight || window.innerHeight};
}

interface Props {
  /** De dónde salen las decisiones del pato. Los tests le pasan una semilla. */
  azar?: () => number;
}

/**
 * El pato que pasea por encima del hub (ADR-0014): un SVG fijo a la ventana que camina a un punto al
 * azar, se para un rato y vuelve a caminar. Es decorado: queda fuera del árbol de accesibilidad y no
 * ataja ningún click. Con movimiento reducido no hay pato.
 */
export function Pato({azar = Math.random}: Props) {
  const quieto = sinMovimiento();
  const cuerpo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = cuerpo.current;
    if (quieto || !elemento) return;

    const ventana = medirVentana();
    let pato: ElPato = nacer(ventana.ancho, ventana.alto, azar);
    let antes = performance.now();
    let cuadro = 0;

    function pintar() {
      if (!elemento) return;
      elemento.style.transform = `translate(${pato.x.toFixed(1)}px, ${pato.y.toFixed(1)}px)`;
      elemento.dataset.fase = pato.fase;
      elemento.dataset.mirando = String(pato.mirando);
    }

    function paso(ahora: number) {
      // Un cuadro larguísimo (la pestaña que vuelve) cuenta como uno corto: el pato no se teletransporta.
      const segundos = Math.min(Math.max((ahora - antes) / 1000, 0), 0.1);
      antes = ahora;
      pato = andar(pato, medirVentana(), segundos, azar);
      pintar();
      cuadro = requestAnimationFrame(paso);
    }

    pintar();
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [quieto, azar]);

  if (quieto) return null;
  return (
    <div className="pato" ref={cuerpo} aria-hidden="true">
      <svg className="pato__dibujo" viewBox="0 0 64 56" width="64" height="56">
        <g className="pato__pata pato__pata--atras">
          <path className="pato__pierna" d="M27.5 46 L27 53" />
          <path className="pato__pie" d="M25.5 52.6 C28.5 52.6 31.6 53.4 33.6 55.2 L33.6 56 H25 Z" />
        </g>
        <g className="pato__cuerpo">
          <path
            className="pato__pluma"
            d="M4 23 C9 26 15 28.5 21 29 C27 29.5 33 28 36 25.5 C37.6 23.5 37 21.5 36.8 18.5 C36.8 12.5 41 8 45.5 8 C50 8 53.5 11.5 53.8 15.5 C54 19.5 51.5 21.5 50.5 23.5 C49.5 26 52.5 29 51.5 35 C50.5 43 42 48.5 30 48.5 C19 48.5 11.5 44 9.5 37 C8 32 6 27.5 4 23 Z"
          />
          <path
            className="pato__ala"
            d="M17 34 C23.5 29.5 34 30 41 34.5 C36 42 24.5 43 17 34 Z"
          />
          <path
            className="pato__pico"
            d="M52.5 13.8 C57 13.3 61 14.5 62.8 17.4 C63.3 18.3 62.7 19.4 61.6 19.7 C58.4 20.6 55 21 52.5 20.6 Z"
          />
          <circle className="pato__ojo" cx="48" cy="13.5" r="1.5" />
        </g>
        <g className="pato__pata pato__pata--adelante">
          <path className="pato__pierna" d="M35.5 46 L36 53" />
          <path className="pato__pie" d="M34.5 52.6 C37.5 52.6 40.6 53.4 42.6 55.2 L42.6 56 H34 Z" />
        </g>
      </svg>
    </div>
  );
}
