---
name: hub de nicolasdalessandro.dev
description: La grilla de todo lo que corre en nicolasdalessandro.dev, sobre un cielo azul cuyo polvo se enciende con el mouse.
colors:
  fondo: "#050a1c"
  superficie: "rgb(9 14 32 / 0.8)"
  superficie-alta: "rgb(15 22 46 / 0.88)"
  borde: "rgb(255 255 255 / 0.08)"
  borde-fuerte: "rgb(255 255 255 / 0.18)"
  filo: "rgb(255 255 255 / 0.07)"
  texto: "#eef1f8"
  texto-2: "#b9c0dc"
  texto-3: "#8f98bb"
  acento: "#8fb4ff"
  hueco: "#0a1126"
  luz: "rgb(255 255 255 / 0.075)"
  seleccion: "rgb(143 180 255 / 0.35)"
  barra: "#1c2440"
  anillo: "rgb(255 255 255 / 0.06)"
  anillo-oscuro: "rgb(5 10 28 / 0.6)"
  sombra-vista: "rgb(5 10 28 / 0.32)"
  cielo-azul: "#1f56c3"
  cielo-indigo: "#15287a"
  cielo-claro: "#4a8fe6"
  particula: "#d6e4ff"
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

El mundo es un cielo azul fijo detrás de todo: un navy casi negro abajo a la izquierda que sube a un azul francia arriba a la derecha, con tres luces grandes (azul, índigo y una clara) que derivan lento, un grano fino y un polvo de motas claras. El mouse corre las luces un poco, cada una a su profundidad, y enciende el polvo por donde pasa: las motas se agrandan, llevan un halo tenue, dejan estela y se apagan solas. Encima, superficies navy traslúcidas con un borde de 1px; el azul vive en el cielo y en los grises del texto, y el color fuerte lo siguen poniendo las capturas de los proyectos.

La interacción firma del recuadro es una sola y se repite en cada uno: con hover o foco el borde se aclara, la superficie sube un tono, la preview se acerca un 3% y una luz radial sigue al puntero. Con movimiento reducido o con el dedo, el cielo queda quieto y el polvo, tenue y sin reaccionar; con movimiento reducido tampoco hay zoom.

**Key Characteristics:**
- Un cielo azul fijo a pantalla completa: degradé de navy a azul francia, tres luces que derivan y se corren con el mouse, grano y un polvo que se enciende por donde pasa el puntero.
- Recuadros navy traslúcidos de radio 14px con borde blanco al 8% y un filo de luz interior arriba.
- Geist para todo el texto; Geist Mono sólo para hosts, números y el dominio.
- Un único acento azul claro, reservado al foco y la selección.
- Cada proyecto tiene su número como una tecla chica junto al nombre.

## Colors

Una paleta fría y azul: un cielo saturado detrás y un cromo navy casi monocromo delante; el color fuerte de primer plano vive en las capturas.

### Primary
- **Azul hielo** (`acento`): el anillo de foco (`outline` de 2px con 3px de separación, 4px en el recuadro) y, al 35%, el fondo de la selección de texto (`seleccion`). No pinta botones, links ni títulos.

### Secondary
- **Azul de cielo** (`cielo-azul`): la luz grande de arriba a la derecha, mezclada al 72% con transparente, y la mitad azul del degradé del cielo (42% sobre `fondo`, a 205°).
- **Índigo de cielo** (`cielo-indigo`): la luz grande de la izquierda, al 70%.
- **Azul claro de cielo** (`cielo-claro`): la luz chica y más brillante de la esquina superior derecha, al 48%.

Las tres luces van en `mix-blend-mode: screen` y son también tres cuadrados del favicon, junto a uno de `texto` sobre `fondo`.

### Tertiary
- **Polvo** (`particula`): el color de las motas del canvas, que lo lee de la propiedad `color` del canvas. En reposo se ven al 4–14% de opacidad (unas pocas, al 26–36%); encendidas llegan a opacidad plena.

### Neutral
- **Navy noche** (`fondo`): el fondo de la página, la base y la esquina inferior izquierda del cielo, el `theme-color` y la base del favicon.
- **Navy traslúcido** (`superficie`): el recuadro en reposo y el esqueleto mientras carga.
- **Navy alto** (`superficie-alta`): el recuadro con hover o foco, y el fondo de la tecla.
- **Hueco** (`hueco`): el fondo del área de la preview, visible mientras carga la imagen o detrás del nombre de relleno.
- **Borde** (`borde`): el contorno de recuadros y esqueletos, el corte entre preview y texto y la línea del pie.
- **Borde fuerte** (`borde-fuerte`): el borde con hover o foco, y el contorno de la tecla.
- **Filo** (`filo`): la línea de luz interior de 1px en el canto superior del recuadro.
- **Luz** (`luz`): el centro de la luz radial de 380px que sigue al puntero dentro del recuadro.
- **Anillo** (`anillo`) y **Anillo oscuro** (`anillo-oscuro`): el asiento de la preview, un anillo interior oscuro de 2px y uno claro de 1px por fuera.
- **Sombra de la vista** (`sombra-vista`): el velo que oscurece el último 28% de la preview.
- **Barra** (`barra`): el pulgar de la barra de scroll.
- **Blanco frío** (`texto`): títulos, nombres de proyecto y la tecla.
- **Gris azulado** (`texto-2`): el conteo, la pista del atajo, las descripciones, los avisos, el nombre de relleno y el dominio del pie.
- **Gris azulado apagado** (`texto-3`): los hosts.

### Named Rules
**The Acento Solo Rule.** El azul hielo marca dónde está el foco y qué está seleccionado, nada más. Un elemento que lo usa como decoración le roba la señal al teclado.

**The Cielo Detrás Rule.** El azul saturado es del cielo y se queda detrás: arriba a la derecha brilla, abajo a la izquierda vuelve a `fondo`, y todo lo que está delante es navy traslúcido con texto blanco y gris azulado. Ningún recuadro, título ni etiqueta se tiñe de azul para competir con una captura.

## Typography

**Display Font:** Geist Variable (con system-ui, sans-serif)
**Body Font:** Geist Variable (con system-ui, sans-serif)
**Label/Mono Font:** Geist Mono Variable (con ui-monospace, monospace)

**Character:** Una sola grotesca neutra y precisa, apretada en los tamaños grandes; la mono aparece sólo donde el dato es literal y se tipea o se lee carácter a carácter.

### Hierarchy
- **Display** (600, clamp(34px, 5vw, 56px), 1.04, -0.035em, máximo 16ch, `text-wrap: balance`): el título del hub, una vez por página.
- **Headline** (400, clamp(16px, 1.6vw, 19px), 1.3, -0.01em, en `texto-2`): el conteo real de proyectos, dentro del h1 y 14px debajo del título.
- **Title** (600, 17px, 1.3, -0.015em): el nombre de cada proyecto.
- **Body** (400, 16px, 1.5): el texto base y los avisos de carga, falta o vacío.
- **Body chico** (400, 14.5px, 1.5, en `texto-2`): la descripción del recuadro, cortada a dos líneas. La pista del atajo va a 14px.
- **Relleno** (600, 26px, -0.025em, en `texto-2`): el nombre de un proyecto sin preview, centrado en el área 4:3.
- **Mono host** (12.5px, en `texto-3`): el host del recuadro; el dominio del pie va en la misma mono a 13px, en `texto-2`.
- **Mono tecla** (12px, cifras tabulares, interlineado 1): el número dentro de la tecla.

### Named Rules
**The Mono Literal Rule.** Geist Mono es para hosts, números de tecla y el dominio; nunca para títulos, etiquetas ni prosa.

## Layout

Una columna centrada de hasta 1240px con margen lateral fluido (`margen`), arriba el encabezado y abajo la grilla, con el pie separado por una línea de 1px. El cielo no participa del flujo: está fijo a la ventana y la columna pasa por encima al hacer scroll.

- **Encabezado:** flex con wrap, alineado abajo: el título con el conteo a la izquierda y la pista del atajo a la derecha. Separaciones de 20px vertical y 40px horizontal, y clamp(28px, 4.5vw, 48px) hasta la grilla. No hay etiqueta encima del título.
- **Contenido:** padding superior clamp(32px, 7vw, 88px) e inferior clamp(40px, 6vw, 72px).
- **Grilla:** `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` con gap `grilla`. Sale sola en tres columnas en escritorio, dos en tablet y una en el celular, sin breakpoints. Cada celda estira su recuadro para que la fila quede pareja.
- **Recuadro:** preview 4:3 arriba; debajo, el texto con padding `recuadro-texto` y 6px entre líneas, y el host 6px más abajo.
- **Pie:** sólo el dominio, en mono, a 20px de la línea y 32px del borde inferior.
- **Táctil:** con `(hover: none) and (pointer: coarse)` desaparecen la pista del atajo y las teclas de los recuadros.

## Elevation & Depth

Hay dos planos. Atrás, el cielo, que es el único lugar con profundidad atmosférica: luces en `screen`, grano en `overlay` y un polvo que tiene luz propia. Adelante, todo es plano con capas tonales: la profundidad sale de superficies navy traslúcidas un tono más claras que el fondo y de luces interiores, no de sombras proyectadas. Nada flota sobre la grilla ni proyecta sombra hacia afuera.

### Shadow Vocabulary
- **Filo** (`box-shadow: inset 0 1px 0 var(--filo)`): el canto de luz arriba de cada recuadro.
- **Asiento de la preview** (`box-shadow: inset 0 0 0 2px var(--anillo-oscuro), inset 0 0 0 3px var(--anillo)` más `linear-gradient(transparent 72%, var(--sombra-vista))`): separa los bordes brillantes de una captura del borde del recuadro.
- **Luz de puntero** (`radial-gradient(380px circle at var(--luz-x) var(--luz-y), var(--luz), transparent 62%)`): aparece con hover o foco en 0.25s.

### Named Rules
**The Plano Con Luz Rule.** Delante del cielo, la profundidad se dice con tono y con luz interior. Si un elemento nuevo pide una sombra hacia afuera, va otro tono de superficie.

## Shapes

Esquinas suaves y consistentes: 14px (`recuadro`) en recuadros y esqueletos, y la preview recorta su anillo a 13px arriba para seguir el borde. La tecla usa 6px (`tecla`). Las luces del cielo son círculos y las motas, puntos redondos de 0,5 a 1,6px de radio. Todos los bordes son de 1px, salvo el inferior de la tecla, de 2px, que la asienta como una tecla física.

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

### Cielo (fondo)
Fijo a pantalla completa, detrás de todo y fuera del árbol de accesibilidad.
- **Degradé:** `linear-gradient(205deg)` de `cielo-azul` al 42% sobre `fondo` hasta `fondo` al 72%, con un `radial-gradient(120% 90% at 0% 100%)` de `fondo` que oscurece la esquina inferior izquierda.
- **Luces:** dos de clamp(560px, 70vw, 1200px) (azul arriba a la derecha, índigo a la izquierda) y una clara de clamp(320px, 34vw, 620px) arriba a la derecha, en `screen`. Derivan en 30s, 38s (al revés) y 26s, `ease-in-out` y alternadas. El mouse las corre con `translate` hasta 32px en x y 22px en y, cada una a su profundidad (1, -0,7 y 1,5).
- **Grano:** `feTurbulence` fractal (frecuencia 0,85, dos octavas) desaturado, al 6% en `overlay`, para que el degradé no haga escalones.
- **Polvo:** un canvas 2D con una mota cada 28px (el 62% de las celdas, corrida al azar, con semilla fija: el mismo cielo en cada visita). El mouse enciende las motas a menos de 190px según cuánto se mueve, las agranda hasta el doble y las empuja hasta 8px hacia afuera; una mota encendida lleva un halo de 2,6 veces su radio al 8% de su energía y se apaga con τ de 1,2 s. Mientras hay movimiento, las motas en reposo titilan un poco. El puntero se suaviza con τ de 0,12 s. El dibujo se detiene cuando todo se apagó.
- **Quieto:** con `prefers-reduced-motion` las luces no derivan, no siguen al mouse y el polvo queda tenue y quieto; con el dedo el polvo no reacciona.

## Do's and Don'ts

### Do:
- **Do** dejar que el color de primer plano venga de las previews; el cromo va en `fondo`, `superficie` y los grises azulados.
- **Do** reservar `acento` al anillo de foco (2px, separación 3px) y a la selección.
- **Do** usar Geist Mono sólo para hosts, números y el dominio.
- **Do** repetir la respuesta firma en todo lo que sea entrar a un proyecto: borde a `borde-fuerte`, superficie a `superficie-alta`, preview a 1.03 y luz de puntero.
- **Do** apagar el movimiento con `prefers-reduced-motion`: cielo quieto, polvo tenue sin reaccionar, sin zoom y sin transiciones en el recuadro.
- **Do** asentar toda captura con el anillo oscuro y claro y el velo inferior antes de ponerla dentro de un recuadro.
- **Do** mantener el cielo como decorado: fijo, `aria-hidden` y sin quitarle contraste a ningún recuadro.

### Don't:
- **Don't** poner una etiqueta o línea chica encima del título; el dominio va al pie, en mono.
- **Don't** usar sombras proyectadas hacia afuera ni sombras duras desplazadas; delante del cielo la profundidad es tonal.
- **Don't** llevar el azul saturado del cielo a recuadros, títulos o etiquetas: el cielo brilla atrás y el primer plano es navy.
- **Don't** poner la estrella de Gemini ni ninguna forma de una marca ajena en el cielo; de deepmind.google se toma la técnica, no la identidad.
- **Don't** traer CRT, pixel art, neón ni arcoíris al cromo del hub. Las previews de los proyectos muestran lo que cada proyecto es, aunque sea pixel art o neón, y no se retocan.
- **Don't** copiar las identidades vecinas: ni la ficha técnica de `portfolio4` (Schibsted Grotesk e IBM Plex Mono, filas etiqueta/valor) ni la tele de `museo`.
- **Don't** mostrar la tecla en pantallas táctiles sin puntero fino.
