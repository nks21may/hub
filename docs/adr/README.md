# ADR de Hub

Architecture Decision Records. Un archivo por decisión, numerado, append-only:
una decisión que cambia **no se edita**, se escribe una nueva que la reemplaza y
la vieja pasa a estado `reemplazado por`. El historial es el punto.

Plantilla: [0000-plantilla.md](0000-plantilla.md).

| # | Decisión | Estado |
|---|---|---|
| [0001](0001-stack-typescript-vite-react-sitio-estatico.md) | TypeScript + Vite + React, sitio estático, gate `npm run gate` | aceptado |
| [0002](0002-el-hub-es-publico.md) | El hub es público | aceptado |
| [0003](0003-el-catalogo-sale-de-las-fichas-de-infra.md) | El catálogo sale de las fichas `x-hub` de `infra`, y su gate las exige | aceptado |
| [0004](0004-el-catalogo-llega-en-runtime.md) | El catálogo llega en runtime: el deploy de `infra` arma `catalogo.json` y el hub lo pide | aceptado |
| [0005](0005-entra-lo-que-cualquiera-puede-usar.md) | Entra lo que cualquiera puede usar sin pedir permiso; lo apagado no se muestra | aceptado |
| [0006](0006-el-concepto-es-una-sala-de-fichines.md) | El concepto es una sala de fichines | reemplazado por 0011 |
| [0007](0007-frontend-disenado-con-impeccable.md) | El frontend se diseña con la skill `impeccable` | aceptado |
| [0008](0008-espanol-e-ingles.md) | Español e inglés | aceptado |
| [0009](0009-la-sala-es-una-placa-1000-en-1.md) | La sala es el menú de una placa multijuego «1000 en 1» | reemplazado por 0011 |
| [0010](0010-formato-de-la-ficha-y-del-catalogo.md) | El formato de la ficha `x-hub` y de `catalogo.json`; cada app sirve su loop | aceptado |
| [0011](0011-el-hub-es-una-grilla-de-proyectos.md) | El hub es una grilla de proyectos con su vista previa, sobre una aurora | aceptado |

## Cuándo escribir uno

Cuando la decisión sea cara de revertir: una pieza de infraestructura, un límite
entre componentes, un formato que se persiste, una postura de seguridad.

**No** hace falta para elegir una librería de utilidad, nombrar un módulo o
acomodar un layout de carpetas.

Si durante el loop TDD aparece una decisión de este calibre, el protocolo
([.claude/commands/tdd.md](../../.claude/commands/tdd.md)) manda parar y escribir
el ADR **antes** del test.
