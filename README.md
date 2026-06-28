# Project 1: Responsive Frontend Interface
## DecodeLabs Internship — Full Stack Development Track

> **Use-case:** SaaS product landing page for **CodeFlow** — an AI-powered code review platform for developer teams. The single primary CTA drives trial signups via the contact form.

---

### 🚀 Live Preview

[Add GitHub Pages link after deployment]

---

### 📋 Project Overview

CodeFlow is a fictional SaaS product landing page built as a showcase of modern frontend engineering fundamentals. It demonstrates a complete responsive interface with a hero section, feature cards, a work/case-study showcase grid, an animated stats section, a testimonials row, a live CTA banner, and a validated contact form — all without frameworks, libraries, or build tools.

The design system is built from three brand colours (Mocha Mousse, Ethereal Blue, Moonlit Grey) and uses fluid typography, an 8px spacing grid, and CSS custom properties throughout.

---

### ✅ Features

- **Mobile-first responsive design** — single column on mobile, up to 4-column grids on desktop
- **WCAG 2.1 AA accessible** — tested for contrast, keyboard navigation, and screen reader semantics
- **Semantic HTML5 structure** — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` landmarks
- **Pure CSS3** — Grid + Flexbox + Custom Properties + `clamp()` fluid type, zero utility class frameworks
- **Vanilla JavaScript ES6+** — no libraries, `const`/`let` only, class-based DOM toggling
- **Scroll reveal animations** — Intersection Observer on `.reveal` elements with staggered card delays
- **Contact form validation** — real-time per-field validation on blur, success state, character counter
- **Sticky animated header** — transparent on load, gains backdrop blur + shadow on scroll
- **Scroll progress indicator** — thin gradient bar at top of viewport
- **Dark mode support** — automatic via `prefers-color-scheme: dark`
- **Reduced motion support** — all animations respect `prefers-reduced-motion: reduce`

---

### 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Mocha Mousse | `#A5856F` | Primary accent, buttons, highlights |
| Mocha Dark | `#7A5C48` | Text on light backgrounds |
| Mocha Deeper | `#5C3F2E` | Headings, highest contrast |
| Ethereal Blue | `#A0D4E0` | Trust, secondary highlights |
| Blue Dark | `#5BABB9` | Links, active states |
| Blue Deeper | `#2E7D8A` | Accessible text on white |
| Moonlit Grey | `#F2F0EA` | Page background |
| BG Alt | `#E9E6DE` | Section alternation |
| Text Primary | `#3D2B1F` | Body copy |
| Text Secondary | `#7A6558` | Supporting text |
| Dark BG | `#2A2118` | Footer, hero dashboard |

**Typography:**
| Family | Variable | Usage |
|--------|----------|-------|
| Montserrat | `--font-display` | Headlines, nav, UI labels |
| Roboto | `--font-body` | Body copy, form inputs |

**Fluid Type Scale** (all using `clamp()`):

| Token | Range |
|-------|-------|
| `--text-hero` | 44px → 80px |
| `--text-3xl` | 36px → 56px |
| `--text-2xl` | 28px → 40px |
| `--text-xl` | 22px → 28px |
| `--text-lg` | 18px → 22px |
| `--text-base` | 16px → 18px |
| `--text-sm` | 14px → 16px |
| `--text-xs` | 12px → 14px |

---

### 📁 Project Structure

```
project_1/
├── index.html                 # Complete single-page application
├── README.md                  # This file
├── .gitignore
└── assets/
    ├── css/
    │   ├── main.css           # Master @import file + global styles
    │   ├── variables.css      # All CSS custom properties (design tokens)
    │   ├── reset.css          # Modern CSS reset
    │   ├── typography.css     # Type system + utility classes
    │   ├── layout.css         # Grid, Flexbox, section spacing
    │   ├── components.css     # Nav, buttons, cards, forms, footer
    │   └── animations.css     # Keyframes, scroll reveals, micro-interactions
    ├── js/
    │   ├── main.js            # App entry point + utilities
    │   ├── navigation.js      # Mobile nav, scroll behaviour, active links
    │   ├── animations.js      # Intersection Observer, stat counters, ripples
    │   └── form.js            # Form validation, success state, char counter
    └── fonts/                 # Reserved (Google Fonts loaded via CDN)
```

---

### 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (Semantic landmarks) |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, `clamp()`) |
| Behaviour | Vanilla JavaScript (ES6+ modules, Intersection Observer) |
| Fonts | Google Fonts (Montserrat + Roboto) via CDN |
| Build | None — open `index.html` directly |

---

### ♿ Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Skip navigation | `<a href="#main-content" class="skip-link">` as first body element |
| Landmark roles | `<header role="banner">`, `<main>`, `<nav>`, `<footer role="contentinfo">` |
| Heading hierarchy | Single `<h1>` in hero, `<h2>` per section, `<h3>` for cards |
| ARIA labels | `aria-label` on nav, form, buttons, social links |
| ARIA live regions | `aria-live="polite"` on form error messages; `aria-live="assertive"` on success |
| `aria-expanded` | Applied to hamburger button — toggled by JavaScript |
| `aria-current="page"` | Applied to active nav link by scroll observer |
| Focus management | Mobile menu returns focus to hamburger on close; form success focuses heading |
| Focus indicators | `:focus-visible` ring (2px solid `#2E7D8A`) on all interactive elements |
| Keyboard navigation | Tab order matches visual order; Escape closes mobile menu |
| Color contrast | Dark text on light bg: `#3D2B1F` on `#F2F0EA` — approx. 12:1 ratio |
| Reduced motion | All CSS animations deactivated; JS animations skipped when `prefers-reduced-motion: reduce` |
| Image alt text | Every `<img>` has descriptive `alt` attribute |
| Form labels | Every input has associated `<label for="...">` |
| Required fields | `required`, `aria-required="true"`, visual asterisk with `aria-label="required"` |

---

### 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, hamburger nav |
| Mobile-wide | 640px – 767px | 2-column card grid |
| Tablet | 768px – 1023px | Desktop nav, 2-col grids |
| Desktop | 1024px – 1279px | Full multi-column layouts |
| Wide | ≥ 1280px | Max-width container (1200px) |

---

### 🎬 JavaScript Modules

**`navigation.js`**
- Mobile nav toggle with `aria-expanded` state management
- Closes on outside click, Escape key, and link click
- Smooth scroll to anchor sections with nav-height offset
- Active nav link tracking via Intersection Observer
- Scroll-triggered header background (transparent → frosted glass)
- Scroll progress indicator via `rAF`-throttled handler

**`animations.js`**
- Scroll reveal via Intersection Observer (`.reveal` → `.is-visible`)
- Staggered card delays (`data-delay` attribute injection)
- Stat counter animation (easeOutExpo, handles %, k+, decimal formats)
- Parallax blob movement (transform only — no layout thrash)
- Ripple effect on primary buttons (CSS `scale(0)` → `scale(4)`)
- Card shimmer highlight on hover

**`form.js`**
- Per-field validation triggered on `blur`; re-validated on `input` after first touch
- Error messages injected as text (never HTML) into `aria-live` regions
- Visual states via class toggling: `.is-error` / `.is-success` only — no inline styles
- Submit triggers all-field validation; first invalid field receives focus
- 1.4s simulated async submit → success state
- Character counter on message textarea
- Reset button restores form from success state

---

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/decodelab-project-1.git
   cd decodelab-project-1/project_1
   ```

2. **Open in browser**
   ```bash
   # Option A: Direct file open
   open index.html

   # Option B: Local server (recommended for full feature support)
   npx serve .
   # or
   python3 -m http.server 3000
   ```

3. **No build step required** — pure HTML/CSS/JS, works in any modern browser.

---

### 🌐 Deploying to GitHub Pages

```bash
# From repo root
git checkout -b gh-pages
git subtree push --prefix project_1 origin gh-pages
```

Then visit: `https://YOUR_USERNAME.github.io/decodelab-project-1/`

---

### 🔍 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Opera 76+ | ✅ Full |

> Requires: `CSS Grid`, `Custom Properties`, `Intersection Observer`, `ES6+`

---

### 📄 License

MIT © 2025 DecodeLabs Project 1 — CodeFlow Demo

---

*Built as part of the DecodeLabs Full Stack Internship Track — Project 1: Responsive Frontend Interface*
