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

  /* One viewport-sized layer: it never restarts when the user changes section. */
  .net-canvas { display: none !important; }
  .global-network-canvas {
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

/* ---------- reference-style animated network background ---------- */
(function globalNetworkBackground() {
  const canvas = document.createElement('canvas');
  canvas.className = 'global-network-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];

  function createNodes() {
    const area = width * height;
    const count = Math.max(32, Math.min(68, Math.floor(area / 27000)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.10,
      vy: (Math.random() - 0.5) * 0.10,
      radius: index % 5 === 0 ? 2.1 : 1.35,
      phase: Math.random() * Math.PI * 2
    }));
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
    createNodes();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const t = time * 0.00045;
    const linkDistance = width < 760 ? 135 : 175;

    /* Very subtle red atmosphere, like the reference, without tinting the page. */
    const glow = ctx.createRadialGradient(width * 0.78, height * 0.08, 0, width * 0.78, height * 0.08, width * 0.48);
    glow.addColorStop(0, 'rgba(255, 0, 0, 0.055)');
    glow.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -30 || node.x > width + 30) node.vx *= -1;
        if (node.y < -30 || node.y > height + 30) node.vy *= -1;
      }
    }

    /* Thin, sparse connections. */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < linkDistance) {
          const alpha = (1 - distance / linkDistance) * 0.18;
          ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    /* Small red points with restrained breathing glow. */
    for (const node of nodes) {
      const pulse = 0.48 + Math.sin(t + node.phase) * 0.16;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
      ctx.shadowColor = 'rgba(255, 0, 0, 0.72)';
      ctx.shadowBlur = node.radius > 2 ? 8 : 4;
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
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