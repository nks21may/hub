# ADR-0017 — La CSP lleva un nonce por pedido, para el script que inyecta Cloudflare

- **Estado:** aceptado; [ADR-0018](0018-el-html-no-contesta-304.md) le suma que el HTML no conteste 304
- **Fecha:** 2026-10-28
- **Decide:** cómo deja pasar la CSP del hub el script de detección de bots que Cloudflare inyecta
  en el HTML, sin abrirla

## Contexto

El Bot Fight Mode de la zona `nicolasdalessandro.dev` inyecta en cada HTML un script inline, el de
las «JavaScript detections» de Cloudflare (`window.__CF$cv$params`, que después carga
`/cdn-cgi/challenge-platform/scripts/jsd/main.js`). La CSP del hub (`deploy/nginx.conf`, H4) tiene
`script-src 'self'` sin nada para inline, así que el navegador lo bloquea y la consola muestra un
error en cada carga. Pasa lo mismo en nonograma y en museo (bitácora de `infra`, 2026-10-24).

Lo que dice la documentación de Cloudflare
([JavaScript detections](https://developers.cloudflare.com/bots/additional-configurations/javascript-detections/)):

- Si la CSP de la respuesta usa un nonce para los scripts, Cloudflare lo lee de esa cabecera y se
  lo pone a los scripts que inyecta. Con un nonce en `<meta>` no funciona.
- Con el Bot Fight Mode, las detecciones de JavaScript no se pueden apagar solas.
- Si el HTML sale con `Cache-Control: no-transform`, Cloudflare no inyecta el script.
- Lo que está bajo `/cdn-cgi/challenge-platform/` tiene que estar permitido.

Un hash no sirve: el script lleva el ray y un timestamp, que cambian en cada pedido.

## Decisión

- `script-src` suma `'nonce-$request_id'`. nginx arma un nonce por pedido con `$request_id`, que son
  16 bytes al azar en hexadecimal, y Cloudflare se lo copia a su script.
- El hub no usa el nonce: sus scripts siguen entrando por `'self'`, y el build sigue sin scripts
  inline.
- No entra `'unsafe-inline'`.
- `/cdn-cgi/challenge-platform/` es del mismo origen, así que `'self'` ya lo cubre en `script-src` y
  en `connect-src`.

## Consecuencias

**A favor:** la consola queda limpia, y la detección de bots de Cloudflare anda también en el hub.
La CSP sigue sin abrir nada para inline: un script inyectado tendría que adivinar un nonce de 128
bits que cambia en cada pedido.

**En contra:**

- La CSP cambia en cada respuesta. No pesa, porque el HTML ya sale con `no-cache`.
- Que el script pase depende de que Cloudflare siga copiando el nonce de la cabecera. Si deja de
  hacerlo, vuelve el error de la consola, sin romper nada más.
- Nonograma y museo tienen el mismo error, y se arreglan en sus repos, no acá.

**Se revisa si:** el error vuelve a la consola con el nonce puesto. La salida sería
`Cache-Control: no-transform` en el HTML del hub.

## Alternativas consideradas

- **Apagar el Bot Fight Mode:** las detecciones no se apagan solas, así que habría que apagar todo
  el modo. Afecta a la zona entera, se hace desde el panel de Cloudflare y saca la protección
  contra bots de todos los proyectos.
- **`Cache-Control: no-transform` en el HTML:** Cloudflare deja de inyectar el script, pero el hub
  pierde la detección de bots, y también cualquier otra cosa que la zona inyecte, como Web
  Analytics, que la CSP ya prevé.
- **Un hash del script:** cambia en cada pedido.
- **`'unsafe-inline'`:** deja pasar cualquier script inline, que es lo que la CSP existe para frenar.
- **Un nonce en `<meta>`:** Cloudflare no lo lee de ahí, y el HTML es estático.
