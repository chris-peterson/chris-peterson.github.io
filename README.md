# chris-peterson.github.io

Hub site for Chris Peterson's open source project documentation.

https://chris-peterson.github.io | [source](https://github.com/chris-peterson/chris-peterson.github.io)

## Site Layout

The site is a [Docsify](https://docsify.js.org/) SPA using Dracula/Alucard theming with a day/night toggle. The `docs/` directory is deployed to GitHub Pages via GitHub Actions, and the only thing the deploy builds is the blog index.

**Hub pattern** -- this site serves shared assets (theme CSS, titlebar, docsify-shared.js) that project sub-sites consume. The `projects.yml` manifest drives the breadcrumb repo selector across all sites.

<table>
  <tr>
    <td colspan="6" style="background:#21222c;padding:0">
      <table width="100%" cellspacing="8" cellpadding="12">
        <tr>
          <td style="background:#bd93f9;color:#282a36;text-align:center;font-size:1.2em"><b>☰ chris-peterson</b></td>
          <td style="background:#bd93f9;color:#282a36;text-align:center;font-size:1.2em"><b>/ repos ▾</b></td>
          <td style="background:#21222c"></td>
          <td style="background:#bd93f9;color:#282a36;text-align:center;font-size:1.2em">🔍</td>
          <td style="background:#bd93f9;color:#282a36;text-align:center;font-size:1.2em">🌙</td>
          <td style="background:#bd93f9;color:#282a36;text-align:center;font-size:1.2em">🐙/🦊</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="background:#21222c;vertical-align:top;padding:16px" width="25%">
      <table width="100%" cellspacing="8" cellpadding="12">
        <tr><td style="background:#8be9fd;color:#282a36;text-align:center;font-size:1.2em"><b>Sidebar Nav</b></td></tr>
        <tr><td style="background:#8be9fd;color:#282a36;text-align:center;font-size:1.2em">Home</td></tr>
        <tr><td style="background:#8be9fd;color:#282a36;text-align:center;font-size:1.2em">...</td></tr>
      </table>
    </td>
    <td colspan="5" style="background:#8be9fd;color:#282a36;vertical-align:middle;text-align:center;padding:0;font-size:1.2em" width="75%">
      <b>Hosted Documentation</b>
    </td>
  </tr>
</table>

<sup><span style="display:inline-block;width:12px;height:12px;background:#bd93f9;border-radius:2px"></span> Hub repo (this repo) · <span style="display:inline-block;width:12px;height:12px;background:#8be9fd;border-radius:2px"></span> Hosted repo (project-specific content)</sup>


## Blog

A post is `docs/blog/YYYY-MM-DD-slug.md` with its title as the first heading. Both are load-bearing: `scripts/refresh-blog.py` reads the date off the filename and the title out of the file to build the list in `docs/blog/README.md`, and fails the deploy on a post missing either.

The Pages workflow runs it, so the published index follows whatever is in `docs/blog/`. The committed copy is what a local `docsify serve docs` reads, so run `just refresh-blog` to see a new post there.

## Comments

Blog posts carry comments and reactions from this repo's GitHub Discussions, through [giscus](https://giscus.app). A post's route is its discussion — `/blog/a-post` looks for a discussion titled `blog/a-post` in the blog category, and the first comment or reaction creates it. Titles get reworded and routes don't, which is why the route is the key.

Which pages get the widget, and which repo holds the discussions, is the `comments` block in `docs/index.html`; `giscus.json` limits which origins may load those discussions. The widget follows the day/night toggle via `docs/css/giscus-dracula.css` and `giscus-alucard.css` — giscus fetches those from the deployed site, so an edit to them shows up only once it's pushed.

Discussions and the [giscus app](https://github.com/apps/giscus) both have to stay enabled on the repo; without the app, the widget renders but can't post.

## Local Testing

```bash
docsify serve docs
```
