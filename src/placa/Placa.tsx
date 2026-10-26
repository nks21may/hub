import {useEffect, useState} from 'react';
import {leerCatalogo} from '../catalogo/leer-catalogo.ts';
import type {Maquina} from '../catalogo/tipos.ts';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
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

function numeroDeFila(numero: number): string {
  return String(numero).padStart(2, '0');
}

export function Placa({idioma}: {idioma: Idioma}) {
  const [estado, setEstado] = useState<Estado>({fase: 'arrancando'});

  useEffect(() => {
    const control = new AbortController();
    void pedirCatalogo(control.signal).then((siguiente) => {
      if (!control.signal.aborted) setEstado(siguiente);
    });
    return () => control.abort();
  }, []);

  return (
    <main className="mueble">
      <div className="bisel">
        <div className={`pantalla pantalla--${estado.fase}`}>
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
            <>
              <h1 className="titulo">{texto(idioma, 'placa.titulo', {n: estado.maquinas.length})}</h1>
              {estado.maquinas.length === 0 ? (
                <p className="vacia">{texto(idioma, 'placa.vacia')}</p>
              ) : (
                <ol className="lista" aria-label={texto(idioma, 'placa.lista')}>
                  {estado.maquinas.map((maquina) => (
                    <li key={maquina.stack} className="fila">
                      <span className="fila__numero">{numeroDeFila(maquina.numero)}</span>{' '}
                      <span className="fila__nombre">{maquina.nombre}</span>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}

          <div className="reflejo" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
