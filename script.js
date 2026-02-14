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

  // ─── Airo Canvas — Agent Network ────────────────
  const airoCanvas = document.getElementById('airo-canvas');
  if (airoCanvas) {
    const actx = airoCanvas.getContext('2d');

    function resizeAiroCanvas() {
      const rect = airoCanvas.parentElement.getBoundingClientRect();
      airoCanvas.width = rect.width || 400;
      airoCanvas.height = rect.height || 320;
    }
    resizeAiroCanvas();
    window.addEventListener('resize', resizeAiroCanvas);

    // Agent nodes: central orchestrator + specialized agents
    const agents = [
      { label: 'AIRO', radius: 16, orbit: 0, speed: 0, angle: 0 },
      { label: 'Design', radius: 8, orbit: 80, speed: 0.4, angle: 0 },
      { label: 'Content', radius: 8, orbit: 80, speed: 0.4, angle: Math.PI * 0.667 },
      { label: 'Build', radius: 8, orbit: 80, speed: 0.4, angle: Math.PI * 1.333 },
      { label: 'SEO', radius: 6, orbit: 120, speed: -0.25, angle: Math.PI * 0.25 },
      { label: 'Images', radius: 6, orbit: 120, speed: -0.25, angle: Math.PI * 0.75 },
      { label: 'Theme', radius: 6, orbit: 120, speed: -0.25, angle: Math.PI * 1.25 },
      { label: 'Copy', radius: 6, orbit: 120, speed: -0.25, angle: Math.PI * 1.75 },
    ];

    function drawAiroNetwork() {
      const w = airoCanvas.width;
      const h = airoCanvas.height;
      const t = Date.now() * 0.001;
      const cx = w / 2;
      const cy = h / 2;

      actx.clearRect(0, 0, w, h);

      // Compute positions
      const positions = agents.map((agent) => {
        if (agent.orbit === 0) return { x: cx, y: cy, ...agent };
        const a = agent.angle + t * agent.speed;
        return {
          x: cx + Math.cos(a) * agent.orbit,
          y: cy + Math.sin(a) * agent.orbit,
          ...agent,
        };
      });

      // Draw connections from center to all agents
      positions.forEach((pos, i) => {
        if (i === 0) return;
        const pulse = 0.15 + Math.sin(t * 2 + i) * 0.1;
        actx.beginPath();
        actx.moveTo(positions[0].x, positions[0].y);
        actx.lineTo(pos.x, pos.y);
        actx.strokeStyle = `rgba(0, 212, 255, ${pulse})`;
        actx.lineWidth = 1;
        actx.stroke();

        // Data packet traveling along the connection
        const packetT = (Math.sin(t * 1.5 + i * 0.8) + 1) / 2;
        const px = positions[0].x + (pos.x - positions[0].x) * packetT;
        const py = positions[0].y + (pos.y - positions[0].y) * packetT;
        actx.beginPath();
        actx.arc(px, py, 2, 0, Math.PI * 2);
        actx.fillStyle = `rgba(123, 97, 255, ${0.6 + Math.sin(t * 3 + i) * 0.3})`;
        actx.fill();
      });

      // Draw orbit rings (faint)
      [80, 120].forEach((r) => {
        actx.beginPath();
        actx.arc(cx, cy, r, 0, Math.PI * 2);
        actx.strokeStyle = 'rgba(0, 212, 255, 0.06)';
        actx.lineWidth = 1;
        actx.stroke();
      });

      // Draw agent nodes
      positions.forEach((pos, i) => {
        // Glow
        const glow = actx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pos.radius * 3);
        if (i === 0) {
          glow.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
          glow.addColorStop(1, 'rgba(0, 212, 255, 0)');
        } else {
          glow.addColorStop(0, 'rgba(123, 97, 255, 0.2)');
          glow.addColorStop(1, 'rgba(123, 97, 255, 0)');
        }
        actx.beginPath();
        actx.arc(pos.x, pos.y, pos.radius * 3, 0, Math.PI * 2);
        actx.fillStyle = glow;
        actx.fill();

        // Node
        actx.beginPath();
        actx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
        if (i === 0) {
          actx.fillStyle = 'rgba(0, 212, 255, 0.8)';
          actx.shadowColor = '#00d4ff';
          actx.shadowBlur = 20;
        } else {
          const brightness = 0.4 + Math.sin(t * 2 + i * 0.7) * 0.2;
          actx.fillStyle = `rgba(123, 97, 255, ${brightness})`;
          actx.shadowColor = '#7b61ff';
          actx.shadowBlur = 10;
        }
        actx.fill();
        actx.shadowBlur = 0;
      });

      requestAnimationFrame(drawAiroNetwork);
    }
    drawAiroNetwork();
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
