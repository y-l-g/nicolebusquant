/* Nicole Busquant — interactions
   Plain JS, no dependency. Everything degrades gracefully without it. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ------------------------------------------------------------ header */
  const header = $('.site-header');
  const onScrollHeader = () => {
    const y = window.scrollY;
    if (!header) return;
    header.classList.toggle('is-scrolled', y > 24);
  };

  /* ------------------------------------------------------------ mobile menu */
  const toggle = $('.menu-toggle');
  if (toggle) {
    const setOpen = (open) => {
      doc.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.txt').textContent = open ? 'Fermer' : 'Menu';
    };
    toggle.addEventListener('click', () => setOpen(!doc.classList.contains('menu-open')));
    $$('.nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ------------------------------------------------------------ line drawings */
  // Same on-screen stroke width for every drawing whatever its scale (--sw, in user units),
  // and each path's real length (--len) so the draw-on dash is exact.
  const ills = $$('svg.ill');
  const sizeStrokes = () => ills.forEach(svg => {
    const vb = svg.viewBox.baseVal, w = svg.getBoundingClientRect().width;
    if (vb && vb.width && w) svg.style.setProperty('--sw', (vb.width / w).toFixed(3));
  });
  ills.forEach(svg => $$('.d', svg).forEach(p => {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) {}
  }));
  sizeStrokes();
  let rz;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(sizeStrokes); }, { passive: true });

  /* ------------------------------------------------------------ reveal on view */
  const draw = (el) => el.classList.add('is-drawn');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const t = en.target;
      t.classList.add('is-in');
      if (t.matches('[data-draw], [data-draw-now]')) draw(t);
      io.unobserve(t);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  void document.body.offsetWidth; // flush styles so the transitions run
  const vh0 = window.innerHeight;
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.top < vh0 * 0.92 && r.bottom > 0; };
  // text fades in at once when on screen
  $$('[data-reveal], .split').forEach(el => inView(el) ? el.classList.add('is-in') : io.observe(el));

  // Drawings start only once the page has loaded and settled: a stroke animation runs on
  // the main thread, so starting it while fonts and images are still processed stutters.
  const startDrawings = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    ills.forEach(svg => svg.classList.add('is-ready'));
    requestAnimationFrame(() => {
      $$('[data-draw], [data-draw-now]').forEach(el =>
        (el.matches('[data-draw-now]') || inView(el)) ? draw(el) : io.observe(el));
    });
  }));
  if (document.readyState === 'complete') setTimeout(startDrawings, 150);
  else window.addEventListener('load', () => setTimeout(startDrawings, 150), { once: true });

  /* ------------------------------------------------------------ lightbox */
  const lb = $('.lightbox');
  if (lb && typeof lb.showModal === 'function') {
    const items = $$('[data-full]');
    const img = $('img', lb), cap = $('p', lb);
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.src = it.dataset.full; img.alt = it.querySelector('img').alt; cap.textContent = it.dataset.cap || '';
    };
    items.forEach((it, i) => it.addEventListener('click', () => { show(i); lb.showModal(); }));
    $('.close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
