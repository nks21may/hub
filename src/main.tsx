import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './estilos/base.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Hub} from './hub/Hub.tsx';
import {idiomaPreferido} from './i18n/textos.ts';

const idioma = idiomaPreferido(navigator.languages);
document.documentElement.lang = idioma;

const raiz = document.getElementById('raiz');
if (raiz) {
  createRoot(raiz).render(
    <StrictMode>
      <Hub idioma={idioma} />
    </StrictMode>,
  );
}
