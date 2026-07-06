---
name: Ethereal Intelligence
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd8e5'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebf9'
  surface-container-high: '#ebe6f3'
  surface-container-highest: '#e6e0ed'
  on-surface: '#1c1a24'
  on-surface-variant: '#484555'
  inverse-surface: '#312f39'
  inverse-on-surface: '#f4eefc'
  outline: '#797586'
  outline-variant: '#c9c4d7'
  surface-tint: '#613ede'
  primary: '#5e3bdb'
  on-primary: '#ffffff'
  primary-container: '#7858f5'
  on-primary-container: '#fffbff'
  inverse-primary: '#cabeff'
  secondary: '#5d5e67'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ed'
  on-secondary-container: '#63646d'
  tertiary: '#8c4c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#b06000'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#481bc6'
  secondary-fixed: '#e3e1ed'
  secondary-fixed-dim: '#c6c5d0'
  on-secondary-fixed: '#1a1b23'
  on-secondary-fixed-variant: '#45464f'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77b'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#fdf8ff'
  on-background: '#1c1a24'
  surface-variant: '#e6e0ed'
typography:
  display-xl:
    fontFamily: Literata
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-page: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

This design system embodies the intersection of **Premium Craftsmanship** and **Calm Intelligence**. It is designed to feel like luxury software—unhurried, precise, and deeply intuitive. Drawing inspiration from the editorial clarity of modern boutiques and the functional elegance of high-end developer tools, the system prioritizes a "Quiet Luxury" aesthetic.

The visual narrative is built on:
- **Minimalism & White Space:** Utilizing generous breathing room to reduce cognitive load and elevate the importance of data insights.
- **Glassmorphism:** Implementing sophisticated translucent layers that suggest depth and digital materiality without clutter.
- **Modern Editorial Flair:** Blending technical precision with high-contrast serif typography for an authoritative yet approachable voice.
- **Subtle Motion:** Using "shimmer" and "glow" effects to denote AI activity, moving away from aggressive neon tropes toward a more organic, pulsing light.

The target audience—professionals and high-achieving students—should feel empowered, focused, and like they are using a tool built with obsessive attention to detail.

## Colors

The palette is anchored by **Warm White (#FAFAFA)** and **Soft Ivory**, creating a canvas that feels more like premium paper than a digital screen. 

### Palette Strategy
- **Core Accents:** Soft Lavender and Muted Indigo serve as primary identifiers for AI-driven features and call-to-actions. 
- **Surface Tones:** Backgrounds utilize very subtle off-white shifts to separate content areas without the need for heavy borders.
- **The "Graphite" Contrast:** For primary interactions, a deep, near-black Indigo (#1A1B23) provides a grounding weight to the otherwise airy interface.
- **Glass Tints:** Translucent surfaces use a pure white base at 60-80% opacity, allowing the soft lavender and periwinkle background glows to bleed through subtly.

## Typography

This system employs a dual-font strategy to balance editorial elegance with technical utility.

1.  **Literata (Editorial Serif):** Used exclusively for headlines, hero statements, and high-level section titles. It provides the "premium" feel and creates a rhythmic contrast against the UI.
2.  **Geist (Technical Sans):** Used for all body copy, data visualizations, and interface labels. Its monospaced-inspired terminals and clean geometry ensure maximum readability for complex data like Gap Analysis and Skill Radars.

**Scaling Rules:**
- Display and Large headlines should use tighter letter-spacing to maintain a cohesive "locked-in" look.
- Labels and Small UI text should utilize slightly increased letter-spacing and medium-to-semibold weights for clarity at small sizes.

## Layout & Spacing

The layout is built on a **12-column fluid grid** for desktop, transitioning to a single-column stack for mobile. 

**Key Principles:**
- **Extreme Padding:** Every container (Card, Modal, Section) should have 1.5x more padding than standard SaaS applications to simulate a gallery-like feeling.
- **The 8px Rhythm:** All spacing between elements follows an 8px base increment, though "Stack XL" is frequently used between major page sections to create the signature Apple-like breathing room.
- **Alignment:** Data displays (like the Skill Radar) should be centered or balanced within high-margin containers to emphasize their importance.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Ambient Shadows** rather than high-contrast borders.

- **The Base:** The primary page background is always the flat #FAFAFA.
- **Layer 1 (The Canvas):** Soft, off-white containers that use a barely-perceptible 1px border `rgba(20, 20, 20, 0.04)`.
- **Layer 2 (Floating/Interactive):** Glassmorphic elements (modals, dropdowns, hovered cards) utilize a 20px-40px backdrop blur and a soft, multi-layered ambient shadow. 
- **Shadow Profile:** Shadows should be extremely diffused (e.g., `box-shadow: 0 20px 50px rgba(0,0,0,0.03)`), appearing more like a soft glow of darkness than a hard drop shadow.
- **Backdrop Blurs:** Use `backdrop-filter: blur(30px)` on all glass surfaces to create a sense of focused isolation from the background.

## Shapes

The shape language is sophisticated and inviting. 
- **Primary Containers:** Cards and large sections use a radius of **24px to 32px**. This high roundedness conveys a friendly, modern "app" feel reminiscent of Arc or iOS.
- **Interactive Elements:** Buttons and input fields use a consistent **12px** radius (Soft) to maintain a professional structural integrity.
- **Icon Enclosures:** Small circular containers (100% radius) are used for Lucide icons to create "jewel-like" focal points within the UI.

## Components

### Buttons
- **Primary:** Dark Graphite (#1A1B23) with white text. High-contrast, no shadow on rest, slight elevation on hover.
- **Secondary/Ghost:** Glassmorphic background (white 10% opacity) with a thin 1px white border (50% opacity).
- **AI Primary:** A subtle gradient shifting from Muted Indigo to Soft Violet, featuring a 2px "outer glow" shimmer.

### Cards
- Large radius (24px+), white background or 80% glass. 
- Generous internal padding (32px+).
- Borders should be minimal: `1px solid rgba(20,20,20,0.06)`.

### Inputs & Fields
- Ghost-style inputs with bottom-only borders or very light full-frame borders.
- Focused state should use a soft Lavender outer glow (4px spread) rather than a hard color change.

### AI Elements
- **Pulse:** Used for active analysis. A soft, circular violet glow that expands and fades.
- **Shimmer:** A diagonal light-streak that passes over cards or progress bars during "Career Intelligence" generation.
- **Icons:** Lucide icons, stroke width 1.5pt, placed inside 40x40px frosted glass circles.

### Feedback & Status
- Use the defined "Status" palette in a muted, desaturated form for backgrounds (10% opacity) with high-saturation text for clarity.