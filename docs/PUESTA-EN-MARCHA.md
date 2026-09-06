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
| Favoritos | `favoritos` | `page.favoritos` |

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

Resueltos en el propio tema con `localStorage`, sin app ni coste.

Hace falta crear una página con handle **`favoritos`** y plantilla
`page.favoritos`, y pegar su URL en *Ajustes del tema → Gia Evolv →
Página de favoritos*. Sin esa URL, el corazón de la cabecera no aparece.

Qué implica esta decisión, para que quede dicho:

- La lista vive en el navegador del visitante. **No sincroniza entre
  dispositivos** y se pierde si borra los datos del sitio.
- **No sirve para recordatorios por correo** («lo que guardaste sigue
  disponible»), que suele ser la razón real por la que se paga una app.
- Si un producto se despublica, se retira de la lista sola al abrir la
  página, en vez de dejar una tarjeta rota.

Se puede migrar a una app más adelante sin rehacer el diseño: el corazón,
el contador y la página ya existen. Para desactivarlo entero hay un
interruptor en *Ajustes del tema → Gia Evolv → Activar favoritos*.

## 6b. Reseñas — hacen falta para que salgan las estrellas

El diseño lleva estrellas en las tarjetas y en la ficha. Dawn las lee de
`product.metafields.reviews.rating`, que rellena una app de reseñas;
Shopify retiró la suya. **Sin app, las estrellas no se pintan** (hay un
guard, así que no rompe nada, simplemente no aparecen).

Recomendado: **Judge.me**, cuyo plan gratuito es permanente y escribe en
ese metafield estándar.

⚠️ Si eliges otra, comprueba que escriba en el namespace `reviews`. Hay
apps que sólo guardan la valoración en su propio metafield, y entonces
las estrellas del tema siguen vacías por muchas reseñas que tengas.

## 7. Antes de publicar

- [ ] Licencia de Nexa con latín extendido (ver README).
- [ ] Resubir las fotos de producto a 1000px+ de lado.
- [ ] Sustituir la imagen del hero, generada por IA y con la etiqueta mal
      escrita ("Alimontivio", "ẄEREQUE").
- [ ] Revisar una por una las afirmaciones comerciales que dejé como
      texto de ejemplo: dosis, tiempos de envío, "envío gratis desde
      $6,000", "menos de 3 días hábiles", "24 h para responder".
