(() => {
"use strict";
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let followerX = mouseX;
let followerY = mouseY;

if (!isTouchDevice && cursor && follower) {
  document.documentElement.classList.add('has-custom-cursor');
  document.addEventListener('mousemove', e => {
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
} else {
  cursor?.remove();
  follower?.remove();
  document.documentElement.classList.add('touch-device');
}

const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function updateScrollUI() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  navbar?.classList.toggle('scrolled', scrollTop > 50);
  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }
  if (backToTop) {
    backToTop.classList.toggle('show', scrollTop > window.innerHeight * 0.6);
  }
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

const ham = document.getElementById('hamburger');
const navL = document.querySelector('.nav-links');
ham?.addEventListener('click', () => {
  navL?.classList.toggle('open');
  ham.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      navL?.classList.remove('open');
      ham?.classList.remove('open');
    }
  });
});

const tw = document.getElementById('typewriter');
if (tw) {
  const roles = ['Electronics Enthusiast', 'Embedded Systems Builder', 'Microcontroller Tinkerer', 'Web Developer'];
  let ri = 0, ci = 0, deleting = false;
  const type = () => {
    const word = roles[ri];
    tw.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1400); return; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(type, deleting ? 55 : 95);
  };
  type();
}

const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  if (!preloader) return;
  preloader.classList.add('hide');
  setTimeout(() => preloader.remove(), prefersReducedMotion ? 100 : 700);
});

const rippleTargets = document.querySelectorAll('.btn, .nav-link, .social-icon, .view-btn, .filter-btn, .file-action-btn, .hamburger');
rippleTargets.forEach(el => {
  el.addEventListener('click', e => {
    if (isTouchDevice) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
  let raf;
  const reset = () => { card.style.transform = ''; };
  card.addEventListener('mousemove', e => {
    if (isTouchDevice) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 12;
    const rotX = (0.5 - y) * 12;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
  });
  card.addEventListener('mouseleave', reset);
  card.addEventListener('touchstart', reset, { passive: true });
});

const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  let particles = [];
  const mouse = { x: -9999, y: -9999, active: false };
  const count = isTouchDevice ? 50 : 120;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
    particles = makeParticles(count);
  }
  function makeParticles(n) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.55 + 0.12
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  if (!isTouchDevice) {
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.addEventListener('mouseleave', () => mouse.active = false);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      if (mouse.active && !prefersReducedMotion) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0.001) {
          const force = (140 - dist) / 140;
          p.vx += (dx / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.02;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${p.opacity})`;
      ctx.fill();
    });

    particles.forEach((a, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      const fill = e.target.querySelector('.skill-fill');
      const item = e.target.closest?.('[data-level]') ?? e.target.querySelector('[data-level]');
      if (fill && item) fill.style.width = item.dataset.level + '%';
      const num = e.target.querySelector('.stat-num');
      if (num) animateCount(num);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.section, .skill-item, .about-stats, .project-card').forEach(el => observer.observe(el));

function animateCount(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = +el.dataset.target;
  let current = 0;
  const step = Math.max(1, target / 50);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + '+';
    if (current >= target) clearInterval(timer);
  }, 28);
}

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent!';
  btn.style.background = 'var(--success)';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if (sections.length) {
  const navSpy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      match?.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -45% 0px', threshold: 0.05 });
  sections.forEach(s => navSpy.observe(s));
}
})();
