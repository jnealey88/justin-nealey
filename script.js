/* ============================================
   JUSTIN NEALEY — Portfolio Scripts
   ============================================ */

(function () {
  'use strict';

  // ─── Custom Cursor ───────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor hover effects
  const hoverTargets = document.querySelectorAll('a, button, .project-card');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });

  // ─── Hero Canvas — Particle Constellation ───────
  const heroCanvas = document.getElementById('hero-canvas');
  const ctx = heroCanvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;

  function resizeCanvas() {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * heroCanvas.width;
      this.y = Math.random() * heroCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - (mouseY + window.scrollY);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx += (dx / dist) * force * 0.3;
        this.vy += (dy / dist) * force * 0.3;
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Boundaries
      if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateHero() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Gradient background orbs
    const time = Date.now() * 0.001;

    // Orb 1
    const gradient1 = ctx.createRadialGradient(
      heroCanvas.width * 0.3 + Math.sin(time * 0.3) * 100,
      heroCanvas.height * 0.4 + Math.cos(time * 0.2) * 80,
      0,
      heroCanvas.width * 0.3,
      heroCanvas.height * 0.4,
      400
    );
    gradient1.addColorStop(0, 'rgba(0, 212, 255, 0.06)');
    gradient1.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Orb 2
    const gradient2 = ctx.createRadialGradient(
      heroCanvas.width * 0.7 + Math.cos(time * 0.4) * 120,
      heroCanvas.height * 0.6 + Math.sin(time * 0.3) * 60,
      0,
      heroCanvas.width * 0.7,
      heroCanvas.height * 0.6,
      350
    );
    gradient2.addColorStop(0, 'rgba(123, 97, 255, 0.05)');
    gradient2.addColorStop(1, 'rgba(123, 97, 255, 0)');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animateHero);
  }
  animateHero();

  // ─── Vibe Canvas — Generative Art ───────────────
  const vibeCanvas = document.getElementById('vibe-canvas');
  if (vibeCanvas) {
    const vctx = vibeCanvas.getContext('2d');

    function resizeVibeCanvas() {
      const rect = vibeCanvas.parentElement.getBoundingClientRect();
      vibeCanvas.width = rect.width || 400;
      vibeCanvas.height = rect.height || 320;
    }
    resizeVibeCanvas();
    window.addEventListener('resize', resizeVibeCanvas);

    function drawVibeArt() {
      const w = vibeCanvas.width;
      const h = vibeCanvas.height;
      const t = Date.now() * 0.002;

      vctx.clearRect(0, 0, w, h);

      // Flowing wave lines
      for (let i = 0; i < 8; i++) {
        vctx.beginPath();
        const yBase = (h / 9) * (i + 1);
        for (let x = 0; x < w; x += 2) {
          const y = yBase +
            Math.sin(x * 0.01 + t + i * 0.5) * 20 +
            Math.sin(x * 0.02 + t * 1.5) * 10;
          if (x === 0) vctx.moveTo(x, y);
          else vctx.lineTo(x, y);
        }
        const hue = 180 + i * 20;
        vctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.15 + i * 0.03})`;
        vctx.lineWidth = 1.5;
        vctx.stroke();
      }

      // Floating dots
      for (let i = 0; i < 20; i++) {
        const x = (w / 2) + Math.cos(t * 0.5 + i * 1.2) * (w * 0.3);
        const y = (h / 2) + Math.sin(t * 0.7 + i * 0.8) * (h * 0.3);
        const r = 2 + Math.sin(t + i) * 1;
        vctx.beginPath();
        vctx.arc(x, y, r, 0, Math.PI * 2);
        vctx.fillStyle = `rgba(0, 212, 255, ${0.3 + Math.sin(t + i) * 0.2})`;
        vctx.fill();
      }

      requestAnimationFrame(drawVibeArt);
    }
    drawVibeArt();
  }

  // ─── Scroll Reveal ──────────────────────────────
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-text, .section-label');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── Counting Animation ────────────────────────
  const statValues = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let current = 0;
          const increment = target / 40;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, 30);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((el) => countObserver.observe(el));

  // ─── Smooth Scroll for Nav Links ────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Nav Background on Scroll ───────────────────
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      nav.style.mixBlendMode = 'normal';
      nav.style.background = 'rgba(10, 10, 15, 0.8)';
      nav.style.backdropFilter = 'blur(20px)';
      nav.style.WebkitBackdropFilter = 'blur(20px)';
    } else {
      nav.style.mixBlendMode = 'difference';
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.WebkitBackdropFilter = 'none';
    }

    // Hide/show nav on scroll direction
    if (currentScroll > lastScroll && currentScroll > 300) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s';

    lastScroll = currentScroll;
  });

  // ─── Parallax on Hero ───────────────────────────
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
  });

  // ─── Letter Animation on Name Hover ─────────────
  const nameWords = document.querySelectorAll('[data-letter-animation]');
  nameWords.forEach((word) => {
    const text = word.textContent;
    word.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.transition = `transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.02}s, color 0.3s`;
      word.appendChild(span);
    });

    word.addEventListener('mouseenter', () => {
      word.querySelectorAll('span').forEach((span, i) => {
        span.style.transform = `translateY(${Math.sin(i * 0.8) * -8}px)`;
        span.style.color = '#00d4ff';
      });
    });

    word.addEventListener('mouseleave', () => {
      word.querySelectorAll('span').forEach((span) => {
        span.style.transform = 'translateY(0)';
        span.style.color = '';
      });
    });
  });

})();
