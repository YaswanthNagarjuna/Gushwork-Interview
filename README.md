# Mangalam HDPE Pipes - Landing Page

A responsive product landing page for Mangalam HDPE Pipes built with vanilla HTML, CSS, and JavaScript. No frameworks or libraries used.

Live demo: [Vercel deployment link here]

---

## Project Structure

```
├── index.html          # Main HTML file (semantic HTML5)
├── styles.css          # Stylesheet (Flexbox/Grid, responsive)
├── script.js           # All interactive features
├── BIS.png             # BIS certification icon
├── ISO.png             # ISO certification icon
├── CE.png              # CE certification icon
├── logo.png            # Mangalam brand logo
├── euroflex.svg        # Euroflex brand logo
├── texture.png         # Background texture
└── README.md           # This file
```

---

## Sections Implemented

| # | Section | Description |
|---|---------|-------------|
| 1 | **Main Header** | Sticky navigation bar with logo, nav links, Contact Us button, and hamburger menu for mobile |
| 2 | **Product Sticky Header** | Secondary sticky bar that appears below the main header when scrolling past the hero section. Shows product thumbnail, title, price, and CTA |
| 3 | **Hero Section** | Product showcase with image carousel (5 images), zoom-on-hover, breadcrumb, feature tags, certification badges (BIS/ISO/CE), pricing, and CTA buttons |
| 4 | **Technical Specifications** | Dark-themed section with a data table listing 12 pipe parameters. Includes a "Download Datasheet" button that opens a modal |
| 5 | **Features Grid** | 6 feature cards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop) highlighting product benefits |
| 6 | **Versatile Applications** | Horizontally scrollable carousel of application cards (Water Distribution, Gas Transportation, etc.) with arrow navigation |
| 7 | **Manufacturing Process** | 8-step interactive process viewer. Desktop shows chip tabs; mobile shows prev/next navigation with step counter |
| 8 | **Testimonials** | Horizontal scrollable carousel of customer testimonial cards |
| 9 | **Solutions Portfolio** | 3-column grid of solution cards with images and "Learn More" buttons. Includes a CTA banner |
| 10 | **FAQ** | Accordion with 5 questions (single-open behavior) alongside a catalogue request form |
| 11 | **Resources** | Downloadable documents list (Installation Manual, Maintenance Handbook, Specs Sheet) |
| 12 | **Contact Form** | Split-layout section with a quote request form (name, company, email, phone) on a blue background |
| 13 | **Footer** | 4-column layout with company info, categories, products, and contact details. Social links and legal links |

---

## Key Features

### Sticky Header
- Main navigation bar sticks to the top on all scroll positions
- A secondary product header slides in below it once the user scrolls past the hero section
- Disappears when scrolling back to the hero
- Both headers include hamburger menus on mobile
- Uses `requestAnimationFrame` for scroll performance

### Image Carousel with Zoom
- 5-image product carousel with smooth CSS transitions
- Circular magnifying lens follows the cursor on hover (2.5x zoom)
- Thumbnail dot navigation + arrow buttons + slide counter
- Keyboard arrow key support
- Touch swipe support for mobile devices
- Zoom lens size adapts across breakpoints (160px mobile, 240px tablet, 300px desktop)

### Datasheet Download Modal
- Clicking "Download Full Technical Datasheet" opens a modal popup
- User enters email (required) and phone (optional)
- On submit: downloads the specs table as a CSV file and opens the mail client with the data pre-filled
- Modal closes on overlay click, close button, or Escape key

### Request a Quote Modal
- Triggered by "Get Custom Quote", "Request a Quote", and "Contact Us" buttons
- Form with Full Name, Company Name, Email, and Phone (+91 prefix)
- Simulated submission with loading/success states

---

## Responsive Breakpoints

| Breakpoint | Target | Container Padding |
|------------|--------|-------------------|
| < 640px | Mobile | 16px |
| 640px+ | Small tablet | 16px |
| 768px+ | Tablet (nav switches to desktop) | 16px |
| 1024px+ | Desktop | 60px |
| 1440px+ | Large desktop | 100px |

Max container width: **1240px** (centered)

---

## Tech Stack

- **HTML5** - Semantic elements (`<section>`, `<article>`, `<nav>`, `<aside>`)
- **CSS3** - Custom properties, Flexbox, Grid, media queries, transitions, animations
- **Vanilla JavaScript** - No dependencies, IIFE pattern, event delegation

---

## Fonts

- **Urbanist** (headings) - weights 400, 500, 600, 700
- **Inter** (body text) - weights 400, 500, 600, 700

Loaded via Google Fonts.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#2B3990` | Buttons, links, accents |
| Primary Hover | `#1f2a6b` | Button hover states |
| Dark BG | `#111827` | Specs section background |
| Text | `#0D0D0D` | Primary text |
| Text Secondary | `#4D545C` | Body copy |
| Text Muted | `#6A7077` | Labels, captions |
| Border | `#E1E3E8` | Dividers, card borders |
| Light BG | `#F7F8F9` | Card backgrounds, form areas |

---

## Browser Support

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

---

## How to Run Locally

1. Clone the repository
2. Open `index.html` in a browser

No build step or dependencies required.

---

## Deployment

The site is static HTML/CSS/JS and can be deployed to any hosting platform:

```bash
# Deploy to Vercel
vercel --prod

# Or push to GitHub and import into Vercel/Netlify
```

---

## Performance Notes

- Images use `loading="lazy"` for below-fold content
- Scroll handler uses `requestAnimationFrame` to avoid layout thrashing
- All event listeners use `{ passive: true }` where applicable
- CSS transitions use `transform` and `opacity` for GPU-accelerated animations
- No external JS/CSS libraries — total JS is ~300 lines
