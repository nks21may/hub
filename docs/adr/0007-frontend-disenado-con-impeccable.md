# ADR-0007 — El frontend se diseña con la skill `impeccable`

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** cómo se decide el diseño visual y de interacción del hub

## Contexto

El pedido es que la sala "quede bonita". En los otros repos con interfaz (`nonograma`, `museo`,
`osint`, `turnero`, `Coordinador`, `portfolio4`), el diseño se fijó con la skill `impeccable`. La
skill deja escrito un `PRODUCT.md` (para quién es, qué tiene que sentirse) y un `DESIGN.md`
(tokens, tipografía, color, componentes), contra los que se revisa cada pantalla.

## Decisión

- El diseño se define con `impeccable`, que escribe **`PRODUCT.md`** y **`DESIGN.md`** en la raíz.
- La UI se construye contra esos dos documentos: un color, una tipografía o un espaciado que no
  sale de `DESIGN.md` es un hallazgo de review.
- Los cambios de diseño pasan por `impeccable` y actualizan `DESIGN.md` en el mismo commit.

## Consecuencias

**A favor:** el criterio visual queda escrito y no depende de quién toque la pantalla.

**En contra:** un ajuste visual chico también tiene que reflejarse en `DESIGN.md`.

**Se revisa si:** `DESIGN.md` deja de coincidir con lo que se ve y nadie lo actualiza.

## Alternativas consideradas

- **Diseñar sobre la marcha, pantalla por pantalla:** así terminan las interfaces inconsistentes,
  sin nada contra qué revisar.
