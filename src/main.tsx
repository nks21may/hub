import '@fontsource-variable/martian-mono/wdth.css';
import '@fontsource/dela-gothic-one/latin-400.css';
import './estilos/base.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {idiomaPreferido} from './i18n/textos.ts';
import {Placa} from './placa/Placa.tsx';

const idioma = idiomaPreferido(navigator.languages);
document.documentElement.lang = idioma;

const raiz = document.getElementById('raiz');
if (raiz) {
  createRoot(raiz).render(
    <StrictMode>
      <Placa idioma={idioma} />
    </StrictMode>,
  );
}
