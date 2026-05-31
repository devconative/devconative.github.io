# Project-CB Navigation And Post View Plan

## Tier

Tier 3: leader plus Project-CB navigation exploration subagent.

## Goal

Make the static GitHub Pages site behave closer to Project-CB:

- Left navigation shows the blog group tree instead of Home/About/Career links.
- Home/About/Career content remains on the right side, styled more like a document.
- Blog posts can be opened into a detail view with Markdown-style headings, code blocks, inline code, and a right-side heading table of contents.

## Implementation Notes

- Extend `site-data.js` to include full post `content`.
- Render the shared left group tree in `assets/js/main.js`.
- Render blog list and detail views in `assets/js/blog.js`.
- Add document/post detail styles to `assets/css/style.css`.

