/**
 * modal.js — CodeFlow
 *
 * Handles:
 *  - Sign In modal open / close (×, Escape, backdrop click)
 *  - Sign In form validation
 *  - Password show/hide toggle
 *  - "Start free trial" link → close modal + scroll to #pricing
 *  - Pricing toggle (Monthly ↔ Annual)
 *  - Pricing CTA → pre-select plan in contact form heading/placeholder
 */

'use strict';

/* ------------------------------------------------------------------
   SIGN IN MODAL
   ------------------------------------------------------------------ */

const signinModal    = document.getElementById('signin-modal');
const signinBtn      = document.getElementById('nav-signin-btn');
const mobileSigninBtn = document.getElementById('mobile-signin-btn');
const signinCloseBtn = document.getElementById('signin-modal-close');
const signinToTrial  = document.getElementById('signin-to-trial');
const togglePassword = document.getElementById('toggle-password');
const signinPassword = document.getElementById('signin-password');

function openSigninModal() {
  if (!signinModal) return;
  signinModal.showModal();
  // Focus first input for keyboard users
  const firstInput = signinModal.querySelector('input');
  if (firstInput) firstInput.focus();
}

function closeSigninModal() {
  if (!signinModal) return;
  signinModal.close();
  // Return focus to trigger button for accessibility
  if (signinBtn) signinBtn.focus();
}

if (signinBtn) {
  signinBtn.addEventListener('click', openSigninModal);
}

if (mobileSigninBtn) {
  mobileSigninBtn.addEventListener('click', openSigninModal);
}

if (signinCloseBtn) {
  signinCloseBtn.addEventListener('click', closeSigninModal);
}

// Close on backdrop click (click is outside the dialog card)
if (signinModal) {
  signinModal.addEventListener('click', (e) => {
    const rect = signinModal.getBoundingClientRect();
    const clickedBackdrop = (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top  ||
      e.clientY > rect.bottom
    );
    if (clickedBackdrop) closeSigninModal();
  });
}

// "Don't have an account? Start free trial →" — close modal then scroll to #pricing
if (signinToTrial) {
  signinToTrial.addEventListener('click', (e) => {
    e.preventDefault();
    closeSigninModal();
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        const navH = document.getElementById('site-header')?.offsetHeight ?? 72;
        const top  = pricingSection.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 120);
  });
}

// Password show / hide toggle
if (togglePassword && signinPassword) {
  togglePassword.addEventListener('click', () => {
    const isHidden = signinPassword.type === 'password';
    signinPassword.type = isHidden ? 'text' : 'password';
    togglePassword.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
}

// Sign In form — basic validation + simulated submit
const signinForm = document.getElementById('signin-form');

if (signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput    = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-password');
    const emailErr      = document.getElementById('signin-error-email');
    const passwordErr   = document.getElementById('signin-error-password');
    let valid           = true;

    // Email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailInput?.value || !emailRe.test(emailInput.value.trim())) {
      if (emailErr)  emailErr.textContent = 'Please enter a valid email address.';
      emailInput?.classList.add('is-error');
      valid = false;
    } else {
      if (emailErr)  emailErr.textContent = '';
      emailInput?.classList.remove('is-error');
    }

    // Password validation
    if (!passwordInput?.value || passwordInput.value.length < 8) {
      if (passwordErr) passwordErr.textContent = 'Password must be at least 8 characters.';
      passwordInput?.classList.add('is-error');
      valid = false;
    } else {
      if (passwordErr) passwordErr.textContent = '';
      passwordInput?.classList.remove('is-error');
    }

    if (!valid) {
      // Focus first invalid field
      signinForm.querySelector('[aria-invalid="true"], .is-error')?.focus();
      return;
    }

    // Simulate async sign-in
    const submitBtn = document.getElementById('signin-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Signing in…</span>';

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Signed in!</span>';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = orig;
          closeSigninModal();
        }, 800);
      }, 1200);
    }
  });

  // Real-time clear on input after first error
  signinForm.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) {
        input.classList.remove('is-error');
        const errId = input.getAttribute('aria-describedby');
        if (errId) {
          const errEl = document.getElementById(errId);
          if (errEl) errEl.textContent = '';
        }
      }
    });
  });
}

/* ------------------------------------------------------------------
   PRICING TOGGLE (Monthly ↔ Annual)
   ------------------------------------------------------------------ */

const toggleMonthly = document.getElementById('toggle-monthly');
const toggleAnnual  = document.getElementById('toggle-annual');
const priceAmounts  = document.querySelectorAll('.pricing-card__amount[data-monthly]');

function setPricingPeriod(period) {
  priceAmounts.forEach((el) => {
    el.textContent = el.dataset[period] ?? el.dataset.monthly;
  });

  if (period === 'monthly') {
    toggleMonthly?.classList.add('is-active');
    toggleAnnual?.classList.remove('is-active');
    toggleMonthly?.setAttribute('aria-pressed', 'true');
    toggleAnnual?.setAttribute('aria-pressed', 'false');
  } else {
    toggleAnnual?.classList.add('is-active');
    toggleMonthly?.classList.remove('is-active');
    toggleAnnual?.setAttribute('aria-pressed', 'true');
    toggleMonthly?.setAttribute('aria-pressed', 'false');
  }
}

if (toggleMonthly) {
  toggleMonthly.setAttribute('aria-pressed', 'true');
  toggleMonthly.addEventListener('click', () => setPricingPeriod('monthly'));
}

if (toggleAnnual) {
  toggleAnnual.setAttribute('aria-pressed', 'false');
  toggleAnnual.addEventListener('click', () => setPricingPeriod('annual'));
}

/* ------------------------------------------------------------------
   PRICING CTAs — Pre-select plan in contact form
   ------------------------------------------------------------------ */

const pricingCTAs = document.querySelectorAll('.pricing-cta[data-plan]');

pricingCTAs.forEach((cta) => {
  cta.addEventListener('click', () => {
    const plan = cta.dataset.plan;

    // Persist choice for session
    try { sessionStorage.setItem('chosen_plan', plan); } catch (_) {}

    // Contextualise the contact section heading
    const contactHeading = document.getElementById('contact-heading');
    if (contactHeading) {
      contactHeading.textContent = plan === 'Enterprise'
        ? "Let's talk about the Enterprise plan"
        : `Start your ${plan} free trial`;
    }

    // Contextualise the textarea placeholder
    const messageField = document.getElementById('field-message');
    if (messageField) {
      messageField.placeholder = plan === 'Enterprise'
        ? 'Tell us about your team, security requirements, and deployment preferences…'
        : `Tell us about your team size and what you're hoping to improve with the ${plan} plan…`;
    }
  });
});
