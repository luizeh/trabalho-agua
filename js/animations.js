/* ============================================================
   ANIMATIONS — reveal por scroll, parallax, partículas e halo
   ============================================================ */

window.AGUA_ANIM = (function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var particleCtl = null;

  function init() {
    initReveal();
    initCardGlow();
    initParallax();
    initTabs();
    initParticles();

    reduce.addEventListener('change', function () {
      if (reduce.matches && particleCtl) particleCtl.stop();
      else if (!reduce.matches) initParticles();
    });
  }

  /* ------------------------------------------------------------
     1) Revelação progressiva conforme entra na viewport
     ------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window) || reduce.matches) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);   // anima só uma vez
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el, i) {
      // cascata automática entre irmãos de um mesmo grid
      if (!el.hasAttribute('data-delay')) {
        var siblings = el.parentElement ? el.parentElement.children : [];
        var index = Array.prototype.indexOf.call(siblings, el);
        if (index > 0 && index < 5) el.style.setProperty('--reveal-delay', index);
      }
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------
     2) Halo luminoso acompanhando o mouse nos cards
     ------------------------------------------------------------ */
  function initCardGlow() {
    var cards = document.querySelectorAll('.card-glow, .type-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  /* ------------------------------------------------------------
     3) Parallax sutil (apenas em elementos decorativos)
     ------------------------------------------------------------ */
  function initParallax() {
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!layers.length || reduce.matches) return;

    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      layers.forEach(function (layer) {
        var rect = layer.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(layer.getAttribute('data-parallax')) || 0.1;
        var offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        layer.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();
  }

  /* ------------------------------------------------------------
     4) Abas (definições de água cinza) — acessíveis por teclado
     ------------------------------------------------------------ */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      var buttons = Array.prototype.slice.call(group.querySelectorAll('.tab-btn'));

      function select(button) {
        buttons.forEach(function (b) {
          var on = b === button;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', String(on));
          b.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(b.getAttribute('aria-controls'));
          if (panel) {
            panel.classList.toggle('is-active', on);
            panel.hidden = !on;
          }
        });
      }

      buttons.forEach(function (button, i) {
        button.addEventListener('click', function () { select(button); });
        button.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = buttons[(i + 1) % buttons.length];
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = buttons[(i - 1 + buttons.length) % buttons.length];
          if (!next) return;
          e.preventDefault();
          select(next);
          next.focus();
        });
      });
    });
  }

  /* ------------------------------------------------------------
     5) Partículas do hero (canvas leve, pausa fora da tela)
     ------------------------------------------------------------ */
  function initParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas || reduce.matches) return;
    if (particleCtl) particleCtl.stop();

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var raf = null;
    var running = false;
    var w = 0, h = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      // densidade proporcional à área, com teto para telas grandes
      var count = Math.min(Math.round((w * h) / 22000), 70);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.4 + 0.6,
          vy: -(Math.random() * 0.22 + 0.06),
          vx: (Math.random() - 0.5) * 0.1,
          a: Math.random() * 0.4 + 0.12,
          p: Math.random() * Math.PI * 2
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.vy;
        p.p += 0.012;
        p.x += p.vx + Math.sin(p.p) * 0.18;

        if (p.y < -12) { p.y = h + 12; p.x = Math.random() * w; }
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150, 225, 255,' + p.a + ')';
        ctx.fill();
      }
      raf = window.requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; frame(); } }
    function stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    }

    window.addEventListener('resize', resize);
    resize();
    start();

    // pausa quando a hero sai da tela ou a aba fica oculta
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : (running = false, raf && cancelAnimationFrame(raf));
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? (running = false, raf && cancelAnimationFrame(raf)) : start();
    });

    particleCtl = { stop: stop };
  }

  return { init: init };
})();
