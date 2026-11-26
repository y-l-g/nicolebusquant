/* Nicole Busquant — interactions
   Plain JS, no dependency. Everything degrades gracefully without it. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const SVGNS = 'http://www.w3.org/2000/svg';

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

  /* ------------------------------------------------------------ split headings into words */
  $$('.split').forEach(el => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--wi', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
    $$('.w', el).forEach(w => w.setAttribute('aria-hidden', 'true'));
  });

  /* ------------------------------------------------------------ reveal on view */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const t = en.target;
      t.classList.add('is-in');
      if (t.matches('[data-draw]')) t.classList.add('is-drawn');
      io.unobserve(t);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  const revealables = $$('[data-reveal], .split, [data-draw]');
  // reveal what is already on screen at once (no wait for the first observer callback)
  void document.body.offsetWidth; // flush styles so the transitions run
  const vh0 = window.innerHeight;
  revealables.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh0 * 0.92 && r.bottom > 0) {
      el.classList.add('is-in');
      if (el.matches('[data-draw]')) el.classList.add('is-drawn');
    } else io.observe(el);
  });
  // hero illustration draws right away
  $$('[data-draw-now]').forEach(el => el.classList.add('is-drawn'));

  /* ------------------------------------------------------------ the thread */
  const anchors = $$('[data-thread]');
  let thread = null;
  if (anchors.length > 1) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'thread');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVGNS, 'path');
    const head = document.createElementNS(SVGNS, 'circle');
    head.setAttribute('r', '2.6');
    svg.append(path, head);
    document.body.appendChild(svg);
    thread = { svg, path, head, len: 0, samples: [], cur: 0, target: 0, step: 6 };

    const build = () => {
      const W = doc.clientWidth, H = doc.scrollHeight;
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const pts = anchors.map((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height && el.offsetParent === null) return null;
        const tx = el.dataset.tx || 'el:.5', ty = el.dataset.ty || 'top';
        // tx: "el:0.4" = fraction of the element's width, otherwise fraction of the page width
        let x = tx.startsWith('el:') ? r.left + r.width * parseFloat(tx.slice(3)) : parseFloat(tx) * W;
        // on narrow screens, margin anchors hug the very edge so the line never touches the text
        if (!tx.startsWith('el:') && W < 760) x = parseFloat(tx) < .5 ? 7 : W - 7;
        let y = ty.startsWith('el:') ? r.top + r.height * parseFloat(ty.slice(3)) : ty === 'bottom' ? r.bottom : ty === 'mid' ? r.top + r.height / 2 : r.top;
        y += window.scrollY + (parseFloat(el.dataset.dy) || 0);
        return { x, y, loop: el.hasAttribute('data-loop'), jump: el.hasAttribute('data-jump') };
      }).filter(Boolean);
      let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dy = b.y - a.y;
        if (a.jump) {
          d += ` M${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        } else if (Math.abs(b.x - a.x) < 30) {
          // gentle meander along the margin
          const w = (i % 2 ? 1 : -1) * Math.min(18, W * 0.012);
          d += ` C${(a.x + w).toFixed(1)} ${(a.y + dy * 0.35).toFixed(1)} ${(b.x - w).toFixed(1)} ${(b.y - dy * 0.35).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        } else {
          d += ` C${a.x.toFixed(1)} ${(a.y + dy * 0.6).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - dy * 0.6).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        }
        if (b.loop) {
          const r = Math.min(22, W * 0.02);
          const x = b.x, y = b.y;
          d += ` C${(x + r * 1.5).toFixed(1)} ${(y + r * .6).toFixed(1)} ${(x + r * 1.9).toFixed(1)} ${(y - r * 1.6).toFixed(1)} ${(x + r * .4).toFixed(1)} ${(y - r * 1.5).toFixed(1)}`;
          d += ` C${(x - r * .9).toFixed(1)} ${(y - r * 1.4).toFixed(1)} ${(x - r * .7).toFixed(1)} ${(y + r * .2).toFixed(1)} ${(x + r * .1).toFixed(1)} ${(y + r * 1.1).toFixed(1)}`;
          if (i < pts.length - 1) pts[i] = { x: x + r * .1, y: y + r * 1.1 };
        }
      }
      path.setAttribute('d', d);
      const len = path.getTotalLength();
      thread.len = len;
      thread.samples = [];
      for (let s = 0; s <= len; s += thread.step) thread.samples.push(path.getPointAtLength(s));
      path.style.strokeDasharray = `${len} ${len + 10}`;
      if (reduce) { path.style.strokeDashoffset = 0; head.style.display = 'none'; }
    };
    thread.build = build;

    const targetFor = () => {
      const lineY = window.scrollY + window.innerHeight * 0.74;
      const S = thread.samples;
      let i = 0;
      while (i < S.length && S[i].y <= lineY) i++;
      return Math.min(thread.len, i * thread.step);
    };
    thread.tick = () => {
      if (reduce || !thread.len) return;
      thread.target = targetFor();
      thread.cur += (thread.target - thread.cur) * 0.085;
      if (Math.abs(thread.target - thread.cur) < 0.3) thread.cur = thread.target;
      thread.path.style.strokeDashoffset = (thread.len - thread.cur).toFixed(1);
      const p = thread.path.getPointAtLength(thread.cur);
      thread.head.setAttribute('cx', p.x.toFixed(1));
      thread.head.setAttribute('cy', p.y.toFixed(1));
      thread.head.style.opacity = thread.cur > 2 && thread.cur < thread.len - 2 ? 1 : 0;
    };
  }

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

  /* ------------------------------------------------------------ loop */
  const loop = () => {
    if (thread) thread.tick();
    requestAnimationFrame(loop);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const rebuild = () => { if (thread) thread.build(); };
  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(rebuild, 150); });
  window.addEventListener('load', rebuild);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
  if ('ResizeObserver' in window && thread) {
    let last = 0;
    new ResizeObserver(() => { const h = doc.scrollHeight; if (Math.abs(h - last) > 4) { last = h; clearTimeout(rz); rz = setTimeout(rebuild, 120); } }).observe(document.body);
  }
  rebuild();
  requestAnimationFrame(loop);

  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
