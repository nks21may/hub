# Backlog de construcción — Hub

Worklist del loop TDD. El protocolo por iteración está en
[.claude/commands/tdd.md](../.claude/commands/tdd.md) y se invoca con `/tdd`.

Cada ítem es **una iteración y un commit**, con su ciclo rojo → verde → refactor
adentro. La suite queda verde al final de cada uno.

Branch: `loop/construccion`. Alcance: sólo el repo `hub`.

**El backlog cita símbolos por nombre, nunca por línea.** Cada commit invalida los
números de línea; los nombres sobreviven.

## Cómo se escribe un ítem

Un checkbox markdown (sin tildar, o tildado cuando se cierra) seguido de:

```
**HN — Qué hace, en una línea.** *Depende de HM.*
*Test:* el comportamiento que el test fija, en términos observables.
**Se espera rojo:** la falla concreta que tiene que dar antes del código.
Ver [ADR-NNNN](adr/NNNN-....md) si lo sostiene una decisión.
⚠️ **pérdida de datos** / ⚠️ **seguridad**, cuando corresponda.
```

Un ítem que no dice qué test lo cierra no está listo para el loop.

## Archivos intocables

Vacío. Si al empezar una iteración `git status --short` muestra cambios que **no**
son de ella, se anotan acá y **no** entran en su commit.

## El gate

```bash
npm run gate
```

---

## Fase 0 — Fundaciones

- [x] **H0 — Harness y estructura.** El gate corre, tiene el lint adentro,
      sabe ponerse rojo y da verde. Lo arma la sesión de preparación, no el loop.

---

## Fase 1 — Catálogo y sala

- [x] **H1 — El formato de la ficha y la lectura del catálogo.** *Depende de H0.*
      **Antes del test, el ADR del formato:** qué campos lleva una ficha, cuáles son obligatorios,
      cómo vienen sus textos en español e inglés ([ADR-0008](adr/0008-espanol-e-ingles.md)), cómo
      se marca `oculto` y cómo viene el `apagado` que agrega el deploy. Es el contrato con
      `infra` ([ADR-0003](adr/0003-el-catalogo-sale-de-las-fichas-de-infra.md)).
      *Test:* `leerCatalogo` del catálogo de ejemplo devuelve las máquinas visibles, sin las
      `oculto` ni las apagadas; una ficha sin `url`, o con una `url` que no es `https`, se descarta
      con su motivo sin tirar el resto; un texto que no es JSON da una sala vacía con el motivo, sin
      excepción.
      **Se espera rojo:** falla el import del módulo del catálogo, que no existe.
      Ver [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md) y
      [ADR-0005](adr/0005-entra-lo-que-cualquiera-puede-usar.md).
- [x] **H2 — La placa lista un juego por ficha visible, y el título los cuenta.** *Depende de H1.*
      Se construye contra el contrato de dirección (`.impeccable/surfaces/index-html.md`).
      *Test (jsdom):* mientras `fetch` no contesta, la placa está en ARRANCANDO; con el catálogo de
      ejemplo, el título dice «N EN 1» con N igual a las fichas visibles, y hay una fila numerada
      (01, 02…) por cada una, con su nombre; con `fetch` fallando o devolviendo basura, la placa
      muestra SIN SEÑAL, sin filas ni excepción. Los textos salen del diccionario, en los dos idiomas.
      **Se espera rojo:** falla el import del componente de la placa.
      Ver [ADR-0009](adr/0009-la-sala-es-una-placa-1000-en-1.md) y
      [ADR-0008](adr/0008-espanol-e-ingles.md).
- [x] **H3 — El cursor, la vista previa y entrar con un click o un Enter.** *Depende de H2.*
      *Test (jsdom, user-event):* el cursor arranca en 01; ↑ y ↓ lo mueven de a una fila, sin pasarse
      de las puntas; la vista previa muestra la ficha de la fila con el cursor; cada fila es un link
      a la `url` de su ficha, y Enter abre la del cursor. Con `prefers-reduced-motion`, no hay
      animación de entrada. Una ficha sin `vista` muestra el relleno propio de la placa
      ([ADR-0010](adr/0010-formato-de-la-ficha-y-del-catalogo.md)). El pie de la pantalla dice cómo
      elegir y jugar, con las teclas dibujadas y no como glifos Unicode. La lista pasa de centrada
      (H2) a la columna izquierda del contrato.
      **Se espera rojo:** las flechas no mueven el cursor.
      Ver [ADR-0009](adr/0009-la-sala-es-una-placa-1000-en-1.md).
- [x] **H4 — La imagen Docker, como la de nonograma.** *Depende de H2.*
      `Dockerfile` de dos etapas (el gate en el build, `nginx-unprivileged` al final),
      `deploy/nginx.conf` y la CI que publica `ghcr.io/nks21may/hub` para ARM.
      *Test:* un test del gate lee `deploy/nginx.conf` y verifica que `/catalogo.json` se sirve con
      `no-cache`, que la CSP deja pedirlo (`connect-src 'self'`) y que deja ver los loops de las
      apps (`media-src https://*.nicolasdalessandro.dev`, ADR-0010). Fuera del gate, `docker build`
      termina y `docker run` con un catálogo montado sirve la portada y `/catalogo.json`; la salida
      va pegada en la bitácora.
      **Se espera rojo:** el test no encuentra `deploy/nginx.conf`.
      Ver [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md).
---

## Fase 2 — La grilla ([ADR-0011](adr/0011-el-hub-es-una-grilla-de-proyectos.md))

La placa no convenció, y la galería del mundo para caminar tampoco. El hub pasa a ser una grilla de
recuadros con su vista previa, sobre una aurora. El contrato de dirección nuevo está en
`.impeccable/surfaces/index-html.md`.

- [x] **H9 — La grilla reemplaza a la placa: un recuadro por ficha visible, y la tecla del número
      entra.** *Depende de H1.*
      *Test (jsdom):* mientras `fetch` no contesta, el hub está cargando y no hay recuadros; con el
      catálogo de ejemplo, el encabezado dice cuántos proyectos hay y hay un link por ficha visible,
      en orden de número, con su nombre, su descripción en el idioma y su host; la tecla del número
      entra a ese proyecto, y una tecla sin proyecto no hace nada; con `fetch` fallando o con
      basura, el hub dice que no pudo leer la lista, sin recuadros ni excepción; sin fichas, dice que
      todavía no hay nada. Una ficha con `vista` muestra el loop; sin `vista`, la captura de prueba
      marcada como tal o un relleno con el nombre. Los textos salen del diccionario, en los dos
      idiomas. El código y los tests de la placa se borran.
      **Se espera rojo:** falla el import del componente del hub.
- [x] **H10 — La aurora de fondo.** *Depende de H9.*
      Manchas de color que se mueven lento detrás de la grilla, sin quitarle contraste a los
      recuadros.
      *Test (jsdom):* la aurora está fuera del árbol de accesibilidad; con
      `prefers-reduced-motion`, queda marcada como quieta.
      **Se espera rojo:** falla el import del componente de la aurora.

- [x] **H5 — La revisión final de `impeccable` y `DESIGN.md`.** *Depende de H10.*
      Capturas de escritorio y celular en `.impeccable/review/`, el detector de `impeccable`, el
      revisor final contra el contrato de dirección y, con su veredicto, el documentador que
      escribe `DESIGN.md` y `.impeccable/design.json` desde lo construido.
      *Test:* un test del gate lee los tokens de color de `.impeccable/design.json` y los CSS de
      `src/`, y falla si aparece un color que no está entre los tokens.
      **Se espera rojo:** el test no encuentra `.impeccable/design.json`.
      Ver [ADR-0007](adr/0007-frontend-disenado-con-impeccable.md).


- [x] **H11 — Menos neón, sin carteles de prueba ni pie explicativo, y una luz de fondo que sigue
      al mouse.** *Depende de H5.* Lo pidió el usuario el 2026-10-27, después de ver la grilla
      terminada: sacar «La lista se arma sola con lo que corre en el servidor.» y «captura de
      prueba», bajar el neón y sumar un efecto de fondo que reaccione al mouse. Los cambios de
      diseño actualizan `DESIGN.md` y `.impeccable/design.json` en el mismo commit
      ([ADR-0007](adr/0007-frontend-disenado-con-impeccable.md)).
      *Test:* (jsdom) el pie dice sólo el dominio; una ficha sin `vista` muestra su captura sin
      cartel; la aurora tiene una luz que sigue al puntero, fuera del árbol de accesibilidad, y con
      movimiento reducido no la tiene. (node) `acercar` lleva la luz hacia el puntero sin pasarse, y
      `paralaje` da cero en el centro y ±1 en los bordes.
      **Se espera rojo:** falla el import del módulo del puntero.

- [x] **H12 — El fondo es un cielo azul con partículas que se encienden con el mouse.** *Depende de
      H11.* La referencia del usuario es el fondo de deepmind.google, sin su estrella
      ([ADR-0012](adr/0012-el-fondo-es-un-cielo-de-particulas.md)). Reemplaza la aurora y la luz del
      cursor de H11. `DESIGN.md` y `.impeccable/design.json` se reescriben en el mismo commit.
      *Test:* (node) `sembrar` llena la ventana de partículas, más cuanto más grande, ninguna afuera,
      y siempre las mismas con la misma semilla; `encender` prende las cercanas al mouse según cuánto
      se movió, más cuanto más cerca, y no toca las lejanas; `apagar` las apaga con el tiempo, con
      estela y sin bajar de cero; `empuje` corre las cercanas hacia afuera y no mueve las lejanas.
      (jsdom) el cielo queda fuera del árbol de accesibilidad, queda quieto con movimiento reducido y
      no rompe si no hay `canvas`.
      **Se espera rojo:** falla el import del módulo de las partículas.

- [x] **H13 — El polvo del cielo deriva siempre hacia abajo a la izquierda.** *Depende de H12.* Lo
      pidió el usuario comparando con la referencia ([ADR-0013](adr/0013-el-polvo-deriva-siempre.md)).
      *Test:* (node) `derivar` mueve las motas hacia abajo a la izquierda, a unos 35°, sin el mouse;
      depende del tiempo y no de los cuadros; las más grandes van más rápido; la que sale por un borde
      entra por el opuesto, y después de mucho rato sigue habiendo polvo en toda la ventana. (jsdom) con
      movimiento, el cielo se anima solo sin mover el mouse; con movimiento reducido no pide cuadros.
      **Se espera rojo:** `derivar` no existe, y el cielo sólo pide cuadros cuando se mueve el mouse.

- [x] **H14 — La imagen ve todo lo que lee el gate.** *Depende de H13.* El primer push a `main`
      rompió la CI: el gate corre adentro del `docker build` y `tests/tokens.test.ts` (H5) lee
      `.impeccable/design.json`, que el `.dockerignore` de H4 dejaba afuera con toda la carpeta.
      *Test:* (node) cada archivo del repo que nombra un test entra al contexto de la imagen, evaluando
      el `.dockerignore` como Docker (la última regla que coincide gana, `!` vuelve a meter); lo
      pesado y lo que no hace falta (`node_modules`, `.git`, las capturas de `.impeccable/review/`)
      sigue afuera. Fuera del gate, `docker build` termina con el gate adentro.
      **Se espera rojo:** quedan afuera del contexto `.impeccable/design.json` y el propio
      `.dockerignore`, que lee el test del despliegue.

## Fase 3 — El pato ([ADR-0014](adr/0014-el-pato-secuestra-el-cursor.md))

Lo pidió el usuario el 2026-10-28: un pato que pasee por el hub y que, al azar, le secuestre el
cursor y se lo lleve de un lado a otro de la pantalla. Lo quiere desde que carga, pero sin que
ataque antes de los 20 segundos (después pidió 10, en
[ADR-0015](adr/0015-el-pato-hace-cuac-con-sonido.md)). Los cambios de diseño actualizan `DESIGN.md` y
`.impeccable/design.json` en el mismo commit ([ADR-0007](adr/0007-frontend-disenado-con-impeccable.md)).

- [x] **H15 — El pato pasea por el hub.** *Depende de H13.* Un SVG fijo a la ventana, por encima de
      la grilla, que camina a un punto al azar, se para un rato y vuelve a caminar. No ataca todavía.
      *Test:* (node) `nacer` pone al pato adentro de la ventana, con un destino adentro; `andar` lo
      lleva hacia el destino a paso de pato (unos 60 px/s) y depende del tiempo y no de los cuadros;
      mira para el lado al que camina; al llegar se para entre 1 y 4 s y después elige otro destino
      adentro de la ventana; si la ventana se achica, vuelve adentro. (jsdom) el pato está desde que
      carga, fuera del árbol de accesibilidad, y camina solo sin que nadie mueva el mouse; con
      movimiento reducido no hay pato.
      **Se espera rojo:** falla el import del módulo `andanzas`.
- [x] **H16 — El pato secuestra el cursor quieto.** *Depende de H15.* El puntero real no se mueve:
      se esconde y el pato se lleva una flecha dibujada (ADR-0014).
      *Test:* (node) antes de los 20 s de reloj, `andar` no va a buscar el cursor aunque esté quieto;
      después, con el cursor quieto hace 3 s, va a buscarlo hasta tenerlo en el `pico`; si el cursor
      se mueve mientras va, lo deja; con el dedo nunca va; cuando lo agarra, se lleva la presa en el
      pico hasta la otra mitad de la pantalla y la suelta ahí; `escapar` lo deja parado, con su cuac,
      y sin volver a atacar por 30 a 60 s. (jsdom) durante el secuestro, `<html>` lleva
      `data-pato="secuestro"` (que esconde el puntero) y la flecha dibujada está donde está la presa;
      al mover el mouse, la flecha vuelve, el puntero reaparece y el cuac sale del diccionario en los
      dos idiomas; el cielo enciende el polvo con la flecha dibujada igual que con el puntero. (node)
      el CSS del pato y de la flecha dice `pointer-events: none`, así que no atajan ningún click.
      **Se espera rojo:** `andar` nunca deja de pasear, aunque el cursor esté quieto.
- [x] **H17 — El pato parece un pato, y ataca a los 10 s.** *Depende de H16.* Lo pidió el usuario
      después de ver H16: «parece una gaviota». El blanco con el ala gris, el cuerpo flaco y la cola
      en punta son de gaviota. Pasa a ser amarillo, panzón, de cuello corto y cabeza grande, con el
      pico ancho y chato y la cola corta para arriba
      ([ADR-0015](adr/0015-el-pato-hace-cuac-con-sonido.md) baja la espera a 10 s).
      *Test:* (node) antes de los 10 s de reloj, `andar` no va a buscar el cursor; con varias
      semillas, alguna ataca entre los 10 y los 20 s. (jsdom) el secuestro llega pasados los 10 s. El
      dibujo, y que la flecha quede en la punta del pico nuevo, se revisan en el navegador, con captura.
      **Se espera rojo:** ninguna semilla ataca antes de los 20 s.
- [x] **H18 — El pato hace cuac cada tanto, con sonido.** *Depende de H17.* El sonido se genera con
      Web Audio, sin archivos, y suena desde el primer click, toque o tecla en la página
      ([ADR-0015](adr/0015-el-pato-hace-cuac-con-sonido.md)).
      *Test:* (node) `andar` hace cuac solo: el primero entre los 8 y los 20 s, y en tres minutos
      entre 4 y 9, nunca dos con menos de 20 s entre ellos; cada cuac muestra el cartelito; `escapar`
      también cuenta un cuac. (jsdom) antes de un click o una tecla, el pato no crea ningún contexto de
      audio; después de un click, cada cuac arranca un oscilador; sin Web Audio, como en jsdom, el cuac
      no rompe nada.
      **Se espera rojo:** `andar` no hace cuac nunca si nadie mueve el mouse.
- [x] **H19 — El pato pasa a ser un ganso.** *Depende de H18.* Lo pidió el usuario después de saber
      que el sonido de Desktop Goose no se puede usar. Es un ganso común, gris pardo, de cuello largo,
      con el pico y las patas naranjas, que grazna «¡JONK!» con un sonido más grave que el cuac
      ([ADR-0016](adr/0016-el-pato-pasa-a-ser-un-ganso.md)). En el código, el pato pasa a llamarse
      ganso.
      *Test:* (jsdom) el hub trae al `Ganso`; el cartelito sale del diccionario: «¡JONK!» y «HONK!»;
      todo lo de H15 a H18 sigue igual con los nombres nuevos (`graznidos` en lugar de `cuacs`,
      `data-ganso` en `<html>`). El dibujo y el graznido se revisan en Chrome, con captura y WAV.
      **Se espera rojo:** falla el import de `src/hub/Ganso.tsx`.
- [x] **H22 — Al ganso se le puede hacer click, y grazna.** *Depende de H19.* Lo pidió el usuario.
      El click es un gesto, así que destraba el audio y el graznido suena en ese mismo click
      ([ADR-0015](adr/0015-el-pato-hace-cuac-con-sonido.md)). El ganso sigue sin atajar nada
      ([ADR-0014](adr/0014-el-pato-secuestra-el-cursor.md)): el click se mira desde la ventana y sigue
      de largo, así que sobre un recuadro también entra al proyecto.
      *Test:* (node) `tocar` lo hace graznar en el momento, sin cambiarle lo que estaba haciendo;
      mientras todavía grazna, otro click no suma un graznido; el graznido solo siguiente se corre.
      (jsdom) un click sobre el ganso muestra el cartelito y arranca el sonido en ese mismo click; un
      click lejos no; el click sobre el ganso no se cancela y llega a lo que está debajo.
      **Se espera rojo:** falla el import de `tocar`.
- [x] **H23 — Las patas se mueven también cuando corre y cuando arrastra.** *Depende de H19.* Lo
      pidió el usuario: hoy, cuando va a buscar el cursor, el ganso se desliza con las patas quietas.
      *Test:* (node) el CSS del ganso anima las dos patas en `caminando`, `yendo` y `arrastrando`, y
      en `yendo` más rápido que caminando. Se revisa en Chrome.
      **Se espera rojo:** no hay animación de las patas para `yendo` ni para `arrastrando`.
- [x] **H24 — El ganso tiene volumen.** *Depende de H23.* Lo pidió el usuario («que sea 3D»), con
      un dibujo propio y no el de Desktop Goose ([ADR-0016](adr/0016-el-pato-pasa-a-ser-un-ganso.md)):
      sombra en la panza, luz en el lomo, el cuello y la cabeza, el ala del otro lado asomando detrás
      del lomo, y la pata de atrás más oscura. Todo con tono, sin sombra en el piso, como pide la
      regla «Plano con luz» de `DESIGN.md`. Los colores nuevos entran a `.impeccable/design.json`.
      *Test:* (jsdom) el dibujo del ganso trae la sombra de la panza, las luces y el ala de atrás;
      (node) la pata de atrás va en un naranja más oscuro que la de adelante. El dibujo se revisa en
      Chrome, con captura.
      **Se espera rojo:** el dibujo no tiene sombra ni luces.

## Fase 4 — En producción

- [x] **H20 — La CSP deja pasar el script de detección de bots de Cloudflare, con un nonce.**
      *Depende de H14.* Lo pidió el usuario: «arreglá el error de Cloudflare». El Bot Fight Mode
      inyecta un script inline en cada HTML, y la CSP lo bloquea
      ([ADR-0017](adr/0017-la-csp-lleva-un-nonce-para-cloudflare.md)).
      *Test:* (node) el `script-src` de `deploy/nginx.conf` lleva `'nonce-$request_id'`, un nonce
      que cambia en cada pedido, y sigue sin `'unsafe-inline'`. Fuera del gate, `docker run` de la
      imagen da un nonce distinto en cada pedido; y en producción, con el deploy, la consola queda
      sin errores de la CSP.
      **Se espera rojo:** el `script-src` no tiene nonce.

- [x] **H21 — El HTML no contesta 304.** *Depende de H20.* Con H20 en producción, la segunda visita
      vuelve a mostrar el error: el navegador revalida el HTML, nginx contesta 304 con un nonce nuevo
      y el navegador lo junta con el HTML guardado, que tiene el viejo
      ([ADR-0018](adr/0018-el-html-no-contesta-304.md)).
      *Test:* (node) `deploy/nginx.conf` sirve `/index.html` con `if_modified_since off` y
      `etag off`. Fuera del gate, `docker run`: un pedido a `/` con `If-Modified-Since` da 200
      con cuerpo, y `/catalogo.json` sigue dando 304. En producción, la segunda carga queda sin
      errores de la CSP.
      **Se espera rojo:** el conf no tiene un `location = /index.html`.

## Descartados por ADR-0011

Eran de la placa. Quedan anotados para que nadie los busque.

- **H6 — La perilla de volumen y los sonidos de la placa.**
- **H7 — En el celular, la fila que pasa por la línea del cursor queda elegida.**
- **H8 — La fila de la que volviste te recibe con «VOLVISTE».** La idea de marcar el último
  proyecto visitado puede volver en la grilla, como ítem nuevo.

---

## Parkeados

Ideas que todavía no son trabajo tomable: les falta una decisión del usuario o un
dato. Van **sin checkbox** para que el loop no las tome ni las cuente.

- **Un selector de idioma en el mueble.** Hoy el idioma sale del navegador (`idiomaPreferido`, H2).
  Falta decidir si además hace falta cambiarlo a mano.
- **Los loops de los seis proyectos.** Los sirve cada app en su propio host
  ([ADR-0010](adr/0010-formato-de-la-ficha-y-del-catalogo.md)): hay que grabarlos y sumar el
  `vista.mp4` en cada repo, y es trabajo de esos repos, no de éste. Hasta entonces, las fichas van
  sin `vista` y la placa muestra su relleno.
- **Los easter eggs que siguen al pato.** El primero es el pato (H15 y H16,
  [ADR-0014](adr/0014-el-pato-secuestra-el-cursor.md)). Falta decidir cuáles más, y si C y D
  vuelven como modos escondidos ([docs/conceptos.md](conceptos.md)).
- **El estado en vivo** (caído / *healthy*) en la sala. [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md)
  lo habilita; falta decidir si se muestra y cómo.
- **El depósito de proyectos muertos** (tuercas, los portfolios viejos). No tienen stack, así que
  su lista viviría en este repo: falta decidirlo, porque choca con la regla 3 del `CLAUDE.md`.
- **Proyectos fuera de la VPS** (itch.io, un repo suelto). Mismo choque que el anterior.
