import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

// El nginx de la imagen (H4). Vitest corre desde la raíz del repo.
const NGINX = readFileSync(resolve(process.cwd(), 'deploy/nginx.conf'), 'utf8');

/** El conf sin comentarios, para no confundir una línea explicada con una línea que rige. */
function sinComentarios(conf: string): string {
  return conf
    .split('\n')
    .map((linea) => linea.replace(/#.*$/, ''))
    .join('\n');
}

const CONF = sinComentarios(NGINX);

/** Las directivas de la CSP, por nombre: `{'connect-src': ["'self'", ...]}`. */
function csp(): Record<string, string[]> {
  const cabecera = /add_header\s+Content-Security-Policy\s+"([^"]+)"/.exec(CONF);
  if (!cabecera?.[1]) throw new Error('el conf no manda Content-Security-Policy');
  return Object.fromEntries(
    cabecera[1]
      .split(';')
      .map((directiva) => directiva.trim().split(/\s+/))
      .filter(([nombre]) => nombre)
      .map(([nombre, ...valores]) => [nombre, valores]),
  );
}

/**
 * Qué Cache-Control le toca a una ruta, evaluando el `map $uri` del conf como lo haría nginx: las
 * entradas exactas primero, después las expresiones regulares en orden, y si no, `default`.
 */
function cacheControl(ruta: string): string | undefined {
  const map = /map\s+\$uri\s+\$\w+\s*\{([^}]*)\}/.exec(CONF);
  if (!map?.[1]) throw new Error('el conf no tiene el map de Cache-Control');
  const entradas = map[1]
    .split(';')
    .map((entrada) => /^\s*(\S+)\s+"([^"]*)"\s*$/.exec(entrada))
    .flatMap((partes) => (partes?.[1] && partes[2] !== undefined ? [[partes[1], partes[2]]] : []));
  const exacta = entradas.find(([clave]) => clave === ruta);
  if (exacta) return exacta[1];
  const regex = entradas.find(([clave]) => clave?.startsWith('~') && new RegExp(clave.slice(1)).test(ruta));
  if (regex) return regex[1];
  return entradas.find(([clave]) => clave === 'default')?.[1];
}

describe('la imagen', () => {
  it('sirve /catalogo.json sin cache, para que un proyecto nuevo aparezca en la próxima carga', () => {
    expect(cacheControl('/catalogo.json')).toBe('no-cache');
    expect(cacheControl('/assets/index-abc123.js')).toBe('public, max-age=31536000, immutable');
  });

  it('el catálogo sale del directorio que monta infra, no de la imagen', () => {
    const bloque = /location\s+=\s+\/catalogo\.json\s*\{([^}]*)\}/.exec(CONF);
    expect(bloque?.[1]).toBeDefined();
    expect(bloque?.[1]).toMatch(/root\s+\/usr\/share\/nginx\/catalogo;/);
  });

  it('la CSP deja pedir el catálogo al mismo origen', () => {
    expect(csp()['connect-src']).toContain("'self'");
  });

  it('la CSP deja ver los loops que sirve cada app en su subdominio (ADR-0010)', () => {
    expect(csp()['media-src']).toContain('https://*.nicolasdalessandro.dev');
    expect(csp()['media-src']).toContain('https://nicolasdalessandro.dev');
  });

  it('la CSP no deja nada abierto por defecto', () => {
    expect(csp()['default-src']).toEqual(["'none'"]);
  });
});
