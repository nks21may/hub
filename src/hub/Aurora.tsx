import {useEffect, useRef} from 'react';
import {sinMovimiento} from './movimiento.ts';
import type {Punto} from './puntero.ts';
import {acercar, paralaje} from './puntero.ts';

/** Debajo de esta distancia, en píxeles, la luz ya llegó y el paso a paso se detiene. */
const QUIETO = 0.5;

/**
 * El fondo: tres manchas de luz apagada (índigo, violeta y verde agua) que derivan lento arriba de
 * todo y se apagan hacia la grilla, con un grano fino encima para que el degradé no haga escalones.
 * El mouse las corre un poco, cada una a su profundidad, y lleva encima una luz suave por toda la
 * página. Es decorado: queda fuera del árbol de accesibilidad, y con movimiento reducido no deriva
 * ni sigue al mouse.
 */
export function Aurora() {
  const quieta = sinMovimiento();
  const aurora = useRef<HTMLDivElement>(null);
  const luz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quieta) return;
    let actual: Punto | undefined;
    let objetivo: Punto = {x: 0, y: 0};
    let cuadro = 0;
    let antes = 0;

    function pintar(punto: Punto) {
      luz.current?.style.setProperty('--cursor-x', `${punto.x}px`);
      luz.current?.style.setProperty('--cursor-y', `${punto.y}px`);
      const corrimiento = paralaje(punto, window.innerWidth, window.innerHeight);
      aurora.current?.style.setProperty('--px', corrimiento.x.toFixed(3));
      aurora.current?.style.setProperty('--py', corrimiento.y.toFixed(3));
    }

    function paso(ahora: number) {
      const desde = actual ?? objetivo;
      actual = acercar(desde, objetivo, (ahora - antes) / 1000);
      antes = ahora;
      pintar(actual);
      const falta = Math.hypot(objetivo.x - actual.x, objetivo.y - actual.y);
      cuadro = falta > QUIETO ? requestAnimationFrame(paso) : 0;
    }

    function alMover(evento: PointerEvent) {
      if (evento.pointerType === 'touch') return;
      objetivo = {x: evento.clientX, y: evento.clientY};
      if (!actual) {
        actual = objetivo;
        pintar(actual);
      }
      luz.current?.setAttribute('data-activa', 'true');
      if (!cuadro) {
        antes = performance.now();
        cuadro = requestAnimationFrame(paso);
      }
    }

    function alSalir(evento: MouseEvent) {
      if (!evento.relatedTarget) luz.current?.setAttribute('data-activa', 'false');
    }

    window.addEventListener('pointermove', alMover);
    document.addEventListener('mouseout', alSalir);
    return () => {
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('mouseout', alSalir);
      cancelAnimationFrame(cuadro);
    };
  }, [quieta]);

  return (
    <>
      <div className="aurora" ref={aurora} aria-hidden="true" data-quieta={quieta ? 'true' : 'false'}>
        <span className="aurora__mancha aurora__mancha--indigo" />
        <span className="aurora__mancha aurora__mancha--violeta" />
        <span className="aurora__mancha aurora__mancha--agua" />
        <svg className="aurora__grano">
          <filter id="grano-aurora">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grano-aurora)" />
        </svg>
      </div>
      {!quieta && <div className="aurora-luz" ref={luz} aria-hidden="true" data-activa="false" />}
    </>
  );
}
