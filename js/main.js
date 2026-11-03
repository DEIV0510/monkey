(function () {
  'use strict';

  var CATALOG = window.MONKEY_CATALOG;
  var fmt = window.formatCOP;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function swatchBackground(color) {
    if (!color.swatch) return '';
    return 'linear-gradient(135deg, ' + color.swatch[0] + ' 50%, ' + color.swatch[1] + ' 50%)';
  }

  function isAvailable(product, key) {
    return !(product.stock && product.stock[key] === false);
  }

  /* ---------- Pantalla de carga (solo portada) ---------- */
  var loader = $('#loader');
  if (loader) {
    var start = Date.now();
    var hide = function () {
      setTimeout(function () { loader.classList.add('hidden'); }, Math.max(0, 250 - (Date.now() - start)));
    };
    if (document.readyState !== 'loading') hide();
    else document.addEventListener('DOMContentLoaded', hide);
    setTimeout(hide, 2000);
  }

  /* ---------- Menú móvil ---------- */
  var burger = $('#burger');
  var mobileMenu = $('#mobile-menu');
  if (burger && mobileMenu) {
    var setMenu = function (open) {
      burger.classList.toggle('active', open);
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
    };
    burger.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('open')); });
    $$('a', mobileMenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  /* ---------- Aparición al hacer scroll ----------
     Solo se ocultan los bloques que empiezan debajo de la pantalla; si algo falla, todo queda visible. */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pre-reveal');
        io.observe(el);
      }
    });
  }

  /* srcset de una foto de producto: versión liviana + versión completa */
  function srcsetFor(product, color) {
    return color.thumb + ' ' + product.thumbWidth + 'w, ' + color.image + ' ' + product.imageWidth + 'w';
  }

  /* ---------- Enlaces de WhatsApp ---------- */
  $$('[data-wa]').forEach(function (el) {
    el.href = window.buildWhatsAppLink(el.dataset.wa || undefined);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- Búsqueda ---------- */
  var overlay = $('#search-overlay');
  if (overlay) {
    var input = $('#search-input');
    var results = $('#search-results');
    var index = [];
    Object.keys(CATALOG.products).forEach(function (id) {
      var p = CATALOG.products[id];
      index.push({ title: p.name, sub: fmt(p.price) + ' por ' + p.unit, href: p.url, terms: p.name + ' ' + p.tagline });
      p.colors.forEach(function (c) {
        index.push({ title: p.name + ' · ' + c.name, sub: 'Color', href: p.url + '?color=' + encodeURIComponent(c.code), terms: p.name + ' ' + c.name });
      });
    });
    CATALOG.extras.forEach(function (x) {
      index.push({ title: x.name, sub: 'Consultar', href: 'index.html#mas', terms: x.name + ' ' + x.note });
    });
    var normalize = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var renderResults = function () {
      var q = normalize(input.value.trim());
      var list = index.filter(function (i) { return !q || normalize(i.terms).indexOf(q) !== -1; }).slice(0, 12);
      results.innerHTML = list.length
        ? list.map(function (i) { return '<li><a href="' + i.href + '"><strong>' + i.title + '</strong><span>' + i.sub + '</span></a></li>'; }).join('')
        : '<li class="small" style="padding-top:18px">Sin resultados.</li>';
    };
    var openSearch = function () { overlay.classList.add('open'); document.body.classList.add('no-scroll'); renderResults(); setTimeout(function () { input.focus(); }, 50); };
    var closeSearch = function () { overlay.classList.remove('open'); document.body.classList.remove('no-scroll'); input.value = ''; };
    $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', openSearch); });
    $('#search-close').addEventListener('click', closeSearch);
    input.addEventListener('input', renderResults);
    results.addEventListener('click', function (e) { if (e.target.closest('a')) closeSearch(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch(); });
  }

  /* ---------- Muestras de color en portada (hero y tarjetas) ---------- */
  $$('[data-color-picker]').forEach(function (wrap) {
    var product = CATALOG.products[wrap.dataset.colorPicker];
    var target = $(wrap.dataset.target);
    var label = wrap.dataset.label ? $(wrap.dataset.label) : null;
    var links = wrap.dataset.links ? $$(wrap.dataset.links) : [];
    if (!product || !target) return;
    wrap.setAttribute('role', 'radiogroup');
    wrap.innerHTML = product.colors.map(function (c, i) {
      return '<button type="button" class="swatch' + (wrap.dataset.size === 'sm' ? ' swatch--sm' : '') + '" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + c.name + '" title="' + c.name + '" data-code="' + c.code + '" style="background:' + swatchBackground(c) + '"></button>';
    }).join('');
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.swatch');
      if (!btn) return;
      var color = product.colors.filter(function (c) { return c.code === btn.dataset.code; })[0];
      $$('.swatch', wrap).forEach(function (s) { s.setAttribute('aria-checked', s === btn ? 'true' : 'false'); });
      target.classList.add('is-swapping');
      setTimeout(function () {
        if (target.hasAttribute('srcset')) target.srcset = srcsetFor(product, color);
        target.src = wrap.dataset.full ? color.image : color.thumb;
        target.alt = product.name + ' ' + color.name;
        target.classList.remove('is-swapping');
      }, 160);
      if (label) label.textContent = color.name;
      links.forEach(function (a) { a.href = product.url + '?color=' + encodeURIComponent(color.code); });
    });
  });

  /* ---------- Visor de imágenes ---------- */
  var lightbox = $('#lightbox');
  var openLightbox = function (src, alt) {
    if (!lightbox) return;
    var img = $('img', lightbox);
    img.src = src;
    img.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.classList.add('no-scroll');
    $('.lightbox__close', lightbox).focus();
  };
  if (lightbox) {
    var closeLightbox = function () { lightbox.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox || e.target.closest('.lightbox__close')) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox(); });
    $$('[data-zoom]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.closest('figcaption')) return;
        var img = el.tagName === 'IMG' ? el : $('img', el);
        openLightbox(el.dataset.zoom || img.currentSrc || img.src, img.alt);
      });
    });
  }

  /* ---------- Modales (guía de tallas) ---------- */
  $$('[data-modal-open]').forEach(function (btn) {
    var modal = document.getElementById(btn.dataset.modalOpen);
    if (!modal) return;
    btn.addEventListener('click', function () {
      modal.classList.add('is-open');
      document.body.classList.add('no-scroll');
      $('.modal__close', modal).focus();
    });
  });
  $$('.modal').forEach(function (modal) {
    var close = function () { modal.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-modal-close]')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
  });

  /* ---------- Ficha de producto ---------- */
  var pdp = $('[data-pdp]');
  if (pdp) {
    var product = CATALOG.products[pdp.dataset.pdp];
    var params = new URLSearchParams(location.search);
    var state = {
      color: product.colors.filter(function (c) { return c.code === params.get('color'); })[0] || product.colors[0],
      size: null,
      qty: 1,
    };

    var mainImg = $('[data-main-img]', pdp);
    var variantThumb = $('[data-variant-thumb]', pdp);
    var colorsWrap = $('[data-colors]', pdp);
    var sizesWrap = $('[data-sizes]', pdp);
    var addBtn = $('[data-add]', pdp);
    var status = $('[data-status]', pdp);
    var sticky = $('.sticky-buy');
    var stickyBtn = sticky ? $('[data-sticky-add]', sticky) : null;
    var photoSwatches = pdp.dataset.swatch === 'photo';

    colorsWrap.innerHTML = product.colors.map(function (c) {
      var inner = photoSwatches ? '<img src="' + c.thumb + '" alt="" width="64" height="64">' : '';
      var style = photoSwatches ? '' : ' style="background:' + swatchBackground(c) + '"';
      return '<button type="button" class="swatch' + (photoSwatches ? ' swatch--photo' : '') + '" role="radio" aria-label="' + c.name + '" title="' + c.name + '" data-code="' + c.code + '"' + style + '>' + inner + '</button>';
    }).join('');

    if (sizesWrap && product.sizes) {
      sizesWrap.innerHTML = product.sizes.map(function (s) {
        return '<button type="button" class="size" role="radio" aria-checked="false" data-size="' + s.code + '"><strong>' + s.code + '</strong><span>' + s.range + '</span></button>';
      }).join('');
    }

    var showImage = function (src, srcset, thumbBtn) {
      $$('[data-thumb]', pdp).forEach(function (b) { b.setAttribute('aria-current', b === thumbBtn ? 'true' : 'false'); });
      if (mainImg.dataset.full === src) return;
      mainImg.classList.add('is-swapping');
      setTimeout(function () {
        mainImg.srcset = srcset || '';
        mainImg.src = src;
        mainImg.dataset.full = src;
        mainImg.classList.remove('is-swapping');
      }, 140);
    };

    var update = function (fromColor) {
      var color = state.color;
      var size = state.size;
      $$('.swatch', colorsWrap).forEach(function (s) { s.setAttribute('aria-checked', s.dataset.code === color.code ? 'true' : 'false'); });
      $$('[data-color-name]').forEach(function (el) { el.textContent = color.name; });

      if (sizesWrap && product.sizes) {
        $$('.size', sizesWrap).forEach(function (b) {
          var s = product.sizes.filter(function (x) { return x.code === b.dataset.size; })[0];
          var ok = isAvailable(product, product.sku(color, s));
          b.disabled = !ok;
          b.setAttribute('aria-checked', size && size.code === s.code ? 'true' : 'false');
        });
        $$('[data-size-name]').forEach(function (el) { el.textContent = size ? size.code + ' · ' + size.range : 'Elige una'; });
      }

      var needsSize = product.sizes && !size;
      var sku = needsSize ? null : product.sku(color, size);
      var skuEl = $('[data-sku]', pdp);
      if (skuEl) skuEl.textContent = needsSize ? 'se asigna al elegir la talla' : sku;
      var available = isAvailable(product, sku || color.code);

      var label = needsSize ? 'Elige tu talla' : (available ? 'Agregar al carrito' : 'Agotado');
      addBtn.disabled = needsSize || !available;
      addBtn.textContent = label;
      if (stickyBtn) stickyBtn.textContent = needsSize ? 'Elegir talla' : (available ? 'Agregar' : 'Agotado');
      if (stickyBtn) stickyBtn.disabled = !needsSize && !available;
      var stickyMeta = sticky ? $('[data-sticky-meta]', sticky) : null;
      if (stickyMeta) stickyMeta.textContent = fmt(product.price) + ' · ' + color.name + (size ? ' · ' + size.code : '');

      if (fromColor) {
        variantThumb.dataset.src = color.image;
        variantThumb.dataset.srcset = srcsetFor(product, color);
        $('img', variantThumb).src = color.thumb;
        showImage(color.image, variantThumb.dataset.srcset, variantThumb);
        try {
          var url = new URL(location.href);
          url.searchParams.set('color', color.code);
          history.replaceState(null, '', url);
        } catch (e) { /* file:// no permite cambiar la URL: no afecta la compra */ }
      }
    };

    colorsWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.swatch');
      if (!btn) return;
      state.color = product.colors.filter(function (c) { return c.code === btn.dataset.code; })[0];
      if (state.size && !isAvailable(product, product.sku(state.color, state.size))) state.size = null;
      status.textContent = '';
      update(true);
    });

    if (sizesWrap) {
      sizesWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('.size');
        if (!btn || btn.disabled) return;
        state.size = product.sizes.filter(function (s) { return s.code === btn.dataset.size; })[0];
        status.textContent = '';
        update(false);
      });
    }

    $$('[data-thumb]', pdp).forEach(function (btn) {
      btn.addEventListener('click', function () { showImage(btn.dataset.src, btn.dataset.srcset, btn); });
    });
    var galleryMain = $('.gallery__main', pdp);
    var zoomMain = function () { openLightbox(mainImg.dataset.full || mainImg.src, mainImg.alt); };
    galleryMain.addEventListener('click', zoomMain);
    galleryMain.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zoomMain(); }
    });

    var qtyOut = $('[data-qty-value]', pdp);
    $$('[data-qty-step]', pdp).forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.qty = Math.max(1, Math.min(99, state.qty + Number(btn.dataset.qtyStep)));
        qtyOut.textContent = state.qty;
      });
    });

    addBtn.addEventListener('click', function () {
      if (addBtn.disabled) return;
      window.MonkeyCart.add(product.id, state.color.code, state.size ? state.size.code : null, state.qty);
      status.textContent = 'Agregado al carrito.';
      window.MonkeyCart.open();
    });

    if (stickyBtn) {
      stickyBtn.addEventListener('click', function () {
        if (product.sizes && !state.size) {
          sizesWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
          status.textContent = 'Elige tu talla para continuar.';
          return;
        }
        addBtn.click();
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          sticky.classList.toggle('show', !entries[0].isIntersecting);
        }).observe(addBtn);
      }
      document.body.classList.add('has-sticky');
    }

    update(true);
  }

  /* ---------- Barra fija de la portada ---------- */
  var homeSticky = $('.sticky-buy[data-home]');
  var hero = $('.hero');
  if (homeSticky && hero && 'IntersectionObserver' in window) {
    document.body.classList.add('has-sticky');
    new IntersectionObserver(function (entries) {
      homeSticky.classList.toggle('show', !entries[0].isIntersecting);
    }).observe(hero);
  }

  /* ---------- Año ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
