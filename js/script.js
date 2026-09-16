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

/* ---------- terminal typewriter ---------- */
const termLines = [
  { text: '$ vyerak deploy', cls: '' },
  { text: '✓ build concluído em 1.8s', cls: 'ok' },
  { text: '✓ imagens otimizadas', cls: 'ok' },
  { text: '✓ lighthouse: 98 performance', cls: 'ok' },
  { text: '✓ site no ar → vyerak.dev', cls: 'ok' },
];

const termEl = document.getElementById('terminal-body');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeTerminal() {
  if (!termEl) return;

  if (prefersReducedMotion) {
    termEl.innerHTML = termLines.map(l => `<span class="${l.cls}">${l.text}</span>`).join('\n');
    return;
  }

  termEl.innerHTML = '';
  let lineIndex = 0;
  let charIndex = 0;

  function typeChar() {
    if (lineIndex >= termLines.length) {
      setTimeout(() => { termEl.innerHTML = ''; lineIndex = 0; charIndex = 0; typeChar(); }, 2600);
      return;
    }
    const line = termLines[lineIndex];
    const current = termEl.querySelectorAll('.line');
    let lineEl = termEl.querySelector(`[data-line="${lineIndex}"]`);
    if (!lineEl) {
      lineEl = document.createElement('div');
      lineEl.className = `line ${line.cls}`;
      lineEl.dataset.line = String(lineIndex);
      termEl.appendChild(lineEl);
    }
    charIndex++;
    lineEl.textContent = line.text.slice(0, charIndex);

    if (charIndex >= line.text.length) {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, 260);
    } else {
      setTimeout(typeChar, 22);
    }
  }
  typeChar();
}
typeTerminal();

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