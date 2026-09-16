// ===========================================================
// VYERAK.DEV — interactions
// ===========================================================

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- visual refresh: hero slogan ---------- */
const heroHeading = document.querySelector('.hero h1');
if (heroHeading) {
  heroHeading.innerHTML = 'Seu negócio merece mais do que um site.<br><span class="hero-slogan-accent">Merece uma presença digital à altura.</span>';
}

/* ---------- visual refresh: header transparent at the top ---------- */
const header = document.querySelector('.site-header');
function updateHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}
updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

/* ---------- inject visual-only styles ---------- */
const visualStyle = document.createElement('style');
visualStyle.textContent = `
  .site-header{
    background:transparent;
    border-bottom-color:transparent;
    backdrop-filter:none;
    -webkit-backdrop-filter:none;
    transition:background .28s ease, border-color .28s ease, backdrop-filter .28s ease;
  }
  .site-header.is-scrolled{
    background:rgba(7,9,10,.82);
    border-bottom-color:var(--line);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
  }
  .hero-slogan-accent{
    color:var(--teal-light);
    display:inline-block;
  }
  .site-background-canvas{
    position:fixed;
    inset:0;
    width:100%;
    height:100%;
    z-index:0;
    pointer-events:none;
    opacity:.72;
  }
  body > *:not(.site-background-canvas){
    position:relative;
  }
  .site-header{ z-index:100; }
  .site-background-canvas + *{ z-index:1; }
  .net-canvas{ opacity:.18; }
  @media (max-width:760px){
    .hero-slogan-accent{ display:inline; }
    .site-background-canvas{ opacity:.55; }
  }
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

/* ---------- global animated network background ---------- */
(function globalNetworkBackground() {
  if (document.querySelector('.site-background-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'site-background-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function makeNodes() {
    const area = width * height;
    const count = Math.max(28, Math.min(75, Math.floor(area / 24000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.5 + 1,
      pulse: Math.random() * Math.PI * 2
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
    makeNodes();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const linkDistance = width < 760 ? 125 : 165;
    const t = time * 0.001;

    for (const node of nodes) {
      if (!prefersReducedMotion) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20 || node.x > width + 20) node.vx *= -1;
        if (node.y < -20 || node.y > height + 20) node.vy *= -1;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < linkDistance) {
          const alpha = (1 - distance / linkDistance) * 0.18;
          ctx.strokeStyle = `rgba(47,184,214,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const node of nodes) {
      const glow = 0.42 + Math.sin(t * 1.5 + node.pulse) * 0.12;
      ctx.beginPath();
      ctx.fillStyle = `rgba(47,184,214,${glow})`;
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // The global canvas replaces the section-specific versions so the same
  // visual language continues uninterrupted across the whole site.
  document.querySelectorAll('.net-canvas').forEach(c => { c.style.display = 'none'; });

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