/*
 * Carril horizontal reutilizable.
 *
 * Marcado esperado dentro de un contenedor [data-gia-rail-wrap]:
 *   [data-gia-rail]        el elemento con overflow-x
 *   [data-gia-rail-prev]   botón anterior (nace con hidden)
 *   [data-gia-rail-next]   botón siguiente (nace con hidden)
 *
 * Los botones nacen ocultos y sólo se descubren si el carril desborda de
 * verdad: sin JS no harían nada, y un botón muerto es peor que ninguno.
 * El carril es enfocable, así que también se recorre con teclado.
 */
(function () {
  'use strict';

  function wire(rail) {
    var wrap = rail.closest('[data-gia-rail-wrap]');
    if (!wrap) return;
    var prev = wrap.querySelector('[data-gia-rail-prev]');
    var next = wrap.querySelector('[data-gia-rail-next]');
    if (!prev || !next) return;

    function step() {
      var item = rail.firstElementChild;
      if (!item) return 240;
      var gap = parseFloat(getComputedStyle(rail).columnGap || '16') || 16;
      return item.getBoundingClientRect().width + gap;
    }

    function sync() {
      var overflows = rail.scrollWidth - rail.clientWidth > 4;
      prev.hidden = !overflows;
      next.hidden = !overflows;
      if (!overflows) return;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    }

    prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    // Las imágenes cambian el ancho al cargar: se recalcula cuando pasa.
    if ('ResizeObserver' in window) new ResizeObserver(sync).observe(rail);
    sync();
  }

  function init(root) {
    (root || document).querySelectorAll('[data-gia-rail]').forEach(function (r) {
      if (r.dataset.giaRailReady) return;
      r.dataset.giaRailReady = '1';
      wire(r);
    });
  }

  init();
  // El personalizador reinyecta secciones sin recargar.
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
