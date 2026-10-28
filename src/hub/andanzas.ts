import type {Punto} from './puntero.ts';

/** Lo que está haciendo el pato. */
export type Fase = 'caminando' | 'parado';

/**
 * El pato que pasea por el hub (ADR-0014). La posición es la de sus pies, en píxeles de la ventana,
 * y no cambia al darse vuelta: el dibujo se espeja alrededor de ese punto.
 */
export interface Pato {
  x: number;
  y: number;
  /** Para dónde mira: 1 a la derecha, -1 a la izquierda. */
  mirando: 1 | -1;
  fase: Fase;
  /** Adónde camina, o donde se paró. */
  destino: Punto;
  /** Cuánto le queda parado, en segundos. */
  pausa: number;
}

/** Lo que el pato sabe del mundo en cada paso. */
export interface Mundo {
  ancho: number;
  alto: number;
}

/** El paso de pato, en píxeles por segundo. */
const PASO = 60;
/** Cuánto se queda parado al llegar, en segundos: entre el mínimo y el máximo, al azar. */
const PAUSA_MINIMA = 1;
const PAUSA_MAXIMA = 4;
/** Lo que se aparta de los bordes: a los costados, medio pato; arriba, el pato entero. */
const MARGEN_COSTADO = 40;
const MARGEN_ARRIBA = 70;
const MARGEN_ABAJO = 12;

function entre(valor: number, minimo: number, maximo: number): number {
  // Una ventana más chica que los márgenes deja al pato en el medio.
  if (minimo > maximo) return (minimo + maximo) / 2;
  return Math.min(Math.max(valor, minimo), maximo);
}

/** El punto más cercano adentro de la ventana, con los márgenes del pato. */
function adentro(punto: Punto, mundo: Mundo): Punto {
  return {
    x: entre(punto.x, MARGEN_COSTADO, mundo.ancho - MARGEN_COSTADO),
    y: entre(punto.y, MARGEN_ARRIBA, mundo.alto - MARGEN_ABAJO),
  };
}

function alAzar(mundo: Mundo, azar: () => number): Punto {
  return adentro({x: azar() * mundo.ancho, y: azar() * mundo.alto}, mundo);
}

/** Un pato recién llegado: en un lugar al azar de la ventana, caminando hacia otro. */
export function nacer(ancho: number, alto: number, azar: () => number): Pato {
  const mundo = {ancho, alto};
  const {x, y} = alAzar(mundo, azar);
  const destino = alAzar(mundo, azar);
  return {x, y, mirando: destino.x < x ? -1 : 1, fase: 'caminando', destino, pausa: 0};
}

/**
 * Un paso del pato: camina hacia su destino, se para al llegar y, cuando se le acaba la pausa,
 * elige otro. Depende del tiempo y no de los cuadros, y nunca deja al pato fuera de la ventana.
 */
export function andar(pato: Pato, mundo: Mundo, segundos: number, azar: () => number): Pato {
  const {x, y} = adentro(pato, mundo);
  const destino = adentro(pato.destino, mundo);

  if (pato.fase === 'parado') {
    const pausa = pato.pausa - segundos;
    if (pausa > 0) return {...pato, x, y, destino, pausa};
    const nuevo = alAzar(mundo, azar);
    return {...pato, x, y, fase: 'caminando', destino: nuevo, pausa: 0};
  }

  const dx = destino.x - x;
  const dy = destino.y - y;
  const distancia = Math.hypot(dx, dy);
  const mirando = dx === 0 ? pato.mirando : dx < 0 ? -1 : 1;
  const avance = PASO * segundos;
  if (avance >= distancia) {
    const pausa = PAUSA_MINIMA + azar() * (PAUSA_MAXIMA - PAUSA_MINIMA);
    return {...pato, ...destino, mirando, fase: 'parado', destino, pausa};
  }
  return {
    ...pato,
    x: x + (dx / distancia) * avance,
    y: y + (dy / distancia) * avance,
    mirando,
    destino,
  };
}
