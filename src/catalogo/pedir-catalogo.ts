import {leerCatalogo} from './leer-catalogo.ts';
import type {Maquina} from './tipos.ts';

/**
 * Pide `/catalogo.json` (ADR-0004) y lo lee. Devuelve las máquinas visibles, o `undefined` si el
 * catálogo no llegó o no se entiende: quien lo pide decide cómo se ve eso. Nunca tira.
 */
export async function pedirCatalogo(senal: AbortSignal): Promise<Maquina[] | undefined> {
  try {
    const respuesta = await fetch('/catalogo.json', {cache: 'no-cache', signal: senal});
    if (!respuesta.ok) return undefined;
    const lectura = leerCatalogo(await respuesta.text());
    if (!lectura.ok) {
      console.warn(`catálogo: ${lectura.motivo}`);
      return undefined;
    }
    for (const problema of lectura.problemas) {
      console.warn(`catálogo: ${problema.stack ?? '?'}: ${problema.motivo}`);
    }
    return lectura.maquinas;
  } catch {
    return undefined;
  }
}
