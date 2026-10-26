import {useEffect, useRef} from 'react';
import type {Maquina} from '../catalogo/tipos.ts';
import {numeroDeFila, sinMovimiento} from './comun.ts';

/** Lo que dura la estática entre un juego y otro: un corte, no una transición. */
const ESTATICA_MS = 80;

/**
 * La lluvia de la placa al cambiar de juego. Se dibuja en un canvas chico y estirado, y sólo
 * cuando cambia el juego: al montar (y con el doble montaje de StrictMode) no hace nada.
 */
function Estatica({clave}: {clave: string}) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const anterior = useRef(clave);

  useEffect(() => {
    if (anterior.current === clave) return;
    anterior.current = clave;
    if (sinMovimiento()) return;
    const canvas = lienzo.current;
    const contexto = canvas?.getContext('2d');
    if (!canvas || !contexto) return;

    const imagen = contexto.createImageData(canvas.width, canvas.height);
    const fin = performance.now() + ESTATICA_MS;
    let cuadro = 0;
    function pintar(ahora: number) {
      if (!canvas || !contexto) return;
      if (ahora >= fin) {
        contexto.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      for (let i = 0; i < imagen.data.length; i += 4) {
        const brillo = Math.random() * 255;
        imagen.data[i] = brillo;
        imagen.data[i + 1] = brillo;
        imagen.data[i + 2] = brillo;
        imagen.data[i + 3] = 255;
      }
      contexto.putImageData(imagen, 0, 0);
      cuadro = requestAnimationFrame(pintar);
    }
    cuadro = requestAnimationFrame(pintar);
    return () => {
      cancelAnimationFrame(cuadro);
      contexto.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [clave]);

  return <canvas ref={lienzo} className="estatica" width={96} height={72} />;
}

/**
 * La vista previa del juego con el cursor: el loop que sirve la propia app (ADR-0010) o, si no
 * tiene, el relleno de la placa. Es decorativa: la información está en la fila y en la ficha.
 */
export function Vista({maquina}: {maquina: Maquina}) {
  return (
    <div className="vista" aria-hidden="true">
      {maquina.vista ? (
        <video
          key={maquina.stack}
          src={maquina.vista}
          muted
          loop
          playsInline
          autoPlay={!sinMovimiento()}
          preload="metadata"
        />
      ) : (
        <div className="relleno">
          <span className="relleno__numero">{numeroDeFila(maquina.numero)}</span>
          <span className="relleno__nombre">{maquina.nombre}</span>
        </div>
      )}
      <Estatica clave={maquina.stack} />
    </div>
  );
}
