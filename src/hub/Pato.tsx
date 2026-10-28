import {useEffect, useRef} from 'react';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
import type {Pato as ElPato} from './andanzas.ts';
import {andar, escapar, nacer} from './andanzas.ts';
import {sinMovimiento} from './movimiento.ts';
import type {Punto} from './puntero.ts';
import {PUNTERO_DIBUJADO} from './puntero.ts';
import {crearVoz} from './sonido.ts';
import './pato.css';

/** Lo que tarda la flecha en volver al puntero real cuando se le escapa al pato, en milisegundos. */
const VUELTA = 150;

/** El tamaño de la ventana, sin la barra de scroll. jsdom no mide el documento: ahí va la ventana. */
function medirVentana(): {ancho: number; alto: number} {
  const raiz = document.documentElement;
  return {ancho: raiz.clientWidth || window.innerWidth, alto: raiz.clientHeight || window.innerHeight};
}

/** Si hay un mouse de verdad: algo que apunta fino y pasa por encima sin tocar. */
function hayMouse(): boolean {
  return window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
}

function moverA(elemento: HTMLElement, punto: Punto): void {
  elemento.style.transform = `translate(${punto.x.toFixed(1)}px, ${punto.y.toFixed(1)}px)`;
}

interface Props {
  idioma: Idioma;
  /** De dónde salen las decisiones del pato. Los tests le pasan una semilla. */
  azar?: () => number;
}

/**
 * El pato que pasea por encima del hub (ADR-0014): un SVG fijo a la ventana que camina a un punto al
 * azar, se para un rato y vuelve a caminar. Pasados los 10 s puede llevarse un cursor quieto: el
 * puntero real no se mueve, se esconde, y lo que se lleva en el pico es una flecha dibujada. Apenas
 * el mouse se mueve, la flecha vuelve al puntero real, el puntero reaparece y el pato hace «¡CUAC!».
 * También hace cuac cada tanto, con sonido desde el primer click, toque o tecla (ADR-0015).
 * Es decorado: queda fuera del árbol de accesibilidad y no ataja ningún click. Con movimiento
 * reducido no hay pato.
 */
export function Pato({idioma, azar = Math.random}: Props) {
  const quieto = sinMovimiento();
  const cuerpo = useRef<HTMLDivElement>(null);
  const flecha = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = cuerpo.current;
    const dibujada = flecha.current;
    if (quieto || !elemento || !dibujada) return;

    const raiz = document.documentElement;
    const fino = hayMouse();
    const ventana = medirVentana();
    let pato: ElPato = nacer(ventana.ancho, ventana.alto, azar);
    const voz = crearVoz();
    let cuacsOidos = pato.cuacs;
    // El reloj del pato cuenta sólo los segundos de pestaña a la vista: sin cuadros, no corre.
    let reloj = 0;
    let puntero: Punto | undefined;
    let quietoDesde = 0;
    let vuelta = 0;
    let antes = performance.now();
    let cuadro = 0;

    function pintar() {
      if (!elemento || !dibujada) return;
      moverA(elemento, pato);
      elemento.dataset.fase = pato.fase;
      elemento.dataset.mirando = String(pato.mirando);
      elemento.dataset.cuac = String(pato.cuac > 0);
      if (pato.cuacs !== cuacsOidos) {
        cuacsOidos = pato.cuacs;
        voz.cuac();
      }
      if (!pato.presa) return;
      moverA(dibujada, pato.presa);
      dibujada.dataset.visible = 'true';
      raiz.dataset.pato = 'secuestro';
      window.dispatchEvent(new CustomEvent<Punto>(PUNTERO_DIBUJADO, {detail: pato.presa}));
    }

    function devolver() {
      if (!dibujada) return;
      dibujada.dataset.visible = 'false';
      delete dibujada.dataset.volviendo;
      delete raiz.dataset.pato;
    }

    /** El cursor se le escapa al pato: la flecha vuelve al puntero real, o desaparece si no hay. */
    function soltar(hacia?: Punto) {
      if (!dibujada || !pato.presa) return;
      pato = escapar(pato, reloj, azar);
      window.clearTimeout(vuelta);
      if (hacia) {
        dibujada.dataset.volviendo = 'true';
        moverA(dibujada, hacia);
        vuelta = window.setTimeout(devolver, VUELTA);
      } else {
        devolver();
      }
      pintar();
    }

    function alMover(evento: PointerEvent) {
      if (evento.pointerType === 'touch') return;
      const nuevo = {x: evento.clientX, y: evento.clientY};
      // Un aviso sin movimiento, como el que manda el navegador cuando cambia lo que hay debajo, no
      // cuenta: el que suelta el cursor es el visitante.
      if (puntero && nuevo.x === puntero.x && nuevo.y === puntero.y) return;
      puntero = nuevo;
      quietoDesde = reloj;
      soltar(nuevo);
    }

    function alSalir(evento: MouseEvent) {
      if (evento.relatedTarget) return;
      puntero = undefined;
      soltar();
    }

    function alIrse() {
      soltar();
    }

    // El navegador deja sonar desde el primer gesto del visitante en la página.
    function alTocar() {
      voz.destrabar();
    }

    function paso(ahora: number) {
      // Un cuadro larguísimo (la pestaña que vuelve) cuenta como uno corto: el pato no se teletransporta.
      const segundos = Math.min(Math.max((ahora - antes) / 1000, 0), 0.1);
      antes = ahora;
      reloj += segundos;
      pato = andar(pato, {...medirVentana(), reloj, puntero, quietoDesde, fino}, segundos, azar);
      pintar();
      cuadro = requestAnimationFrame(paso);
    }

    window.addEventListener('pointermove', alMover);
    document.addEventListener('mouseout', alSalir);
    window.addEventListener('pagehide', alIrse);
    window.addEventListener('pointerdown', alTocar, true);
    window.addEventListener('keydown', alTocar, true);
    pintar();
    cuadro = requestAnimationFrame(paso);
    return () => {
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('mouseout', alSalir);
      window.removeEventListener('pagehide', alIrse);
      window.removeEventListener('pointerdown', alTocar, true);
      window.removeEventListener('keydown', alTocar, true);
      cancelAnimationFrame(cuadro);
      voz.cerrar();
      window.clearTimeout(vuelta);
      // Que el pato se vaya nunca deja el puntero escondido.
      delete raiz.dataset.pato;
    };
  }, [quieto, azar]);

  if (quieto) return null;
  return (
    <>
      <div className="pato" ref={cuerpo} aria-hidden="true" data-cuac="false">
        <span className="pato__cuac">{texto(idioma, 'pato.cuac')}</span>
        <svg className="pato__dibujo" viewBox="0 0 64 56" width="64" height="56">
          <g className="pato__pata pato__pata--atras">
            <path className="pato__pierna" d="M27.5 48 L27 53.5" />
            <path className="pato__pie" d="M25 53.2 C28.5 53 31.8 53.6 33.8 55.2 L33.8 56 H24.4 Z" />
          </g>
          <g className="pato__cuerpo">
            {/* El pico va primero: la cabeza le tapa la base, y nace de adentro. */}
            <path
              className="pato__pico"
              d="M47.5 15.2 C53 14.6 59.5 15.2 62.5 17.2 C64 18.2 63.8 20.6 62 21.2 C58 22.4 52.5 22.4 47.5 21.6 Z"
            />
            <path
              className="pato__pluma"
              d="M5 25.5 C8 28.5 12 30 17 30.5 C24 31 31 30 35 27.5 C36.5 26 35.5 23.5 34.6 21 C33.5 12 38.5 7 44 7 C50 7 54 11.5 54 17 C54 21 51.5 23.5 50.5 26 C54 29 55.5 34 53.5 39.5 C51 46.5 42 50.5 30 50.5 C19 50.5 11 47 8.5 40 C7.5 36 7 31 5 25.5 Z"
            />
            <path
              className="pato__ala"
              d="M17.5 34.5 C24 30.5 35.5 31.5 40 36.5 C36 43.5 25 44.5 16 38.5 C15 37 15.8 35.4 17.5 34.5 Z"
            />
            <circle className="pato__ojo" cx="47" cy="14" r="1.9" />
            <circle className="pato__brillo" cx="47.6" cy="13.3" r="0.6" />
          </g>
          <g className="pato__pata pato__pata--adelante">
            <path className="pato__pierna" d="M35.5 48 L36 53.5" />
            <path className="pato__pie" d="M34 53.2 C37.5 53 40.8 53.6 42.8 55.2 L42.8 56 H33.4 Z" />
          </g>
        </svg>
      </div>
      <div className="pato-flecha" ref={flecha} aria-hidden="true" data-visible="false">
        <svg className="pato-flecha__dibujo" viewBox="0 0 14 22" width="14" height="22">
          <path d="M1 1 V17.6 L5 13.9 L7.9 20.4 L10.6 19.2 L7.8 12.9 H13 Z" />
        </svg>
      </div>
    </>
  );
}
