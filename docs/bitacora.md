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
