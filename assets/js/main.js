// ========== Mobile Nav Toggle ==========
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ========== Footer Year ==========
document.getElementById('year').textContent = new Date().getFullYear();

// ========== Scroll Reveal ==========
const revealTargets = document.querySelectorAll(
  '.service-card, .hospital-card, .why-card, .timeline-item, .faq-item, .about-media, .about-text, h2.center, .blog-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// ========== Header Scroll State ==========
const siteHeader = document.getElementById('header');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
});

// ========== Back to Top ==========
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ========== Stat Counter Animation ==========
const statNumbers = document.querySelectorAll('.stat-number');
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ========== Contact Form (submits to Formspree once activated, see HTML comment) ==========
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const note = document.getElementById('contactNote');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  note.style.color = '';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (response.ok) {
      note.textContent = 'Thank you! Your message has been sent — we will get back to you soon.';
      contactForm.reset();
    } else {
      throw new Error('Form endpoint not active yet');
    }
  } catch (err) {
    // Formspree isn't configured yet — auto-open a pre-filled draft in the visitor's own email app instead.
    const name = contactForm.name.value.trim();
    const phone = contactForm.phone.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const subject = encodeURIComponent('New website enquiry - Dr. Vamseedhar Konati site');
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message || 'Not provided'}`
    );
    window.location.href = `mailto:vamseedharkonati@gmail.com?subject=${subject}&body=${body}`;
    note.style.color = '#c0392b';
    note.textContent = 'Opening your email app with your message pre-filled — just hit Send! (If nothing opens, use the link below or call us.)';
  } finally {
    submitBtn.disabled = false;
  }
});

// ========== FAQ Accordion ==========
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ========== Custom Medical Cursor ==========
// Only on real mouse/trackpad devices — leave touchscreens with their native behavior.
if (window.matchMedia('(pointer: fine)').matches) {
  const ring = document.createElement('div');
  ring.className = 'custom-cursor';
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const icon = document.createElement('div');
  icon.className = 'custom-cursor-icon';
  // A different medical icon is picked at random on each page load/reload.
  const cursorIcons = ['🩺', '💊', '💉', '🌡️', '🧬'];
  icon.textContent = cursorIcons[Math.floor(Math.random() * cursorIcons.length)];
  document.body.append(ring, dot, icon);
  document.documentElement.classList.add('has-custom-cursor');

  const moveCursor = (x, y) => {
    ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)${ring.classList.contains('is-clicking') ? ' scale(0.65)' : ''}`;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    icon.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };

  document.addEventListener('mousemove', (e) => moveCursor(e.clientX, e.clientY));

  const hoverTargets = 'a, button, .btn, [role="button"], input, textarea, select, .faq-question';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('is-hovering');
  });

  // Tablet "press" pulse: shrink on press, spring back on release
  document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('is-clicking'));

  // Gentle expand while the page is scrolling, settles back when scrolling stops
  let scrollTimer;
  window.addEventListener('scroll', () => {
    ring.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => ring.classList.remove('is-scrolling'), 250);
  }, { passive: true });

  document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; icon.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = ''; dot.style.opacity = ''; icon.style.opacity = ''; });
}

