# Plan de homologación — prototipo → tema Shopify

Referencia única: el artifact **`4be22895`** ("GIA Evolv landing design").
Cada fase se cierra con `shopify theme check` en verde y una verificación
en el servidor local, y se commitea por separado.

Estado a **4 de septiembre de 2026**.

---

## Auditoría de partida

El prototipo tiene 5 vistas más un chrome compartido. Esto es lo que hay
frente a lo que falta:

| Pieza | Vista en el prototipo | Estado |
|---|---|---|
| Barra de anuncio | siempre | ✅ |
| Header + nav + mega menú | siempre | ✅ |
| Logo | siempre | ✅ |
| Footer | siempre | ✅ |
| Marquesina compacta | portada | ✅ |
| Marquesina display | siempre | ✅ |
| Comunidad Instagram | siempre | ✅ |
| Hero | portada | ✅ |
| Explora por objetivo | portada | ✅ |
| Productos estrella | portada | ✅ (sección de Dawn) |
| Confianza | portada | ✅ |
| Boletín inline | portada | ✅ (sección de Dawn) |
| Blog | portada | ✅ (sección de Dawn) |
| Comparativa | producto | ✅ |
| Productos relacionados | producto | ✅ |
| FAQ (acordeón) | producto | ✅ |
| Catálogo con filtros | catálogo | ✅ |
| Nosotros | nosotros | ✅ |
| Contacto | contacto | ✅ |
| Carrito lateral | siempre | ✅ |
| Favoritos | siempre | ✅ localStorage |

---

## Fase 0 — Bloqueadores ajenos al código

No dependen de mí y condicionan el lanzamiento. Van primero porque
cambian decisiones de las fases siguientes.

- [ ] **Licencia de Nexa.** Las Trial renderizan un sello "TRIAL FONT" en
      25 caracteres ASCII, `$` y `%` incluidos. Mitigado con
      `unicode-range`, pero no es solución de producción.
- [ ] **Fotos de producto a 267×309 px.** Se muestran a ~276px: borrosas
      en cualquier pantalla 2x. Resubir a 1000px+ de lado.
- [ ] **Imagen del hero generada por IA.** La etiqueta dice
      "Suplemento Alimontivio" y "ẄEREQUE". Sustituir por foto real.
- [ ] **Reconectar el conector MCP de Shopify** a `gia-evolv-2`.
- [ ] **Decidir el destino de las imágenes**: `assets/` (peso fijo, sin
      `srcset`) o Archivos del admin (CDN + responsivas). Recomiendo lo
      segundo; `assets/` ya va por 2.8 MB.

---

## Fase 1 — Chrome compartido ✅

Lo que se ve en todas las páginas. Es la causa de que el tema "no se
parezca" pese a tener la portada hecha.

- [x] **1.1 Logo.** Subir `b456c919.avif` (más un PNG de respaldo).
      Header en color, footer invertido a blanco. Respetar la zona de
      seguridad del manual (p.3): 0.42em alrededor. Mínimos de uso:
      29px en digital.
- [x] **1.2 Barra de anuncio.** Fondo turquesa `#009389`, texto blanco,
      Montserrat 700 12px, `letter-spacing .06em`, mayúsculas, centrado.
      Configurable y ocultable.
- [x] **1.3 Header.** Sticky, 74px de alto, borde inferior
      `#E4E5E5`. Logo a la izquierda, nav centrado
      (Inicio · Catálogo · Nosotros · Contacto), iconos de favoritos y
      carrito a la derecha con contador en burbuja turquesa.
- [x] **1.4 Mega menú.** Se abre al pasar el ratón sobre "Catálogo".
      Dos columnas: "Por objetivo" (lista de enlaces) y "Más pedidos"
      (tarjetas de producto con imagen y precio). **Debe abrirse también
      con teclado**; en el prototipo es sólo `mouseenter`.
- [x] **1.5 Footer.** Bloque de boletín, lema "Para ti, que evolucionas"
      con el sello circular, tres columnas de enlaces, redes sociales,
      sellos de pago (VISA · MASTERCARD · AMEX · OXXO · SPEI), enlaces
      legales, logo invertido y el aviso sanitario:
      *"Los suplementos alimenticios no son medicamentos y no sustituyen
      una dieta equilibrada. Consulta a tu profesional de salud antes de
      iniciar cualquier suplementación."*
      Ese aviso es obligatorio en México y no debe quedar como texto
      editable que alguien pueda borrar por accidente.

---

## Fase 2 — Corregir la portada ✅

- [x] **2.1 Mover la comparativa a la página de producto.** En el
      prototipo vive en `isProduct`, no en la portada. Error mío.
- [x] **2.2 Explora por objetivo.** Carrusel horizontal de tarjetas
      (imagen + etiqueta + pie), con flechas y scroll-snap. Enlaza a
      colecciones. Falta por completo.
- [x] **2.3 Comunidad y marquesina display en todas las vistas.**
      Corrección de la auditoría: la marquesina compacta **sí** es sólo
      de portada — el "siempre" salió de matchear el `@keyframes`, no la
      sección. Lo que va en todas las vistas es la rejilla de comunidad
      y una **segunda** marquesina que no había detectado: fondo
      turquesa-100, tipografía de marca grande, antes del pie.

---

## Fase 3 — Página de producto ✅

- [x] **3.1 Ficha de producto** homologada (galería, precio, selector de
      variantes, stepper de cantidad, estrellas). Restilizada sobre
      `main-product` de Dawn, no reescrita.
- [x] **3.5 Sección de beneficios** (`gia-benefits`), que no estaba en la
      auditoría inicial: dos columnas desplegables flanqueando una
      imagen.
- [x] **3.2 Comparativa** (movida en la fase 2.1).
- [x] **3.3 Acordeón de FAQ.** Sección `collapsible-content` de Dawn.
- [x] **3.4 Productos relacionados.** Sección de Dawn, restilizada.

---

## Fase 4 — Catálogo ✅

- [x] **4.1 Rejilla** con las tarjetas del diseño. Restilizada sobre
      `card-product` de Dawn. El botón de favorito queda para la fase 6.
- [x] **4.2 Filtros y orden.** Los chips del prototipo son enlaces a
      colecciones, no filtros de cliente: cada objetivo tiene URL propia,
      indexable y compartible, y funciona sin JS. El filtrado y el orden
      reales siguen siendo los de Shopify, en horizontal.

---

## Fase 5 — Nosotros y Contacto ✅

- [x] **5.1 Nosotros**: `page.nosotros.json` — editorial + diferenciadores
      + llamada a la acción. Requiere crear la página con handle
      `nosotros` en el admin y asignarle la plantilla.
- [x] **5.2 Contacto**: `page.contacto.json` — formulario `contact` de
      Shopify con acuse y errores, más panel de datos. Requiere crear la
      página con handle `contacto` y asignarle la plantilla.

---

## Fase 6 — Carrito y favoritos ✅

- [x] **6.1 Carrito lateral** homologado sobre el de Dawn.
- [x] **6.2 Favoritos con `localStorage`.** Revisado con el cliente: las
      apps de lista de deseos cobran todas, así que se construye en el
      tema. Corazón en las tarjetas, contador en la cabecera y página
      propia. No sincroniza entre dispositivos ni permite recordatorios
      por correo; migrable a una app después sin rehacer el diseño.
- [x] **6.3 Estrellas listas para la app de reseñas.** El tema ya lee
      `reviews.rating`; sólo faltaba teñirlas de marca. Requiere instalar
      Judge.me (plan gratuito permanente) para que se pinten.

---

## Fase 7 — Cierre ✅ (lo verificable sin navegador)

- [x] Auditoría de puntos de ruptura. Alineados a los de Dawn (749/989)
      salvo dos que dicta el contenido y quedan anotados.
- [ ] **Revisión responsive real en navegador — pendiente.**
- [x] Accesibilidad estática: imágenes con alt, controles sólo-icono con
      aria-label, `target="_blank"` con rel. **Bug corregido:** el anillo
      de foco usaba `outline:none` + `box-shadow`, que cualquier ancestro
      con overflow recorta. Pasado a `outline`, que no se recorta.
- [ ] **Contraste y orden de tabulación reales — pendiente de navegador.**
- [x] Peso de assets auditado y `loading`/`width`/`height` en todas las
      imágenes.
- [ ] **Lighthouse — pendiente de navegador.**
- [x] Documentado en `docs/PUESTA-EN-MARCHA.md`; las políticas se crean
      en el admin, no en el tema.

---

## Criterios que aplico en todo el trabajo

Cuando el prototipo y una web real de comercio entran en conflicto, gana
la web real, y lo dejo anotado en el commit:

1. **Semántica sobre apariencia.** La comparativa es `<table>`, no un
   grid de divs. Una celda sin destino es `<div>`, no un `<a>` vacío.
2. **Teclado al mismo nivel que el ratón.** Todo lo que responde a
   `:hover` responde a `:focus-visible`.
3. **Preferencias del visitante.** Lo decorativo se detiene con
   `prefers-reduced-motion`.
4. **Dawn antes que código propio.** Si Dawn ya resuelve algo contra
   datos reales (blog, boletín, colecciones, filtros), se restiliza en
   vez de reimplementarse.
5. **La marca vive aislada** en `gia-tokens.css`, `gia-fonts.liquid` y el
   preset de `settings_data.json`, para que Dawn siga siendo
   actualizable.
