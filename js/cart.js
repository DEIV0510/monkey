/**
 * Carrito Monkey Grip — compartido entre páginas (localStorage del navegador).
 * Cada línea conserva producto, color, talla, SKU, cantidad y precio unitario.
 * El pedido se envía por WhatsApp; el envío se cotiza y se paga por separado.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'mg_cart_v1';
  var CATALOG = window.MONKEY_CATALOG;
  var fmt = window.formatCOP;

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var items = raw ? JSON.parse(raw) : [];
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* modo privado: el carrito vive solo en esta página */ }
    memory = items;
  }

  var memory = read();

  function resolve(item) {
    var product = CATALOG.products[item.productId];
    if (!product) return null;
    var color = product.colors.filter(function (c) { return c.code === item.colorCode; })[0];
    if (!color) return null;
    var size = product.sizes ? product.sizes.filter(function (s) { return s.code === item.sizeCode; })[0] : null;
    if (product.sizes && !size) return null;
    return { product: product, color: color, size: size, sku: product.sku(color, size), qty: item.qty, key: item.key };
  }

  function lines() {
    return memory.map(resolve).filter(Boolean);
  }

  function count() {
    return lines().reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function subtotal() {
    return lines().reduce(function (n, l) { return n + l.qty * l.product.price; }, 0);
  }

  function add(productId, colorCode, sizeCode, qty) {
    var key = [productId, colorCode, sizeCode || ''].join('|');
    var items = memory.slice();
    var existing = items.filter(function (i) { return i.key === key; })[0];
    if (existing) existing.qty = Math.min(99, existing.qty + qty);
    else items.push({ key: key, productId: productId, colorCode: colorCode, sizeCode: sizeCode || null, qty: qty });
    write(items);
    render();
  }

  function setQty(key, qty) {
    var items = memory.map(function (i) { return i.key === key ? Object.assign({}, i, { qty: qty }) : i; })
      .filter(function (i) { return i.qty > 0; });
    write(items);
    render();
  }

  function whatsappMessage() {
    var out = ['Hola Monkey Grip, quiero hacer este pedido:', ''];
    lines().forEach(function (l) {
      var parts = [l.product.name, l.color.name];
      if (l.size) parts.push('Talla ' + l.size.code + ' (' + l.size.range + ')');
      if (l.sku) parts.push('SKU ' + l.sku);
      out.push('• ' + parts.join(' · '));
      out.push('  ' + l.qty + ' ' + (l.qty === 1 ? l.product.unit : l.product.unitPlural) + ' × ' + fmt(l.product.price) + ' = ' + fmt(l.qty * l.product.price));
    });
    out.push('');
    out.push('Subtotal productos: ' + fmt(subtotal()) + ' COP');
    out.push('Envío: por cotizar, se paga por separado.');
    return out.join('\n');
  }

  /* ---------- Interfaz ---------- */
  var drawer;

  function build() {
    drawer = document.createElement('div');
    drawer.id = 'cart';
    drawer.className = 'cart';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML =
      '<div class="cart__backdrop" data-cart-close></div>' +
      '<aside class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">' +
        '<header class="cart__head">' +
          '<h2 id="cart-title" class="cart__title">Tu carrito</h2>' +
          '<button type="button" class="cart__close" data-cart-close aria-label="Cerrar carrito">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</header>' +
        '<div class="cart__body" data-cart-body></div>' +
        '<footer class="cart__foot" data-cart-foot></footer>' +
      '</aside>';
    document.body.appendChild(drawer);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-cart-close]')) close();
      var step = e.target.closest('[data-qty]');
      if (step) setQty(step.dataset.key, Number(step.dataset.qty));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });
  }

  function render() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
    if (!drawer) return;
    var body = drawer.querySelector('[data-cart-body]');
    var foot = drawer.querySelector('[data-cart-foot]');
    var list = lines();
    if (!list.length) {
      body.innerHTML = '<p class="cart__empty">Tu carrito está vacío.</p><a class="btn btn-primary btn-block" href="index.html#productos" data-cart-close>Ver productos</a>';
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = list.map(function (l) {
      var meta = [l.color.name];
      if (l.size) meta.push('Talla ' + l.size.code);
      return '<div class="cart-line">' +
        '<div class="cart-line__img media-' + l.product.media + '"><img src="' + l.color.thumb + '" alt="" width="96" height="96"></div>' +
        '<div class="cart-line__info">' +
          '<p class="cart-line__name">' + l.product.name + '</p>' +
          '<p class="cart-line__meta">' + meta.join(' · ') + '</p>' +
          (l.sku ? '<p class="cart-line__sku">SKU ' + l.sku + '</p>' : '') +
          '<div class="cart-line__row">' +
            '<div class="qty qty--sm">' +
              '<button type="button" data-qty="' + (l.qty - 1) + '" data-key="' + l.key + '" aria-label="Quitar uno">−</button>' +
              '<span>' + l.qty + '</span>' +
              '<button type="button" data-qty="' + Math.min(99, l.qty + 1) + '" data-key="' + l.key + '" aria-label="Agregar uno">+</button>' +
            '</div>' +
            '<p class="cart-line__price">' + fmt(l.qty * l.product.price) + '</p>' +
          '</div>' +
          '<p class="cart-line__unit">' + fmt(l.product.price) + ' por ' + l.product.unit + '</p>' +
        '</div>' +
      '</div>';
    }).join('');
    foot.innerHTML =
      '<dl class="cart__totals">' +
        '<div><dt>Subtotal</dt><dd>' + fmt(subtotal()) + '</dd></div>' +
        '<div><dt>Envío</dt><dd>Se cotiza y se paga aparte</dd></div>' +
        '<div class="cart__total"><dt>Total productos</dt><dd>' + fmt(subtotal()) + ' COP</dd></div>' +
      '</dl>' +
      '<a class="btn btn-primary btn-block" target="_blank" rel="noopener" href="' + window.buildWhatsAppLink(whatsappMessage()) + '">Finalizar pedido por WhatsApp</a>' +
      '<p class="cart__note">Te confirmamos disponibilidad, envío y forma de pago por WhatsApp.</p>';
  }

  function isOpen() { return drawer && drawer.classList.contains('is-open'); }

  var lastFocus = null;
  function open() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    render();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(function () { drawer.querySelector('.cart__close').focus(); }, 60);
  }

  function close() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    render();
    document.querySelectorAll('[data-cart-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
  });

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) { memory = read(); render(); }
  });

  window.MonkeyCart = { add: add, open: open, close: close, count: count };
})();
