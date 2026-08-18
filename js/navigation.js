/* ============================================================
   NAVIGATION — header, menu mobile, seção ativa, scroll suave
   ============================================================ */

window.AGUA_NAV = (function () {
  'use strict';

  var header, nav, toggle, progress, toTop;
  var links = [];
  var sections = [];

  function init() {
    header   = document.getElementById('header');
    nav      = document.getElementById('nav');
    toggle   = document.getElementById('navToggle');
    progress = document.getElementById('headerProgress');
    toTop    = document.getElementById('toTop');
    links    = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

    sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    bindMenu();
    bindSmoothScroll();
    bindToTop();
    observeSections();
    onScroll();

    medirAltura();
    window.addEventListener('scroll', agendarScroll, { passive: true });
    window.addEventListener('resize', function () { medirAltura(); agendarScroll(); });

    // seções abrem e fecham conteúdo: a altura da página muda sem resize
    if ('ResizeObserver' in window) {
      new ResizeObserver(medirAltura).observe(document.body);
    }
  }

  /* ---------- Header sólido + barra de progresso ----------
     Rodava direto no evento de scroll e lia scrollHeight toda vez, o que
     obriga o navegador a recalcular o layout no meio da rolagem. Agora o
     evento só marca; a leitura acontece uma vez por quadro, e a altura da
     página fica em cache até algo poder tê-la mudado. */
  var alturaMax = 0;
  var pendente = false;
  var ultimoEstado = { solido: null, mostraTopo: null };

  function medirAltura() {
    alturaMax = document.documentElement.scrollHeight - window.innerHeight;
  }

  function agendarScroll() {
    if (pendente) return;
    pendente = true;
    window.requestAnimationFrame(onScroll);
  }

  function onScroll() {
    pendente = false;

    var y = window.scrollY || document.documentElement.scrollTop;
    var vh = window.innerHeight;

    // classes só mudam quando o estado realmente vira: nada de toggle por quadro
    var solido = y > 24;
    if (solido !== ultimoEstado.solido) {
      ultimoEstado.solido = solido;
      header.classList.toggle('is-scrolled', solido);
    }

    var pct = alturaMax > 0 ? (y / alturaMax) * 100 : 0;
    progress.style.setProperty('--progress', pct.toFixed(2) + '%');

    if (toTop) {
      var show = y > vh * 0.9;
      if (show !== ultimoEstado.mostraTopo) {
        ultimoEstado.mostraTopo = show;
        toTop.hidden = false;
        toTop.classList.toggle('is-visible', show);
        toTop.setAttribute('aria-hidden', show ? 'false' : 'true');
        toTop.tabIndex = show ? 0 : -1;
      }
    }
  }

  /* ---------- Menu mobile ---------- */
  function bindMenu() {
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // fecha ao voltar para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }
  }

  /* ---------- Scroll suave (com respeito ao reduced motion) ---------- */
  function bindSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

      window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? 'auto' : 'smooth' });

      // move o foco para a seção (acessibilidade de teclado)
      target.setAttribute('tabindex', '-1');
      window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduce ? 0 : 520);

      if (history.replaceState) history.replaceState(null, '', id);
    });
  }

  /* ---------- Seção ativa no menu ---------- */
  function observeSections() {
    if (!('IntersectionObserver' in window) || !sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (link) {
          var active = link.getAttribute('href') === id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Voltar ao topo ---------- */
  function bindToTop() {
    if (!toTop) return;
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var brand = document.querySelector('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  return { init: init };
})();
