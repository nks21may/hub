# ADR-0013 — El polvo del cielo deriva siempre hacia abajo a la izquierda

- **Estado:** aceptado
- **Fecha:** 2026-10-27
- **Decide:** que el polvo del cielo se mueve solo, sin el mouse; suma a ADR-0012 y cambia una de sus
  consecuencias

## Contexto

[ADR-0012](0012-el-fondo-es-un-cielo-de-particulas.md) puso detrás de la grilla un cielo azul con un
polvo que se enciende con el mouse. Sin el mouse, el polvo quedaba quieto, y el canvas dejaba de
dibujar cuando todo se apagaba.

El usuario lo comparó con la referencia, el fondo de deepmind.google, y dijo que le falta algo: "en el
de ejemplo las partículas se van moviendo infinitamente hacia abajo a la izquierda con cierto ángulo".

## Decisión

- El polvo **deriva siempre**, hacia abajo a la izquierda, a unos 35° de la horizontal. Las motas más
  grandes van más rápido, como si estuvieran más cerca. La que sale por un borde vuelve a entrar por
  el opuesto, así que el cielo nunca se vacía.
- El mouse sigue encendiendo y empujando las motas como en ADR-0012. La estela deriva con ellas.
- Con el dedo el polvo deriva igual, porque no depende del puntero, y sigue sin reaccionar al toque.
- Con `prefers-reduced-motion` el polvo queda quieto, como ya decía ADR-0012.

## Consecuencias

**A favor:** el cielo está vivo aunque nadie mueva el mouse, que es lo que el usuario veía en la
referencia y le faltaba al nuestro.

**En contra:** el canvas se dibuja en cada cuadro mientras la pestaña está a la vista, no sólo mientras
se mueve el mouse. Reemplaza el "se detiene cuando todo se apagó" de ADR-0012. Con una mota cada 28px
son unas 1600 en una pantalla de escritorio y unas 260 en un celular, y el navegador deja de pedir
cuadros cuando la pestaña queda atrás.

**Se revisa si:** el canvas pesa en máquinas modestas o en el celular. La primera salida sería dibujar
a menos cuadros por segundo, no sacar la deriva.

## Alternativas consideradas

- **Derivar sólo con el mouse encima:** no es lo que hace la referencia, y en el celular no derivaría
  nunca.
- **Derivar con CSS, moviendo el canvas entero:** no deja que cada mota vaya a su velocidad, y el borde
  del canvas se vería pasar.
