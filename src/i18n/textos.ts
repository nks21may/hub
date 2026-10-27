/**
 * Los textos del hub, en español e inglés (ADR-0008). Ningún texto visible se escribe en un
 * componente: sale de acá. `en` está tipado con las claves de `es`, así que a un idioma no le puede
 * faltar una clave sin que falle `tsc`. La voz es la de PRODUCT.md.
 */

export type Idioma = 'es' | 'en';
export const IDIOMAS: readonly Idioma[] = ['es', 'en'];

const es = {
  'hub.marca': 'nicolasdalessandro.dev',
  'hub.pestana': 'Proyectos · nicolasdalessandro.dev',
  'hub.titulo': 'Todo lo que está andando',
  'hub.conteo': '{n} proyectos',
  'hub.conteo.uno': 'un proyecto',
  'hub.proyectos': 'Proyectos',
  'hub.atajo.antes': 'Apretá',
  'hub.atajo.rango': '{desde}–{hasta}',
  'hub.atajo.despues': 'y entrás directo',
  'hub.cargando': 'Buscando lo que está andando…',
  'hub.sin-lista': 'No pude leer la lista de proyectos. Probá en un rato.',
  'hub.vacio': 'Todavía no hay nada publicado. Volvé en unos días.',
} as const;

export type ClaveDeTexto = keyof typeof es;
export type Textos = Record<ClaveDeTexto, string>;

const en: Textos = {
  'hub.marca': 'nicolasdalessandro.dev',
  'hub.pestana': 'Projects · nicolasdalessandro.dev',
  'hub.titulo': 'Everything that’s up and running',
  'hub.conteo': '{n} projects',
  'hub.conteo.uno': 'one project',
  'hub.proyectos': 'Projects',
  'hub.atajo.antes': 'Press',
  'hub.atajo.rango': '{desde}–{hasta}',
  'hub.atajo.despues': 'to jump straight in',
  'hub.cargando': 'Looking up what’s running…',
  'hub.sin-lista': 'Couldn’t read the project list. Try again in a bit.',
  'hub.vacio': 'Nothing’s live yet. Check back in a few days.',
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
 * El primer idioma de las preferencias del navegador que el hub conoce. Si no conoce ninguno,
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
