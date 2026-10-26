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
      cómo se marca `oculto` y cómo viene el `apagado` que agrega el deploy. Es el contrato con
      `infra` ([ADR-0003](adr/0003-el-catalogo-sale-de-las-fichas-de-infra.md)).
      *Test:* `leerCatalogo` del catálogo de ejemplo devuelve las máquinas visibles, sin las
      `oculto` ni las apagadas; una ficha sin `url`, o con una `url` que no es `https`, se descarta
      con su motivo sin tirar el resto; un texto que no es JSON da una sala vacía con el motivo, sin
      excepción.
      **Se espera rojo:** falla el import del módulo del catálogo, que no existe.
      Ver [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md) y
      [ADR-0005](adr/0005-entra-lo-que-cualquiera-puede-usar.md).
- [ ] **H2 — La sala pinta una máquina por proyecto, desde `/catalogo.json`.** *Depende de H1 y de
      que existan `PRODUCT.md` y `DESIGN.md`.*
      *Test (jsdom):* con `fetch` devolviendo el catálogo de ejemplo, se ve una máquina por ficha
      visible, con su nombre; con `fetch` fallando o devolviendo basura, la sala se renderiza igual
      y muestra el estado de error de `DESIGN.md`, sin máquinas.
      **Se espera rojo:** falla el import del componente de la sala.
      Ver [ADR-0006](adr/0006-el-concepto-es-una-sala-de-fichines.md) y
      [ADR-0007](adr/0007-frontend-disenado-con-impeccable.md).
- [ ] **H3 — Entrar a una máquina con un click o un Enter.** *Depende de H2.*
      *Test (jsdom, user-event):* cada máquina es un link a la `url` de su ficha; con el foco en la
      sala, las flechas mueven el foco de una máquina a la siguiente y Enter la abre.
      **Se espera rojo:** las flechas no mueven el foco.
      Ver [ADR-0006](adr/0006-el-concepto-es-una-sala-de-fichines.md).
- [ ] **H4 — La imagen Docker, como la de nonograma.** *Depende de H2.*
      `Dockerfile` de dos etapas (el gate en el build, `nginx-unprivileged` al final),
      `deploy/nginx.conf` y la CI que publica `ghcr.io/nks21may/hub` para ARM.
      *Test:* un test del gate lee `deploy/nginx.conf` y verifica que `/catalogo.json` se sirve con
      `no-cache` y que la CSP deja pedirlo (`connect-src 'self'`). Fuera del gate, `docker build`
      termina y `docker run` con un catálogo montado sirve la portada y `/catalogo.json`; la salida
      va pegada en la bitácora.
      **Se espera rojo:** el test no encuentra `deploy/nginx.conf`.
      Ver [ADR-0004](adr/0004-el-catalogo-llega-en-runtime.md).

---

## Parkeados

Ideas que todavía no son trabajo tomable: les falta una decisión del usuario o un
dato. Van **sin checkbox** para que el loop no las tome ni las cuente.

- **El subdominio.** `hub.`, `sala.`, `fichines.` u otro. Falta que lo elija el usuario.
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
