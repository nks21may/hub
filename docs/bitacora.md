# Bitácora del loop de construcción — Hub

Registro append-only, una entrada por iteración. El backlog está en
[backlog.md](backlog.md) y el protocolo en
[.claude/commands/tdd.md](../.claude/commands/tdd.md).

**Para qué sirve:** una entrada sin la salida del comando pegada textualmente
**es** el delirio. Se detecta de un vistazo, sin tener que releer el diff.

Nunca se edita ni se reordena una entrada anterior. Si algo salió mal, se agrega
una entrada nueva que lo corrige.

**Formato:** ítem · archivos tocados · comando del gate · salida del rojo →
salida del verde · sha.

---

## H0 — Harness y estructura · 2026-10-26

**Archivos:** `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.js`,
`vite.config.ts`, `index.html`, `src/main.tsx`, `src/version.ts`, `src/vite-env.d.ts`,
`tests/harness.test.ts`, `.gitattributes`, `.gitignore`, `.claude/settings.json`,
`.claude/commands/tdd.md`, `CLAUDE.md`, `README.md`, `docs/adr/` (0000 a 0007 y el índice),
`docs/conceptos.md`, `docs/backlog.md`, `docs/bitacora.md`.

**Gate:** `npm run gate`

**El gate sabe ponerse rojo.** Con un hallazgo de lint puesto a propósito
(`export const VERSION: any = '0.0.0';` en `src/version.ts`: `tsc` lo deja pasar, el lint no):

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


P:\hub\src\version.ts
  1:23  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 1 problem (1 error, 0 warnings)

EXIT=1
```

**Verde**, con el hallazgo sacado:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


 RUN  v5.0.5 P:/hub


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:10:49
   Duration  122ms (transform 56%, import 24%, worker 11%, tests 8%, environment 1%)

vite v8.3.5 building client environment for production...
transforming...
✓ 14 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.31 kB │ gzip:  0.22 kB
dist/assets/index-CkS-kbAU.js  219.50 kB │ gzip: 68.58 kB

✓ built in 75ms
EXIT=0
```

**Nota:** H0 lo dejó armado la sesión de preparación, no una iteración del
loop. La primera iteración real del loop es **H1**.

**Sha:** `d602c9f`

---

## H1 — El formato de la ficha y la lectura del catálogo · 2026-10-26

**Archivos:** `docs/adr/0010-formato-de-la-ficha-y-del-catalogo.md` (el ADR, antes del test),
`docs/adr/README.md`, `CLAUDE.md` (regla 9), `ejemplos/catalogo.json`, `tests/catalogo.test.ts`,
`src/catalogo/tipos.ts`, `src/catalogo/leer-catalogo.ts`.

**Decisiones del usuario para el ADR:** el loop lo sirve cada app, y la placa ordena por fecha de
publicación (`desde`) con números estables.

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin el módulo:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/catalogo.test.ts(3,28): error TS2307: Cannot find module '../src/catalogo/leer-catalogo.ts' or its corresponding type declarations.
tests/catalogo.test.ts(4,28): error TS2307: Cannot find module '../src/catalogo/tipos.ts' or its corresponding type declarations.
tests/catalogo.test.ts(35,34): error TS7006: Parameter 'm' implicitly has an 'any' type.
tests/catalogo.test.ts(42,34): error TS7006: Parameter 'm' implicitly has an 'any' type.
tests/catalogo.test.ts(60,34): error TS7006: Parameter 'm' implicitly has an 'any' type.
tests/catalogo.test.ts(70,34): error TS7006: Parameter 'm' implicitly has an 'any' type.
tests/catalogo.test.ts(89,34): error TS7006: Parameter 'm' implicitly has an 'any' type.
tests/catalogo.test.ts(146,34): error TS7006: Parameter 'm' implicitly has an 'any' type.
EXIT=2
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


 RUN  v5.0.5 P:/hub


 Test Files  2 passed (2)
      Tests  29 passed (29)
   Start at  13:03:44
   Duration  133ms (transform 50%, tests 22%, import 20%, worker 7%)

vite v8.3.5 building client environment for production...
transforming...
✓ 14 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.31 kB │ gzip:  0.22 kB
dist/assets/index-CkS-kbAU.js  219.50 kB │ gzip: 68.58 kB

✓ built in 64ms
EXIT=0
```

**Nota:** las fechas `desde` de `ejemplos/catalogo.json` son el primer commit de cada app, no la
fecha real de publicación. Sirven para el ejemplo; las de verdad se escriben en las fichas de
`infra`.

**Sha:** `fca7bc8`

---

## H2 — La placa lista un juego por ficha visible, y el título los cuenta · 2026-10-26

**Archivos:** `src/placa/Placa.tsx`, `src/placa/placa.css`, `src/i18n/textos.ts`,
`src/estilos/base.css`, `src/main.tsx`, `vite.config.ts` (sirve `ejemplos/catalogo.json` en
`/catalogo.json`, sólo en desarrollo), `tests/placa.test.tsx`, `package.json` y `package-lock.json`
(las letras: Martian Mono para la pantalla y Dela Gothic One para el logo), `.claude/launch.json`.

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin los módulos:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/placa.test.tsx(5,39): error TS2307: Cannot find module '../src/i18n/textos.ts' or its corresponding type declarations.
tests/placa.test.tsx(6,21): error TS2307: Cannot find module '../src/placa/Placa.tsx' or its corresponding type declarations.
EXIT=2
```

En el medio hubo un rojo que no era del código: en jsdom, `new URL(…, import.meta.url)` no es una
URL `file:` y `readFileSync` la rechaza (`TypeError: The URL must be of scheme file`). El test lee
el ejemplo desde `process.cwd()`.

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


 RUN  v5.0.5 P:/hub


 Test Files  3 passed (3)
      Tests  42 passed (42)
   Start at  13:22:31
   Duration  881ms (environment 62%, tests 22%, import 12%, transform 3%, worker 1%)

vite v8.3.5 building client environment for production...
transforming...
✓ 21 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                     0.38 kB │ gzip:  0.26 kB
dist/assets/martian-mono-cyrillic-ext-wdth-normal-BFx_pHPN.woff2    4.81 kB
dist/assets/dela-gothic-one-latin-400-normal-AgyGD05y.woff2        13.80 kB
dist/assets/martian-mono-cyrillic-wdth-normal-Dgr-UBxV.woff2       17.20 kB
dist/assets/dela-gothic-one-latin-400-normal-qxqiosUh.woff         17.44 kB
dist/assets/martian-mono-latin-ext-wdth-normal-DeTdBbNh.woff2      24.66 kB
dist/assets/martian-mono-latin-wdth-normal-1TqSgyfh.woff2          38.49 kB
dist/assets/index-DLPFA_D5.css                                      5.76 kB │ gzip:  2.14 kB
dist/assets/index-2ROAhsZz.js                                     224.60 kB │ gzip: 70.63 kB

✓ built in 81ms
EXIT=0
```

**Revisión visual** (navegador del panel, `npm run dev`): a 1440×900, el monitor horizontal de
40×30 celdas con «6 EN 1» y las seis filas; a 375×812, el monitor vertical de 30 columnas. SIN
SEÑAL se vio inyectando su marcado en la página. ARRANCANDO no se pudo capturar, porque el cursor
que titila no deja terminar la captura: queda para la revisión de H5. El avance de Martian Mono se
midió en el navegador (0,70 em a 100 %, 0,75 em a 112,5 %), y la pantalla usa 112,5 %.

**Lo que apareció y fue al backlog:** la perilla de volumen (H6), y si hace falta un selector de
idioma (parkeado).

**Sha:** `d26ff15`

---

## H3 — El cursor, la vista previa y entrar con un click o un Enter · 2026-10-26

**Archivos:** `src/placa/Menu.tsx` (nuevo: el menú con el cursor, la ficha y el pie),
`src/placa/Vista.tsx` (nuevo: el loop o el relleno, y la estática de 80 ms), `src/placa/comun.ts`
(nuevo), `src/placa/Placa.tsx` (la prop `navegar` y la pantalla que se apaga),
`src/placa/placa.css` (la grilla pasa a 48×36 y a una capa `.imagen` que colapsa al entrar),
`src/i18n/textos.ts` (las claves del pie), `tests/cursor.test.tsx`.

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin el código. Falla en `tsc`, antes que el comportamiento: la placa
no acepta `navegar` y el diccionario no tiene las claves del pie.

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/cursor.test.tsx(35,33): error TS2322: Type '{ idioma: "es" | "en"; navegar: Mock<Procedure>; }' is not assignable to type 'IntrinsicAttributes & { idioma: Idioma; }'.
  Property 'navegar' does not exist on type 'IntrinsicAttributes & { idioma: Idioma; }'.
tests/cursor.test.tsx(119,51): error TS2322: Type '{ idioma: "es"; navegar: Mock<Procedure>; }' is not assignable to type 'IntrinsicAttributes & { idioma: Idioma; }'.
  Property 'navegar' does not exist on type 'IntrinsicAttributes & { idioma: Idioma; }'.
tests/cursor.test.tsx(158,51): error TS2322: Type '{ idioma: "es"; navegar: Mock<Procedure>; }' is not assignable to type 'IntrinsicAttributes & { idioma: Idioma; }'.
  Property 'navegar' does not exist on type 'IntrinsicAttributes & { idioma: Idioma; }'.
tests/cursor.test.tsx(167,51): error TS2322: Type '{ idioma: "es"; navegar: Mock<Procedure>; }' is not assignable to type 'IntrinsicAttributes & { idioma: Idioma; }'.
  Property 'navegar' does not exist on type 'IntrinsicAttributes & { idioma: Idioma; }'.
tests/cursor.test.tsx(184,39): error TS7053: Element implicitly has an 'any' type because expression of type '"pie.elegir"' can't be used to index type 'Textos'.
  Property 'pie.elegir' does not exist on type 'Textos'.
tests/cursor.test.tsx(185,39): error TS7053: Element implicitly has an 'any' type because expression of type '"pie.jugar"' can't be used to index type 'Textos'.
  Property 'pie.jugar' does not exist on type 'Textos'.
EXIT=2
```

Después del rojo, y antes de escribir el código, el test del pie dejó de buscar `contentinfo`: un
`<footer>` adentro de `<main>` no es ese landmark, así que el test busca los textos del pie.

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build


> hub@0.0.0 lint
> eslint . --max-warnings=0


 RUN  v5.0.5 P:/hub


 Test Files  4 passed (4)
      Tests  54 passed (54)
   Start at  13:45:10
   Duration  1.71s (environment 47%, tests 40%, import 11%, transform 1%, worker 1%)

vite v8.3.5 building client environment for production...
transforming...
✓ 24 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                     0.38 kB │ gzip:  0.26 kB
dist/assets/martian-mono-cyrillic-ext-wdth-normal-BFx_pHPN.woff2    4.81 kB
dist/assets/dela-gothic-one-latin-400-normal-AgyGD05y.woff2        13.80 kB
dist/assets/martian-mono-cyrillic-wdth-normal-Dgr-UBxV.woff2       17.20 kB
dist/assets/dela-gothic-one-latin-400-normal-qxqiosUh.woff         17.44 kB
dist/assets/martian-mono-latin-ext-wdth-normal-DeTdBbNh.woff2      24.66 kB
dist/assets/martian-mono-latin-wdth-normal-1TqSgyfh.woff2          38.49 kB
dist/assets/index-hP6g3bZG.css                                      8.26 kB │ gzip:  2.79 kB
dist/assets/index-CCl2zsaj.js                                     228.70 kB │ gzip: 72.01 kB

✓ built in 87ms
EXIT=0
```

**Revisión visual** (navegador del panel, `npm run dev`):

- 375×812 y el panel en vertical (454×845): la vista previa arriba con la carátula del juego, la
  ficha, y la lista con el cursor en rojo. El pie táctil sólo aparece con puntero grueso. La ficha
  de cuatro líneas pisaba la lista, y se le dio una fila más.
- 1200×750: la lista a la izquierda, la vista previa a la derecha, la ficha y las teclas abajo. El
  panel captura el viewport emulado achicado en una esquina; las medidas se leyeron con
  `getBoundingClientRect` (pantalla de 1087×815 centrada a 1440×900, letra de 30 px).

**Lo que no se pudo ver:** la estática de 80 ms y el apagado de 180 ms, por ser movimiento corto.
Queda para la revisión de H5.

**Lo que apareció y fue al backlog:** H7 (en el celular, la fila que cruza la línea del cursor
queda elegida) y H8 («VOLVISTE»). Las dos están en el contrato y no entraban en H3 sin agrandarlo.

**Sha:** `e26546b`

## H9 — La grilla reemplaza a la placa: un recuadro por ficha visible, y la tecla del número entra · 2026-10-26

Antes del test, la decisión: [ADR-0011](adr/0011-el-hub-es-una-grilla-de-proyectos.md) (commit
`731274c`), con el contrato de dirección nuevo en `.impeccable/surfaces/index-html.md`.

**Archivos:** `src/hub/Hub.tsx` (nuevo: el catálogo, el encabezado con el conteo, los estados y el
atajo de la tecla), `src/hub/Recuadro.tsx` (nuevo: preview, nombre, descripción, host y tecla, con la
luz que sigue al puntero), `src/hub/hub.css` (nuevo), `src/hub/movimiento.ts` y
`src/hub/vistas-de-prueba.ts` (nuevos), `src/catalogo/pedir-catalogo.ts` (nuevo: el pedido de
`/catalogo.json` que antes vivía en la placa), `src/estilos/base.css` (los tokens de la grilla),
`src/main.tsx`, `src/i18n/textos.ts` (las claves `hub.*` reemplazan a las de la placa),
`public/prueba/vistas/` (las capturas de prueba de los seis sitios, con su procedencia al lado),
`tests/hub.test.tsx`. Se borran `src/placa/` y sus tests (`tests/placa.test.tsx`,
`tests/cursor.test.tsx`), y las tipografías de la placa (Martian Mono y Dela Gothic One); entran Geist
y Geist Mono.

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin el código. Falla en `tsc`: no existe el componente del hub ni
sus textos.

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/hub.test.tsx(7,19): error TS2307: Cannot find module '../src/hub/Hub.tsx' or its corresponding type declarations.
tests/hub.test.tsx(45,42): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.proyectos"' can't be used to index type 'Textos'.
  Property 'hub.proyectos' does not exist on type 'Textos'.
tests/hub.test.tsx(62,62): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.cargando"' can't be used to index type 'Textos'.
  Property 'hub.cargando' does not exist on type 'Textos'.
tests/hub.test.tsx(114,36): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.sin-lista"' can't be used to index type 'Textos'.
  Property 'hub.sin-lista' does not exist on type 'Textos'.
tests/hub.test.tsx(121,36): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.sin-lista"' can't be used to index type 'Textos'.
  Property 'hub.sin-lista' does not exist on type 'Textos'.
tests/hub.test.tsx(128,36): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.vacio"' can't be used to index type 'Textos'.
  Property 'hub.vacio' does not exist on type 'Textos'.
tests/hub.test.tsx(141,44): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.proyectos"' can't be used to index type 'Textos'.
  Property 'hub.proyectos' does not exist on type 'Textos'.
tests/hub.test.tsx(146,41): error TS7053: Element implicitly has an 'any' type because expression of type '"hub.captura"' can't be used to index type 'Textos'.
  Property 'hub.captura' does not exist on type 'Textos'.
EXIT=2
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  3 passed (3)
      Tests  40 passed (40)
dist/index.html                                                   0.38 kB │ gzip:  0.26 kB
✓ built in 84ms
EXIT=0
```

**Revisión visual** (Chrome sin cabeza por CDP, 1440×900 y 390×844 con emulación táctil): la grilla
de tres columnas en escritorio y de una en el celular, con las seis capturas de prueba marcadas. En
el celular la imagen de abajo no había cargado por la carga diferida, que se sacó (son seis imágenes
de unos 20 KB). La pista de teclado se esconde en pantallas táctiles.

**Lo que no se pudo ver:** el loop de `vista`, porque ninguna app lo sirve todavía.

**Sha:** `1d1abf9`

## H10 — La aurora de fondo · 2026-10-26

**Archivos:** `src/hub/Aurora.tsx` (nuevo), `src/hub/Hub.tsx` (la aurora detrás del contenido),
`src/hub/hub.css` (las tres manchas, su deriva y la máscara que las apaga hacia la grilla),
`src/estilos/base.css` (los recuadros pasan a una superficie casi opaca, para que la aurora no les
quite contraste), `tests/aurora.test.tsx`.

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin el código:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/aurora.test.tsx(4,22): error TS2307: Cannot find module '../src/hub/Aurora.tsx' or its corresponding type declarations.
EXIT=2
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  4 passed (4)
      Tests  42 passed (42)
✓ built in 82ms
EXIT=0
```

**Revisión visual** (Chrome sin cabeza por CDP, 1440×900 y 390×844 táctil): la aurora queda arriba,
detrás del título, y se apaga antes de la segunda fila. En el celular se esconden la pista de
teclado y las teclas de los recuadros, que ahí no sirven.

**Lo que no se pudo ver:** la deriva, porque una captura es quieta. Dura de 28 a 40 segundos por
vuelta y sólo mueve `transform`.

**Sha:** `56e08d8`

## H4 — La imagen Docker, como la de nonograma · 2026-10-27

**Archivos:** `deploy/nginx.conf` (nuevo: el map de Cache-Control, la CSP con `media-src` para los
loops y el `location = /catalogo.json` que sirve el directorio montado), `Dockerfile` (nuevo: el
gate en la etapa de node y `nginx-unprivileged` al final), `.dockerignore` (nuevo),
`.github/workflows/publicar.yml` (nuevo: publica `ghcr.io/nks21may/hub` desde un runner arm en cada
push a `main`), `tests/despliegue.test.ts` (nuevo).

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin el conf:

```

> hub@0.0.0 gate

 FAIL  tests/despliegue.test.ts [ tests/despliegue.test.ts ]
Error: ENOENT: no such file or directory, open 'P:\hub\.claude\worktrees\prueba-mundo-e9ba37\deploy\nginx.conf'
 Test Files  1 failed | 4 passed (5)
      Tests  42 passed (42)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  5 passed (5)
      Tests  47 passed (47)
✓ built in 204ms
EXIT=0
```

**Fuera del gate.** `docker build -t hub:local .` (el gate corre adentro de la imagen):

```
#12 4.906  Test Files  5 passed (5)
#12 4.906       Tests  47 passed (47)
#12 5.270 ✓ built in 148ms
#15 naming to docker.io/library/hub:local done
BUILD EXIT=0
```

`docker run` con el catálogo de ejemplo montado como directorio en `/usr/share/nginx/catalogo`:

```
portada: 200 text/html; charset=utf-8
HTTP/1.1 200 OK
Content-Type: application/json
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self'; font-src 'self'; img-src 'self'; media-src https://nicolasdalessandro.dev https://*.nicolasdalessandro.dev; connect-src 'self' https://cloudflareinsights.com
Cache-Control: no-cache
assets: 200
Cache-Control: public, max-age=31536000, immutable
```

Sin montar nada:

```
sin montar, /catalogo.json: 404
sin montar, portada: 200
```

En el navegador del panel, contra el contenedor y con la CSP de producción: seis recuadros, seis
imágenes, Geist cargada, la aurora animando y ningún mensaje en la consola.

**Lo que apareció:** el portfolio vive en el dominio pelado (`nicolasdalessandro.dev`), que
`https://*.nicolasdalessandro.dev` no cubre. La CSP lleva los dos para cuando el portfolio sirva su
loop. El repo del hub todavía no tiene remoto: el workflow publica cuando exista `nks21may/hub` en
GitHub.

**Sha:** `2a428b0`

## H5 — La revisión final de `impeccable` y `DESIGN.md` · 2026-10-27

**Archivos:** `tests/tokens.test.ts` (nuevo: junta los colores del `design.json` y falla si un CSS de
`src/` usa otro), `DESIGN.md` y `.impeccable/design.json` (nuevos, del documentador),
`.impeccable/review/` (desktop, mobile y mobile-viewport), `src/estilos/base.css` (los colores
sueltos pasan a tokens: `--hueco`, `--luz`, `--seleccion`, `--barra`, `--anillo`, `--anillo-oscuro`,
`--sombra-vista`), `src/hub/hub.css`, `src/hub/Hub.tsx`, `src/hub/Recuadro.tsx`, `src/hub/Aurora.tsx`,
`src/hub/vistas-de-prueba.ts`, `src/i18n/textos.ts` (`hub.pestana`), `tests/hub.test.tsx` (el título
de la pestaña), `index.html` y `public/favicon.svg`, `public/prueba/vistas/` (recapturadas a
1280×960), y el contrato `.impeccable/surfaces/index-html.md`.

**Gate:** `npm run gate`

**Rojo**, con el test escrito y sin el `design.json`:

```

> hub@0.0.0 gate

 FAIL  tests/tokens.test.ts [ tests/tokens.test.ts ]
Error: ENOENT: no such file or directory, open 'P:\hub\.claude\worktrees\prueba-mundo-e9ba37\.impeccable\design.json'
 Test Files  1 failed | 5 passed (6)
      Tests  47 passed (47)
EXIT=1
```

**La revisión final** (subagente `impeccable-finish-reviewer`, sin la historia de esta sesión):

- **Primera ronda (`fix`, ocho arreglos):**
  - el dominio arriba del título funcionaba como etiqueta y pasó al pie;
  - el pie no figuraba en el contrato y se registró;
  - el calco «captura de prueba» iba en mono y pasó a Geist;
  - la pestaña tenía el título fijo «Hub»: ahora sale del diccionario y hay favicon;
  - a las previews les faltaba un anillo interior;
  - a la aurora le faltaba grano, y medía las manchas en `vmax`;
  - las previews se veían blandas a escala 2 y se recapturaron;
  - la clave de la ronda se corroboró: la imprimió `concept-seed`.
- **Segunda ronda (`fix`):** seis resueltos. El anillo quedó parcial, porque un anillo blanco al 6%
  no se ve sobre bordes saturados, y apareció una regresión: la tecla «5» tapaba el «CH 01» de Museo.
  El anillo pasó a ser doble (2px oscuro y 1px claro) y la tecla se fue a la fila del nombre.
- **Tercera pasada (`ship`):** los dos pendientes, resueltos. El `ship` cubre los arreglos puntuados,
  no una revisión nueva de toda la superficie.

El detector de `impeccable` no dio hallazgos (`[]`) sobre `index.html`, `src/hub/` y
`src/estilos/base.css`.

**El documentador** escribió `DESIGN.md` y `.impeccable/design.json` desde lo construido. Registró
dos diferencias con el contrato a favor del build: el texto es `#eceef3` sólido y no blanco al 92%,
y el anillo es doble.

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  6 passed (6)
      Tests  50 passed (50)
✓ built in 93ms
EXIT=0
```

**El test de tokens, puesto a prueba:** con un `.intruso { color: #ff00aa; }` agregado a mano en
`src/hub/hub.css`, falla con `expected [ 'src\hub\hub.css: #ff00aa' ] to deeply equal []`; sacándolo,
vuelve a verde.

**Sha:** `1ff3040`

## H11 — Menos neón, sin carteles de prueba ni pie explicativo, y una luz de fondo que sigue al mouse · 2026-10-27

Lo pidió el usuario después de ver la grilla terminada: sacar «La lista se arma sola con lo que corre
en el servidor.» y «captura de prueba», usar menos neón y sumar un efecto de fondo que reaccione al
mouse.

**Archivos:** `src/hub/puntero.ts` (nuevo: `acercar`, el suavizado exponencial de la luz, y
`paralaje`), `src/hub/Aurora.tsx` (la luz que sigue al mouse y el corrimiento de las manchas, sin luz
con el dedo ni con movimiento reducido), `src/hub/hub.css` (la capa `.aurora-luz`, el `translate` de
cada mancha a su profundidad, la mezcla de la aurora más baja, sin calco y con el pie de una sola
línea), `src/estilos/base.css` (aurora apagada: `#3a4596`, `#5e4596`, `#23736d`; acento `#9b94d6`;
`--brillo-cursor` nuevo; sin `--velo`; `--radio-vista`), `src/hub/Recuadro.tsx` (sin calco),
`src/hub/Hub.tsx` (el pie es sólo el dominio), `src/i18n/textos.ts` (sin `hub.captura` ni
`hub.pie`), `public/favicon.svg` (los colores apagados), `DESIGN.md` y `.impeccable/design.json` (los
tokens y la prosa al día, en el mismo commit, como pide ADR-0007), el contrato
`.impeccable/surfaces/index-html.md`, las capturas de `.impeccable/review/`, `tests/puntero.test.ts`
(nuevo), `tests/aurora.test.tsx` y `tests/hub.test.tsx`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/puntero.test.ts(2,33): error TS2307: Cannot find module '../src/hub/puntero.ts' or its corresponding type declarations.
EXIT=2
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  7 passed (7)
      Tests  60 passed (60)
✓ built in 92ms
EXIT=0
```

**Revisión visual.** En el navegador del panel, la luz se prende con el primer movimiento y sigue al
mouse (`--cursor-x` 619px, `--cursor-y` 160px con el puntero en 620, 160), y la mancha violeta se
corre con `translate: -15.4px 10.4px`. No queda ningún `.recuadro__calco`, y el pie dice
`nicolasdalessandro.dev`. Las capturas de `.impeccable/review/` se rehicieron. La de escritorio se
tomó moviendo el mouse por CDP hasta (1000, 190). Al 7%, la luz casi no se veía en la captura, y
quedó al 10%.

**Detector:** después de los cambios marcó dos avisos contra `DESIGN.md`:

- el radio del anillo de la preview (`calc(var(--radio) - 1px)`), que pasó a ser el token
  `--radio-vista` de 13px;
- los 26px del nombre de relleno, que entraron a la escala como `relleno`, en lugar del `label` del
  calco, que ya no existe.

Después, `[]`.

**Lo que no se tocó:** [ADR-0011](adr/0011-el-hub-es-una-grilla-de-proyectos.md) dice que la captura
de prueba va «marcada como tal». El usuario pidió sacar la marca, y lo anoto acá en lugar de editar un
ADR aceptado: es un detalle de pantalla barato de revertir. Las capturas siguen siendo material de
prueba, y su procedencia sigue en los `.webp.json` de al lado.

**Sha:** `d9990b5`

## H12 — El fondo es un cielo azul con partículas que se encienden con el mouse · 2026-10-27

Lo pidió el usuario con una referencia: "el fondo me lo imagino más como el de deepmind.google". Antes
del test, la decisión: [ADR-0012](adr/0012-el-fondo-es-un-cielo-de-particulas.md) (commit
`30d6649`), que reemplaza la aurora de ADR-0011 y actualiza la regla 6 del `CLAUDE.md`.

**Qué es el fondo de DeepMind**, mirado en el navegador del panel: no es un video, es un `canvas`
(`<abc-canvas>`). Es un campo azul granulado, de un navy casi negro a un azul francia, con un polvo de
partículas finas que se encienden alrededor del mouse y dejan estela. Arriba lleva la estrella de
Gemini, que no se toma.

**Archivos:** `src/hub/particulas.ts` (nuevo: `sembrar` con una semilla fija, `encender`, `apagar` y
`empuje`), `src/hub/Fondo.tsx` (nuevo: el cielo con sus tres luces, el canvas del polvo y el grano;
reemplaza a `src/hub/Aurora.tsx`), `src/hub/hub.css` (el cielo fijo detrás de todo, sin la aurora ni
la luz del cursor de H11), `src/estilos/base.css` (la paleta pasa a azul: `--fondo` `#050a1c`, las
superficies navy, los grises azulados, el acento `#8fb4ff`, `--cielo-azul`, `--cielo-indigo`,
`--cielo-claro` y `--particula`), `src/hub/Hub.tsx`, `index.html` y `public/favicon.svg`,
`tests/particulas.test.ts` (nuevo), `tests/fondo.test.tsx` (era `aurora.test.tsx`) y
`tests/hub.test.tsx` (los dos silencian `getContext`, que jsdom no trae). También `DESIGN.md` y
`.impeccable/design.json`, reescritos por el documentador de impeccable desde el build, y el contrato
de dirección y las capturas de `.impeccable/review/`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build

tests/fondo.test.tsx(4,21): error TS2307: Cannot find module '../src/hub/Fondo.tsx' or its corresponding type declarations.
tests/particulas.test.ts(2,30): error TS2307: Cannot find module '../src/hub/particulas.ts' or its corresponding type declarations.
tests/particulas.test.ts(3,65): error TS2307: Cannot find module '../src/hub/particulas.ts' or its corresponding type declarations.
tests/particulas.test.ts(23,44): error TS7006: Parameter 'p' implicitly has an 'any' type.
EXIT=2
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  8 passed (8)
      Tests  66 passed (66)
✓ built in 90ms
EXIT=0
```

**Revisión en el navegador.** La primera versión encendía el polvo, pero se veía poco: el brillo
máximo cerca del recorrido llegaba a 128 de 255, porque las motas son tan chicas que no cubren un
píxel entero. Se agrandaron al encenderse, se les sumó un halo tenue, el radio del mouse pasó a 190px
con una caída más suave y la estela a τ de 1,2 s. Con un recorrido de 40 cuadros por la franja del
título, quedan 260 píxeles con alfa mayor a 150 (antes, 0), sin errores en la consola.

También apareció que el canvas medía la ventana con la barra de scroll incluida (768 px contra 753
visibles) y quedaba un poco aplastado: ahora mide su propia caja. La captura de escritorio se tomó
con un recorrido del mouse hecho desde la página, porque los eventos de mouse de CDP no llegaban a
encender el polvo en Chrome sin cabeza.

**Detector:** `[]`. El documentador avisó de un `'#fff'` de reserva suelto en `Fondo.tsx`, que el test
de tokens no ve porque sólo lee CSS; se sacó, y el color sale siempre de `--particula`.

**Sha:** `b73fb4f`

## H13 — El polvo del cielo deriva siempre hacia abajo a la izquierda · 2026-10-27

Lo pidió el usuario comparando con la referencia: "en el de ejemplo las partículas se van moviendo
infinitamente hacia abajo a la izquierda con cierto ángulo". Antes del test, la decisión:
[ADR-0013](adr/0013-el-polvo-deriva-siempre.md) (commit `d81bec3`), que suma la deriva a ADR-0012 y
reemplaza su "se detiene cuando todo se apagó", porque ahora el canvas se dibuja en cada cuadro.

**Archivos:** `src/hub/particulas.ts` (`derivar`: abajo a la izquierda a 35°, 16 px/s para una mota
media, de la mitad a una vez y media según el tamaño, y la que sale por un borde entra por el
opuesto), `src/hub/Fondo.tsx` (con movimiento, el paso a paso arranca al montar y no se detiene; el
mouse sólo deja su posición), `tests/particulas.test.ts`, `tests/fondo.test.tsx` (un canvas 2D de
mentira para ver que pide cuadros sin mouse y que con movimiento reducido no los pide), `DESIGN.md`,
`.impeccable/design.json`, el contrato de dirección y las capturas de `.impeccable/review/`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código (`npx vitest run tests/particulas.test.ts tests/fondo.test.tsx`):

```
     × sin el mouse, el polvo baja solo hacia la izquierda, a unos 35° de la horizontal 2ms
     × depende del tiempo y no de los cuadros: dos medios segundos llegan adonde llega uno entero 0ms
     × las motas más grandes van más rápido, como si estuvieran más cerca 0ms
     × la que sale por un borde entra por el opuesto 0ms
     × después de mucho rato sigue habiendo polvo en toda la ventana 0ms
     × con movimiento, el polvo se anima solo, sin que nadie mueva el mouse 40ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected "vi.fn()" to be called at least once
TypeError: derivar is not a function
 Test Files  2 failed (2)
      Tests  6 failed | 11 passed (17)
EXIT=1
```

El test de movimiento reducido pasó desde el principio: es una guarda para que la deriva no lo rompa.

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  8 passed (8)
      Tests  73 passed (73)
✓ built in 82ms
EXIT=0
```

**Revisión en el navegador.** En el panel, el canvas recibía 2 cuadros por segundo: el panel sin foco
frena `requestAnimationFrame`, y dibujar 600 motas cuesta 0,3 ms, así que no es el polvo. Medido en
Chrome sin cabeza a 1280×800, comparando el canvas con un segundo de diferencia: el polvo se corre
13 px a la izquierda y 9 px hacia abajo (35°), que es lo que da una mota media. La captura de escritorio
lleva un recorrido del mouse y 0,7 s de deriva: la estela se ve corrida abajo a la izquierda del
camino.

**Detector:** `[]`.

**Sha:** `33bf8bc`

## H14 — La imagen ve todo lo que lee el gate · 2026-10-28

El usuario pidió publicar el repo en GitHub (`nks21may/hub`, público) con `main` al día. El primer
push a `main` disparó `build & publish` y falló en el `docker build`: el gate corre adentro y
`tests/tokens.test.ts` (H5) no encontró `.impeccable/design.json`, porque el `.dockerignore` de H4
dejaba afuera toda la carpeta. H4 había probado la imagen antes de que existiera ese test, y nadie
volvió a construirla.

**Archivos:** `.dockerignore` (de `.impeccable` entra sólo el `design.json`, y el archivo ya no se
excluye a sí mismo), `tests/despliegue.test.ts` (dos tests nuevos: junta los archivos que los tests
abren con `resolve(...)` o `new URL(...)` y evalúa el `.dockerignore` como Docker, con la última regla
que coincide ganando y `!` volviendo a meter) y `docs/backlog.md`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el arreglo (`npx vitest run tests/despliegue.test.ts`). Además
del `design.json`, apareció un segundo agujero del mismo tipo: el test del despliegue lee el
`.dockerignore`, que se excluía a sí mismo, así que adentro del build también habría fallado.

```
     × ve todo lo que leen los tests, porque el gate corre adentro 5ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected [ '.dockerignore', …(1) ] to deeply equal []
 Test Files  1 failed (1)
      Tests  1 failed | 6 passed (7)
+ [
+   ".dockerignore",
+   ".impeccable/design.json",
+ ]
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  8 passed (8)
      Tests  75 passed (75)
✓ built in 224ms
EXIT=0
```

**La imagen**, fuera del gate (`docker build --progress=plain -t hub:local .`), con el gate adentro:

```
#12 6.775  Test Files  8 passed (8)
#12 6.775       Tests  75 passed (75)
#12 7.175 ✓ built in 171ms
#15 naming to docker.io/library/hub:local done
EXIT=0
```

Con el catálogo de ejemplo montado en `/usr/share/nginx/catalogo`, `docker run` sirve `/` con 200 y
`/catalogo.json` con 200 y `Cache-Control: no-cache`.

**Sha:** `f9b49d4`

## El hub, en `hub.nicolasdalessandro.dev` · 2026-10-28

Sin ítem de este backlog: lo pidió el usuario en una sesión de `infra` ("Fijate el proyecto hub.
Hostealo"), y el trabajo fue de allá. El usuario eligió el subdominio `hub.`, entre `hub.`,
`proyectos.` y `sala.`. Del lado de `infra`, el `main` de allá llevó I78 a I80 (las fichas y el
catálogo, en `acfaea0`) y después I81 (el stack, en `4feb51f`). La imagen es la de `main`
de acá (`b8e637a`, H14), bajada de GHCR.

Por el túnel, desde la laptop:

```
https://hub.nicolasdalessandro.dev/              200, Cache-Control: no-cache, con la CSP y HSTS
/catalogo.json                                   200 application/json, no-cache
  1 2026-10-28T03:33:17Z ['bhop-surf', 'bot_discord', 'hub', 'minecraft', 'museo', 'neonduel', 'nonograma', 'portafolio']
/.git/config                                     404
```

En el navegador, "6 proyectos": Audio, Neonduel, Portfolio, Surf & Bhop Daily, Museo y Nonograma.
El hub va `oculto` en su propia ficha, y Minecraft también (whitelist). La consola tiene una sola
violación de la CSP, que no es de la app: el script inline que Cloudflare inyecta en cada HTML de
la zona, igual que en nonograma y museo.

Con esto salen de los parkeados el subdominio y lo que faltaba del lado de `infra`.

## H15 — El pato pasea por el hub · 2026-10-28

Lo pidió el usuario: un pato que pasee por el hub y que, al azar, le secuestre el cursor. Lo quiere
desde que carga, pero sin que ataque antes de los 20 segundos. Antes del test, la decisión:
[ADR-0014](adr/0014-el-pato-secuestra-el-cursor.md) (commit `07d9b69`). Una página no puede mover el
puntero del sistema, así que el secuestro va a ser de un cursor dibujado (H16). Este ítem es sólo el
paseo.

Se trabajó en la rama `loop/pato`, que sale de `loop/construccion` (`29d433a`): esa rama estaba
abierta en el worktree de `prueba-mundo`, y no se tocó ese worktree.

**Archivos:** `src/hub/andanzas.ts` (nuevo: `nacer` y `andar`, que lleva al pato hacia su destino a
60 px/s, lo para entre 1 y 4 s al llegar y le elige otro, siempre adentro de la ventana),
`src/hub/Pato.tsx` (nuevo: el SVG del pato, fijo a la ventana, que se mueve con `transform` en cada
cuadro), `src/hub/pato.css` (nuevo: `pointer-events: none`, el espejo, el paso y el bamboleo),
`src/hub/Hub.tsx` (monta al pato), `src/estilos/base.css` (`--pato-pico`, el único color cálido),
`tests/andanzas.test.ts` y `tests/pato.test.tsx` (nuevos), `DESIGN.md` y `.impeccable/design.json`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
tests/andanzas.test.ts(2,25): error TS2307: Cannot find module '../src/hub/andanzas.ts' or its corresponding type declarations.
tests/andanzas.test.ts(3,28): error TS2307: Cannot find module '../src/hub/andanzas.ts' or its corresponding type declarations.
tests/pato.test.tsx(5,20): error TS2307: Cannot find module '../src/hub/Pato.tsx' or its corresponding type declarations.
EXIT=2
```

Con el código, los tests del pato pasaron y quedó un rojo más, el que se esperaba: el test de tokens
(H5) no encontraba el color nuevo del pico en `.impeccable/design.json`.

```
 FAIL  tests/tokens.test.ts > los colores > ningún CSS de src/ usa un color que no esté entre los tokens del design.json
AssertionError: expected [ 'src\estilos\base.css: #f2a03d' ] to deeply equal []
 Test Files  1 failed | 9 passed (10)
      Tests  1 failed | 85 passed (86)
EXIT=1
```

**Verde**, con `pato-pico` en `DESIGN.md` y en `.impeccable/design.json`:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  86 passed (86)
✓ built in 132ms
EXIT=0
```

**Revisión en el navegador.** La primera versión del dibujo era un círculo para la cabeza, un
rectángulo para el cuello y una elipse para el cuerpo: se veían las esquinas del cuello y, con el
cuello largo, parecía un ganso. Quedó una sola silueta, con la cabeza más baja. El pato camina con la
animación `pato-paso` en las patas, parado no la tiene, no ataja clicks (`pointer-events: none`) y la
consola no tiene errores. Con el panel oculto el navegador no pide cuadros (se midieron 0 por
segundo), así que el paso en vivo no se pudo mirar ahí: el test de jsdom es el que lo cubre.

**Detector:** `[]`.

**`DESIGN.md` y `.impeccable/design.json`** los actualicé a mano, con el formato del documentador:
el color `pato-pico`, el componente Pato, el movimiento `paso-de-pato` y un do y un don't. El
documentador de impeccable no corrió en esta iteración. Las capturas de `.impeccable/review/` se
rehacen en H16, cuando el pato ya secuestra el cursor.

**Sha:** `a488114`

## H16 — El pato secuestra el cursor quieto · 2026-10-28

El secuestro de [ADR-0014](adr/0014-el-pato-secuestra-el-cursor.md). El puntero real no se mueve,
porque una página no puede moverlo: se esconde, y lo que el pato se lleva en el pico es una flecha
dibujada.

**Archivos:** `src/hub/andanzas.ts` (`andar` suma las fases `yendo` y `arrastrando`: pasados 20 s de
reloj, al terminar una pausa y con un cursor quieto hace 3 s, va por él con una chance de 0,6; si el
cursor se mueve, lo deja; cuando tiene el `pico` sobre el cursor se lo lleva a la otra mitad de la
pantalla, mirándolo, y lo suelta ahí. `escapar` lo deja parado con su cuac y sin atacar por 30 a
60 s), `src/hub/Pato.tsx` (el reloj de pestaña a la vista, el puntero y cuándo se movió, la flecha
dibujada, `data-pato="secuestro"` en `<html>`, la vuelta de la flecha en 150 ms y el aviso al
cielo), `src/hub/pato.css` (el cuac, `cursor: none` mientras dura y la flecha), `src/hub/puntero.ts`
(`PUNTERO_DIBUJADO`), `src/hub/Fondo.tsx` (trata la flecha como al puntero), `src/hub/Hub.tsx` (le
pasa el idioma al pato), `src/i18n/textos.ts` (`pato.cuac`: «¡CUAC!» y «QUACK!»), los tests de
`andanzas`, del pato y del cielo, `DESIGN.md`, `.impeccable/design.json` y dos capturas nuevas en
`.impeccable/review/`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código (`npx vitest run tests/andanzas.test.ts tests/pato.test.tsx tests/fondo.test.tsx`):

```
     × después de los 20 s, con el cursor quieto, va a buscarlo hasta tenerlo en el pico 6ms
     × si el cursor se mueve mientras va a buscarlo, lo deja 3ms
     × cuando lo agarra, se lleva la presa en el pico hasta la otra mitad de la pantalla y la suelta ahí 2ms
     × si se le escapa, queda parado haciendo cuac, y no vuelve a atacar por 30 s 3ms
     × la flecha que arrastra el pato corre las luces y enciende el polvo, igual que el puntero 4ms
     × pasados los 20 s se lleva el cursor quieto: el real se esconde y la flecha aparece en su lugar 199ms
     × al mover el mouse, la flecha vuelve, el puntero reaparece y el pato hace cuac (es) 162ms
     × al mover el mouse, la flecha vuelve, el puntero reaparece y el pato hace cuac (en) 157ms
     × al irse de la página no deja el puntero escondido 156ms
     × el pato y la flecha no atajan ningún click: su CSS dice pointer-events: none 1ms
⎯⎯⎯⎯⎯⎯ Failed Tests 10 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected -1 to be greater than 0
AssertionError: expected undefined to be defined
TypeError: Cannot read properties of undefined (reading 'pato')
AssertionError: expected '' not to be '' // Object.is equality
AssertionError: expected false to be true // Object.is equality
TypeError: Cannot read properties of null (reading 'style')
 Test Files  3 failed (3)
      Tests  10 failed | 20 passed (30)
EXIT=1
```

El `-1` es el índice del primer instante en `arrastrando`: en 300 s de reloj con el cursor quieto, el
pato nunca dejó de pasear. Los tests de «antes de los 20 s», «un cursor inquieto» y «con el dedo»
pasaron desde el principio: son guardas para que el ataque no las rompa. El gate, con el mismo
árbol, cortaba antes, en `tsc` (`escapar` y `pico` no existían, y `Mundo` no tenía `reloj`).

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  100 passed (100)
✓ built in 85ms
EXIT=0
```

En el medio hubo un rojo de `tsc` sólo en los tests, por `noUncheckedIndexedAccess` (índices de
arreglos que pueden no estar). Se arregló con un ayudante `en` que falla con su motivo si el instante
no existe.

**Revisión en el navegador** (Chrome 156 sin cabeza por CDP, 1280×800; el panel no pedía cuadros
ni a la vista). Con el mouse quieto en (900, 300), sobre Neonduel:

```
medios {"fino":true,"reducido":false}
debajo del puntero real: Neonduel
secuestro: secuestro a los 23.9 s (fase arrastrando)
en vuelo: {"flecha":{"x":707,"y":398,"visible":"visible"},"cursorReal":"none","bajoFlecha":"IMG","bajoPato":"IMG"}
clicks: ["Neonduel"]
sigue el secuestro después del click: secuestro
al mover: {"transform":"translate(906px, 303px)","cuac":"true","pato":"secuestro"}
después: {"pato":null,"flecha":"hidden","cursor":"pointer"}
```

Lo que dice: el primer ataque llegó pasados los 20 s; mientras dura, el puntero real no se ve, y
debajo de la flecha y del pato `elementFromPoint` encuentra la imagen del recuadro, no al pato; un
click sin mover el mouse entró a Neonduel, el proyecto que estaba debajo del puntero real; al mover
el mouse, la flecha salió hacia el puntero real con el cuac, y a los 300 ms el puntero volvió (la
mano del link) y la flecha se escondió. Las capturas son `.impeccable/review/pato-secuestro.png`
(el pato tironeando la flecha sobre Portfolio) y `.impeccable/review/pato-cuac.png` (el cuac, con la
flecha a mitad de camino). Las capturas de la grilla (`desktop.png`, `mobile.png` y
`mobile-viewport.png`) no se rehicieron: lo único que cambia en ellas es que ahora pasa el pato.

**Detector:** `[]`.

**`DESIGN.md` y `.impeccable/design.json`**, a mano otra vez, con el formato del documentador: el
secuestro, la flecha, el escape y el cuac en el componente Pato, y los movimientos `secuestro` y
`vuelta-de-la-flecha`. No hay colores nuevos: la flecha y el cuac usan `texto` y `fondo`.

**Sha:** `8dfb240`

## H17 — El pato parece un pato, y ataca a los 10 s · 2026-10-28

Lo pidió el usuario después de ver H16: «que sean 10 segundos y el pato parece una gaviota ahora».
Antes del test, la decisión de los 10 s y del sonido (H18):
[ADR-0015](adr/0015-el-pato-hace-cuac-con-sonido.md) (commit `b60731e`), que suma a ADR-0014.

**Por qué parecía una gaviota:** blanco con el ala gris, el cuerpo flaco, el cuello largo y la cola en
punta. El dibujo nuevo es amarillo, panzón, de cuello corto y cabeza grande, con el pico ancho y chato
y la cola corta para arriba. El pico se dibuja detrás de la cabeza: la primera versión lo ponía
encima, y se le veía el corte recto pegado a la cara.

**Archivos:** `src/hub/andanzas.ts` (`PRIMER_ATAQUE` a 10 s y la punta del `pico` del dibujo
nuevo), `src/hub/Pato.tsx` (el dibujo), `src/hub/pato.css` (los colores y las caderas nuevas),
`src/estilos/base.css` (`--pato-pluma`, `--pato-ala` y `--pato-pico`, que pasa a un naranja más
fuerte), `tests/andanzas.test.ts` (los 10 s y un test nuevo: alguna semilla ataca entre los 10 y los
20 s), `tests/pato.test.tsx` (el secuestro llega pasados los 10 s), `DESIGN.md`,
`.impeccable/design.json` y las capturas del pato en `.impeccable/review/` (`pato-dibujo.png` es
nueva; `pato-secuestro.png` y `pato-cuac.png`, rehechas).

**Gate:** `npm run gate`

**Rojo**, con los tests pasados a 10 s y sin el código:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
     × a los 10 s ya puede ir: con varias semillas, alguna va por el cursor antes de los 20 s 48ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected false to be true // Object.is equality
 Test Files  1 failed | 9 passed (10)
      Tests  1 failed | 100 passed (101)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  101 passed (101)
✓ built in 108ms
EXIT=0
```

**Revisión en el navegador** (Chrome sin cabeza por CDP, 1280×800, con el mismo recorrido que en
H16):

```
secuestro: secuestro a los 23.1 s (fase arrastrando)
en vuelo: {"pico":{"izquierda":700,"derecha":716,"arriba":342,"abajo":349},"flecha":{"x":700.7,"y":345.2,"visible":"visible"},"cursorReal":"none","bajoFlecha":"IMG","bajoPato":"IMG"}
clicks: ["Neonduel"]
al mover: {"transform":"translate(906px, 303px)","cuac":"true","pato":"secuestro"}
después: {"pato":null,"flecha":"hidden","cursor":"pointer"}
```

La punta de la flecha cae en la punta del pico nuevo, que con el pato mirando a la izquierda es su
borde izquierdo. En esta corrida el primer ataque llegó a los 23 s: desde los 10 s *puede* ir, y
cuándo va depende del azar (dónde termina cada pausa y la chance de 0,6). Lo demás quedó igual que
en H16.

**Detector:** `[]`.

**Sha:** `83cafb1`

## H18 — El pato hace cuac cada tanto, con sonido · 2026-10-28

Lo pidió el usuario junto con H17: «que haga cuack cada tanto con sonido». La decisión, con el límite
del navegador, está en [ADR-0015](adr/0015-el-pato-hace-cuac-con-sonido.md): una página no puede
sonar hasta que el visitante la toca con un click, un toque o una tecla. Mover el mouse no cuenta.

**Archivos:** `src/hub/andanzas.ts` (`andar` mueve al pato y, si le toca, hace cuac: el primero entre
los 8 y los 20 s de reloj y después cada 20 a 45 s; `cuacs` cuenta cada uno, y `escapar` también
suma uno y corre el siguiente para que no salgan dos seguidos), `src/hub/sonido.ts` (nuevo:
`crearVoz`, que crea el contexto de audio recién con un gesto, y `sonarCuac`, el cuac de Web Audio),
`src/hub/Pato.tsx` (destraba la voz con el primer `pointerdown` o `keydown` y suena cada vez que sube
la cuenta de cuacs), `tests/andanzas.test.ts`, `tests/pato.test.tsx` (con un Web Audio de mentira),
`DESIGN.md` y `.impeccable/design.json`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código (`npx vitest run tests/andanzas.test.ts tests/pato.test.tsx`):

```
     × hace cuac solo, cada tanto: el primero entre los 8 y los 20 s, y en tres minutos entre 4 y 9 8ms
     × cuando se le escapa el cursor, también cuenta un cuac 4ms
     × antes de un click o una tecla no hay sonido, pero el cartelito del cuac sale igual 46ms
     × después de un click en la página, cada cuac suena 31ms
     × después de una tecla en la página, cada cuac suena 31ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯
TypeError: actual value must be number or bigint, received "undefined"
AssertionError: expected undefined to be NaN // Object.is equality
AssertionError: expected false to be true // Object.is equality
AssertionError: expected +0 to be 1 // Object.is equality
 Test Files  2 failed (2)
      Tests  5 failed | 28 passed (33)
EXIT=1
```

El `undefined` es el momento del primer cuac: en tres minutos sin cursor el pato no hizo ninguno.
Pasaron desde el principio las guardas: «nunca dos cuacs con menos de 20 s», «cada cuac muestra el
cartelito» y «sin Web Audio no rompe nada». El gate cortaba antes, en `tsc`: `cuacs` no existía en
`Pato`.

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  109 passed (109)
✓ built in 103ms
EXIT=0
```

**Revisión en el navegador** (Chrome sin cabeza por CDP). El cuac se renderizó fuera de línea con la
misma `sonarCuac` del hub, importada del servidor de desarrollo, y se guardó en un WAV para
escucharlo. Después, en la página en vivo, se contaron los contextos de audio y los osciladores:

```
render: pico 0.170 (-15.4 dBFS), un cuac dura 0.177 s
antes del click: {"contextos":0,"osciladores":0}
debajo del click: encabezado
después del click: {"contextos":1,"estado":"running","osciladores":0}
primer cuac con sonido a los 10.8 s del click: {"cuac":"true","osciladores":2}
```

Antes del click no se crea ningún contexto de audio, así que Chrome no avisa nada en la consola. Un
click en el encabezado, que no es un link, lo crea y lo deja sonando. El cuac siguiente arranca sus
dos osciladores (la voz y el temblor) y muestra el cartelito. Cómo suena no lo puede juzgar un test:
el WAV es para que lo escuche el usuario.

**Detector:** `[]`.

**Sha:** `11c54f1`

## H19 — El pato pasa a ser un ganso · 2026-10-28

Lo pidió el usuario después de saber que el sonido de Desktop Goose no se puede usar: sus sonidos son
de su autor, y el hub y su repo son públicos. Antes del test, la decisión:
[ADR-0016](adr/0016-el-pato-pasa-a-ser-un-ganso.md) (commit `38e9fa1`). Es un ganso común (el ánsar
gris), y no el blanco de corral de Desktop Goose ni el canadiense, cuyo cuello negro se pierde contra
el navy. De Desktop Goose se toma sólo la idea.

**Archivos:** `src/hub/Pato.tsx` pasa a `src/hub/Ganso.tsx`, con el dibujo nuevo de 64×64.
`src/hub/pato.css` pasa a `src/hub/ganso.css`, con la rabadilla, las plumas del ala y las caderas
nuevas. `src/hub/andanzas.ts` (el tipo `Ganso`, `graznido`, `graznidos`, `proximoGraznido` y la
punta del pico más arriba, por el cuello largo), `src/hub/sonido.ts` (`graznar` y `sonarGraznido`:
el graznido nuevo), `src/estilos/base.css` (`--ganso-pluma` y `--ganso-ala` gris pardos y
`--ganso-pico`), `src/i18n/textos.ts` (`ganso.graznido`: «¡JONK!» y «HONK!»), `src/hub/Hub.tsx`,
y los comentarios de `Fondo.tsx` y `puntero.ts`. `tests/pato.test.tsx` pasa a
`tests/ganso.test.tsx`, con un test nuevo del cartelito en los dos idiomas, y `tests/andanzas.test.ts`
y `tests/fondo.test.tsx` cambian de nombres. También `DESIGN.md`, `.impeccable/design.json` y las
capturas: `ganso-dibujo.png`, `ganso-secuestro.png` y `ganso-graznido.png` reemplazan a las del
pato. El cambio de nombre lo hizo un script con reglas de frase («hace cuac» → «grazna») antes de
las de palabra («pato» → «ganso»), y después se revisó el diff.

**Gate:** `npm run gate`

**Rojo**, con los tests pasados a ganso y sin el código:

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
tests/andanzas.test.ts(2,21): error TS2305: Module '"../src/hub/andanzas.ts"' has no exported member 'Ganso'.
tests/andanzas.test.ts(234,23): error TS2339: Property 'graznido' does not exist on type 'Pato'.
tests/andanzas.test.ts(291,40): error TS2339: Property 'graznidos' does not exist on type 'Pato'.
tests/ganso.test.tsx(7,21): error TS2307: Cannot find module '../src/hub/Ganso.tsx' or its corresponding type declarations.
tests/ganso.test.tsx(176,43): error TS7053: Element implicitly has an 'any' type because expression of type '"ganso.graznido"' can't be used to index type 'Textos'.
EXIT=2
```

Con el código, quedó el rojo esperado del test de tokens (los dos grises pardos todavía no estaban en
`.impeccable/design.json`):

```
     × ningún CSS de src/ usa un color que no esté entre los tokens del design.json 7ms
 Test Files  1 failed | 9 passed (10)
      Tests  1 failed | 110 passed (111)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  111 passed (111)
✓ built in 109ms
EXIT=0
```

**Revisión en el navegador** (Chrome sin cabeza por CDP). El graznido, renderizado fuera de línea con
la misma `sonarGraznido`, salió primero a −9,6 dBFS por el realce de 2200 Hz. Bajó de 0,5 a 0,26 de
volumen para quedar igual de bajo que el cuac:

```
render: pico 0.171 (-15.3 dBFS), un cuac dura 0.274 s
antes del click: {"contextos":0,"osciladores":0}
debajo del click: encabezado
después del click: {"contextos":1,"estado":"running","osciladores":0}
primer cuac con sonido a los 11.3 s del click: {"cuac":"true","osciladores":2}
```

(Los rótulos dicen «cuac» porque el script de revisión es el de H18.) El secuestro, con el mismo
recorrido de H16:

```
secuestro: secuestro a los 31.5 s (fase arrastrando)
en vuelo: {"pico":{"izquierda":718,"derecha":728,"arriba":358,"abajo":364},"flecha":{"x":727.6,"y":361.8,"visible":"visible"},"cursorReal":"none","bajoFlecha":"IMG","bajoGanso":"IMG"}
clicks: ["Neonduel"]
al mover: {"transform":"translate(906px, 303px)","graznido":"true","ganso":"secuestro"}
después: {"ganso":null,"flecha":"hidden","cursor":"pointer"}
```

La flecha queda en la punta del pico nuevo, el click sin mover el mouse entra a Neonduel y al mover
el mouse el ganso grazna «¡JONK!» y el puntero vuelve.

**Detector:** `[]`.

**Sha:** `88190c6`

## H20 — La CSP deja pasar el script de detección de bots de Cloudflare, con un nonce · 2026-10-28

Lo pidió el usuario: «arreglá el error de Cloudflare». Es la violación de la CSP que se ve en la
consola desde el primer deploy: el script inline que el Bot Fight Mode de la zona inyecta en cada
HTML. Bajado de producción, es éste (recortado):

```
<script>(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a51d58f8485eca14',t:'MTc5MzIyNjIzMw=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';…
```

El `r` es el ray y el `t` un timestamp: cambian en cada pedido, así que un hash no lo deja pasar.
La documentación de Cloudflare dice que, si la CSP de la respuesta trae un nonce, Cloudflare lo
copia a los scripts que inyecta. Antes del test, la decisión:
[ADR-0017](adr/0017-la-csp-lleva-un-nonce-para-cloudflare.md) (commit `5faf22a`).

**Archivos:** `deploy/nginx.conf` (`script-src` suma `'nonce-$request_id'`, con su comentario) y
`tests/despliegue.test.ts` (dos tests: el nonce por pedido, y que siga sin `'unsafe-inline'`).

**Gate:** `npm run gate`

**Rojo:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
     × la CSP lleva un nonce que cambia en cada pedido, para el script que inyecta Cloudflare (ADR-0017) 4ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected [ '\'self\'', …(1) ] to include '\'nonce-$request_id\''
 Test Files  1 failed | 9 passed (10)
      Tests  1 failed | 112 passed (113)
EXIT=1
```

El de «sigue sin `'unsafe-inline'`» pasó desde el principio: es una guarda.

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  113 passed (113)
✓ built in 98ms
EXIT=0
```

**Fuera del gate.** `docker build -t hub:nonce .` terminó con el gate adentro (`Tests 113 passed`).
`docker run` con `ejemplos/` montado en `/usr/share/nginx/catalogo`, y dos pedidos a la portada:

```
script-src 'self' 'nonce-716cb8a4a8ec97ad6ad7b4407d5a1ff5' https://static.cloudflareinsights.com
script-src 'self' 'nonce-b0420e346d61348825c19092cbd3f716' https://static.cloudflareinsights.com
catalogo: 200
```

nginx arranca con el conf nuevo y el nonce cambia en cada pedido. Que Cloudflare copie el nonce a
su script sólo se puede ver en producción, después del deploy: queda pendiente.

**Sha:** `4ad5af8`

## H21 — El HTML no contesta 304 · 2026-10-28

Con H20 en producción (`282543a`), Cloudflare copió el nonce a su script: el HTML salía con
`<script nonce="841a9b50…">`, igual a la cabecera, y los dos scripts que arma adentro del iframe
también. Pero Chrome sin cabeza seguía mostrando la violación. Con un perfil limpio, la primera carga
quedaba sin errores y la segunda no:

```
--- primera carga
documento: 200  nonce de la cabecera 74693b4a7a30b284ce5bc48d8f4b6f3f
--- segunda carga (revalida)
documento: 200  nonce de la cabecera 6e119d845b8a96cb1890d466f3893d29
CSP {"directiva":"script-src-elem","bloqueado":"inline","muestra":"","archivo":"https://hub.nicolasdalessandro.dev/","linea":14,…}
```

Con curl, la causa:

```
HTTP/1.1 200 OK                  content-security-policy: … nonce-39e5507924d8c43755aa4108668df472 …
nonce del cuerpo: nonce="39e5507924d8c43755aa4108668df472"
--- revalidando con If-Modified-Since: Wed, 28 Oct 2026 22:11:35 GMT
HTTP/1.1 304 Not Modified        content-security-policy: … nonce-a47920269adea6db0730806e9dfbbb9e …
```

El navegador junta el 304, que trae un nonce nuevo, con el HTML que tenía guardado, que trae el
viejo. (DevTools lo reporta como 200 porque muestra la respuesta ya combinada.) Antes del test, la
decisión: [ADR-0018](adr/0018-el-html-no-contesta-304.md) (commit `4ba882c`), que suma a ADR-0017 y
corrige su «no pesa, porque el HTML ya sale con `no-cache`».

**Archivos:** `deploy/nginx.conf` (`location = /index.html` con `if_modified_since off` y
`etag off`) y `tests/despliegue.test.ts`.

**Gate:** `npm run gate`

**Rojo:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
     × el HTML nunca contesta 304, para que el nonce del cuerpo sea el de la cabecera (ADR-0018) 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected undefined to be defined
 Test Files  1 failed | 9 passed (10)
      Tests  1 failed | 113 passed (114)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  114 passed (114)
✓ built in 94ms
EXIT=0
```

**Fuera del gate.** `docker build` terminó con el gate adentro (`Tests 114 passed`). Con `docker run`
y pedidos condicionales:

```
/  sin condición: 200  con If-Modified-Since: 200 (522 B)  etag: 0
/index.html  sin condición: 200  con If-Modified-Since: 200 (522 B)  etag: 0
/catalogo.json  sin condición: 200  con If-Modified-Since: 304 (0 B)  etag: 1
pedido 1: HTTP/1.1 200 OK, nonce nonce-df7a679fa6fea0cf5cb7ae6517f1990b
pedido 2: HTTP/1.1 200 OK, nonce nonce-58347b2ffa6b2445da8d937eb48236ba
```

La prueba en producción, con la segunda carga, va después del deploy.

**Sha:** `aa80793`

## H22 — Al ganso se le puede hacer click, y grazna · 2026-10-28

Lo pidió el usuario: «hacé que el ganso haga sonido al hacerle click». El ganso sigue con
`pointer-events: none` (ADR-0014): el click se mira desde la ventana, con la caja del ganso, y sigue
de largo. Como el click es un gesto, destraba el audio y el graznido suena en ese mismo click
(ADR-0015). En el mismo mensaje pidió que el ganso sea 3D como el de Desktop Goose y que ensucie la
pantalla con pisadas. Eso no entró: es el dibujo y el barro de ese programa, y ADR-0016 deja afuera
todo lo que no sea la idea. Se le propusieron alternativas propias.

**Archivos:** `src/hub/andanzas.ts` (`tocar`: grazna en el momento salvo que ya esté graznando, y
corre el graznido solo siguiente), `src/hub/Ganso.tsx` (el `pointerdown` destraba la voz y, si cae
en la caja del ganso, lo toca; el `keydown` sólo destraba), `src/hub/sonido.ts` (`graznar` espera a
que arranque un contexto recién creado), `tests/andanzas.test.ts`, `tests/ganso.test.tsx` y
`DESIGN.md`.

**Gate:** `npm run gate`

**Rojo**, con los tests escritos y sin el código (`npx vitest run tests/andanzas.test.ts tests/ganso.test.tsx`):

```
     × lo hace graznar en el momento, sin cambiarle lo que estaba haciendo 2ms
     × mientras todavía grazna, otro click no suma otro graznido 0ms
     × el graznido solo que seguía se corre, para que no salgan dos seguidos 0ms
     × un click sobre el ganso lo hace graznar, y suena en ese mismo click 6ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
TypeError: tocar is not a function
AssertionError: expected 'false' to be 'true' // Object.is equality
EXIT=1
```

«Un click lejos no grazna» y «el click no se cancela» pasaron desde el principio: son guardas.

**Verde:** `Test Files 10 passed (10)`, `Tests 120 passed (120)`, `✓ built`, `EXIT=0`.

**Sha:** `91681b5`

## H23 — Las patas se mueven también cuando corre y cuando arrastra · 2026-10-28

Lo pidió el usuario: «que las patas se muevan cuando va corriendo a buscar el mouse». Hasta acá el
CSS animaba las patas sólo en `caminando`, y el ganso se deslizaba al correr y al arrastrar.

**Archivos:** `src/hub/ganso.css` (el paso en 0,2 s corriendo y en 0,28 s arrastrando, al ritmo de
los 200 y 150 px/s), `tests/ganso.test.tsx` (lee el CSS: las dos patas en cada fase, más rápido
corriendo, quietas paradas), `DESIGN.md` y `.impeccable/design.json`.

**Gate:** `npm run gate`

**Rojo** (`npx vitest run tests/ganso.test.tsx`):

```
     × se mueven las dos cuando está yendo 2ms
     × se mueven las dos cuando está arrastrando 0ms
     × corriendo a buscar el cursor, van más rápido que caminando 1ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯
 Test Files  1 failed (1)
      Tests  3 failed | 21 passed (24)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  125 passed (125)
✓ built in 90ms
EXIT=0
```

**Revisión en el navegador de H22 y H23** (Chrome sin cabeza por CDP, contra el servidor de
desarrollo, con los contextos de audio y los osciladores contados):

```
antes del click: {"fase":"caminando","graznido":"false",…,"contextos":0,"osciladores":0,"estadoAudio":null} debajo del ganso: Audio
después del click: {"fase":"caminando","graznido":"true",…,"contextos":1,"osciladores":2,"estadoAudio":"running"} el click llegó a: Audio
click lejos: {"graznido":"false","osciladoresNuevos":0}
fase caminando: patas ganso-paso 0.42s
fase parado: patas none 0s
fase yendo: patas ganso-paso 0.2s
fase arrastrando: patas ganso-paso 0.28s
```

El click sobre el ganso crea el contexto de audio, que queda sonando, y el graznido arranca sus dos
osciladores en ese mismo click. El click llegó igual al recuadro de Audio, que estaba debajo.

**Sha:** `73173a9`

## H21 en producción · 2026-10-28

Subido por la sesión que se abrió para eso: `2a152aa` en `origin/main` y `origin/loop/construccion`,
con la CI «build & publish» en verde (corrida 40781487236). Repetido desde acá después del deploy:

```
condicional: 200 (1587 B)
--- primera carga
documento: 200  nonce de la cabecera 7f4f42e7b740865fcfd89b4780f8a5a2
--- segunda carga (revalida)
documento: 200  nonce de la cabecera b36fee2d43861d4d370ea993cc7e4625
```

Un pedido con `If-Modified-Since` trae el HTML entero, y ninguna de las dos cargas, con un perfil
limpio de Chrome sin cabeza, muestra violaciones de la CSP. El error de la consola desde el primer
deploy, el del script de detección de bots de Cloudflare, ya no está.

## H24 — El ganso tiene volumen · 2026-10-28

Lo pidió el usuario: «que sea 3D como el Desktop Goose». El dibujo de ese programa no se toma
(ADR-0016), así que el volumen es propio y sale del tono, como pide la regla «Plano con luz» de
`DESIGN.md`, sin sombra en el piso: la panza en sombra, una luz que corre bajo el lomo, baja por la
nuca y toca la cabeza, el ala del otro lado asomando oscura detrás del lomo, y la pata de atrás en un
naranja más oscuro, en vez de la misma pata con transparencia.

**Archivos:** `src/hub/Ganso.tsx` (la sombra, tres luces y el ala de atrás, todas adentro de la
silueta), `src/hub/ganso.css` (sus colores y la pata de atrás), `src/estilos/base.css`
(`--ganso-sombra`, `--ganso-luz`, `--ganso-ala-de-atras` y `--ganso-pico-sombra`),
`tests/ganso.test.tsx`, `DESIGN.md`, `.impeccable/design.json` y la captura
`.impeccable/review/ganso-dibujo.png`, rehecha.

**Gate:** `npm run gate`

**Rojo** (`npx vitest run tests/ganso.test.tsx`):

```
     × el dibujo trae la sombra de la panza, las luces del lomo y la cabeza, y el ala de atrás 4ms
     × la pata de atrás va en un naranja más oscuro que la de adelante, no transparente 1ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected null not to be null
AssertionError: expected '/* El ganso (ADR-0014): fijo a la ven…' to match /\.ganso__pata--atras\s+\.ganso__pie\s…/
 Test Files  1 failed (1)
      Tests  2 failed | 24 passed (26)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  127 passed (127)
✓ built in 85ms
EXIT=0
```

**Revisión en el navegador** (Chrome sin cabeza por CDP): el ganso ampliado a 5×, parado y
caminando, y a su tamaño sobre la grilla. A 5× se ven las cuatro capas de tono; a 64px, la panza más
oscura y la luz de la nuca alcanzan para que deje de verse plano, sin cambiar la silueta.

**Detector:** `[]`.

**Sha:** `128e6e9`

## H25 — El ganso persigue el cursor aunque se mueva, 8 s como mucho · 2026-10-28

Lo pidió el usuario: que vaya por el cursor aunque no esté quieto, que lo siga 8 s, que se lo lleve
si lo alcanza y, si no, que grazne y vuelva a pasear. Antes, el ADR
([ADR-0019](adr/0019-el-ganso-persigue-el-cursor.md)): cambia la caza de ADR-0014, que había
descartado justo esto. Se va `quietoDesde` del mundo y la regla de los 3 s; el ganso lleva la
`caza` que le queda, y `rendirse` lo para con su «¡JONK!» y la espera de 30 a 60 s. En el
refactor, el «¡JONK!» fuera de la cuenta, que estaba repetido en `escapar`, `tocar` y `rendirse`,
quedó en `graznar`.

**Archivos:** `src/hub/andanzas.ts`, `src/hub/Ganso.tsx` (sin `quietoDesde`),
`tests/andanzas.test.ts` (dos tests de la regla vieja reemplazados por cuatro), `DESIGN.md`,
`.impeccable/design.json`, `.impeccable/surfaces/index-html.md` y `PRODUCT.md`. El ADR, el índice,
el estado de ADR-0014 y la regla 6 del `CLAUDE.md` van en su propio commit (`9c223c0`).

**Gate:** `npm run gate`

**Rojo** (`npx vitest run tests/andanzas.test.ts`): sin `quietoDesde`, el mundo de hoy da el cursor
por recién movido, y el ganso no va nunca.

```
     × a los 10 s ya puede ir: con varias semillas, alguna va por el cursor antes de los 20 s 26ms
     × pasados los 10 s, con el cursor quieto, va a buscarlo hasta tenerlo en el pico 3ms
     × va por un cursor que se mueve todo el tiempo y, si lo alcanza, se lo lleva 3ms
     × lo sigue: si el cursor se va para el otro lado, el ganso da la vuelta y va para allá 3ms
     × si en 8 s no lo alcanza, se para, grazna y vuelve a pasear, y no ataca de nuevo por 30 s 2ms
     × si el puntero sale de la ventana mientras lo persigue, se rinde igual, graznando 3ms
     × cuando lo agarra, se lleva la presa en el pico hasta la otra mitad de la pantalla y la suelta ahí 3ms
     × si se le escapa, queda parado graznando, y no vuelve a atacar por 30 s 4ms
     × cuando se le escapa el cursor, también cuenta un graznido 2ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 9 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected false to be true // Object.is equality
AssertionError: expected -1 to be greater than 0
AssertionError: expected undefined to be defined
Error: no hay un instante -1
 Test Files  1 failed (1)
      Tests  9 failed | 15 passed (24)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  129 passed (129)
✓ built in 91ms
EXIT=0
```

**Sha:** `52432b7`

---

## H26 — Con el cursor en el pico, hay que sacudir el mouse para que lo suelte · 2026-10-28

Con el escape de ADR-0014, un cursor alcanzado mientras se mueve se liberaba en el cuadro siguiente.
Se le preguntó al usuario cómo se saca, y eligió sacudirlo
([ADR-0019](adr/0019-el-ganso-persigue-el-cursor.md)). `sacudir` suma el `forcejeo` mientras el
ganso arrastra y lo suelta a los 400 px; si ya lo dejó en la otra mitad, cualquier movimiento lo
libera. El componente le pasa lo que recorrió cada `pointermove`, y `soltar` queda para cuando el
puntero sale de la ventana o la página se va. El cielo ignora el puntero real mientras `<html>`
dice `data-ganso="secuestro"`: si no, el polvo delataba dónde estaba el puntero escondido, y como
los `pointermove` llegan entre cuadros, le ganaban a la flecha.

**Archivos:** `src/hub/andanzas.ts`, `src/hub/Ganso.tsx`, `src/hub/Fondo.tsx`,
`tests/andanzas.test.ts`, `tests/ganso.test.tsx` (el test del escape pasa a sacudir),
`tests/fondo.test.tsx`, `DESIGN.md`, `.impeccable/design.json` y
`.impeccable/surfaces/index-html.md`.

**Gate:** `npm run gate`

**Rojo** (`npx vitest run tests/andanzas.test.ts tests/ganso.test.tsx tests/fondo.test.tsx`):

```
     × con el cursor en el pico, un movimiento corto no lo suelta 5ms
     × sacudiéndolo 400 px en total, lo suelta, grazna y no vuelve a atacar por 30 s 5ms
     × lo que sacude cuenta aunque el ganso siga caminando entre una sacudida y otra 2ms
     × si ya lo dejó en la otra mitad, cualquier movimiento lo libera 3ms
     × sin presa, mover el mouse no le hace nada 0ms
     × mientras el ganso tiene el cursor, el puntero real, que no se ve, no corre las luces ni enciende el polvo 8ms
     × mientras se lo lleva, mover un poco el mouse no alcanza: la flecha sigue en el pico 44ms
     × sacudiendo el mouse, la flecha vuelve, el puntero reaparece y el ganso grazna (es) 26ms
     × sacudiendo el mouse, la flecha vuelve, el puntero reaparece y el ganso grazna (en) 26ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 9 ⎯⎯⎯⎯⎯⎯⎯
TypeError: sacudir is not a function
AssertionError: expected '0.000' to be '' // Object.is equality
AssertionError: expected { x: 520, y: 410 } to deeply equal { x: 534.4, y: 373.8 }
AssertionError: expected { x: 600, y: 400 } to deeply equal { x: 500, y: 400 }
 Test Files  3 failed (3)
      Tests  9 failed | 54 passed (63)
EXIT=1
```

**Verde:**

```
> hub@0.0.0 gate
> tsc --noEmit && npm run lint && vitest run && vite build
> hub@0.0.0 lint
> eslint . --max-warnings=0
 Test Files  10 passed (10)
      Tests  136 passed (136)
✓ built in 115ms
EXIT=0
```

**Revisión en el navegador** (Chrome sin cabeza por CDP, con el servidor de desarrollo; los tiempos
se cuentan desde 2,5 s después de cargar). H25 y H26 juntos:

```
A: fue a los 10.8 s; lo agarró a los 12.3 s, moviéndose: true
A: tras 40 px de mouse, sigue con el cursor: true flecha true fase arrastrando
A: tras sacudirlo 480 px, graznido true ; suelto: true flecha false
B: fue a los 9.2 s; se rindió 8.00 s después: parado graznido true secuestro false
B: vuelve a pasear 2.3 s después de rendirse
```

En A el mouse da vueltas a 60 px/s y el ganso lo alcanza; en B el mouse se queda siempre 400 px al
costado del pico. Las capturas muestran la flecha en el pico durante el forcejeo, y al ganso parado
con su «¡JONK!» después de rendirse.

**Sha:** `1765fa6`
