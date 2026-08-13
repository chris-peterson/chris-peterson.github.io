#!/usr/bin/env python3
"""Refresh the post list in docs/blog/README.md from the files in docs/blog/.

Each post contributes the date in its `YYYY-MM-DD-` filename prefix and the
title in its first `#` heading, so the two can't disagree with the post itself.
The list is rewritten between the generated markers, newest first.

The Pages deploy runs this, so the published index follows the files on its own.
`just refresh-blog` is for seeing a new post in the local `docsify serve docs`,
which reads the committed copy.
"""

import re
import sys
from pathlib import Path

BLOG = Path(__file__).resolve().parent.parent / "docs" / "blog"
INDEX = BLOG / "README.md"

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


def main():
    posts = sorted(
        (post_entry(p) for p in BLOG.glob("*.md") if p != INDEX),
        reverse=True,
    )

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
