# hheickal.github.io — working notes

Personal academic site + blog for Hasnain Heickal. Jekyll (academicpages / Minimal Mistakes fork), served by **GitHub Pages classic build from `master`** (~1 min after push). This file is excluded from the site build.

## Workflow
- **Always `git pull --rebase` before committing** — the online editor (Sveltia CMS) and a GitHub Action commit straight to `master`.
- Text/content edits: commit and push directly, then check `gh api repos/hheickal/hheickal.github.io/pages/builds/latest`. Builds marked "errored / Page build failed" are usually just *cancelled* by a newer push.
- Layout/CSS changes: preview first. `bundle exec jekyll serve --livereload` (gems in `vendor/bundle`, git-ignored). Restart it after editing `_config.yml`. For a one-off check: `bundle exec jekyll build -d <dir> --config _config.yml,<local.yml with url: http://localhost:PORT>`.
- Headless-Chrome screenshots randomly fail to load web fonts/icons (even on the live site) — retry; don't trust a single failed render.
- CV: LaTeX lives in Overleaf only. Upload the PDF via editor (Pages → CV) or replace `files/HH_CV.pdf`; path is in `_data/cv.yml`.
- Old blog `hhjami/hhjami.github.io` was imported here and left untouched (user declined redirects).

## Where things live
- `_sass/_custom.scss` — **all custom styling** (imported last in `assets/css/main.scss`). Main site: Noto Serif everywhere, blue accent, justified text, full width. Blog (`body.blog`): Lora + Noto Serif Bengali, warm background, 40em column.
- Fonts load from Google Fonts in `_includes/head/custom.html`. `main.css` is cache-busted with `?v={{ site.time }}` in `_includes/head.html`.
- `_data/navigation.yml` — menu items; `icon` (FA5 class) or `icon_svg` (file in `_includes/icons/`); `align: right` = Blog. Phones (≤600px) show icons only.
- `_includes/masthead.html` — blog pages show only Home + Blog (left); elsewhere Blog sits alone on the right.
- `_includes/author-profile.html` — sidebar; `compact_contacts: true` in front matter → icon row instead of the list. Mobile always shows the icon row. Per-page `avatar:` overrides the photo (blog uses `caricature.jpg`).
- `_includes/sidebar.html` — `body_class: blog` → `blog-sidebar.html` (topics, languages, collapsible years; "Browse posts" toggle on phones); `sidebar_include:` adds an extra include (Publications uses `pub-topics-sidebar.html`).
- `_includes/scripts.html` — small scripts: open blog sidebar on desktop, publications topic filter (`#topic=<id>`), external links open in new tab. **Never put `<script>` inside `.sidebar`** — the theme displays it as text.
- `_includes/citation.html` — Cite box + PDF/Paper button; bolds `site.author.name` ("Hasnain Heickal") in citations.
- `_pages/cv.md` — renders the PDF with PDF.js (cdnjs) + download / open-in-tab icons.

## Blog (`_posts/`)
Front matter: `title`, `url_slug`, `published` (false = draft, hidden), `date`, `last_modified_at`, `categories` = language id, `tags` = topic ids, `permalink`.
- Languages/topics and short sidebar labels in `_data/blog.yml`, keyed by **permanent ids** (renaming a name/short label updates everywhere; never change an id). New ids from the editor are random uuids.
- `.github/workflows/blog-first-publish.yml` (+ `.github/scripts/set_publish_date.py`): when a post is `published: true` with no `permalink`, sets `date` = today (America/New_York) and locks `permalink: /posts/YYYY/MM/<url_slug>/`. Posts with a permalink are never touched.
- Default post URL `/posts/:year/:month/:title/` (`_config.yml` defaults). Pages: `/year-archive/`, `/tags/`, `/languages/`.

## Publications (`_publications/`)
13 papers (CV "Selected Publications" + Google Scholar). Front matter: `title`, `published`, `date`, `venue`, `paperurl`, `citation`, `excerpt`, `tags` (ids from `_data/publications.yml`), body `## ABSTRACT`. List page sorts by date desc with year headings and topic chips/filter.

## Online editor — https://hheickal.github.io/admin/
Sveltia CMS, config `admin/config.yml`, preview style `admin/preview.css`. Sign in with a fine-grained GitHub token (this repo, Contents RW). Sections: Blog posts, Publications, Teaching, Pages (About, CV PDF), Settings (blog languages & topics, publication topics). `last_modified_at` auto-stamps on save; settings fields hidden from preview.

## Gotchas learned
- Liquid can't do nested lookups like `a[b[0]]` — assign to a variable first.
- `_config.yml` `author.linkedin` must be the handle only (template prepends the URL).
- Theme `.greedy-nav` collapse script measures `.visible-links`; keep right-aligned items outside `.greedy-nav`.

## Open ideas (not done)
- Individual paper pages: no topic chips; sidebar still shows the full contact list.
- `_drafts/post-draft.md` is template filler (harmless).
