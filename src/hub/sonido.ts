/**
 * La voz del ganso (ADR-0015, ADR-0016): un graznido generado con Web Audio, sin archivos. El
 * navegador no deja sonar a una página hasta que el visitante la toca, así que el contexto de audio se
 * crea recién con el primer click, toque o tecla. Antes de eso, `graznar` no hace nada: el graznido
 * es sólo el cartelito.
 */
export interface Voz {
  /** Lo llama un gesto del visitante: crea el contexto de audio, o lo reanuda si quedó suspendido. */
  destrabar(): void;
  /** Un graznido, si el navegador ya deja sonar. */
  graznar(): void;
  cerrar(): void;
}

/** El volumen del graznido, de 0 a 1: bajo, porque el visitante no lo pidió. */
const VOLUMEN = 0.26;
/** Lo que dura un graznido, en segundos: más que el cuac del pato. */
const DURACION = 0.34;

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
    graznar() {
      const actual = contexto;
      if (actual?.state === 'running') sonarGraznido(actual);
      // Recién creado en un gesto, el contexto puede tardar un instante en arrancar.
      else if (actual?.state === 'suspended') {
        void actual.resume().then(() => {
          if (actual.state === 'running') sonarGraznido(actual);
        });
      }
    },
    cerrar() {
      void contexto?.close();
      contexto = undefined;
    },
  };
}

/**
 * Un graznido: un diente de sierra que sube de 300 a 420 Hz y cae a 280, con un temblor de 45 Hz que
 * lo hace áspero. Pasa por una banda en 900 Hz, que le da el cuerpo, y por un realce en 2200 Hz, que
 * le da la nariz. Arranca rápido, se sostiene y se apaga en un tercio de segundo.
 */
export function sonarGraznido(contexto: BaseAudioContext, volumen = VOLUMEN): void {
  const t = contexto.currentTime;
  const fin = t + DURACION;

  const voz = contexto.createOscillator();
  voz.type = 'sawtooth';
  voz.frequency.setValueAtTime(300, t);
  voz.frequency.linearRampToValueAtTime(420, t + DURACION * 0.25);
  voz.frequency.exponentialRampToValueAtTime(280, fin);

  const temblor = contexto.createOscillator();
  temblor.frequency.value = 45;
  const hondura = contexto.createGain();
  hondura.gain.value = 25;
  temblor.connect(hondura);
  hondura.connect(voz.frequency);

  const cuerpo = contexto.createBiquadFilter();
  cuerpo.type = 'bandpass';
  cuerpo.frequency.value = 900;
  cuerpo.Q.value = 2.2;

  const nariz = contexto.createBiquadFilter();
  nariz.type = 'peaking';
  nariz.frequency.value = 2200;
  nariz.Q.value = 2;
  nariz.gain.value = 8;

  const envolvente = contexto.createGain();
  envolvente.gain.setValueAtTime(0.0001, t);
  envolvente.gain.exponentialRampToValueAtTime(volumen, t + 0.02);
  envolvente.gain.exponentialRampToValueAtTime(volumen * 0.7, t + DURACION * 0.7);
  envolvente.gain.exponentialRampToValueAtTime(0.0001, fin);

  voz.connect(cuerpo).connect(nariz).connect(envolvente).connect(contexto.destination);
  voz.start(t);
  temblor.start(t);
  voz.stop(fin + 0.02);
  temblor.stop(fin + 0.02);
}
