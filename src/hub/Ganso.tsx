import {useEffect, useRef} from 'react';
import type {Idioma} from '../i18n/textos.ts';
import {texto} from '../i18n/textos.ts';
import type {Ganso as ElGanso} from './andanzas.ts';
import {andar, escapar, nacer, tocar} from './andanzas.ts';
import {sinMovimiento} from './movimiento.ts';
import type {Punto} from './puntero.ts';
import {PUNTERO_DIBUJADO} from './puntero.ts';
import {crearVoz} from './sonido.ts';
import './ganso.css';

/** Lo que tarda la flecha en volver al puntero real cuando se le escapa al ganso, en milisegundos. */
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
  /** De dónde salen las decisiones del ganso. Los tests le pasan una semilla. */
  azar?: () => number;
}

/**
 * El ganso que pasea por encima del hub (ADR-0014): un SVG fijo a la ventana que camina a un punto al
 * azar, se para un rato y vuelve a caminar. Pasados los 10 s puede llevarse un cursor quieto: el
 * puntero real no se mueve, se esconde, y lo que se lleva en el pico es una flecha dibujada. Apenas
 * el mouse se mueve, la flecha vuelve al puntero real, el puntero reaparece y el ganso hace «¡JONK!».
 * También grazna cada tanto, con sonido desde el primer click, toque o tecla (ADR-0015).
 * Es decorado: queda fuera del árbol de accesibilidad y no ataja ningún click. Con movimiento
 * reducido no hay ganso.
 */
export function Ganso({idioma, azar = Math.random}: Props) {
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
    let ganso: ElGanso = nacer(ventana.ancho, ventana.alto, azar);
    const voz = crearVoz();
    let graznidosOidos = ganso.graznidos;
    // El reloj del ganso cuenta sólo los segundos de pestaña a la vista: sin cuadros, no corre.
    let reloj = 0;
    let puntero: Punto | undefined;
    let quietoDesde = 0;
    let vuelta = 0;
    let antes = performance.now();
    let cuadro = 0;

    function pintar() {
      if (!elemento || !dibujada) return;
      moverA(elemento, ganso);
      elemento.dataset.fase = ganso.fase;
      elemento.dataset.mirando = String(ganso.mirando);
      elemento.dataset.graznido = String(ganso.graznido > 0);
      if (ganso.graznidos !== graznidosOidos) {
        graznidosOidos = ganso.graznidos;
        voz.graznar();
      }
      if (!ganso.presa) return;
      moverA(dibujada, ganso.presa);
      dibujada.dataset.visible = 'true';
      raiz.dataset.ganso = 'secuestro';
      window.dispatchEvent(new CustomEvent<Punto>(PUNTERO_DIBUJADO, {detail: ganso.presa}));
    }

    function devolver() {
      if (!dibujada) return;
      dibujada.dataset.visible = 'false';
      delete dibujada.dataset.volviendo;
      delete raiz.dataset.ganso;
    }

    /** El cursor se le escapa al ganso: la flecha vuelve al puntero real, o desaparece si no hay. */
    function soltar(hacia?: Punto) {
      if (!dibujada || !ganso.presa) return;
      ganso = escapar(ganso, reloj, azar);
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

    // El navegador deja sonar desde el primer gesto del visitante en la página. Si el gesto es un
    // click sobre el ganso, grazna, y ya suena. El click no se frena: sigue hasta lo que esté debajo.
    function alTocar(evento: PointerEvent) {
      voz.destrabar();
      if (!elemento) return;
      const caja = elemento.getBoundingClientRect();
      const {clientX: x, clientY: y} = evento;
      if (x < caja.left || x > caja.right || y < caja.top || y > caja.bottom) return;
      ganso = tocar(ganso, reloj);
      pintar();
    }

    function alApretar() {
      voz.destrabar();
    }

    function paso(ahora: number) {
      // Un cuadro larguísimo (la pestaña que vuelve) cuenta como uno corto: el ganso no se teletransporta.
      const segundos = Math.min(Math.max((ahora - antes) / 1000, 0), 0.1);
      antes = ahora;
      reloj += segundos;
      ganso = andar(ganso, {...medirVentana(), reloj, puntero, quietoDesde, fino}, segundos, azar);
      pintar();
      cuadro = requestAnimationFrame(paso);
    }

    window.addEventListener('pointermove', alMover);
    document.addEventListener('mouseout', alSalir);
    window.addEventListener('pagehide', alIrse);
    window.addEventListener('pointerdown', alTocar, true);
    window.addEventListener('keydown', alApretar, true);
    pintar();
    cuadro = requestAnimationFrame(paso);
    return () => {
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('mouseout', alSalir);
      window.removeEventListener('pagehide', alIrse);
      window.removeEventListener('pointerdown', alTocar, true);
      window.removeEventListener('keydown', alApretar, true);
      cancelAnimationFrame(cuadro);
      voz.cerrar();
      window.clearTimeout(vuelta);
      // Que el ganso se vaya nunca deja el puntero escondido.
      delete raiz.dataset.ganso;
    };
  }, [quieto, azar]);

  if (quieto) return null;
  return (
    <>
      <div className="ganso" ref={cuerpo} aria-hidden="true" data-graznido="false">
        <span className="ganso__graznido">{texto(idioma, 'ganso.graznido')}</span>
        <svg className="ganso__dibujo" viewBox="0 0 64 64" width="64" height="64">
          <g className="ganso__pata ganso__pata--atras">
            <path className="ganso__pierna" d="M24.5 55 L24 61.5" />
            <path className="ganso__pie" d="M22 61.2 C25.5 61 28.8 61.6 30.8 63.2 L30.8 64 H21.4 Z" />
          </g>
          <g className="ganso__cuerpo">
            {/* El pico va primero: la cabeza le tapa la base, y nace de adentro. */}
            <path
              className="ganso__pico"
              d="M52.5 8.6 C56.5 8.2 60.5 9.6 62.8 11.8 C63.6 12.6 63.3 13.7 62.3 14 C59.2 14.9 55.6 15 52.5 14.6 Z"
            />
            {/* El ala del otro lado asoma detrás del lomo: es la que da la idea de cuerpo redondo. */}
            <path
              className="ganso__ala-de-atras"
              d="M15 37.6 C21 33.8 31 33 39 34.4 C32 36.8 22.5 38.2 15 37.6 Z"
            />
            <path
              className="ganso__pluma"
              d="M3 35 C7 38 12 39.5 18 39 C26 38 32 37 36 35.5 C41 33 43 26 44 19 C44.5 12.5 46 6 50.5 5 C54.5 4.5 57 8 56.5 11.5 C56 14.5 54 16.5 52.5 19 C50.5 24 49.5 29 48.5 34 C50.5 37 52 41.5 50.5 46 C48.5 52.5 40 56.5 28 56.5 C17 56.5 9.5 53 7.5 47 C6.5 43 5 39 3 35 Z"
            />
            {/* El volumen sale del tono (la regla «Plano con luz»): la panza en sombra, y la luz de arriba
                en el lomo, el cuello y la cabeza. Ninguna forma se sale de la silueta. */}
            <path
              className="ganso__sombra"
              d="M50.5 46 C48.5 52.5 40 56.5 28 56.5 C17 56.5 9.5 53 7.5 47 C15 51.5 37 52.5 50.5 46 Z"
            />
            <path className="ganso__luz" d="M9 38.6 C15 40.6 27 40 35.5 36.6 C29 40 17 42 9 38.6 Z" />
            <path
              className="ganso__luz"
              d="M37.8 34.2 C41.8 31 43.9 25 44.8 19.5 C45.3 14.5 46.4 10.5 48.6 8.2 C47 12 46.6 16 46.1 20.2 C45.2 26.2 42.9 31.6 37.8 34.2 Z"
            />
            <ellipse className="ganso__luz" cx="50.2" cy="7.4" rx="2.4" ry="1.2" />
            <path className="ganso__rabadilla" d="M6.5 44 C9 47.5 13 49.5 17 50 C14 52.5 9.5 51.5 7.5 47.5 Z" />
            <path
              className="ganso__ala"
              d="M14 40.5 C21.5 35.5 35.5 35.5 42 41.5 C37.5 49 24.5 51 13 45.5 C11.8 43.8 12.3 41.6 14 40.5 Z"
            />
            <path className="ganso__pluma-del-ala" d="M19 44.5 C25 46 32 45.8 37.5 43" />
            <path className="ganso__pluma-del-ala" d="M17.5 41.5 C24 43 31.5 42.6 38.5 39.8" />
            <circle className="ganso__ojo" cx="51.6" cy="9.6" r="1.4" />
            <circle className="ganso__brillo" cx="52" cy="9.1" r="0.45" />
          </g>
          <g className="ganso__pata ganso__pata--adelante">
            <path className="ganso__pierna" d="M32.5 55 L33 61.5" />
            <path className="ganso__pie" d="M31 61.2 C34.5 61 37.8 61.6 39.8 63.2 L39.8 64 H30.4 Z" />
          </g>
        </svg>
      </div>
      <div className="ganso-flecha" ref={flecha} aria-hidden="true" data-visible="false">
        <svg className="ganso-flecha__dibujo" viewBox="0 0 14 22" width="14" height="22">
          <path d="M1 1 V17.6 L5 13.9 L7.9 20.4 L10.6 19.2 L7.8 12.9 H13 Z" />
        </svg>
      </div>
    </>
  );
}
