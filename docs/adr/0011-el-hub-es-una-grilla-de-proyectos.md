# ADR-0011 — El hub es una grilla de proyectos, cada uno con su vista previa

- **Estado:** aceptado; el fondo (la aurora) y la marca de las capturas los reemplaza [ADR-0012](0012-el-fondo-es-un-cielo-de-particulas.md)
- **Fecha:** 2026-10-26
- **Decide:** qué forma y qué mundo visual tiene el hub; reemplaza a ADR-0006 y ADR-0009

## Contexto

[ADR-0006](0006-el-concepto-es-una-sala-de-fichines.md) eligió la sala de fichines, y
[ADR-0009](0009-la-sala-es-una-placa-1000-en-1.md) le dio la forma del menú de una placa
multijuego. La placa se construyó (H1 a H3) y el usuario la vio terminada. No lo convenció:
"en mi mente me imaginaba rectángulos con preview; esto se ve muy retro y no me representa". También
marcó el azul, el logo arcoíris, el CRT, que sea una lista y que se sienta visto.

Se probó entonces el concepto D, el mundo para caminar, como prototipo en la rama
`claude/prueba-mundo-e9ba37`: una galería del centro de Córdoba en corte, con una vidriera por
proyecto. Tampoco convenció.

El 2026-10-26, después de ver los dos, el usuario pidió "un hub simple con los proyectos con
recuadros" y un fondo animado "como el de las páginas de IA". Como vara de terminación eligió
Linear: superficies oscuras, bordes finos y una luz suave.

## Decisión

- El hub es **una grilla de recuadros, uno por ficha visible**. Cada recuadro es un link al
  proyecto y muestra su vista previa, su nombre, su descripción y su host. No hay metáfora: es la
  forma convencional, hecha con el cuidado de Linear.
- **Entrar cuesta un click o una tecla.** El click es el del link. La tecla es el número del
  proyecto (de 1 a 9), que se ve en cada recuadro.
- **El orden y el número son los de ADR-0010**: por fecha de publicación, y con huecos si hay algo
  apagado. El encabezado dice cuántos proyectos hay de verdad.
- **El fondo es una aurora animada**: manchas de color que se mueven lento detrás de la grilla.
  Queda quieta con `prefers-reduced-motion` y nunca le quita contraste a un recuadro.
- La vista previa es la de ADR-0010 (el loop 4:3 que sirve cada app). Mientras no exista, el
  recuadro muestra una captura de prueba marcada como tal, o un relleno con el nombre.
- El formato de la ficha y del catálogo no cambia. Donde ADR-0010 dice "placa" o "juego", se lee
  "hub" o "proyecto".
- El contrato de dirección pasa a ser el de la grilla, en `.impeccable/surfaces/index-html.md`.
  Hasta que exista `DESIGN.md`, la UI se revisa contra él
  ([ADR-0007](0007-frontend-disenado-con-impeccable.md)).

## Consecuencias

**A favor:** se ve de un vistazo todo lo publicado, con un rectángulo con preview por proyecto, que
es lo que el usuario se imaginaba. Escala a 30 sin diseño nuevo (más filas), y en el celular es una
columna. Entrar no tiene ningún paso de más.

**En contra:**

- Se pierden la metáfora y los easter eggs que salían de ella (insertar ficha, el depósito, la
  versión trucha de la placa). Un easter egg, si vuelve, tiene que encontrar su lugar sin metáfora.
- La forma es la que usa cualquiera. Lo propio tiene que salir del contenido (las previews reales,
  el conteo que sale de la VPS) y de la terminación, no del concepto.
- Se tira el código de la placa (H2 y H3). Queda en el historial de git.

**Se revisa si:** el hub empieza a necesitar algo más que entrar (agrupar por tipo, buscar), o si
la grilla se vuelve indistinguible de una plantilla y el usuario quiere volver a una metáfora.

## Alternativas consideradas

- **La placa 1000 en 1** ([ADR-0009](0009-la-sala-es-una-placa-1000-en-1.md)): construida y
  descartada por el usuario por retro y por ser una lista.
- **El mundo para caminar, como galería del centro de Córdoba:** prototipo en la rama
  `claude/prueba-mundo-e9ba37`, descartado por el usuario.
- **La sala a oscuras con una pantalla por proyecto:** otro prototipo, en la rama `prueba-sala`.
- **El fondo liso, y la aurora después:** el usuario pidió la aurora desde el principio.
