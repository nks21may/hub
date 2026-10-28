# ADR-0016 — El pato pasa a ser un ganso

- **Estado:** aceptado
- **Fecha:** 2026-10-28
- **Decide:** qué animal pasea por el hub y cómo se diferencia del de Desktop Goose; suma a
  [ADR-0014](0014-el-pato-secuestra-el-cursor.md) y [ADR-0015](0015-el-pato-hace-cuac-con-sonido.md)

## Contexto

El usuario quiso usar el sonido de Desktop Goose para el pato. No se puede: los sonidos de ese
programa son de su autor, el hub y su repo son públicos ([ADR-0002](0002-el-hub-es-publico.md)), y
publicarlos sería redistribuirlos sin permiso. Además, el suyo es un graznido de ganso, no un cuac.
Entonces pidió cambiar el pato por un ganso.

Desktop Goose es un ganso blanco de corral, con el pico naranja, que pasea por el escritorio y roba
el cursor. La idea del secuestro ya venía de ahí (ADR-0014). Con un ganso, el easter egg queda más
cerca de ese programa, así que lo propio tiene que estar en el dibujo y en el sonido.

Sobre el navy del hub (`fondo`, `#050a1c`), un ganso de cuello negro, como el canadiense, pierde la
cabeza contra el cielo. Y el blanco con el ala gris ya se leyó como gaviota (H17).

## Decisión

- **El animal es un ganso común** (el ánsar, el gris de los campos): gris pardo, con el ala más
  oscura, la rabadilla blanca, el cuello largo, y el pico y las patas naranjas. Es vectorial, como
  el pato.
- **Grazna en vez de hacer cuac:** el cartelito dice «¡JONK!», y «HONK!» en inglés. El sonido sigue
  siendo de Web Audio, pero más grave y más largo que el cuac. Las reglas de cuándo grazna y cuándo
  suena son las de ADR-0015.
- **De Desktop Goose se toma sólo la idea.** No se copian su dibujo, sus sonidos ni sus otras
  travesuras: el barro, los memes, las notas, las ventanas.
- Lo demás de ADR-0014 y de ADR-0015 sigue igual: el secuestro, los 10 segundos, cuándo suelta el
  cursor, el movimiento reducido y el dedo.
- En el código y en `DESIGN.md`, el pato pasa a llamarse ganso.

## Consecuencias

**A favor:** el ganso es el animal que la gente asocia con robarse el cursor, y el que lo reconoce se
ríe. El gris pardo se lee sobre el navy sin parecer gaviota, porque lo que hace ganso al dibujo es el
cuello largo y el cuerpo pesado.

**En contra:**

- El easter egg queda más cerca de Desktop Goose. Lo que lo separa es el dibujo, el sonido y que
  vive adentro del hub, no en el escritorio.
- El cambio de nombre toca el componente, sus estilos, los tokens, el diccionario y los tests.
- El graznido sigue siendo sintetizado. Si aparece uno grabado con licencia CC0, entra con su propio
  ADR, que reemplace el «sin archivos» de ADR-0015.

**Se revisa si:** el ganso se lee como una copia de Desktop Goose. La salida sería volver al pato,
que es de este hub.

## Alternativas consideradas

- **Un ganso blanco de corral:** es el de Desktop Goose. Se leería como una copia.
- **Un ganso canadiense** (cuello negro con la mejilla blanca): no se confunde con ningún otro, pero
  la cabeza se pierde contra el cielo navy.
- **Quedarse con el pato** (H17): es más propio, pero el usuario prefiere el ganso.
