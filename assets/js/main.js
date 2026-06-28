/**
 * main.js — CodeFlow
 * Application entry point. Bootstraps all modules.
 * Modules: navigation.js, animations.js, form.js (loaded via defer in HTML)
 */

'use strict';

/* ------------------------------------------------------------------
   UTILITY: Check for reduced motion preference
   ------------------------------------------------------------------ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   1. GLOBAL: Set CSS custom property for viewport height
   Fixes 100vh issues on mobile browsers (address bar shifts)
   ------------------------------------------------------------------ */

function setViewportHeightVar() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeightVar();

// Debounced resize handler
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setViewportHeightVar, 150);
});

/* ------------------------------------------------------------------
   2. THEME: Detect system color scheme and apply data attribute
   ------------------------------------------------------------------ */

function applySystemTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

applySystemTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);

/* ------------------------------------------------------------------
   3. LAZY LOAD: Native lazy loading for images with fallback check
   ------------------------------------------------------------------ */

function initLazyImages() {
  // Add loading="lazy" to any images not inside hero (which should load eagerly)
  const images = document.querySelectorAll('img:not([loading]):not(.hero-eager)');
  images.forEach((img) => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
}

/* ------------------------------------------------------------------
   4. KEYBOARD FOCUS MANAGEMENT: Add .using-keyboard when Tab is pressed
   Removes when mouse is used — prevents focus rings from showing on click.
   ------------------------------------------------------------------ */

function initFocusManagement() {
  let usingKeyboard = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (!usingKeyboard) {
        usingKeyboard = true;
        document.body.classList.add('using-keyboard');
      }
    }
  });

  document.addEventListener('mousedown', () => {
    if (usingKeyboard) {
      usingKeyboard = false;
      document.body.classList.remove('using-keyboard');
    }
  });
}

/* ------------------------------------------------------------------
   5. PRINT: Expand mobile nav on print (restore collapsed items)
   ------------------------------------------------------------------ */

window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.nav__mobile-menu').forEach((el) => {
    el.style.display = 'block';
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('.nav__mobile-menu').forEach((el) => {
    el.style.display = '';
  });
});

/* ------------------------------------------------------------------
   6. EXTERNAL LINKS: Open in new tab + add rel attributes
   ------------------------------------------------------------------ */

function initExternalLinks() {
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
    if (isExternal) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel',    'noopener noreferrer');

      // Add screen reader text indicating link opens in new tab
      if (!link.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.classList.add('sr-only');
        srText.textContent = ' (opens in new tab)';
        link.appendChild(srText);
      }
    }
  });
}

/* ------------------------------------------------------------------
   7. PERFORMANCE: Preconnect hints for Google Fonts (dynamic, if missing)
   ------------------------------------------------------------------ */

function ensurePreconnects() {
  const origins = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
  origins.forEach((origin) => {
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement('link');
      link.rel  = 'preconnect';
      link.href = origin;
      if (origin.includes('gstatic')) link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
}

/* ------------------------------------------------------------------
   8. CURRENT YEAR in footer copyright
   ------------------------------------------------------------------ */

function updateCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ------------------------------------------------------------------
   INIT — all on DOMContentLoaded
   ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  initLazyImages();
  initFocusManagement();
  initExternalLinks();
  ensurePreconnects();
  updateCopyrightYear();

  // Console signature
  if (typeof console !== 'undefined') {
    console.info(
      '%c⚡ CodeFlow %cv1.0.0',
      'font-weight:bold;font-size:1.2rem;color:#A5856F;',
      'font-size:0.85rem;color:#5BABB9;'
    );
    console.info('Built with ♥ for DecodeLabs — Project 1');
  }
});
