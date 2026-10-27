# ADR-0012 — El fondo es un cielo azul con partículas que se encienden con el mouse

- **Estado:** aceptado
- **Fecha:** 2026-10-27
- **Decide:** cómo es el fondo del hub; reemplaza la parte de ADR-0011 que lo definía como una aurora

## Contexto

[ADR-0011](0011-el-hub-es-una-grilla-de-proyectos.md) puso detrás de la grilla una aurora: manchas
de color que derivan lento. Con la grilla terminada, el usuario pidió primero menos neón y un fondo
que reaccione al mouse (H11). Después dio la referencia: "el fondo me lo imagino más como el de
deepmind.google".

Ese fondo es un campo azul profundo y granulado, de un navy casi negro a un azul francia, con un polvo
de partículas finas que se encienden donde pasa el mouse, dejan una estela y se apagan solas. Encima
lleva la estrella de Gemini, que es una marca ajena.

## Decisión

- El fondo es **un cielo azul**: un navy casi negro con luces grandes de azul y de índigo que derivan
  lento, un grano fino y **un polvo de partículas que se encienden con el mouse**. Las partículas se
  apagan solas, dejan una estela y el cursor las empuja un poco.
- Cubre toda la ventana y queda fijo: la grilla pasa por encima al hacer scroll.
- Sin la estrella de Gemini ni ninguna otra forma de una marca ajena. Se toma la técnica, no la
  identidad.
- Con `prefers-reduced-motion` el cielo queda quieto: las partículas se ven tenues y no reaccionan.
  Con el dedo tampoco reaccionan.
- El cielo, el polvo y las luces son decorado: quedan fuera del árbol de accesibilidad y nunca le
  quitan contraste a un recuadro.
- Las capturas de prueba van sin cartel. Lo pidió el usuario en H11, y reemplaza el "marcada como tal"
  de ADR-0011.

El resto de ADR-0011 (la grilla, entrar con un click o una tecla, el conteo real) sigue.

## Consecuencias

**A favor:** es el fondo que el usuario tenía en la cabeza, y el mouse le da vida sin agregar nada
entre el visitante y los proyectos.

**En contra:**

- El azul cambia la paleta entera: los grises del texto suben un tono para leerse sobre azul, y el
  `DESIGN.md` se reescribe.
- Es un `canvas` que se dibuja en cada cuadro mientras el mouse se mueve. Se detiene cuando todo se
  apagó.

**Se revisa si:** el canvas pesa en máquinas modestas o en el celular, o si el azul empieza a pelear
con las previews.

## Alternativas consideradas

- **La aurora apagada de H11, con la luz que sigue al mouse:** el usuario ya la vio y pidió esto.
- **Un shader WebGL, como el de DeepMind:** daría más riqueza, pero suma una dependencia o mucho código
  para un fondo. Un `canvas` 2D alcanza para el polvo, y el degradé sale de CSS.
