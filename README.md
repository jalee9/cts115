# CTS 115 Study Guide

A visual, student-friendly study companion for **CTS 115: Information Systems Business Concepts**.
Each of the 16 modules summarizes one textbook chapter with key ideas, diagrams, real-world examples, flashcards, and an ungraded self-check quiz.

**Live site:** https://jalee9.github.io/cts115/

Developed by **Jennifer Lee**, Professor, Wake Technical Community College, for CTS 115: Information Systems Business Concepts. ([LinkedIn](https://www.linkedin.com/in/jskinnerlee/))

Course content written and curated by Jennifer Lee. Site design and code built with the help of [Claude](https://claude.ai) by Anthropic.

> This guide summarizes ideas in plain language. It doesn't replace the course textbook,
> *Information Systems: A Manager's Guide to Harnessing Technology* (FlatWorld), which has the full readings, cases, and videos.

---

## For web development students: how this site works

The site is built with **plain HTML, CSS, and JavaScript**. There's no framework, no build tool, and no server code.
Every file is commented so you can learn by reading it. Start with the files in the order below.

### 1. Folder structure

```
cts115/
├── index.html            ← Home page (module cards + progress bar)
├── glossary.html         ← Searchable glossary of every key term
├── modules/
│   ├── module-01.html    ← One page per module (16 total)
│   └── ...
├── css/
│   └── styles.css        ← ALL the styling for every page
├── js/
│   ├── main.js           ← Menu, flashcards, quizzes, progress tracking
│   ├── glossary.js       ← Search and filter logic for the glossary
│   └── glossary-data.js  ← The glossary terms (just data, no logic)
└── README.md             ← You are here
```

### 2. Suggested reading order

| Step | File | What you'll learn |
|------|------|-------------------|
| 1 | `modules/module-01.html` | Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<figure>`), accessible forms, and inline SVG diagrams |
| 2 | `css/styles.css` | Custom properties (variables), Flexbox, CSS Grid, `clamp()`, pseudo-elements, media queries, and BEM-style class names |
| 3 | `js/main.js` | `querySelector`, event listeners, `data-*` attributes, `aria-*` state, IntersectionObserver, and `localStorage` |
| 4 | `glossary.html` + `js/glossary.js` | Filtering an array, building HTML from data with `.map()`, escaping text for security, and live search |

### 3. Key ideas to look for

- **Progressive enhancement.** All the content is in the HTML, so the site still works if JavaScript fails. JavaScript only adds the extras (quiz grading, card flipping, search).
- **One stylesheet, one script.** Every page shares `styles.css` and `main.js`. Each JavaScript feature checks whether its HTML is on the page before running.
- **Accessibility built in.**
  - A "Skip to main content" link (press Tab on any page)
  - Exactly one `<h1>` per page and headings in order
  - Every form control has a `<label>`
  - Flashcards are real `<button>`s with `aria-pressed`, so they work with the keyboard
  - Quiz feedback uses `aria-live` so screen readers announce results
  - Diagrams use `role="img"` with a `<title>` and `<desc>` that describe them
  - Visible focus outlines, WCAG AA color contrast, and `prefers-reduced-motion` support
- **No images needed for the banners.** The navy/gold course banners are recreated with CSS gradients and pseudo-elements, so the text stays sharp and readable.

### 4. Try it yourself

1. **Inspect it.** Right-click anything and choose *Inspect*. Change a CSS value in DevTools and watch the page update.
2. **Change the theme.** Edit the colors at the top of `css/styles.css` (section 1, "Design tokens") and see every page update.
3. **Add a glossary term.** Add an object to `js/glossary-data.js`, then search for it on the glossary page.
4. **Run it locally.** Download the repo and double-click `index.html`. No server is needed.
5. **Test accessibility.** Unplug your mouse and use only Tab, Shift+Tab, Enter, and Space. Or run a Lighthouse audit in Chrome DevTools.

### 5. Hosting on GitHub Pages

This site is hosted free on **GitHub Pages**:
1. Push the files to a GitHub repository (with `index.html` at the top level).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. After a minute or two, the site is live at `https://USERNAME.github.io/REPO-NAME/`.

The empty `.nojekyll` file tells GitHub Pages to serve the files exactly as they are, without processing them through Jekyll.

---

*Content is written in plain language for a community college introductory course. Facts and terms follow the course textbook. A few current events have been updated through 2025.*
