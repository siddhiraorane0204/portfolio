// =========================================================
// Scroll progress bar
// =========================================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// =========================================================
// Hero cursor spotlight
// =========================================================
const heroEl = document.getElementById('home');
const spotlight = document.getElementById('heroSpotlight');

if (heroEl && spotlight && window.matchMedia('(hover: hover)').matches) {
  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty('--x', `${x}%`);
    spotlight.style.setProperty('--y', `${y}%`);
  });
}

// =========================================================
// Project card 3D tilt
// =========================================================
const tiltCards = document.querySelectorAll('.project-card');

if (window.matchMedia('(hover: hover)').matches) {
  tiltCards.forEach(card => {
    const strength = 10; // max degrees of tilt

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0 -> 1
      const py = (e.clientY - rect.top) / rect.height;  // 0 -> 1
      const rotateY = (px - 0.5) * strength;
      const rotateX = (0.5 - py) * strength;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// =========================================================
// Footer year
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// Mobile nav toggle
// =========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});

// Close mobile menu after clicking a link
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

// =========================================================
// Active nav link on scroll
// =========================================================
const sections = document.querySelectorAll('main section[id], .hero[id]');
const navLinkEls = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(sec => navObserver.observe(sec));

// =========================================================
// Typing effect for role text
// =========================================================
const roles = ['Web Developer', 'UI/UX Designer'];
const typeTarget = document.getElementById('typeTarget');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typeTarget.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typeTarget.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

// =========================================================
// Scroll reveal animation
// =========================================================
const revealTargets = document.querySelectorAll(
  '.section__eyebrow, .section__title, .section__lead, .about__grid, .skill-card, .project-card, .timeline__item, .cert-card, .contact__grid'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// =========================================================
// Back to top
// =========================================================
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// Contact form — validation + EmailJS sending
// =========================================================

// ---- EmailJS config: replace these 3 values with your own ----
const EMAILJS_PUBLIC_KEY = 'I5Eh_3vdxZr3T4lLJ';   // from EmailJS Account > General
const EMAILJS_SERVICE_ID = 'service_55hbmsr';   // from EmailJS Email Services
const EMAILJS_TEMPLATE_ID = 'template_gp4lv8g'; // from EmailJS Email Templates
// ----------------------------------------------------------------

emailjs.init(EMAILJS_PUBLIC_KEY);

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function setError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  document.getElementById(errorId).textContent = message;
  field.closest('.field').classList.toggle('has-error', Boolean(message));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (name.length < 2) {
    setError('name', 'nameError', 'Please enter your name.');
    valid = false;
  } else {
    setError('name', 'nameError', '');
  }

  if (!emailPattern.test(email)) {
    setError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError('email', 'emailError', '');
  }

  if (message.length < 10) {
    setError('message', 'messageError', 'Message should be at least 10 characters.');
    valid = false;
  } else {
    setError('message', 'messageError', '');
  }

  if (!valid) {
    status.textContent = '';
    return;
  }

  status.textContent = 'Sending...';

  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      status.textContent = `Thanks, ${name}! Your message has been sent — I'll get back to you soon.`;
      form.reset();
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      status.textContent = 'Something went wrong. Please email me directly at ssraorane02@gmail.com.';
    });
});