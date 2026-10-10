# BOBO Phase B redesign — changes

Backup of pre-redesign files: `D:\repo\2026 web\bobo-pre-phaseB-20261010\`
(index.html, tos.html, privacy.html, style.css, script.js, vercel.json).
No commit was made; commit in 3 steps when ready: (a) hero+stats, (b) features+commands+how,
(c) CTA+navbar+consistency. Untouched: vercel.json, images/, fonts/.

## index.html
- Hero: centered layout with stat chips replaced by two-column grid (text left, player mockup
  right; stacks on mobile). H1 is now solid white with one accent word (`music`, #ff3b4e), no
  gradient text. Subtitle is one sentence. CTAs: primary "Add to Discord" (same invite URL) +
  secondary "View commands" (#commands). Removed orbs/glow divs and the 4 hero chips (servers,
  members, 99.9% uptime, 2ms ping — the last two were unprovable claims).
- Hero background: inline topographic contour SVG (`hero-topo`, opacity 4%, hero only). No glows,
  orbs or dot grids.
- Stats strip: single 3-item strip (Servers / Users / Commands) keeping `server-count-stat` /
  `user-count-stat` IDs and `data-target` fallbacks (100+, 100+, 9) so existing /api/bot-stats
  logic works unchanged. Removed the uptime-% item.
- Removed About highlight cards (contained "99.9% Uptime Target", "milliseconds" claims) and the
  duplicated About stat boxes. About content merged into Features; an empty `#about` anchor is kept
  so the nav About link still works.
- Features: one bento grid, 6 existing features, large card first (Interactive UI Panels). No
  section pills. Titles/descriptions kept, trimmed only for length (no new claims).
- Commands: 9 commands with identical names/descriptions, now a two-column accessible list
  (code chip + description + copy button with `aria-label="Copy !x"`). `#copy-status`
  (role=status) announces "Copied …".
- New How-it-works strip (#how): Invite BOBO / Join a voice channel / Type !play (existing facts).
- Platforms: same 3 SVGs with unchanged brand colors, now a plain centered 3-item row, no cards.
- CTA: one heading, one sentence (server-count claim removed), one button, kept the subtle top
  accent line; removed radial background and glow div.
- Navbar: kept links + Invite button; `ul#primary-menu`, hamburger `aria-controls="primary-menu"`,
  existing toggle untouched. Active link styling (`.active`) driven by new JS observer.
- CSS loading: replaced preload + `media=print` trick with a plain render-blocking stylesheet link
  (robust without JS; same file served). Critical hero CSS in `<style>` updated to match.
- Max content width 1180px -> 1200px; buttons min-height 44px -> 48px.

## style.css
- Pretty-printed from the minified one-liner into readable CSS first; verified byte-identical
  after whitespace/comment normalization. Still served as-is, no build step.
- Only extended `:root` (radius/spacing tokens); brand colors/variables unchanged.
- Appended Phase B sections (a/b/c): hero grid, topo, player mockup, stats-3, bento, how,
  cmd-list/copy-btn, platform row, CTA neutral, 96px/64px section rhythm, mobile stacking and
  `overflow-x: clip` guard. Removed nothing from old rules (old chip/orb selectors left inert).

## script.js
- Original minified IIFE untouched (navbar toggle, reveals, stat count-up, /api/bot-stats fetch
  with fallbacks, lofi player behavior all as before; missing hero/about stat IDs are null-safe).
- Appended: copy-to-clipboard (Clipboard API + execCommand fallback) and mobile-menu
  Escape-to-close (focus returns to toggle) + active-section observer. No frameworks.

## tos.html / privacy.html
- Same header as index now (logo, section links to index.html#…, same Invite URL, hamburger) and
  same footer (Product links fixed to index.html#… instead of dead #… anchors). Legal copy
  untouched. Added `<script src="script.js" defer>` (null-safe there).

## Verification (local dev server, CDP Chromium)
- 0 console errors on all 3 pages, desktop + mobile emulation; doc width == viewport (no overflow).
- One h1 per page; heading order h1->h2->h3; landmarks/skip-link/focus-visible retained;
  player mockup `aria-hidden`; reduced-motion block kept; new UI has no animation.
- Contrast: body 19.1, secondary 9.7, muted 7.8, white-on-#dc2626 4.83, accent 5.7 — all >= 4.5:1.
- Lighthouse mobile (simulated): index 84 / tos 86 / privacy 86, all with A11y/BP/SEO 100, CLS 0.
  Desktop index: 99/100/100/100, CLS 0.
- Perf note: the single blocker is the pre-existing 573 KB `images/favicon.ico` (fetched High
  priority; everything else is ~100 KB). Proof: same page with a small favicon scores mobile
  100 / LCP 1.5s. Recommended fix (not applied — favicons were out of scope): re-export
  `favicon.ico` as 16/32/48px multi-size (~10–15 KB).

## Assumptions
- `#about` anchor kept only for the existing nav link; About copy lives in Features.
- tos.html "strive for 99.9% uptime" is legal disclaimer wording, left as-is; marketing claims
  removed from index only.
- Below-fold screenshots were taken after natural scroll (reveals fire on scroll); one clip set
  used forced-visible reveals for framing only.
- Lighthouse ran against a local static server where /api/bot-stats 404s to fallbacks;
  production API can only improve LCP slightly (faster stats paint).

## Hero H1 display font — Michroma (SIL OFL 1.1, self-hosted)
- H1 (`.hero-heading` only) now uses Michroma 400 (wide extended display, Good Times-style).
  Good Times NOT used: its free licence does not cover font embedding/webfonts.
- Candidates compared (outside project): `D:\repo\2026 web\bobo-dev-archive\font-compare.html`
  (+ `font-compare.png` screenshot): Michroma 400 (OFL, 17.9 KB, default), Krona One 400 (OFL,
  10.4 KB), Syncopate 700 (Apache 2.0 — note: NOT OFL, `apache/syncopate` on google/fonts;
  still an open licence allowing webfonts, 17.4 KB), Unbounded 700 (OFL, 21.1 KB).
- Self-hosted: `fonts/michroma-latin.woff2` (17,908 bytes, Google latin subset
  U+0000-00FF + punctuation range) + `fonts/OFL-Michroma.txt` (licence) + attribution
  comments in `style.css` / `index.html` head. `font-display: swap`.
- Preload: exactly one font preload (`fonts/michroma-latin.woff2`, H1 is LCP); Manrope
  preload removed (Manrope still declared in critical CSS, loads with swap).
- Metric-matched fallback `Michroma Fallback` (local Arial; size-adjust 151.15%,
  ascent-override 76.5%, descent-override 17.57%, line-gap-override 0%) so swap ≈ no CLS.
- `.hero-heading`: uppercase via CSS only (HTML stays sentence case for SEO/screen readers),
  weight 400 + `font-synthesis: none` (no faux bold), `letter-spacing: .01em`,
  `line-height: 1.15`, `font-size: clamp(1.75rem, 3.4vw, 2.75rem)` (max tuned to 44px:
  measured 46px still fits 3 lines at 1920px/1280px, 48px wraps to 4 — capped at 44px
  for margin; mobile ≤600px:
  `clamp(1.4rem, 7.2vw, 1.75rem)`), `text-wrap: balance`, `overflow-wrap: normal`.
  Accent word `music` stays solid `#ff3b4e`. H1/sub/btn gaps (16px/32px), left alignment
  and hero grid untouched. h2/h3/nav/buttons/body stay Manrope; theme vars, audio engine,
  bot/API, vercel.json and invite URLs untouched. Git backup branch (no commit/push):
  `backup/pre-hero-h1-font-20261010`.
