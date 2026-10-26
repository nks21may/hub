/**
 * Material de prueba, no datos: ninguna app sirve todavía su `vista` (ADR-0010), así que para
 * poder juzgar los recuadros se capturaron los seis sitios publicados el 2026-10-26 (Chrome sin
 * cabeza, 1024×768, reducidas a 640×480). Son fotos fijas, marcadas como captura de prueba en el
 * recuadro, y no forman parte del formato de la ficha: cuando una ficha traiga `vista`, gana ella.
 */
const CAPTURAS: Record<string, string> = {
  bot_discord: '/prueba/vistas/bot_discord.webp',
  portafolio: '/prueba/vistas/portafolio.webp',
  neonduel: '/prueba/vistas/neonduel.webp',
  'bhop-surf': '/prueba/vistas/bhop-surf.webp',
  museo: '/prueba/vistas/museo.webp',
  nonograma: '/prueba/vistas/nonograma.webp',
};

/** La captura de prueba de un stack, si hay. */
export function capturaDePrueba(stack: string): string | undefined {
  return CAPTURAS[stack];
}
