#!/usr/bin/env python3
"""Refresh per-project language stats in docs/projects.yml from the GitHub API.

For each project that carries a `languages:` block, the language byte counts are
read from GitHub's linguist API and rounded to the nearest 5% (largest-remainder
allocation, so the bars sum to exactly 100). GitHub's linguist excludes prose
such as Markdown; a language entry tagged `source: manual` is left untouched and
the auto-derived languages are scaled into whatever percentage is left over.

Run via `just refresh-languages`. Requires `gh` (authenticated) on PATH.
"""

import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

ROUND_TO = 5
YML = Path(__file__).resolve().parent.parent / "docs" / "projects.yml"


def gh_languages(owner, repo):
    result = subprocess.run(
        ["gh", "api", f"repos/{owner}/{repo}/languages"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        sys.exit(f"gh api failed for {owner}/{repo}: {result.stderr.strip()}")
    return json.loads(result.stdout)


def repo_for(url, name):
    """Map a project's url/name to a (owner, repo) pair.

    chris-peterson.github.io/<repo> -> (chris-peterson, <repo>)
    github.com/<owner>/<repo>       -> (<owner>, <repo>)
    """
    if url:
        parsed = urlparse(url)
        parts = [p for p in parsed.path.split("/") if p and p != "#"]
        if parsed.netloc == "github.com" and len(parts) >= 2:
            return parts[0], parts[1]
        if parsed.netloc.endswith("github.io") and parts:
            return parsed.netloc.split(".")[0], parts[0]
    return "chris-peterson", name


def allocate(byte_map, manual):
    """Round auto language shares to nearest 5%, filling the budget left by manual.

    manual: {name: pct} entries the recipe must not touch.
    Returns {name: pct} for the auto languages only (multiples of 5, summing to
    the leftover budget). Uses largest-remainder so the total lands exactly.
    """
    budget = 100 - sum(manual.values())
    auto = {k: v for k, v in byte_map.items() if k not in manual and v > 0}
    total = sum(auto.values())
    if budget <= 0 or total <= 0:
        return {}

    units = budget // ROUND_TO
    leftover = budget - units * ROUND_TO  # nonzero only if a manual pct isn't a multiple of 5
    exact = {k: v / total * units for k, v in auto.items()}
    floor = {k: int(v) for k, v in exact.items()}
    remainder = units - sum(floor.values())
    for k in sorted(auto, key=lambda k: exact[k] - floor[k], reverse=True)[:remainder]:
        floor[k] += 1

    pct = {k: f * ROUND_TO for k, f in floor.items() if f > 0}
    if leftover and pct:
        pct[max(pct, key=lambda k: pct[k])] += leftover
    return pct


def block_body(lines, start, lang_indent):
    """Return the [start, end) line range of a languages block's entries."""
    end = start
    while end < len(lines):
        line = lines[end]
        if not line.strip():
            break
        if len(line) - len(line.lstrip(" ")) <= lang_indent:
            break
        end += 1
    return end


def parse_manual(body):
    """Pull {name: pct} for entries tagged `source: manual` out of a block body."""
    manual, name = {}, None
    for line in body:
        stripped = line.strip()
        if stripped.startswith("- name:"):
            name = stripped[len("- name:"):].strip()
        elif stripped.startswith("pct:"):
            pct = int(stripped[len("pct:"):].strip())
        elif stripped == "source: manual" and name is not None:
            manual[name] = pct
    return manual


def render_block(entry_indent, languages):
    """Render language entries (name, pct, optional source) at the given indent."""
    pad = " " * entry_indent
    field = " " * (entry_indent + 2)
    out = []
    for lang in languages:
        out.append(f"{pad}- name: {lang['name']}")
        out.append(f"{field}pct: {lang['pct']}")
        if lang.get("source"):
            out.append(f"{field}source: {lang['source']}")
    return out


def main():
    lines = YML.read_text().split("\n")
    out = []
    name = url = None
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        indent = len(line) - len(line.lstrip(" "))

        if stripped.startswith("- name:"):
            name, url = stripped[len("- name:"):].strip(), None
        elif stripped.startswith("url:"):
            url = stripped[len("url:"):].strip()

        if stripped != "languages:":
            out.append(line)
            i += 1
            continue

        out.append(line)
        body_start = i + 1
        body_end = block_body(lines, body_start, indent)
        body = lines[body_start:body_end]
        entry_indent = len(body[0]) - len(body[0].lstrip(" ")) if body else indent + 2

        owner, repo = repo_for(url, name)
        manual = parse_manual(body)
        auto = allocate(gh_languages(owner, repo), manual)

        merged = [{"name": n, "pct": p, "source": "manual"} for n, p in manual.items()]
        merged += [{"name": n, "pct": p} for n, p in auto.items()]
        merged.sort(key=lambda lang: lang["pct"], reverse=True)
        summary = ", ".join(f"{lang['name']} {lang['pct']}" for lang in merged)
        print(f"  {name}: {summary}")

        out.extend(render_block(entry_indent, merged))
        i = body_end

    YML.write_text("\n".join(out))


if __name__ == "__main__":
    main()
