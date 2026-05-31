# Static Blog Data Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real `/blog/` static page and migrate Project-CB's active group, post-list, and career/history data into the static GitHub Pages site.

**Architecture:** Static pages share `assets/css/style.css`, `assets/js/main.js`, and generated `assets/js/site-data.js`. Home uses `assets/js/career.js` to render history from data. Blog uses `assets/js/blog.js` to render active groups and posts under `/blog/index.html`.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, static GitHub Pages hosting.

---

## Tasks

### Task 1: Extract Data

**Files:**
- Create: `assets/js/site-data.js`

- [ ] Extract active `M_Group` rows where `flag = 0`.
- [ ] Extract active `M_Board` rows where `flag = 0`.
- [ ] Extract `CAREER_DATA` from Project-CB's `CareerSection.tsx`.
- [ ] Write `window.SITE_DATA = { groups, posts, career }`.

### Task 2: Add `/blog/`

**Files:**
- Create: `blog/index.html`
- Create: `assets/js/blog.js`
- Modify: `assets/css/style.css`

- [ ] Create a static blog page with the same left navigation shell.
- [ ] Render group tree, post counts, search, and full post list from `SITE_DATA`.
- [ ] Add CSS for blog page filters, group tree, and post rows.

### Task 3: Replace Home Placeholders

**Files:**
- Modify: `index.html`
- Create: `assets/js/career.js`
- Modify: `assets/js/main.js`

- [ ] Change Blog links from `#blog` to `blog/`.
- [ ] Replace the placeholder Career timeline with a `#career-list` mount.
- [ ] Render full career/history entries from `SITE_DATA`.
- [ ] Render recent posts from migrated post data.

### Task 4: Verify

**Files:**
- Modify: `docs/work-logs/20260531_1247_static-blog-data/result.md`

- [ ] Run file existence checks.
- [ ] Run JavaScript syntax/load checks.
- [ ] Serve locally and verify `/` and `/blog/` in the browser.
- [ ] Record results.

