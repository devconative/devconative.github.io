# Static Blog Data Expansion Test Scenario

## Command Checks

```bash
test -f blog/index.html && test -f assets/js/site-data.js && test -f assets/js/blog.js && test -f assets/js/career.js
```

Expected: exit status `0`.

```bash
node -e "require('fs').readFileSync('assets/js/site-data.js','utf8'); require('fs').readFileSync('assets/js/blog.js','utf8'); require('fs').readFileSync('assets/js/career.js','utf8'); console.log('ok')"
```

Expected: `ok`.

## Browser Checks

1. Serve the repo with `python3 -m http.server 4173`.
2. Open `http://localhost:4173/`.
3. Confirm the left navigation has a Blog link that navigates to `/blog/`.
4. Confirm the Career section shows the full Project-CB history, not two placeholder rows.
5. Open `http://localhost:4173/blog/`.
6. Confirm the group tree appears.
7. Confirm all active post list entries appear and can be filtered by group/search.
8. Confirm no JavaScript console errors.

