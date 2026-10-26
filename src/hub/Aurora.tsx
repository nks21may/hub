import {sinMovimiento} from './movimiento.ts';

/**
 * El fondo: tres manchas de luz (índigo, violeta y verde agua) que se mueven lento arriba de todo,
 * detrás del encabezado, y se apagan hacia la grilla. Es decorado: queda fuera del árbol de
 * accesibilidad, y con movimiento reducido se queda quieta.
 */
export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true" data-quieta={sinMovimiento() ? 'true' : 'false'}>
      <span className="aurora__mancha aurora__mancha--indigo" />
      <span className="aurora__mancha aurora__mancha--violeta" />
      <span className="aurora__mancha aurora__mancha--agua" />
    </div>
  );
}
