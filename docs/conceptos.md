# Los tres conceptos del hub

Salieron del grill del 2026-10-26. Interesaron tres: se hace la **sala de fichines**
([ADR-0006](adr/0006-el-concepto-es-una-sala-de-fichines.md)) y los otros dos quedan acá, con el
mismo nivel de detalle, para poder volver a ellos sin rehacer la discusión.

Los tres se miden contra los mismos cuatro criterios:

1. **Entrar:** llegar a un proyecto cuesta un click o una tecla.
2. **Celular:** anda con el dedo, sin teclado.
3. **Escala:** aguanta pasar de 6 a 30 proyectos.
4. **Casos raros:** caído, apagado, oculto y muerto entran en la historia, no como excepciones.

Ninguno usa la tele (es `museo`) ni la ficha técnica (es `portfolio4`).

---

## A. Sala de fichines — el elegido

**La idea.** Una sala con una máquina por proyecto. Se recorre la fila, la máquina con el foco se
prende, y con un click o un Enter se juega.

**Entrar.** Un click o un Enter sobre la máquina. Con el teclado, las flechas mueven el foco entre
máquinas.

**Celular.** Las máquinas se apilan; cada una es un botón grande.

**Escala.** Hay filas o pasillos. Con 30 máquinas aparece la pregunta de agruparlas (juegos,
herramientas, sitios), que con 6 no hace falta.

**Casos raros.**

| Caso | En la sala |
|---|---|
| caído (no responde) | la máquina con el cartel de "FUERA DE SERVICIO" |
| apagado (`x-deploy: {apagado: true}`) | hoy no se muestra ([ADR-0005](adr/0005-entra-lo-que-cualquiera-puede-usar.md)); podría ser una máquina tapada con una lona |
| oculto | no está en la sala; puede aparecer por un easter egg |
| muerto (tuercas, los portfolios viejos) | el depósito del fondo, con las máquinas rotas |

**Easter eggs que habilita.** Insertar ficha; el código Konami; el modo demo cuando nadie toca nada
(*attract mode*); una tabla de récords; una máquina que no es de nadie; el depósito.

**Riesgo.** El arcade de neón y pixel art que ya hizo todo el mundo. Se pelea en el diseño
([ADR-0007](adr/0007-frontend-disenado-con-impeccable.md)).

**Costo.** Medio: es una página con estado, no un motor.

---

## C. Terminal falsa

**La idea.** Una consola que ya está abierta cuando entrás. `ls` lista los proyectos, `open surf`
abre uno, y hay comandos que nadie te dice.

**Entrar.** Tipear `open <nombre>`, con autocompletado con Tab. Para no fallar el criterio 1, cada
línea de `ls` también es un link clickeable.

**Celular.** Es su punto débil. Tipear en el celular es incómodo, así que necesita una fila de
botones con los comandos frecuentes, y en ese punto deja de ser una terminal.

**Escala.** Muy buena: `ls` aguanta cualquier cantidad, y `ls juegos/` agrupa sin diseño nuevo.

**Casos raros.**

| Caso | En la terminal |
|---|---|
| caído | `open neonduel` → `connection refused` |
| apagado | aparece en `ls -a`, con permisos `---------` |
| oculto | archivos con punto: `.minecraft` sólo sale con `ls -a` |
| muerto | `/var/archive/` o `/dev/null` |

**Easter eggs que habilita.** Es el concepto más fértil: `sudo`, `rm -rf /`, `cat` de un archivo
secreto, `history` (los proyectos viejos), `man hub`, `exit` (que no te deja), `cowsay`, comandos de
otras épocas.

**Riesgo.** Está muy vista, y para quien no usa una consola es una pared.

**Costo.** Bajo para lo básico; los comandos crecen de a uno.

**Puede volver como:** un modo escondido de la sala, por ejemplo una máquina que abre la consola.

---

## D. Mundo para caminar

**La idea.** Un pueblito visto desde arriba. Cada proyecto es un edificio, y entrás caminando hasta
la puerta.

**Entrar.** Es el punto débil: caminar hasta la puerta es lento. Para no fallar el criterio 1,
necesita un atajo, como un mapa clickeable o un teletransporte con una tecla, y el atajo es lo que
el dueño termina usando.

**Celular.** Joystick virtual o tocar el destino.

**Escala.** El pueblo crece: barrios por tipo de proyecto, terrenos vacíos para lo que viene.

**Casos raros.**

| Caso | En el mundo |
|---|---|
| caído | el edificio con las luces apagadas y un cartel en la puerta |
| apagado | una obra en construcción, con vallas |
| oculto | un edificio que sólo se ve desde un lugar del mapa |
| muerto | ruinas o un cementerio a las afueras |

**Easter eggs que habilita.** Los del mundo abierto: pasadizos, NPCs que hablan de los proyectos,
un portal a otro concepto, secretos que sólo se ven de noche.

**Riesgo.** Lo divertido de caminar se gasta a la tercera visita, y para el dueño, que entra todos
los días, es una traba.

**Costo.** El más alto: mapa, colisiones, movimiento, cámara, y arte para cada edificio.

**Puede volver como:** un modo escondido de la sala, por ejemplo una puerta del fondo que da a la
calle.
