/** Si el visitante pidió menos movimiento. Se consulta en el momento, no al cargar. */
export function sinMovimiento(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
