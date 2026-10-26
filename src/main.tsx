import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// La sala todavía no existe: la arma la Fase 1 del backlog, contra el DESIGN.md.
const raiz = document.getElementById('raiz');
if (raiz) {
  createRoot(raiz).render(
    <StrictMode>
      <main />
    </StrictMode>,
  );
}
