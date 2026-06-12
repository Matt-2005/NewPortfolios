/* ============================================================
   Matthew LE — Portfolio · « En mouvement »
   Moteur : Lenis (inertie) + GSAP/ScrollTrigger (chorégraphies)
   Tout est gardé : sans CDN, le site reste lisible et fonctionnel.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Outils ---------- */
  const root = document.documentElement;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));
  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const smooth = (p, a, b) => { const t = clamp((p - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const bell = (p, c, w) => Math.exp(-Math.pow((p - c) / w, 2));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  let lenis = null;

  /* ---------- Boucle partagée + vélocité de scroll ---------- */
  const frameCbs = [];
  const onFrame = fn => frameCbs.push(fn);
  let vel = 0, velS = 0, lastY = window.scrollY;
  function runCbs() {
    for (let i = 0; i < frameCbs.length; i++) {
      try { frameCbs[i](); } catch (err) { /* un effet ne tue jamais la boucle */ }
    }
  }
  function startLoop() {
    (function tick() {
      const y = window.scrollY;
      vel = y - lastY; lastY = y;
      velS = lerp(velS, vel, 0.12);
      if (Math.abs(velS) < 0.01) velS = 0;
      runCbs();
      requestAnimationFrame(tick);
    })();
    // filet : si rAF est ralenti (onglet en arrière-plan), le scroll met à jour
    addEventListener('scroll', runCbs, { passive: true });
  }

  /* ---------- Lenis — défilement inertiel ---------- */
  function initLenis() {
    if (reduce || typeof window.Lenis === 'undefined') return;
    try {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
      if (hasGsap) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; }
  }
  function scrollToEl(t) {
    if (lenis) lenis.scrollTo(t, { duration: 1.5, easing: x => 1 - Math.pow(1 - x, 4) });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- Préchargeur (1re visite de la session) ---------- */
  function initPreloader(onDone) {
    const pre = $('.preloader');
    if (!pre || !root.classList.contains('preload')) {
      if (pre) pre.remove();
      onDone();
      return;
    }
    if (lenis) lenis.stop();
    const cnt = $('[data-pre-count]', pre);
    const bar = $('[data-pre-bar]', pre);
    const verb = $('[data-pre-verb]', pre);
    const verbs = ['coder', 'piloter', 'monter', 'rouler', 'créer'];
    let vi = 0;
    const vTimer = setInterval(() => {
      vi = (vi + 1) % verbs.length;
      if (verb) verb.textContent = verbs[vi];
    }, 235);

    const T = 1550, t0 = performance.now();
    (function step(now) {
      const t = clamp((now - t0) / T, 0, 1);
      const e = 1 - Math.pow(1 - t, 4);
      if (cnt) cnt.innerHTML = String(Math.round(e * 100)).padStart(3, '0') + '<small>%</small>';
      if (bar) bar.style.transform = 'scaleX(' + e.toFixed(3) + ')';
      if (t < 1) requestAnimationFrame(step);
      else finish();
    })(t0);

    function finish() {
      clearInterval(vTimer);
      try { sessionStorage.setItem('ml-seen', '1'); } catch (e) { }
      setTimeout(() => {
        pre.classList.add('done');
        setTimeout(onDone, 360);
        setTimeout(() => {
          pre.remove();
          root.classList.remove('preload');
          if (lenis) lenis.start();
        }, 1050);
      }, 200);
    }
  }

  /* ---------- Rideau — transitions entre pages ---------- */
  function initCurtain() {
    const cur = $('.curtain');
    if (!cur) return;
    // Entrée : on arrive d'une autre page du site
    if (root.classList.contains('navd')) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        cur.classList.add('lift');
        setTimeout(() => {
          cur.style.transition = 'none';
          cur.classList.remove('lift');
          root.classList.remove('navd');
          void cur.offsetHeight;
          cur.style.transition = '';
        }, 1050);
      }));
    }
    // Sortie : liens internes vers une autre page
    $$('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!/^(index|projets|contact)\.html(#.*)?$/.test(href)) return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        try { sessionStorage.setItem('ml-nav', '1'); } catch (err) { }
        document.body.classList.remove('menu-open');
        cur.classList.add('cover');
        setTimeout(() => { location.href = href; }, 640);
      });
    });
    addEventListener('pageshow', e => {
      if (e.persisted) {
        cur.style.transition = 'none';
        cur.classList.remove('cover', 'lift');
        root.classList.remove('navd', 'preload');
        const pre = $('.preloader');
        if (pre) pre.remove();
        void cur.offsetHeight;
        cur.style.transition = '';
      }
    });
  }

  /* ---------- Curseur magnétique ---------- */
  function initCursor() {
    if (coarse) return;
    const ring = $('.cursor');
    const dot = $('.cursor-dot');
    if (!ring || !dot) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    addEventListener('mousedown', () => ring.classList.add('is-down'));
    addEventListener('mouseup', () => ring.classList.remove('is-down'));
    (function loop() {
      rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    $$('a, button, .proj-card, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const lab = el.getAttribute('data-cursor');
        if (lab) { ring.classList.add('is-text'); ring.setAttribute('data-label', lab); }
        else ring.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover', 'is-text'));
    });
  }

  /* ---------- Éléments magnétiques ---------- */
  function initMagnetic() {
    if (coarse) return;
    $$('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.4;
      const inner = el.querySelector('.lbl') || el;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
        if (inner !== el) inner.style.transform = 'translate(' + (x * strength * 0.35) + 'px,' + (y * strength * 0.35) + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; if (inner !== el) inner.style.transform = ''; });
    });
  }

  /* ---------- Menu plein écran ---------- */
  function initMenu() {
    const btn = $('.menu-btn');
    const menu = $('.fsmenu');
    if (!btn || !menu) return;
    const toggle = force => {
      const open = force != null ? force : !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    };
    btn.addEventListener('click', () => toggle());
    $$('a[href^="#"]', menu).forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = $(a.getAttribute('href'));
        toggle(false);
        if (t) setTimeout(() => scrollToEl(t), 620);
      });
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- Horloge ---------- */
  function initClock() {
    const el = $('[data-clock]');
    if (!el) return;
    const tick = () => {
      const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
      el.innerHTML = 'LYON <span class="dot">/</span> ' + t;
    };
    tick(); setInterval(tick, 20000);
  }

  /* ---------- Thème jour / nuit ---------- */
  function initTheme() {
    const btn = $('[data-theme-toggle]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ml-theme', next); } catch (e) { }
    });
  }

  /* ---------- Révélations au scroll (classes + IO + filet) ---------- */
  function initReveals() {
    if (reduce) return;
    root.classList.add('anim-ready');
    const els = $$('.reveal, .line-mask, .par-row');
    const show = el => el.classList.add('in-view');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
      els.forEach(el => io.observe(el));
    } else els.forEach(show);
    setTimeout(() => els.forEach(show), 3200); // filet de sécurité
  }

  /* ============================================================
     HERO — intro chorégraphiée, parallaxe, particules
     ============================================================ */
  function heroIntro() {
    if (!hasGsap || reduce || !$('.hero-title')) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if ($('.hero-ghost')) tl.from('.hero-ghost', { scale: 1.14, opacity: 0, duration: 1.7, ease: 'power2.out' }, 0);
    if ($('.hero-grid')) tl.from('.hero-grid', { opacity: 0, duration: 1.3 }, 0);
    tl.from('.hero-title .ln', { yPercent: 115, rotate: 2.4, transformOrigin: '0% 100%', duration: 1.25, stagger: 0.095 }, 0.1);
    if ($('.hero-sweep')) tl.fromTo('.hero-sweep', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0.5);
    if ($('.hero-top')) tl.from('.hero-top > *', { y: 26, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'opacity,transform' }, 0.55);
    if ($('.hero-sub')) tl.from('.hero-sub > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'opacity,transform' }, 0.7);
    if ($('.nav')) tl.from('.nav', { y: -24, opacity: 0, duration: 0.8, clearProps: 'all' }, 0.35);
    if ($('.hero-side')) tl.from('.hero-side', { opacity: 0, duration: 1.4 }, 0.95);
  }

  function heroScrub() {
    if (!hasGsap || reduce || !$('.hero')) return;
    const stHero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 };
    gsap.to('.hero-main', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: stHero });
    if ($('.hero-top')) gsap.to('.hero-top', { yPercent: -80, opacity: 0, ease: 'none', scrollTrigger: Object.assign({}, stHero, { end: '55% top' }) });
    if ($('.hero-ghost-w')) gsap.to('.hero-ghost-w', { yPercent: 24, scale: 1.16, ease: 'none', scrollTrigger: stHero });
    if ($('.hero-grid')) gsap.to(['.hero-grid', '.hero-sweep', '.hero-fx', '.hero-side'], { opacity: 0, ease: 'none', scrollTrigger: Object.assign({}, stHero, { start: '12% top', end: '70% top' }) });
  }

  function initHeroMouse() {
    if (!hasGsap || reduce || coarse) return;
    const hero = $('.hero'), ghost = $('.hero-ghost');
    if (!hero || !ghost) return;
    const gx = gsap.quickTo(ghost, 'x', { duration: 0.9, ease: 'power3' });
    const gy = gsap.quickTo(ghost, 'y', { duration: 0.9, ease: 'power3' });
    hero.addEventListener('mousemove', e => {
      gx((e.clientX / innerWidth * 2 - 1) * 16);
      gy((e.clientY / innerHeight * 2 - 1) * 10);
    });
  }

  /* Champ de vecteurs — des filaments d'air dessinent le vent du hero.
     Traînées persistantes (fondu progressif), souffle lié à la vélocité
     de scroll, répulsion autour du curseur, accents verts FPV. */
  function initHeroFx() {
    const cv = $('.hero-fx'), hero = $('.hero');
    if (!cv || !hero || reduce) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let W = 0, H = 0, run = true, theme = '';
    const N = coarse ? 64 : 118;
    const P = [];
    function seed(pt) {
      pt.x = Math.random() * W; pt.y = Math.random() * H;
      pt.px = pt.x; pt.py = pt.y;
      pt.sp = 0.45 + Math.random() * 0.9;
      pt.life = 90 + Math.random() * 220;
    }
    for (let i = 0; i < N; i++) {
      const pt = { fpv: i % 9 === 0 };
      P.push(pt);
    }
    let mx = -1, my = -1;
    if (!coarse) {
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      });
      hero.addEventListener('mouseleave', () => { mx = -1; });
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P.forEach(seed);
    }
    resize();
    addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(en => { run = en[0].isIntersecting; }, { rootMargin: '120px' }).observe(hero);
    }
    const field = (x, y, t) =>
      (Math.sin(x * 0.0014 + t) * 0.85 +
       Math.cos(y * 0.0012 - t * 0.7) * 0.85 +
       Math.sin((x + y) * 0.0006 + t * 0.45) * 0.6);
    let tt = Math.random() * 90, lastT = performance.now();
    (function frame(now) {
      requestAnimationFrame(frame);
      if (!run || !W) { lastT = now; return; }
      const dt = Math.min((now - lastT) / 16.7, 3); lastT = now;
      tt += 0.0035 * dt;

      const dark = root.getAttribute('data-theme') === 'dark';
      const th = dark ? 'd' : 'l';
      if (th !== theme) { theme = th; ctx.clearRect(0, 0, W, H); P.forEach(seed); }

      // fondu des traînées (on efface un peu, sans toucher au fond)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.075)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      const wind = clamp(velS * 0.05, -2.6, 2.6);
      const ink = dark ? '238,238,246' : '31,33,47';
      const grn = dark ? '207,232,122' : '93,122,58';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      for (let i = 0; i < P.length; i++) {
        const pt = P[i];
        if (pt.life == null) seed(pt);
        const a = field(pt.x, pt.y, tt) * Math.PI;
        let vx = Math.cos(a) * pt.sp * dt * 1.15;
        let vy = (Math.sin(a) * 0.62 - 0.22) * pt.sp * dt * 1.15 + wind * 0.5 * dt;
        if (mx >= 0) {
          const dx = pt.x - mx, dy = pt.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < 19600 && d2 > 1) {
            const f = (1 - d2 / 19600) * 2.3 / Math.sqrt(d2);
            vx += dx * f * dt; vy += dy * f * dt;
          }
        }
        pt.px = pt.x; pt.py = pt.y;
        pt.x += vx; pt.y += vy;
        pt.life -= dt;
        if (pt.life <= 0 || pt.x < -8 || pt.x > W + 8 || pt.y < -8 || pt.y > H + 8) { seed(pt); continue; }
        ctx.strokeStyle = pt.fpv
          ? 'rgba(' + grn + ',' + (dark ? 0.5 : 0.42) + ')'
          : 'rgba(' + ink + ',' + (dark ? 0.13 : 0.11) + ')';
        ctx.beginPath();
        ctx.moveTo(pt.px, pt.py);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }
    })(lastT);
  }

  /* Halo lumineux — suit le curseur, dérive seul au tactile */
  function initHeroLight() {
    const light = $('.hero-light'), hero = $('.hero');
    if (!light || !hero || reduce) return;
    let mx = -1, my = -1, x = innerWidth * 0.6, y = innerHeight * 0.4, oo = 0;
    if (!coarse) {
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      });
      hero.addEventListener('mouseleave', () => { mx = -1; });
    }
    onFrame(() => {
      const r = hero.getBoundingClientRect();
      if (r.bottom < 0) { if (oo > 0.01) { oo = 0; light.style.opacity = '0'; } return; }
      let tx, ty, o;
      if (mx >= 0) { tx = mx; ty = my; o = 0.95; }
      else {
        const t = performance.now();
        tx = r.width * (0.5 + 0.3 * Math.sin(t * 0.00021));
        ty = r.height * (0.42 + 0.26 * Math.cos(t * 0.00017));
        o = 0.6;
      }
      x = lerp(x, tx, 0.07); y = lerp(y, ty, 0.07);
      oo = lerp(oo, o, 0.04);
      light.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
      light.style.opacity = oo.toFixed(3);
    });
  }

  /* Titre vivant — la graisse des lettres répond à la proximité
     du curseur (axe variable de la Schibsted Grotesk) */
  function initHeroLetters() {
    if (reduce || coarse) return;
    const hero = $('.hero'), title = $('.hero-title');
    if (!hero || !title) return;
    $$('.ln', title).forEach(ln => {
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(ch => {
          if (ch.nodeType === 3) {
            const frag = document.createDocumentFragment();
            ch.textContent.split('').forEach(c => {
              if (/\s/.test(c)) { frag.appendChild(document.createTextNode(c)); return; }
              const s = document.createElement('span');
              s.className = 'ch';
              s.textContent = c;
              frag.appendChild(s);
            });
            node.replaceChild(frag, ch);
          } else if (ch.nodeType === 1) walk(ch);
        });
      })(ln);
    });
    const chs = [];
    $$('.ch', title).forEach(el => {
      if (!el.closest('em')) chs.push({ el, w: 800, applied: 800 }); // les em serif ne sont pas variables
    });
    if (!chs.length) return;
    let mx = -1, my = 0;
    hero.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    hero.addEventListener('mouseleave', () => { mx = -1; });
    const R2 = 140 * 140;
    onFrame(() => {
      if (mx < 0) {
        let busy = false;
        for (let i = 0; i < chs.length; i++) if (Math.abs(chs[i].w - 800) > 0.4) { busy = true; break; }
        if (!busy) return;
      }
      const targets = [];
      for (let i = 0; i < chs.length; i++) { // lectures d'abord, écritures ensuite
        let t = 800;
        if (mx >= 0) {
          const r = chs[i].el.getBoundingClientRect();
          const dx = r.left + r.width / 2 - mx;
          const dy = r.top + r.height / 2 - my;
          t = 800 + 100 * Math.exp(-(dx * dx + dy * dy) / R2);
        }
        targets.push(t);
      }
      for (let i = 0; i < chs.length; i++) {
        const c = chs[i];
        c.w = lerp(c.w, targets[i], 0.18);
        if (Math.abs(c.w - c.applied) < 0.3) continue;
        c.applied = c.w;
        c.el.style.fontVariationSettings = '"wght" ' + c.w.toFixed(1);
      }
    });
  }

  /* Navigation — pastilles au scroll + bascule de couleur
     au-dessus des zones sombres ([data-navdark]) */
  function initNavZones() {
    const nav = $('.nav');
    if (!nav) return;
    const zones = $$('[data-navdark]');
    let sc = null, dk = null;
    onFrame(() => {
      const s = (window.scrollY || 0) > 24;
      if (s !== sc) { sc = s; nav.classList.toggle('scrolled', s); }
      let dark = false;
      for (let i = 0; i < zones.length; i++) {
        const r = zones[i].getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) { dark = true; break; }
      }
      if (dark !== dk) { dk = dark; nav.classList.toggle('on-dark', dark); }
    });
  }

  /* ---------- Verbes du hero ---------- */
  function initVerbCycle() {
    const wrap = $('.verb-cycle');
    if (!wrap) return;
    const items = $$('b', wrap);
    if (!items.length) return;
    let i = 0;
    items[0].classList.add('active');
    if (reduce || items.length < 2) return;
    setInterval(() => {
      const cur = items[i];
      cur.classList.remove('active'); cur.classList.add('exit');
      setTimeout(() => cur.classList.remove('exit'), 650);
      i = (i + 1) % items.length;
      items[i].classList.add('active');
    }, 1900);
  }

  /* ---------- Marquees infinis, dopés à la vélocité ---------- */
  function initMarquees() {
    $$('.marquee').forEach(m => {
      const track = $('.track', m);
      if (!track) return;
      const base = track.innerHTML;
      track.innerHTML = base + base + base + base;
      const dir = m.dataset.dir === 'right' ? 1 : -1;
      const speed = parseFloat(m.dataset.speed) || 0.5;
      let x = 0, segW = 0;
      const measure = () => { segW = track.scrollWidth / 4; };
      measure();
      addEventListener('resize', measure);
      if (reduce) return;
      (function loop() {
        const boost = clamp(Math.abs(velS) * 0.05, 0, 2.6);
        x += dir * (speed + boost);
        if (dir < 0 && x <= -segW) x += segW;
        if (dir > 0 && x >= 0) x -= segW;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        requestAnimationFrame(loop);
      })();
    });
  }

  /* ============================================================
     MANIFESTE — la phrase s'allume mot à mot + compteurs
     ============================================================ */
  function splitWords(rootEl) {
    const walk = node => {
      Array.prototype.slice.call(node.childNodes).forEach(ch => {
        if (ch.nodeType === 3) {
          const parts = ch.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
            else {
              const s = document.createElement('span');
              s.className = 'w';
              s.textContent = p;
              frag.appendChild(s);
            }
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    walk(rootEl);
  }

  function initManifesto() {
    const big = $('.manifesto .big');
    if (!big) return;
    if (hasGsap && !reduce) {
      splitWords(big);
      const words = $$('.w', big);
      gsap.set(words, { opacity: 0.12 });
      gsap.to(words, {
        opacity: 1, ease: 'none', stagger: 0.05,
        scrollTrigger: { trigger: big, start: 'top 80%', end: 'bottom 46%', scrub: 0.4 }
      });
    }
    if (hasGsap && !reduce) {
      $$('.manifesto-foot [data-count]').forEach(el => {
        const raw = el.getAttribute('data-count');
        if (raw === 'inf') {
          gsap.from(el, {
            scale: 0.2, opacity: 0, duration: 1.1, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true }
          });
          return;
        }
        const target = parseInt(raw, 10) || 0;
        const o = { v: 0 };
        el.textContent = '0';
        gsap.to(o, {
          v: target, duration: 1.8, ease: 'expo.out',
          onUpdate: () => { el.textContent = Math.round(o.v); },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true }
        });
      });
    }
  }

  /* ============================================================
     VOL FPV PROCÉDURAL — rendu canvas piloté par le scroll.
     Sert de séquence immersive tant qu'aucune vidéo n'est déposée.
     ============================================================ */
  function createFlight(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const stars = [];
    for (let i = 0; i < 70; i++) {
      stars.push({ x: Math.random(), y: Math.random() * 0.42, r: Math.random() * 1.3 + 0.3, a: Math.random() * 0.5 + 0.2 });
    }
    const seeds = [];
    for (let i = 0; i < 16; i++) seeds.push(Math.random());

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = w; H = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function ridge(col, amp, speed, freq, hor, t) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(-W * 0.06, hor + 2);
      const off = t * speed;
      for (let xi = 0; xi <= 72; xi++) {
        const u = xi / 72;
        const x = -W * 0.06 + u * W * 1.12;
        const env = smooth(Math.abs(u - 0.5), 0.13, 0.5); // vallée plate au centre
        const n = Math.sin(u * 6.3 * freq + off * 2.1) * 0.5 +
                  Math.sin(u * 13.7 * freq - off * 3.3) * 0.3 +
                  Math.sin(u * 29 * freq + off * 1.2) * 0.2;
        ctx.lineTo(x, hor + 2 - env * amp * (0.55 + 0.45 * n));
      }
      ctx.lineTo(W * 1.06, hor + 2);
      ctx.closePath();
      ctx.fill();
    }

    function draw(p, v, tx) {
      if (!W || !H) { resize(); if (!W) return; }
      const hor = H * 0.60;
      const t = p * 7 + (tx || 0); // distance parcourue (+ ralenti d'attente)
      const roll = Math.sin(p * Math.PI * 2.4) * 0.028 + clamp(v * 0.00045, -0.03, 0.03);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2, hor); ctx.rotate(roll); ctx.scale(1.06, 1.06); ctx.translate(-W / 2, -hor);

      // ciel crépusculaire
      const sky = ctx.createLinearGradient(0, 0, 0, hor * 1.05);
      sky.addColorStop(0, '#120f20');
      sky.addColorStop(0.42, '#251638');
      sky.addColorStop(0.66, '#5e2c44');
      sky.addColorStop(0.84, '#b54e2e');
      sky.addColorStop(1, '#ef9950');
      ctx.fillStyle = sky;
      ctx.fillRect(-W * 0.06, -H * 0.06, W * 1.12, hor * 1.05 + H * 0.06);

      // étoiles qui s'effacent à mesure qu'on plonge vers le soleil
      const starA = (1 - p) * 0.7;
      if (starA > 0.02) {
        ctx.fillStyle = '#e8e6f2';
        for (let i = 0; i < stars.length; i++) {
          const st = stars[i];
          ctx.globalAlpha = st.a * starA;
          ctx.fillRect(st.x * W, st.y * H, st.r, st.r);
        }
        ctx.globalAlpha = 1;
      }

      // soleil — il grossit : on vole littéralement dedans
      const sr = Math.min(W, H) * (0.13 + p * 0.36);
      const sx = W * 0.5, sy = hor - sr * 0.16;
      const glow = ctx.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 2.6);
      glow.addColorStop(0, 'rgba(255,170,90,0.55)');
      glow.addColorStop(0.5, 'rgba(255,130,60,0.18)');
      glow.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - sr * 2.7, sy - sr * 2.7, sr * 5.4, sr * 5.4);
      ctx.save();
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.clip();
      const sg = ctx.createLinearGradient(0, sy - sr, 0, sy + sr);
      sg.addColorStop(0, '#ffe9c4'); sg.addColorStop(0.55, '#ffc173'); sg.addColorStop(1, '#ff7e3c');
      ctx.fillStyle = sg;
      ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      ctx.fillStyle = 'rgba(37,22,56,0.85)';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(sx - sr, sy + sr * (0.06 + i * 0.16), sr * 2, sr * (0.022 + i * 0.015));
      }
      ctx.restore();

      // brume chaude à l'horizon
      const haze = ctx.createLinearGradient(0, hor - H * 0.05, 0, hor + H * 0.06);
      haze.addColorStop(0, 'rgba(255,150,80,0)');
      haze.addColorStop(0.5, 'rgba(255,150,80,0.30)');
      haze.addColorStop(1, 'rgba(255,150,80,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(-W * 0.06, hor - H * 0.05, W * 1.12, H * 0.11);

      // sol
      const gnd = ctx.createLinearGradient(0, hor, 0, H * 1.06);
      gnd.addColorStop(0, '#2a1622'); gnd.addColorStop(0.3, '#190f18'); gnd.addColorStop(1, '#0b070d');
      ctx.fillStyle = gnd;
      ctx.fillRect(-W * 0.06, hor, W * 1.12, H * 1.06 - hor);

      // lignes filantes vers le point de fuite
      ctx.lineWidth = 1;
      for (let k = -9; k <= 9; k++) {
        if (!k) continue;
        const a = 0.04 + 0.07 * (1 - Math.abs(k) / 9);
        ctx.strokeStyle = 'rgba(243,156,92,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(sx, hor);
        ctx.lineTo(W / 2 + k * W * 0.135, H + 30);
        ctx.stroke();
      }
      // lignes transversales — le scroll fait avancer le terrain
      const ROWS = 12;
      for (let i = 0; i < ROWS; i++) {
        let f = (i / ROWS + t) % 1; if (f < 0) f += 1;
        const y = hor + (H - hor) * Math.pow(f, 2.5);
        const a = 0.04 + 0.34 * Math.pow(f, 1.6);
        ctx.strokeStyle = 'rgba(245,160,95,' + a.toFixed(3) + ')';
        ctx.lineWidth = 1 + f * 1.8;
        ctx.beginPath(); ctx.moveTo(-W * 0.06, y); ctx.lineTo(W * 1.06, y); ctx.stroke();
      }
      ctx.lineWidth = 1;

      // crêtes latérales — la vallée qu'on traverse (2 plans de parallaxe)
      ridge('#1c1330', H * 0.15, 0.35, 1.7, hor, t);
      ridge('#0e0a17', H * 0.24, 0.8, 1.0, hor, t);

      // traînées de vitesse (réagissent à la vélocité du scroll)
      const k2 = clamp(Math.abs(v) / 46, 0, 1);
      if (k2 > 0.03) {
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.30 * k2).toFixed(3) + ')';
        const cx = W / 2, cy = H / 2;
        for (let i = 0; i < seeds.length; i++) {
          const ang = seeds[i] * Math.PI * 2;
          const r0 = Math.min(W, H) * (0.28 + seeds[(i + 5) % 16] * 0.3);
          const len = Math.min(W, H) * (0.10 + 0.35 * k2) * (0.5 + seeds[(i + 9) % 16]);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
          ctx.lineTo(cx + Math.cos(ang) * (r0 + len), cy + Math.sin(ang) * (r0 + len));
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    return { draw, resize };
  }

  /* ============================================================
     VIDÉO IMMERSIVE — la scène est épinglée (sticky), le scroll
     ouvre le cadre, scrubbe la séquence image par image, puis
     vous fait ressortir vers la suite du site.
     ============================================================ */
  function initImmersive() {
    const sec = $('.immersive');
    if (!sec) return;
    const track = $('.imv-track', sec);
    const frame = $('.imv-frame', sec);
    const video = $('.imv-video', sec);
    const canvas = $('.imv-canvas', sec);
    const stat = $('.imv-static', sec);
    const barT = $('.imv-bar.top', sec);
    const barB = $('.imv-bar.bot', sec);
    const brackets = $('.imv-brackets', sec);
    const countD = $('[data-count-digit]', sec);
    const countS = $('[data-count-sub]', sec);
    const flash = $('.imv-flash', sec);
    const reticle = $('.imv-reticle', sec);
    const hud = $$('.imv-hud .lbl', sec);
    const caption = $('.imv-caption', sec);
    const hint = $('.imv-hint', sec);
    const note = $('.imv-note', sec);
    const rail = $('.imv-rail', sec);
    const railFill = $('.imv-rail span', sec);
    const tc = $('[data-tc]', sec);
    const frameLbl = $('[data-frame]', sec);
    const altLbl = $('[data-alt]', sec);
    const spdLbl = $('[data-spd]', sec);
    const FPS = 30, VIRT_DUR = 16;
    let dur = 0, ready = false, curT = 0;

    // vidéo réelle si le fichier existe (sinon : vol FPV procédural)
    if (video) {
      fetch('media/immersive.mp4', { method: 'HEAD' })
        .then(r => { if (r.ok) video.src = 'media/immersive.mp4'; })
        .catch(() => { });
      video.addEventListener('loadedmetadata', () => {
        dur = video.duration || 0;
        if (dur && isFinite(dur)) {
          ready = true;
          sec.classList.add('has-video');
          try { video.pause(); video.currentTime = 0; } catch (e) { }
        }
      });
      video.addEventListener('canplay', () => {
        const pr = video.play();
        if (pr && pr.then) pr.then(() => video.pause()).catch(() => { });
      });
      video.addEventListener('error', () => { ready = false; sec.classList.remove('has-video'); });
    }

    const flight = canvas ? createFlight(canvas) : null;
    addEventListener('resize', () => { if (flight) flight.resize(); });

    if (reduce || !track || !frame) return; // le CSS statique prend le relais

    const p2s = n => String(n).padStart(2, '0');
    const p3s = n => String(Math.max(0, Math.round(n))).padStart(3, '0');
    const fmt = t => p2s(Math.floor(t / 60)) + ':' + p2s(Math.floor(t % 60)) + ':' + p2s(Math.floor((t % 1) * FPS));

    let sp = 0, lastDrawn = -1, jitOn = false, idleT = 0;

    onFrame(() => {
      const r = track.getBoundingClientRect();
      const vh = innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) {
        if (sp > 0.001 && r.top > 0) { sp = 0; apply(0); }
        return;
      }
      const total = Math.max(r.height - vh, 1);
      const p = clamp(-r.top / total, 0, 1);
      sp = lerp(sp, p, 0.16);
      if (Math.abs(sp - p) < 0.0004) sp = p;
      // moteur au ralenti tant qu'on n'a pas percé l'écran
      if (!ready && sp < 0.42) idleT += 0.0006 * (1 + Math.min(Math.abs(velS) * 0.012, 1.6));
      apply(sp);
    });

    /* Dramaturgie au scroll :
       0.00–0.05  l'indication s'efface
       0.05–0.285 APPROCHE   — l'écran incliné (3D) se redresse et grandit
       0.07–0.30  VERROUILLAGE — crochets de visée, réticule, compte à rebours 3·2·1
       0.30–0.355 PERCÉE     — le cadre éclate en plein écran : flash, signal
                               brouillé, barres cinéma qui claquent, surrégime
       0.355–0.82 CROISIÈRE  — la séquence se joue image par image, HUD actif
       0.86–1.00  SORTIE     — éclair bref, le cadre se referme et s'élève    */
    function apply(p) {
      const eA = easeOutCubic(smooth(p, 0.05, 0.285)); // approche
      const eB = easeOutCubic(smooth(p, 0.30, 0.355)); // percée
      const open = eA * 0.72 + eB * 0.28;
      const x = easeOutCubic(smooth(p, 0.86, 1));      // sortie
      const s = smooth(p, 0.355, 0.82);                // position dans la séquence
      const punch = bell(p, 0.36, 0.02);               // surrégime à la percée

      // — cadre : écran incliné → plein cadre (avec léger overshoot) → sortie —
      const insX = (1 - open) * 24 + x * 18;
      const insY = (1 - open) * 16 + x * 12;
      const rad = (1 - open) * 26 + x * 22;
      const scale = (0.56 + 0.44 * open) * (1 - x * 0.30) * (1 + 0.04 * punch);
      const rotX = (1 - eA) * 9 - x * 5;
      const ty = (1 - eA) * innerHeight * 0.035 - x * innerHeight * 0.06;
      frame.style.clipPath = 'inset(' + insY.toFixed(2) + '% ' + insX.toFixed(2) + '% round ' + rad.toFixed(1) + 'px)';
      frame.style.transform = 'translateY(' + ty.toFixed(1) + 'px) rotateX(' + rotX.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
      frame.style.filter = 'brightness(' + (0.78 + 0.22 * open - x * 0.25).toFixed(3) + ')';

      // — dolly interne du média (plongée + coup de zoom à la percée) —
      const ms = 1.16 - 0.16 * open + s * 0.05 + 0.1 * punch;
      const media = ready ? video : canvas;
      if (media) media.style.transform = 'scale(' + ms.toFixed(4) + ')';

      // — crochets de visée : ils traquent le cadre, se resserrent,
      //   puis sont soufflés par la percée —
      if (brackets) {
        const bo = smooth(p, 0.07, 0.13) * (1 - smooth(p, 0.315, 0.355));
        const padc = 2.4 - 1.7 * smooth(p, 0.1, 0.27);
        const blast = 7 * smooth(p, 0.315, 0.36);
        const bx = 50 - (50 - insX) * scale - padc - blast;
        const by = 50 - (50 - insY) * scale - padc * 0.8 - blast;
        brackets.style.inset = by.toFixed(2) + '% ' + bx.toFixed(2) + '%';
        brackets.style.transform = 'translateY(' + ty.toFixed(1) + 'px)';
        brackets.style.opacity = bo.toFixed(3);
      }

      // — compte à rebours d'amorçage : 3 · 2 · 1 —
      if (countD) {
        const c0 = 0.185, c1 = 0.30;
        if (p > c0 - 0.01 && p < c1 + 0.01) {
          const u = clamp((p - c0) / (c1 - c0), 0, 0.999);
          const n = 3 - Math.floor(u * 3);
          const f = (u * 3) % 1;
          const a = Math.sin(Math.min(f / 0.22, 1) * Math.PI * 0.5) * (1 - smooth(f, 0.74, 1));
          if (countD.textContent !== String(n)) countD.textContent = String(n);
          countD.style.opacity = a.toFixed(3);
          countD.style.transform = 'scale(' + (1.18 - 0.18 * f).toFixed(3) + ')';
          if (countS) countS.style.opacity = (smooth(p, c0, c0 + 0.02) * (1 - smooth(p, c1 - 0.012, c1))).toFixed(3);
        } else {
          countD.style.opacity = '0';
          if (countS) countS.style.opacity = '0';
        }
      }

      // — flash de percée (et bref écho à la sortie) —
      if (flash) flash.style.opacity = (0.9 * bell(p, 0.338, 0.014) + 0.35 * bell(p, 0.875, 0.014)).toFixed(3);

      // — barres cinéma : elles claquent à la percée —
      const barP = smooth(p, 0.315, 0.36) * (1 - smooth(p, 0.84, 0.92));
      if (barT) barT.style.transform = 'scaleY(' + barP.toFixed(3) + ')';
      if (barB) barB.style.transform = 'scaleY(' + barP.toFixed(3) + ')';

      // — bruit de signal : burst à la percée, écho à la sortie —
      const stP = 1.1 * bell(p, 0.333, 0.024) + 0.55 * bell(p, 0.86, 0.02);
      if (stat) {
        stat.style.opacity = Math.min(stP, 0.95).toFixed(3);
        const on = stP > 0.04;
        if (on !== jitOn) { jitOn = on; stat.classList.toggle('jit', on); }
      }

      // — HUD : démarrage coin par coin, juste après la percée —
      const hudOut = 1 - smooth(p, 0.85, 0.9);
      for (let i = 0; i < hud.length; i++) {
        const hp = smooth(p, 0.35 + i * 0.018, 0.405 + i * 0.018) * hudOut;
        hud[i].style.opacity = (hp * 0.9).toFixed(3);
        hud[i].style.transform = 'translateY(' + ((1 - hp) * 14).toFixed(1) + 'px)';
      }

      // — réticule : il verrouille la cible dès l'approche —
      const rp = smooth(p, 0.16, 0.22) * (1 - smooth(p, 0.8, 0.86));
      if (reticle) {
        const pulse = 1 + Math.min(Math.abs(velS) * 0.0016, 0.12) + 0.1 * bell(p, 0.285, 0.03);
        reticle.style.opacity = (rp * 0.95).toFixed(3);
        reticle.style.transform = 'scale(' + (pulse * (0.86 + 0.14 * rp)).toFixed(3) + ')';
      }

      // — légende par-dessus la vidéo —
      const cp = smooth(p, 0.42, 0.48) * (1 - smooth(p, 0.78, 0.84));
      if (caption) {
        caption.style.opacity = cp.toFixed(3);
        caption.style.transform = 'translateY(' + ((1 - cp) * 18).toFixed(1) + 'px)';
      }

      // — indication, note, rail —
      const hintP = 1 - smooth(p, 0.015, 0.06);
      if (hint) {
        hint.style.opacity = hintP.toFixed(3);
        hint.style.transform = 'translateX(-50%) translateY(' + ((1 - hintP) * 18).toFixed(0) + 'px)';
      }
      // la note de dépôt média s'affiche pendant la croisière, sous le REC
      if (note) note.style.opacity = (smooth(p, 0.40, 0.46) * (1 - smooth(p, 0.74, 0.80)) * 0.95).toFixed(3);
      if (rail) rail.style.opacity = (smooth(p, 0.34, 0.4) * (1 - smooth(p, 0.86, 0.92))).toFixed(3);
      if (railFill) railFill.style.width = (s * 100).toFixed(2) + '%';

      // — scrub : vidéo réelle ou vol procédural —
      if (ready) {
        const targetT = s * Math.max(dur - 0.05, 0);
        curT = lerp(curT, targetT, 0.22);
        if (!video.seeking && Math.abs(curT - video.currentTime) > 0.012) {
          try { video.currentTime = curT; } catch (e2) { }
        }
        if (tc) tc.textContent = fmt(targetT);
        if (frameLbl) {
          const tot = Math.round(dur * FPS);
          frameLbl.textContent = 'FRAME ' + p3s(s * tot) + ' / ' + p3s(tot);
        }
      } else if (flight) {
        if (Math.abs(s - lastDrawn) > 0.0006 || p < 0.42 || Math.abs(velS) > 1.5) {
          flight.draw(s, velS + 150 * bell(p, 0.35, 0.022), idleT);
          lastDrawn = s;
        }
        if (tc) tc.textContent = fmt(s * VIRT_DUR);
        if (frameLbl) frameLbl.textContent = 'FRAME ' + p3s(s * VIRT_DUR * FPS) + ' / ' + p3s(VIRT_DUR * FPS);
      }
      if (altLbl) altLbl.textContent = 'ALT ' + p3s(58 + s * 88 + Math.sin(s * 9) * 9) + 'M';
      if (spdLbl) spdLbl.textContent = 'SPD ' + p3s(clamp(86 + Math.abs(velS) * 1.3 + Math.sin(s * 13) * 5 + punch * 52, 62, 199)) + 'KM/H';
    }

    apply(0);
    if (flight) { flight.resize(); flight.draw(0, 0, 0); }
  }

  /* ============================================================
     PORTRAIT — taquin coulissant (un carré vide, le fond apparaît)
     ============================================================ */
  function initPortraitPuzzle() {
    const stage = $('.portrait-stage');
    const host = $('.portrait-puzzle');
    if (!host) return;
    const cols = 4, rows = 5, gap = 5;
    const cells = cols * rows;
    const emptyStart = cells - 1; // carré retiré : bas-droite
    let W = 0, H = 0, cw = 0, ch = 0;

    const grid = new Array(cells).fill(null);
    const tiles = [];
    for (let idx = 0; idx < cells; idx++) {
      if (idx === emptyStart) continue;
      const t = document.createElement('span');
      t.className = 'pz-tile';
      const tile = { el: t, oc: idx % cols, or: Math.floor(idx / cols), cell: idx };
      tiles.push(tile);
      grid[idx] = tile;
      host.appendChild(t);
    }
    let emptyCell = emptyStart;

    function place(t, animate) {
      const c = t.cell % cols, r = Math.floor(t.cell / cols);
      t.el.style.width = (cw - gap) + 'px';
      t.el.style.height = (ch - gap) + 'px';
      t.el.style.backgroundSize = W + 'px ' + H + 'px';
      t.el.style.backgroundPosition = '-' + (t.oc * cw + gap / 2).toFixed(1) + 'px -' + (t.or * ch + gap / 2).toFixed(1) + 'px';
      const tx = (c * cw + gap / 2).toFixed(1) + 'px';
      const ty = (r * ch + gap / 2).toFixed(1) + 'px';
      if (!animate) {
        const prev = t.el.style.transition;
        t.el.style.transition = 'none';
        t.el.style.transform = 'translate(' + tx + ',' + ty + ')';
        void t.el.offsetHeight;
        t.el.style.transition = prev;
      } else {
        t.el.style.transform = 'translate(' + tx + ',' + ty + ')';
      }
    }
    function layout() {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height; cw = W / cols; ch = H / rows;
      tiles.forEach(t => place(t, false));
    }
    layout();
    addEventListener('resize', layout);

    function slide() {
      const ec = emptyCell % cols, er = Math.floor(emptyCell / cols);
      const cands = [];
      if (er > 0) cands.push(emptyCell - cols);
      if (er < rows - 1) cands.push(emptyCell + cols);
      if (ec > 0) cands.push(emptyCell - 1);
      if (ec < cols - 1) cands.push(emptyCell + 1);
      const from = cands[Math.floor(Math.random() * cands.length)];
      const t = grid[from];
      if (!t) return;
      grid[emptyCell] = t; grid[from] = null;
      t.cell = emptyCell; emptyCell = from;
      place(t, true);
    }

    if (!reduce) {
      let acc = 0, last = performance.now();
      const period = 1700;
      (function loop(now) {
        acc += now - last; last = now;
        if (acc >= period) { acc = 0; slide(); }
        requestAnimationFrame(loop);
      })(last);
    }

    if (stage) {
      const m = /url\(['"]?(.+?)['"]?\)/.exec(stage.style.getPropertyValue('--portrait') || '');
      if (m && m[1]) {
        const img = new Image();
        img.onload = () => stage.classList.add('has-photo');
        img.src = m[1];
      }
    }
  }

  /* ============================================================
     PROJETS — apparition / disparition + parallaxe interne
     ============================================================ */
  function initProjects() {
    const cards = $$('.proj-card');
    if (!cards.length) return;
    cards.forEach(c => {
      const m = /url\(['"]?(.+?)['"]?\)/.exec(c.style.getPropertyValue('--img') || '');
      if (m && m[1]) {
        const img = new Image();
        img.onload = () => c.classList.add('has-photo');
        img.src = m[1];
      }
    });
    if (reduce) return;
    onFrame(() => {
      const h = innerHeight;
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (c.classList.contains('is-hidden')) continue;
        const r = c.getBoundingClientRect();
        if (r.bottom < -140 || r.top > h + 140) continue;
        const appear = clamp((h * 0.94 - r.top) / (h * 0.30), 0, 1);
        const leave = clamp((h * 0.16 - r.bottom) / (h * 0.18), 0, 1);
        c.style.setProperty('--rv', clamp(appear - leave, 0, 1).toFixed(3));
        const off = r.top + r.height / 2 - h / 2;
        c.style.setProperty('--py', clamp(-off * 0.045, -26, 26).toFixed(1) + 'px');
      }
    });
  }

  /* ---------- Dépliables (compétences) ---------- */
  function initExpanders() {
    $$('[data-expand]').forEach(head => {
      head.addEventListener('click', () => {
        const item = head.closest('.skill');
        if (!item) return;
        const open = item.classList.toggle('open');
        head.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- Ancres internes (hors menu) ---------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2 || a.closest('.fsmenu')) return;
      a.addEventListener('click', e => {
        let t = null;
        try { t = $(href); } catch (err) { }
        if (t) { e.preventDefault(); scrollToEl(t); }
      });
    });
  }

  /* ---------- Footer — parallaxe du grand nom ---------- */
  function initFooter() {
    if (!hasGsap || reduce) return;
    const name = $('.foot .big-name');
    if (!name) return;
    gsap.fromTo(name, { yPercent: 26 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'top 45%', scrub: 0.5 }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    if (hasGsap) gsap.registerPlugin(ScrollTrigger);
    startLoop();
    initLenis();
    initCurtain();
    initCursor(); initMagnetic(); initMenu(); initClock(); initTheme();
    initNavZones();
    initReveals();
    initVerbCycle(); initMarquees();
    initManifesto();
    initImmersive();
    initPortraitPuzzle();
    initProjects();
    initExpanders(); initAnchors();
    initFooter();
    heroScrub(); initHeroFx(); initHeroMouse(); initHeroLight(); initHeroLetters();
    initPreloader(() => { heroIntro(); });
    if (hasGsap) {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
      addEventListener('load', () => ScrollTrigger.refresh());
    }
    document.body.classList.add('ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
