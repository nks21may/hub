---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src/main.tsx"]
---

# La sala

## Alcance y modo

La única pantalla del hub: la sala con todas las máquinas. Modo **Experience**: el visitante está
adentro de la cosa, y la cosa es una placa multijuego.

## Para quién y para qué

- El dueño entra todos los días a llegar rápido a un proyecto; amigos de Discord desde el celular;
  gente que viene del portfolio a curiosear.
- La acción es una sola: elegir una máquina y entrar, en un click o una tecla.
- El contenido son las fichas de `/catalogo.json`. La pantalla de cada máquina muestra **un loop
  real del proyecto** (elegido por el usuario el 2026-10-26).
- Sonido: **muda, con una perilla de volumen** visible que lo prende (elegido por el usuario).
- Lo que el usuario dijo que lo haría sentir mal: que parezca un template, que sea lento de usar,
  que sea neón y pixel art, que no tenga gracia.

## Dirección elegida

**La placa 1000 en 1**: el menú de una placa multijuego trucha de bar. El número del título es la
cantidad real de máquinas del catálogo: hoy "6 EN 1", y mañana "7 EN 1" sin tocar este repo.

**Traducción del compromiso de marca.** `PRODUCT.md` prohíbe el arcade de neón y pixel art
genérico, y esta placa es la dirección que más cerca le queda. Se traduce así: la letra de la
placa (un bitmap de 8×8) pasa a ser una mono vectorial sobre una grilla de caracteres estricta;
no hay fuentes pixel, ni sprites pixelados, ni bloom, ni scanlines de filtro. El CRT es un objeto
físico, con vidrio, curvatura y reflejo, y no un efecto encima de la página.

**Disciplinas que se trajo de las direcciones descartadas:**

- *De la escena ASCII:* todo el texto de pantalla vive en una grilla fija de caracteres, como el
  tilemap de la placa; nada se tipea libre.
- *De la mesa de corte:* el estado es una marca y no un color. Una máquina caída tiene un cartel de
  cartón escrito con fibrón y pegado con cinta sobre el vidrio, y la fila de la que volviste te
  recibe con «VOLVISTE».
- *Del ciclorama:* la sala tiene estados con nombre: ARRANCANDO (el chequeo de RAM de la placa
  mientras llega el catálogo), MENÚ, y SIN SEÑAL (catálogo ausente o roto).
- *De la billetera de pasajes:* lo caído no se borra, se sella: queda en la lista con su cartel.
- *De la doble página de Bazaar:* un solo elemento vivo por vez. Sólo la fila con el cursor va en
  video inverso, y sólo su vista previa se mueve.
- *Del borde de nube:* el único degradé es el logotipo arcoíris del título, y no sale de ahí.

**El momento que se recuerda:** el título dice cuántas máquinas hay de verdad, y las truchas
mentían. Hay un truco que convierte la placa en su versión trucha ("9999 EN 1", con SURF, SURF 2 y
SURF TURBO), presentado como chiste a la vista y no como dato.

## Sin decidir

- Las tipografías concretas: la mono de la pantalla, el logotipo y la letra de fibrón. Se deciden
  en el build, fuera de la lista de defaults prohibidos.
- De dónde salen los loops. La ficha vive en `infra` y el video tiene que vivir en algún lado: en
  cada app, en `infra` o en este repo. Lo resuelve el ADR del formato de la ficha (H1).
- Qué trucos entran primero, y si el estado en vivo (caído) se muestra desde el arranque.

## Direction contract

THESIS: La sala es el menú de una placa multijuego trucha de bar, «6 EN 1», y el número lo cuenta la
VPS. Rechaza la grilla de tarjetas con disfraz de arcade y la sala oscura de neón.

OWN-WORLD: Pantalla toda en azul de menú, con títulos amarillos, texto blanco y el cursor como una
barra roja en video inverso. Todo el texto de pantalla en una mono vectorial sobre una grilla fija.
El único degradé es el logotipo arcoíris. Afuera de la pantalla, el vidrio curvo del CRT, el mueble
de terciado pintado y carteles de cartón con fibrón pegados con cinta.

STORY: En un vistazo entendés que es todo lo publicado; el cursor muestra cada proyecto andando;
Enter y estás adentro; el que se queda encuentra trucos.

FIRST VIEWPORT: El CRT llena el viewport, enmarcado por el mueble. Arriba, «6 EN 1» al ancho de la
pantalla. A la izquierda, la lista numerada con el cursor en 01; a la derecha, la vista previa 4:3
con el loop y la ficha en dos líneas. Al pie: «↑↓ ELEGIR · ENTER JUGAR». Debajo del vidrio, la
perilla de volumen. En el celular: la vista previa arriba, la lista abajo, la fila que pasa por la
línea del cursor queda elegida, y un toque entra. Interacción firma: el cursor salta de fila sin
easing, la vista previa corta con ≤80 ms de estática, y al entrar la imagen colapsa a una línea en
≤200 ms; con movimiento reducido, corte seco.

FORM: La placa 1000 en 1, el candidato 1 de mi lista ordenada, elegido por el usuario como la carta
IMPECCABLE’S PICK. Seed 789feae5.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
