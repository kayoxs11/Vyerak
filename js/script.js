// ===========================================================
// VYERAK.DEV — interactions
// ===========================================================

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- requested visual direction ---------- */
const heroHeading = document.querySelector('.hero h1');
if (heroHeading) {
  heroHeading.innerHTML = 'Seu negócio merece mais do que um site.<br>Merece uma <span class="hero-slogan-accent">presença digital à altura.</span>';
}

/* ---------- header: transparent at entry, solid on scroll ---------- */
const header = document.querySelector('.site-header');
if (header) {
  const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

const visualStyle = document.createElement('style');
visualStyle.textContent = `
  .site-header {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    background: transparent !important;
    border-bottom-color: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    transition: background .3s ease, border-color .3s ease, backdrop-filter .3s ease, box-shadow .3s ease;
  }
  .site-header.is-scrolled {
    background: rgba(7,9,10,.86) !important;
    border-bottom-color: var(--line) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    box-shadow: 0 8px 30px rgba(0,0,0,.18);
  }
  .hero-slogan-accent { color: var(--teal-light); }

  /* One fixed PCB layer shared by every section. */
  .net-canvas { display: none !important; }
  .global-circuit-canvas {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
  }
  main, .site-footer { position: relative; z-index: 1; }
  .site-header { z-index: 100; }
`;
document.head.appendChild(visualStyle);

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- hero: code typed on the left, output synced on the right ---------- */
const codeLines = [
  { code: '>>> print("Seja bem-vindo")', output: 'Seja bem-vindo' },
  { code: '>>> print("à Vyerak.dev")', output: 'à Vyerak.dev' },
  { code: '>>> projetos = ["sites", "sistemas"]', output: null },
  { code: '>>> for p in projetos:', output: null },
  { code: '...     print(f"✓ {p} pronto")', output: null },
  { code: null, output: '✓ sites pronto' },
  { code: null, output: '✓ sistemas pronto' },
  { code: '>>> print("Vamos construir?")', output: 'Vamos construir?' },
];

(function typeCodeAndPreview() {
  const codeEl = document.getElementById('code-body');
  const previewEl = document.getElementById('preview-body');
  if (!codeEl) return;
  const codeOnly = codeLines.filter(l => l.code).map(l => l.code).join('\n');
  if (!previewEl) { codeEl.textContent = codeOnly; return; }
  if (prefersReducedMotion) {
    codeEl.textContent = codeOnly;
    previewEl.innerHTML = codeLines.filter(l => l.output).map(l => `<div class="output-line" style="opacity:1;transform:none">${l.output}</div>`).join('');
    return;
  }
  codeEl.innerHTML = '';
  previewEl.innerHTML = '';
  let i = 0;
  function next() {
    if (i >= codeLines.length) {
      setTimeout(() => { codeEl.innerHTML = ''; previewEl.innerHTML = ''; i = 0; next(); }, 2800);
      return;
    }
    const line = codeLines[i];
    if (line.code) {
      const div = document.createElement('div');
      codeEl.appendChild(div);
      let c = 0;
      (function typeChar() {
        c++;
        div.textContent = line.code.slice(0, c);
        if (c < line.code.length) setTimeout(typeChar, 18);
        else {
          if (line.output) {
            const out = document.createElement('div');
            out.className = 'output-line';
            out.textContent = line.output;
            previewEl.appendChild(out);
          }
          i++;
          setTimeout(next, 350);
        }
      })();
    } else if (line.output) {
      const out = document.createElement('div');
      out.className = 'output-line';
      out.textContent = line.output;
      previewEl.appendChild(out);
      i++;
      setTimeout(next, 350);
    } else { i++; next(); }
  }
  next();
})();

/* ---------- PCB / printed-circuit animated background ---------- */
(function globalCircuitBoard() {
  const canvas = document.createElement('canvas');
  canvas.className = 'global-circuit-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let traces = [];
  let pulses = [];

  function addTrace(points, speed = null) {
    const lengths = [];
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      lengths.push(len);
      total += len;
    }
    traces.push({ points, lengths, total });
    if (total > 0 && speed !== null) {
      pulses.push({ trace: traces[traces.length - 1], offset: Math.random(), speed });
    }
  }

  /*
   * Build actual PCB-style traces. Paths only turn at 90 degrees and stay
   * aligned to a grid, so they look like tracks etched into a circuit board.
   */
  function buildBoard() {
    const cell = width < 760 ? 34 : 48;
    const cols = Math.ceil(width / cell) + 3;
    const rows = Math.ceil(height / cell) + 3;
    traces = [];
    pulses = [];

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const snap = n => Math.round(n / cell) * cell;

    /* Long, sparse primary traces. */
    const primaryCount = Math.max(16, Math.min(28, Math.floor(width * height / 30000)));
    for (let i = 0; i < primaryCount; i++) {
      let x = snap((Math.random() * width) - cell);
      let y = snap((Math.random() * height) - cell);
      const points = [{ x, y }];
      const turns = 2 + Math.floor(Math.random() * 4);
      let horizontal = Math.random() < 0.5;

      for (let t = 0; t < turns; t++) {
        const distance = (1 + Math.floor(Math.random() * 4)) * cell;
        if (horizontal) x += Math.random() < 0.5 ? -distance : distance;
        else y += Math.random() < 0.5 ? -distance : distance;
        x = clamp(x, -cell, width + cell);
        y = clamp(y, -cell, height + cell);
        points.push({ x, y });
        horizontal = !horizontal;
      }

      addTrace(points, i % 3 === 0 ? 0.045 + Math.random() * 0.025 : null);
    }

    /* Short branches create the characteristic dense PCB detail. */
    const branchCount = Math.max(24, Math.min(48, Math.floor(width * height / 18000)));
    for (let i = 0; i < branchCount; i++) {
      const x = snap(Math.random() * width);
      const y = snap(Math.random() * height);
      const horizontal = Math.random() < 0.5;
      const first = (1 + Math.floor(Math.random() * 3)) * cell;
      const second = (1 + Math.floor(Math.random() * 2)) * cell;
      const direction = Math.random() < 0.5 ? -1 : 1;
      const points = [{ x, y }];

      if (horizontal) {
        points.push({ x: clamp(x + first * direction, -cell, width + cell), y });
        points.push({
          x: clamp(x + first * direction, -cell, width + cell),
          y: clamp(y + second * (Math.random() < 0.5 ? -1 : 1), -cell, height + cell)
        });
      } else {
        points.push({ x, y: clamp(y + first * direction, -cell, height + cell) });
        points.push({
          x: clamp(x + second * (Math.random() < 0.5 ? -1 : 1), -cell, width + cell),
          y: clamp(y + first * direction, -cell, height + cell)
        });
      }

      addTrace(points, i % 7 === 0 ? 0.04 + Math.random() * 0.022 : null);
    }

    /* A few tiny terminal traces, like pads around components. */
    const terminalCount = Math.max(18, Math.min(36, Math.floor(width * height / 25000)));
    for (let i = 0; i < terminalCount; i++) {
      const x = snap(Math.random() * width);
      const y = snap(Math.random() * height);
      const horizontal = Math.random() < 0.5;
      const distance = cell * (1 + Math.floor(Math.random() * 2));
      addTrace(horizontal
        ? [{ x, y }, { x: x + (Math.random() < 0.5 ? -distance : distance), y }]
        : [{ x, y }, { x, y: y + (Math.random() < 0.5 ? -distance : distance) }], null);
    }
  }

  function pointAt(trace, progress) {
    const target = progress * trace.total;
    let passed = 0;
    for (let i = 0; i < trace.lengths.length; i++) {
      const len = trace.lengths[i];
      if (target <= passed + len || i === trace.lengths.length - 1) {
        const local = len ? (target - passed) / len : 0;
        const a = trace.points[i];
        const b = trace.points[i + 1];
        return {
          x: a.x + (b.x - a.x) * local,
          y: a.y + (b.y - a.y) * local
        };
      }
      passed += len;
    }
    return trace.points[trace.points.length - 1];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBoard();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    /* Nearly-black background with only a very subtle teal atmosphere. */
    const atmosphere = ctx.createRadialGradient(
      width * 0.56, height * 0.45, 0,
      width * 0.56, height * 0.45, Math.max(width, height) * 0.72
    );
    atmosphere.addColorStop(0, 'rgba(4, 31, 36, 0.10)');
    atmosphere.addColorStop(0.65, 'rgba(2, 16, 19, 0.035)');
    atmosphere.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = atmosphere;
    ctx.fillRect(0, 0, width, height);

    /* Thin teal PCB tracks. */
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    ctx.strokeStyle = 'rgba(34, 157, 171, 0.27)';

    for (const trace of traces) {
      ctx.beginPath();
      trace.points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      /* PCB pads / junctions at every corner and endpoint. */
      for (const point of trace.points) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(47, 184, 214, 0.54)';
        ctx.arc(point.x, point.y, 1.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* Small fixed bright pads — like LEDs/components on the board. */
    const phase = time * 0.001;
    for (let i = 0; i < traces.length; i += 9) {
      const trace = traces[i];
      const point = trace.points[trace.points.length - 1];
      const pulse = 0.42 + Math.sin(phase * 1.4 + i) * 0.16;
      ctx.beginPath();
      ctx.fillStyle = `rgba(61, 205, 226, ${pulse})`;
      ctx.shadowColor = 'rgba(47, 184, 214, 0.55)';
      ctx.shadowBlur = 5;
      ctx.arc(point.x, point.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* Traveling pulses: a few cyan lights run along the actual tracks. */
    if (!prefersReducedMotion) {
      for (const pulse of pulses) {
        const progress = (pulse.offset + time * 0.001 * pulse.speed) % 1;
        const point = pointAt(pulse.trace, progress);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(72, 218, 239, 0.98)';
        ctx.shadowColor = 'rgba(47, 184, 214, 0.95)';
        ctx.shadowBlur = 10;
        ctx.arc(point.x, point.y, 2.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (prefersReducedMotion) draw(0);
  else requestAnimationFrame(draw);
})();

/* ---------- contact form → opens WhatsApp with the message pre-filled ---------- */
const WHATSAPP_NUMBER = '558196678368';
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = (data.get('nome') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const telefone = (data.get('telefone') || '').toString().trim();
    const mensagem = (data.get('mensagem') || '').toString().trim();
    const linhas = [
      `Olá! Meu nome é ${nome || '(não informado)'}.`,
      email ? `E-mail: ${email}` : null,
      telefone ? `Telefone: ${telefone}` : null,
      '',
      mensagem,
    ].filter((l) => l !== null);
    const texto = encodeURIComponent(linhas.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, '_blank', 'noopener');
  });
}

/* ---------- scroll reveal animations ---------- */
(function scrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right');
  if (!reveals.length) return;
  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => observer.observe(el));
})();