/**
 * navigation.js — CodeFlow
 *
 * Responsibilities:
 *  - Mobile nav toggle (hamburger ↔ close)
 *  - Close nav on outside click or Escape key
 *  - Smooth scroll to anchor sections
 *  - Active nav link highlight via Intersection Observer
 *  - Sticky header background change on scroll
 *  - Scroll progress indicator
 */

'use strict';

/* ------------------------------------------------------------------
   CONSTANTS
   ------------------------------------------------------------------ */

const NAV_SCROLL_THRESHOLD = 80;   // px before header gains background
const ACTIVE_NAV_THRESHOLD = 0.45; // ratio of section in viewport to mark active

/* ------------------------------------------------------------------
   ELEMENT REFS — queried once, reused
   ------------------------------------------------------------------ */

const siteHeader      = document.getElementById('site-header');
const hamburgerBtn    = document.getElementById('nav-hamburger');
const mobileMenu      = document.getElementById('nav-mobile-menu');
const mobileNavLinks  = document.querySelectorAll('.nav__mobile-links a');
const desktopNavLinks = document.querySelectorAll('.nav__links a');
const allNavLinks     = document.querySelectorAll('[data-nav-link]');
const scrollProgress  = document.getElementById('scroll-progress');

/* ------------------------------------------------------------------
   1. MOBILE NAV TOGGLE
   ------------------------------------------------------------------ */

function openMobileNav() {
  if (!hamburgerBtn || !mobileMenu) return;

  hamburgerBtn.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('is-open');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Move focus to first link in mobile menu
  const firstLink = mobileMenu.querySelector('a');
  if (firstLink) firstLink.focus();
}

function closeMobileNav() {
  if (!hamburgerBtn || !mobileMenu) return;

  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
  document.body.style.overflow = '';

  // Return focus to hamburger button
  hamburgerBtn.focus();
}

function toggleMobileNav() {
  const isOpen = hamburgerBtn?.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', toggleMobileNav);
}

/* ------------------------------------------------------------------
   2. CLOSE NAV ON OUTSIDE CLICK
   ------------------------------------------------------------------ */

document.addEventListener('click', (e) => {
  if (!mobileMenu || !hamburgerBtn) return;

  const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  if (!isOpen) return;

  const clickedInsideMenu   = mobileMenu.contains(e.target);
  const clickedHamburger    = hamburgerBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedHamburger) {
    closeMobileNav();
  }
});

/* ------------------------------------------------------------------
   3. CLOSE NAV ON ESCAPE KEY
   ------------------------------------------------------------------ */

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const isOpen = hamburgerBtn?.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMobileNav();
  }
});

/* ------------------------------------------------------------------
   4. CLOSE NAV WHEN A LINK IS CLICKED (mobile)
   ------------------------------------------------------------------ */

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

/* ------------------------------------------------------------------
   5. SMOOTH SCROLL TO ANCHOR SECTIONS
   ------------------------------------------------------------------ */

function smoothScrollToSection(e) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();

  const navH   = siteHeader ? siteHeader.offsetHeight : 0;
  const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;

  window.scrollTo({ top, behavior: 'smooth' });
}

// Attach to both desktop and mobile links
allNavLinks.forEach((link) => {
  link.addEventListener('click', smoothScrollToSection);
});

// Also catch any other in-page anchor links not in nav
document.querySelectorAll('a[href^="#"]:not([data-nav-link])').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href   = link.getAttribute('href');
    if (href === '#') return; // ignore empty hash

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navH = siteHeader ? siteHeader.offsetHeight : 0;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ------------------------------------------------------------------
   6. HEADER SCROLL STATE (transparent → solid)
   ------------------------------------------------------------------ */

function updateHeaderState() {
  if (!siteHeader) return;
  if (window.scrollY > NAV_SCROLL_THRESHOLD) {
    siteHeader.classList.add('is-scrolled');
  } else {
    siteHeader.classList.remove('is-scrolled');
  }
}

/* ------------------------------------------------------------------
   7. SCROLL PROGRESS INDICATOR
   ------------------------------------------------------------------ */

function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const progress     = docHeight > 0 ? scrollTop / docHeight : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
}

/* ------------------------------------------------------------------
   8. ACTIVE NAV LINK — Intersection Observer
   ------------------------------------------------------------------ */

const sections = document.querySelectorAll('main section[id]');

function setActiveNavLink(sectionId) {
  allNavLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('is-active');
    }
  });
}

if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: `-${NAV_SCROLL_THRESHOLD}px 0px -${Math.floor(window.innerHeight * (1 - ACTIVE_NAV_THRESHOLD))}px 0px`,
      threshold:  0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ------------------------------------------------------------------
   9. COMBINED SCROLL HANDLER (throttled with rAF)
   ------------------------------------------------------------------ */

let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateHeaderState();
      updateScrollProgress();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// Run once on load to set initial state
updateHeaderState();
updateScrollProgress();
