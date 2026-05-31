# Static Blog Data Expansion Plan

## Tier

Tier 3: leader plus two exploration subagents.

## Goal

Add a real `/blog/` static page and migrate Project-CB's active group, post-list, and career/history data into the GitHub Pages static site.

## Sources

- Group and post data: `/Users/devconative/data/Project-CB/myBlog-backup.sql`
- Entity/filter behavior:
  - `/Users/devconative/data/Project-CB/src/entities/Group.ts`
  - `/Users/devconative/data/Project-CB/src/entities/Board.ts`
  - `/Users/devconative/data/Project-CB/src/modules/group/get-group-list.ts`
  - `/Users/devconative/data/Project-CB/src/modules/board/get-board-list.ts`
- Career data: `/Users/devconative/data/Project-CB/src/front/src/Components/main/CareerSection.tsx`

## Approach

- Create `blog/index.html` for `/blog/` routing on GitHub Pages.
- Create `assets/js/site-data.js` from Project-CB data.
- Create `assets/js/blog.js` to render group tree and all post lists.
- Create `assets/js/career.js` to render full career/history data on the home page.
- Update home navigation and hero button to link to `blog/`.
- Keep everything static and build-free.

## Data Rules

- Match Project-CB API behavior by including only `flag = 0` groups and posts.
- Preserve group hierarchy through `g_reference`.
- Preserve all active post titles, dates, group ids, and short previews.
- Preserve all active career entries from Project-CB `CAREER_DATA`.

