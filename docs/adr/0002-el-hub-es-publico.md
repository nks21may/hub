# ADR-0002 — El hub es público

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** para quién es el hub y quién lo puede ver

## Contexto

En `P:\` hay 47 carpetas y sólo algunas están publicadas. Al empezar, el dueño no tenía la lista
exacta de lo que corre en la VPS ("hay más proyectos en la VPS, creo"): la lista estaba en `infra`,
no en su cabeza. El hub nace para eso, para tener a mano todo lo publicado y lo que se publique
después.

Ya hay dos sitios propios con una metáfora tomada: `portfolio4` es la ficha técnica sobria
(Lighthouse en 100, bilingüe) y `museo` es una tele. El hub tiene espacio para ser lo informal, y
la idea incluye easter eggs, que sin nadie que los encuentre pierden la mitad de la gracia.

## Decisión

- El hub es **público y sin login**, en un subdominio de `nicolasdalessandro.dev`. Cuál, está por
  decidir.
- Para el dueño, el acceso rápido es un marcador.
- Nada que el hub muestre o sirva puede ser privado: lo que entra al catálogo, lo ve cualquiera.

## Consecuencias

**A favor:** los easter eggs tienen público; el hub entra al runbook de proyecto nuevo de `infra`
como cualquier otro stack público, sin Access ni policy.

**En contra:** lo privado (Grafana, ssh) no tiene lugar en el hub. Si hace falta una vista privada,
es otro producto o una trastienda que se decide aparte.

**Se revisa si:** aparece la necesidad de una parte privada dentro del mismo hub.

## Alternativas consideradas

- **Un lanzador local de `P:\`** (abrir la carpeta, levantar el dev server). Es otro producto:
  necesita el disco y los procesos de la laptop, así que no puede vivir en la VPS.
- **Privado, detrás de Cloudflare Access.** Sirve como marcador, pero los easter eggs se quedan sin
  público.
- **Público con trastienda privada.** No se descarta: se puede sumar después, y hasta puede ser uno
  de los easter eggs. Arrancar con las dos caras duplica el trabajo antes de saber si hace falta.
