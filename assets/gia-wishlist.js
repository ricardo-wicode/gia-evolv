/*
 * Favoritos con almacenamiento local.
 *
 * La lista vive en el navegador del visitante: no sincroniza entre
 * dispositivos y se pierde si limpia los datos del sitio. Es una decisión
 * consciente frente a una app de pago, para un catálogo corto.
 *
 * Sólo se guardan los handles. Los datos del producto se piden a
 * /products/<handle>.js al pintar la página de favoritos, así el precio y
 * la disponibilidad nunca quedan congelados en el almacenamiento.
 *
 * Todo es mejora progresiva: si localStorage no está disponible (modo
 * privado en algunos navegadores, cookies bloqueadas), los controles no
 * llegan a mostrarse. Un corazón que no guarda nada es peor que ninguno.
 */
(function () {
  'use strict';

  var KEY = 'gia:wishlist';
  var EVENT = 'gia:wishlist:change';

  var available = (function () {
    try {
      var probe = '__gia__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function read() {
    if (!available) return [];
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(raw) ? raw.filter(function (h) { return typeof h === 'string'; }) : [];
    } catch (e) {
      return [];
    }
  }

  function write(list) {
    if (!available) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      // Cuota llena: se deja la lista como estaba en vez de romper la página.
      return;
    }
    document.dispatchEvent(new CustomEvent(EVENT, { detail: { items: list } }));
  }

  var Wishlist = {
    available: available,
    items: read,
    has: function (handle) { return read().indexOf(handle) !== -1; },
    count: function () { return read().length; },
    toggle: function (handle) {
      var list = read();
      var i = list.indexOf(handle);
      if (i === -1) list.push(handle); else list.splice(i, 1);
      write(list);
      return i === -1;
    },
    remove: function (handle) {
      var list = read();
      var i = list.indexOf(handle);
      if (i !== -1) { list.splice(i, 1); write(list); }
    }
  };

  window.GiaWishlist = Wishlist;

  /* --- Botón de alternar ------------------------------------------- */

  var LABEL_ADD = 'Guardar en favoritos';
  var LABEL_REMOVE = 'Quitar de favoritos';

  function GiaWishlistButton() {
    return Reflect.construct(HTMLElement, [], GiaWishlistButton);
  }
  GiaWishlistButton.prototype = Object.create(HTMLElement.prototype);
  GiaWishlistButton.prototype.constructor = GiaWishlistButton;
  Object.setPrototypeOf(GiaWishlistButton, HTMLElement);

  GiaWishlistButton.prototype.connectedCallback = function () {
    if (!available) return;
    this.handle = this.getAttribute('data-handle');
    this.button = this.querySelector('button');
    if (!this.handle || !this.button) return;

    this.hidden = false;
    this.sync();

    this.onClick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      Wishlist.toggle(this.handle);
      this.sync();
    }.bind(this);

    this.onChange = this.sync.bind(this);
    this.button.addEventListener('click', this.onClick);
    document.addEventListener(EVENT, this.onChange);
  };

  GiaWishlistButton.prototype.disconnectedCallback = function () {
    if (this.button && this.onClick) this.button.removeEventListener('click', this.onClick);
    if (this.onChange) document.removeEventListener(EVENT, this.onChange);
  };

  GiaWishlistButton.prototype.sync = function () {
    var on = Wishlist.has(this.handle);
    // aria-pressed comunica el estado; el relleno del icono es la señal visual.
    this.button.setAttribute('aria-pressed', on ? 'true' : 'false');
    this.button.setAttribute('aria-label', on ? LABEL_REMOVE : LABEL_ADD);
    this.button.classList.toggle('is-on', on);
  };

  /* --- Contador de la cabecera ------------------------------------- */

  function GiaWishlistCount() {
    return Reflect.construct(HTMLElement, [], GiaWishlistCount);
  }
  GiaWishlistCount.prototype = Object.create(HTMLElement.prototype);
  GiaWishlistCount.prototype.constructor = GiaWishlistCount;
  Object.setPrototypeOf(GiaWishlistCount, HTMLElement);

  GiaWishlistCount.prototype.connectedCallback = function () {
    if (!available) return;
    this.closest('[data-gia-wishlist-link]').hidden = false;
    this.render();
    this.onChange = this.render.bind(this);
    document.addEventListener(EVENT, this.onChange);
    // Otra pestaña puede haber cambiado la lista.
    window.addEventListener('storage', this.onChange);
  };

  GiaWishlistCount.prototype.disconnectedCallback = function () {
    if (!this.onChange) return;
    document.removeEventListener(EVENT, this.onChange);
    window.removeEventListener('storage', this.onChange);
  };

  GiaWishlistCount.prototype.render = function () {
    var n = Wishlist.count();
    this.textContent = n > 0 ? String(n) : '';
    this.hidden = n === 0;
    var link = this.closest('[data-gia-wishlist-link]');
    if (link) link.setAttribute('aria-label', 'Favoritos (' + n + ')');
  };

  /* --- Página de favoritos ----------------------------------------- */

  function GiaWishlistList() {
    return Reflect.construct(HTMLElement, [], GiaWishlistList);
  }
  GiaWishlistList.prototype = Object.create(HTMLElement.prototype);
  GiaWishlistList.prototype.constructor = GiaWishlistList;
  Object.setPrototypeOf(GiaWishlistList, HTMLElement);

  GiaWishlistList.prototype.connectedCallback = function () {
    this.grid = this.querySelector('[data-gia-wishlist-grid]');
    this.empty = this.querySelector('[data-gia-wishlist-empty]');
    this.loading = this.querySelector('[data-gia-wishlist-loading]');
    this.currency = this.getAttribute('data-currency') || 'MXN';
    this.locale = this.getAttribute('data-locale') || 'es-MX';
    this.render();
    this.onChange = this.render.bind(this);
    document.addEventListener(EVENT, this.onChange);
  };

  GiaWishlistList.prototype.disconnectedCallback = function () {
    if (this.onChange) document.removeEventListener(EVENT, this.onChange);
  };

  GiaWishlistList.prototype.money = function (cents) {
    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency', currency: this.currency
      }).format(cents / 100);
    } catch (e) {
      return (cents / 100).toFixed(2);
    }
  };

  GiaWishlistList.prototype.render = function () {
    var self = this;
    var handles = Wishlist.items();

    if (!available || handles.length === 0) {
      this.grid.innerHTML = '';
      this.loading.hidden = true;
      this.empty.hidden = false;
      return;
    }

    this.empty.hidden = true;
    this.loading.hidden = false;

    Promise.all(handles.map(function (h) {
      return fetch(window.Shopify && window.Shopify.routes && window.Shopify.routes.root
        ? window.Shopify.routes.root + 'products/' + encodeURIComponent(h) + '.js'
        : '/products/' + encodeURIComponent(h) + '.js')
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    })).then(function (products) {
      self.loading.hidden = true;

      // Un producto puede haber sido borrado o despublicado: se limpia de
      // la lista en vez de dejar una tarjeta rota para siempre.
      var stale = [];
      products.forEach(function (p, i) { if (!p) stale.push(handles[i]); });
      if (stale.length) {
        stale.forEach(function (h) { Wishlist.remove(h); });
        return;
      }

      self.grid.innerHTML = '';
      products.forEach(function (p) {
        self.grid.appendChild(self.card(p));
      });
      self.empty.hidden = products.length > 0;
    });
  };

  GiaWishlistList.prototype.card = function (p) {
    var li = document.createElement('li');
    li.className = 'gia-wishlist__item';

    var img = p.featured_image
      ? '<img src="' + p.featured_image.replace(/(\.[a-z]+)(\?|$)/i, '_600x$1$2') +
        '" alt="" width="600" height="600" loading="lazy">'
      : '';

    li.innerHTML =
      '<a class="gia-wishlist__card" href="' + p.url + '">' +
        '<span class="gia-wishlist__media">' + img + '</span>' +
        '<span class="gia-wishlist__name"></span>' +
        '<span class="gia-wishlist__price">' + this.money(p.price) + '</span>' +
        (p.available ? '' : '<span class="gia-wishlist__soldout">Agotado</span>') +
      '</a>' +
      '<button type="button" class="gia-wishlist__remove">Quitar</button>';

    // El título se asigna como texto, nunca como HTML.
    li.querySelector('.gia-wishlist__name').textContent = p.title;

    var btn = li.querySelector('.gia-wishlist__remove');
    btn.setAttribute('aria-label', 'Quitar ' + p.title + ' de favoritos');
    btn.addEventListener('click', function () { Wishlist.remove(p.handle); });

    return li;
  };

  if (!customElements.get('gia-wishlist-button')) customElements.define('gia-wishlist-button', GiaWishlistButton);
  if (!customElements.get('gia-wishlist-count')) customElements.define('gia-wishlist-count', GiaWishlistCount);
  if (!customElements.get('gia-wishlist-list')) customElements.define('gia-wishlist-list', GiaWishlistList);
})();
