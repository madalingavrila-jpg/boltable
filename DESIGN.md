---
name: Velocity Grid
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#dfe8ff'
  surface-container-highest: '#d9e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3c4a40'
  inverse-surface: '#273143'
  inverse-on-surface: '#ecf0ff'
  outline: '#6c7b6f'
  outline-variant: '#bbcabd'
  surface-tint: '#006d41'
  primary: '#006d41'
  on-primary: '#ffffff'
  primary-container: '#34d186'
  on-primary-container: '#005431'
  inverse-primary: '#48e093'
  secondary: '#5a5e6b'
  on-secondary: '#ffffff'
  secondary-container: '#dcdfef'
  on-secondary-container: '#5f6270'
  tertiary: '#5c5f61'
  on-tertiary: '#ffffff'
  tertiary-container: '#b6b9bc'
  on-tertiary-container: '#46494c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6afdad'
  primary-fixed-dim: '#48e093'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#00522f'
  secondary-fixed: '#dfe2f2'
  secondary-fixed-dim: '#c3c6d6'
  on-secondary-fixed: '#171b27'
  on-secondary-fixed-variant: '#434653'
  tertiary-fixed: '#e0e3e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#44474a'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d9e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The brand personality is energetic, efficient, and data-forward, reflecting the fast-paced nature of food logistics. This design system targets operational managers and restaurant partners who require immediate clarity to make high-stakes decisions. 

The design style is **Corporate Modern with a Tech-Utility edge**. It leverages a clean, high-contrast aesthetic that prioritizes information density without sacrificing breathing room. The emotional response should be one of "controlled urgency"—the UI feels fast and responsive, utilizing the vibrant primary green to highlight growth and "go" states, while the dark navy anchors the experience in professional reliability.

## Colors

The palette is led by **Bolt Green (#34D186)**, used strategically for primary actions, success states, and positive data trends. The core contrast is driven by **Dark Navy (#0D111C)**, which is used for typography and navigation elements to provide a more sophisticated feel than pure black.

- **Primary:** Bolt Green (#34D186) - Growth, action, and branding.
- **Secondary:** Dark Navy (#0D111C) - Text, deep backgrounds, and high-level hierarchy.
- **Surface/Neutral:** A scale of grays from White (#FFFFFF) to Light Gray (#F2F4F7) for backgrounds, and Mid-Gray (#667085) for secondary labels and metadata.
- **Semantic:** Use standardized red for "cancelled orders" and amber for "delayed" to ensure immediate recognition of operational friction.

## Typography

This design system utilizes **Inter** for its exceptional legibility in data-heavy environments. The typographic hierarchy is structured to guide the eye from macro-metrics to micro-details.

For numerical data, specifically within tables and dashboards, utilize **tabular num** (tnum) settings to ensure columns of figures align vertically, aiding quick comparison of sales figures. Headlines should use tighter letter spacing to maintain a compact, "newsroom" feel.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop, transitioning to a **4-column layout** for mobile. 

- **Desktop (1280px+):** 24px margins, 24px gutters. Use a fixed-width sidebar for navigation (280px).
- **Tablet (768px - 1279px):** 16px margins, 16px gutters. Sidebar collapses to icons.
- **Mobile (<767px):** 16px margins. Vertical stack for all metric cards.

Spacing follows a strict 4px/8px base-8 scale. For dashboard views, use "MD" (24px) spacing between major cards to create a clear visual separation of distinct data sets.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows. This maintains the "clean/fast" feel of a modern tech product.

- **Level 0 (Background):** Light Gray (#F2F4F7).
- **Level 1 (Cards/Content):** White (#FFFFFF) with a 1px border in #E4E7EB. No shadow.
- **Level 2 (Dropdowns/Modals):** White (#FFFFFF) with a soft, diffused 10% opacity navy shadow (0px 4px 20px) to indicate temporary overlay.
- **Interactions:** Hover states on interactive cards should subtlely shift the background color to #F9FAFB rather than increasing elevation.

## Shapes

The design system uses a **Rounded (0.5rem)** approach to soften the industrial nature of the data. 

- **Standard Elements:** Buttons, Input fields, and small cards use a 8px (0.5rem) radius.
- **Large Containers:** Main dashboard sections use a 16px (1rem) radius to define major work areas.
- **Progress Bars:** Use a fully rounded (pill) radius to indicate fluidity and movement.

## Components

- **Buttons:** Primary buttons use Bolt Green with Dark Navy text for maximum legibility. Use "Ghost" buttons for secondary actions to avoid competing with primary data points.
- **Metric Cards:** The cornerstone of the dashboard. Features a large title (Headline-MD), a primary value (Headline-LG), and a "trend chip" indicating percentage growth or decline.
- **Trend Chips:** Small capsules with a background tint (e.g., 10% green for growth) and matching high-contrast text.
- **Data Tables:** High-density rows with 12px vertical padding. Use "Zebra striping" only when tables exceed 10 columns. Header cells should use Label-MD in semi-bold Navy.
- **Status Indicators:** Small colored dots (Green = Active, Amber = Pending, Red = Attention) paired with text labels for accessibility.
- **Segmented Controls:** Used for time-period switching (24h, 7d, 30d). These should be styled as a flat toggle bar in Light Gray with a White "active" pill.