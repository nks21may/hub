# ADR-0018 — El HTML no contesta 304, para que el nonce del cuerpo sea el de la cabecera

- **Estado:** aceptado
- **Fecha:** 2026-10-28
- **Decide:** cómo se revalida el HTML del hub ahora que la CSP lleva un nonce por pedido; suma a
  [ADR-0017](0017-la-csp-lleva-un-nonce-para-cloudflare.md)

## Contexto

Con el nonce de ADR-0017 en producción, la primera visita queda sin errores en la consola, pero la
segunda no. El HTML sale con `Cache-Control: no-cache`, así que el navegador lo guarda y lo
revalida con `If-Modified-Since`. nginx contesta `304 Not Modified`, sin cuerpo, pero con una CSP
nueva y un nonce nuevo. El navegador junta esa cabecera con el HTML que tenía guardado, cuyo script
de Cloudflare lleva el nonce del pedido anterior, y lo bloquea. Medido en producción:

```
HTTP/1.1 200 OK            content-security-policy: … nonce-39e5507924d8c43755aa4108668df472 …
                           (y el cuerpo trae nonce="39e5507924d8c43755aa4108668df472")
If-Modified-Since → 304    content-security-policy: … nonce-a47920269adea6db0730806e9dfbbb9e …
```

ADR-0017 decía que la CSP cambiando en cada respuesta «no pesa, porque el HTML ya sale con
`no-cache`». Es al revés: `no-cache` es justamente lo que hace que el navegador revalide.

## Decisión

- `/index.html` se sirve con `if_modified_since off` y `etag off`: el HTML nunca contesta 304, y cada
  carga trae el cuerpo y la cabecera del mismo pedido, con el mismo nonce.
- `/` llega ahí por la redirección interna de `index`. Lo demás no cambia: `/assets/` sigue inmutable
  y `/catalogo.json` sigue revalidando.

## Consecuencias

**A favor:** el script de Cloudflare pasa en todas las visitas, no sólo en la primera. El HTML pesa
1,4 KB: bajarlo entero en cada carga no se nota.

**En contra:** si aparece otro HTML además de `/index.html`, necesita lo mismo. El test del
despliegue lo fija sólo para éste.

**Se revisa si:** el hub suma otra página HTML.

## Alternativas consideradas

- **`Cache-Control: no-store` en el HTML:** el navegador no lo guarda y no hay nada que revalidar,
  pero Chrome deja afuera del bfcache a las páginas con `no-store`, y volver al hub con «atrás»
  pasaría a recargarlo.
- **Un nonce fijo por despliegue:** el cuerpo y la cabecera coincidirían siempre, pero un nonce que
  no cambia lo puede copiar cualquiera que vea el HTML, y deja de proteger.
