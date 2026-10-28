import {describe, expect, it} from 'vitest';
import type {Mundo, Ganso} from '../src/hub/andanzas.ts';
import {andar, escapar, nacer, pico} from '../src/hub/andanzas.ts';
import {azarConSemilla} from '../src/hub/particulas.ts';
import type {Punto} from '../src/hub/puntero.ts';

const VENTANA = {ancho: 1280, alto: 800};

/** Un ganso caminando hacia un destino lejano, para medirle el paso sin que llegue. */
function caminando(x: number, y: number, destino = {x: 1200, y}): Ganso {
  return {...nacer(VENTANA.ancho, VENTANA.alto, azarConSemilla(1)), x, y, mirando: 1, fase: 'caminando', destino, pausa: 0};
}

function adentro(ganso: Ganso, ancho: number, alto: number): void {
  for (const punto of [ganso, ganso.destino]) {
    expect(punto.x).toBeGreaterThan(0);
    expect(punto.x).toBeLessThan(ancho);
    expect(punto.y).toBeGreaterThan(0);
    expect(punto.y).toBeLessThan(alto);
  }
}

/** Lo hace andar de a cuadros de 60 Hz durante tantos segundos. */
function durante(ganso: Ganso, segundos: number, azar: () => number, ventana = VENTANA): Ganso {
  let actual = ganso;
  for (let t = 0; t < segundos; t += 1 / 60) actual = andar(actual, ventana, 1 / 60, azar);
  return actual;
}

describe('el ganso que pasea', () => {
  it('nace adentro de la ventana, caminando hacia un destino también adentro', () => {
    for (let semilla = 1; semilla <= 20; semilla++) {
      const ganso = nacer(VENTANA.ancho, VENTANA.alto, azarConSemilla(semilla));
      expect(ganso.fase).toBe('caminando');
      adentro(ganso, VENTANA.ancho, VENTANA.alto);
    }
  });

  it('camina hacia su destino a paso de ganso, unos 60 px/s', () => {
    const ganso = andar(caminando(100, 400), VENTANA, 1, azarConSemilla(1));
    expect(ganso.y).toBe(400);
    expect(ganso.x - 100).toBeGreaterThan(40);
    expect(ganso.x - 100).toBeLessThan(80);
  });

  it('depende del tiempo y no de los cuadros: dos medios segundos llegan adonde llega uno entero', () => {
    const azar = azarConSemilla(1);
    const entero = andar(caminando(100, 400), VENTANA, 1, azar);
    const medio = andar(andar(caminando(100, 400), VENTANA, 0.5, azar), VENTANA, 0.5, azar);
    expect(medio.x).toBeCloseTo(entero.x, 6);
    expect(medio.y).toBeCloseTo(entero.y, 6);
  });

  it('mira para el lado al que camina', () => {
    const azar = azarConSemilla(1);
    expect(andar(caminando(600, 400, {x: 1000, y: 400}), VENTANA, 0.1, azar).mirando).toBe(1);
    expect(andar(caminando(600, 400, {x: 200, y: 400}), VENTANA, 0.1, azar).mirando).toBe(-1);
  });

  it('al llegar se para entre 1 y 4 s, y después elige otro destino adentro de la ventana', () => {
    const azar = azarConSemilla(3);
    const llegado = andar(caminando(600, 400, {x: 603, y: 400}), VENTANA, 0.1, azar);
    expect(llegado.fase).toBe('parado');
    expect(llegado.x).toBe(603);
    expect(llegado.pausa).toBeGreaterThanOrEqual(1);
    expect(llegado.pausa).toBeLessThanOrEqual(4);

    expect(durante(llegado, llegado.pausa - 0.1, azar).fase).toBe('parado');
    const otra = durante(llegado, llegado.pausa + 0.1, azar);
    expect(otra.fase).toBe('caminando');
    expect(otra.destino).not.toEqual(llegado.destino);
    adentro(otra, VENTANA.ancho, VENTANA.alto);
  });

  it('pasea un buen rato sin salirse nunca de la ventana', () => {
    const azar = azarConSemilla(5);
    let ganso = nacer(VENTANA.ancho, VENTANA.alto, azar);
    const paradas = new Set<string>();
    for (let segundo = 0; segundo < 120; segundo++) {
      ganso = durante(ganso, 1, azar);
      adentro(ganso, VENTANA.ancho, VENTANA.alto);
      paradas.add(`${ganso.destino.x},${ganso.destino.y}`);
    }
    expect(paradas.size).toBeGreaterThan(3);
  });

  it('si la ventana se achica, vuelve adentro, y su destino también', () => {
    const azar = azarConSemilla(1);
    const chica = {ancho: 400, alto: 300};
    const ganso = andar(caminando(1100, 700, {x: 1200, y: 750}), chica, 1 / 60, azar);
    adentro(ganso, chica.ancho, chica.alto);
  });
});

/** El cursor del visitante, quieto en la mitad derecha de la ventana. */
const CURSOR = {x: 900, y: 300};
const CUADRO = 1 / 60;

/** Un mundo con el cursor quieto desde el principio y un mouse de verdad. */
function conCursor(reloj: number, extra: Partial<Mundo> = {}): Mundo {
  return {...VENTANA, reloj, puntero: CURSOR, quietoDesde: 0, fino: true, ...extra};
}

interface Instante {
  reloj: number;
  ganso: Ganso;
}

/**
 * Lo hace vivir de a cuadros de 60 Hz, de un reloj a otro, y devuelve cada instante. `mundo` dice
 * cómo está el mundo en cada momento; por defecto, con el cursor quieto desde el principio.
 */
function vivir(
  ganso: Ganso,
  desde: number,
  hasta: number,
  azar: () => number,
  mundo: (reloj: number) => Mundo = conCursor,
): Instante[] {
  const instantes: Instante[] = [];
  let actual = ganso;
  for (let reloj = desde; reloj < hasta; reloj += CUADRO) {
    actual = andar(actual, mundo(reloj), CUADRO, azar);
    instantes.push({reloj, ganso: actual});
  }
  return instantes;
}

/** El instante de un índice que el test ya buscó: si no está, el test falla acá con su motivo. */
function en(instantes: Instante[], indice: number): Instante {
  const instante = instantes[indice];
  if (!instante) throw new Error(`no hay un instante ${indice}`);
  return instante;
}

function distancia(a: Punto, b: Punto): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** El primer instante en que el ganso agarra el cursor, con varias semillas. */
function primerSecuestro(semilla: number): {instantes: Instante[]; indice: number; azar: () => number} {
  const azar = azarConSemilla(semilla);
  const instantes = vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 300, azar);
  const indice = instantes.findIndex(({ganso}) => ganso.fase === 'arrastrando');
  return {instantes, indice, azar};
}

const SEMILLAS = [1, 2, 3, 4, 5, 6, 7, 8];

describe('el ganso que secuestra el cursor', () => {
  it('antes de los 10 s no va a buscar el cursor, aunque esté quieto desde el principio', () => {
    for (const semilla of SEMILLAS) {
      const azar = azarConSemilla(semilla);
      const instantes = vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 10, azar);
      expect(instantes.some(({ganso}) => ganso.fase === 'yendo' || ganso.presa)).toBe(false);
    }
  });

  it('a los 10 s ya puede ir: con varias semillas, alguna va por el cursor antes de los 20 s', () => {
    const primeros = SEMILLAS.map((semilla) => {
      const {instantes} = primerSecuestro(semilla);
      return instantes.find(({ganso}) => ganso.fase === 'yendo')?.reloj ?? Infinity;
    });
    expect(primeros.some((reloj) => reloj >= 10 && reloj < 20)).toBe(true);
  });

  it('pasados los 10 s, con el cursor quieto, va a buscarlo hasta tenerlo en el pico', () => {
    for (const semilla of SEMILLAS) {
      const {instantes, indice} = primerSecuestro(semilla);
      expect(indice).toBeGreaterThan(0);
      const yendo = instantes.findIndex(({ganso}) => ganso.fase === 'yendo');
      expect(en(instantes, yendo).reloj).toBeGreaterThanOrEqual(10);
      const {ganso} = en(instantes, indice);
      expect(ganso.presa).toEqual(CURSOR);
      expect(distancia(pico(ganso), CURSOR)).toBeLessThan(10);
    }
  });

  it('un cursor que no se queda quieto 3 s no le interesa', () => {
    for (const semilla of SEMILLAS) {
      const azar = azarConSemilla(semilla);
      // El visitante mueve el mouse cada dos segundos.
      const inquieto = (reloj: number) => conCursor(reloj, {quietoDesde: Math.floor(reloj / 2) * 2});
      const instantes = vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 300, azar, inquieto);
      expect(instantes.some(({ganso}) => ganso.fase === 'yendo')).toBe(false);
    }
  });

  it('si el cursor se mueve mientras va a buscarlo, lo deja', () => {
    const azar = azarConSemilla(1);
    const instantes = vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 300, azar);
    const yendo = instantes.find(({ganso}) => ganso.fase === 'yendo');
    expect(yendo).toBeDefined();
    if (!yendo) return;
    const movido = andar(yendo.ganso, conCursor(yendo.reloj, {quietoDesde: yendo.reloj}), CUADRO, azar);
    expect(movido.fase).not.toBe('yendo');
    expect(movido.presa).toBeUndefined();
  });

  it('con el dedo nunca va: no hay cursor que robar', () => {
    for (const semilla of SEMILLAS) {
      const azar = azarConSemilla(semilla);
      const tactil = (reloj: number) => conCursor(reloj, {fino: false});
      const instantes = vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 300, azar, tactil);
      expect(instantes.some(({ganso}) => ganso.fase === 'yendo' || ganso.presa)).toBe(false);
    }
  });

  it('cuando lo agarra, se lleva la presa en el pico hasta la otra mitad de la pantalla y la suelta ahí', () => {
    for (const semilla of SEMILLAS) {
      const {instantes, indice, azar} = primerSecuestro(semilla);
      const agarrado = en(instantes, indice);
      const despues = vivir(agarrado.ganso, agarrado.reloj, agarrado.reloj + 60, azar);
      for (const {ganso} of despues.filter(({ganso}) => ganso.fase === 'arrastrando')) {
        expect(ganso.presa).toBeDefined();
        expect(distancia(pico(ganso), ganso.presa ?? CURSOR)).toBeLessThan(1);
      }
      const soltado = despues.findIndex(({ganso}) => ganso.fase !== 'arrastrando');
      expect(soltado).toBeGreaterThan(0);
      const presa = en(despues, soltado).ganso.presa;
      expect(presa?.x).toBeLessThan(VENTANA.ancho / 2);
      // Soltada, la presa se queda donde quedó aunque el ganso siga paseando.
      expect(despues.at(-1)?.ganso.presa).toEqual(presa);
    }
  });

  it('si se le escapa, queda parado graznando, y no vuelve a atacar por 30 s', () => {
    for (const semilla of SEMILLAS) {
      const {instantes, indice, azar} = primerSecuestro(semilla);
      const {ganso, reloj} = en(instantes, indice);
      const escapado = escapar(ganso, reloj, azar);
      expect(escapado.presa).toBeUndefined();
      expect(escapado.fase).toBe('parado');
      expect(escapado.graznido).toBeGreaterThan(0);
      const despues = vivir(escapado, reloj, reloj + 30, azar);
      expect(despues.some(({ganso}) => ganso.fase === 'yendo' || ganso.presa)).toBe(false);
      expect(despues.at(-1)?.ganso.graznido).toBe(0);
    }
  });
});

/** En qué momentos del reloj graznó: cada vez que sube la cuenta. */
function cuandoHizoGraznido(instantes: Instante[], desde = 0): number[] {
  const momentos: number[] = [];
  let antes = desde;
  for (const {reloj, ganso} of instantes) {
    if (ganso.graznidos > antes) momentos.push(reloj);
    antes = ganso.graznidos;
  }
  return momentos;
}

/** Un mundo sin cursor: el ganso sólo pasea, con el reloj corriendo. */
const sinCursor = (reloj: number): Mundo => ({...VENTANA, reloj});

describe('el graznido del ganso', () => {
  it('grazna solo, cada tanto: el primero entre los 8 y los 20 s, y en tres minutos entre 4 y 9', () => {
    for (const semilla of SEMILLAS) {
      const azar = azarConSemilla(semilla);
      const momentos = cuandoHizoGraznido(vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 180, azar, sinCursor));
      expect(momentos[0]).toBeGreaterThanOrEqual(8);
      expect(momentos[0]).toBeLessThan(20);
      expect(momentos.length).toBeGreaterThanOrEqual(4);
      expect(momentos.length).toBeLessThanOrEqual(9);
    }
  });

  it('nunca hace dos graznidos con menos de 20 s entre ellos', () => {
    for (const semilla of SEMILLAS) {
      const azar = azarConSemilla(semilla);
      const momentos = cuandoHizoGraznido(vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 300, azar, sinCursor));
      for (let i = 1; i < momentos.length; i++) {
        expect((momentos[i] ?? 0) - (momentos[i - 1] ?? 0)).toBeGreaterThanOrEqual(20);
      }
    }
  });

  it('cada graznido muestra el cartelito', () => {
    const azar = azarConSemilla(1);
    const instantes = vivir(nacer(VENTANA.ancho, VENTANA.alto, azar), 0, 120, azar, sinCursor);
    let antes = 0;
    for (const {ganso} of instantes) {
      if (ganso.graznidos > antes) expect(ganso.graznido).toBeGreaterThan(0);
      antes = ganso.graznidos;
    }
  });

  it('cuando se le escapa el cursor, también cuenta un graznido', () => {
    const {instantes, indice, azar} = primerSecuestro(1);
    const {ganso, reloj} = en(instantes, indice);
    expect(escapar(ganso, reloj, azar).graznidos).toBe(ganso.graznidos + 1);
  });
});
