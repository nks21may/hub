# ADR-0015 — El pato ataca a los 10 segundos y hace cuac con sonido cada tanto

- **Estado:** aceptado
- **Fecha:** 2026-10-28
- **Decide:** cuánto espera el pato para atacar, y si el hub hace ruido; suma a
  [ADR-0014](0014-el-pato-secuestra-el-cursor.md)

## Contexto

El usuario vio el pato de H16 y pidió tres cosas: que el primer ataque sea a los 10 segundos y no a
los 20, que el pato parezca un pato y no una gaviota, y que haga cuac cada tanto, con sonido.

El dibujo no necesita un ADR: [ADR-0014](0014-el-pato-secuestra-el-cursor.md) sólo pide que sea
vectorial, y sus colores salen de `DESIGN.md`. Los 10 segundos sí, porque cambian una regla de
ADR-0014. El sonido también, porque hasta ahora el hub es mudo.

**El navegador no deja sonar a una página hasta que el visitante la toca.** Es la política de
reproducción automática de Chrome, Firefox y Safari: Web Audio arranca suspendido y recién se
destraba con un gesto del visitante en la página, que puede ser un click, un toque o una tecla.
Mover el mouse o hacer scroll con la rueda no cuentan. En el hub, el click que más se hace es el que
entra a un proyecto, y ese click sale de la página: muchos visitantes no van a escuchar nunca al
pato.

## Decisión

- **El primer ataque es a los 10 segundos** de pestaña a la vista, y no a los 20 de ADR-0014. Lo
  demás del secuestro sigue igual: el cursor tiene que llevar 3 segundos quieto, lo suelta apenas se
  mueve el mouse y después espera entre 30 y 60 segundos.
- **El pato hace «¡CUAC!» cada tanto**, aunque no haya secuestro: el primero entre los 8 y los 20
  segundos, y después cada 20 a 45 segundos, al azar. Cada cuac muestra el cartelito y suena. El cuac
  del escape también suena.
- **El sonido se genera por código** (Web Audio), sin archivos: un diente de sierra que baja de tono,
  filtrado como una voz nasal, de un cuarto de segundo y a volumen bajo.
- **Suena sólo cuando el navegador lo deja**: desde el primer click, toque o tecla en la página.
  Antes de eso, el cuac es sólo el cartelito. No hay botón de sonido.
- Con movimiento reducido no hay pato, así que tampoco hay cuac. Con la pestaña atrás, el reloj del
  pato no corre y no suena nada.

## Consecuencias

**A favor:** el pato se oye en el hub, y el que lo destraba sin querer (un click en el fondo) se
lleva la sorpresa. Como no hay archivos, el hub no pesa más y no hace falta una grabación con
licencia.

**En contra:**

- Muchos visitantes no lo van a escuchar nunca, porque el único gesto que hacen es el click que los
  saca del hub. Para escucharlo hay que tocar la página primero: un click en el fondo o una tecla que
  no sea un número.
- Es el primer sonido del hub, y no se puede apagar desde la página: el que no lo quiere tiene que
  silenciar la pestaña.
- Un cuac sintetizado se parece a un pato, pero no es un pato grabado.

**Se revisa si:** alguien pide apagarlo, o el usuario quiere que se escuche más seguido. En los dos
casos, la salida es un botón de sonido, que además le daría al visitante el gesto que destraba el
audio.

## Alternativas consideradas

- **Un botón de sonido:** el que lo toca destraba el audio y lo puede apagar. Suma un control a la
  pantalla, que se diseña y se traduce, y el usuario no lo pidió. Queda como la primera salida si el
  sonido molesta.
- **Un archivo con un cuac grabado:** suena más real, pero pide una grabación con licencia y suma
  peso. Web Audio alcanza para un easter egg.
- **Sonar en cada paso del secuestro:** es más ruido, y el ruido se vuelve molesto rápido.
