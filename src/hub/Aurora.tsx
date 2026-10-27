import {sinMovimiento} from './movimiento.ts';

/**
 * El fondo: tres manchas de luz (índigo, violeta y verde agua) que se mueven lento arriba de todo,
 * detrás del encabezado, y se apagan hacia la grilla, con un grano fino encima para que el degradé
 * no haga escalones. Es decorado: queda fuera del árbol de accesibilidad, y con movimiento reducido
 * se queda quieta.
 */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true" data-quieta={sinMovimiento() ? 'true' : 'false'}>
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
  );
}
