/* ============================================================
   BOHEME AESTHETICS — GSAP Animations
   Fade ins, stagger reveals, parallax, page transitions
   ============================================================ */
'use strict';

window.addEventListener('load', initAnimations);

function initAnimations() {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  initHeroEntrance();
  initFadeUps();
  initStaggerReveals();
  initParallax();
  initSectionHeadings();
}

function initHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from('.hero-eyebrow',   { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' })
    .from('.hero-headline',  { opacity: 0, y: 40, duration: 1,   ease: 'power3.out' }, '-=0.4')
    .from('.hero-body',      { opacity: 0, y: 25, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .from('.hero-cta',       { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.hero-scroll',    { opacity: 0, duration: 0.5 }, '-=0.2');
}

function initFadeUps() {
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.fade-in').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 1,
      duration: 0.9,
      ease: 'power1.out'
    });
  });

  gsap.utils.toArray('.fade-left').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.fade-right').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}

function initStaggerReveals() {
  const groups = document.querySelectorAll('[data-stagger]');
  groups.forEach(group => {
    const children = group.querySelectorAll('[data-stagger-item]');
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 35 });
    gsap.to(children, {
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power2.out',
      stagger: 0.12
    });
  });
}

function initParallax() {
  document.querySelectorAll('.parallax-img').forEach(img => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img.closest('.parallax-wrap') || img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '20%',
      ease: 'none'
    });
  });
}

function initSectionHeadings() {
  document.querySelectorAll('h2.reveal, h3.reveal').forEach(h => {
    gsap.fromTo(h,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      }
    );
  });
}
