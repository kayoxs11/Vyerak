// ===========================================================
// VYERAK.DEV — interactions
// ===========================================================

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- transparent header after the first scroll ---------- */
const siteHeader = document.querySelector('.site-header');
function updateHeaderState() {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 24);
}
updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

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

  if (!previewEl) {
    codeEl.textContent = codeOnly;
    return;
  }

  if (prefersReducedMotion) {
    codeEl.textContent = codeOnly;
    previewEl.innerHTML = codeLines
      .filter(l => l.output)
      .map(l => `<div class="output-line" style="opacity:1;transform:none">${l.output}</div>`)
      .join('');
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
        if (c < line.code.length) {
          setTimeout(typeChar, 18);
        } else {
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
    } else {
      i++;
      next();
    }
  }
  next();
})();

/* ---------- circuit-board background (traces + traveling light pulses) ---------- */
(function circuitBoard() {
  const globalCanvas = document.createElement('canvas');
  globalCanvas.className = 'global-net-canvas';
  globalCanvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(globalCanvas);

  const allCanvases = [globalCanvas];

  function buildTraces(width, height) {
    const cell = 46;
    const cols = Math.max(4, Math.floor(width / cell));
    const rows = Math.max(4, Math.floor(height / cell));
    const count = Math.max(10, Math.min(34, Math.floor((width * height) / 34000)));
    const traces = [];

    for (let i = 0; i < count; i++) {
      let x = Math.floor(Math.random() * cols) * cell;
      let y = Math.floor(Math.random() * rows) * cell;
      const points = [{ x, y }];
      const steps = 3 + Math.floor(Math.random() * 5);
      let horizontal = Math.random() < 0.5;

      for (let s = 0; s < steps; s++) {
        const len = (1 + Math.floor(Math.random() * 3)) * cell;
        if (horizontal) x += Math.random() < 0.5 ? -len : len;
        else y += Math.random() < 0.5 ? -len : len;
        x = Math.min(Math.max(x, 0), cols * cell);
        y = Math.min(Math.max(y, 0), rows * cell);
        points.push({ x, y });
        horizontal = !horizontal;
      }

      const segLens = [];
      let total = 0;
      for (let p = 0; p < points.length - 1; p++) {
        const l = Math.hypot(points[p + 1].x - points[p].x, points[p + 1].y - points[p].y);
        segLens.push(l);
        total += l;
      }

      traces.push({ points, segLens, total, offset: Math.random(), speed: 0.07 + Math.random() * 0.08 });
    }
    return traces;
  }

  function pointAtT(trace, t) {
    const target = t * trace.total;
    let acc = 0;
    for (let i = 0; i < trace.segLens.length; i++) {
      const segLen = trace.segLens[i];
      if (target <= acc + segLen || i === trace.segLens.length - 1) {
        const segT = segLen === 0 ? 0 : (target - acc) / segLen;
        const p0 = trace.points[i], p1 = trace.points[i + 1];
        return { x: p0.x + (p1.x - p0.x) * segT, y: p0.y + (p1.y - p0.y) * segT };
      }
      acc += segLen;
    }
    return trace.points[trace.points.length - 1];
  }

  allCanvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    // secondary pages / the subtler Processo canvas read a touch dimmer so text stays legible
    const intensity = canvas.classList.contains('net-canvas--subtle') ? 0.5
      : canvas.closest('.page-head') ? 0.7
      : 1;
    let width, height, traces;

    function resize() {
      const rect = canvas.classList.contains('global-net-canvas')
        ? { width: window.innerWidth, height: window.innerHeight }
        : canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width * window.devicePixelRatio;
      height = canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      width = rect.width;
      height = rect.height;
      traces = buildTraces(width, height);
    }

    function drawStatic() {
      ctx.strokeStyle = 'rgba(6, 137, 161, 0.68)';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(47, 184, 214, 0.9)';

      traces.forEach((trace) => {
        ctx.beginPath();
        trace.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();

        trace.points.forEach((p, i) => {
          const r = i === 0 || i === trace.points.length - 1 ? 3 : 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    function drawPulses(timeSec) {
      traces.forEach((trace) => {
        const t = (timeSec * trace.speed + trace.offset) % 1;
        const pos = pointAtT(trace, t);
        ctx.beginPath();
        ctx.fillStyle = '#2FB8D6';
        ctx.shadowColor = 'rgba(47, 184, 214, 0.95)';
        ctx.shadowBlur = 14;
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function step(ts) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = intensity;
      drawStatic();
      drawPulses(ts / 1000);
      ctx.globalAlpha = 1;
      if (!prefersReducedMotion) requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      ctx.globalAlpha = intensity;
      drawStatic();
      ctx.globalAlpha = 1;
    } else {
      requestAnimationFrame(step);
    }
  });
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

/* ---------- scroll reveal animations (.reveal, .reveal-from-left, .reveal-from-right) ---------- */
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