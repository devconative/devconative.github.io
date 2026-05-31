# Static HTML GitHub Pages Blog Design

## Objective

Build a GitHub Pages-ready personal blog as plain static HTML/CSS/JavaScript, matching the look and feel of Project-CB while avoiding React, package managers, and build steps.

## Architecture

The site is served directly from the repository root. `index.html` owns semantic content and section structure. `assets/css/style.css` owns all visual styling, theme variables, responsive behavior, navigation, cards, and animation states. `assets/js/main.js` owns small progressive enhancements: navigation toggling, theme persistence, reveal-on-scroll, and footer year.

## Visual Direction

The page will recreate Project-CB's dark-first visual language:

- fixed left navigation
- circular profile image placeholder
- blue accent color
- subtle borders and card shadows
- dark/light theme variables
- hero section with greeting, name, role, description, and action buttons
- blog cards and section layouts inspired by Project-CB's grouped post views

## Static Content Model

The first version uses hand-authored HTML sections. Blog cards are static examples that can later be copied or edited manually. This keeps GitHub Pages deployment trivial and matches the user's request for HTML format.

## Routing

The site uses anchor navigation only. There is no SPA router and no server-side fallback. This avoids GitHub Pages refresh issues and removes the need for React.

## Files

- `index.html`: root page and all content.
- `assets/css/style.css`: full static visual system.
- `assets/js/main.js`: small UI behavior.
- `.nojekyll`: disables Jekyll processing on GitHub Pages.
- `.gitignore`: excludes local brainstorming scratch files and OS/editor noise.

## Testing

Verification will use a local static server, browser inspection, desktop/mobile viewport checks, navigation/theme interactions, and console log inspection.

