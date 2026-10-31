/* Adrit Singh — shared behaviour (index + warehouse).
   Every feature is guarded by feature-detection so each page only runs what it contains. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- tiny shared frame loop ---------- */
  const frameFns = new Set();
  let looping = false;
  function loop(t) {
    frameFns.forEach(fn => fn(t));
    if (frameFns.size) requestAnimationFrame(loop); else looping = false;
  }
  function addFrame(fn) {
    frameFns.add(fn);
    if (!looping) { looping = true; requestAnimationFrame(loop); }
    return () => frameFns.delete(fn);
  }

  /* ---------- preloader → "ready" gate ---------- */
  const preloader = $('#preloader');
  let markReady;
  const ready = new Promise(r => (markReady = r));

  function finishReady() {
    root.classList.add('is-ready');
    try { sessionStorage.setItem('as-visited', '1'); } catch (e) {}
    markReady();
  }

  if (!preloader || root.classList.contains('skip-preload') || reduce) {
    preloader?.remove();
    finishReady();
  } else {
    const bar = $('#plBar'), num = $('#plNum');
    const MIN = 900, start = performance.now();
    let loaded = document.readyState === 'complete';
    window.addEventListener('load', () => (loaded = true));
    let shown = 0;
    const stop = addFrame(now => {
      const target = loaded ? 100 : Math.min(88, ((now - start) / MIN) * 88);
      shown += (target - shown) * 0.12;
      if (loaded && shown > 99.4) shown = 100;
      if (bar) bar.style.width = shown + '%';
      if (num) num.textContent = Math.round(shown);
      if (shown >= 100 && now - start > MIN) {
        stop();
        preloader.classList.add('hide');
        setTimeout(finishReady, 450);
        setTimeout(() => preloader.remove(), 1200);
      }
    });
    setTimeout(() => { loaded = true; }, 6000); // never hang on a slow CDN
  }

  /* ---------- custom cursor (fine pointers only) ---------- */
  const cursor = $('.cursor'), follower = $('.cursor-follower');
  if (fine && cursor && follower && !reduce) {
    root.classList.add('has-custom-cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, fx = mx, fy = my;
    cursor.classList.add('is-hidden'); follower.classList.add('is-hidden');
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('is-hidden'); follower.classList.remove('is-hidden');
      const hot = e.target.closest?.('a, button, [data-magnetic], select, summary');
      const text = e.target.closest?.('input, textarea');
      cursor.classList.toggle('is-link', !!hot);
      follower.classList.toggle('is-link', !!hot);
      cursor.classList.toggle('is-hidden', !!text);
      follower.classList.toggle('is-hidden', !!text);
    }, { passive: true });
    document.addEventListener('pointerleave', () => { cursor.classList.add('is-hidden'); follower.classList.add('is-hidden'); });
    addEventListener('pointerdown', () => follower.classList.add('is-down'));
    addEventListener('pointerup', () => follower.classList.remove('is-down'));
    addFrame(() => {
      fx += (mx - fx) * 0.16; fy += (my - fy) * 0.16;
      cursor.style.transform = `translate3d(${mx}px,${my}px,0)`;
      follower.style.transform = `translate3d(${fx}px,${fy}px,0)`;
    });
  } else {
    cursor?.remove(); follower?.remove();
  }

  /* ---------- scroll UI (progress, navbar, back-to-top, parallax var) ---------- */
  const navbar = $('#navbar'), progress = $('#scrollProgress'), toTop = $('#backToTop');
  const hero = $('.hero');
  let lastY = scrollY, velocity = 0, ticking = false;

  function onScroll() {
    const y = scrollY;
    velocity = y - lastY; lastY = y;
    navbar?.classList.toggle('scrolled', y > 40);
    root.classList.toggle('is-scrolled', y > 40);
    if (progress) {
      const max = root.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    }
    toTop?.classList.toggle('show', y > innerHeight * 0.6);
    if (hero && !reduce && y < innerHeight * 1.2) hero.style.setProperty('--sy', y);
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
  toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- mobile menu ---------- */
  const ham = $('#hamburger'), links = $('#navLinks');
  function setMenu(open) {
    links?.classList.toggle('open', open);
    ham?.classList.toggle('open', open);
    navbar?.classList.toggle('menu-open', open);
    ham?.setAttribute('aria-expanded', String(open));
    ham?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  ham?.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 860) setMenu(false); });

  /* ---------- nav indicator pill + scroll-spy ---------- */
  const indicator = (() => {
    if (!links) return null;
    const el = document.createElement('span');
    el.className = 'nav-indicator'; el.setAttribute('aria-hidden', 'true');
    links.prepend(el);
    return el;
  })();
  const anchorLinks = $$('.nav-link[href^="#"]');
  function moveIndicator(target) {
    if (!indicator || innerWidth <= 860) return;
    if (!target || target.classList.contains('nav-warehouse')) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = target.offsetWidth + 'px';
    indicator.style.transform = `translateX(${target.parentElement.offsetLeft}px)`;
  }
  const activeLink = () => $('.nav-link.active:not(.nav-warehouse)');
  if (indicator) {
    $$('.nav-link', links).forEach(a => {
      a.addEventListener('pointerenter', () => moveIndicator(a));
      a.addEventListener('focus', () => moveIndicator(a));
    });
    links.addEventListener('pointerleave', () => moveIndicator(activeLink()));
    addEventListener('resize', () => moveIndicator(activeLink()));
    (document.fonts?.ready ?? Promise.resolve()).then(() => moveIndicator(activeLink()));
  }
  if (anchorLinks.length) {
    const sections = anchorLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        anchorLinks.forEach(a => a.classList.remove('active'));
        const m = $(`.nav-link[href="#${en.target.id}"]`);
        m?.classList.add('active');
        moveIndicator(m);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- hero: split name, typewriter ---------- */
  const heroName = $('.hero-name[data-split]');
  if (heroName) {
    const palette = [[139, 92, 246], [232, 121, 217], [255, 138, 61]]; // violet → orchid → orange
    const mix = t => {
      const p = t * (palette.length - 1), i = Math.min(palette.length - 2, Math.floor(p)), f = p - i;
      return palette[i].map((c, k) => Math.round(c + (palette[i + 1][k] - c) * f));
    };
    let idx = 0;
    $$('.name-line', heroName).forEach(line => {
      const word = line.textContent.trim(), isLast = line.classList.contains('name-last');
      line.textContent = '';
      [...word].forEach((ch, i) => {
        const s = document.createElement('span');
        s.className = 'char'; s.textContent = ch; s.style.setProperty('--i', idx++);
        if (isLast) s.style.setProperty('--c', `rgb(${mix(i / Math.max(1, word.length - 1)).join(',')})`);
        line.appendChild(s);
      });
    });
  }

  const tw = $('#typewriter');
  if (tw && !reduce) {
    const roles = ['Electronics Enthusiast', 'Embedded Systems Builder', 'Microcontroller Tinkerer', 'Web Developer'];
    let ri = 0, ci = 0, del = false;
    const tick = () => {
      const word = roles[ri];
      tw.textContent = word.slice(0, ci);
      if (!del && ci === word.length) { del = true; return setTimeout(tick, 1500); }
      if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; return setTimeout(tick, 350); }
      ci += del ? -1 : 1;
      setTimeout(tick, del ? 38 : 80);
    };
    ready.then(() => { tw.textContent = ''; setTimeout(tick, 900); });
  }

  /* ---------- reveal on scroll ---------- */
  $$('[data-stagger]').forEach(group => {
    const kids = $$(':scope > [data-reveal]', group);
    kids.forEach((k, i) => { if (!k.style.getPropertyValue('--d')) k.style.setProperty('--d', i * 90 + 'ms'); });
  });
  $$('[data-split-words]').forEach(h => { /* header container reveals as a unit for the underline */
    h.dataset.revealGroup = '';
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      revealObserver.unobserve(el);
      if (el.matches('.skill-item')) fillSkill(el);
      if (el.matches('.about-stats')) $$('.stat-num', el).forEach(countUp);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  ready.then(() => $$('[data-reveal], [data-split], .section-header').forEach(el => revealObserver.observe(el)));

  function fillSkill(item) {
    const lvl = +item.dataset.level, fill = $('.skill-fill', item), pct = $('.skill-pct', item);
    if (fill) fill.style.width = lvl + '%';
    if (!pct || reduce) return;
    const t0 = performance.now(), dur = 1500;
    const step = now => {
      const p = clamp((now - t0 - 150) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
      pct.textContent = Math.round(lvl * e) + '%';
      if (p < 1) requestAnimationFrame(step);
    };
    pct.textContent = '0%';
    requestAnimationFrame(step);
  }
  function countUp(el) {
    const target = +el.dataset.target;
    if (reduce) { el.textContent = target + '+'; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + '+';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (reduce) { $$('.skill-item').forEach(fillSkill); $$('.stat-num').forEach(countUp); }

  /* ---------- pointer effects (delegated, so dynamic cards work too) ---------- */
  if (fine && !reduce) {
    let current = null, raf = 0, ev = null;
    const reset = el => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
    function apply() {
      raf = 0;
      if (!current || !ev) return;
      const r = current.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      current.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      current.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (current.hasAttribute('data-tilt')) {
        current.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
        current.style.setProperty('--rx', ((0.5 - y) * 9).toFixed(2) + 'deg');
      }
    }
    document.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const el = e.target.closest?.('[data-spot], [data-tilt]') ?? null;
      if (el !== current) { if (current) reset(current); current = el; }
      ev = e;
      if (current && !raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (current) reset(current); current = null; });

    /* magnetic buttons: use `translate`, so hover `transform` is untouched */
    document.addEventListener('pointermove', e => {
      $$('[data-magnetic].is-pulled').forEach(m => {
        if (m !== e.target.closest('[data-magnetic]')) { m.style.translate = ''; m.classList.remove('is-pulled'); }
      });
      const m = e.target.closest?.('[data-magnetic]');
      if (!m) return;
      const r = m.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      m.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
      m.classList.add('is-pulled');
    }, { passive: true });

    /* hero mouse parallax (CSS reads --px / --py) */
    if (hero) {
      let tx = 0, ty = 0, px = 0, py = 0, inHero = false;
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
      new IntersectionObserver(([en]) => { inHero = en.isIntersecting; }).observe(hero);
      addFrame(() => {
        if (!inHero) return;
        px += (tx - px) * 0.06; py += (ty - py) * 0.06;
        if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) {
          hero.style.setProperty('--px', px.toFixed(3));
          hero.style.setProperty('--py', py.toFixed(3));
        }
      });
    }
  }

  /* click ripple (delegated) */
  document.addEventListener('click', e => {
    if (reduce) return;
    const el = e.target.closest?.('.btn, .social-icon, .filter-btn, .view-btn, .file-action-btn');
    if (!el || !e.clientX) return;
    const r = el.getBoundingClientRect();
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.left = e.clientX - r.left + 'px'; s.style.top = e.clientY - r.top + 'px';
    el.appendChild(s);
    setTimeout(() => s.remove(), 700);
  });

  /* ---------- marquee: constant drift + reacts to scroll speed ---------- */
  const tracks = $$('.marquee-track');
  if (tracks.length && !reduce) {
    const state = tracks.map(t => {
      const items = [...t.children];
      for (let i = 0; i < 2; i++) items.forEach(c => { const k = c.cloneNode(true); t.appendChild(k); });
      return { t, dir: +t.dataset.speed || 1, x: 0, w: 0, visible: false };
    });
    const measure = () => state.forEach(s => { s.w = s.t.scrollWidth / 3; if (s.dir < 0) s.x = -s.w; });
    (document.fonts?.ready ?? Promise.resolve()).then(measure);
    addEventListener('resize', measure);
    const io = new IntersectionObserver(es => es.forEach(en => {
      const s = state.find(o => o.t.parentElement === en.target); if (s) s.visible = en.isIntersecting;
    }));
    state.forEach(s => io.observe(s.t.parentElement));
    let boost = 0, last = performance.now();
    addFrame(now => {
      const dt = Math.min(48, now - last); last = now;
      boost += (clamp(Math.abs(velocity), 0, 60) - boost) * 0.08;
      state.forEach(s => {
        if (!s.visible || !s.w) return;
        s.x -= s.dir * (0.045 + boost * 0.012) * dt * 3;
        if (s.x <= -s.w * 2) s.x += s.w; if (s.x > 0 && s.dir > 0) s.x -= s.w;
        if (s.dir < 0 && s.x >= 0) s.x -= s.w;
        s.t.style.transform = `translate3d(${s.x}px,0,0)`;
      });
    });
  }

  /* ---------- hero particles (violet / orchid / orange), paused off-screen ---------- */
  const canvas = $('#particles');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    const colors = ['139,92,246', '232,121,217', '255,138,61'];
    const mouse = { x: -9999, y: -9999 };
    let W = 0, H = 0, dpr = 1, ps = [], run = false, vis = true;

    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = clamp(Math.round((W * H) / (fine ? 14000 : 22000)), 24, 110);
      ps = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.7 + 0.4,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.5 + 0.2, c: colors[i % 3 === 0 ? 2 : i % 3]
      }));
    }
    size();
    addEventListener('resize', size);
    if (fine) {
      hero.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
      hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 150 && d > 0.01) { const f = (150 - d) / 150; p.vx += (dx / d) * f * 0.03; p.vy += (dy / d) * f * 0.03; }
        p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy *= 0.985;
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.strokeStyle = `rgba(${a.c},${0.14 * (1 - d / 110)})`; ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    let stopLoop = null;
    const sync = () => {
      const should = vis && !document.hidden;
      if (should && !stopLoop) stopLoop = addFrame(draw);
      else if (!should && stopLoop) { stopLoop(); stopLoop = null; }
    };
    new IntersectionObserver(([en]) => { vis = en.isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  /* ---------- contact form: honest mailto handoff (there is no backend) ---------- */
  const form = $('#contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const status = $('#formStatus');
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) status.textContent = 'Please fill in every field with a valid email.';
      return;
    }
    const d = new FormData(form);
    const subject = encodeURIComponent(`Portfolio message from ${d.get('name')}`);
    const body = encodeURIComponent(`${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`);
    if (status) status.textContent = 'Opening your email app with the message ready to send…';
    window.location.href = `mailto:singhadrit073@gmail.com?subject=${subject}&body=${body}`;
  });
})();
