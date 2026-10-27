import type {PointerEvent} from 'react';
import type {Maquina, Textos} from '../catalogo/tipos.ts';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
import {sinMovimiento} from './movimiento.ts';
import {capturaDePrueba} from './vistas-de-prueba.ts';

/** La descripción en el idioma del hub; si la ficha no lo trae, la que tenga. */
function descripcion(textos: Textos, idioma: Idioma): string {
  return textos[idioma] ?? textos.es ?? textos.en ?? '';
}

/** El host de la URL, que es lo que se reconoce: `neonduel.nicolasdalessandro.dev`. */
function host(url: string): string {
  return new URL(url).host;
}

/** La luz del recuadro sigue al puntero. Se escribe directo en el estilo: no hace falta un render. */
function moverLuz(evento: PointerEvent<HTMLAnchorElement>) {
  const recuadro = evento.currentTarget;
  const borde = recuadro.getBoundingClientRect();
  recuadro.style.setProperty('--luz-x', `${evento.clientX - borde.left}px`);
  recuadro.style.setProperty('--luz-y', `${evento.clientY - borde.top}px`);
}

/** La vista previa: el loop que sirve la app (ADR-0010), la captura de prueba o el nombre. */
function Vista({maquina, idioma}: {maquina: Maquina; idioma: Idioma}) {
  if (maquina.vista) {
    return (
      <video
        src={maquina.vista}
        muted
        loop
        playsInline
        autoPlay={!sinMovimiento()}
        preload="metadata"
      />
    );
  }
  const captura = capturaDePrueba(maquina.stack);
  if (captura) {
    return (
      <>
        <img src={captura} alt="" decoding="async" />
        <span className="recuadro__calco">{texto(idioma, 'hub.captura')}</span>
      </>
    );
  }
  return <span className="recuadro__relleno">{maquina.nombre}</span>;
}

/** Un proyecto: un link con su vista previa, su nombre, su descripción, su host y su tecla. */
export function Recuadro({maquina, idioma}: {maquina: Maquina; idioma: Idioma}) {
  const idDescripcion = `descripcion-${maquina.stack}`;
  return (
    <a
      className="recuadro"
      href={maquina.url}
      aria-label={maquina.nombre}
      aria-describedby={idDescripcion}
      onPointerMove={moverLuz}
    >
      <span className="recuadro__vista" aria-hidden="true">
        <Vista maquina={maquina} idioma={idioma} />
      </span>
      <span className="recuadro__texto">
        <span className="recuadro__cabeza">
          <span className="recuadro__nombre">{maquina.nombre}</span>
          {maquina.numero <= 9 && (
            <kbd className="tecla recuadro__tecla" aria-hidden="true">
              {maquina.numero}
            </kbd>
          )}
        </span>
        <span className="recuadro__descripcion" id={idDescripcion}>
          {descripcion(maquina.descripcion, idioma)}
        </span>
        <span className="recuadro__host">{host(maquina.url)}</span>
      </span>
    </a>
  );
}
