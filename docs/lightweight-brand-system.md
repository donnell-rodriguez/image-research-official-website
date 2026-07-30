# ADV Lightweight Brand System

## Principle

The website uses a green visual system derived from the ADV logo. Product pages,
PPTs, admin systems, and brochures should keep this green system as the primary
brand language instead of introducing orange as the main CTA color.

## Current CSS Tokens

The source of truth is `src/styles/00-foundation.css`.

```css
--brand-cta: #58bd19;
--brand-cta-bright: #9af21f;
--brand-tech: #1f9b18;
--brand-tech-bright: #8fee1a;
--brand-tech-line: #9af21f;
--brand-heading-deep: #071109;
--bg: #f5f9f4;
--line: #dce8df;
--brand-copy: #303a32;
--brand-muted: #5f6b62;
```

## Brand Roles

- Primary CTA and active states: `--brand-cta`
- Hover highlights and small emphasis lines: `--brand-cta-bright`
- Deep header/footer backgrounds: `--brand-heading-deep` with green glow accents
- Page background: `--bg`
- Cards and content surfaces: white
- Body copy: `--brand-copy`
- Secondary text: `--brand-muted`
- Borders and separators: `--line`

## Usage Rules

- Use green for primary actions, current navigation, highlight lines, and product
  emphasis states.
- Use deep green/near-black backgrounds for header, footer, and dark brand bands.
- Use light green page backgrounds with white content surfaces for medical-tech
  clarity.
- Keep red and blue only for diagram semantics where they explain a workflow.
- Do not use orange as a primary button or navigation color in new ADV materials.

## Optional Future Token Names

If the broader ADV product ecosystem needs a single cross-product naming scheme,
map the current website colors into `--adv-*` tokens:

```css
--adv-primary: #49c915;
--adv-primary-bright: #7af21c;
--adv-forest: #07140d;
--adv-forest-soft: #253b25;
--adv-bg: #f3faf1;
--adv-surface: #ffffff;
--adv-ink: #07140d;
--adv-text: #4e5c52;
--adv-muted: #6b776e;
--adv-border: #dcefd8;
```
