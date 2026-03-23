# chris-peterson.github.io

Hub site for Chris Peterson's open source project documentation.

https://chris-peterson.github.io | [source](https://github.com/chris-peterson/chris-peterson.github.io)

## Site Layout

The site is a [Docsify](https://docsify.js.org/) SPA using Dracula/Alucard theming with a day/night toggle. The `docs/` directory is deployed to GitHub Pages via GitHub Actions — no build step required.

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


## Local Testing

```bash
docsify serve docs
```
