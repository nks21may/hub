import {useEffect, useMemo, useState} from 'react';
import {pedirCatalogo} from '../catalogo/pedir-catalogo.ts';
import type {Maquina} from '../catalogo/tipos.ts';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
import {Recuadro} from './Recuadro.tsx';
import './hub.css';

/** Lo que pasa con el catálogo: llega, no llega o todavía no se sabe (ADR-0004). */
type Estado = {fase: 'cargando'} | {fase: 'lista'; maquinas: Maquina[]} | {fase: 'sin-lista'};

/** Cuántos recuadros de mentira se dibujan mientras llega el catálogo. */
const ESQUELETOS = 3;

function irA(url: string): void {
  window.location.assign(url);
}

/** Los números que se pueden apretar: los de una sola tecla, del 1 al 9. */
function rangoDeTeclas(maquinas: Maquina[]): {desde: number; hasta: number} | undefined {
  const numeros = maquinas.map((maquina) => maquina.numero).filter((numero) => numero <= 9);
  if (numeros.length === 0) return undefined;
  return {desde: Math.min(...numeros), hasta: Math.max(...numeros)};
}

interface Props {
  idioma: Idioma;
  /** Cómo se sale del hub hacia un proyecto con el atajo de teclado. Los tests la reemplazan. */
  navegar?: (url: string) => void;
}

export function Hub({idioma, navegar = irA}: Props) {
  const [estado, setEstado] = useState<Estado>({fase: 'cargando'});
  const maquinas = useMemo(() => (estado.fase === 'lista' ? estado.maquinas : []), [estado]);

  useEffect(() => {
    const control = new AbortController();
    void pedirCatalogo(control.signal).then((leidas) => {
      if (control.signal.aborted) return;
      setEstado(leidas ? {fase: 'lista', maquinas: leidas} : {fase: 'sin-lista'});
    });
    return () => control.abort();
  }, []);

  // El atajo de una tecla: el número de cada proyecto, desde que carga, sin entrar con Tab.
  useEffect(() => {
    function alApretar(evento: KeyboardEvent) {
      if (evento.defaultPrevented || evento.altKey || evento.ctrlKey || evento.metaKey) return;
      if (!/^[1-9]$/.test(evento.key)) return;
      const maquina = maquinas.find((candidata) => candidata.numero === Number(evento.key));
      if (!maquina) return;
      evento.preventDefault();
      navegar(maquina.url);
    }
    window.addEventListener('keydown', alApretar);
    return () => window.removeEventListener('keydown', alApretar);
  }, [maquinas, navegar]);

  const rango = rangoDeTeclas(maquinas);
  const conteo =
    maquinas.length === 1
      ? texto(idioma, 'hub.conteo.uno')
      : texto(idioma, 'hub.conteo', {n: maquinas.length});

  return (
    <div className="hub">
      <main className="hub__contenido">
        <header className="encabezado">
          <div>
            <p className="encabezado__marca">{texto(idioma, 'hub.marca')}</p>
            <h1 className="encabezado__titulo">
              {texto(idioma, 'hub.titulo')}
              {estado.fase === 'lista' && maquinas.length > 0 && (
                <span className="encabezado__conteo"> {conteo}</span>
              )}
            </h1>
          </div>
          {rango && (
            <p className="encabezado__atajo">
              {texto(idioma, 'hub.atajo.antes')}{' '}
              <kbd className="tecla">
                {rango.desde === rango.hasta
                  ? rango.desde
                  : texto(idioma, 'hub.atajo.rango', rango)}
              </kbd>{' '}
              {texto(idioma, 'hub.atajo.despues')}
            </p>
          )}
        </header>

        {estado.fase === 'cargando' && (
          <>
            <p className="aviso" role="status">
              {texto(idioma, 'hub.cargando')}
            </p>
            <ul className="grilla" aria-hidden="true">
              {Array.from({length: ESQUELETOS}, (_, indice) => (
                <li key={indice} className="esqueleto" />
              ))}
            </ul>
          </>
        )}

        {estado.fase === 'sin-lista' && (
          <p className="aviso" role="status">
            {texto(idioma, 'hub.sin-lista')}
          </p>
        )}

        {estado.fase === 'lista' && maquinas.length === 0 && (
          <p className="aviso">{texto(idioma, 'hub.vacio')}</p>
        )}

        {maquinas.length > 0 && (
          <ul className="grilla" aria-label={texto(idioma, 'hub.proyectos')}>
            {maquinas.map((maquina) => (
              <li key={maquina.stack}>
                <Recuadro maquina={maquina} idioma={idioma} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="pie">
        <p>{texto(idioma, 'hub.pie')}</p>
      </footer>
    </div>
  );
}
