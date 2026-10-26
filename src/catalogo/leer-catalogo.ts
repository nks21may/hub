import type {Lectura, Maquina, Problema, Textos} from './tipos.ts';

const VERSION = 1;
const LARGO_NOMBRE = 20;
const LARGO_DESCRIPCION = 90;
const IDIOMAS = ['es', 'en'] as const;

type Objeto = Record<string, unknown>;

/** Una ficha válida, antes de numerarla. */
type Ficha = Omit<Maquina, 'stack' | 'numero'>;

function esObjeto(valor: unknown): valor is Objeto {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function esTexto(valor: unknown, largo: number): valor is string {
  return typeof valor === 'string' && valor.length > 0 && valor.length <= largo;
}

function urlHttps(valor: unknown): URL | undefined {
  if (typeof valor !== 'string') return undefined;
  try {
    const url = new URL(valor);
    return url.protocol === 'https:' ? url : undefined;
  } catch {
    return undefined;
  }
}

/** AAAA-MM-DD y que exista en el calendario: `2026-13-01` no pasa. */
function esFecha(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(valor);
}

function leerDescripcion(valor: unknown): Textos | undefined {
  if (!esObjeto(valor)) return undefined;
  const textos: Textos = {};
  for (const idioma of IDIOMAS) {
    const texto = valor[idioma];
    if (texto === undefined) continue;
    if (!esTexto(texto, LARGO_DESCRIPCION)) return undefined;
    textos[idioma] = texto;
  }
  return Object.keys(textos).length > 0 ? textos : undefined;
}

/** Valida los campos de una ficha. Devuelve el motivo si alguno obligatorio está mal. */
function leerFicha(hub: Objeto, stack: string, problemas: Problema[]): Ficha | string {
  if (!esTexto(hub.nombre, LARGO_NOMBRE)) {
    return `nombre: tiene que ser un texto de 1 a ${LARGO_NOMBRE} caracteres`;
  }
  const url = urlHttps(hub.url);
  if (!url) return 'url: tiene que ser una URL https';
  if (!esFecha(hub.desde)) return 'desde: tiene que ser una fecha AAAA-MM-DD';
  const descripcion = leerDescripcion(hub.descripcion);
  if (!descripcion) {
    return `descripcion: al menos un idioma (es, en), de 1 a ${LARGO_DESCRIPCION} caracteres`;
  }

  const ficha: Ficha = {nombre: hub.nombre, url: url.href, desde: hub.desde, descripcion};
  if (hub.vista !== undefined) {
    const vista = urlHttps(hub.vista);
    if (vista && vista.host === url.host) {
      ficha.vista = vista.href;
    } else {
      problemas.push({stack, motivo: 'vista: tiene que ser https y del mismo host que la url'});
    }
  }
  return ficha;
}

/**
 * Lee el texto de `/catalogo.json` (ADR-0010). Nunca tira: lo que no valida se descarta con su
 * motivo, y si el catálogo entero no se entiende, la lectura falla con el suyo.
 */
export function leerCatalogo(texto: string): Lectura {
  let raiz: unknown;
  try {
    raiz = JSON.parse(texto);
  } catch {
    return {ok: false, motivo: 'el catálogo no es JSON'};
  }
  if (!esObjeto(raiz)) return {ok: false, motivo: 'el catálogo no es un objeto'};
  if (raiz.version !== VERSION) {
    return {ok: false, motivo: `version desconocida: ${String(raiz.version)}`};
  }
  if (!Array.isArray(raiz.stacks)) return {ok: false, motivo: 'stacks: falta la lista'};

  const problemas: Problema[] = [];
  const vistos = new Set<string>();
  const fichas: {stack: string; apagado: boolean; ficha: Ficha}[] = [];

  for (const entrada of raiz.stacks) {
    if (!esObjeto(entrada) || typeof entrada.stack !== 'string' || entrada.stack === '') {
      problemas.push({motivo: 'una entrada sin stack'});
      continue;
    }
    const {stack, hub} = entrada;
    if (vistos.has(stack)) {
      problemas.push({stack, motivo: 'stack repetido'});
      continue;
    }
    vistos.add(stack);
    if (!esObjeto(hub)) {
      problemas.push({stack, motivo: 'sin x-hub'});
      continue;
    }
    if (hub.oculto !== undefined) {
      if (typeof hub.oculto !== 'string' || hub.oculto === '') {
        problemas.push({stack, motivo: 'oculto: falta el motivo'});
      }
      continue;
    }
    const ficha = leerFicha(hub, stack, problemas);
    if (typeof ficha === 'string') {
      problemas.push({stack, motivo: ficha});
      continue;
    }
    fichas.push({stack, apagado: entrada.apagado === true, ficha});
  }

  // El número sale del orden entre todas las fichas, apagadas incluidas: apagar un juego deja un
  // hueco en la numeración en lugar de correr a los demás.
  fichas.sort((a, b) =>
    a.ficha.desde === b.ficha.desde
      ? a.stack.localeCompare(b.stack)
      : a.ficha.desde.localeCompare(b.ficha.desde),
  );
  const maquinas = fichas.flatMap(({stack, apagado, ficha}, indice) =>
    apagado ? [] : [{stack, numero: indice + 1, ...ficha}],
  );

  return {ok: true, maquinas, problemas};
}
