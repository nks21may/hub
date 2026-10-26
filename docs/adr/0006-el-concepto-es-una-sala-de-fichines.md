# ADR-0006 — El concepto es una sala de fichines

- **Estado:** aceptado; la forma "una máquina por proyecto" la reemplaza [ADR-0009](0009-la-sala-es-una-placa-1000-en-1.md)
- **Fecha:** 2026-10-26
- **Decide:** qué metáfora organiza el hub

## Contexto

Los sitios propios que ya están publicados no usan la metáfora como decoración, sino como forma de
uso: `museo` se recorre como una tele (canales, guía, teletexto) y `portfolio4` es una ficha técnica
(filas etiqueta/valor). Esas dos ya están tomadas.

De los seis proyectos que hoy entran a la sala ([ADR-0005](0005-entra-lo-que-cualquiera-puede-usar.md)),
cinco son cosas para usar: tres juegos (neonduel, surf, nonograma), el museo y el puente de audio.

Los candidatos se midieron contra cuatro criterios:

1. entrar a un proyecto cuesta un click o una tecla;
2. anda en el celular;
3. aguanta pasar de 6 a 30 proyectos;
4. los casos raros (caído, apagado, oculto, muerto) entran en la historia y no como excepciones.

## Decisión

- El hub es una **sala de fichines**: cada proyecto es una máquina, y entrar a una cuesta un click
  o un Enter.
- La metáfora absorbe los casos raros, y cómo lo hace se decide al diseñar: una máquina caída es
  una máquina "fuera de servicio"; los proyectos muertos son el depósito del fondo.
- El aspecto visual sale de `impeccable` ([ADR-0007](0007-frontend-disenado-con-impeccable.md)). El
  riesgo conocido es el arcade de neón y pixel art que ya hizo todo el mundo, y ese diseño tiene que
  esquivarlo.
- Las otras dos metáforas que interesaron, la **terminal** y el **mundo para caminar**, quedan
  documentadas en [docs/conceptos.md](../conceptos.md). No se descartan por malas, sino por
  ahora.

## Consecuencias

**A favor:** el verbo del hub ("entrar a jugar") coincide con el de la metáfora; los easter eggs
salen solos (insertar ficha, el código Konami, el modo demo, una tabla de récords).

**En contra:** dos de las seis máquinas no son juegos (`museo`, `audio.`) y `portfolio4` tampoco:
la sala tiene que hacerlas sentir en su lugar.

**Se revisa si:** la mayoría de lo publicado deja de ser algo para usar y pasa a ser algo para leer.

## Alternativas consideradas

- **Terminal falsa** (`ls`, `open surf`, `sudo`): la más fértil para easter eggs, pero incómoda en
  el celular, lenta para quien no la conoce y muy vista. Detalle en [docs/conceptos.md](../conceptos.md).
- **Mundo para caminar** (un pueblito visto desde arriba, un edificio por proyecto): la más
  divertida, pero la más lenta para llegar a un proyecto y la más cara de hacer. Detalle en
  [docs/conceptos.md](../conceptos.md).
- **Tablero de salidas** (split-flap, un proyecto por partida con su estado real): el que mejor usa
  la data de `infra`, pero es más un panel que algo divertido. El estado en vivo, si se quiere,
  puede vivir en la sala igual.
