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

  // ─── MRR Canvas — Market Research Report ──────────
  const mrrCanvas = document.getElementById('mrr-canvas');
  if (mrrCanvas) {
    const mctx = mrrCanvas.getContext('2d');

    function resizeMrrCanvas() {
      const rect = mrrCanvas.parentElement.getBoundingClientRect();
      mrrCanvas.width = rect.width || 400;
      mrrCanvas.height = rect.height || 320;
    }
    resizeMrrCanvas();
    window.addEventListener('resize', resizeMrrCanvas);

    function drawMrr() {
      const w = mrrCanvas.width;
      const h = mrrCanvas.height;
      const t = Date.now() * 0.001;

      mctx.clearRect(0, 0, w, h);

      // Document lines (simulating a research report)
      const lineCount = 8;
      const lineStartX = w * 0.15;
      const lineEndX = w * 0.85;
      const lineStartY = h * 0.12;
      const lineSpacing = h * 0.065;

      for (let i = 0; i < lineCount; i++) {
        const y = lineStartY + i * lineSpacing;
        const progress = Math.min(1, Math.max(0, (Math.sin(t * 0.8 - i * 0.3) + 1) / 2));
        const endX = lineStartX + (lineEndX - lineStartX) * (0.5 + progress * 0.5);
        const alpha = 0.15 + progress * 0.2;

        mctx.beginPath();
        mctx.moveTo(lineStartX, y);
        mctx.lineTo(endX, y);
        mctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        mctx.lineWidth = 2;
        mctx.stroke();
      }

      // Magnifying glass icon (scanning the report)
      const glassX = w * 0.5 + Math.sin(t * 0.6) * w * 0.2;
      const glassY = h * 0.35 + Math.cos(t * 0.4) * h * 0.1;
      const glassR = 18;

      // Glass glow
      const glow = mctx.createRadialGradient(glassX, glassY, 0, glassX, glassY, glassR * 3);
      glow.addColorStop(0, 'rgba(123, 97, 255, 0.2)');
      glow.addColorStop(1, 'rgba(123, 97, 255, 0)');
      mctx.beginPath();
      mctx.arc(glassX, glassY, glassR * 3, 0, Math.PI * 2);
      mctx.fillStyle = glow;
      mctx.fill();

      // Glass circle
      mctx.beginPath();
      mctx.arc(glassX, glassY, glassR, 0, Math.PI * 2);
      mctx.strokeStyle = 'rgba(123, 97, 255, 0.6)';
      mctx.lineWidth = 2;
      mctx.stroke();

      // Glass handle
      const handleAngle = Math.PI * 0.25;
      mctx.beginPath();
      mctx.moveTo(glassX + Math.cos(handleAngle) * glassR, glassY + Math.sin(handleAngle) * glassR);
      mctx.lineTo(glassX + Math.cos(handleAngle) * (glassR + 12), glassY + Math.sin(handleAngle) * (glassR + 12));
      mctx.strokeStyle = 'rgba(123, 97, 255, 0.5)';
      mctx.lineWidth = 3;
      mctx.stroke();

      // Insight nodes appearing below the report
      const insights = [
        { x: w * 0.25, y: h * 0.72, color: '#00d4ff', label: 'Industry' },
        { x: w * 0.5, y: h * 0.72, color: '#7b61ff', label: 'Company' },
        { x: w * 0.75, y: h * 0.72, color: '#00ff88', label: 'Insights' },
      ];

      insights.forEach((node, i) => {
        const breathe = 1 + Math.sin(t * 1.5 + i * 1.2) * 0.15;
        const r = 8 * breathe;
        const hex = node.color;
        const cr = parseInt(hex.slice(1, 3), 16);
        const cg = parseInt(hex.slice(3, 5), 16);
        const cb = parseInt(hex.slice(5, 7), 16);

        // Connection line from report area to insight
        const pulse = 0.1 + Math.sin(t * 2 + i) * 0.08;
        mctx.beginPath();
        mctx.moveTo(node.x, h * 0.55);
        mctx.lineTo(node.x, node.y);
        mctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${pulse})`;
        mctx.lineWidth = 1;
        mctx.stroke();

        // Node glow
        const nodeGlow = mctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3);
        nodeGlow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.25)`);
        nodeGlow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        mctx.beginPath();
        mctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        mctx.fillStyle = nodeGlow;
        mctx.fill();

        // Node circle
        mctx.beginPath();
        mctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        mctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;
        mctx.shadowColor = node.color;
        mctx.shadowBlur = 10;
        mctx.fill();
        mctx.shadowBlur = 0;
      });

      // Data particles flowing from glass to insights
      for (let i = 0; i < 3; i++) {
        const packetT = ((t * 0.7 + i * 0.7) % 2) / 2;
        if (packetT <= 1) {
          const fromY = glassY + glassR;
          const toNode = insights[i];
          const px = glassX + (toNode.x - glassX) * packetT;
          const py = fromY + (toNode.y - fromY) * packetT;
          mctx.beginPath();
          mctx.arc(px, py, 2, 0, Math.PI * 2);
          mctx.fillStyle = `rgba(0, 212, 255, ${0.5 + Math.sin(t * 3 + i) * 0.3})`;
          mctx.fill();
        }
      }

      requestAnimationFrame(drawMrr);
    }
    drawMrr();
  }

  // ─── RPG Canvas — Stat Bars & XP ─────────────────
  const rpgCanvas = document.getElementById('rpg-canvas');
  if (rpgCanvas) {
    const rctx = rpgCanvas.getContext('2d');

    function resizeRpgCanvas() {
      const rect = rpgCanvas.parentElement.getBoundingClientRect();
      rpgCanvas.width = rect.width || 400;
      rpgCanvas.height = rect.height || 320;
    }
    resizeRpgCanvas();
    window.addEventListener('resize', resizeRpgCanvas);

    const stats = [
      { label: 'STR', color: '#ff4d4d' },
      { label: 'WIS', color: '#7b61ff' },
      { label: 'CHA', color: '#00d4ff' },
      { label: 'STA', color: '#00ff88' },
      { label: 'AGI', color: '#ffaa00' },
      { label: 'INT', color: '#ff61d4' },
    ];

    function drawRpg() {
      const w = rpgCanvas.width;
      const h = rpgCanvas.height;
      const t = Date.now() * 0.001;

      rctx.clearRect(0, 0, w, h);

      const barWidth = w * 0.5;
      const barHeight = 8;
      const startX = (w - barWidth) / 2;
      const startY = h * 0.2;
      const gap = 28;

      // Draw stat bars
      stats.forEach((stat, i) => {
        const y = startY + i * gap;
        const fillPercent = 0.4 + Math.sin(t * 0.8 + i * 1.1) * 0.3;

        // Label
        rctx.font = '10px "Space Mono", monospace';
        rctx.fillStyle = 'rgba(232, 232, 239, 0.5)';
        rctx.textAlign = 'right';
        rctx.fillText(stat.label, startX - 10, y + 7);

        // Background bar
        rctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        rctx.fillRect(startX, y, barWidth, barHeight);

        // Filled bar
        rctx.fillStyle = stat.color;
        rctx.globalAlpha = 0.6 + Math.sin(t * 2 + i) * 0.2;
        rctx.fillRect(startX, y, barWidth * fillPercent, barHeight);
        rctx.globalAlpha = 1;

        // Glow on bar tip
        const tipX = startX + barWidth * fillPercent;
        const glow = rctx.createRadialGradient(tipX, y + barHeight / 2, 0, tipX, y + barHeight / 2, 15);
        glow.addColorStop(0, stat.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        rctx.fillStyle = glow;
        rctx.fillRect(tipX - 15, y - 10, 30, barHeight + 20);
      });

      // XP bar at bottom
      const xpY = startY + stats.length * gap + 15;
      const xpFill = (Math.sin(t * 0.3) + 1) / 2;
      rctx.font = '10px "Space Mono", monospace';
      rctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
      rctx.textAlign = 'center';
      rctx.fillText('LVL ' + Math.floor(5 + Math.sin(t * 0.1) * 2), w / 2, xpY - 5);

      rctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      rctx.fillRect(startX, xpY, barWidth, 6);
      rctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
      rctx.fillRect(startX, xpY, barWidth * xpFill, 6);

      requestAnimationFrame(drawRpg);
    }
    drawRpg();
  }

  // ─── Obsidian Canvas — Terminal/Chat ──────────────
  const obsidianCanvas = document.getElementById('obsidian-canvas');
  if (obsidianCanvas) {
    const octx = obsidianCanvas.getContext('2d');

    function resizeObsidianCanvas() {
      const rect = obsidianCanvas.parentElement.getBoundingClientRect();
      obsidianCanvas.width = rect.width || 400;
      obsidianCanvas.height = rect.height || 320;
    }
    resizeObsidianCanvas();
    window.addEventListener('resize', resizeObsidianCanvas);

    const lines = [
      { prefix: '>', text: 'Summarize my meeting notes', color: '#e8e8ef' },
      { prefix: '', text: 'Reading vault/meetings/2026-02...', color: '#7b61ff' },
      { prefix: '', text: 'Found 3 files. Summarizing...', color: '#7b61ff' },
      { prefix: '>', text: 'Create action items from summary', color: '#e8e8ef' },
      { prefix: '', text: 'Writing vault/tasks/actions.md', color: '#00d4ff' },
      { prefix: '', text: 'Done. Created 5 action items.', color: '#00ff88' },
    ];

    function drawObsidian() {
      const w = obsidianCanvas.width;
      const h = obsidianCanvas.height;
      const t = Date.now() * 0.001;

      octx.clearRect(0, 0, w, h);

      const lineHeight = 22;
      const startX = w * 0.1;
      const startY = h * 0.18;
      const totalCycleTime = lines.length * 1.5 + 2;
      const cycleT = t % totalCycleTime;

      lines.forEach((line, i) => {
        const lineAppearTime = i * 1.5;
        if (cycleT < lineAppearTime) return;

        const elapsed = cycleT - lineAppearTime;
        const charsToShow = Math.min(Math.floor(elapsed * 20), (line.prefix + ' ' + line.text).length);
        const fullText = (line.prefix ? line.prefix + ' ' : '') + line.text;
        const displayText = fullText.substring(0, charsToShow);

        const y = startY + i * lineHeight;
        const alpha = Math.min(elapsed * 2, 0.8);

        octx.font = '11px "Space Mono", monospace';
        octx.fillStyle = line.color.replace(')', `, ${alpha})`).replace('#', '');

        // Convert hex to rgba
        const hex = line.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        octx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        octx.textAlign = 'left';
        octx.fillText(displayText, startX, y);

        // Blinking cursor at end of current line
        if (charsToShow < fullText.length && Math.sin(t * 6) > 0) {
          const textWidth = octx.measureText(displayText).width;
          octx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
          octx.fillRect(startX + textWidth + 2, y - 10, 7, 13);
        }
      });

      requestAnimationFrame(drawObsidian);
    }
    drawObsidian();
  }

  // ─── Vantalyze Canvas — Opportunity Solution Tree ─
  const vantalyzeCanvas = document.getElementById('vantalyze-canvas');
  if (vantalyzeCanvas) {
    const vtctx = vantalyzeCanvas.getContext('2d');

    function resizeVantalyzeCanvas() {
      const rect = vantalyzeCanvas.parentElement.getBoundingClientRect();
      vantalyzeCanvas.width = rect.width || 400;
      vantalyzeCanvas.height = rect.height || 320;
    }
    resizeVantalyzeCanvas();
    window.addEventListener('resize', resizeVantalyzeCanvas);

    function drawVantalyze() {
      const w = vantalyzeCanvas.width;
      const h = vantalyzeCanvas.height;
      const t = Date.now() * 0.001;

      vtctx.clearRect(0, 0, w, h);

      // Tree structure: outcome -> opportunities -> solutions
      const cx = w / 2;
      const levels = [
        [{ x: cx, y: h * 0.15, r: 12, color: '#00d4ff', label: 'Outcome' }],
        [
          { x: cx - 70, y: h * 0.42, r: 9, color: '#7b61ff', label: 'Opp 1' },
          { x: cx + 70, y: h * 0.42, r: 9, color: '#7b61ff', label: 'Opp 2' },
        ],
        [
          { x: cx - 105, y: h * 0.72, r: 7, color: '#00ff88', label: 'S1' },
          { x: cx - 35, y: h * 0.72, r: 7, color: '#00ff88', label: 'S2' },
          { x: cx + 35, y: h * 0.72, r: 7, color: '#00ff88', label: 'S3' },
          { x: cx + 105, y: h * 0.72, r: 7, color: '#00ff88', label: 'S4' },
        ],
      ];

      // Draw connections
      vtctx.lineWidth = 1;
      // Level 0 -> Level 1
      levels[1].forEach((node) => {
        const pulse = 0.15 + Math.sin(t * 2 + node.x * 0.01) * 0.1;
        vtctx.beginPath();
        vtctx.moveTo(levels[0][0].x, levels[0][0].y);
        vtctx.lineTo(node.x, node.y);
        vtctx.strokeStyle = `rgba(123, 97, 255, ${pulse})`;
        vtctx.stroke();
      });
      // Level 1 -> Level 2
      levels[2].forEach((node, i) => {
        const parentIdx = i < 2 ? 0 : 1;
        const pulse = 0.15 + Math.sin(t * 2 + i * 0.8) * 0.1;
        vtctx.beginPath();
        vtctx.moveTo(levels[1][parentIdx].x, levels[1][parentIdx].y);
        vtctx.lineTo(node.x, node.y);
        vtctx.strokeStyle = `rgba(0, 255, 136, ${pulse})`;
        vtctx.stroke();
      });

      // Draw nodes
      let nodeIdx = 0;
      levels.forEach((level) => {
        level.forEach((node) => {
          const breathe = 1 + Math.sin(t * 1.5 + nodeIdx * 0.9) * 0.15;
          const r = node.r * breathe;

          // Glow
          const glow = vtctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3);
          const hex = node.color;
          const cr = parseInt(hex.slice(1, 3), 16);
          const cg = parseInt(hex.slice(3, 5), 16);
          const cb = parseInt(hex.slice(5, 7), 16);
          glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.25)`);
          glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          vtctx.beginPath();
          vtctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
          vtctx.fillStyle = glow;
          vtctx.fill();

          // Node circle
          vtctx.beginPath();
          vtctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          vtctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;
          vtctx.shadowColor = node.color;
          vtctx.shadowBlur = 10;
          vtctx.fill();
          vtctx.shadowBlur = 0;

          nodeIdx++;
        });
      });

      // Data packets flowing down branches
      for (let i = 0; i < 4; i++) {
        const parentIdx = i < 2 ? 0 : 1;
        const packetT = ((t * 0.8 + i * 0.5) % 2) / 2;
        if (packetT <= 1) {
          const fromNode = levels[1][parentIdx];
          const toNode = levels[2][i];
          const px = fromNode.x + (toNode.x - fromNode.x) * packetT;
          const py = fromNode.y + (toNode.y - fromNode.y) * packetT;
          vtctx.beginPath();
          vtctx.arc(px, py, 2.5, 0, Math.PI * 2);
          vtctx.fillStyle = `rgba(0, 255, 136, ${0.6 + Math.sin(t * 3 + i) * 0.3})`;
          vtctx.fill();
        }
      }

      requestAnimationFrame(drawVantalyze);
    }
    drawVantalyze();
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
