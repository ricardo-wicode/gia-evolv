/*
 * Fachada de vídeo: la portada sólo carga una imagen. El vídeo real —o el
 * iframe de YouTube/Vimeo— no se pide hasta que alguien pulsa play.
 *
 * Así la página no arrastra megabytes de vídeo que casi nadie reproduce, ni
 * carga scripts de terceros que rastrean al visitante antes de que haya
 * pedido ver nada.
 */
(function () {
  'use strict';

  function youtubeId(url) {
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  }

  function vimeoId(url) {
    var m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : null;
  }

  function embed(url) {
    var y = youtubeId(url);
    if (y) return 'https://www.youtube-nocookie.com/embed/' + y + '?autoplay=1&rel=0';
    var v = vimeoId(url);
    if (v) return 'https://player.vimeo.com/video/' + v + '?autoplay=1';
    return null;
  }

  function play(facade) {
    if (facade.dataset.giaPlaying) return;

    var tpl = facade.querySelector('[data-gia-video-source]');
    var ext = facade.dataset.external;
    var node = null;

    if (tpl) {
      node = tpl.content.cloneNode(true);
    } else if (ext) {
      var src = embed(ext);
      if (!src) {
        // Enlace que no sabemos incrustar: se abre fuera en vez de fallar
        // en silencio dejando un play que no hace nada.
        window.open(ext, '_blank', 'noopener');
        return;
      }
      var f = document.createElement('iframe');
      f.src = src;
      f.className = 'gia-vt__video';
      f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('title', facade.querySelector('.gia-vt__quote')?.textContent?.trim() || 'Video testimonio');
      node = f;
    } else {
      return;
    }

    facade.dataset.giaPlaying = '1';
    // La clase retira el degradado, la cabecera y el pie: son ayudas para
    // leer la portada, y encima del vídeo sólo estorban.
    facade.classList.add('is-playing');
    var poster = facade.querySelector('.gia-vt__poster');
    var button = facade.querySelector('.gia-vt__play');
    if (poster) poster.remove();
    if (button) button.remove();
    facade.appendChild(node);

    var video = facade.querySelector('video');
    if (video) {
      video.play().catch(function () { /* el navegador puede bloquear el autoplay */ });
      video.focus();
    }
  }

  function init(root) {
    (root || document).querySelectorAll('[data-gia-video-facade]').forEach(function (f) {
      var btn = f.querySelector('.gia-vt__play');
      if (!btn || btn.dataset.giaReady) return;
      btn.dataset.giaReady = '1';
      btn.addEventListener('click', function () { play(f); });
    });
  }

  init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
