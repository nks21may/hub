import {readdirSync, readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

// Los colores del sistema los escribe el documentador de impeccable en .impeccable/design.json
// (H5). Vitest corre desde la raíz del repo.
const RAIZ = process.cwd();
const DISENO = JSON.parse(readFileSync(resolve(RAIZ, '.impeccable/design.json'), 'utf8')) as unknown;

/** Los literales de color que se buscan: hexadecimales y rgb()/rgba(). Los nombres no cuentan. */
const COLOR = /#[0-9a-f]{8}\b|#[0-9a-f]{6}\b|#[0-9a-f]{3,4}\b|rgba?\([^)]*\)/gi;

/** Un color como `r,g,b,a`, para comparar `#fff`, `#ffffff` y `rgb(255 255 255 / 1)` como iguales. */
function normalizar(literal: string): string | undefined {
  const texto = literal.toLowerCase();
  if (texto.startsWith('#')) {
    let hex = texto.slice(1);
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join('');
    const canales = hex.match(/../g)?.map((par) => parseInt(par, 16)) ?? [];
    const [r, g, b, a = 255] = canales;
    return `${r},${g},${b},${Number((a / 255).toFixed(2))}`;
  }
  const numeros = texto.match(/[\d.]+%?/g) ?? [];
  if (numeros.length < 3) return undefined;
  const [r, g, b, a = '1'] = numeros;
  const alfa = a.endsWith('%') ? Number(a.slice(0, -1)) / 100 : Number(a);
  return `${Number(r)},${Number(g)},${Number(b)},${Number(alfa.toFixed(2))}`;
}

/** Todos los colores que aparecen en los textos del design.json, a cualquier profundidad. */
function coloresDelDiseno(valor: unknown, encontrados = new Set<string>()): Set<string> {
  if (typeof valor === 'string') {
    for (const literal of valor.match(COLOR) ?? []) {
      const color = normalizar(literal);
      if (color) encontrados.add(color);
    }
  } else if (Array.isArray(valor)) {
    for (const elemento of valor) coloresDelDiseno(elemento, encontrados);
  } else if (typeof valor === 'object' && valor !== null) {
    for (const elemento of Object.values(valor)) coloresDelDiseno(elemento, encontrados);
  }
  return encontrados;
}

function hojasDeEstilo(carpeta: string): string[] {
  return readdirSync(carpeta, {withFileTypes: true}).flatMap((entrada) => {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) return hojasDeEstilo(ruta);
    return entrada.name.endsWith('.css') ? [ruta] : [];
  });
}

describe('los colores', () => {
  it('el design.json declara colores', () => {
    expect(coloresDelDiseno(DISENO).size).toBeGreaterThan(0);
  });

  it('ningún CSS de src/ usa un color que no esté entre los tokens del design.json', () => {
    const tokens = coloresDelDiseno(DISENO);
    const intrusos = hojasDeEstilo(resolve(RAIZ, 'src')).flatMap((hoja) => {
      const css = readFileSync(hoja, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      return (css.match(COLOR) ?? [])
        .filter((literal) => {
          const color = normalizar(literal);
          return color !== undefined && !tokens.has(color);
        })
        .map((literal) => `${hoja.slice(RAIZ.length + 1)}: ${literal}`);
    });
    expect(intrusos).toEqual([]);
  });
});
