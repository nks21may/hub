import type {Punto} from './puntero.ts';

/**
 * Lo que está haciendo el ganso: pasea (camina o está parado), va a buscar el cursor o se lo lleva
 * en el pico.
 */
export type Fase = 'caminando' | 'parado' | 'yendo' | 'arrastrando';

/**
 * El ganso que pasea por el hub (ADR-0014). La posición es la de sus pies, en píxeles de la ventana,
 * y no cambia al darse vuelta: el dibujo se espeja alrededor de ese punto.
 */
export interface Ganso {
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
   * Dónde está el cursor dibujado mientras es del ganso: en el pico mientras se lo lleva, y donde lo
   * soltó hasta que el visitante mueve el mouse.
   */
  presa?: Punto;
  /** Desde qué momento del reloj puede volver a ir por el cursor. */
  proximoAtaque: number;
  /** Cuánto le queda al «¡JONK!», en segundos. */
  graznido: number;
  /** Cuántos graznidos hizo: cada uno es un cartelito y, si el navegador deja, un sonido (ADR-0015). */
  graznidos: number;
  /** En qué momento del reloj hace el próximo graznido, aunque nadie lo moleste. */
  proximoGraznido: number;
}

/**
 * Lo que el ganso sabe del mundo en cada paso. Sin reloj, sin puntero o sin un mouse de verdad, el
 * ganso sólo pasea.
 */
export interface Mundo {
  ancho: number;
  alto: number;
  /** Los segundos de pestaña a la vista desde que llegó el ganso. */
  reloj?: number;
  /** Dónde está el puntero real, si está adentro de la ventana. */
  puntero?: Punto;
  /** En qué momento del reloj se movió el puntero por última vez. */
  quietoDesde?: number;
  /** Si hay un mouse (o algo que apunta fino y pasa por encima), con un cursor que robar. */
  fino?: boolean;
}

/** El paso de ganso, en píxeles por segundo; más rápido cuando va por el cursor. */
const PASO = 60;
const CORRIDA = 200;
const ARRASTRE = 150;
/** Cuánto se queda parado al llegar, en segundos: entre el mínimo y el máximo, al azar. */
const PAUSA_MINIMA = 1;
const PAUSA_MAXIMA = 4;
/** Lo que se aparta de los bordes: a los costados, medio ganso; arriba, el ganso entero. */
const MARGEN_COSTADO = 40;
const MARGEN_ARRIBA = 70;
const MARGEN_ABAJO = 12;
/** Antes de esto no ataca nunca (lo pidió el usuario, ADR-0015), en segundos de reloj. */
const PRIMER_ATAQUE = 10;
/** Lo que tiene que llevar quieto el cursor para que le interese, en segundos. */
const QUIETO = 3;
/** La chance de ir por el cursor cada vez que termina una pausa, si puede. */
const GANAS = 0.6;
/** Lo que espera después de que se le escapa, en segundos: entre el mínimo y el máximo. */
const ESPERA_MINIMA = 30;
const ESPERA_MAXIMA = 60;
/** Lo que dura el «¡JONK!», en segundos. */
const GRAZNIDO = 1.2;
/** Cuándo hace el primer graznido solo, y cada cuánto los siguientes, en segundos (ADR-0015). */
const PRIMER_GRAZNIDO_MINIMO = 8;
const PRIMER_GRAZNIDO_MAXIMO = 20;
const GRAZNIDO_CADA_MINIMO = 20;
const GRAZNIDO_CADA_MAXIMO = 45;
/** Dónde está la punta del pico respecto de los pies, mirando a la derecha (el dibujo de Ganso.tsx). */
const PICO = {x: 30.5, y: 51.5};

function entre(valor: number, minimo: number, maximo: number): number {
  // Una ventana más chica que los márgenes deja al ganso en el medio.
  if (minimo > maximo) return (minimo + maximo) / 2;
  return Math.min(Math.max(valor, minimo), maximo);
}

/** El punto más cercano adentro de la ventana, con los márgenes del ganso. */
function adentro(punto: Punto, mundo: Mundo): Punto {
  return {
    x: entre(punto.x, MARGEN_COSTADO, mundo.ancho - MARGEN_COSTADO),
    y: entre(punto.y, MARGEN_ARRIBA, mundo.alto - MARGEN_ABAJO),
  };
}

/**
 * El ganso a la vista: si quedó fuera de la ventana (porque se achicó), vuelve adentro de un salto;
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

/** Un ganso recién llegado: en un lugar al azar de la ventana, caminando hacia otro. */
export function nacer(ancho: number, alto: number, azar: () => number): Ganso {
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
    graznido: 0,
    graznidos: 0,
    proximoGraznido: PRIMER_GRAZNIDO_MINIMO + azar() * (PRIMER_GRAZNIDO_MAXIMO - PRIMER_GRAZNIDO_MINIMO),
  };
}

/** Dónde está la punta del pico, que es donde va el cursor cuando el ganso lo tiene. */
export function pico(ganso: Ganso): Punto {
  return {x: ganso.x + ganso.mirando * PICO.x, y: ganso.y - PICO.y};
}

/** El cursor quieto que le interesa al ganso, si hay uno y si ya puede ir por él. */
function cursorQuieto(ganso: Ganso, mundo: Mundo): Punto | undefined {
  const {reloj = 0, puntero, quietoDesde = reloj, fino = false} = mundo;
  if (!fino || !puntero || ganso.presa) return undefined;
  if (reloj < ganso.proximoAtaque || reloj - quietoDesde < QUIETO) return undefined;
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
 * Un paso del ganso: se mueve y, si le toca, grazna. El primer graznido es entre los 8 y los 20 s de
 * reloj, y después cada 20 a 45 s, haga lo que haga.
 */
export function andar(ganso: Ganso, mundo: Mundo, segundos: number, azar: () => number): Ganso {
  const movido = moverse(ganso, mundo, segundos, azar);
  const reloj = mundo.reloj;
  if (reloj === undefined || reloj < movido.proximoGraznido) return movido;
  return {
    ...movido,
    graznido: GRAZNIDO,
    graznidos: movido.graznidos + 1,
    proximoGraznido: reloj + GRAZNIDO_CADA_MINIMO + azar() * (GRAZNIDO_CADA_MAXIMO - GRAZNIDO_CADA_MINIMO),
  };
}

/**
 * Cómo se mueve el ganso en un paso. Pasea: camina hacia su destino, se para al llegar y, cuando
 * se le acaba la pausa, elige otro. Pasados los 10 s, cuando termina una pausa y hay un cursor quieto hace 3 s,
 * puede ir a buscarlo; si el cursor se mueve, lo deja. Cuando lo tiene en el pico se lo lleva a la
 * otra mitad de la pantalla y lo suelta ahí. Depende del tiempo y no de los cuadros, y paseando
 * nunca sale de la ventana.
 */
function moverse(ganso: Ganso, mundo: Mundo, segundos: number, azar: () => number): Ganso {
  const graznido = Math.max(0, ganso.graznido - segundos);

  if (ganso.fase === 'yendo') {
    const cursor = cursorQuieto(ganso, mundo);
    if (!cursor) return {...ganso, fase: 'parado', destino: {x: ganso.x, y: ganso.y}, pausa: pausaAlAzar(azar), graznido};
    const mirando = cursor.x < ganso.x ? -1 : 1;
    // Va a dejar la punta del pico sobre el cursor, del lado del que vino.
    const pies = {x: cursor.x - mirando * PICO.x, y: cursor.y + PICO.y};
    const paso = caminar(ganso, pies, CORRIDA, segundos);
    if (!paso.llego) return {...ganso, x: paso.x, y: paso.y, mirando, destino: pies, graznido};
    const destino = otraMitad(cursor, mundo, azar);
    return {...ganso, x: paso.x, y: paso.y, mirando, fase: 'arrastrando', destino, presa: {...cursor}, graznido};
  }

  if (ganso.fase === 'arrastrando') {
    // Se lo lleva mirándolo, tironeando para atrás si hace falta: el cursor no salta de lado.
    const paso = caminar(ganso, ganso.destino, ARRASTRE, segundos);
    const movido = {...ganso, x: paso.x, y: paso.y, graznido};
    const presa = pico(movido);
    if (!paso.llego) return {...movido, presa};
    return {...movido, presa, fase: 'parado', pausa: pausaAlAzar(azar)};
  }

  const {x, y} = aLaVista(ganso, mundo);
  const destino = adentro(ganso.destino, mundo);

  if (ganso.fase === 'parado') {
    const pausa = ganso.pausa - segundos;
    if (pausa > 0) return {...ganso, x, y, destino, pausa, graznido};
    const cursor = cursorQuieto(ganso, mundo);
    if (cursor && azar() < GANAS) {
      return {...ganso, x, y, mirando: cursor.x < x ? -1 : 1, fase: 'yendo', destino: cursor, pausa: 0, graznido};
    }
    return {...ganso, x, y, fase: 'caminando', destino: alAzar(mundo, azar), pausa: 0, graznido};
  }

  const paso = caminar({x, y}, destino, PASO, segundos);
  const dx = destino.x - x;
  const mirando = dx === 0 ? ganso.mirando : dx < 0 ? -1 : 1;
  if (paso.llego) return {...ganso, ...destino, mirando, fase: 'parado', destino, pausa: pausaAlAzar(azar), graznido};
  return {...ganso, x: paso.x, y: paso.y, mirando, destino, graznido};
}

/**
 * El cursor se le escapó: el visitante movió el mouse. El ganso suelta lo que tenía, hace «¡JONK!»
 * si tenía algo (y el graznido siguiente se corre, para que no salgan dos seguidos), y no vuelve a
 * atacar por 30 a 60 s.
 */
export function escapar(ganso: Ganso, reloj: number, azar: () => number): Ganso {
  const persiguiendo = ganso.fase === 'yendo' || ganso.fase === 'arrastrando';
  return {
    ...ganso,
    fase: persiguiendo ? 'parado' : ganso.fase,
    destino: persiguiendo ? {x: ganso.x, y: ganso.y} : ganso.destino,
    pausa: persiguiendo ? pausaAlAzar(azar) : ganso.pausa,
    presa: undefined,
    proximoAtaque: reloj + ESPERA_MINIMA + azar() * (ESPERA_MAXIMA - ESPERA_MINIMA),
    graznido: ganso.presa ? GRAZNIDO : ganso.graznido,
    graznidos: ganso.presa ? ganso.graznidos + 1 : ganso.graznidos,
    proximoGraznido: ganso.presa ? Math.max(ganso.proximoGraznido, reloj + GRAZNIDO_CADA_MINIMO) : ganso.proximoGraznido,
  };
}

/**
 * Le hicieron click al ganso: grazna en el momento, haga lo que haga, salvo que ya esté graznando.
 * El graznido solo siguiente se corre, para que no salgan dos seguidos.
 */
export function tocar(ganso: Ganso, reloj: number): Ganso {
  if (ganso.graznido > 0) return ganso;
  return {
    ...ganso,
    graznido: GRAZNIDO,
    graznidos: ganso.graznidos + 1,
    proximoGraznido: Math.max(ganso.proximoGraznido, reloj + GRAZNIDO_CADA_MINIMO),
  };
}
