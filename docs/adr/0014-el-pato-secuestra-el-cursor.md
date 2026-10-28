# ADR-0014 — Un pato pasea por el hub y secuestra el cursor quieto

- **Estado:** aceptado
- **Fecha:** 2026-10-28
- **Decide:** cuál es el primer easter egg del hub, y qué reglas lo mantienen fuera del camino a un
  proyecto

## Contexto

`PRODUCT.md` promete easter eggs para el que se queda, y su principio 4 dice que un secreto nunca
se interpone en el camino a una máquina. Con la grilla
([ADR-0011](0011-el-hub-es-una-grilla-de-proyectos.md)) se perdieron los easter eggs que salían de
la metáfora, y ese ADR dejó dicho que uno que vuelva tiene que encontrar su lugar sin ella.

El usuario propuso un pato que pasee por el hub y que, al azar, ataque al cursor: que lo secuestre y
se lo lleve de un lado a otro de la pantalla. Lo quiere desde que carga la página, pero sin que
ataque antes de los 20 segundos.

Dos límites concretos:

- **Una página no puede mover el puntero del sistema.** No hay API web para eso: una página que
  pudiera llevarte el mouse a un botón podría hacerte clickear lo que quisiera. Las apps que lo hacen
  (Desktop Goose, por ejemplo) son nativas.
- **Pointer Lock no sirve.** Esconde el puntero y entrega sólo el desplazamiento, pero se activa con
  un click, y en el hub el click es el que entra a un proyecto. Además el navegador muestra un aviso
  y el visitante no recupera el mouse hasta apretar Esc.

## Decisión

- **Un pato vectorial pasea por encima del hub desde que carga.** Camina a un punto al azar de la
  ventana, se para un rato, y vuelve a caminar. Está fijo a la ventana: el scroll no se lo lleva.
- **El secuestro es de un cursor dibujado.** Cuando el pato agarra el cursor, la página esconde el
  puntero real (`cursor: none`) y dibuja una flecha en el mismo lugar. El pato la lleva en el pico
  hasta el otro lado de la pantalla y la suelta ahí. El polvo del cielo se enciende por donde pasa la
  flecha, como con el puntero real ([ADR-0012](0012-el-fondo-es-un-cielo-de-particulas.md)).
- **Las reglas que lo mantienen fuera del camino** (principio 4, regla 6 del `CLAUDE.md`):
  - No ataca antes de los 20 segundos de pestaña a la vista. Después de cada ataque, espera entre 30
    y 60 segundos.
  - Sólo va a buscar un cursor que lleva 3 segundos quieto. Si el cursor se mueve mientras va, lo
    deja.
  - Apenas el mouse se mueve de verdad, el cursor se le escapa: la flecha vuelve en 150 ms a donde
    está el puntero real, el puntero real reaparece y el pato hace «¡CUAC!».
  - El pato y la flecha no atajan nada (`pointer-events: none`). Un click durante el secuestro llega
    a lo que está debajo del puntero real, y las teclas del 1 al 9 siguen entrando.
- **Con el dedo pasea pero no ataca**, porque no hay cursor que robar. **Con movimiento reducido no
  hay pato.**
- **Es decorado**: queda fuera del árbol de accesibilidad. El «¡CUAC!» sale del diccionario, en los
  dos idiomas ([ADR-0008](0008-espanol-e-ingles.md)).
- **No es un sprite ni pixel art**: es un SVG, y sus colores entran a `DESIGN.md` y a
  `.impeccable/design.json` ([ADR-0007](0007-frontend-disenado-con-impeccable.md)).

## Consecuencias

**A favor:** el hub vuelve a tener un secreto, sin metáfora, y es de los que se cuentan («un pato me
robó el cursor»). Usa el cielo que ya reacciona al puntero, así que la flecha robada deja la misma
estela que la de verdad.

**En contra:**

- Es otra cosa que se dibuja en cada cuadro mientras la pestaña está a la vista. Es un elemento con
  `transform`, mucho más barato que el polvo, pero suma.
- El secuestro es una ilusión: el puntero real no se mueve. El que clickea sin mover el mouse entra
  al proyecto que tenía debajo, no al que ve debajo de la flecha. Para apuntar a otro tiene que
  mover el mouse, y eso ya lo libera.
- Mientras dura, el recuadro que quedó debajo del puntero real sigue con su hover.
- El dueño, que entra todos los días, lo va a ver siempre: lo pidió así.

**Se revisa si:** el pato cansa al que entra todos los días, o alguien no puede entrar a un proyecto
por culpa del pato. La primera salida sería espaciar los ataques, no sacar el pato.

## Alternativas consideradas

- **Mover el puntero real:** no hay forma desde una página.
- **Pointer Lock:** le roba el click al proyecto, muestra un aviso del navegador y deja al visitante
  sin mouse hasta que aprieta Esc. Es justo lo que prohíbe el principio 4.
- **Que el pato aparezca recién después de un rato sin entrar a nada**, para que el apurado no lo
  vea nunca: lo propuse yo, y el usuario lo quiere desde que carga. Lo que espera es el ataque.
- **Que el pato ataque cualquier cursor, también uno en movimiento:** le pelearía el mouse a alguien
  que está apuntando a un proyecto.
