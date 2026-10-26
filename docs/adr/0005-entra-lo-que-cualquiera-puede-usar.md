# ADR-0005 — Entra lo que cualquiera puede usar sin pedir permiso; lo apagado no se muestra

- **Estado:** aceptado (propuesto el 2026-10-26; confirmado por el usuario el 2026-10-26)
- **Fecha:** 2026-10-26
- **Decide:** qué stacks con ficha aparecen en la sala y cuáles quedan `oculto`

## Contexto

Con la regla de [ADR-0003](0003-el-catalogo-sale-de-las-fichas-de-infra.md), todo stack que expone
algo lleva `x-hub`. No todos sirven para un visitante. Al 2026-10-26:

| Stack | Hostname | ¿Lo usa cualquiera? |
|---|---|---|
| `portafolio` | `nicolasdalessandro.dev` (+`www`) | sí |
| `neonduel` | `neonduel.` | sí |
| `bhop-surf` | `surf.` | sí |
| `nonograma` | `nonograma.` | sí |
| `museo` | `museo.` | sí |
| `bot_discord` | `audio.` | sí: tiene landing para que cualquiera lo use |
| `minecraft` | `mc.`, puerto 25565 | no: whitelist, y apagado desde el 2026-10-14 (`x-deploy: {apagado: true}`) |

## Decisión

- La sala muestra los stacks cuya ficha apunta a algo que **un visitante cualquiera puede usar sin
  pedir permiso**.
- Lo que no cumple eso lleva `x-hub: {oculto: "<motivo>"}`. Minecraft lleva, por ejemplo,
  `oculto: "whitelist"`.
- **Un stack con `x-deploy: {apagado: true}` no se muestra**, aunque su ficha siga en el compose. El
  `catalogo.json` lo sabe porque lo arma el mismo deploy que lo apaga
  ([ADR-0004](0004-el-catalogo-llega-en-runtime.md)).

## Consecuencias

**A favor:** toda máquina de la sala se puede usar; nadie llega a una ficha sin botón.

**En contra:** lo construido que no se puede usar (Minecraft, lo privado) no se ve. Mostrar lo
construido ya lo hace `portfolio4`.

**Se revisa si:** la sala decide mostrar lo apagado como máquina "fuera de servicio"
([ADR-0006](0006-el-concepto-es-una-sala-de-fichines.md) lo deja abierto). Ese cambio es un ADR
nuevo que reemplaza la última regla de éste.

## Alternativas consideradas

- **Todo lo que corre, como vitrina:** `audio.` y Minecraft con su ficha pero sin botón para
  entrar. Una ficha que no se puede usar frustra, y la vitrina ya es `portfolio4`.
