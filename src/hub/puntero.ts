/** Un punto de la ventana, en píxeles. */
export interface Punto {
  x: number;
  y: number;
}

/**
 * Cuánto tarda la luz en hacer dos tercios del camino hasta el puntero, en segundos. Le da un poco
 * de inercia, sin que se quede atrás.
 */
const TAU = 0.12;

/**
 * Un paso de la luz hacia el puntero, con suavizado exponencial: depende del tiempo y no de los
 * cuadros por segundo, nunca se pasa, y un cuadro larguísimo la deja en el puntero.
 */
export function acercar(actual: Punto, objetivo: Punto, segundos: number): Punto {
  if (segundos <= 0) return {...actual};
  const avance = 1 - Math.exp(-segundos / TAU);
  return {
    x: actual.x + (objetivo.x - actual.x) * avance,
    y: actual.y + (objetivo.y - actual.y) * avance,
  };
}

function entreMenosUnoYUno(valor: number): number {
  return Math.min(Math.max(valor, -1), 1);
}

/** Dónde está el puntero respecto del centro de la ventana: de -1 a 1 en cada eje. */
export function paralaje(punto: Punto, ancho: number, alto: number): Punto {
  if (ancho <= 0 || alto <= 0) return {x: 0, y: 0};
  return {
    x: entreMenosUnoYUno((punto.x / ancho) * 2 - 1),
    y: entreMenosUnoYUno((punto.y / alto) * 2 - 1),
  };
}

/**
 * El evento con el que el pato avisa dónde está el cursor que se lleva (ADR-0014): el cielo lo trata
 * como al puntero, así que la flecha dibujada enciende el polvo por donde pasa. El detalle es un
 * `Punto`.
 */
export const PUNTERO_DIBUJADO = 'hub:puntero-dibujado';
