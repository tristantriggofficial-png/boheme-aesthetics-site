/* ============================================================
   BOHEME AESTHETICS — Main JS
   Nav scroll, hamburger, page transitions, product filters
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initPageTransitions();
  initProductFilters();
  document.documentElement.classList.add('js-loaded');
});

function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initHamburger() {
  const toggle = document.querySelector('.nav-hamburger');
  const menu   = document.querySelector('.nav-mobile');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('active');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      toggle.classList.remove('active');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
}

function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  overlay.style.opacity = '1';
  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.transition = 'opacity 0.35s ease';
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
}

function initProductFilters() {
  const pills    = document.querySelectorAll('.filter-pill');
  const products = document.querySelectorAll('[data-category]');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.filter;
      products.forEach(p => {
        const show = cat === 'all' || p.dataset.category === cat;
        p.style.display = show ? '' : 'none';
        if (show) {
          p.style.opacity = '0';
          p.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
          });
        }
      });
    });
  });
}
