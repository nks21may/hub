# ADR-0004 — El catálogo llega en runtime: el deploy de `infra` arma `catalogo.json` y el hub lo pide

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** cómo pasan las fichas `x-hub` de `infra` a la página del hub

## Contexto

Las fichas viven en los `compose.yml` de `infra` ([ADR-0003](0003-el-catalogo-sale-de-las-fichas-de-infra.md)),
y la imagen del hub la construye la CI de este repo. Algo tiene que cruzar esa frontera.

La VPS trae `main` de `infra` cada dos minutos y su deploy ya lee los compose de todos los stacks
(`x-deploy`, por ejemplo). Las herramientas del host corren con el `python3` del sistema y
`python3-yaml` (ADR-0010 de `infra`). Ninguna credencial que dé shell en el host vive en GitHub
(ADR-0003 de `infra`), y el repo `infra` guarda la topología entera de la VPS.

## Decisión

- En cada ciclo, **el deploy de `infra` junta los `x-hub` de los stacks en un `catalogo.json`** en
  el host.
- El stack del hub lo **monta read-only** en su contenedor y nginx lo sirve en `/catalogo.json`.
- **La página lo pide al cargar.** La imagen del hub no trae ningún catálogo horneado.
- Para desarrollo y tests, este repo tiene un catálogo de ejemplo, que nunca llega a producción.

## Consecuencias

**A favor:** un commit en `infra` actualiza el hub en dos minutos, sin rebuild de la imagen ni
disparos entre repos. El deploy sabe si cada stack está apagado o *healthy*, así que puede poner
el estado en el mismo JSON. Mostrarlo o no se decide aparte, pero queda habilitado sin otro canal.

**En contra:** sin JavaScript no se ve ningún proyecto, y los buscadores no ven la lista. Para una
sala de fichines se acepta. El hub depende de un archivo que escribe otro repo: si falta, viene
roto o trae una ficha que no valida, la sala lo tiene que mostrar como parte de la sala y no
romperse. Del lado de `infra` hay trabajo: el deploy escribe un archivo nuevo, y el stack del hub
lo monta.

**Se revisa si:** el hub tiene que verse sin JavaScript, o si el deploy de `infra` deja de leer los
compose de todos los stacks.

## Alternativas consideradas

- **En build: la CI del hub clona `infra` y hornea el catálogo.** Necesita en GitHub un token de
  lectura de un repo que describe la VPS entera, y un disparo cruzado (`repository_dispatch`) cada
  vez que cambia una ficha, o el hub queda viejo hasta el próximo push.
- **La página le pide su ficha a cada app.** Son N pedidos a N orígenes, con CORS en cada app, y
  una app caída se lleva su ficha con ella.
