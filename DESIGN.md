# BRED — Design System

This file is the durable visual and motion contract for the BRED public website. Runtime tokens live in `css/style.css` and must remain aligned with these decisions.

## Design thesis

BRED should feel like a Brussels educational institution in motion: credible and structured, yet open, human and optimistic. The homepage uses one bold gesture — a deep-navy hero animated around real team portraits and fine learning trajectories — while the rest of the page becomes progressively calmer and more spacious.

Avoid generic charity, SaaS and WordPress visual language. No fabricated metrics, decorative card grids, glassmorphism, gradient text, excessive rounding or ornamental effects without meaning.

## Color

The palette is committed, with navy carrying the hero and footer. Gold remains a rare premium accent.

| Token | Value | Role |
| --- | --- | --- |
| Deep Navy | `#082F73` | Hero, footer, major headings |
| Navy Dark | `#051E4A` | Deep surfaces and contrast |
| Active Blue | `#1264E8` | Primary actions and interactive states |
| Active Blue Dark | `#0B4FC2` | Button hover and active state |
| BRED Gold | `#E5AD17` | Sparse emphasis and trajectory accents |
| Ink | `#17233A` | Main text |
| Muted Ink | `#526078` | Supporting text; must retain AA contrast |
| Soft Background | `#F6F8FB` | Quiet section surfaces |
| Border | `#DDE4EE` | Rules and component boundaries |
| White | `#FFFFFF` | Primary light surface and text on navy |

## Typography

Use a privacy-friendly system stack for phase one:

`Aptos, "Segoe UI Variable", "Segoe UI", Helvetica, Arial, sans-serif`

- Display: 700–750 weight, tight but never below `-0.04em` tracking.
- Body: 400–450 weight, `1.65` line-height, maximum `70ch` measure.
- Utility labels: 650 weight, restrained letter spacing; do not repeat uppercase eyebrows on every section.
- Fluid headings use `clamp()` with a display ceiling below `6rem`.

## Spacing

Base rhythm uses a 4px-derived scale:

| Token | Value |
| --- | --- |
| `2xs` | `0.25rem` |
| `xs` | `0.5rem` |
| `sm` | `0.75rem` |
| `md` | `1rem` |
| `lg` | `1.5rem` |
| `xl` | `2rem` |
| `2xl` | `3rem` |
| `3xl` | `4rem` |
| `4xl` | `6rem` |

Section spacing is fluid, generally `clamp(4.5rem, 9vw, 8rem)`. Related content stays tight; distinct narrative moments receive generous separation.

## Layout

- Maximum content width: `78rem` / 1248px.
- Outer gutter: `clamp(1.25rem, 4vw, 3rem)`.
- Desktop hero: asymmetric text/portrait composition.
- Mobile hero: deliberately recomposed, not reduced from desktop.
- Cards are used only for distinct people or actionable content; pillars remain an editorial band.
- All media reserves intrinsic geometry to prevent CLS.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| Small | `0.5rem` | Compact details |
| Medium | `0.75rem` | Buttons and portraits |
| Large | `1rem` | Featured media |
| Pill | `999px` | Small tags and round controls only |

Cards and sections never exceed 16px radius.

## Shadows

Depth is quiet and functional:

- Small: `0 2px 8px rgba(5, 30, 74, 0.08)`
- Medium: `0 8px 24px rgba(5, 30, 74, 0.12)`
- Hero portraits may use a deeper navy-tinted shadow, never paired with a decorative border.

## Motion

GSAP Core and ScrollTrigger are the single advanced motion system. CSS handles simple hover, focus and press feedback.

| Token | Duration | Use |
| --- | --- | --- |
| Instant | `140ms` | Pressed state |
| Fast | `200ms` | Links, icons, header |
| Normal | `380ms` | Buttons, cards, menu |
| Slow | `760ms` | Masks, portraits, section reveals |
| Hero | `1100–1400ms` | Orchestrated entrance |

Easing:

- Standard CSS: `cubic-bezier(0.22, 1, 0.36, 1)`
- GSAP entrance: `power3.out`
- GSAP emphasis: `expo.out`, used sparingly

Motion rules:

- Prefer `transform` and `opacity`; use `clip-path` only for bounded reveals.
- No bounce, elastic motion, large translations or artificial smooth scrolling.
- Desktop pointer depth never moves essential content.
- Mobile removes pointer motion and parallax, shortens distances and staggers.
- With `prefers-reduced-motion: reduce`, all decorative trajectories, parallax, scrub and staged reveals are disabled; content appears immediately.
- HTML is readable by default. JavaScript may enhance but never gate visibility, navigation or content.

## Interaction and accessibility

- WCAG 2.2 AA target.
- Minimum touch target: 44×44px.
- Visible `:focus-visible` treatment on every interactive element.
- Links navigate; buttons perform actions.
- Sticky header must not obscure focused content.
- Mobile navigation uses a real button with `aria-expanded` and `aria-controls`, supports Escape and restores focus.
- Hover is never required to discover information.

## Imagery

- Use only official BRED assets.
- Original PNG files remain untouched; web variants use descriptive lowercase filenames.
- Portraits remain square with consistent `object-fit: cover` framing.
- Use responsive WebP sources and explicit dimensions.
- Do not invent faces or use poor automatic cutouts.

