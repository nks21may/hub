import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // El entorno por defecto es Node: la lectura del catálogo no toca el DOM. Los
    // tests de UI piden jsdom con el comentario `@vitest-environment jsdom` al
    // principio.
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
