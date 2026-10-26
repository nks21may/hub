# ADR-0009 — La sala es el menú de una placa multijuego «1000 en 1»

- **Estado:** reemplazado por [ADR-0011](0011-el-hub-es-una-grilla-de-proyectos.md)
- **Fecha:** 2026-10-26
- **Decide:** qué forma y qué mundo visual tiene la sala dentro del concepto de fichines

## Contexto

[ADR-0006](0006-el-concepto-es-una-sala-de-fichines.md) eligió los fichines y dejó el aspecto para
`impeccable` ([ADR-0007](0007-frontend-disenado-con-impeccable.md)). La ronda de dirección (seed
`789feae5`) armó siete candidatos del mundo del fichín rioplatense, ordenados por resonancia:

1. el menú de la placa multijuego trucha del bar;
2. el salón de la costa;
3. los carteles de fibrón del encargado;
4. las revistas de los 90;
5. la tarjeta recargable con su lector;
6. el cospel y los tickets;
7. el arte serigrafiado del gabinete.

La tirada asignó la tarjeta y el lector. El usuario eligió la placa, que era mi candidato más alto.

Lo que el usuario fijó antes de la ronda: cada máquina muestra **un loop real del proyecto**, la
sala arranca **muda con una perilla de volumen**, y lo que la haría sentir mal es que parezca un
template, que sea lenta, que sea neón y pixel art, o que no tenga gracia.

## Decisión

- La sala es **el menú de una placa multijuego trucha**: un título, una lista numerada de juegos,
  un cursor y una vista previa al costado. Cada proyecto es **un juego de la placa**, no una
  máquina aparte. Esto reemplaza la parte de ADR-0006 que decía "cada proyecto es una máquina"; lo
  demás de ADR-0006 sigue.
- **El título cuenta de verdad:** dice «N EN 1», con N igual a la cantidad de juegos visibles del
  catálogo. Las placas truchas mentían con el número; ésta no, salvo en un truco que se presenta
  como chiste.
- **El compromiso de `PRODUCT.md` contra el pixel art se traduce, no se suspende:** mono vectorial
  sobre una grilla fija de caracteres, sin fuentes pixel, sin sprites pixelados, sin bloom ni
  scanlines de filtro. El CRT es un objeto con vidrio, curvatura y reflejo.
- El contrato de dirección (tesis, mundo, primera vista, interacción firma) vive en
  `.impeccable/surfaces/index-html.md`. Hasta que exista `DESIGN.md`, la UI se revisa contra él.

## Consecuencias

**A favor:** un menú es una lista, así que escala a 30 (las truchas tenían mil) y en el celular es
natural. El número del título hace visible el mecanismo: publicás algo y la placa pasa a decir
«7 EN 1». Los casos raros entran solos: un cartel de cartón pegado sobre el vidrio, la placa que
arranca, la pantalla de SIN SEÑAL.

**En contra:** es la dirección que más cerca queda del pixel art que el usuario no quiere: la
traducción tiene que sostenerse en cada pantalla, y un revisor la va a buscar. Se pierde la idea
espacial de recorrer una sala. Los loops reales piden un video por proyecto, y dónde viven lo tiene
que resolver el formato de la ficha.

**Se revisa si:** la traducción no alcanza y la placa se lee como pixel art genérico, o si la lista
deja de ser la mejor forma de llegar a un proyecto.

## Alternativas consideradas

- **La tarjeta y el lector** (lo que asignó la tirada): pasás tu tarjeta por el lector de cada
  máquina. Muy propia del mundo, pero arriesga parecer un cajero automático, y la tarjeta como
  cursor agrega un objeto entre el visitante y el proyecto.
- **Seis direcciones de catálogo, descartadas** (escena ASCII, mesa de corte, borde de nube,
  ciclorama, billetera de pasajes, doble página de Bazaar): ninguna le gana en identificación ni en
  claridad a lo del fichín. Cada una dejó una disciplina, anotada en el contrato.
- **Gabinetes en una sala oscura** (lo estándar de la categoría): es el neón que el usuario
  descartó de entrada.
