import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

// El nginx de la imagen (H4). Vitest corre desde la raíz del repo.
const NGINX = readFileSync(resolve(process.cwd(), 'deploy/nginx.conf'), 'utf8');
const DOCKERIGNORE = readFileSync(resolve(process.cwd(), '.dockerignore'), 'utf8');

/**
 * Si el contexto del `docker build` deja afuera una ruta, evaluando el `.dockerignore` como Docker:
 * la última regla que coincide gana, `!` vuelve a meter, `*` es un tramo y una carpeta se lleva
 * todo lo de adentro.
 */
function quedaAfuera(ruta: string): boolean {
  let afuera = false;
  for (const linea of DOCKERIGNORE.split('\n')) {
    const regla = linea.trim();
    if (!regla || regla.startsWith('#')) continue;
    const vuelve = regla.startsWith('!');
    const patron = (vuelve ? regla.slice(1) : regla).replace(/^\/|\/$/g, '');
    const cuerpo = patron
      .split('**')
      .map((tramo) => tramo.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*'))
      .join('.*');
    if (new RegExp(`^${cuerpo}(/.*)?$`).test(ruta)) afuera = !vuelve;
  }
  return afuera;
}

/**
 * Los archivos del repo que abre algún test, con `resolve(...)` o `new URL(...)`: los que el gate lee
 * adentro de la imagen.
 */
function archivosQueLeenLosTests(): string[] {
  const carpeta = resolve(process.cwd(), 'tests');
  const nombrados = readdirSync(carpeta).flatMap((archivo) =>
    [...readFileSync(resolve(carpeta, archivo), 'utf8').matchAll(/(?:resolve\([\w.]+(?:\(\))?,\s*|new URL\()'([^']+)'/g)]
      .map((literal) => (literal[1] ?? '').replace(/^\.\.\//, '')),
  );
  return [...new Set(nombrados)].filter((ruta) => existsSync(resolve(process.cwd(), ruta)));
}

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

  it('la CSP lleva un nonce que cambia en cada pedido, para el script que inyecta Cloudflare (ADR-0017)', () => {
    // $request_id son 16 bytes al azar por pedido; Cloudflare lee el nonce de esta cabecera.
    expect(csp()['script-src']).toContain("'nonce-$request_id'");
  });

  it('la CSP sigue sin dejar pasar cualquier script inline', () => {
    expect(csp()['script-src']).toContain("'self'");
    expect(csp()['script-src']).not.toContain("'unsafe-inline'");
  });
});

describe('el build de la imagen', () => {
  it('ve todo lo que leen los tests, porque el gate corre adentro', () => {
    const leidos = archivosQueLeenLosTests();
    expect(leidos).toContain('.impeccable/design.json');
    expect(leidos).toContain('deploy/nginx.conf');
    expect(leidos.filter(quedaAfuera)).toEqual([]);
  });

  it('deja afuera lo pesado y lo que no necesita', () => {
    for (const ruta of ['node_modules/react/index.js', '.git/HEAD', '.impeccable/review/desktop.png', 'dist/index.html']) {
      expect(quedaAfuera(ruta), ruta).toBe(true);
    }
    expect(quedaAfuera('src/main.tsx')).toBe(false);
  });
});
