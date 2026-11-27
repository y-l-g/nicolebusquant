/* Nicole Busquant — interactions.
   JavaScript léger, sans dépendance : le site reste lisible sans lui. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

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
    matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }

  /* Le trait : il part du bord gauche de l'écran, dessine la lampe (et le divan),
     puis repart jusqu'au bord droit. Épaisseur constante à l'écran. */
  const ills = $$('svg.ill');
  const fit = () => ills.forEach(svg => {
    const vb = svg.viewBox.baseVal;
    const r = svg.getBoundingClientRect();
    if (!vb || !vb.width || !r.width) return;
    const k = vb.width / r.width;
    svg.style.setProperty('--sw', k.toFixed(3));
    const y = svg.dataset.floor;
    if (y === undefined) return;
    const x0 = vb.x - r.left * k - 2;
    const x1 = vb.x + (doc.clientWidth - r.left) * k + 2;
    const fl = $('.f-l', svg), fr = $('.f-r', svg);
    if (fl) fl.setAttribute('d', `M${x0.toFixed(1)} ${y}H${svg.dataset.start}`);
    if (fr) fr.setAttribute('d', `M${svg.dataset.end} ${y}H${x1.toFixed(1)}`);
    $$('path', svg).forEach(p => {
      try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 2); } catch (e) { /* tracé statique */ }
    });
  });
  fit();
  let frame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fit);
  }, { passive: true });

  /* Le dessin se trace une seule fois, une fois la page chargée. */
  const draw = () => requestAnimationFrame(() => requestAnimationFrame(() =>
    ills.forEach(svg => svg.classList.add('is-drawn'))));
  if (document.readyState === 'complete') setTimeout(draw, 120);
  else window.addEventListener('load', () => setTimeout(draw, 120), { once: true });

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
