# Puesta en marcha — lo que hay que crear en el admin

El tema está construido, pero varias piezas necesitan contenido que sólo
existe en el admin de la tienda. Sin esto, algunas secciones aparecen
vacías **a propósito**: prefieren no pintar nada antes que mostrar
enlaces rotos.

## 1. Menús (Contenido → Menús)

| Menú | Handle | Entradas | Lo usa |
|---|---|---|---|
| Menú principal | `main-menu` | Inicio · Catálogo · Nosotros · Contacto | Cabecera |
| Objetivos | `objetivos` | Energía · Sueño · Movilidad · Digestión · Defensas | Mega menú, columna izquierda |
| Pie · Tienda | `pie-tienda` | Catálogo completo y los cinco objetivos | Pie |
| Pie · Compañía | `pie-compania` | Nosotros · Profesionales · Puntos de venta · Blog · Trabaja con nosotros | Pie |
| Pie · Ayuda | `pie-ayuda` | Contacto · Envíos y devoluciones · FAQ · Asesoría gratuita | Pie |
| Legal | `legal` | Aviso de privacidad · Términos · Política de envíos | Pie |

⚠️ La entrada del menú principal que abre el mega menú **debe llamarse
exactamente igual** que el ajuste "Entrada del menú que lo abre" de la
cabecera (por defecto, `Catálogo`).

## 2. Colecciones (Productos → Colecciones)

Cinco colecciones de objetivo: **Energía, Sueño, Movilidad, Digestión,
Defensas**. Conviene darles imagen: la reutilizan el carrusel de la
portada y los chips del catálogo.

Luego hay que **seleccionarlas** en:

- Portada → *Gia · Explora por objetivo* → cada bloque
- Catálogo → *Gia · Barra de catálogo* → cada chip
- Cabecera → *Gia · Cabecera* → "Colección de la segunda columna"

Mientras no tengan colección ni enlace, esos bloques no se pintan.

## 3. Páginas (Contenido → Páginas)

| Página | Handle | Plantilla |
|---|---|---|
| Nosotros | `nosotros` | `page.nosotros` |
| Contacto | `contacto` | `page.contacto` |

En Contacto hay que rellenar los datos reales (correo, WhatsApp): los
dejé vacíos deliberadamente.

## 4. Políticas (Configuración → Políticas)

Aviso de privacidad, términos, política de envíos y de devoluciones.
Shopify les da URL propia; desde ahí se enlazan en el menú `legal`.

## 5. Filtros del catálogo

El filtrado y el orden de la rejilla usan el sistema de Shopify, que
requiere la app **Search & Discovery** (gratuita). Sin ella, la barra de
filtros no aparece; los chips de objetivo sí, porque son enlaces.

## 6. Favoritos

Los favoritos se resuelven con una app de lista de deseos. El tema queda
preparado:

- `main-product` admite bloques de app, así que la app puede insertar su
  botón en la ficha.
- La cabecera muestra el icono de corazón **sólo** si se rellena
  "Página de favoritos" con la URL que dé la app.

No hay lista propia: sin app, un corazón que no guarda nada es peor que
no tener corazón.

## 7. Antes de publicar

- [ ] Licencia de Nexa con latín extendido (ver README).
- [ ] Resubir las fotos de producto a 1000px+ de lado.
- [ ] Sustituir la imagen del hero, generada por IA y con la etiqueta mal
      escrita ("Alimontivio", "ẄEREQUE").
- [ ] Revisar una por una las afirmaciones comerciales que dejé como
      texto de ejemplo: dosis, tiempos de envío, "envío gratis desde
      $6,000", "menos de 3 días hábiles", "24 h para responder".
