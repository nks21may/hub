import {useEffect, useRef, useState} from 'react';
import type {MouseEvent} from 'react';
import type {Maquina, Textos} from '../catalogo/tipos.ts';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
import {Vista} from './Vista.tsx';
import {numeroDeFila, sinMovimiento} from './comun.ts';

/** Lo que tarda la imagen en colapsar a una línea antes de salir hacia el juego. */
const APAGADO_MS = 180;

/** La descripción en el idioma de la placa; si la ficha no lo trae, la que tenga. */
function descripcion(textos: Textos, idioma: Idioma): string {
  return textos[idioma] ?? textos.es ?? textos.en ?? '';
}

function FlechaArriba({abajo = false}: {abajo?: boolean}) {
  return (
    <svg className={`tecla__flecha${abajo ? ' tecla__flecha--abajo' : ''}`} viewBox="0 0 10 10">
      <path d="M5 1 9.2 5.6H6.6V9H3.4V5.6H.8z" />
    </svg>
  );
}

interface Props {
  idioma: Idioma;
  maquinas: Maquina[];
  navegar: (url: string) => void;
  /** Avisa que la pantalla se apaga: la placa colapsa la imagen. */
  alApagarse: () => void;
}

export function Menu({idioma, maquinas, navegar, alApagarse}: Props) {
  const [cursor, setCursor] = useState(0);
  const filas = useRef<(HTMLAnchorElement | null)[]>([]);
  const enfocarCursor = useRef(false);
  const saliendo = useRef<number | undefined>(undefined);
  const elegida = maquinas[cursor];

  function mover(paso: number) {
    enfocarCursor.current = true;
    setCursor((actual) => Math.min(Math.max(actual + paso, 0), maquinas.length - 1));
  }

  function entrar(indice: number) {
    const maquina = maquinas[indice];
    if (!maquina || saliendo.current !== undefined) return;
    if (sinMovimiento()) {
      navegar(maquina.url);
      return;
    }
    alApagarse();
    saliendo.current = window.setTimeout(() => navegar(maquina.url), APAGADO_MS);
  }

  // Las flechas y el Enter andan desde que carga la placa, sin tener que entrar con Tab.
  useEffect(() => {
    function alApretar(evento: KeyboardEvent) {
      if (evento.defaultPrevented || evento.altKey || evento.ctrlKey || evento.metaKey) return;
      if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
        evento.preventDefault();
        mover(evento.key === 'ArrowDown' ? 1 : -1);
      } else if (evento.key === 'Enter') {
        // También cuando el foco está en una fila: el Enter entra al juego del cursor, que es el
        // que se ve, aunque el mouse lo haya movido a otra fila.
        evento.preventDefault();
        entrar(cursor);
      }
    }
    window.addEventListener('keydown', alApretar);
    return () => window.removeEventListener('keydown', alApretar);
  });

  useEffect(() => {
    if (!enfocarCursor.current) return;
    enfocarCursor.current = false;
    filas.current[cursor]?.focus();
  }, [cursor]);

  // Si se vuelve con "atrás" y la página se restaura, se puede volver a entrar.
  useEffect(() => {
    function alVolver(evento: PageTransitionEvent) {
      if (evento.persisted) saliendo.current = undefined;
    }
    window.addEventListener('pageshow', alVolver);
    return () => {
      window.removeEventListener('pageshow', alVolver);
      window.clearTimeout(saliendo.current);
    };
  }, []);

  function alClickear(evento: MouseEvent<HTMLAnchorElement>, indice: number) {
    // Con un modificador o la rueda, el navegador abre el link a su manera (otra pestaña).
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
      return;
    }
    evento.preventDefault();
    entrar(indice);
  }

  return (
    <>
      <h1 className="titulo">{texto(idioma, 'placa.titulo', {n: maquinas.length})}</h1>

      {maquinas.length === 0 ? (
        <p className="vacia">{texto(idioma, 'placa.vacia')}</p>
      ) : (
        <>
          <ol className="lista" aria-label={texto(idioma, 'placa.lista')}>
            {maquinas.map((maquina, indice) => (
              <li key={maquina.stack} className={`fila${indice === cursor ? ' fila--cursor' : ''}`}>
                <a
                  ref={(fila) => {
                    filas.current[indice] = fila;
                  }}
                  href={maquina.url}
                  tabIndex={indice === cursor ? 0 : -1}
                  aria-current={indice === cursor ? 'true' : undefined}
                  aria-describedby="ficha"
                  onMouseEnter={() => setCursor(indice)}
                  onFocus={() => setCursor(indice)}
                  onClick={(evento) => alClickear(evento, indice)}
                >
                  <span className="fila__numero">{numeroDeFila(maquina.numero)}</span>{' '}
                  <span className="fila__nombre">{maquina.nombre}</span>
                </a>
              </li>
            ))}
          </ol>

          {elegida && (
            <>
              <Vista maquina={elegida} />
              <p className="ficha" id="ficha">
                {descripcion(elegida.descripcion, idioma)}
              </p>
            </>
          )}

          <p className="pie pie--teclado">
            <span className="tecla">
              <span className="solo-lectores">{texto(idioma, 'pie.flechas')}</span>
              <FlechaArriba />
            </span>
            <span className="tecla" aria-hidden="true">
              <FlechaArriba abajo />
            </span>
            <span className="pie__accion">{texto(idioma, 'pie.elegir')}</span>
            <span className="tecla tecla--ancha">{texto(idioma, 'pie.enter')}</span>
            <span className="pie__accion">{texto(idioma, 'pie.jugar')}</span>
          </p>
          <p className="pie pie--tactil">{texto(idioma, 'pie.tactil')}</p>
        </>
      )}
    </>
  );
}
