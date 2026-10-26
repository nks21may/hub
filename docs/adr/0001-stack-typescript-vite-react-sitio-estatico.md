# ADR-0001 — TypeScript + Vite + React, sitio estático, gate `npm run gate`

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** en qué lenguaje y con qué herramientas se construye el hub, y qué comando dice que algo está hecho

## Contexto

El hub es una página: muestra los proyectos publicados y deja entrar a cada uno. No calcula nada en
un servidor y no guarda datos de nadie. Lo único que recibe de afuera es el catálogo, un JSON que
arma el deploy de `infra` ([ADR-0004](0004-el-catalogo-llega-en-runtime.md)).

Lo que sí tiene es estado de interfaz: qué máquina tiene el foco, el modo demo cuando nadie toca
nada, las secuencias de teclas de los easter eggs. Es más parecido a un juego chico que a un sitio
de contenido.

`P:\nonograma` ya resolvió este mismo caso y está en la VPS: TypeScript, Vite y React, Vitest con
Testing Library, un `npm run gate` que corre tipos, lint, tests y build, y una imagen de dos etapas
que termina en `nginx-unprivileged` y que `infra` corre con `read_only` y sin capabilities
(`stacks/nonograma/compose.yml`).

## Decisión

- **TypeScript, Vite y React**, como nonograma. El resultado es un **sitio estático** (`dist/`) sin
  backend propio.
- **Vitest** como runner, con los tests en `tests/`. Lo que no toca el DOM se testea en Node; los
  tests de UI piden `jsdom` por archivo.
- **El gate es `npm run gate`**: `tsc --noEmit && eslint --max-warnings=0 && vitest run && vite build`.
  El lint está adentro con `--max-warnings=0`, así un hallazgo es un rojo. El build también: un
  import que sólo se rompe al empaquetar es un rojo del gate y no una sorpresa en el deploy.
- **El gate corre en el host**, con Node 24. No hay servicios ni intérprete distinto del de
  producción, porque el sitio corre en el navegador.

## Consecuencias

**A favor:** el mismo stack, gate y forma de imagen que nonograma, que ya pasó por el runbook de
`infra`; lo que se aprenda en uno sirve en el otro.

**En contra:** React es más de lo que necesita una lista de links. Se paga por la sala, no por el
catálogo.

**Se revisa si:** el hub necesita algo de servidor (cuentas, un ranking compartido de los easter
eggs, escritura de cualquier tipo).

## Alternativas consideradas

- **Vite + TypeScript sin framework.** Mismo gate y más liviano, pero el foco, el modo demo y las
  secuencias de teclas se terminan reimplementando a mano, y testearlos sin Testing Library es
  testear el DOM a pulso.
- **Node sin dependencias, como `portfolio4`.** Su `scripts/check.mjs` verifica la salida estática:
  sirve para un sitio de contenido, pero no hay runner de tests para una interfaz con estado.
