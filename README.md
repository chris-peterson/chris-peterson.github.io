# chris-peterson.github.io

Hub site for Chris Peterson's open source project documentation.

https://chris-peterson.github.io | [source](https://github.com/chris-peterson/chris-peterson.github.io)

## Site Layout

```mermaid
---
config:
  look: handDrawn
---
block-beta
  columns 12

  block:titlebar:12
    columns 6
    brand["☰ chris-peterson"]:1
    repos["/ repos ▾"]:1
    padding1[" "]:1
    search["🔍"]:1
    actions["🌙"]:1
    github["{src}"]:1
  end

  block:sidebar:3
    columns 1
    nav["Sidebar Nav"]
    home["Home"]
    other["..."]
  end

  block:content:9
    columns 1
    markdown["Markdown Content"]
  end

  style titlebar fill:#21222c,color:#f8f8f2
  style sidebar fill:#21222c,color:#f8f8f2
  style content fill:#282a36,color:#f8f8f2
  style padding1 fill:none,stroke:none,color:transparent
  style brand fill:#bd93f9,color:#282a36
  style repos fill:#bd93f9,color:#282a36
  style search fill:#bd93f9,color:#282a36
  style actions fill:#bd93f9,color:#282a36
  style github fill:#bd93f9,color:#282a36
  style nav fill:#8be9fd,color:#282a36
  style home fill:#8be9fd,color:#282a36
  style other fill:#8be9fd,color:#282a36
  style markdown fill:#8be9fd,color:#282a36
```

🟪 Hub repo (this repo) · 🟦 Hosted repo (project-specific content)

The site is a [Docsify](https://docsify.js.org/) SPA using Dracula/Alucard theming with a day/night toggle. The `docs/` directory is deployed to GitHub Pages via GitHub Actions — no build step required.

**Hub pattern** -- this site serves shared assets (theme CSS, titlebar, docsify-shared.js) that project sub-sites consume. The `projects.yml` manifest drives the breadcrumb repo selector across all sites.

## Local Testing

```bash
docsify serve docs
```
