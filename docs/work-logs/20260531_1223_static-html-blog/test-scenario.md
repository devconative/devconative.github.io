# Static HTML GitHub Pages Blog Test Scenario

## Manual Browser Checks

1. Serve the repository root with a static server.
2. Open the local URL in the in-app browser.
3. Confirm the page shows:
   - left navigation
   - profile block
   - hero section
   - about, career, skills, blog, contact sections
4. Click the navigation toggle:
   - desktop: content shifts with the open navigation
   - mobile width: navigation overlays the content
5. Click theme toggle:
   - theme changes between dark and light
   - reload preserves the selected theme
6. Click section links:
   - page scrolls to the matching section
7. Check console logs:
   - no runtime errors from `assets/js/main.js`

## Command Checks

Run:

```bash
find . -maxdepth 3 -type f | sort
```

Expected core files:

```text
./.gitignore
./.nojekyll
./assets/css/style.css
./assets/js/main.js
./docs/work-logs/20260531_1223_static-html-blog/plan.md
./docs/work-logs/20260531_1223_static-html-blog/result.md
./docs/work-logs/20260531_1223_static-html-blog/test-scenario.md
./index.html
```

Run:

```bash
python3 -m http.server 4173
```

Expected:

```text
Serving HTTP on :: port 4173
```

