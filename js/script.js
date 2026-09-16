// ===========================================================
// VYERAK.DEV — interactions
// ===========================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle) {
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

/* ---------- code typewriter ---------- */
/* ---------- código + output sincronizado ---------- */
const termLines = [
  { code: '>>> print("Seja bem-vindo")', output: 'Seja bem-vindo' },
  { code: '>>> print("à Vyerak.dev")', output: 'à Vyerak.dev' },
  { code: '>>> projetos = ["sites", "sistemas"]', output: null },
  { code: '>>> for p in projetos:', output: null },
  { code: '...     print(f"✓ {p} pronto")', output: null },
  { code: null, output: '✓ sites pronto' },
  { code: null, output: '✓ sistemas pronto' },
  { code: '>>> print("Vamos construir?")', output: 'Vamos construir?' },
];

const codeEl = document.getElementById('code-body') || document.getElementById('terminal-body');
const previewEl = document.getElementById('preview-body');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeSynced() {
  if (!codeEl) return;

  // se não existir preview, só digita o código
  if (!previewEl) {
    codeEl.textContent = termLines.filter(l => l.code).map(l => l.code).join('\n');
    return;
  }

  if (prefersReducedMotion) {
    codeEl.innerHTML = termLines.filter(l => l.code).map(l => l.code).join('\n');
    previewEl.innerHTML = termLines.filter(l => l.output).map(l => `<div class="output-line">${l.output}</div>`).join('');
    return;
  }

  codeEl.innerHTML = '';
  previewEl.innerHTML = '';

  let i = 0;

  function next() {
    if (i >= termLines.length) {
      setTimeout(() => {
        codeEl.innerHTML = '';
        previewEl.innerHTML = '';
        i = 0;
        next();
      }, 2800);
      return;
    }

    const line = termLines[i];

    // digita o código
    if (line.code) {
      const div = document.createElement('div');
      codeEl.appendChild(div);
      let c = 0;

      function typeChar() {
        c++;
        div.textContent = line.code.slice(0, c);
        if (c < line.code.length) {
          setTimeout(typeChar, 18);
        } else {
          // quando termina de digitar, mostra o output
          if (line.output) {
            const out = document.createElement('div');
            out.className = 'output-line';
            out.textContent = line.output;
            previewEl.appendChild(out);
          }
          i++;
          setTimeout(next, 350);
        }
      }
      typeChar();
    } else if (line.output) {
      // só output (tipo resultado do for)
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
}

typeSynced();
/* ---------- particle network background ---------- */
(function particleNetwork() {
  const canvases = document.querySelectorAll('.net-canvas');
  if (!canvases.length) return;

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    const DENSITY = 14000; // px² per particle
    const LINK_DIST = 130;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const count = Math.max(24, Math.min(90, Math.floor((width * height) / DENSITY)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(47, 184, 214, ${0.16 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 137, 161, 0.9)';
        ctx.fill();
      }
      if (!prefersReducedMotion) requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize);
    step(); // first frame always drawn; loop continues unless reduced motion
  });
})();

/* ---------- contact form (front-end only placeholder) ---------- */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Formulário ainda não conectado a um serviço de envio. Veja o README do projeto para instruções de configuração (ex: Formspree, EmailJS ou uma rota de API).');
  });
}

/* ---------- scroll reveal animations ---------- */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // opcional: para de observar depois que animou
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

/* ---------- scroll reveal (incluindo laterais) ---------- */
(function () {
  const reveals = document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();