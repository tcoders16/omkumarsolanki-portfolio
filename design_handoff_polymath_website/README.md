# Handoff: Polymath Consultancy Group — Marketing Website

## Overview
Single-page marketing site for Polymath Consultancy Group, a premium AI consultancy that deploys AI agents to remove operational friction. Voice: quiet, precise, confident — no hype words. The design is strictly monochrome (five tones, zero accent colors); hierarchy comes from size, weight, and spacing only.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. Your task is to **recreate these designs in the target codebase's existing environment** (Next.js/React, Vue, Astro, etc.) using its established patterns and libraries. If no environment exists yet, choose an appropriate modern framework (Next.js + CSS modules or Tailwind is a fine default) and implement the designs there.

`Polymath Website.dc.html` opens directly in a browser (keep `support.js` and `Mark.dc.html` beside it). The design source is inside the file in two blocks: the markup template inside `<x-dc>…</x-dc>` (all styles are inline) and the interaction logic in the `<script data-dc-script>` class. Ignore the runtime plumbing (`support.js`, `sc-if`, `dc-import` tags) — treat them as: `sc-if` = conditional render, `dc-import name="Mark"` = the logo-mark component (see Assets below).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final design intent. Recreate pixel-perfectly. All copy in the prototype is verbatim-approved content — do not rewrite it. Bracketed text like `[XX]%`, `[Founder name]`, `hello@[domain]` are intentional placeholders awaiting real data; keep them parameterized.

## Design Tokens

Colors — the ONLY five colors allowed anywhere (never pure #FFFFFF or #000000, no accent colors, no gradients, no shadows):
- Carbon `#0A0A0C` — primary ink; dark section backgrounds
- Graphite `#26262E` — hairlines/dividers on dark; body text on light
- Steel `#6E6E78` — muted text, eyebrows, descriptors (both modes)
- Fog `#E9E9E5` — hairlines/borders on light
- Porcelain `#FAFAF8` — light background; text on dark

Typography — two families, two weights (400, 500), sentence case everywhere:
- Primary: **Inter** (variable, optical sizing enabled — "Inter Display" at large sizes). Google Fonts: `Inter:opsz,wght@14..32,300..700`. Fallback: 'Helvetica Neue', sans-serif.
- Annotations/eyebrows: **Geist Mono** 400, uppercase, letter-spacing 0.14–0.22em.
- Scale: hero h1 64px/1.05, weight 500, tracking −0.03em · section h2 42–46px/1.15, 500, −0.025em · card titles 18–20px, 500 · body 17–18px/1.7, 400 · card body 15–15.5px/1.65 · micro/labels 10–14px.
- `-webkit-font-smoothing: antialiased` on body; `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

Layout & spacing:
- Content max-width **1100px**, side padding 32px, centered.
- Section vertical padding **120px** (hero 104/96, final CTA 140).
- Card grids use **1px hairline gaps**: grid `gap: 1px` with the gap color as grid background (Fog on light, Graphite on dark) + 1px outer border same color. Cards have NO radius, NO shadow.
- Buttons: radius 7–8px, padding 14px 26px, 15px/500. Primary on dark sections = Porcelain bg + Carbon text (hover bg Fog). Secondary = plain text link with `→`. No pill buttons, no gradients.

## Screens / Sections (top to bottom, one page)

1. **Nav** — sticky top, Carbon bg, 1px Graphite bottom border, 64px tall, content row 1100px. Left: mark (26px) + "Polymath" 16.5px/500 Porcelain. Right: links 14px Steel (hover Porcelain): What we do · Industries · How we work · Results · About, then primary button "Book a consultation". All links smooth-anchor to sections.
2. **Hero** — Carbon. Two columns (1.15fr / 0.85fr, gap 64). Left: eyebrow "AI CONSULTANCY GROUP" (Geist Mono 11px, ls 0.22em, Steel); h1 "The intelligence layer for your business." (3 approved alternates live in the prototype's logic block — build as a constant/CMS field); sub 18px Steel max-width 520; CTA row: primary "Book a consultation" + text link "See how we work →". Right: aperture mark ~340px, hairline strokes.
3. **Trust bar** — bottom of hero, 1px Graphite top border. Label "TRUSTED ACROSS SECTORS" (mono) + three stats 14px Porcelain separated by 1×20px Graphite rules. (Alt state with 4 dashed client-logo slots exists in the prototype.)
4. **The problem** — Porcelain. Eyebrow, h2 max 780px, two paragraphs 18px Graphite max 720px; final phrase "We remove it." weight 500 Carbon.
5. **What we do** (`#what-we-do`) — Porcelain. h2 + intro, then **2×2 card grid** (Fog hairlines). Card: mono index "01"–"04" Steel, title 20px/500 Carbon (margin-top 20), body 15.5px Graphite (margin-top 14), padding 36px.
6. **Industries** (`#industries`) — Porcelain. h2 + intro, **3×2 card grid**. Card: title 18px/500, body 15px Graphite (flex-grow), footer link "See what this looks like →" 14px/500 Steel, hover Carbon; padding 32px.
7. **How we work** (`#how-we-work`) — **Carbon section** (the one dark body section, for rhythm). h2 Porcelain, **4-column step grid** (Graphite hairlines): mono number, step title 19px Porcelain, body 15px Steel. Footer line (mono, Steel): "Typical first engagement: 6–10 weeks from diagnosis to a working system."
8. **Results** (`#results`) — Porcelain. h2, **4 stat blocks** in hairline grid: value 48px/500 Carbon with square brackets rendered in Fog (placeholders), caption 14px Steel. Mono footnote: "Placeholder metrics — replaced with client data as engagements complete". Below: **2 case-study cards**: title "[Client / industry name]", three label/value rows (mono labels THE FRICTION / THE LAYER / THE RESULT, 110px label column), link "Read the full story →".
9. **About** (`#about`) — Porcelain. Two columns (1.2fr/0.8fr, gap 72): editorial text left ("Depth over volume." in 500 Carbon); right a founder card (Fog border, padding 34): mark 44px, name, mono role "FOUNDER & PRINCIPAL", bio 14.5px, Fog-rule footer line "Based in Ontario, Canada — working with clients everywhere."
10. **FAQ** — Porcelain, max-width 900px. h2 "Fair questions." Five accordion rows divided by Fog hairlines: question 17px/500 + "+" glyph 20px Steel (rotates 45° to × when open, 0.25s); answer 16px/1.7 Graphite, padding-bottom 24.
11. **Final CTA** (`#contact`) — Carbon, centered, max 900px. Mark 56px, h2 46px, sub 17px Steel max 520, primary button, secondary line "Or write to us — hello@[domain]" (email in Porcelain).
12. **Footer** — Carbon, 1px Graphite top border. 4 columns (1.6fr/1fr/1fr/1fr): brand (mark + "Polymath Consultancy Group" + tagline Steel), COMPANY, RESOURCES, CONTACT (mono column labels; links 14px Porcelain @ 85% opacity, hover 50%). Legal row above 1px Graphite rule: "© 2026 Polymath Consultancy Group. All rights reserved." + Privacy · Terms (13px Steel).

## Interactions & Behavior
- **Anchor navigation**: nav + in-page links scroll to section ids (`#what-we-do`, `#industries`, `#how-we-work`, `#results`, `#about`, `#contact`). Add `scroll-behavior: smooth` if desired.
- **Hero mark animation** (once, on load): three squares start axis-aligned; squares 2 and 3 rotate to 30° and 60° about the shared center — 2.2s and 2.9s respectively, `cubic-bezier(0.3, 0, 0.15, 1)`, 0.5s delay, fill both; center dot fades in 0.9s at 3.1s. Provide a reduced-motion/static variant (final state). Subtle, slow, plays once.
- **FAQ accordion**: one item open at a time; clicking an open item closes it; "+" rotates 45°.
- **Hovers**: nav links Steel→Porcelain; buttons Porcelain→Fog bg; text links Steel→Carbon (light) / opacity fade (dark). ~0.15s transitions. No transform/shadow hovers.
- **No other motion.** No parallax, no scroll animations.

## State Management
- `openFaq: number | null` — accordion.
- `headline` — one of 4 approved strings (see logic block `OPTS`); CMS/config value.
- `trustBarMode: 'stats' | 'logos'` — pre/post-client states.
- No data fetching. "Book a consultation" buttons will eventually point to a scheduling link — keep as a config constant.

## Assets
- `assets/polymath-mark-porcelain.svg` / `assets/polymath-mark-carbon.svg` — the aperture mark (three 60×60 squares in a 96 viewBox, rotated 0°/30°/60° about center 48,48, stroke-width 1.5, center dot r 3.5). Use the SVG inline so stroke color/width can be themed. **Stroke should render ~1.5px at typical UI sizes** (the prototype scales stroke-width inversely with render size; at large hero size it uses hairline ~0.5 viewBox units). Never fill the squares.
- Fonts: Inter + Geist Mono from Google Fonts (self-host for production).
- No photos, no illustrations, no icons beyond the mark and "+"/"→" glyphs.

## Files
- `Polymath Website.dc.html` — the full page (template + logic). **Primary reference.**
- `Mark.dc.html` — logo mark component (aperture / simplified favicon / outlier variants + sizing logic).
- `Polymath Logo System.dc.html` — brand board: lockups, mark construction, scale rules, palette, type specimen, tagline lockup. Consult for any brand question.
- `support.js` — prototype runtime only; ignore for implementation.
- `assets/` — production-ready mark SVGs.
