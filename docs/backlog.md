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

- [ ] **H1 — El formato de la ficha y la lectura del catálogo.** *Depende de H0.*
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
- [ ] **H2 — La placa lista un juego por ficha visible, y el título los cuenta.** *Depende de H1.*
      Se construye contra el contrato de dirección (`.impeccable/surfaces/index-html.md`).
      *Test (jsdom):* mientras `fetch` no contesta, la placa está en ARRANCANDO; con el catálogo de
      ejemplo, el título dice «N EN 1» con N igual a las fichas visibles, y hay una fila numerada
      (01, 02…) por cada una, con su nombre; con `fetch` fallando o devolviendo basura, la placa
      muestra SIN SEÑAL, sin filas ni excepción. Los textos salen del diccionario, en los dos idiomas.
      **Se espera rojo:** falla el import del componente de la placa.
      Ver [ADR-0009](adr/0009-la-sala-es-una-placa-1000-en-1.md) y
      [ADR-0008](adr/0008-espanol-e-ingles.md).
- [ ] **H3 — El cursor, la vista previa y entrar con un click o un Enter.** *Depende de H2.*
      *Test (jsdom, user-event):* el cursor arranca en 01; ↑ y ↓ lo mueven de a una fila, sin pasarse
      de las puntas; la vista previa muestra la ficha de la fila con el cursor; cada fila es un link
      a la `url` de su ficha, y Enter abre la del cursor. Con `prefers-reduced-motion`, no hay
      animación de entrada.
      **Se espera rojo:** las flechas no mueven el cursor.
      Ver [ADR-0009](adr/0009-la-sala-es-una-placa-1000-en-1.md).
- [ ] **H4 — La imagen Docker, como la de nonograma.** *Depende de H2.*
      `Dockerfile` de dos etapas (el gate en el build, `nginx-unprivileged` al final),
      `deploy/nginx.conf` y la CI que publica `ghcr.io/nks21may/hub` para ARM.
      *Test:* un test del gate lee `deploy/nginx.conf` y verifica que `/catalogo.json` se sirve con
      `no-cache` y que la CSP deja pedirlo (`connect-src 'self'`). Fuera del gate, `docker build`
      termina y `docker run` con un catálogo montado sirve la portada y `/catalogo.json`; la salida
      va pegada en la bitácora.
      **Se espera rojo:** el test no encuentra `deploy/nginx.conf`.
      Ver [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md).
- [ ] **H5 — La revisión final de `impeccable` y `DESIGN.md`.** *Depende de H3.*
      Capturas de escritorio y celular en `.impeccable/review/`, el detector de `impeccable`, el
      revisor final contra el contrato de dirección y, con su veredicto, el documentador que
      escribe `DESIGN.md` y `.impeccable/design.json` desde lo construido.
      *Test:* un test del gate lee los tokens de color de `.impeccable/design.json` y los CSS de
      `src/`, y falla si aparece un color que no está entre los tokens.
      **Se espera rojo:** el test no encuentra `.impeccable/design.json`.
      Ver [ADR-0007](adr/0007-frontend-disenado-con-impeccable.md).

---

## Parkeados

Ideas que todavía no son trabajo tomable: les falta una decisión del usuario o un
dato. Van **sin checkbox** para que el loop no las tome ni las cuente.

- **El subdominio.** `hub.`, `sala.`, `fichines.` u otro. Falta que lo elija el usuario.
- **Los loops de los seis proyectos.** Hay que grabarlos, y dónde viven (en cada app, en `infra` o
  en este repo) lo decide el ADR del formato de la ficha, en H1. Hasta entonces, el catálogo de
  ejemplo usa loops sintéticos marcados como tales.
- **Los easter eggs.** Es la rama del grill que falta: cuáles, cuántos al principio, y si C y D
  vuelven como modos escondidos ([docs/conceptos.md](conceptos.md)).
- **El estado en vivo** (caído / *healthy*) en la sala. [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md)
  lo habilita; falta decidir si se muestra y cómo.
- **El depósito de proyectos muertos** (tuercas, los portfolios viejos). No tienen stack, así que
  su lista viviría en este repo: falta decidirlo, porque choca con la regla 3 del `CLAUDE.md`.
- **Proyectos fuera de la VPS** (itch.io, un repo suelto). Mismo choque que el anterior.
- **Del lado de `infra`** (se escribe en su backlog, no acá): el `x-hub` en cada stack que expone
  algo, el chequeo en su gate, el `catalogo.json` que arma el deploy, y el stack del hub con su
  puerto, su regla del túnel y su CNAME.
