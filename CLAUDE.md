# Notas para trabajar en este repo

## Qué es

La sala de fichines de los proyectos de `nicolasdalessandro.dev`: una página pública donde cada
proyecto publicado en la VPS es una máquina, y entrar a uno cuesta un click o una tecla.

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
5. **Cada proyecto es una máquina de la sala, y entrar a una cuesta un click o una tecla**, nunca
   más. [ADR-0006](docs/adr/0006-el-concepto-es-una-sala-de-fichines.md)
6. **El diseño sale de `PRODUCT.md` y `DESIGN.md`**, escritos con `impeccable`. Un color, una
   tipografía o un espaciado que no sale de ahí es un hallazgo de review.
   [ADR-0007](docs/adr/0007-frontend-disenado-con-impeccable.md)

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
