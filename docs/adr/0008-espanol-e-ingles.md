# ADR-0008 — Español e inglés

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** en qué idiomas habla la sala y de dónde salen sus textos

## Contexto

A la sala llegan amigos y gente de Discord, recruiters y colegas que vienen de `portfolio4`, y
tráfico suelto. `portfolio4` y `nonograma` ya son bilingües: el primero comparte el contenido entre
idiomas ("si una página muestra un dato distinto a la otra, es un bug"), y el segundo saca todo
texto visible de un diccionario (su ADR-0010).

La voz es rioplatense con humor (`PRODUCT.md`). "Fichines" no tiene traducción literal.

## Decisión

- La sala está en **español e inglés**.
- **Ningún texto visible se escribe en un componente**: todo sale de un diccionario con las dos
  lenguas, y falta una clave en un idioma es un rojo del gate.
- **Las fichas de `infra` traen sus textos en los dos idiomas.** El formato lo fija el ADR de la
  ficha (H1 del backlog). Si a una ficha le falta un idioma, se muestra el que tiene.
- En inglés se mantiene el humor, no la traducción literal.

## Consecuencias

**A favor:** el que viene del portfolio en inglés no rebota; el mismo patrón que `nonograma`.

**En contra:** cada cartel y cada easter egg con texto se escribe dos veces, y las fichas de
`infra` también.

**Se revisa si:** el tráfico en inglés resulta despreciable.

## Alternativas consideradas

- **Sólo español.** Más barato y más fiel a la voz, pero deja afuera a quien llega desde el
  portfolio en inglés.
