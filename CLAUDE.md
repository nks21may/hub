# Notas para trabajar en este repo

## Qué es

El hub de los proyectos de `nicolasdalessandro.dev`: una página pública con un recuadro por cada
proyecto publicado en la VPS, y entrar a uno cuesta un click o una tecla.

La lista de proyectos no se escribe acá. Cada stack de [`infra`](../infra) lleva su ficha `x-hub`,
el deploy de allá las junta en un `catalogo.json` y la sala lo pide en runtime. Sitio estático en
TypeScript + Vite + React, servido por nginx en la VPS, como `nonograma`.

Antes de proponer un diseño, leé el [índice de ADR](docs/adr/README.md). Casi
todo lo que parece una decisión abierta ya está decidido y con motivo.

## Reglas que no se negocian desde el código

Cada una tiene un ADR detrás. Un cambio que las viole se rechaza en review,
aunque los tests pasen.

1. **TypeScript y sitio estático, sin backend propio.** El gate es `npm run gate`. [ADR-0001](docs/adr/0001-stack-typescript-vite-react-sitio-estatico.md)
2. **Todo lo que el hub muestra o sirve es público.** Nada privado entra al repo ni al catálogo.
   [ADR-0002](docs/adr/0002-el-hub-es-publico.md)
3. **Los proyectos no se escriben en este repo:** salen de las fichas `x-hub` de `infra`. Acá sólo
   hay un catálogo de ejemplo para desarrollo y tests. El formato de la ficha es un contrato con
   `infra` y se fija con un ADR. [ADR-0003](docs/adr/0003-el-catalogo-sale-de-las-fichas-de-infra.md)
4. **El catálogo se pide en runtime a `/catalogo.json`; la imagen no lo trae horneado.** Si falta,
   viene roto o trae una ficha que no valida, la sala sigue andando.
   [ADR-0004](docs/adr/0004-el-catalogo-llega-en-runtime.md)
5. **La sala muestra sólo lo que cualquiera puede usar sin pedir permiso.** Lo demás lleva
   `oculto` con su motivo, y un stack apagado no se muestra aunque tenga ficha.
   [ADR-0005](docs/adr/0005-entra-lo-que-cualquiera-puede-usar.md)
6. **El hub es una grilla de recuadros, uno por proyecto, con su vista previa, y entrar a uno
   cuesta un click o una tecla** (su número), nunca más. El encabezado cuenta los proyectos de
   verdad. El fondo es un cielo azul con partículas que derivan solas hacia abajo a la izquierda y
   se encienden con el mouse, y queda quieto con movimiento reducido. Nada retro. Un ganso pasea por
   encima, persigue el cursor 8 s como mucho y, si lo alcanza, se lleva uno dibujado: el real no se
   mueve. No ataca antes de los 10 s, lo suelta cuando se sacude el mouse o el puntero sale de la
   ventana, no ataja clicks ni teclas, y con movimiento reducido no está. Grazna cada tanto, con un
   sonido generado por código que recién suena después del primer click, toque o tecla en la página.
   Del Desktop Goose se toma sólo la idea.
   [ADR-0011](docs/adr/0011-el-hub-es-una-grilla-de-proyectos.md),
   [ADR-0012](docs/adr/0012-el-fondo-es-un-cielo-de-particulas.md),
   [ADR-0013](docs/adr/0013-el-polvo-deriva-siempre.md),
   [ADR-0014](docs/adr/0014-el-pato-secuestra-el-cursor.md),
   [ADR-0015](docs/adr/0015-el-pato-hace-cuac-con-sonido.md),
   [ADR-0016](docs/adr/0016-el-pato-pasa-a-ser-un-ganso.md),
   [ADR-0019](docs/adr/0019-el-ganso-persigue-el-cursor.md)
7. **El diseño sale de `PRODUCT.md` y `DESIGN.md`**, escritos con `impeccable`; hasta que exista
   `DESIGN.md`, del contrato de dirección en `.impeccable/surfaces/index-html.md`. Un color, una
   tipografía o un espaciado que no sale de ahí es un hallazgo de review.
   [ADR-0007](docs/adr/0007-frontend-disenado-con-impeccable.md)
8. **Español e inglés: ningún texto visible se escribe en un componente**, todo sale del
   diccionario, y las fichas traen sus textos en los dos idiomas.
   [ADR-0008](docs/adr/0008-espanol-e-ingles.md)
9. **La ficha y el catálogo tienen el formato de ADR-0010, que es un contrato con `infra`.** Sumar
   un campo opcional es compatible; cualquier otro cambio sube `version`. Cada app sirve su propio
   loop. [ADR-0010](docs/adr/0010-formato-de-la-ficha-y-del-catalogo.md)

## Convenciones

- **Código y documentación en español**, incluidos nombres de funciones,
  modelos y variables.
- Los identificadores no llevan tildes ni `ñ` (`tamano_bytes`, no
  `tamaño_bytes`); los comentarios y docstrings sí, con ortografía correcta.
- El lint y el formato **los corre el gate**, así que no hay que acordarse: un
  hallazgo es un rojo como cualquier otro.
- Los tests van en `tests/`, nombrados por comportamiento y no por función:
  `una ficha sin url se descarta sin tirar el resto`, no `leerCatalogo 2`.
- Los imports llevan la extensión `.ts` / `.tsx`, como en `nonograma`.

## Cómo se construye

Con TDD, un ítem del [backlog](docs/backlog.md) por iteración, con el protocolo
de [.claude/commands/tdd.md](.claude/commands/tdd.md). Branch: `loop/construccion`.

El ciclo es rojo → verde → refactor, en un solo commit. **El test se escribe
antes que el código**, y se verifica que falle con el error esperado: un test
que nunca falló es indistinguible de no tener test.

## El gate

```bash
npm run gate
```

Corre en el host con Node 24: no hay servicios ni otro intérprete, así que no hace falta Docker
([ADR-0001](docs/adr/0001-stack-typescript-vite-react-sitio-estatico.md)). **Nada está hecho si no lo dice un comando con exit 0** — no
reportes un ítem como resuelto en base a tu lectura del diff.

Cuidado con los pipes: `comando | tail` devuelve el exit code de `tail` y te
oculta el rojo.

## De dónde salen las decisiones

Del grill del 2026-10-26, que se hizo leyendo los repos hermanos en lugar de suponer:

- **`P:\infra`**: qué corre en la VPS y cómo. `host/cloudflared/config.yml` (los hostnames
  públicos), `host/puertos.yml`, `stacks/*/compose.yml` (el `x-deploy`, el `apagado` de
  Minecraft) y `docs/runbooks/proyecto-nuevo.md`. Lo que el hub necesita de allá se pide como ítem
  en el backlog de `infra`, no se toca desde acá.
- **`P:\nonograma`**: el modelo de stack, gate, imagen (`Dockerfile`, `deploy/nginx.conf`) y stack
  estático en `infra`.
- **`P:\museo` y `P:\portfolio4`**: las metáforas que ya están tomadas (la tele y la ficha
  técnica).
- **[docs/conceptos.md](docs/conceptos.md)**: los tres conceptos que interesaron, con el detalle
  de los que no se eligieron.
