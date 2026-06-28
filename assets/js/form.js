/**
 * form.js — CodeFlow
 *
 * Responsibilities:
 *  - Real-time field validation (on blur)
 *  - Visual error / success states via class toggling only
 *  - Prevent submit if any field is invalid
 *  - Show animated success message (no backend)
 *  - Fields: name (min 2), email (RFC5322 format), message (min 10)
 *  - Accessible: announces errors to screen readers via aria-live
 */

'use strict';

/* ------------------------------------------------------------------
   ELEMENT REFS
   ------------------------------------------------------------------ */

const contactForm    = document.getElementById('contact-form');
const formSuccess    = document.getElementById('form-success');
const submitBtn      = document.getElementById('form-submit');

/* ------------------------------------------------------------------
   VALIDATION RULES
   Each entry: { id, minLength?, maxLength?, isEmail?, required? }
   ------------------------------------------------------------------ */

const FIELDS = [
  {
    id:        'field-name',
    errorId:   'error-name',
    label:     'Name',
    required:  true,
    minLength: 2,
    maxLength: 80,
    validate(value) {
      if (!value.trim()) return 'Name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      if (value.trim().length > 80) return 'Name cannot exceed 80 characters.';
      return null;
    },
  },
  {
    id:       'field-email',
    errorId:  'error-email',
    label:    'Email',
    required: true,
    isEmail:  true,
    validate(value) {
      if (!value.trim()) return 'Email address is required.';
      // RFC5322-inspired check — enough for UX purposes
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRe.test(value.trim())) return 'Please enter a valid email address.';
      return null;
    },
  },
  {
    id:        'field-company',
    errorId:   'error-company',
    label:     'Company',
    required:  false,
    validate(value) {
      if (value.trim().length > 100) return 'Company name cannot exceed 100 characters.';
      return null;
    },
  },
  {
    id:        'field-message',
    errorId:   'error-message',
    label:     'Message',
    required:  true,
    minLength: 10,
    maxLength: 2000,
    validate(value) {
      if (!value.trim()) return 'Message is required.';
      if (value.trim().length < 10) return `Message must be at least 10 characters (${value.trim().length}/10).`;
      if (value.trim().length > 2000) return `Message cannot exceed 2000 characters.`;
      return null;
    },
  },
];

/* ------------------------------------------------------------------
   HELPER — show error message for a field
   ------------------------------------------------------------------ */

function showError(field, errorId, message) {
  field.classList.remove('is-success');
  field.classList.add('is-error');
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errorId);

  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.textContent = message;
  }
}

/* ------------------------------------------------------------------
   HELPER — clear error and show success state
   ------------------------------------------------------------------ */

function showSuccess(field, errorId) {
  field.classList.remove('is-error');
  field.classList.add('is-success');
  field.setAttribute('aria-invalid', 'false');
  field.removeAttribute('aria-describedby');

  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.textContent = '';
  }
}

/* ------------------------------------------------------------------
   HELPER — clear all states
   ------------------------------------------------------------------ */

function clearState(field, errorId) {
  field.classList.remove('is-error', 'is-success');
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');

  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.textContent = '';
  }
}

/* ------------------------------------------------------------------
   VALIDATE SINGLE FIELD
   Returns true if valid, false if invalid.
   ------------------------------------------------------------------ */

function validateField(fieldDef) {
  const el    = document.getElementById(fieldDef.id);
  if (!el) return true; // element not in DOM — skip

  const value = el.value;
  const error = fieldDef.validate(value);

  if (error) {
    showError(el, fieldDef.errorId, error);
    return false;
  } else {
    // Only show success state if the field was touched
    if (value.trim() !== '' || !fieldDef.required) {
      showSuccess(el, fieldDef.errorId);
    } else {
      clearState(el, fieldDef.errorId);
    }
    return true;
  }
}

/* ------------------------------------------------------------------
   VALIDATE ALL FIELDS
   Returns true if ALL pass.
   ------------------------------------------------------------------ */

function validateAll() {
  return FIELDS.every((fieldDef) => validateField(fieldDef));
}

/* ------------------------------------------------------------------
   ATTACH BLUR (on-leave) VALIDATION
   ------------------------------------------------------------------ */

FIELDS.forEach((fieldDef) => {
  const el = document.getElementById(fieldDef.id);
  if (!el) return;

  el.addEventListener('blur', () => {
    // Only validate if user has touched the field
    if (el.value.trim() !== '' || el.dataset.touched === 'true') {
      el.dataset.touched = 'true';
      validateField(fieldDef);
    }
  });

  // Real-time: re-validate after first blur to give instant feedback
  el.addEventListener('input', () => {
    if (el.dataset.touched === 'true') {
      validateField(fieldDef);
    }
  });
});

/* ------------------------------------------------------------------
   CHARACTER COUNTER FOR MESSAGE FIELD
   ------------------------------------------------------------------ */

const messageField   = document.getElementById('field-message');
const messageCounter = document.getElementById('message-char-count');

if (messageField && messageCounter) {
  function updateCharCount() {
    const count  = messageField.value.length;
    const max    = 2000;
    messageCounter.textContent = `${count} / ${max}`;

    if (count > max * 0.9) {
      messageCounter.style.color = 'var(--color-warning)';
    } else if (count >= max) {
      messageCounter.style.color = 'var(--color-error)';
    } else {
      messageCounter.style.color = 'var(--color-text-muted)';
    }
  }

  messageField.addEventListener('input', updateCharCount);
  updateCharCount(); // init
}

/* ------------------------------------------------------------------
   SUBMIT HANDLER
   ------------------------------------------------------------------ */

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Mark all fields as touched so errors show
    FIELDS.forEach((fieldDef) => {
      const el = document.getElementById(fieldDef.id);
      if (el) el.dataset.touched = 'true';
    });

    const isValid = validateAll();

    if (!isValid) {
      // Focus the first invalid field for accessibility
      const firstError = contactForm.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate async submission
    setSubmitLoading(true);

    setTimeout(() => {
      setSubmitLoading(false);
      showFormSuccess();
    }, 1400);
  });
}

/* ------------------------------------------------------------------
   SUBMIT BUTTON LOADING STATE
   ------------------------------------------------------------------ */

function setSubmitLoading(isLoading) {
  if (!submitBtn) return;

  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.dataset.originalText = submitBtn.textContent;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10" style="animation: spin 0.8s linear infinite; transform-origin: center;" />
      </svg>
      <span>Sending…</span>
    `;
  } else {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
  }
}

/* ------------------------------------------------------------------
   SHOW SUCCESS STATE
   ------------------------------------------------------------------ */

function showFormSuccess() {
  if (!contactForm || !formSuccess) return;

  // Hide the form
  contactForm.style.display = 'none';

  // Show success panel
  formSuccess.classList.add('is-visible');

  // Focus success message for screen reader announcement
  const successHeading = formSuccess.querySelector('h3');
  if (successHeading) {
    successHeading.setAttribute('tabindex', '-1');
    successHeading.focus();
  }

  // Dispatch custom event (for analytics hooks, GTM, etc.)
  contactForm.dispatchEvent(new CustomEvent('form:success', { bubbles: true }));
}

/* ------------------------------------------------------------------
   RESET FORM (for "Send Another" button)
   ------------------------------------------------------------------ */

const resetBtn = document.getElementById('form-reset-btn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (!contactForm || !formSuccess) return;

    // Reset all fields
    contactForm.reset();

    // Clear all validation states
    FIELDS.forEach((fieldDef) => {
      const el = document.getElementById(fieldDef.id);
      if (el) {
        el.dataset.touched = 'false';
        clearState(el, fieldDef.errorId);
      }
    });

    // Reset char counter
    if (messageCounter) {
      messageCounter.textContent = '0 / 2000';
      messageCounter.style.color = '';
    }

    // Show form, hide success
    formSuccess.classList.remove('is-visible');
    contactForm.style.display = '';

    // Focus name field
    const nameField = document.getElementById('field-name');
    if (nameField) nameField.focus();
  });
}
