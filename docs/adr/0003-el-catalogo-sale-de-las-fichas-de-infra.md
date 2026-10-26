# ADR-0003 — El catálogo sale de las fichas `x-hub` de `infra`, y su gate las exige

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** dónde vive la lista de proyectos del hub y cómo entra uno nuevo

## Contexto

`infra` ya es la fuente de verdad de lo que corre en la VPS (su ADR-0002). Sumar un proyecto ya
cuesta un commit allá (`docs/runbooks/proyecto-nuevo.md`), y la lista de lo público ya existe en
forma legible por máquina:

- `host/cloudflared/config.yml` tiene una regla por hostname;
- blackbox arma la lista de URLs a probar desde ese mismo archivo (su I25);
- el gate de `infra` ya cruza la regla del túnel con el puerto de `host/puertos.yml` y con el CNAME
  de OpenTofu: los tres van juntos o el gate da rojo.

Una lista a mano en este repo se desincroniza el primer día que se publique algo y no se acuerde de
sumarlo. Que el dueño no supiera qué había en la VPS es el síntoma.

## Decisión

- Cada stack de `infra` que expone algo a internet lleva un `x-hub` en su `compose.yml`, como el
  `x-deploy` que ya existe. Que expone algo a internet quiere decir que tiene una regla en el túnel
  que no está detrás de Access, o un puerto `publico: true`.
- El `x-hub` es **una ficha** (lo que el hub necesita para pintar la máquina) **o `oculto:
  "<motivo>"`**. El motivo queda escrito y no hay excepciones mudas.
- La ficha es **por stack, no por hostname**: `www.` es un alias de `portafolio` y no lleva la suya.
- Lo que está detrás de Access (`grafana.`, `ssh.`) queda afuera solo: el gate de `infra` ya lo
  conoce como `DETRAS_DE_ACCESS`.
- **El gate de `infra` da rojo** si un stack que expone algo no tiene `x-hub`.
- Los campos de la ficha los fija este repo, con su propio ADR, antes del primer test que los lea:
  es un contrato entre los dos repos.

## Consecuencias

**A favor:** publicar algo y que aparezca en el hub es el mismo commit, y el gate no deja olvidarse,
igual que hoy con el puerto y el CNAME.

**En contra:** `infra` carga contenido que no es infraestructura (nombres, descripciones, quizá
imágenes). El formato vive en dos lugares, el validador de este repo y el chequeo del gate de
`infra`, y se mantienen a mano: si divergen, la sala tiene que descartar la ficha inválida en lugar
de romperse. Lo que no vive en la VPS (un juego en itch.io, un repo suelto) no tiene stack y no
entra por acá.

**Se revisa si:** una parte importante de lo que se quiere mostrar deja de vivir en la VPS.

## Alternativas consideradas

- **Lista a mano en este repo.** Es lo más simple, y es exactamente cómo se pierde la cuenta de lo
  publicado.
- **Cada app declara su ficha en su propio repo** (un `hub.json` que sirve la app) y el hub las
  junta. Queda descentralizado, pero el hub depende de N URLs o repos para armarse, y nada obliga a
  una app nueva a tener la suya.
