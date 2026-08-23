#!/usr/bin/env python3
"""Refresh the post lists in docs/blog/ from the files there.

Each post contributes the date in its `YYYY-MM-DD-` filename prefix and the
title in its first `#` heading, so the two can't disagree with the post itself.
Two lists come out of that, both newest first: the index in README.md, rewritten
between the generated markers, and _sidebar.md, which docsify loads as the nav
alongside a post.

The Pages deploy runs this, so the published lists follow the files on their own.
`just refresh-blog` is for seeing a new post in the local `docsify serve docs`,
which reads the committed copy.
"""

import re
import sys
from pathlib import Path

BLOG = Path(__file__).resolve().parent.parent / "docs" / "blog"
INDEX = BLOG / "README.md"
SIDEBAR = BLOG / "_sidebar.md"

BEGIN = "<!-- generated from blog/*; the deploy regenerates it, `just refresh-blog` locally -->"
END = "<!-- /generated -->"

DATED_NAME = re.compile(r"^(\d{4}-\d{2}-\d{2})-")


def post_entry(path):
    """Return (date, slug, title) for one post, or exit saying what it's missing."""
    match = DATED_NAME.match(path.name)
    if not match:
        sys.exit(f"{path.name}: post filenames carry a YYYY-MM-DD- prefix")
    for line in path.read_text().split("\n"):
        if line.startswith("# "):
            return match.group(1), path.stem, line[2:].strip()
    sys.exit(f"{path.name}: no `# ` heading to take the title from")


def sidebar(posts):
    """The nav docsify loads on a blog route: the index, then posts by year.

    An entry is the title alone. docsify titles the browser tab after the active
    sidebar link, so anything else in the label ends up in the tab, and the year
    heading already carries where the post sits in time.
    """
    lines = [BEGIN, "", "- [Blog](/blog/)", ""]
    for year in sorted({date[:4] for date, _, _ in posts}, reverse=True):
        lines.append(f"- **{year}**")
        for date, slug, title in posts:
            if date.startswith(year):
                lines.append(f"  - [{title}](/blog/{slug}.md)")
        lines.append("")
    return "\n".join(lines)


def main():
    posts = sorted(
        (post_entry(p) for p in BLOG.glob("*.md") if p not in (INDEX, SIDEBAR)),
        reverse=True,
    )
    SIDEBAR.write_text(sidebar(posts))

    lines = INDEX.read_text().split("\n")
    try:
        start, end = lines.index(BEGIN), lines.index(END)
    except ValueError:
        sys.exit(f"{INDEX}: the generated markers aren't both there to write between")
    if start > end:
        sys.exit(f"{INDEX}: the generated markers are the wrong way round")

    body = [f"- **{date}** — [{title}](/blog/{slug}.md)" for date, slug, title in posts]
    INDEX.write_text("\n".join(lines[: start + 1] + body + lines[end:]))
    for line in body:
        print(line)


if __name__ == "__main__":
    main()
