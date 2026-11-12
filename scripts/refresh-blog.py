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
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def post_entry(path):
    """Return (date, slug, title) for one post, or exit saying what it's missing."""
    match = DATED_NAME.match(path.name)
    if not match:
        sys.exit(f"{path.name}: post filenames carry a YYYY-MM-DD- prefix")
    for line in path.read_text().split("\n"):
        if line.startswith("# "):
            # Inline HTML in a heading (a fathom citation span) belongs to the
            # post; the lists take its words and code ticks.
            return match.group(1), path.stem, re.sub(r"<[^>]+>", "", line[2:]).strip()
    sys.exit(f"{path.name}: no `# ` heading to take the title from")


def sidebar(posts):
    """The nav docsify loads on a blog route: the index, then posts by year.

    An entry leads with its month and day; the year heading above it carries the
    rest. docsify titles the browser tab after the active sidebar link's `title`
    attribute when it has one, so each link names the post there, as plain text,
    and the date stays out of the tab.
    """
    lines = [BEGIN, "", "- [Blog](/blog/)", ""]
    for year in sorted({date[:4] for date, _, _ in posts}, reverse=True):
        lines.append(f"- **{year}**")
        for date, slug, title in posts:
            if date.startswith(year):
                month, day = int(date[5:7]), int(date[8:10])
                # The space after the date is text, not styling, so the label
                # still reads "Nov 11 Title" on a stale or missing stylesheet.
                label = f'<span class="post-date">{MONTHS[month - 1]} {day}</span> {title}'
                tab = title.replace("`", "").replace('"', "&quot;")
                lines.append(f'  - [{label}](/blog/{slug}.md "{tab}")')
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
