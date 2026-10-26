/** El número de un juego como lo muestra la placa: dos dígitos, o los que hagan falta. */
export function numeroDeFila(numero: number): string {
  return String(numero).padStart(2, '0');
}

/** Si el visitante pidió menos movimiento. Se consulta en el momento, no al cargar. */
export function sinMovimiento(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
