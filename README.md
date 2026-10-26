# Hub

La sala de fichines de los proyectos de `nicolasdalessandro.dev`: una página pública donde cada
proyecto publicado en la VPS es una máquina, y entrar a uno cuesta un click o una tecla.

La lista de proyectos no se escribe acá. Cada stack de [`infra`](../infra) lleva su ficha `x-hub`,
el deploy de allá las junta en un `catalogo.json` y la sala lo pide en runtime. Sitio estático en
TypeScript + Vite + React, servido por nginx en la VPS, como `nonograma`.

Los conceptos que se evaluaron, el elegido y los dos que quedaron guardados, están en
[docs/conceptos.md](docs/conceptos.md).

## Arranque rápido

```bash
npm install
npm run dev
```

## El gate

```bash
npm run gate
```

Corre en el host con Node 24: no hay servicios ni otro intérprete, así que no hace falta Docker.

Un solo archivo, para iterar más rápido:

```bash
npx vitest run tests/harness.test.ts
```

> **Ojo con los pipes.** `comando | tail -20` devuelve el exit code de `tail`,
> que es siempre 0: te oculta el rojo. Corré sin pipe, o cerrá con
> `; echo "EXIT=$?"`.

## Cómo se construye esto

Con TDD, un ítem por iteración:

- **Qué falta:** [docs/backlog.md](docs/backlog.md)
- **Qué se hizo y con qué evidencia:** [docs/bitacora.md](docs/bitacora.md)
- **Por qué está así:** [docs/adr/](docs/adr/)

Una iteración se corre con `/tdd` (el protocolo está en
[.claude/commands/tdd.md](.claude/commands/tdd.md)). El branch de trabajo es
`loop/construccion`.

Para dejarlo iterando solo:

```
/loop /tdd
```
