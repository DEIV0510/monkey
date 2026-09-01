(function () {
  'use strict';

  var PRODUCTS = window.MONKEY_PRODUCTS;

  /* ---------- Loader ---------- */
  var loader = document.getElementById('loader');
  var loaderStart = Date.now();
  function hideLoader() {
    var elapsed = Date.now() - loaderStart;
    var minDuration = 650;
    var wait = Math.max(0, minDuration - elapsed);
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, wait);
  }
  document.body.classList.add('no-scroll');
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 2500); // failsafe

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');
  function closeMobileMenu() {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  burger.addEventListener('click', function () {
    var opening = !mobileMenu.classList.contains('open');
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll', opening);
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMobileMenu);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- WhatsApp CTAs ---------- */
  var SECTION_MESSAGES = {
    grips: 'Grips',
    ultrarope: 'UltraRope',
    backpack: 'la Backpack',
    'riñoneras': 'las Riñoneras',
  };
  function messageFor(el) {
    var section = el.closest('section');
    if (section && section.id && SECTION_MESSAGES[section.id]) {
      return 'Hola Monkey Grip, quiero más información sobre ' + SECTION_MESSAGES[section.id] + '.';
    }
    return window.MONKEY_CONFIG.contact.whatsappDefaultMessage;
  }
  function refreshWaLinks() {
    document.querySelectorAll('.wa-cta').forEach(function (el) {
      el.setAttribute('href', window.buildWhatsAppLink(messageFor(el)));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }
  refreshWaLinks();

  /* ---------- Grip color selector ---------- */
  var swatchWrap = document.getElementById('grip-swatches');
  var stageImg = document.getElementById('grip-stage-img');
  var stageGlow = document.getElementById('grip-glow');
  var stageColorName = document.getElementById('grip-color-name');

  if (swatchWrap && PRODUCTS) {
    PRODUCTS.grips.forEach(function (grip, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch';
      btn.style.background = grip.hex;
      btn.setAttribute('aria-label', grip.label);
      btn.innerHTML = '<span class="tip">' + grip.label + '</span>';
      btn.addEventListener('click', function () { selectGrip(grip, btn); });
      swatchWrap.appendChild(btn);
    });

    function selectGrip(grip, btn) {
      swatchWrap.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('active'); });
      btn.classList.add('active');
      stageImg.classList.add('swap-out');
      setTimeout(function () {
        stageImg.src = grip.image;
        stageImg.alt = 'Monkey Grip color ' + grip.label;
        stageGlow.style.background = grip.hex;
        stageColorName.textContent = grip.label;
        stageImg.classList.remove('swap-out');
      }, 220);
    }

    // Activa por defecto el amarillo (color de marca)
    var defaultBtn = swatchWrap.querySelectorAll('.swatch')[PRODUCTS.grips.findIndex(function (g) { return g.slug === 'amarillo'; })];
    swatchWrap.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('active'); });
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  /* ---------- Search overlay ---------- */
  var searchOpen = document.getElementById('search-open');
  var searchClose = document.getElementById('search-close');
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

  var SEARCH_INDEX = [];
  if (PRODUCTS) {
    PRODUCTS.categories.forEach(function (c) {
      SEARCH_INDEX.push({ title: c.name, sub: c.short, href: c.href });
    });
    PRODUCTS.grips.forEach(function (g) {
      SEARCH_INDEX.push({ title: 'Grip ' + g.label, sub: 'Color disponible', href: '#grips' });
    });
  }

  function renderResults(query) {
    var q = query.trim().toLowerCase();
    var matches = SEARCH_INDEX.filter(function (item) {
      return !q || item.title.toLowerCase().indexOf(q) !== -1;
    });
    searchResults.innerHTML = '';
    matches.forEach(function (item) {
      var li = document.createElement('li');
      li.style.borderBottom = '1px solid var(--gray-800)';
      var a = document.createElement('a');
      a.href = item.href;
      a.style.display = 'flex';
      a.style.justifyContent = 'space-between';
      a.style.alignItems = 'center';
      a.style.padding = '18px 0';
      a.innerHTML = '<span style="font-weight:700;">' + item.title + '</span><span style="color:var(--gray-400);font-size:.8rem;">' + item.sub + '</span>';
      a.addEventListener('click', closeSearch);
      li.appendChild(a);
      searchResults.appendChild(li);
    });
    if (!matches.length) {
      searchResults.innerHTML = '<li style="color:var(--gray-400);padding-top:18px;">Sin resultados para "' + query + '"</li>';
    }
  }

  function openSearch() {
    searchOverlay.style.display = 'flex';
    document.body.classList.add('no-scroll');
    renderResults('');
    setTimeout(function () { searchInput.focus(); }, 60);
  }
  function closeSearch() {
    searchOverlay.style.display = 'none';
    document.body.classList.remove('no-scroll');
    searchInput.value = '';
  }
  if (searchOpen) {
    searchOpen.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', function () { renderResults(searchInput.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
    });
  }

  /* ---------- Cart popover ---------- */
  var cartOpen = document.getElementById('cart-open');
  var cartPopover = document.getElementById('cart-popover');
  if (cartOpen) {
    cartOpen.addEventListener('click', function (e) {
      e.stopPropagation();
      cartPopover.style.display = cartPopover.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function (e) {
      if (!cartPopover.contains(e.target)) cartPopover.style.display = 'none';
    });
  }

  /* ---------- Sticky mobile CTA ---------- */
  var stickyCta = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyCta.classList.toggle('show', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroObserver.observe(hero);
  }

  /* ---------- Año dinámico ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
