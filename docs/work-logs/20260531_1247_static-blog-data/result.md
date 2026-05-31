# Static Blog Data Expansion Result

## Status

Implemented.

## Implementation Summary

- Added `blog/index.html` so GitHub Pages can serve the clean `/blog/` path.
- Generated `assets/js/site-data.js` from Project-CB:
  - 17 active groups from `M_Group` with `flag = 0`
  - 40 active posts from `M_Board` with `flag = 0`
  - 32 career/history entries from `CareerSection.tsx`
- Added `assets/js/blog.js` to render group tree, group counts, full post list, and search filtering.
- Added `assets/js/career.js` to render the full Project-CB history on the home page and replace placeholder recent posts with migrated recent posts.
- Updated home navigation and hero CTA to go to `blog/`.
- Added `scripts/extract-site-data.mjs` so the static data file can be regenerated from Project-CB sources.
- Extended CSS for full career cards, blog filters, group tree, and post rows.

## Verification

- `test -f blog/index.html && test -f assets/js/site-data.js && test -f assets/js/blog.js && test -f assets/js/career.js` exited with status `0`.
- `node --check assets/js/main.js`, `node --check assets/js/blog.js`, and `node --check assets/js/career.js` exited with status `0`.
- Static data check reported:
  - `groups: 17`
  - `posts: 40`
  - `career: 32`
- Browser verification at `http://localhost:4173/`:
  - home Blog CTA points to `blog/`
  - career renders 32 cards
  - recent posts renders 6 cards
  - no JavaScript console errors
- Browser verification at `http://localhost:4173/blog/`:
  - title is `Blog · Conative`
  - Blog nav item is active
  - group tree renders 17 groups plus the all-posts control
  - post list renders 40 posts
  - search for `Docker` filters to 3 matching posts
  - no JavaScript console errors
