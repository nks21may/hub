# ADR-0010 — El formato de la ficha `x-hub` y de `catalogo.json`; cada app sirve su loop

- **Estado:** aceptado
- **Fecha:** 2026-10-26
- **Decide:** qué campos lleva una ficha, cómo llega en el catálogo, dónde viven los loops y en qué
  orden los lista la placa

## Contexto

La ficha la escribe `infra` en el compose de cada stack
([ADR-0003](0003-el-catalogo-sale-de-las-fichas-de-infra.md)), el deploy las junta en
`catalogo.json` ([ADR-0004](0004-el-catalogo-llega-en-runtime.md)) y la placa las lee. Esto la
vuelve un contrato entre dos repos, con validación en los dos lados.

Lo que la placa necesita de cada juego ([ADR-0009](0009-la-sala-es-una-placa-1000-en-1.md)): un
nombre para la lista, una URL para entrar, una descripción en dos idiomas
([ADR-0008](0008-espanol-e-ingles.md)) y un loop real para la vista previa.

Hay dos preguntas que decidió el usuario el 2026-10-26:

- **Dónde vive el loop.** Las opciones eran cada app, `infra` o este repo.
- **En qué orden va la lista.** Las opciones eran alfabético o por fecha de publicación.

## Decisión

### La ficha (`x-hub` en el compose de cada stack)

Un `x-hub` es **o una ficha, o `oculto`**:

```yaml
x-hub:
  nombre: Nonograma                                   # 1 a 20 caracteres
  url: https://nonograma.nicolasdalessandro.dev/       # https
  desde: 2026-10-18                                    # fecha de publicación, AAAA-MM-DD
  descripcion:                                         # al menos un idioma, 1 a 90 caracteres cada uno
    es: Nonogramas sin fin, de dibujos de pixel art y grillas aleatorias.
    en: Endless nonograms, from pixel-art drawings and random grids.
  vista: https://nonograma.nicolasdalessandro.dev/vista.mp4   # opcional
```

```yaml
x-hub:
  oculto: "whitelist: sólo entran amigos"              # el motivo, nunca vacío
```

- `nombre`, `url`, `desde` y `descripcion` son obligatorios. `vista` es opcional.
- `oculto` gana: si está, el resto se ignora.
- Los campos que la placa no conoce se ignoran, así un campo nuevo y opcional no rompe una placa
  vieja.

### El loop lo sirve cada app

- `vista` es la URL de un video que **sirve la propia app, en el mismo host que `url`**. La placa
  lo pide directo de ahí. No hay binarios en `infra` ni en este repo.
- El video es MP4 (H.264, sin pista de audio), 4:3, 640×480, de hasta 8 segundos en loop y hasta
  1,5 MB. La sala tiene su propio sonido, y la vista previa es 4:3.
- Mientras una app no tiene su loop, la ficha va sin `vista` y la placa muestra un relleno propio.

### El catálogo (`/catalogo.json`, lo escribe el deploy de `infra`)

```json
{
  "version": 1,
  "generado": "2026-10-26T15:04:05Z",
  "stacks": [
    { "stack": "nonograma", "apagado": false, "hub": { "nombre": "Nonograma", "...": "..." } },
    { "stack": "minecraft", "apagado": true, "hub": { "oculto": "whitelist: sólo entran amigos" } }
  ]
}
```

- Una entrada por stack con `x-hub`. `stack` es el nombre de la carpeta en `stacks/`, `apagado` sale
  de `x-deploy`, y `hub` es el `x-hub` tal cual, sin filtrar. Los filtros los aplica la placa, que
  es donde están los tests.
- `version` es 1. Con otra versión, la placa no adivina: muestra SIN SEÑAL.
- `generado` es informativo, y la placa no depende de él.

### Cómo lo lee la placa

- **El orden es por `desde`**, y a igual fecha, por `stack`. Lo nuevo entra al final con el
  número siguiente, como en las placas.
- **El número de cada juego** es su posición en ese orden entre todas las fichas, incluidas las
  apagadas. Apagar un juego deja un hueco en la numeración, pero no corre los demás. Los números
  sólo cambian cuando un stack se saca de `infra`.
- Las fichas `oculto` y las apagadas no aparecen ([ADR-0005](0005-entra-lo-que-cualquiera-puede-usar.md)).
- **Lo que no valida se descarta con su motivo, sin tirar el resto**: una ficha con un campo
  obligatorio mal, un `oculto` vacío, un `stack` repetido. Una `vista` inválida se descarta sola, y
  el juego queda sin vista previa.
- Si el texto no es JSON, o no trae `version: 1` y una lista `stacks`, la lectura entera falla con
  su motivo y la placa muestra SIN SEÑAL.

## Consecuencias

**A favor:** el loop vive con el proyecto y se actualiza con él. Publicar algo sigue siendo un
commit en `infra`, y el loop llega cuando la app lo tenga. El número de cada juego es estable, lo
que habilita "tipeá el número" y un cartel de NUEVO.

**En contra:** hay que sumar un `vista.mp4` en cada app (seis repos hoy), y su servidor tiene que
servirlo. La placa tiene que permitir video desde los subdominios propios
(`media-src https://*.nicolasdalessandro.dev`). Si una app se cae, también se cae su loop, y eso
es coherente con lo que pasa. `desde` se escribe a mano. Los límites de largo se validan en los
dos repos, a mano, y si divergen, el juego se descarta acá con su motivo.

**Se revisa si:** aparecen proyectos fuera de los subdominios propios, o si grabar y mantener los
loops en cada app resulta más caro que tenerlos juntos.

## Alternativas consideradas

- **Los loops en `infra`, al lado del compose.** Todo entra en un commit, pero mete binarios en un
  repo de configuración que la VPS trae cada dos minutos.
- **Los loops en este repo, horneados en la imagen.** Un solo origen y sin tocar las apps, pero
  cada loop nuevo es un commit acá, y eso rompe "publicar sin tocar el hub".
- **Orden alfabético.** No necesita un campo más, pero un proyecto nuevo corre los números de los
  que quedan después.
- **Que el deploy filtre las ocultas y apagadas.** Achica el JSON, pero la regla queda en un script
  de `infra` sin tests de este lado, y una placa futura que quiera mostrar lo apagado como "fuera de
  servicio" no tendría el dato.
