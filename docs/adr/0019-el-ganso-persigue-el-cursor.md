# ADR-0019 — El ganso persigue el cursor aunque se mueva, y hay que sacudírselo

- **Estado:** aceptado
- **Fecha:** 2026-10-28
- **Decide:** a qué cursor va el ganso, cuánto lo persigue y cómo se le saca; cambia las reglas de
  la caza y del escape de [ADR-0014](0014-el-pato-secuestra-el-cursor.md)

## Contexto

Hasta ahora el ganso sólo iba por un cursor quieto hace 3 segundos, lo dejaba si el cursor se movía
mientras iba, y lo soltaba apenas el mouse se movía de verdad (ADR-0014). Para el que usa el hub sin
quedarse quieto, el ganso no existía.

El usuario pidió otra caza: que vaya por el cursor aunque no esté quieto, que lo siga 8 segundos, y
que, si lo alcanza, se lo lleve; si no, que grazne y vuelva a pasear.

Con el escape de ADR-0014, «se lo lleva» no se cumple: si el ganso alcanza un cursor que se está
moviendo, el próximo movimiento lo libera, y la presa le dura un cuadro. Se le preguntó al usuario
cómo se saca el cursor, y eligió que haya que sacudir el mouse.

ADR-0014 había descartado justo esto («le pelearía el mouse a alguien que está apuntando a un
proyecto»). Este ADR lo acepta, con lo que lo mantiene fuera del camino.

## Decisión

- **Va por el cursor esté quieto o no.** Pasados los 10 s (ADR-0015), cuando termina una pausa y ya
  pasó la espera entre ataques, va con la misma chance de 0,6. Sigue al puntero real a donde vaya, a
  200 px/s, **durante 8 segundos como mucho**.
- **Si en esos 8 s le deja la punta del pico encima, se lo lleva**, como antes: esconde el puntero
  real y se lleva la flecha dibujada a la otra mitad de la pantalla.
- **Si no lo alcanza, o si el puntero sale de la ventana, se rinde:** se para, grazna «¡JONK!» y
  vuelve a pasear. No ataca de nuevo por 30 a 60 s, como cuando se le escapa.
- **Mientras lo tiene en el pico, mover el mouse no alcanza: hay que sacudirlo**, 400 px de
  recorrido sumado desde que lo agarró. Ahí lo suelta como antes: la flecha vuelve en 150 ms al
  puntero real, el puntero reaparece y grazna. Una vez que lo dejó en la otra mitad ya no lo tiene
  agarrado, y cualquier movimiento lo libera.
- **Mientras dura el secuestro, el polvo del cielo sigue sólo a la flecha.** El puntero real, que se
  mueve escondido, no lo enciende: si no, el polvo delataría dónde está y la flecha dejaría de
  encenderlo.
- **Lo demás de ADR-0014 sigue igual:** si el puntero sale de la ventana o la página se va, lo
  suelta en el acto; el ganso y la flecha no atajan clicks ni teclas; con el dedo pasea pero no
  ataca; con movimiento reducido no hay ganso.

## Consecuencias

**A favor:** el ganso se vuelve un juego para cualquiera, no sólo para el que se queda quieto: hay
que escaparle, y si te agarra hay que forcejear. A 200 px/s, un mouse que se mueve rápido siempre se
le escapa: lo alcanza el que frena.

**En contra:**

- Le pelea el mouse al que está apuntando a un proyecto, que es lo que ADR-0014 quería evitar. Lo
  que lo mantiene fuera del camino: el puntero real nunca deja de responder, la persecución dura 8 s
  y después espera 30 a 60, y las teclas del 1 al 9 siguen entrando.
- Mientras forcejea, el puntero real no se ve. Un click entra a lo que está debajo del puntero real,
  que está donde lo llevó la mano, no donde se ve la flecha. El recuadro que tiene encima se nota por
  su hover, y nada más.
- La caza deja de depender de un cursor quieto, así que el ganso ataca mucho más seguido: cada vez
  que termina una pausa y le dan las ganas, en lugar de sólo cuando el visitante está leyendo.

**Se revisa si:** alguien entra a un proyecto que no quería por clickear durante el forcejeo, o no
logra entrar al que quería. Las salidas son que un click también lo suelte, o una sacudida más
corta.

## Alternativas consideradas

- **Que lo suelte apenas se mueve el mouse, como hasta ahora:** si te alcanza mientras lo movés, lo
  suelta en el acto, y sólo se lo lleva el que se quedó quieto. Para el que se mueve, la caza no
  termina en nada.
- **Que se lo lleve hasta la otra mitad pase lo que pase:** son 3 a 5 s sin puntero y sin salida.
- **Que vaya más rápido que 200 px/s para alcanzar un mouse en movimiento:** alcanzaría siempre, y
  la caza dejaría de ser algo de lo que se puede escapar.
