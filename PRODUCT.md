# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **El dueño (Nico).** Entra todos los días desde el escritorio, como quien abre un marcador. Lo
  que necesita es llegar al proyecto que busca sin acordarse del subdominio, y ver de un vistazo
  qué está publicado. Antes de la sala, esa lista no la tenía en la cabeza: estaba en `infra`.
- **Amigos y gente de Discord.** Ya saben a qué vienen: jugar neonduel o surf, usar el puente de
  audio. Muchas veces llegan por un link pegado en Discord, desde el celular.
- **Gente que viene del portfolio.** Recruiters y colegas que salen de `portfolio4` para ver qué más
  hizo. Curiosean, no buscan nada puntual.
- **Cualquiera.** Tráfico suelto, sin contexto.

## Product Purpose

Juntar en un solo lugar todo lo que está publicado en `nicolasdalessandro.dev`, y lo que se
publique después, sin que nadie mantenga una lista a mano. Y que recorrerlo sea divertido, con
easter eggs para quien se queda.

El éxito se ve así: el dueño entra por la sala en lugar de tipear subdominios, un visitante llega a
cualquier proyecto en un click o una tecla, y alguien encuentra un secreto y lo cuenta.

## Positioning

La lista no la escribe nadie: sale de lo que de verdad corre en la VPS. Cada stack de `infra` lleva
su ficha `x-hub`, el deploy las junta en un `catalogo.json` y la sala se actualiza sola en dos
minutos. Un proyecto apagado desaparece y uno nuevo aparece, sin tocar este repo.

Es la cara informal y jugable de los sitios propios: `portfolio4` es la ficha técnica sobria y
`museo` es una tele.

## Operating Context

- Escritorio con teclado (el dueño, los colegas) y celular con el dedo (los links de Discord).
- La sala vive en `hub.nicolasdalessandro.dev` (elegido el 2026-10-28), y cada proyecto en su
  propio subdominio: entrar a una máquina es salir de la sala.
- El catálogo llega en runtime (`/catalogo.json`). Puede tardar, faltar o venir roto, y la sala
  tiene que seguir en pie.
- Al 2026-10-26, la sala tiene seis máquinas: `portfolio4` (`nicolasdalessandro.dev`), neonduel,
  surf, nonograma, museo y el puente de audio (`audio.`). Tres son juegos, uno es un museo de
  shaders, uno es una herramienta y uno es el portfolio.

## Capabilities and Constraints

- **Grilla de proyectos** ([ADR-0011](docs/adr/0011-el-hub-es-una-grilla-de-proyectos.md)): un
  recuadro con su vista previa por proyecto. Entrar cuesta un click o la tecla de su número, y la
  grilla se recorre entera con el teclado.
- **Entra lo usable** ([ADR-0005](docs/adr/0005-entra-lo-que-cualquiera-puede-usar.md)): lo que
  cualquiera puede usar sin pedir permiso. Lo `oculto` no está, y lo apagado no se muestra.
- **Público y sin login** ([ADR-0002](docs/adr/0002-el-hub-es-publico.md)).
- **Español e inglés** ([ADR-0008](docs/adr/0008-espanol-e-ingles.md)): ningún texto visible se
  escribe en un componente. Las fichas también traen sus textos en los dos idiomas.
- **Sin backend propio:** sitio estático, servido por nginx en la VPS.
- **El primer easter egg es un ganso** que pasea por el hub, persigue el cursor y, si lo alcanza, se
  lo lleva, sin tapar nunca el camino a un proyecto
  ([ADR-0014](docs/adr/0014-el-pato-secuestra-el-cursor.md); era un pato hasta
  [ADR-0016](docs/adr/0016-el-pato-pasa-a-ser-un-ganso.md), y sólo iba por un cursor quieto hasta
  [ADR-0019](docs/adr/0019-el-ganso-persigue-el-cursor.md)).
- **Por decidir:** el nombre de la sala, qué easter eggs siguen al ganso, si se
  muestra el estado en vivo (caído / *healthy*), el depósito de proyectos muertos y los proyectos
  que no viven en la VPS. Las metáforas terminal y mundo para caminar pueden volver como modos
  escondidos ([docs/conceptos.md](docs/conceptos.md)).

## Brand Commitments

- **Voz rioplatense con humor**: los textos son los carteles que escribió a mano el dueño del local
  ("no anda", "metele ficha"). En inglés se mantiene el humor sin traducir literal.
- **Las identidades vecinas no se copian**: ni la ficha técnica de `portfolio4` (Schibsted Grotesk e
  IBM Plex Mono, filas etiqueta/valor) ni la tele de `museo`.
- **Nada de arcade de neón y pixel art genérico**: es el riesgo conocido de la metáfora
  ([ADR-0006](docs/adr/0006-el-concepto-es-una-sala-de-fichines.md)).
- **Nada retro**: ni CRT, ni pixel art, ni neón, ni arcoíris. Lo sumó el usuario el 2026-10-26,
  después de ver la placa terminada ("se ve muy retro y no me representa").
- **Que se sienta del dueño y tenga gracia**: lo propio sale de Córdoba capital y su estilo
  cordobés, de los juegos que hace y del oficio de construirlos (el usuario, 2026-10-26).
- **Lo convencional, bien hecho**: después de descartar la placa y la galería, el usuario eligió una
  grilla de recuadros sin metáfora, con la terminación de Linear como vara y una aurora de fondo
  (2026-10-26). La gracia vive en los textos y en los detalles, no en un disfraz.

## Evidence on Hand

- Los seis proyectos publicados, con sus URLs reales. Hay hostnames en
  `P:\infra\host\cloudflared\config.yml`.
- `nonograma` y `museo` tienen su propio `DESIGN.md`; `portfolio4` tiene `DESIGN.md` y `PRODUCT.md`.
- **No hay:** nombre ni logo de la sala, capturas de los proyectos en este repo, cifras de uso,
  jugadores ni puntajes. Una tabla de récords no puede mostrar puntajes inventados como si fueran
  reales.

## Product Principles

1. **Entrar primero.** La diversión nunca cuesta un click de más para llegar a un proyecto.
2. **La sala es tan verdadera como la VPS.** Muestra lo que corre, y nada inventado.
3. **Los casos raros son parte de la sala.** Lo caído, lo vacío y lo roto tienen su lugar en la
   historia, no una pantalla de error.
4. **El secreto premia al curioso sin frenar al apurado.** Un easter egg nunca se interpone en el
   camino a una máquina.

## Accessibility & Inclusion

- Todo el hub se usa con el teclado: el foco se ve, Tab recorre los proyectos, Enter entra y la
  tecla del número entra directo.
- Cada recuadro es un link con el nombre del proyecto, legible por un lector de pantalla.
- Lo que se mueve solo (el modo demo, las animaciones) respeta `prefers-reduced-motion`.
- Se usa con el dedo en el celular, sin teclado.
