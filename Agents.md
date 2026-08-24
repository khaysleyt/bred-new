# BRED — Project Instructions for Codex

## Project overview

This repository contains the new official website for:

**BRED — Brussels Education & Development**

The goal is to replace the current WordPress website with a modern, professional, responsive, secure, accessible and SEO-friendly static website.

The existing WordPress site can be used as a reference for content only.

Do not copy its design, its layout or its technical implementation.

The new website must feel like a completely redesigned professional website.

---

# 1. Core technology rules

Use only:

* HTML5
* CSS3
* Vanilla JavaScript

Do NOT introduce:

* React
* Next.js
* Vue
* Angular
* Bootstrap
* Tailwind CSS
* jQuery
* server-side Node.js requirements
* unnecessary frameworks
* unnecessary libraries
* unnecessary build tools

The production website will be hosted on a classic OVH shared web hosting plan.

The final website must work as a static website.

It must not require:

* npm
* Node.js runtime
* a JavaScript build system
* a frontend framework
* a server process

Development tools may exist locally, but production must remain static.

---

# 2. Main priorities

Project priorities are:

1. Frontend quality
2. Responsive design
3. Performance
4. Natural SEO
5. Security
6. Accessibility
7. Maintainability
8. Clean code

The frontend quality is extremely important.

The final website must look professionally designed, not merely technically correct.

---

# 3. General visual direction

The website must feel:

* modern
* premium
* elegant
* highly professional
* minimal
* spacious
* clean
* contemporary
* trustworthy
* human
* welcoming
* dynamic
* polished

It should have the visual quality of a professionally designed organization or institution website.

Avoid anything that looks like:

* a generic WordPress theme
* Bootstrap default components
* a basic association website
* a generic AI-generated landing page
* a generic SaaS template
* an outdated institutional website
* an overly flashy marketing website

Use generous whitespace.

Pay very close attention to:

* typography
* spacing
* hierarchy
* alignment
* visual rhythm
* proportions
* image quality
* hover states
* button styling
* card styling
* responsive behavior
* transitions
* visual consistency

Do not fill empty space just because it exists.

Whitespace is part of the design.

---

# 4. Brand identity

The official organization name is:

**BRED — Brussels Education & Development**

The new visual identity is based mainly on:

* deep navy blue
* strong bright blue
* gold / yellow accents
* white
* very light neutral backgrounds
* dark professional text

Suggested initial CSS variables:

```css
:root {
    --color-primary: #082f73;
    --color-primary-light: #1264e8;
    --color-accent: #e5ad17;

    --color-text: #17233a;
    --color-text-muted: #667085;

    --color-background: #ffffff;
    --color-background-soft: #f6f8fb;

    --color-border: #e5e9f0;
}
```

These values are starting points.

Adjust them when necessary so they visually match the official logo.

Do not introduce many unrelated colors.

---

# 5. Official logo assets

Official brand assets are stored in:

```text
assets/images/branding/
```

Expected logo files:

```text
logo-bred-horizontal.png
logo-bred-vertical.png
logo-bred-icon.png
logo-bred-favicon.png
```

## Usage rules

### `logo-bred-horizontal.png`

This is the primary website logo.

Use it by default in:

* desktop header
* main navigation
* horizontal branding layouts

### `logo-bred-vertical.png`

Use when a vertical logo composition is more appropriate.

Possible uses:

* footer
* institutional blocks
* special presentation sections

### `logo-bred-icon.png`

Use the emblem-only version in compact layouts.

Possible uses:

* mobile layouts
* decorative branding
* small identity elements
* selected social contexts

### `logo-bred-favicon.png`

Use as the source for browser favicon assets.

Do not recreate the BRED logo using HTML or CSS.

Do not distort the logo.

Always preserve its original aspect ratio.

Never stretch it horizontally or vertically.

---

# 6. Recommended project structure

Prefer a structure similar to:

```text
/
├── AGENTS.md
├── index.html
│
├── a-propos/
│   └── index.html
│
├── programmes/
│   └── index.html
│
├── projets/
│   └── index.html
│
├── equipe/
│   └── index.html
│
├── contact/
│   └── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── assets/
│   ├── images/
│   │   ├── branding/
│   │   ├── team/
│   │   ├── projects/
│   │   └── general/
│   │
│   └── icons/
│
├── robots.txt
├── sitemap.xml
└── .gitignore
```

Do not create complex architecture without a real need.

This project should remain easy to understand and maintain.

---

# 7. Responsive design — CRITICAL

Responsive quality is a major priority.

The website must work properly around at least:

* 1440px
* 1280px
* 1024px
* 768px
* 430px
* 390px
* 360px

Do not build only a desktop design and shrink it afterward.

Mobile must be intentionally designed.

Requirements:

* no accidental horizontal scrolling
* no overflowing content
* no cropped text
* no broken navigation
* no distorted images
* no cards extending outside the viewport
* no unreadably small text
* no tiny touch targets
* no overlapping UI elements

Use:

* CSS Grid
* Flexbox
* fluid sizing
* `clamp()`
* appropriate media queries

Mobile layouts may differ significantly from desktop when needed.

---

# 8. Header and navigation

Desktop header should generally include:

* official BRED horizontal logo
* Accueil
* À propos
* Programmes or Activités
* Projets
* Équipe
* Contact
* primary CTA

The header can become sticky if useful.

A subtle visual change on scroll is allowed.

For example:

* transparent or light initial state
* subtle background
* soft shadow
* reduced height on scroll

Do not make the effect distracting.

---

# 9. Mobile navigation

Mobile navigation must be accessible.

Use a real `<button>` for the menu trigger.

Use attributes such as:

```html
aria-expanded
aria-controls
```

The menu should:

* open smoothly
* close smoothly
* be keyboard accessible
* have clear focus states
* close intuitively
* work without layout bugs

Do not use an inaccessible clickable `<div>`.

---

# 10. Homepage structure

The homepage should approximately contain:

1. Header
2. Hero
3. Key numbers / important highlights
4. Mission / introduction
5. Activities or programs
6. Featured project
7. Recent projects
8. Team preview
9. Partners
10. Final CTA
11. Footer

The exact order may be changed if there is a strong UX reason.

---

# 11. Hero section

The hero is one of the most important parts of the site.

It must immediately communicate:

* who BRED is
* what BRED does
* who BRED supports
* why the organization matters

The hero should generally contain:

* one strong H1
* short supporting copy
* primary CTA
* optional secondary CTA
* high-quality relevant image
* subtle modern visual details

Do not overload it.

Avoid generic phrases without meaning.

---

# 12. Animations and micro-interactions — IMPORTANT

The website should contain modern and attractive animations.

Animations are encouraged.

The website should not feel static or lifeless.

However, animations must remain:

* elegant
* smooth
* professional
* performant
* purposeful
* accessible

The goal is not minimal animation.

The goal is high-quality animation.

---

# 13. Animation ideas encouraged

Appropriate animation techniques include:

* fade-in sections
* slide-up reveals
* staggered content reveals
* subtle scale effects
* image reveal animations
* elegant hover transitions
* animated navigation underline
* subtle icon motion
* card lift effects
* image zoom on hover
* CTA arrow motion
* animated counters
* smooth mobile menu
* accordion transitions
* subtle decorative hero motion
* small depth effects
* subtle parallax when performance allows

Animations should contribute to perceived quality.

---

# 14. Hero animation

The hero may have a more sophisticated entrance sequence.

Possible example:

1. eyebrow / small heading appears
2. H1 lines reveal progressively
3. supporting paragraph fades upward
4. CTA buttons appear
5. hero image reveals
6. decorative graphic elements move subtly

Keep the sequence reasonably fast.

Do not force users to wait for content.

---

# 15. Card animation

Cards can use subtle hover effects.

Examples:

```css
transform: translateY(-4px);
```

or:

```css
transform: scale(1.01);
```

Suitable card effects include:

* slight elevation
* subtle border color change
* small shadow increase
* icon movement
* image zoom
* arrow movement

Avoid large jumps or exaggerated effects.

---

# 16. Button animations

Buttons may use:

* smooth color transitions
* icon movement
* arrow movement
* subtle scale
* background transitions
* border transitions

Interactions should feel responsive.

Do not create delayed or sluggish hover effects.

---

# 17. Animation performance

Prefer animating:

* `transform`
* `opacity`

Avoid repeatedly animating expensive properties such as:

* width
* height
* top
* left
* large blur filters
* expensive box shadows

Avoid animation techniques that trigger continuous layout recalculation.

---

# 18. Scroll animation implementation

Prefer native browser APIs.

Use:

```js
IntersectionObserver
```

for scroll reveal behavior.

Do not add:

* GSAP
* Framer Motion
* animation frameworks

unless there is a strong technical reason and explicit approval.

The website must remain Vanilla JavaScript.

---

# 19. Reduced motion

Always support:

```css
@media (prefers-reduced-motion: reduce)
```

Reduce or disable non-essential animations for users who request reduced motion.

Important content must never require animation to become understandable.

---

# 20. Mobile animations

Animations can be simplified on mobile.

If an animation negatively affects:

* frame rate
* battery usage
* perceived speed
* usability

reduce or disable it for mobile.

---

# 21. Performance — CRITICAL

The site must be extremely fast.

Aim for excellent Google Lighthouse and PageSpeed results.

Important goals:

* low page weight
* fast first render
* fast interaction
* minimal JavaScript
* optimized images
* stable layouts
* minimal external requests

Do not add dependencies unnecessarily.

---

# 22. Lighthouse targets

Desired targets:

```text
Performance:      95–100
Accessibility:    95–100
Best Practices:   95–100
SEO:              95–100
```

These are goals, not reasons to cheat metrics.

Real user experience has priority.

---

# 23. Core Web Vitals

Pay close attention to:

* LCP
* INP
* CLS

Avoid layout shifts.

Images should generally declare dimensions.

Example:

```html
<img
    src="assets/images/general/example.webp"
    width="800"
    height="600"
    alt="..."
>
```

---

# 24. Hero image performance

The primary hero image may be part of LCP.

Do not automatically apply:

```html
loading="lazy"
```

to the hero LCP image.

Images below the initial viewport should generally use lazy loading.

---

# 25. Image optimization

Prefer:

* WebP
* AVIF where appropriate

Use JPEG or PNG only where required.

Use:

* correct dimensions
* compression
* `srcset`
* `sizes`

when they provide meaningful benefit.

Do not serve huge desktop images to mobile devices.

---

# 26. Team image assets

Team photos are stored in:

```text
assets/images/team/
```

The team portraits should appear visually consistent.

Desired presentation:

* square
* rounded corners
* consistent framing
* consistent dimensions
* `object-fit: cover`
* professional appearance
* optimized file size

Do not distort photos.

Use CSS for final corner radius and presentation where possible.

---

# 27. Team structure

Each member should conceptually support:

```text
name
role
description
image
email
linkedin
category
```

Not every field needs to be visible in every context.

Homepage:

* selected members
* name
* role
* short text if useful
* CTA toward full team page

Full team page:

* full profiles
* longer descriptions
* contact details if appropriate

---

# 28. Confirmed team information

The following information is validated and can be used.

## Kadir Demir

**Role:** Directeur

**Description:**

Diplômé en sciences biomédicales, Kadir Demir est un acteur engagé dans les domaines de l'éducation, de la formation et de la coopération internationale.

**Email:**

```text
kadir.demir@edubrussels.org
```

---

## Selim Ardağ

**Role:** Directeur D&I & Community

**Description:**

Passionné par l'éducation inclusive, Selim coordonne des programmes de diversité et d'inclusion à Bruxelles, en travaillant avec des communautés sous-représentées, notamment les jeunes issus de l'immigration, les étudiants de première génération et les apprenants multilingues. Son approche bienveillante et son expérience terrain font de lui un pilier de l'accompagnement éducatif au sein de BRED.

**Email:**

```text
selim.ardag@edubrussels.org
```

---

## Mehmet Namni

**Role:** Directeur EU Projects

**Description:**

Fort d'une solide expérience en gestion financière, Mehmet a contribué à la coordination de projets européens, notamment des initiatives Erasmus+ axées sur l'éducation, l'inclusion sociale et le développement des jeunes. Il assure la transparence et la pérennité des projets éducatifs de BRED, avec une maîtrise du français, du néerlandais et de l'anglais.

**Email:**

```text
mehmet.namni@edubrussels.org
```

---

## Hasan Kayman

**Role:** Directeur IT & STEM

**Description:**

Diplômé en informatique de gestion, Hasan possède une solide expérience en éducation scientifique et en littératie numérique. Il anime des ateliers de sensibilisation aux STEM auprès de jeunes issus de milieux diversifiés et collabore avec des universités et écoles secondaires bruxelloises sur des activités d'innovation liées aux programmes scolaires, au service de la mission éducative de BRED.

**Email:**

```text
info@edubrussels.org
```

---

## Zeynep Güven

**Role:** Chargée de Relations Institutionnelles

Detailed description to be provided later.

Do not invent one.

---

## Zehra Güven

**Role:** Chargée de Programmes Communautaires

Detailed description to be provided later.

Do not invent one.

---

## Jispon P. Caseres

**Role:** Chargé de Projets Erasmus+

Detailed description to be provided later.

Do not invent one.

---

## Ikram Bensaber

**Role:** Chargée d'Ateliers STEM

Detailed description to be provided later.

Do not invent one.

---

# 29. Additional team roles

The following roles are also part of the current organization information.

## Feyza Nami

**Role:** Coordinatrice Politiques Éducatives

## Aysegül Cakan

**Role:** Coordinatrice Inclusion & Diversité

## Sanae El Boukarie

**Role:** Coordinatrice Dissémination EU

## Marie Dubois

**Role:** Coordinatrice Innovation Digitale

## Esma Gökçek

**Role:** Animatrice Engagement Citoyen

## Claudia Lopez

**Role:** Animatrice Dialogue Interculturel

## Sevgi Gül Demir

**Role:** Animatrice Mobilité EU

## Nadia Rousseau

**Role:** Animatrice Relations Com.

Do not invent biographies for these members unless they are provided later.

---

# 30. Mission and thematic pillars

BRED works around subjects including:

* education
* educational support
* inclusion
* diversity
* equal opportunities
* youth
* community engagement
* European projects
* Erasmus+
* mobility
* STEM
* science
* technology
* innovation
* digital literacy
* personal development
* professional development
* intergenerational activities
* cooperation

Important existing thematic pillars include:

## Education

Educational support and accompaniment.

## Inclusion

Diversity and equal opportunities.

## Europe

Erasmus+ projects, European cooperation and mobility.

## STEM

Science, technology and innovation.

Use these subjects naturally in website content.

Do not use artificial keyword stuffing.

---

# 31. Content accuracy

Never invent factual information about BRED.

This includes:

* numbers of participants
* project counts
* statistics
* founding date
* partners
* funders
* qualifications
* awards
* grants
* roles
* biographies
* addresses
* testimonials
* contact information

If information is unknown:

* leave the field empty
* mark it internally as TODO
* or ask for the information

Do not silently fabricate realistic-looking content.

---

# 32. Placeholder statistics

Never present placeholder statistics as factual data.

Do not invent values such as:

```text
3500+ participants
98% satisfaction
25 partners
120 projects
```

unless those values have been explicitly confirmed.

If placeholders are needed during design, clearly mark them as placeholders in the source.

---

# 33. HTML semantics

Use semantic HTML.

Prefer:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

Use `<aside>` only when appropriate.

Avoid meaningless nesting of many `<div>` elements.

---

# 34. Heading hierarchy

Each page should normally have one main H1.

Use headings semantically:

```text
H1 = main page title
H2 = main page sections
H3 = subsection titles
```

Do not choose heading levels only based on font size.

Use CSS to control visual appearance.

---

# 35. SEO — CRITICAL

Natural search engine optimization is a critical project requirement.

SEO must be designed into the website from the start.

Do not treat SEO as something added after the visual design is complete.

Every public indexable page should have:

* unique `<title>`
* unique meta description
* canonical URL
* semantic structure
* meaningful content
* clean headings
* crawlable links
* good performance
* useful internal linking

---

# 36. Page titles

Each page should have an informative title.

Example:

```html
<title>BRED | Brussels Education & Development</title>
```

Avoid duplicate titles.

Avoid generic titles such as:

```text
Home
Page
Welcome
```

---

# 37. Meta descriptions

Each important page should have a unique meta description.

Descriptions should:

* accurately describe the page
* be written naturally
* contain useful contextual keywords
* avoid keyword stuffing
* encourage relevant clicks

---

# 38. Canonical URLs

Use canonical URLs on public pages.

Example:

```html
<link
    rel="canonical"
    href="https://edubrussels.org/"
>
```

Use the confirmed production domain.

---

# 39. Open Graph metadata

When appropriate, support:

```text
og:title
og:description
og:image
og:url
og:type
```

Do not invent social images that do not exist.

Use actual project assets.

---

# 40. Social metadata

Twitter/X card metadata may also be included when appropriate.

Keep metadata consistent with visible page content.

---

# 41. URL structure

Prefer clean URLs.

Examples:

```text
/
 /a-propos/
 /programmes/
 /projets/
 /equipe/
 /contact/
```

Avoid:

```text
about-final.html
page2.html
team-new-v3.html
```

URLs should remain stable.

---

# 42. sitemap.xml

Maintain a valid:

```text
sitemap.xml
```

Only include:

* real pages
* public pages
* indexable pages

Use production URLs once they are confirmed.

---

# 43. robots.txt

Provide a correct:

```text
robots.txt
```

Do not accidentally prevent production indexing.

Development or staging environments may be blocked separately if required.

Never copy development blocking rules into production without verification.

---

# 44. Structured data

Use JSON-LD Schema.org when appropriate.

Possible structured data:

* `Organization`
* `WebSite`
* `BreadcrumbList`
* `Article`
* `Event`

Do not add a schema unless the content genuinely supports it.

Never fabricate:

* reviews
* ratings
* awards
* addresses
* event details
* organization facts

Structured data must correspond to real visible content.

---

# 45. Image SEO

Use descriptive image filenames.

Prefer:

```text
atelier-stem-bruxelles.webp
```

instead of:

```text
IMG_5483.jpg
```

Use meaningful `alt` text for informative images.

Decorative images should not receive misleading descriptions.

---

# 46. Accessibility

Accessibility is a major requirement.

Follow good WCAG practices.

Ensure:

* good contrast
* keyboard navigation
* visible focus
* meaningful headings
* form labels
* meaningful alternative text
* readable font sizes
* sufficiently large touch targets
* semantic HTML
* accessible menu behavior

Do not remove focus outlines unless they are replaced with a better visible focus style.

---

# 47. Buttons and links

Use real buttons for actions.

Example:

```html
<button type="button">
```

Use real links for navigation.

Example:

```html
<a href="/projets/">
```

Do not implement buttons with:

```html
<div onclick="...">
```

Avoid vague link labels when better wording is available.

---

# 48. JavaScript philosophy

JavaScript should enhance the website, not carry all of its content.

The primary site content should be directly present in HTML.

Use JavaScript for:

* mobile menu
* animations
* accordions
* tabs
* simple filters
* counters
* small interactions

Do not render all main page text using JavaScript.

This improves:

* SEO
* accessibility
* performance
* resilience

---

# 49. JavaScript performance

Keep JavaScript lightweight.

Avoid:

* unnecessary loops
* excessive DOM queries
* continuous scroll listeners when avoidable
* unnecessary DOM mutations
* expensive animation code

Use native browser features.

Use `defer` where appropriate.

---

# 50. JavaScript security

Never use:

```js
eval()
```

Avoid injecting user-controlled content with:

```js
innerHTML
```

Prefer:

```js
textContent
```

or explicit DOM creation.

All user-provided content must be treated as untrusted.

---

# 51. CSS architecture

Keep CSS organized and readable.

Use custom properties for:

* colors
* typography
* spacing
* layout dimensions
* border radius
* shadows
* transitions

Avoid:

* duplicated declarations
* excessive selector specificity
* excessive nesting
* hundreds of unrelated magic values
* unnecessary `!important`

Use `!important` only exceptionally.

---

# 52. Typography

Typography is an important part of the premium frontend quality.

Use:

* strong visual hierarchy
* comfortable line height
* sensible line length
* responsive sizing
* appropriate weight contrast

`clamp()` is encouraged for fluid heading sizing.

Avoid overly small body text.

---

# 53. Fonts

Performance and privacy matter.

Prefer either:

* high-quality system font stacks

or:

* self-hosted fonts

Do not automatically add remote Google Fonts or similar services.

If an external font service is proposed, explain:

* performance impact
* privacy impact
* GDPR implications

before adding it.

---

# 54. Security — CRITICAL

Security is a core project requirement.

Even though the site is mostly static, follow modern security principles.

Never expose:

* passwords
* SMTP credentials
* API secrets
* API tokens
* private keys
* OAuth secrets
* sensitive configuration

No secret may appear in:

* HTML
* CSS
* JavaScript
* repository history
* GitHub

---

# 55. Contact form

The site may contain a frontend contact form.

Possible fields:

* name
* email
* subject
* message

Use native HTML validation first.

Optional JavaScript validation may improve UX.

Forms should provide:

* proper labels
* clear errors
* accessible error messages
* clear success state

Do not imply that frontend validation provides security.

---

# 56. Contact form backend

Do not place mail-service secrets in frontend code.

Do not implement SMTP directly in browser JavaScript.

Do not expose email API keys.

Email sending must later be handled by:

* a secure server-side solution
* or an appropriate trusted service

Any backend implementation must be reviewed separately.

---

# 57. Anti-spam planning

The contact form architecture should allow future protection against:

* spam
* bots
* abuse
* automated submissions
* injection attacks

Do not add intrusive anti-spam services automatically.

---

# 58. External links

When using:

```html
target="_blank"
```

use appropriate:

```html
rel="noopener noreferrer"
```

where relevant.

---

# 59. HTTPS

Production must use HTTPS.

Avoid insecure HTTP resources when HTTPS alternatives exist.

Do not create mixed-content problems.

---

# 60. Security headers

The static site should remain compatible with strong server-side security headers.

Plan for:

* Content-Security-Policy
* X-Content-Type-Options
* Referrer-Policy
* Permissions-Policy
* HSTS
* clickjacking protection

Avoid unnecessary inline scripts.

Prefer external JavaScript files.

Avoid unnecessary third-party scripts because they make a strict CSP harder.

---

# 61. Privacy and GDPR

BRED operates in Europe.

Privacy and GDPR principles must be respected.

Apply data minimization.

Do not automatically add:

* Google Analytics
* Facebook Pixel
* advertising trackers
* remarketing tools
* invasive analytics
* unnecessary third-party cookies

Any tracking solution must be explicitly discussed first.

---

# 62. Cookie banner

Do not create a fake cookie banner just because websites often have one.

If the site does not use consent-requiring cookies, do not display unnecessary consent UI.

If cookies or analytics requiring consent are added later, implement the appropriate consent mechanism at that time.

---

# 63. Legal pages

Plan for:

* Privacy Policy
* Legal Notice

Content must eventually reflect real organization information.

Do not invent legal details.

---

# 64. External dependencies

Avoid external JavaScript/CSS libraries unless necessary.

Before adding a dependency:

1. identify the problem;
2. explain why native HTML/CSS/JS is insufficient;
3. consider performance;
4. consider security;
5. consider privacy;
6. ask for approval for major dependencies.

---

# 65. Partners

Only display real BRED partners.

Do not automatically populate the site with:

* Brussels logos
* European Union logos
* Erasmus+ logos
* funders
* institutions

unless those partnerships are confirmed.

Placeholder partner logos must be clearly identifiable as placeholders during development.

---

# 66. Projects

Do not invent BRED projects.

A project may conceptually contain:

```text
title
category
description
date
image
url
```

Use clean, reusable project-card styles.

Project URLs should eventually be descriptive.

---

# 67. Homepage team preview

The homepage should only show a selection of team members.

Do not put all long biographies on the homepage.

Use a CTA such as:

```text
Découvrir toute l'équipe
```

The complete team belongs on the dedicated team page.

---

# 68. Footer

The footer should be useful and polished.

It can include:

* BRED branding
* short organization description
* navigation
* contact details
* social networks
* privacy link
* legal notice
* relevant CTA

Only display real contact and social details.

---

# 69. Browser compatibility

Support modern versions of:

* Chrome
* Edge
* Firefox
* Safari

Use progressive enhancement.

The essential content should remain usable even if a non-critical advanced visual effect is unsupported.

---

# 70. Progressive enhancement

The website should provide core information even without JavaScript where reasonably possible.

JavaScript should enhance:

* navigation
* motion
* interaction

not replace semantic HTML.

---

# 71. Git rules

Do not track:

```text
.vs/
```

Respect:

```text
.gitignore
```

Do not commit:

* temporary files
* editor caches
* secrets
* generated garbage
* local environment files

Do not automatically run Git commit or push unless explicitly requested.

---

# 72. Existing code

Before making substantial changes:

1. inspect existing files;
2. understand the current implementation;
3. preserve working code where appropriate;
4. explain the planned change;
5. modify only what is required.

Do not rewrite the entire project for a minor adjustment.

---

# 73. Change discipline

For a significant implementation task:

## Before coding

Explain briefly:

* what currently exists
* what will be changed
* why
* which files will be affected

## After coding

Explain:

* what was changed
* which files were modified
* any important technical decisions
* anything that still requires user-provided content

---

# 74. Validation workflow

After substantial implementation, review the result.

## Design

Check:

* visual quality
* spacing
* branding
* typography
* hierarchy
* alignment
* interactions
* animations

## Responsive

Check:

* 1440px
* 1280px
* 1024px
* 768px
* 430px
* 390px
* 360px

## HTML

Check:

* semantics
* headings
* links
* forms
* image attributes

## Performance

Check:

* images
* JavaScript
* CSS
* layout shifts
* unnecessary requests
* render-blocking resources

## SEO

Check:

* title
* description
* canonical
* H1
* headings
* internal linking
* crawlable content
* image alt text
* Open Graph
* structured data

## Accessibility

Check:

* keyboard
* focus
* contrast
* labels
* semantic controls
* motion preferences

## Security

Check:

* no secrets
* no exposed credentials
* no unsafe DOM injection
* no unnecessary third-party scripts
* secure external links

---

# 75. Visual quality rule

Do not settle for a page simply because it technically works.

Frontend quality is a primary acceptance criterion.

If a page feels:

* generic
* unfinished
* too basic
* visually inconsistent
* like a template

continue improving it.

---

# 76. Animation quality rule

Do not remove attractive motion just to make the site minimal.

A polished modern website can contain significant animation.

However, animation must always remain:

* smooth
* intentional
* performant
* accessible
* visually tasteful

Prefer a few excellent interactions over dozens of random effects.

---

# 77. Performance vs visual effects

When deciding whether to add a visual effect, consider:

1. Does it improve perceived quality?
2. Does it reinforce hierarchy or feedback?
3. Is it smooth on mobile?
4. Does it significantly affect performance?
5. Is it accessible?
6. Can it be built without a heavy dependency?

If an effect is visually valuable and remains performant, it is encouraged.

---

# 78. SEO vs animation

Do not hide important textual content from HTML for animation purposes.

Important content must remain present in the DOM.

Scroll-reveal effects should normally start from content already available to search engines.

Animations must not compromise:

* crawling
* indexing
* accessibility

---

# 79. Final objective

The new BRED website should communicate:

* trust
* professionalism
* education
* inclusion
* modernity
* openness
* innovation
* human connection
* quality

The final result should feel like a website designed and developed specifically for BRED, not a reused template.

---

# 80. Codex workflow rule

Before every substantial task:

1. Read this `AGENTS.md`.
2. Inspect the relevant project files.
3. Briefly explain the intended implementation.
4. Make the changes.
5. Review responsive behavior.
6. Review performance.
7. Review SEO.
8. Review accessibility.
9. Review security.
10. Summarize the result.

Never ignore this file when making project-wide decisions.

---

# First implementation phase

Before building the full website:

1. Read this entire file.
2. Inspect the current repository.
3. Inspect the official branding assets.
4. Inspect existing team assets.
5. Propose the architecture of the homepage.
6. Propose the visual direction.
7. Explain the planned animations.
8. Explain the responsive strategy.
9. Explain the performance strategy.
10. Explain the SEO strategy.
11. Explain the security strategy.
12. List the files that should be created or modified.

Do NOT implement the entire website yet.

Wait for validation before starting the full homepage implementation.
