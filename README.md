# Gia Evolv — tema de Shopify

Tema de la tienda Gia Evolv, construido sobre [Dawn](https://github.com/Shopify/dawn) 16.0.0
y restilizado con el sistema de diseño de la marca.

## Estado

Capa de marca aplicada sobre Dawn. Las secciones propias del prototipo
(hero, comparativa, lookbook, reels) están pendientes.

## Estructura de marca

Todo lo específico de Gia Evolv vive en tres lugares, para que actualizar
Dawn siga siendo posible:

| Archivo | Qué contiene |
|---|---|
| `assets/gia-tokens.css` | 270 tokens de diseño (color, tipografía, espaciado, radios, sombras, movimiento) más el puente hacia las variables de Dawn |
| `snippets/gia-fonts.liquid` | `@font-face` de Nexa y Nexa Text, y carga de Montserrat |
| `config/settings_data.json` | Preset `Gia Evolv`: los 5 esquemas de color y las formas (radios, ancho de página) |

Se cargan desde `layout/theme.liquid` justo después de `base.css`, para
que ganen en cascada.

## Color

Del Manual de Identidad Corporativa, p.9:

- Turquesa **#009389** (Pantone 3272 C) — único color de marca, con escala 50→900
- Gris **#7C7D7E** (Pantone 877 C)
- Negro Process **#000000**, tinta de texto **#141414**

## Tipografía — atención antes de lanzar

El manual (p.10) especifica **Nexa** como principal y **Montserrat** como
complementaria. Los archivos Nexa entregados por el cliente son **versiones
Trial** y no sirven para producción:

1. Ningún corte incluye latín acentuado: `Á É Í Ó Ú Ñ ¿ ¡` y las minúsculas
   acentuadas dibujan `.notdef`.
2. Las Trial sustituyen 25 caracteres ASCII por un sello vertical
   "TRIAL FONT". Entre ellos **`$` y `%`** — inviable en una tienda.

Mitigación actual: cada `@font-face` de Nexa declara un `unicode-range`
restringido a lo que la Trial sí rinde (espacio, `!`, coma, guion, punto,
dígitos, `:`, `;`, A–Z, a–z). Todo lo demás cae a Montserrat, que coincide
en ancho y proporción.

Los `.otf` **no están versionados** (ver `.gitignore`): este repo es público
y las Trial no permiten redistribución. Están en `assets/` en local para
`shopify theme push`.

Al comprar la licencia con latín extendido: reemplazar los `.otf`, borrar los
`unicode-range` de `snippets/gia-fonts.liquid` y quitar la regla del
`.gitignore`.

## Desarrollo

```bash
shopify theme dev --store gia-evolv-2.myshopify.com
```

```bash
shopify theme check
```
