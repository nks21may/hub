/**
 * La voz del pato (ADR-0015): un cuac generado con Web Audio, sin archivos. El navegador no deja
 * sonar a una página hasta que el visitante la toca, así que el contexto de audio se crea recién con
 * el primer click, toque o tecla. Antes de eso, `cuac` no hace nada: el cuac es sólo el cartelito.
 */
export interface Voz {
  /** Lo llama un gesto del visitante: crea el contexto de audio, o lo reanuda si quedó suspendido. */
  destrabar(): void;
  /** Un cuac, si el navegador ya deja sonar. */
  cuac(): void;
  cerrar(): void;
}

/** El volumen del cuac, de 0 a 1: bajo, porque el visitante no lo pidió. */
const VOLUMEN = 0.5;
/** Lo que dura un cuac, en segundos. */
const DURACION = 0.24;

export function crearVoz(): Voz {
  let contexto: AudioContext | undefined;
  return {
    destrabar() {
      if (!contexto) {
        if (typeof AudioContext === 'undefined') return;
        contexto = new AudioContext();
      }
      if (contexto.state === 'suspended') void contexto.resume();
    },
    cuac() {
      if (contexto?.state === 'running') sonarCuac(contexto);
    },
    cerrar() {
      void contexto?.close();
      contexto = undefined;
    },
  };
}

/**
 * Un cuac: un diente de sierra que baja de 560 a 330 Hz, con un temblor de 38 Hz que lo hace áspero,
 * pasado por un filtro de banda que se cierra de 1400 a 900 Hz y le da la voz nasal del pato. Arranca
 * de golpe y se apaga en un cuarto de segundo.
 */
export function sonarCuac(contexto: BaseAudioContext, volumen = VOLUMEN): void {
  const t = contexto.currentTime;
  const fin = t + DURACION;

  const voz = contexto.createOscillator();
  voz.type = 'sawtooth';
  voz.frequency.setValueAtTime(560, t);
  voz.frequency.exponentialRampToValueAtTime(330, t + DURACION * 0.7);

  const temblor = contexto.createOscillator();
  temblor.frequency.value = 38;
  const hondura = contexto.createGain();
  hondura.gain.value = 30;
  temblor.connect(hondura);
  hondura.connect(voz.frequency);

  const nariz = contexto.createBiquadFilter();
  nariz.type = 'bandpass';
  nariz.frequency.setValueAtTime(1400, t);
  nariz.frequency.linearRampToValueAtTime(900, fin);
  nariz.Q.value = 3.5;

  const envolvente = contexto.createGain();
  envolvente.gain.setValueAtTime(0.0001, t);
  envolvente.gain.exponentialRampToValueAtTime(volumen, t + 0.015);
  envolvente.gain.exponentialRampToValueAtTime(volumen * 0.5, t + DURACION * 0.6);
  envolvente.gain.exponentialRampToValueAtTime(0.0001, fin);

  voz.connect(nariz).connect(envolvente).connect(contexto.destination);
  voz.start(t);
  temblor.start(t);
  voz.stop(fin + 0.02);
  temblor.stop(fin + 0.02);
}
