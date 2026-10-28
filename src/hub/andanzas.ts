import type {Punto} from './puntero.ts';

/**
 * Lo que está haciendo el pato: pasea (camina o está parado), va a buscar el cursor o se lo lleva
 * en el pico.
 */
export type Fase = 'caminando' | 'parado' | 'yendo' | 'arrastrando';

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
  /**
   * Dónde está el cursor dibujado mientras es del pato: en el pico mientras se lo lleva, y donde lo
   * soltó hasta que el visitante mueve el mouse.
   */
  presa?: Punto;
  /** Desde qué momento del reloj puede volver a ir por el cursor. */
  proximoAtaque: number;
  /** Cuánto le queda al «¡CUAC!», en segundos. */
  cuac: number;
}

/**
 * Lo que el pato sabe del mundo en cada paso. Sin reloj, sin puntero o sin un mouse de verdad, el
 * pato sólo pasea.
 */
export interface Mundo {
  ancho: number;
  alto: number;
  /** Los segundos de pestaña a la vista desde que llegó el pato. */
  reloj?: number;
  /** Dónde está el puntero real, si está adentro de la ventana. */
  puntero?: Punto;
  /** En qué momento del reloj se movió el puntero por última vez. */
  quietoDesde?: number;
  /** Si hay un mouse (o algo que apunta fino y pasa por encima), con un cursor que robar. */
  fino?: boolean;
}

/** El paso de pato, en píxeles por segundo; más rápido cuando va por el cursor. */
const PASO = 60;
const CORRIDA = 200;
const ARRASTRE = 150;
/** Cuánto se queda parado al llegar, en segundos: entre el mínimo y el máximo, al azar. */
const PAUSA_MINIMA = 1;
const PAUSA_MAXIMA = 4;
/** Lo que se aparta de los bordes: a los costados, medio pato; arriba, el pato entero. */
const MARGEN_COSTADO = 40;
const MARGEN_ARRIBA = 70;
const MARGEN_ABAJO = 12;
/** Antes de esto no ataca nunca (lo pidió el usuario), en segundos de reloj. */
const PRIMER_ATAQUE = 20;
/** Lo que tiene que llevar quieto el cursor para que le interese, en segundos. */
const QUIETO = 3;
/** La chance de ir por el cursor cada vez que termina una pausa, si puede. */
const GANAS = 0.6;
/** Lo que espera después de que se le escapa, en segundos: entre el mínimo y el máximo. */
const ESPERA_MINIMA = 30;
const ESPERA_MAXIMA = 60;
/** Lo que dura el «¡CUAC!», en segundos. */
const CUAC = 1.2;
/** Dónde está la punta del pico respecto de los pies, mirando a la derecha (el dibujo de Pato.tsx). */
const PICO = {x: 29.5, y: 38};

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

/**
 * El pato a la vista: si quedó fuera de la ventana (porque se achicó), vuelve adentro de un salto;
 * si está adentro pero pegado a un borde (porque fue a buscar un cursor ahí), se queda y vuelve
 * caminando.
 */
function aLaVista(punto: Punto, mundo: Mundo): Punto {
  const afuera = punto.x < 0 || punto.x > mundo.ancho || punto.y < 0 || punto.y > mundo.alto;
  return afuera ? adentro(punto, mundo) : {x: punto.x, y: punto.y};
}

function alAzar(mundo: Mundo, azar: () => number): Punto {
  return adentro({x: azar() * mundo.ancho, y: azar() * mundo.alto}, mundo);
}

function pausaAlAzar(azar: () => number): number {
  return PAUSA_MINIMA + azar() * (PAUSA_MAXIMA - PAUSA_MINIMA);
}

/** Un pato recién llegado: en un lugar al azar de la ventana, caminando hacia otro. */
export function nacer(ancho: number, alto: number, azar: () => number): Pato {
  const mundo = {ancho, alto};
  const {x, y} = alAzar(mundo, azar);
  const destino = alAzar(mundo, azar);
  return {
    x,
    y,
    mirando: destino.x < x ? -1 : 1,
    fase: 'caminando',
    destino,
    pausa: 0,
    proximoAtaque: PRIMER_ATAQUE,
    cuac: 0,
  };
}

/** Dónde está la punta del pico, que es donde va el cursor cuando el pato lo tiene. */
export function pico(pato: Pato): Punto {
  return {x: pato.x + pato.mirando * PICO.x, y: pato.y - PICO.y};
}

/** El cursor quieto que le interesa al pato, si hay uno y si ya puede ir por él. */
function cursorQuieto(pato: Pato, mundo: Mundo): Punto | undefined {
  const {reloj = 0, puntero, quietoDesde = reloj, fino = false} = mundo;
  if (!fino || !puntero || pato.presa) return undefined;
  if (reloj < pato.proximoAtaque || reloj - quietoDesde < QUIETO) return undefined;
  return puntero;
}

/** Un punto de la otra mitad de la pantalla, adonde se lleva el cursor. */
function otraMitad(desde: Punto, mundo: Mundo, azar: () => number): Punto {
  const lado = desde.x < mundo.ancho / 2 ? 0.62 : 0.08;
  return adentro({x: mundo.ancho * (lado + azar() * 0.3), y: mundo.alto * (0.2 + azar() * 0.6)}, mundo);
}

/** Camina hacia un punto a una velocidad: devuelve dónde quedó y si llegó. */
function caminar(desde: Punto, hacia: Punto, velocidad: number, segundos: number) {
  const dx = hacia.x - desde.x;
  const dy = hacia.y - desde.y;
  const distancia = Math.hypot(dx, dy);
  const avance = velocidad * segundos;
  if (avance >= distancia) return {x: hacia.x, y: hacia.y, llego: true};
  return {x: desde.x + (dx / distancia) * avance, y: desde.y + (dy / distancia) * avance, llego: false};
}

/**
 * Un paso del pato. Pasea: camina hacia su destino, se para al llegar y, cuando se le acaba la
 * pausa, elige otro. Pasados los 20 s, cuando termina una pausa y hay un cursor quieto hace 3 s,
 * puede ir a buscarlo; si el cursor se mueve, lo deja. Cuando lo tiene en el pico se lo lleva a la
 * otra mitad de la pantalla y lo suelta ahí. Depende del tiempo y no de los cuadros, y paseando
 * nunca sale de la ventana.
 */
export function andar(pato: Pato, mundo: Mundo, segundos: number, azar: () => number): Pato {
  const cuac = Math.max(0, pato.cuac - segundos);

  if (pato.fase === 'yendo') {
    const cursor = cursorQuieto(pato, mundo);
    if (!cursor) return {...pato, fase: 'parado', destino: {x: pato.x, y: pato.y}, pausa: pausaAlAzar(azar), cuac};
    const mirando = cursor.x < pato.x ? -1 : 1;
    // Va a dejar la punta del pico sobre el cursor, del lado del que vino.
    const pies = {x: cursor.x - mirando * PICO.x, y: cursor.y + PICO.y};
    const paso = caminar(pato, pies, CORRIDA, segundos);
    if (!paso.llego) return {...pato, x: paso.x, y: paso.y, mirando, destino: pies, cuac};
    const destino = otraMitad(cursor, mundo, azar);
    return {...pato, x: paso.x, y: paso.y, mirando, fase: 'arrastrando', destino, presa: {...cursor}, cuac};
  }

  if (pato.fase === 'arrastrando') {
    // Se lo lleva mirándolo, tironeando para atrás si hace falta: el cursor no salta de lado.
    const paso = caminar(pato, pato.destino, ARRASTRE, segundos);
    const movido = {...pato, x: paso.x, y: paso.y, cuac};
    const presa = pico(movido);
    if (!paso.llego) return {...movido, presa};
    return {...movido, presa, fase: 'parado', pausa: pausaAlAzar(azar)};
  }

  const {x, y} = aLaVista(pato, mundo);
  const destino = adentro(pato.destino, mundo);

  if (pato.fase === 'parado') {
    const pausa = pato.pausa - segundos;
    if (pausa > 0) return {...pato, x, y, destino, pausa, cuac};
    const cursor = cursorQuieto(pato, mundo);
    if (cursor && azar() < GANAS) {
      return {...pato, x, y, mirando: cursor.x < x ? -1 : 1, fase: 'yendo', destino: cursor, pausa: 0, cuac};
    }
    return {...pato, x, y, fase: 'caminando', destino: alAzar(mundo, azar), pausa: 0, cuac};
  }

  const paso = caminar({x, y}, destino, PASO, segundos);
  const dx = destino.x - x;
  const mirando = dx === 0 ? pato.mirando : dx < 0 ? -1 : 1;
  if (paso.llego) return {...pato, ...destino, mirando, fase: 'parado', destino, pausa: pausaAlAzar(azar), cuac};
  return {...pato, x: paso.x, y: paso.y, mirando, destino, cuac};
}

/**
 * El cursor se le escapó: el visitante movió el mouse. El pato suelta lo que tenía, hace «¡CUAC!»
 * si tenía algo, y no vuelve a atacar por 30 a 60 s.
 */
export function escapar(pato: Pato, reloj: number, azar: () => number): Pato {
  const persiguiendo = pato.fase === 'yendo' || pato.fase === 'arrastrando';
  return {
    ...pato,
    fase: persiguiendo ? 'parado' : pato.fase,
    destino: persiguiendo ? {x: pato.x, y: pato.y} : pato.destino,
    pausa: persiguiendo ? pausaAlAzar(azar) : pato.pausa,
    presa: undefined,
    proximoAtaque: reloj + ESPERA_MINIMA + azar() * (ESPERA_MAXIMA - ESPERA_MINIMA),
    cuac: pato.presa ? CUAC : pato.cuac,
  };
}
