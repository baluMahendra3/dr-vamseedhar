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

// ========== Dynamic Reviews (read + write via a Google Apps Script bridge to a Drive JSON file) ==========
// Direct Drive links require a Google sign-in for fetch(), so a small Apps Script Web App
// is used instead as a free "backend" that reads/writes the JSON file on your behalf.
// See research/reviews-apps-script.gs for the script to deploy, and paste its Web App URL below.
// Leave empty to keep the static sample reviews and disable the "Post Review" form.
const REVIEWS_API_URL = 'https://script.google.com/macros/s/AKfycbyP9epljIyMS1jtj9EImBIvA0vvnJAKdbLo7fMK7AUl4fNp0oCcJVZY3sR6ugvB-WaeBA/exec';
const reviewsList = document.getElementById('reviewsList');
const reviewForm = document.getElementById('reviewForm');
// Escapes review content before inserting it, since it comes from an external file we don't fully control.
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
// Caps the rendered list and drops test/spam-looking entries so the section stays fast and presentable as it grows.
const MAX_REVIEWS_SHOWN = 9;
const MIN_REVIEW_TEXT_LENGTH = 15;
const isLowQualityReview = (r) => {
  const text = String(r.text || '').trim();
  const name = String(r.name || '').trim();
  if (text.length < MIN_REVIEW_TEXT_LENGTH) return true;
  const junkPattern = /qa test|please delete|test review|automated|end-to-end test/i;
  if (junkPattern.test(text) || junkPattern.test(name)) return true;
  if (/^test$/i.test(name)) return true;
  return false;
};
// ========== Reviews admin: lets the site owner hide spam or permanently delete a review ==========
const REVIEWS_ADMIN_KEY_STORAGE = 'reviewsAdminKey';
const getReviewsAdminKey = () => sessionStorage.getItem(REVIEWS_ADMIN_KEY_STORAGE) || '';
const isReviewsAdmin = () => !!getReviewsAdminKey();
const moderateReview = (id, action) => fetch(REVIEWS_API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ action, id, adminKey: getReviewsAdminKey() })
}).then(res => res.json());
const wireReviewAdminButtons = (container, onDone) => {
  if (!container) return;
  container.querySelectorAll('.review-flag-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const { id, action } = btn.dataset;
      const confirmMsg = action === 'delete'
        ? 'Permanently delete this review? This cannot be undone.'
        : 'Hide this review as spam? It will disappear from the site.';
      if (!window.confirm(confirmMsg)) return;
      btn.disabled = true;
      try {
        const result = await moderateReview(id, action);
        if (result && result.success) onDone();
        else alert('Action failed: ' + (result && result.error ? result.error : 'check your admin key.'));
      } catch (err) {
        alert('Action failed. Please try again.');
      } finally {
        btn.disabled = false;
      }
    });
  });
};
const reviewsAdminToggleBtn = document.getElementById('reviewsAdminToggle');
if (reviewsAdminToggleBtn) {
  reviewsAdminToggleBtn.addEventListener('click', () => {
    if (isReviewsAdmin()) {
      sessionStorage.removeItem(REVIEWS_ADMIN_KEY_STORAGE);
    } else {
      const key = window.prompt('Enter the admin key to manage reviews:');
      if (!key) return;
      sessionStorage.setItem(REVIEWS_ADMIN_KEY_STORAGE, key);
    }
    reviewsAdminToggleBtn.classList.toggle('active', isReviewsAdmin());
    loadReviews();
  });
  reviewsAdminToggleBtn.classList.toggle('active', isReviewsAdmin());
}
const reviewsSummaryEl = document.getElementById('reviewsRatingSummary');
const renderReviewsSummary = (curated) => {
  if (!reviewsSummaryEl) return;
  if (!curated.length) { reviewsSummaryEl.hidden = true; return; }
  const avg = curated.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / curated.length;
  const rounded = Math.round(avg * 10) / 10;
  const fullStars = Math.round(avg);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  reviewsSummaryEl.innerHTML =
    `<strong>${rounded.toFixed(1)}</strong> out of 5 <span class="reviews-rating-stars">${stars}</span> ` +
    `<span class="reviews-rating-count">based on ${curated.length} review${curated.length === 1 ? '' : 's'}</span>`;
  reviewsSummaryEl.hidden = false;
};
const renderReviews = (reviews) => {
  if (!reviewsList || !Array.isArray(reviews)) return;
  const curated = reviews.filter(r => !isLowQualityReview(r));
  renderReviewsSummary(curated);
  if (curated.length === 0) return;
  const admin = isReviewsAdmin();
  const shown = curated.slice(0, MAX_REVIEWS_SHOWN);
  reviewsList.innerHTML = shown.map(r => {
    const rating = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 5)));
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const adminActions = admin ? `
        <div class="review-admin-actions">
          <button type="button" class="review-flag-btn" data-action="spam" data-id="${escapeHtml(r.id || '')}">🚩 Spam</button>
          <button type="button" class="review-flag-btn review-flag-delete" data-action="delete" data-id="${escapeHtml(r.id || '')}">🗑 Delete</button>
        </div>` : '';
    return `
      <div class="review-card">
        <div class="stars">${stars}</div>
        <h4>${escapeHtml(r.name || 'Anonymous Patient')}</h4>
        <p class="review-text">${escapeHtml(r.text || '')}</p>
        ${adminActions}
      </div>`;
  }).join('');
  const moreWrap = document.getElementById('reviewsMoreWrap');
  if (moreWrap) moreWrap.hidden = curated.length <= MAX_REVIEWS_SHOWN;
  wireReviewAdminButtons(reviewsList, loadReviews);
  initReviewsSlider();
};
const loadReviews = () => {
  if (!reviewsList || !REVIEWS_API_URL) return;
  const url = isReviewsAdmin() ? `${REVIEWS_API_URL}?adminKey=${encodeURIComponent(getReviewsAdminKey())}` : REVIEWS_API_URL;
  fetch(url)
    .then(res => res.json())
    .then(renderReviews)
    .catch(() => { /* fetch failed — keep the static sample reviews already in the HTML */ });
};

// ========== Reviews carousel: auto-advances, with arrows/dots, re-initialized whenever the cards change ==========
let reviewsSliderTimer = null;
let reviewsSliderIndex = 0;
const reviewsSliderEl = document.getElementById('reviewsSlider');
const reviewsDotsEl = document.getElementById('reviewsDots');
const reviewsPrevBtn = document.getElementById('reviewsPrev');
const reviewsNextBtn = document.getElementById('reviewsNext');
const getReviewsVisibleCount = () => {
  const width = window.innerWidth;
  if (width <= 720) return 1;
  if (width <= 960) return 2;
  return 3;
};
const applyReviewsSliderPosition = () => {
  const cards = reviewsList ? reviewsList.querySelectorAll('.review-card') : [];
  if (!cards.length) return;
  const visible = Math.min(getReviewsVisibleCount(), cards.length);
  const maxIndex = Math.max(0, cards.length - visible);
  reviewsSliderIndex = Math.max(0, Math.min(reviewsSliderIndex, maxIndex));
  reviewsList.style.transform = `translateX(-${reviewsSliderIndex * (100 / visible)}%)`;
  if (reviewsDotsEl) {
    reviewsDotsEl.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === reviewsSliderIndex);
    });
  }
  const atStart = reviewsSliderIndex === 0;
  const atEnd = reviewsSliderIndex >= maxIndex;
  if (reviewsPrevBtn) reviewsPrevBtn.hidden = maxIndex === 0;
  if (reviewsNextBtn) reviewsNextBtn.hidden = maxIndex === 0;
  if (reviewsPrevBtn) reviewsPrevBtn.disabled = atStart && maxIndex === 0;
  if (reviewsNextBtn) reviewsNextBtn.disabled = atEnd && maxIndex === 0;
};
const goToReviewsSlide = (index) => {
  const cards = reviewsList ? reviewsList.querySelectorAll('.review-card') : [];
  const visible = Math.min(getReviewsVisibleCount(), cards.length);
  const maxIndex = Math.max(0, cards.length - visible);
  reviewsSliderIndex = ((index % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
  applyReviewsSliderPosition();
};
const startReviewsAutoplay = () => {
  clearInterval(reviewsSliderTimer);
  const cards = reviewsList ? reviewsList.querySelectorAll('.review-card') : [];
  const visible = Math.min(getReviewsVisibleCount(), cards.length);
  if (cards.length <= visible) return; // nothing to slide to
  reviewsSliderTimer = setInterval(() => goToReviewsSlide(reviewsSliderIndex + 1), 4500);
};
const rebuildReviewsDots = () => {
  if (!reviewsDotsEl || !reviewsList) return;
  const cards = reviewsList.querySelectorAll('.review-card');
  const visible = Math.min(getReviewsVisibleCount(), cards.length);
  const maxIndex = Math.max(0, cards.length - visible);
  reviewsDotsEl.hidden = maxIndex === 0;
  reviewsDotsEl.innerHTML = Array.from({ length: maxIndex + 1 }, (_, i) =>
    `<button type="button" class="slider-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i + 1}" data-index="${i}"></button>`
  ).join('');
  reviewsDotsEl.querySelectorAll('.slider-dot').forEach(dot => {
    dot.addEventListener('click', () => { goToReviewsSlide(Number(dot.dataset.index)); startReviewsAutoplay(); });
  });
};
const initReviewsSlider = () => {
  if (!reviewsList || !reviewsSliderEl) return;
  reviewsSliderIndex = 0;
  rebuildReviewsDots();
  applyReviewsSliderPosition();
  startReviewsAutoplay();
};
if (reviewsPrevBtn) reviewsPrevBtn.addEventListener('click', () => { goToReviewsSlide(reviewsSliderIndex - 1); startReviewsAutoplay(); });
if (reviewsNextBtn) reviewsNextBtn.addEventListener('click', () => { goToReviewsSlide(reviewsSliderIndex + 1); startReviewsAutoplay(); });
if (reviewsSliderEl) {
  reviewsSliderEl.addEventListener('mouseenter', () => clearInterval(reviewsSliderTimer));
  reviewsSliderEl.addEventListener('mouseleave', () => startReviewsAutoplay());
  // Left/right arrow keys move the slide when it (or a control inside it) has focus.
  reviewsSliderEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goToReviewsSlide(reviewsSliderIndex - 1); startReviewsAutoplay(); }
    else if (e.key === 'ArrowRight') { goToReviewsSlide(reviewsSliderIndex + 1); startReviewsAutoplay(); }
  });
  // Touch swipe support for mobile, since arrows are small targets on a touchscreen.
  let touchStartX = null;
  reviewsSliderEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(reviewsSliderTimer);
  }, { passive: true });
  reviewsSliderEl.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const SWIPE_THRESHOLD = 40;
    if (deltaX > SWIPE_THRESHOLD) goToReviewsSlide(reviewsSliderIndex - 1);
    else if (deltaX < -SWIPE_THRESHOLD) goToReviewsSlide(reviewsSliderIndex + 1);
    touchStartX = null;
    startReviewsAutoplay();
  });
}
// Debounced so the dot count/visible-card count stays correct after a breakpoint change, not just the scroll position.
let reviewsResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(reviewsResizeTimer);
  reviewsResizeTimer = setTimeout(() => {
    if (!reviewsList) return;
    rebuildReviewsDots();
    applyReviewsSliderPosition();
    startReviewsAutoplay();
  }, 150);
});

initReviewsSlider();
loadReviews();

// ========== Generic carousel factory, reused for Expertise/Recognition/Gallery/Health Tips (static content, no reload needed) ==========
const createCarousel = (sliderId, trackId, prevId, nextId, dotsId, autoplayMs = 5000) => {
  const sliderEl = document.getElementById(sliderId);
  const trackEl = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsEl = document.getElementById(dotsId);
  if (!sliderEl || !trackEl) return;
  let index = 0;
  let timer = null;
  const getVisible = () => {
    const n = trackEl.children.length;
    const v = window.innerWidth <= 720 ? 1 : window.innerWidth <= 960 ? 2 : 3;
    return Math.min(v, n || 1);
  };
  const getMaxIndex = () => Math.max(0, trackEl.children.length - getVisible());
  const apply = () => {
    if (!trackEl.children.length) return;
    const visible = getVisible();
    const maxIndex = getMaxIndex();
    index = Math.max(0, Math.min(index, maxIndex));
    trackEl.style.transform = `translateX(-${index * (100 / visible)}%)`;
    if (dotsEl) dotsEl.querySelectorAll('.slider-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (prevBtn) prevBtn.hidden = maxIndex === 0;
    if (nextBtn) nextBtn.hidden = maxIndex === 0;
  };
  const goTo = (i) => {
    const maxIndex = getMaxIndex();
    index = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
    apply();
  };
  const startAutoplay = () => {
    clearInterval(timer);
    if (trackEl.children.length <= getVisible()) return;
    timer = setInterval(() => goTo(index + 1), autoplayMs);
  };
  const rebuildDots = () => {
    if (!dotsEl) return;
    const maxIndex = getMaxIndex();
    dotsEl.hidden = maxIndex === 0;
    dotsEl.innerHTML = Array.from({ length: maxIndex + 1 }, (_, i) =>
      `<button type="button" class="slider-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i + 1}" data-index="${i}"></button>`
    ).join('');
    dotsEl.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAutoplay(); });
    });
  };
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); startAutoplay(); });
  sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
  sliderEl.addEventListener('mouseleave', () => startAutoplay());
  sliderEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(index - 1); startAutoplay(); }
    else if (e.key === 'ArrowRight') { goTo(index + 1); startAutoplay(); }
  });
  let touchStartX = null;
  sliderEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  sliderEl.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 40) goTo(index - 1);
    else if (deltaX < -40) goTo(index + 1);
    touchStartX = null;
    startAutoplay();
  });
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { rebuildDots(); apply(); startAutoplay(); }, 150);
  });
  rebuildDots();
  apply();
  startAutoplay();
};
createCarousel('expertiseCarousel', 'expertiseTrack', 'expertisePrev', 'expertiseNext', 'expertiseDots', 5000);
createCarousel('recognitionCarousel', 'recognitionTrack', 'recognitionPrev', 'recognitionNext', 'recognitionDots', 6000);
createCarousel('galleryCarousel', 'galleryTrack', 'galleryPrev', 'galleryNext', 'galleryDots', 5500);
createCarousel('healthTipsCarousel', 'healthTipsTrack', 'healthTipsPrev', 'healthTipsNext', 'healthTipsDots', 6500);

// ========== Review submission form: lets visitors post a review (name, star rating, comment) ==========
if (reviewForm) {
  const starButtons = reviewForm.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRating');
  const formNote = document.getElementById('reviewFormNote');
  const submitBtn = document.getElementById('reviewSubmitBtn');
  const highlightStars = (value) => {
    starButtons.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.value) <= value));
  };
  highlightStars(Number(ratingInput.value) || 5);
  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      ratingInput.value = btn.dataset.value;
      highlightStars(Number(btn.dataset.value));
    });
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      btn.addEventListener('mouseenter', () => highlightStars(Number(btn.dataset.value)));
      btn.addEventListener('mouseleave', () => highlightStars(Number(ratingInput.value)));
    }
  });

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const rating = Number(ratingInput.value) || 5;
    if (!REVIEWS_API_URL) {
      formNote.style.color = '#c0392b';
      formNote.textContent = 'Review submissions aren\u2019t connected yet \u2014 please check back soon.';
      return;
    }
    submitBtn.disabled = true;
    formNote.style.color = 'var(--color-muted)';
    formNote.textContent = 'Posting your review\u2026';
    try {
      // text/plain avoids a CORS preflight that Apps Script Web Apps don't handle well
      await fetch(REVIEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, rating, text })
      });
      formNote.style.color = 'var(--color-primary)';
      formNote.textContent = 'Thank you! Your review has been posted.';
      reviewForm.reset();
      highlightStars(5);
      loadReviews();
    } catch (err) {
      formNote.style.color = '#c0392b';
      formNote.textContent = 'Something went wrong. Please try again later.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}


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

// ========== Scrollspy: highlight the nav link for the section in view ==========
const navLinks = Array.from(mainNav.querySelectorAll('a[href^="#"]'));
const spySections = navLinks
  .map(link => document.getElementById(link.getAttribute('href').slice(1)))
  .filter(Boolean);
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = mainNav.querySelector(`a[href="#${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
spySections.forEach(section => spyObserver.observe(section));

// ========== Back to Top ==========
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ========== Scroll Progress Bar ==========
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = `${pct}%`;
}, { passive: true });

// ========== Scroll Hint: fade out once the visitor starts scrolling ==========
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.classList.toggle('is-hidden', window.scrollY > 80);
  }, { passive: true });
}

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
  const cursorIcons = ['🩺', '💊', '💉', '🌡️', '🧬', '🏥', '❤️', '🩹', '🧪', '⚕️', '🦴', '🧠'];
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

