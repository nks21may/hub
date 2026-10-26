import {readFileSync} from 'node:fs';
import react from '@vitejs/plugin-react';
import type {Plugin} from 'vite';
import {defineConfig} from 'vitest/config';

/**
 * En desarrollo, `/catalogo.json` es el de ejemplo. En producción lo escribe el deploy de infra y
 * lo monta el stack del hub (ADR-0004): por eso sólo existe en `serve` y nunca llega al build.
 */
function catalogoDeEjemplo(): Plugin {
  return {
    name: 'catalogo-de-ejemplo',
    apply: 'serve',
    configureServer(servidor) {
      servidor.middlewares.use('/catalogo.json', (_pedido, respuesta) => {
        respuesta.setHeader('Content-Type', 'application/json; charset=utf-8');
        respuesta.end(readFileSync(new URL('./ejemplos/catalogo.json', import.meta.url)));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), catalogoDeEjemplo()],
  test: {
    // El entorno por defecto es Node: la lectura del catálogo no toca el DOM. Los
    // tests de UI piden jsdom con el comentario `@vitest-environment jsdom` al
    // principio.
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
