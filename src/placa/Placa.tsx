import {useEffect, useState} from 'react';
import {leerCatalogo} from '../catalogo/leer-catalogo.ts';
import type {Maquina} from '../catalogo/tipos.ts';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
import {Menu} from './Menu.tsx';
import './placa.css';

/** Los estados con nombre de la placa (contrato de dirección). */
type Estado = {fase: 'arrancando'} | {fase: 'menu'; maquinas: Maquina[]} | {fase: 'sin-senal'};

async function pedirCatalogo(senal: AbortSignal): Promise<Estado> {
  try {
    const respuesta = await fetch('/catalogo.json', {cache: 'no-cache', signal: senal});
    if (!respuesta.ok) return {fase: 'sin-senal'};
    const lectura = leerCatalogo(await respuesta.text());
    if (!lectura.ok) {
      console.warn(`catálogo: ${lectura.motivo}`);
      return {fase: 'sin-senal'};
    }
    for (const problema of lectura.problemas) {
      console.warn(`catálogo: ${problema.stack ?? '?'}: ${problema.motivo}`);
    }
    return {fase: 'menu', maquinas: lectura.maquinas};
  } catch {
    return {fase: 'sin-senal'};
  }
}

function irA(url: string): void {
  window.location.assign(url);
}

interface Props {
  idioma: Idioma;
  /** Cómo se sale de la placa hacia un juego. Los tests la reemplazan. */
  navegar?: (url: string) => void;
}

export function Placa({idioma, navegar = irA}: Props) {
  const [estado, setEstado] = useState<Estado>({fase: 'arrancando'});
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    const control = new AbortController();
    void pedirCatalogo(control.signal).then((siguiente) => {
      if (!control.signal.aborted) setEstado(siguiente);
    });
    return () => control.abort();
  }, []);

  // Al volver con "atrás", el navegador puede restaurar la página tal como quedó: apagada.
  useEffect(() => {
    function alVolver(evento: PageTransitionEvent) {
      if (evento.persisted) setEntrando(false);
    }
    window.addEventListener('pageshow', alVolver);
    return () => window.removeEventListener('pageshow', alVolver);
  }, []);

  return (
    <main className="mueble">
      <div className="bisel">
        <div className={`pantalla pantalla--${estado.fase}${entrando ? ' pantalla--entrando' : ''}`}>
          <div className="imagen">
            {estado.fase === 'arrancando' && (
              <div className="arranque" role="status">
                <p>{texto(idioma, 'arranque.placa')}</p>
                <p>{texto(idioma, 'arranque.ram')}</p>
                <p className="arranque__ultima">{texto(idioma, 'arranque.catalogo')}</p>
              </div>
            )}

            {estado.fase === 'sin-senal' && (
              <div className="senal" role="status">
                <p className="senal__titulo">{texto(idioma, 'senal.titulo')}</p>
                <p className="senal__detalle">{texto(idioma, 'senal.detalle')}</p>
              </div>
            )}

            {estado.fase === 'menu' && (
              <Menu
                idioma={idioma}
                maquinas={estado.maquinas}
                navegar={navegar}
                alApagarse={() => setEntrando(true)}
              />
            )}
          </div>
          <div className="reflejo" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
