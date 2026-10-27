import type {Punto} from './puntero.ts';

/** Una mota del polvo del cielo. `energia` va de 0 (apagada) a 1 (recién encendida por el mouse). */
export interface Particula {
  x: number;
  y: number;
  tam: number;
  /** Cuánto se ve apagada: casi nada, salvo algunas pocas más brillantes. */
  base: number;
  energia: number;
  fase: number;
}

/** La distancia entre motas, en píxeles: una por celda de esta medida, corrida al azar adentro. */
const SEPARACION = 28;
/** Qué parte de las celdas lleva mota: el resto queda vacío, para que no se lea como una grilla. */
const OCUPACION = 0.62;
/** Hasta dónde llega el mouse, en píxeles. */
export const RADIO = 190;
/** Cuánto tarda una mota en perder dos tercios de su luz: la estela. */
const TAU_APAGADO = 1.2;
/** Cuánto corre el mouse a una mota que tiene encima, en píxeles. */
const FUERZA = 8;
/** Hacia dónde deriva el polvo: abajo a la izquierda, a 35° de la horizontal (ADR-0013). */
const ANGULO_DERIVA = (35 * Math.PI) / 180;
/** A cuántos píxeles por segundo deriva una mota de tamaño medio. */
const VELOCIDAD = 16;
/** Cuánto sale una mota por un borde antes de entrar por el opuesto: así no aparece de golpe. */
const MARGEN = 4;

/** Un azar con semilla (mulberry32): el mismo cielo en cada visita. */
export function azarConSemilla(semilla: number): () => number {
  let estado = semilla >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Siembra el polvo en una ventana: una mota en la mayoría de las celdas, corrida al azar. */
export function sembrar(ancho: number, alto: number, azar: () => number): Particula[] {
  if (ancho <= 0 || alto <= 0) return [];
  const particulas: Particula[] = [];
  for (let celdaY = 0; celdaY < alto; celdaY += SEPARACION) {
    for (let celdaX = 0; celdaX < ancho; celdaX += SEPARACION) {
      if (azar() > OCUPACION) continue;
      const brillante = azar() < 0.05;
      particulas.push({
        x: Math.min(celdaX + azar() * SEPARACION, ancho),
        y: Math.min(celdaY + azar() * SEPARACION, alto),
        tam: 0.5 + azar() * 1.1,
        base: 0.04 + azar() * 0.1 + (brillante ? 0.22 : 0),
        energia: 0,
        fase: azar() * Math.PI * 2,
      });
    }
  }
  return particulas;
}

/**
 * Enciende las motas cerca del mouse, más cuanto más cerca. `intensidad` es cuánto se movió el mouse
 * (de 0 a 1): quieto no enciende nada, y así queda una estela por donde pasó.
 */
export function encender(
  particulas: Particula[],
  cursor: Punto,
  intensidad: number,
  radio = RADIO,
): void {
  if (intensidad <= 0) return;
  for (const p of particulas) {
    const distancia = Math.hypot(p.x - cursor.x, p.y - cursor.y);
    if (distancia >= radio) continue;
    const cercania = 1 - distancia / radio;
    p.energia = Math.min(1, Math.max(p.energia, cercania * cercania * (2 - cercania) * intensidad));
  }
}

/** Las motas se apagan solas, de a poco: con suavizado exponencial, que depende del tiempo. */
export function apagar(particulas: Particula[], segundos: number): void {
  const factor = Math.exp(-Math.max(segundos, 0) / TAU_APAGADO);
  for (const p of particulas) {
    p.energia *= factor;
    if (p.energia < 0.001) p.energia = 0;
  }
}

/**
 * El polvo deriva solo, abajo a la izquierda, sin el mouse. Las motas grandes van más rápido, como si
 * estuvieran más cerca, y la que sale por un borde entra por el opuesto.
 */
export function derivar(particulas: Particula[], segundos: number, ancho: number, alto: number): void {
  const paso = Math.max(segundos, 0) * VELOCIDAD;
  const haciaX = -Math.cos(ANGULO_DERIVA);
  const haciaY = Math.sin(ANGULO_DERIVA);
  for (const p of particulas) {
    // De la mota más chica (0,5) a la más grande (1,6), la velocidad va de la mitad a una vez y media.
    const cercania = 0.5 + (p.tam - 0.5) / 1.1;
    p.x = envolver(p.x + haciaX * paso * cercania, ancho);
    p.y = envolver(p.y + haciaY * paso * cercania, alto);
  }
}

/** Lleva una coordenada de vuelta a la ventana, con su margen, por el lado opuesto. */
function envolver(valor: number, largo: number): number {
  const total = largo + MARGEN * 2;
  return ((((valor + MARGEN) % total) + total) % total) - MARGEN;
}

/** Cuánto corre el mouse a una mota: hacia afuera, más cuanto más cerca, nada si está lejos. */
export function empuje(p: Particula, cursor: Punto | undefined, radio = RADIO): Punto {
  if (!cursor) return {x: 0, y: 0};
  const dx = p.x - cursor.x;
  const dy = p.y - cursor.y;
  const distancia = Math.hypot(dx, dy);
  if (distancia >= radio || distancia === 0) return {x: 0, y: 0};
  const fuerza = (1 - distancia / radio) ** 2 * FUERZA;
  return {x: (dx / distancia) * fuerza, y: (dy / distancia) * fuerza};
}
