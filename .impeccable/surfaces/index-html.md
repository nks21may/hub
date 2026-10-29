---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src/main.tsx"]
---

# El hub

## Alcance y modo

La única pantalla del hub: la grilla de proyectos. Modo **Experience**: lo que se muestra son los
proyectos mismos, y la interfaz se corre del medio.

## Para quién y para qué

- El dueño entra todos los días a llegar rápido a un proyecto; amigos de Discord desde el celular;
  gente del portfolio que curiosea.
- La acción es una sola: entrar a un proyecto, en un click o con la tecla de su número.
- El contenido son las fichas de `/catalogo.json`. Cada recuadro muestra la vista previa del
  proyecto: el loop de ADR-0010 cuando la app lo sirva; mientras tanto, una captura del sitio, sin
  cartel (el usuario pidió sacarlo el 2026-10-27).
- Lo que el usuario descartó (2026-10-26): la placa 1000 en 1 (retro, una lista, no lo representa)
  y la galería del centro del mundo para caminar. Pidió "un hub simple con los proyectos con
  recuadros" y un fondo animado "como el de las páginas de IA". Vara de terminación: Linear.

## Dirección elegida

**La grilla, con la terminación de Linear**: la forma estándar de la categoría, ejecutada sin ironía
y sin rarezas metidas de contrabando. Lo propio sale del contenido (previews reales, el conteo que
sale de la VPS) y del cuidado: bordes, luz, foco y movimiento.

**El momento que se recuerda:** las seis previews juntas, de un vistazo, sobre un cielo azul cuyo
polvo se enciende por donde pasa el mouse, y el número de cada uno a una tecla de distancia.

## Sin decidir

- El nombre del hub y su subdominio.
- Qué easter eggs siguen al ganso (ADR-0014, ADR-0016).
- Si se muestra el estado en vivo de cada proyecto.

## Direction contract

THESIS: El hub es la grilla de todo lo que corre en nicolasdalessandro.dev: un recuadro con su
vista previa por proyecto, y un click o una tecla para entrar. Rechaza la metáfora (la placa, la
galería) y la grilla de plantilla sin terminación.

OWN-WORLD: Un cielo azul fijo detrás de todo (ADR-0012): navy casi negro abajo a la izquierda,
azul francia arriba a la derecha, luces grandes de azul y de índigo que derivan lento y que el
mouse corre un poco, un grano fino y un polvo de motas claras que deriva solo hacia abajo a la
izquierda (ADR-0013) y se enciende por donde pasa el mouse, deja estela y se apaga solo. La referencia es el fondo de deepmind.google, sin su
estrella. Nada de neón. Recuadros de superficie apenas más clara, borde de 1px blanco al 8%,
radio de 14px, un filo de luz arriba y una luz radial que sigue al mouse; la preview asentada con un
anillo interior doble (2px oscuro y 1px claro) y un velo abajo. Geist para todo el texto
y Geist Mono sólo para hosts y números. Texto blanco, lo secundario en gris azulado. El
número de cada proyecto como una tecla chica en su recuadro.

STORY: De un vistazo ves todo lo publicado con su preview, reconocés el proyecto por la imagen, y
con un click o su número estás adentro.

FIRST VIEWPORT: Arriba a la izquierda, el título con el conteo real; a la derecha, la pista
«Apretá 1–6 y entrás directo». Sin etiqueta encima del título: el dominio va al pie, en mono, solo. Debajo, la grilla: tres columnas en escritorio,
dos en tablet y una en el celular, con preview 4:3 arriba, el nombre, la descripción en dos líneas
y el host en mono. En 1440×900 se ve la primera fila entera y asoma la segunda. El cielo queda
detrás, fijo. Interacción firma: con hover o foco, el borde se aclara, la preview se acerca un 3% y una
luz radial sigue al cursor dentro del recuadro; en el fondo, el polvo deriva solo, se enciende por donde
pasa el mouse y las luces del cielo se corren. Con movimiento reducido, el cielo queda quieto, el
polvo no reacciona y no hay zoom. Encima de todo pasea un ganso vectorial desde que carga (era un
pato hasta ADR-0016); pasados 10 s persigue el cursor hasta 8 s y, si lo alcanza, se lleva en el
pico uno dibujado, que hay que sacudirle con el mouse para que lo suelte (ADR-0014, ADR-0019). Cada
tanto grazna «¡JONK!», con sonido desde que el visitante tocó la página (ADR-0015). Con movimiento
reducido no hay ganso.

FORM: El estándar de la categoría: la carta canon de la ronda 944c3b0a (la imprimió concept-seed el
2026-10-26; la página de decisión fue b7f6db46), elegida por el usuario con
sus palabras después de descartar la placa y la galería. Vara: Linear.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
