# Project-CB Navigation And Post View Result

## Status

Implemented.

## Implementation Summary

- Regenerated `assets/js/site-data.js` with full post `content` for all 40 active posts.
- Updated `assets/js/main.js` to render Project-CB-style recursive group navigation in the left sidebar on all pages.
- Updated `assets/js/blog.js` so `/blog/` can show either a filtered list or a post detail view via `?post=<id>`.
- Added lightweight Markdown rendering for headings, lists, paragraphs, links, inline code, and fenced code blocks.
- Added a right-side post table of contents based on rendered heading tags.
- Extended `assets/css/style.css` for group tree rows, document headings, code blocks, inline code, and sticky TOC.

## Verification

- `node --check assets/js/main.js` exited with status `0`.
- `node --check assets/js/blog.js` exited with status `0`.
- Data check confirmed all 40 posts include `content`.
- Browser verification at `http://localhost:4173/`:
  - left sidebar no longer contains Home/About links
  - left sidebar renders Project-CB group tree with 18 rows including `전체 글`
  - no JavaScript console errors
- Browser verification at `http://localhost:4173/blog/?post=45`:
  - title renders as `Docker 이론`
  - detail view renders 17 heading TOC entries
  - no JavaScript console errors
- Browser verification at `http://localhost:4173/blog/?post=14`:
  - title renders as `TypeScript의 유틸리티 타입, 언제 어떻게 써야 할까?`
  - detail view renders 3 heading TOC entries
  - 2 fenced code blocks and 7 code elements render
  - no JavaScript console errors
