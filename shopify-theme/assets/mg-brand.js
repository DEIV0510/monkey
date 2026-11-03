/* Monkey Grip — interacciones de las secciones propias (muestras de color, visor de imágenes). */
(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    var swatch = event.target.closest('.mg-swatch');
    if (swatch) {
      var wrap = swatch.closest('[data-mg-swatches]');
      var group = wrap.dataset.mgSwatches;
      wrap.querySelectorAll('.mg-swatch').forEach(function (s) {
        s.setAttribute('aria-checked', s === swatch ? 'true' : 'false');
      });
      document.querySelectorAll('[data-mg-target="' + group + '"]').forEach(function (img) {
        img.classList.add('is-swapping');
        setTimeout(function () {
          img.srcset = swatch.dataset.srcset;
          img.src = swatch.dataset.src;
          img.alt = swatch.dataset.label;
          img.classList.remove('is-swapping');
        }, 150);
      });
      document.querySelectorAll('[data-mg-label="' + group + '"]').forEach(function (el) { el.textContent = swatch.dataset.label; });
      document.querySelectorAll('[data-mg-link="' + group + '"]').forEach(function (a) { a.href = swatch.dataset.url; });
      return;
    }

    var zoom = event.target.closest('[data-mg-zoom]');
    if (zoom && !event.target.closest('figcaption')) {
      var dialog = document.getElementById('MgLightbox');
      if (!dialog || !dialog.showModal) return;
      var img = dialog.querySelector('img');
      img.src = zoom.dataset.mgZoom;
      img.alt = (zoom.querySelector('img') || {}).alt || '';
      dialog.showModal();
      return;
    }

    if (event.target.id === 'MgLightbox' || event.target.closest('.mg-lightbox__close')) {
      document.getElementById('MgLightbox').close();
    }
  });
})();
