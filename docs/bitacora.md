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
