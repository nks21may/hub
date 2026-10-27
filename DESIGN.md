---
name: hub de nicolasdalessandro.dev
description: La grilla de todo lo que corre en nicolasdalessandro.dev, sobre una aurora quieta o lenta.
colors:
  fondo: "#08090b"
  superficie: "rgb(16 17 22 / 0.8)"
  superficie-alta: "rgb(23 24 30 / 0.88)"
  borde: "rgb(255 255 255 / 0.08)"
  borde-fuerte: "rgb(255 255 255 / 0.18)"
  filo: "rgb(255 255 255 / 0.07)"
  texto: "#eceef3"
  texto-2: "#a6a4bc"
  texto-3: "#8a88a0"
  acento: "#9b94d6"
  hueco: "#0e0f13"
  luz: "rgb(255 255 255 / 0.075)"
  seleccion: "rgb(155 148 214 / 0.35)"
  brillo-cursor: "rgb(172 168 226 / 0.1)"
  barra: "#2b2a36"
  anillo: "rgb(255 255 255 / 0.06)"
  anillo-oscuro: "rgb(8 9 11 / 0.6)"
  sombra-vista: "rgb(8 9 11 / 0.32)"
  aurora-indigo: "#3a4596"
  aurora-violeta: "#5e4596"
  aurora-agua: "#23736d"
typography:
  display:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "clamp(34px, 5vw, 56px)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.6vw, 19px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.5
  relleno:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    letterSpacing: "-0.025em"
  mono-host:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
  mono-tecla:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  recuadro: "14px"
  vista: "13px"
  tecla: "6px"
spacing:
  margen: "clamp(16px, 4vw, 48px)"
  grilla: "clamp(16px, 2vw, 24px)"
  recuadro-texto: "18px 20px 20px"
  texto-gap: "6px"
  contenido-max: "1240px"
components:
  recuadro:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.texto}"
    rounded: "{rounded.recuadro}"
    padding: "18px 20px 20px"
  recuadro-hover:
    backgroundColor: "{colors.superficie-alta}"
    textColor: "{colors.texto}"
    rounded: "{rounded.recuadro}"
  tecla:
    backgroundColor: "{colors.superficie-alta}"
    textColor: "{colors.texto}"
    typography: "{typography.mono-tecla}"
    rounded: "{rounded.tecla}"
    padding: "0 7px"
    height: "22px"
  pie:
    textColor: "{colors.texto-2}"
    padding: "20px 0 32px"
---

# Design System: hub de nicolasdalessandro.dev

## Overview

**Creative North Star: "La grilla bien terminada"**

El hub es la forma estándar de la categoría (una grilla de recuadros, uno por proyecto, cada uno con su vista previa) ejecutada sin ironía y con la terminación de Linear como vara. No hay metáfora ni disfraz: lo propio sale del contenido, que son las previews reales y el conteo que llega de la VPS, y del cuidado en los bordes, la luz, el foco y el movimiento.

El mundo es oscuro y denso en información pero callado: fondo casi negro, superficies traslúcidas apenas más claras con un borde de 1px, y arriba de todo una aurora de tres manchas apagadas (índigo, violeta y verde agua) que deriva lento, se apaga hacia la grilla y lleva un grano fino para que el degradé no haga escalones. El mouse corre las manchas un poco, cada una a su profundidad, y lleva una luz suave por toda la página. Nada de neón: el color fuerte lo ponen las capturas de los proyectos, no el cromo ni el fondo.

La interacción firma es una sola y se repite en cada recuadro: con hover o foco el borde se aclara, la superficie sube un tono, la preview se acerca un 3% y una luz radial sigue al puntero. El fondo responde al mouse con la luz que lo sigue y el paralaje de la aurora. Con movimiento reducido la aurora queda quieta, no sigue al mouse y no hay zoom.

**Key Characteristics:**
- Fondo casi negro con una aurora apagada en la franja superior, enmascarada hacia abajo, que el mouse corre y sobre la que deja una luz suave.
- Recuadros traslúcidos de radio 14px con borde blanco al 8% y un filo de luz interior arriba.
- Geist para todo el texto; Geist Mono sólo para hosts, números y el dominio.
- Un único acento violeta, reservado al foco y la selección.
- Cada proyecto tiene su número como una tecla chica junto al nombre.

## Colors

Una paleta casi monocroma, fría y lavanda. El color saturado vive sólo en las capturas; la aurora es apagada.

### Primary
- **Violeta lavanda** (`acento`): el anillo de foco (`outline` de 2px con 3px de separación, 4px en el recuadro) y, al 35%, el fondo de la selección de texto (`seleccion`). No pinta botones, links ni títulos.

### Secondary
- **Índigo de aurora** (`aurora-indigo`), **Violeta de aurora** (`aurora-violeta`) y **Verde agua de aurora** (`aurora-agua`): sólo las manchas del fondo, apagadas y mezcladas al 50%, 46% y 32% con transparente, en `mix-blend-mode: screen`. Son también los tres cuadrados del favicon, junto a uno de `texto` sobre `fondo`.

### Neutral
- **Negro tinta** (`fondo`): el fondo de la página, el `theme-color` y la base del favicon.
- **Pizarra traslúcida** (`superficie`): el recuadro en reposo y el esqueleto mientras carga.
- **Pizarra alta** (`superficie-alta`): el recuadro con hover o foco, y el fondo de la tecla.
- **Hueco** (`hueco`): el fondo del área de la preview, visible mientras carga la imagen o detrás del nombre de relleno.
- **Borde** (`borde`): el contorno de recuadros y esqueletos, el corte entre preview y texto y la línea del pie.
- **Borde fuerte** (`borde-fuerte`): el borde con hover o foco, y el contorno de la tecla.
- **Filo** (`filo`): la línea de luz interior de 1px en el canto superior del recuadro.
- **Luz** (`luz`): el centro de la luz radial de 380px que sigue al puntero.
- **Brillo del cursor** (`brillo-cursor`): el centro de la luz de 560px que sigue al mouse por el fondo de toda la página.
- **Anillo** (`anillo`) y **Anillo oscuro** (`anillo-oscuro`): el asiento de la preview, un anillo interior oscuro de 2px y uno claro de 1px por fuera.
- **Sombra de la vista** (`sombra-vista`): el velo que oscurece el último 28% de la preview.
- **Barra** (`barra`): el pulgar de la barra de scroll.
- **Blanco frío** (`texto`): títulos, nombres de proyecto y la tecla.
- **Gris lavanda** (`texto-2`): el conteo, la pista del atajo, las descripciones, los avisos y el dominio del pie.
- **Gris lavanda apagado** (`texto-3`): los hosts.

### Named Rules
**The Acento Solo Rule.** El violeta lavanda marca dónde está el foco y qué está seleccionado, nada más. Un elemento que lo usa como decoración le roba la señal al teclado.

**The Color Ajeno Rule.** El cromo del hub es neutro; el color fuerte lo traen las previews de los proyectos, y la aurora acompaña apagada. Ningún recuadro, título ni etiqueta se tiñe para competir con una captura.

## Typography

**Display Font:** Geist Variable (con system-ui, sans-serif)
**Body Font:** Geist Variable (con system-ui, sans-serif)
**Label/Mono Font:** Geist Mono Variable (con ui-monospace, monospace)

**Character:** Una sola grotesca neutra y precisa, apretada en los tamaños grandes; la mono aparece sólo donde el dato es literal y se tipea o se lee carácter a carácter.

### Hierarchy
- **Display** (600, clamp(34px, 5vw, 56px), 1.04, -0.035em, máximo 16ch, `text-wrap: balance`): el título del hub, una vez por página.
- **Headline** (400, clamp(16px, 1.6vw, 19px), 1.3, -0.01em, en `texto-2`): el conteo real de proyectos, dentro del h1 y debajo del título.
- **Title** (600, 17px, 1.3, -0.015em): el nombre de cada proyecto.
- **Body** (400, 16px, 1.5): el texto base y los avisos de carga, falta o vacío.
- **Body chico** (400, 14.5px, 1.5, en `texto-2`): la descripción del recuadro, cortada a dos líneas. La pista del atajo va a 14px.
- **Relleno** (600, 26px, -0.025em, en `texto-2`): el nombre de un proyecto sin preview, centrado en el área 4:3.
- **Mono host** (12.5px, en `texto-3`): el host del recuadro; el dominio del pie va en la misma mono a 13px.
- **Mono tecla** (12px, cifras tabulares, interlineado 1): el número dentro de la tecla.

### Named Rules
**The Mono Literal Rule.** Geist Mono es para hosts, números de tecla y el dominio; nunca para títulos, etiquetas ni prosa.

## Layout

Una columna centrada de hasta 1240px con margen lateral fluido (`margen`), arriba el encabezado y abajo la grilla, con el pie separado por una línea de 1px.

- **Encabezado:** flex con wrap, alineado abajo: el título con el conteo a la izquierda y la pista del atajo a la derecha. Separaciones de 20px vertical y 40px horizontal, y clamp(28px, 4.5vw, 48px) hasta la grilla. No hay etiqueta encima del título.
- **Contenido:** padding superior clamp(32px, 7vw, 88px) e inferior clamp(40px, 6vw, 72px).
- **Grilla:** `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` con gap `grilla`. Sale sola en tres columnas en escritorio, dos en tablet y una en el celular, sin breakpoints. Cada celda estira su recuadro para que la fila quede pareja.
- **Recuadro:** preview 4:3 arriba; debajo, el texto con padding `recuadro-texto` y 6px entre líneas, y el host 6px más abajo.
- **Pie:** sólo el dominio, en mono, a 20px de la línea y 32px del borde inferior.
- **Táctil:** con `(hover: none) and (pointer: coarse)` desaparecen la pista del atajo y las teclas de los recuadros.

## Elevation & Depth

El hub es plano con capas tonales: la profundidad sale de superficies traslúcidas un tono más claras que el fondo y de luces interiores, no de sombras proyectadas. Nada flota sobre la grilla ni proyecta sombra hacia afuera.

### Shadow Vocabulary
- **Filo** (`box-shadow: inset 0 1px 0 var(--filo)`): el canto de luz arriba de cada recuadro.
- **Asiento de la preview** (`box-shadow: inset 0 0 0 2px var(--anillo-oscuro), inset 0 0 0 3px var(--anillo)` más `linear-gradient(transparent 72%, var(--sombra-vista))`): separa los bordes brillantes de una captura del borde del recuadro.
- **Luz de puntero** (`radial-gradient(380px circle at var(--luz-x) var(--luz-y), var(--luz), transparent 62%)`): aparece con hover o foco en 0.25s.

### Named Rules
**The Plano Con Luz Rule.** La profundidad se dice con tono y con luz interior. Si un elemento nuevo pide una sombra hacia afuera, va otro tono de superficie.

## Shapes

Esquinas suaves y consistentes: 14px (`recuadro`) en recuadros y esqueletos, y la preview recorta su anillo a 13px arriba para seguir el borde. La tecla usa 6px (`tecla`). Las manchas de la aurora son círculos. Todos los bordes son de 1px, salvo el inferior de la tecla, de 2px, que la asienta como una tecla física.

## Components

### Recuadro (el proyecto)
Callado en reposo, despierta entero cuando se le acerca el puntero o el foco.
- **Corner Style:** 14px.
- **Background:** `superficie` en reposo, `superficie-alta` con hover o foco.
- **Shadow Strategy:** el filo interior y la luz de puntero (ver Elevation & Depth).
- **Border:** 1px `borde`, `borde-fuerte` con hover o foco, en 0.2s ease-out.
- **Internal Padding:** 18px 20px 20px bajo la preview.
- **Contenido:** preview 4:3 (video del loop de la app, captura del sitio sin cartel, o el nombre de relleno), cabeza con nombre y tecla, descripción en dos líneas y host en mono.
- **Hover / Focus:** la imagen o el video escala a 1.03 en 0.6s `cubic-bezier(0.2, 0.7, 0.2, 1)`; el foco suma el anillo de acento a 4px del borde. Todo el recuadro es un único link.

### Tecla
El número de cada proyecto como una tecla real: mono 12px con cifras tabulares, mínimo 22×22px, padding 0 7px, borde 1px `borde-fuerte` con 2px abajo, radio 6px y fondo `superficie-alta`. Va junto al nombre del proyecto y, como rango («1–6»), en la pista del encabezado.

### Esqueleto
Tres recuadros quietos de proporción 4:3.9, con el borde, el radio y la superficie del recuadro, mientras llega el catálogo. No pulsan.

### Aurora (fondo)
Tres manchas radiales de clamp(560px, 72vw, 1150px), y la de agua de clamp(440px, 54vw, 860px), en `mix-blend-mode: screen`, en una franja de min(110vh, 1100px) enmascarada de negro al 30% a transparente al 92%. Derivan en 28s, 34s (al revés) y 40s, `ease-in-out` y alternadas. Encima, un grano `feTurbulence` en escala de grises al 5% de opacidad en `overlay`. El mouse las corre con `translate` hasta 36px en x y 24px en y, cada una a su profundidad (1, -0,7 y 1,4), y una capa fija lleva `brillo-cursor` en un círculo de 560px que sigue al mouse con suavizado exponencial (τ de 0,12 s) y aparece en 0,6 s. Con el dedo no hay luz. Es decorado: fuera del árbol de accesibilidad, y con movimiento reducido queda quieta y sin luz.

## Do's and Don'ts

### Do:
- **Do** dejar que el color venga de las previews; el cromo va en `fondo`, `superficie` y los grises lavanda.
- **Do** reservar `acento` al anillo de foco (2px, separación 3px) y a la selección.
- **Do** usar Geist Mono sólo para hosts, números y el dominio.
- **Do** repetir la respuesta firma en todo lo que sea entrar a un proyecto: borde a `borde-fuerte`, superficie a `superficie-alta`, preview a 1.03 y luz de puntero.
- **Do** apagar el movimiento con `prefers-reduced-motion`: aurora quieta, sin zoom y sin transiciones en el recuadro.
- **Do** asentar toda captura con el anillo oscuro y claro y el velo inferior antes de ponerla dentro de un recuadro.

### Don't:
- **Don't** poner una etiqueta o línea chica encima del título; el dominio va al pie, en mono.
- **Don't** usar sombras proyectadas hacia afuera ni sombras duras desplazadas; la profundidad es tonal.
- **Don't** saturar la aurora ni el acento: el fondo va apagado y el color fuerte lo ponen las capturas.
- **Don't** traer CRT, pixel art, neón ni arcoíris al cromo del hub. Las previews de los proyectos muestran lo que cada proyecto es, aunque sea pixel art o neón, y no se retocan.
- **Don't** copiar las identidades vecinas: ni la ficha técnica de `portfolio4` (Schibsted Grotesk e IBM Plex Mono, filas etiqueta/valor) ni la tele de `museo`.
- **Don't** mostrar la tecla en pantallas táctiles sin puntero fino.
