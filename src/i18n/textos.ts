/**
 * Los textos de la placa, en español e inglés (ADR-0008). Ningún texto visible se escribe en un
 * componente: sale de acá. `en` está tipado con las claves de `es`, así que a un idioma no le puede
 * faltar una clave sin que falle `tsc`. La voz es la del encargado del bar (PRODUCT.md).
 */

export type Idioma = 'es' | 'en';
export const IDIOMAS: readonly Idioma[] = ['es', 'en'];

const es = {
  'placa.titulo': '{n} EN 1',
  'placa.lista': 'Juegos',
  'placa.vacia': 'TODAVÍA NO HAY JUEGOS. VOLVÉ MAÑANA.',
  'arranque.placa': 'PLACA MULTIJUEGO V1.0',
  'arranque.ram': 'CHEQUEO DE RAM ....... OK',
  'arranque.catalogo': 'LEYENDO EL CATÁLOGO ...',
  'senal.titulo': 'SIN SEÑAL',
  'senal.detalle': 'ALGUIEN PISÓ EL CABLE. PROBÁ EN UN RATO.',
} as const;

export type ClaveDeTexto = keyof typeof es;
export type Textos = Record<ClaveDeTexto, string>;

const en: Textos = {
  'placa.titulo': '{n} IN 1',
  'placa.lista': 'Games',
  'placa.vacia': 'NO GAMES YET. COME BACK TOMORROW.',
  'arranque.placa': 'MULTIGAME BOARD V1.0',
  'arranque.ram': 'RAM CHECK ............ OK',
  'arranque.catalogo': 'READING THE CATALOG ...',
  'senal.titulo': 'NO SIGNAL',
  'senal.detalle': 'SOMEBODY TRIPPED ON THE CABLE. TRY AGAIN SOON.',
};

export const TEXTOS: Record<Idioma, Textos> = {es, en};

/** El texto de una clave, con `{nombre}` reemplazado por su valor. */
export function texto(
  idioma: Idioma,
  clave: ClaveDeTexto,
  valores: Record<string, string | number> = {},
): string {
  return TEXTOS[idioma][clave].replace(/\{(\w+)\}/g, (marca, nombre: string) =>
    nombre in valores ? String(valores[nombre]) : marca,
  );
}

/**
 * El primer idioma de las preferencias del navegador que la placa conoce. Si no conoce ninguno,
 * inglés; si el navegador no dice nada, español.
 */
export function idiomaPreferido(preferencias: readonly string[]): Idioma {
  if (preferencias.length === 0) return 'es';
  for (const preferencia of preferencias) {
    const base = preferencia.toLowerCase().split('-')[0];
    const idioma = IDIOMAS.find((conocido) => conocido === base);
    if (idioma) return idioma;
  }
  return 'en';
}
