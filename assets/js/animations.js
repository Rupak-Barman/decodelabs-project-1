/**
 * animations.js — CodeFlow
 *
 * Responsibilities:
 *  - Scroll reveal (Intersection Observer on .reveal elements)
 *  - Staggered card animations
 *  - Stat counter animation
 *  - Hero particle/blob animation
 *  - Respects prefers-reduced-motion
 */

'use strict';

/* ------------------------------------------------------------------
   CHECK USER MOTION PREFERENCE — honour always
   ------------------------------------------------------------------ */

//const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   1. SCROLL REVEAL — Intersection Observer
   ------------------------------------------------------------------ */

function initScrollReveal() {
  if (prefersReducedMotion) {
    // Immediately show everything without animation
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after reveal — each element reveals once
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.12,       // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px',  // slight bottom offset
    }
  );

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el) => revealObserver.observe(el));
}

/* ------------------------------------------------------------------
   2. STAGGERED CARD GRID ANIMATION
   JS assigns data-delay attributes based on DOM order within grids.
   ------------------------------------------------------------------ */

function initStaggeredCards() {
  if (prefersReducedMotion) return;

  const cardGrids = document.querySelectorAll('.card-grid, .work-grid, .grid-3, .grid-4');

  cardGrids.forEach((grid) => {
    const cards = grid.querySelectorAll('.reveal');
    cards.forEach((card, index) => {
      // Limit to 6 stagger levels, then repeat
      const delay = (index % 6) + 1;
      card.setAttribute('data-delay', delay.toString());
    });
  });
}

/* ------------------------------------------------------------------
   3. STAT COUNTER ANIMATION
   Animates number from 0 to target value when stat section enters view.
   ------------------------------------------------------------------ */

function animateCounter(el, targetStr) {
  // Parse number — handles formats like "99%", "10k+", "24/7"
  const hasPercent  = targetStr.includes('%');
  const hasPlus     = targetStr.includes('+');
  const hasK        = targetStr.toLowerCase().includes('k');
  const suffix      = hasPercent ? '%' : hasPlus ? '+' : hasK ? 'k+' : '';
  const target      = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
  const duration    = 1800;  // ms
  const startTime   = performance.now();

  // Easing function: easeOutExpo
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);
    const current  = Math.floor(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(tick);
}

function initStatCounters() {
  if (prefersReducedMotion) return;

  const statValues = document.querySelectorAll('.stat-item__value[data-target]');
  if (statValues.length === 0) return;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-target');
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((el) => counterObserver.observe(el));
}

/* ------------------------------------------------------------------
   4. PARALLAX BLOBS (subtle, performant — transform only)
   ------------------------------------------------------------------ */

function initParallaxBlobs() {
  if (prefersReducedMotion) return;

  const blobs = document.querySelectorAll('.bg-blob');
  if (blobs.length === 0) return;

  let ticking = false;

  function moveBlobs() {
    const scrollY = window.scrollY;

    blobs.forEach((blob, i) => {
      const speed  = (i % 2 === 0) ? 0.08 : 0.05;
      const dir    = i % 2 === 0 ? 1 : -1;
      const offset = scrollY * speed * dir;
      blob.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(moveBlobs);
      ticking = true;
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------
   5. HERO ENTRANCE — verify classes exist, trigger immediately
   The CSS animations are declarative; this just ensures visibility.
   ------------------------------------------------------------------ */

function initHeroEntrance() {
  if (prefersReducedMotion) {
    // Make all hero elements visible without animation
    document.querySelectorAll(
      '.hero-animate-badge, .hero-animate-headline, .hero-animate-sub, ' +
      '.hero-animate-cta, .hero-animate-proof, .hero-animate-media'
    ).forEach((el) => {
      el.style.animationDuration = '0s';
      el.style.animationDelay   = '0s';
    });
  }
  // CSS keyframe animations trigger automatically on load
}

/* ------------------------------------------------------------------
   6. TESTIMONIAL CAROUSEL (Auto-rotate every 5s if multiple exist)
   ------------------------------------------------------------------ */

function initTestimonialRotation() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  if (testimonials.length <= 1) return;
  // Cards are visible in grid — no carousel needed for this implementation.
  // This is a placeholder for future enhancement.
}

/* ------------------------------------------------------------------
   7. RIPPLE EFFECT ON BUTTONS
   ------------------------------------------------------------------ */

function initRippleEffect() {
  if (prefersReducedMotion) return;

  const rippleBtns = document.querySelectorAll('.btn--primary, .btn--accent, .btn--white');

  rippleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect     = btn.getBoundingClientRect();
      const x        = e.clientX - rect.left;
      const y        = e.clientY - rect.top;
      const size     = Math.max(rect.width, rect.height) * 2;

      const ripple   = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = [
        `width: ${size}px`,
        `height: ${size}px`,
        `left: ${x - size / 2}px`,
        `top: ${y - size / 2}px`,
      ].join(';');

      btn.appendChild(ripple);

      // Clean up after animation
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ------------------------------------------------------------------
   8. CARD SHIMMER HOVER (adds class dynamically)
   ------------------------------------------------------------------ */

function initCardShimmer() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.feature-card, .work-card').forEach((card) => {
    card.classList.add('card-shimmer');
  });
}

/* ------------------------------------------------------------------
   INITIALISE ALL
   ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStaggeredCards();
  initStatCounters();
  initParallaxBlobs();
  initHeroEntrance();
  initRippleEffect();
  initCardShimmer();
});
