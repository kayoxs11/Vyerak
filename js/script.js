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

  /* The reference animation is a single fixed layer shared by the whole page. */
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

/* ---------- reference-style animated circuit board ---------- */
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

  /*
   * The reference uses a PCB / circuit-board pattern: long thin 90-degree
   * traces, many small junction dots, and only a few moving cyan lights.
   * The geometry is generated once and remains stable while scrolling.
   */
  function buildTraces() {
    const cell = width < 760 ? 34 : 46;
    const cols = Math.ceil(width / cell) + 2;
    const rows = Math.ceil(height / cell) + 2;
    const count = Math.max(18, Math.min(42, Math.floor((width * height) / 19000)));
    traces = [];

    for (let i = 0; i < count; i++) {
      let gx = Math.floor(Math.random() * cols) - 1;
      let gy = Math.floor(Math.random() * rows) - 1;
      let x = gx * cell;
      let y = gy * cell;
      const points = [{ x, y }];
      const steps = 3 + Math.floor(Math.random() * 6);
      let horizontal = Math.random() < 0.5;

      for (let s = 0; s < steps; s++) {
        const length = (1 + Math.floor(Math.random() * 3)) * cell;
        if (horizontal) x += Math.random() < 0.5 ? -length : length;
        else y += Math.random() < 0.5 ? -length : length;
        points.push({ x, y });
        horizontal = !horizontal;
      }

      traces.push({ points });
    }

    /* Add a second set of shorter traces to reproduce the dense detail. */
    const shortCount = Math.max(12, Math.min(28, Math.floor((width * height) / 30000)));
    for (let i = 0; i < shortCount; i++) {
      const x = (Math.floor(Math.random() * cols) - 1) * cell;
      const y = (Math.floor(Math.random() * rows) - 1) * cell;
      const horizontal = Math.random() < 0.5;
      const length1 = (1 + Math.floor(Math.random() * 3)) * cell;
      const length2 = (1 + Math.floor(Math.random() * 2)) * cell;
      const points = [{ x, y }];
      if (horizontal) {
        points.push({ x: x + length1, y });
        points.push({ x: x + length1, y: y + (Math.random() < 0.5 ? length2 : -length2) });
      } else {
        points.push({ x, y: y + length1 });
        points.push({ x: x + (Math.random() < 0.5 ? length2 : -length2), y: y + length1 });
      }
      traces.push({ points });
    }

    pulses = [];
    traces.forEach((trace, traceIndex) => {
      if (traceIndex % 3 !== 0) return;
      let total = 0;
      const lengths = [];
      for (let i = 0; i < trace.points.length - 1; i++) {
        const a = trace.points[i];
        const b = trace.points[i + 1];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        lengths.push(len);
        total += len;
      }
      pulses.push({ trace, lengths, total, offset: Math.random(), speed: 0.018 + Math.random() * 0.018 });
    });
  }

  function pointAt(traceData, t) {
    const target = t * traceData.total;
    let passed = 0;
    for (let i = 0; i < traceData.lengths.length; i++) {
      const len = traceData.lengths[i];
      if (target <= passed + len || i === traceData.lengths.length - 1) {
        const local = len ? (target - passed) / len : 0;
        const a = traceData.trace.points[i];
        const b = traceData.trace.points[i + 1];
        return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
      }
      passed += len;
    }
    return traceData.trace.points[traceData.trace.points.length - 1];
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
    buildTraces();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    /* Deep, almost-black teal atmosphere from the reference. */
    const atmosphere = ctx.createRadialGradient(width * 0.72, height * 0.12, 0, width * 0.72, height * 0.12, width * 0.68);
    atmosphere.addColorStop(0, 'rgba(12, 69, 77, 0.18)');
    atmosphere.addColorStop(0.55, 'rgba(7, 38, 44, 0.06)');
    atmosphere.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = atmosphere;
    ctx.fillRect(0, 0, width, height);

    /* Hairline traces — visible but deliberately subdued. */
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(29, 135, 149, 0.23)';
    ctx.fillStyle = 'rgba(47, 184, 214, 0.62)';

    for (const trace of traces) {
      ctx.beginPath();
      trace.points.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      for (const p of trace.points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.65, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* A small number of traveling cyan lights, matching the reference. */
    if (!prefersReducedMotion) {
      for (const pulse of pulses) {
        const t = (time * 0.001 * pulse.speed + pulse.offset) % 1;
        const pos = pointAt(pulse, t);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(47, 184, 214, 0.95)';
        ctx.shadowColor = 'rgba(47, 184, 214, 0.8)';
        ctx.shadowBlur = 7;
        ctx.arc(pos.x, pos.y, 2.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    ctx.fillStyle = 'rgba(47, 184, 214, 0.62)';
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