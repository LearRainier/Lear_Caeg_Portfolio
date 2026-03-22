/* ══════════════════════════════════════════
   EMAIL OBFUSCATION & SECURITY
══════════════════════════════════════════ */
// Decode base64 email (not shown in source)
function getEmail() {
  return atob('bGVhcmNhZWcuY3NAZ21haWwuY29t');
}

// Set up obfuscated email links
document.querySelectorAll('[data-email-obfuscated]').forEach(link => {
  link.href = 'mailto:' + getEmail();
  link.textContent = getEmail();
});

/* ══════════════════════════════════════════
   INPUT VALIDATION & SANITIZATION
══════════════════════════════════════════ */
function sanitizeInput(input) {
  return input.trim().replace(/[<>\"']/g, '');
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateText(text, minLength = 1, maxLength = 1000) {
  return text.trim().length >= minLength && text.trim().length <= maxLength;
}

/* ── NAV SCROLL EFFECT ── */
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const delay = siblings.indexOf(entry.target) * 100;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── SKILL BAR ANIMATION ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('.skill-fill').forEach(bar =>
        setTimeout(() => bar.classList.add('animate'), 250)
      );
  });
}, { threshold: 0.2 });
document.querySelectorAll('#skills').forEach(el => barObserver.observe(el));

/* ── BUTTON SMOOTH PRESS ── */
document.querySelectorAll('button, .btn-hero-primary, .btn-hero-ghost').forEach(btn => {
  btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.98)');
  ['mouseup','mouseleave'].forEach(e => btn.addEventListener(e, () => btn.style.transform = ''));
});

/* ══════════════════════════════════════════
   GMAIL INTEGRATION WITH VALIDATION
   ══════════════════════════════════════════ */
function sendContact(e) {
  e.preventDefault();
  
  const name  = sanitizeInput(document.getElementById('cn').value);
  const email = sanitizeInput(document.getElementById('ce').value);
  const sub   = sanitizeInput(document.getElementById('cs').value);
  const msg   = sanitizeInput(document.getElementById('cm').value);
  
  // Validate inputs
  if (!validateText(name, 2, 100)) {
    alert('Please enter a valid name (2-100 characters)');
    return;
  }
  if (!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }
  if (!validateText(sub, 3, 100)) {
    alert('Please enter a valid subject (3-100 characters)');
    return;
  }
  if (!validateText(msg, 10, 2000)) {
    alert('Please enter a message (10-2000 characters)');
    return;
  }
  
  const MY_EMAIL = getEmail();
  const encodedSub = encodeURIComponent(sub);
  const encodedBody = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${msg}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${MY_EMAIL}&su=${encodedSub}&body=${encodedBody}`, '_blank');
}

function sendHire(e) {
  e.preventDefault();
  
  const name  = sanitizeInput(document.getElementById('hn').value);
  const email = sanitizeInput(document.getElementById('he').value);
  const svc   = sanitizeInput(document.getElementById('hs').value);
  const msg   = sanitizeInput(document.getElementById('hm').value);
  
  // Validate inputs
  if (!validateText(name, 2, 100)) {
    alert('Please enter a valid name (2-100 characters)');
    return;
  }
  if (!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }
  if (!validateText(svc, 3, 100)) {
    alert('Please select or specify a service');
    return;
  }
  if (!validateText(msg, 10, 2000)) {
    alert('Please enter project details (10-2000 characters)');
    return;
  }
  
  const MY_EMAIL = getEmail();
  const encodedSub = encodeURIComponent(`[HIRE REQUEST] ${svc} — from ${name}`);
  const encodedBody = encodeURIComponent(`HIRE REQUEST\n\nName: ${name}\nEmail: ${email}\nService: ${svc}\n\nProject Details:\n${msg}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${MY_EMAIL}&su=${encodedSub}&body=${encodedBody}`, '_blank');
  
  // Close modal after submission
  document.getElementById('hireModal').classList.remove('open');
}

/* ══════════════════════════════════════════
   MODAL & EVENT HANDLING
══════════════════════════════════════════ */
// Open/close hire modal
document.querySelectorAll('[data-action="open-hire-modal"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('hireModal').classList.add('open');
  });
});

document.querySelectorAll('[data-action="close-hire-modal"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('hireModal').classList.remove('open');
  });
});

// Close modal when clicking backdrop
document.querySelector('[data-action="close-hire-modal-backdrop"]').addEventListener('click', (e) => {
  if (e.target.id === 'hireModal') {
    e.target.classList.remove('open');
  }
});

/* ══════════════════════════════════════════
   GALLERY CAROUSEL
══════════════════════════════════════════ */
class GalleryCarousel {
  constructor() {
    this.track = document.querySelector('.carousel-track');
    this.items = document.querySelectorAll('.carousel-item');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.carousel-prev');
    this.nextBtn = document.querySelector('.carousel-next');
    this.currentIndex = 0;
    this.itemCount = this.items.length;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds

    this.init();
  }

  init() {
    // Event listeners for navigation buttons
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

    // Event listeners for indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Start auto-play
    this.startAutoPlay();

    // Pause auto-play on hover
    if (this.track && this.track.parentElement) {
      this.track.parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.track.parentElement.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Initialize first slide
    this.updateCarousel();
  }

  updateCarousel() {
    // Update track position
    const offset = -this.currentIndex * 100;
    if (this.track) {
      this.track.style.transform = `translateX(${offset}%)`;
    }

    // Update active item
    this.items.forEach((item, index) => {
      item.classList.toggle('active', index === this.currentIndex);
    });

    // Update active indicator
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.itemCount;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.itemCount) % this.itemCount;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GalleryCarousel();
  });
} else {
  new GalleryCarousel();
}