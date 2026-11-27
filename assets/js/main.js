/* Nicole Busquant — interactions.
   JavaScript léger, sans dépendance : le site reste lisible sans lui. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* En-tête : un filet discret dès que la page a bougé. */
  const header = $('.site-header');
  const onScroll = () => { if (header) header.classList.toggle('is-scrolled', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  const toggle = $('.menu-toggle');
  if (toggle) {
    const label = $('.txt', toggle);
    const setOpen = (open) => {
      doc.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Fermer' : 'Menu';
    };
    toggle.addEventListener('click', () => setOpen(!doc.classList.contains('menu-open')));
    $$('.nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  /* Dessins : même épaisseur à l'écran quelle que soit l'échelle,
     longueur exacte de chaque trait pour que le tracé soit juste. */
  const ills = $$('svg.ill');
  const sizeStrokes = () => ills.forEach(svg => {
    const vb = svg.viewBox.baseVal;
    const w = svg.getBoundingClientRect().width;
    if (vb && vb.width && w) svg.style.setProperty('--sw', (vb.width / w).toFixed(3));
  });
  ills.forEach(svg => $$('.d', svg).forEach(p => {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) { /* non mesurable : tracé statique */ }
  }));
  sizeStrokes();
  let frame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sizeStrokes);
  }, { passive: true });

  /* Le dessin se trace une seule fois, une fois la page chargée. */
  const draw = () => requestAnimationFrame(() => requestAnimationFrame(() =>
    ills.forEach(svg => svg.classList.add('is-drawn'))));
  if (document.readyState === 'complete') setTimeout(draw, 150);
  else window.addEventListener('load', () => setTimeout(draw, 150), { once: true });

  /* Agrandissement des photos */
  const lb = $('.lightbox');
  if (lb && typeof lb.showModal === 'function') {
    const items = $$('[data-full]');
    const img = $('img', lb), cap = $('p', lb);
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.src = it.dataset.full;
      img.alt = $('img', it).alt;
      cap.textContent = it.dataset.cap || '';
    };
    items.forEach((it, i) => it.addEventListener('click', () => { show(i); lb.showModal(); }));
    $('.close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
