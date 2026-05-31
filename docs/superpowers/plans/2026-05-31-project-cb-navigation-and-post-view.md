# Project-CB Navigation And Post View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace section navigation with a Project-CB-style group tree and add static Markdown post detail rendering with a right-side heading table of contents.

**Architecture:** Existing static pages keep their HTML shell. `main.js` renders the shared group tree into the left navigation from `SITE_DATA`. `blog.js` owns list/detail state and Markdown-to-HTML rendering. `style.css` provides the Project-CB-inspired nav tree and document viewer styles.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, static GitHub Pages hosting.

---

## Tasks

- [ ] Include full post content in `assets/js/site-data.js`.
- [ ] Replace left nav link lists with Project-CB-style group trees.
- [ ] Add blog detail rendering and heading TOC.
- [ ] Update CSS for document content, code blocks, inline code, headings, and right TOC.
- [ ] Verify `/` and `/blog/` in browser.

