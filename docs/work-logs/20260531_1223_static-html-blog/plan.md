# Static HTML GitHub Pages Blog Plan

## Tier

Tier 3: 1 leader + 2 sonnet-style exploration subagents.

## Goal

Create a GitHub Pages blog in `/Users/devconative/data/devconative.github.io` as plain static HTML/CSS/JavaScript, visually matching the current Project-CB React portfolio/blog style without requiring a React build step.

## Reference Findings

- Target repo is empty except for `.git`; it has no build scripts, source files, Pages config, or remotes.
- Project-CB is a React/TypeScript SPA with Express backend, but the visual system can be recreated statically.
- Main visual references:
  - `/Users/devconative/data/Project-CB/src/front/src/root.css`
  - `/Users/devconative/data/Project-CB/src/front/src/common.css`
  - `/Users/devconative/data/Project-CB/src/front/src/Components/common/navigation/style.css`
  - `/Users/devconative/data/Project-CB/src/front/src/Components/main/HeroSection.css`

## Chosen Approach

Use a build-free static Pages structure:

- `index.html` as the root entrypoint.
- `assets/css/style.css` for Project-CB-inspired theme tokens, navigation, responsive layout, sections, and cards.
- `assets/js/main.js` for navigation toggle, theme toggle, reveal animation, and footer year.
- `.nojekyll` to keep GitHub Pages from applying Jekyll processing.
- `.gitignore` to keep brainstorming/runtime scratch files out of commits.

## Validation Criteria

- Opening `index.html` directly renders a complete blog/portfolio page.
- A local static server serves the same page without build tools.
- Desktop navigation opens by default and pushes content.
- Mobile navigation behaves as an overlay.
- Theme toggle switches dark/light theme and persists in `localStorage`.
- No React, bundler, package manager, or generated build output is required.

