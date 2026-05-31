# Static HTML Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Project-CB-inspired GitHub Pages blog using only static HTML, CSS, and JavaScript.

**Architecture:** The repo root contains `index.html`, `.nojekyll`, and static assets. CSS recreates Project-CB's dark-first design tokens, fixed left navigation, responsive layout, section rhythm, and cards. JavaScript provides progressive enhancement only: menu toggle, theme toggle, reveal animation, smooth section state, and footer year.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, GitHub Pages static hosting.

---

## File Structure

- Create `index.html`: semantic one-page blog/portfolio layout.
- Create `assets/css/style.css`: theme tokens, layout, navigation, sections, cards, responsive rules.
- Create `assets/js/main.js`: navigation/theme/reveal interactions.
- Create `.nojekyll`: prevent GitHub Pages Jekyll processing.
- Create `.gitignore`: exclude `.superpowers/`, OS files, editor files.
- Modify `docs/work-logs/20260531_1223_static-html-blog/result.md`: record implementation and verification results.

### Task 1: Static Page Skeleton

**Files:**
- Create: `index.html`
- Create: `.nojekyll`
- Create: `.gitignore`

- [ ] **Step 1: Add root HTML document**

Create `index.html` with a fixed navigation shell, main content sections, and script/style references:

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Conative personal blog and portfolio">
  <title>Conative Blog</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <nav class="main-navigation open" id="site-navigation" aria-label="Primary navigation">
    <button class="expand-btn" id="nav-toggle" type="button" aria-label="메뉴 열고 닫기"></button>
  </nav>
  <div class="nav-backdrop" id="nav-backdrop" hidden></div>
  <main class="container" id="top"></main>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Add GitHub Pages support files**

Create `.nojekyll` as an empty file.

Create `.gitignore`:

```gitignore
.DS_Store
.superpowers/
.idea/
node_modules/
dist/
build/
```

- [ ] **Step 3: Verify the skeleton**

Run:

```bash
test -f index.html && test -f .nojekyll && test -f .gitignore
```

Expected: command exits with status `0`.

### Task 2: Project-CB-Inspired Content

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Fill navigation and sections**

Replace the skeleton body content with complete static sections: profile navigation, hero, about, career, skills, blog cards, and contact links. Use anchor links such as `#about`, `#blog`, and `#contact`.

- [ ] **Step 2: Verify semantic anchors**

Run:

```bash
rg 'id="(home|about|career|skills|blog|contact)"' index.html
```

Expected: all six section IDs are present.

### Task 3: Visual Styling

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: Add CSS tokens and layout**

Create `assets/css/style.css` with:

- `:root` theme variables matching Project-CB's dark-first palette.
- `html[data-theme="light"]` overrides.
- fixed `.main-navigation`.
- `.container` content shifting when navigation is open.
- responsive overlay behavior for small screens.
- section, hero, card, button, and reveal styles.

- [ ] **Step 2: Verify stylesheet is linked**

Run:

```bash
rg 'assets/css/style.css' index.html
```

Expected: one stylesheet link appears.

### Task 4: Vanilla UI Behavior

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: Add interactions**

Create `assets/js/main.js` to:

- toggle navigation open/closed
- toggle dark/light theme
- persist theme in `localStorage`
- close mobile nav on backdrop or section link click
- reveal sections with `IntersectionObserver`
- set current year

- [ ] **Step 2: Verify script is linked**

Run:

```bash
rg 'assets/js/main.js' index.html
```

Expected: one script tag appears.

### Task 5: Browser Verification

**Files:**
- Modify: `docs/work-logs/20260531_1223_static-html-blog/result.md`

- [ ] **Step 1: Start a static server**

Run:

```bash
python3 -m http.server 4173
```

Expected: server listens on port `4173`.

- [ ] **Step 2: Open in browser**

Open `http://localhost:4173/` in the in-app browser.

- [ ] **Step 3: Verify interactions**

Check:

- page renders with Project-CB-inspired layout
- navigation toggle works
- theme toggle works and persists after reload
- anchor links scroll to sections
- mobile viewport does not overlap incoherently
- browser console has no JavaScript errors

- [ ] **Step 4: Record result**

Update `docs/work-logs/20260531_1223_static-html-blog/result.md` with implemented files and verification results.

