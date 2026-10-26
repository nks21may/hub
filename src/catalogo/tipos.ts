// El formato lo fija ADR-0010: es un contrato con infra, que escribe catalogo.json.

/** Un texto en los idiomas que traiga la ficha; al menos uno. */
export interface Textos {
  es?: string;
  en?: string;
}

/** Un juego de la placa, ya validado y numerado. */
export interface Maquina {
  /** El nombre de la carpeta en `stacks/` de infra: el id estable del juego. */
  stack: string;
  /** Su lugar por fecha de publicación entre todas las fichas, incluidas las apagadas. */
  numero: number;
  nombre: string;
  url: string;
  /** Fecha de publicación, AAAA-MM-DD. */
  desde: string;
  descripcion: Textos;
  /** El loop que sirve la propia app, en el mismo host que `url`. */
  vista?: string;
}

/** Algo del catálogo que se descartó, con su motivo. No es texto para el visitante. */
export interface Problema {
  stack?: string;
  motivo: string;
}

export type Lectura =
  | {ok: true; maquinas: Maquina[]; problemas: Problema[]}
  | {ok: false; motivo: string};
