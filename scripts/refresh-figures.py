#!/usr/bin/env python3
"""Rewrite the figures in a blog post from gathered commit and change-request data.

repo-viz reads the commit history, tack records the change requests I authored, and
a change-request event export carries every open and close behind the WIP count.
Produce the repo-viz input next to the sibling checkout:

    python3 ../chris-peterson/repo-viz.py --json --months 12 --no-open > /tmp/repoviz.json
    python3 scripts/refresh-figures.py /tmp/repoviz.json /tmp/cr-events.json

The event export is `{"events": [[epoch, kind, open_after], ...]}` in chronological
order, where kind is 0 for an open and 1 for a close, and `open_after` is how many
stood open once that event landed. Nothing identifying a change request is read.

Each figure is replaced between its `cpv:begin`/`cpv:end` markers, so everything
around it in the post -- the caption, the prose -- is left alone.
"""

import calendar
import json
import re
import sys
from collections import OrderedDict, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from statistics import pstdev
from zoneinfo import ZoneInfo

import yaml

POST = Path(__file__).resolve().parent.parent / "docs" / "blog" / "2026-08-28-too-much.md"

# The commits are placed in the week they were made in, which is the author's
# wall clock rather than the API's UTC.
LOCAL = ZoneInfo("America/Los_Angeles")

# Rows are dropped below this many active weeks, so the chart shows sustained
# work rather than every one-off touch.
MIN_ACTIVE_WEEKS = 3

# My profile repo: a README and a handful of dotfiles, so a row of it says
# nothing about where the work went.
SKIP_PROJECTS = {"chris-peterson"}

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

TACK = Path.home() / ".tack" / "routes"

# What a peak of this size works out to once the days are treated as the handful
# of independent episodes they are. From generalised-Pareto and GEV fits over the
# same eleven years, which land at once in 141 years and once in 83.
RETURN_PERIOD = "once-in-a-century"

# The width every full-bleed figure in the post is drawn at.
FIG_W = 763

# A change request this counts is one a tack shipped as its deliverable. Tacks
# also *link* CRs -- a trial vehicle, a related MR someone else opened -- and
# those are references rather than authorship, so they stay out.
CR_URL = re.compile(r"/(merge_requests|pull)/\d+")


def commit_times(data):
    """Every commit in the payload as a local-time datetime."""
    start = datetime.strptime(data["windowStart"], "%Y-%m-%dT%H:%M:%SZ").replace(
        tzinfo=timezone.utc)
    for repo in data["repos"]:
        for minutes in repo["at"]:
            yield repo["name"], (start + timedelta(minutes=minutes)).astimezone(LOCAL)


def bucket(count, edges):
    """The heat class for a count, given the upper edge of each band."""
    if count == 0:
        return "cpv-h0"
    for i, edge in enumerate(edges):
        if count <= edge:
            return f"cpv-h{i + 1}"
    return f"cpv-h{len(edges) + 1}"


def legend(edges):
    """Swatch-and-number key for a set of bucket edges.

    The labels are derived from the same edges that pick each cell's colour, so
    the key can't come to describe a scale the chart isn't using. Advances are
    measured off the 11px axis face; `none` is left out because an empty cell is
    the one band a reader doesn't need told.
    """
    labels = []
    for i, edge in enumerate(edges):
        low = 1 if i == 0 else edges[i - 1] + 1
        labels.append(str(low) if low == edge else f"{low}\u2013{edge}")
    labels.append(f"{edges[-1] + 1}+")

    out, x = ['<g class="cpv-legend">'], 0.0
    for i, label in enumerate(labels):
        out.append(f'<rect class="cpv-h{i + 1}" x="{x:g}" y="2" width="11" height="11" rx="2"/>')
        out.append(f'<text class="cpv-ax" x="{x + 15:g}" y="12">{label}</text>')
        x += 15 + len(label) * 6.2 + 11.9
    out.append('</g>')
    return out


def cell(cls, x, y, w, h, where, count):
    """One heat cell. `data-tip` is what the hover readout shows, which is the
    only place the count appears now that the charts carry no legend."""
    n = "no commits" if count == 0 else "1 commit" if count == 1 else f"{count} commits"
    return (f'<rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
            f'data-tip="{where} · {n}"/>')


def clock(hour):
    """An hour of the day as prose: 0 -> 12am, 13 -> 1pm."""
    return f"{hour % 12 or 12}{'am' if hour < 12 else 'pm'}"


def hour_figure(times):
    """Commits by weekday and hour."""
    grid = [[0] * 24 for _ in DAYS]
    for _, when in times:
        grid[when.weekday()][when.hour] += 1

    edges = [4, 9, 19, 29]
    size, pitch, gutter, top = 22, 24, 42, 40
    width = gutter + 24 * pitch
    height = top + len(DAYS) * pitch + 6
    weekend = sum(sum(grid[d]) for d in (5, 6))
    total = sum(sum(row) for row in grid)
    # Read off the grid rather than stated, so the span the label claims is the
    # one the cells actually show however the year turns out.
    lit = [h for h in range(24) if any(grid[d][h] for d in range(len(DAYS)))]

    out = [
        f'<svg class="cpv" viewBox="0 0 {width} {height}" role="img" '
        f'aria-label="Heatmap of commits by weekday and hour of day. Activity fills every '
        f'day of the week including Saturday and Sunday, and spans {clock(lit[0])} to '
        f'{clock(lit[-1])}. '
        f'{round(weekend / total * 100)}% of commits land at the weekend.">'
    ] + legend(edges)
    for h in range(0, 24, 3):
        label = "12a" if h == 0 else "12p" if h == 12 else f"{h % 12}{'a' if h < 12 else 'p'}"
        out.append(f'<text class="cpv-ax" x="{gutter + h * pitch + size / 2}" y="32" '
                   f'text-anchor="middle">{label}</text>')
    for d, day in enumerate(DAYS):
        y = top + d * pitch
        out.append(f'<text class="cpv-row" x="{gutter - 9}" y="{y + 15.5}" '
                   f'text-anchor="end">{day}</text>')
        for h in range(24):
            n = grid[d][h]
            hour = "12am" if h == 0 else "12pm" if h == 12 else \
                f"{h % 12}{'am' if h < 12 else 'pm'}"
            out.append(cell(bucket(n, edges), gutter + h * pitch, y, size, size,
                            f"{day} {hour}", n))
    out.append("</svg>")
    return "\n".join(out), width


def week_figure(times):
    """One row per project, one cell per week, ordered by when each first appeared."""
    now = datetime.now(LOCAL)
    jan1 = datetime(now.year, 1, 1, tzinfo=LOCAL)
    origin = jan1 - timedelta(days=jan1.weekday())
    this_monday = (now - timedelta(days=now.weekday())).replace(
        hour=0, minute=0, second=0, microsecond=0)
    weeks = (this_monday - origin).days // 7 + 1

    counts = {}
    for name, when in times:
        index = (when - origin).days // 7
        if 0 <= index < weeks and name not in SKIP_PROJECTS:
            counts.setdefault(name, [0] * weeks)[index] += 1

    rows = []
    for name, row in counts.items():
        active = sum(1 for c in row if c)
        if active >= MIN_ACTIVE_WEEKS:
            rows.append((next(i for i, c in enumerate(row) if c), -sum(row), name, row))
    rows.sort()

    edges = [1, 4, 9, 19]
    size, pitch, gutter, top, rh = 15, 17, 168, 40, 15
    width = gutter + weeks * pitch
    height = top + len(rows) * rh + 6

    out = [
        f'<svg class="cpv" viewBox="0 0 {width} {height}" role="img" '
        f'aria-label="Heatmap with one row per project and one cell per week, ordered by '
        f'when each project first appeared. Rows keep being added down the chart and few '
        f'of them stop.">',
    ] + legend(edges)

    labelled = set()
    for i in range(weeks):
        monday = origin + timedelta(weeks=i)
        for offset in range(7):
            day = monday + timedelta(days=offset)
            if day.day == 1 and day.year == now.year and day.month not in labelled:
                labelled.add(day.month)
                out.append(f'<text class="cpv-ax" x="{gutter + i * pitch}" y="32">'
                           f'{day:%b}</text>')
                break

    for r, (_, _, name, row) in enumerate(rows):
        y = top + r * rh
        out.append(f'<text class="cpv-row" x="{gutter - 9}" y="{y + 11}" '
                   f'text-anchor="end">{name}</text>')
        for i, n in enumerate(row):
            monday = origin + timedelta(weeks=i)
            out.append(cell(bucket(n, edges), gutter + i * pitch, y, size, 13,
                            f"{name} · week of {monday:%b %-d}", n))
    out.append("</svg>")
    return "\n".join(out), width


def daily_open(events):
    """Every day the record covers as (date, how many stood open at the end of it)."""
    days, standing, day = [], 0, None
    for at, _, level in events:
        when = datetime.fromtimestamp(at, timezone.utc).date()
        if day is None:
            day = when
        while day < when:
            days.append((day, standing))
            day += timedelta(days=1)
        standing = level
    days.append((day, standing))
    return days


def percentile(values, q):
    """The qth percentile of a sorted list, interpolated between neighbours."""
    i = (len(values) - 1) * q / 100
    lo = int(i)
    hi = min(lo + 1, len(values) - 1)
    return values[lo] + (values[hi] - values[lo]) * (i - lo)


def wip_bands(before):
    """Where the days before this year sat, as (ceiling, label) from the bottom up.

    Percentiles rather than a mean and standard deviations: the count spends most
    of its days in single digits and has a long thin tail, so a symmetric spread
    around the mean describes a distribution this isn't.
    """
    ordered = sorted(before)
    return [(round(percentile(ordered, q)), f"p{q}") for q in (50, 95, 99)]


def wip_figure(events, year):
    """How many change requests stood open on each day, against the years before."""
    daily = daily_open(events)
    days = [(d, v) for d, v in daily if d.year == year]
    before = [v for d, v in daily if d.year < year]
    if not days or not before:
        sys.exit(f"no change-request history either side of {year}")

    bands = wip_bands(before)
    standing = days[-1][1]
    ceiling = (max(v for _, v in days) // 20 + 1) * 20

    width, height = 763, 262
    left, right, top, bottom = 34, 92, 22, 28
    iw, ih = width - left - right, height - top - bottom
    origin = date(year, 1, 1)
    span = (days[-1][0] - origin).days + 1

    def x(d):
        return left + (d - origin).days / span * iw

    def y(v):
        return top + ih - v / ceiling * ih

    out = [
        f'<svg class="cpv" viewBox="0 0 {width} {height}" role="img" '
        f'aria-label="How many change requests I had open on each day of {year}. Shaded '
        f'bands across the bottom mark where the {len(before):,} days before this year '
        f'sat: half of them at {bands[0][0]} or below, {bands[2][0]} or below on 99 in '
        f'100. The line opens the year at {days[0][1]}, leaves the bands for good in '
        f'April, and stands at {standing}.">',
    ]

    for i, (edge, label) in enumerate(bands):
        floor = bands[i - 1][0] if i else 0
        out.append(f'<rect class="cpv-band cpv-band{i}" x="{left}" y="{y(edge):.1f}" '
                   f'width="{iw}" height="{y(floor) - y(edge):.1f}" '
                   f'data-tip="{label} of the {len(before):,} days before {year} '
                   f'&#183; {floor} to {edge} open"/>')
        out.append(f'<text class="cpv-band-t" x="{width - right + 7}" '
                   f'y="{y(edge) + 4:.1f}" data-tip="{label} &#183; {edge} open">'
                   f'{label}</text>')

    for v in range(0, ceiling + 1, 20):
        out.append(f'<line class="cpv-grid" x1="{left}" x2="{width - right}" '
                   f'y1="{y(v):.1f}" y2="{y(v):.1f}"/>')
        out.append(f'<text class="cpv-ax" x="{left - 8}" y="{y(v) + 4:.1f}" '
                   f'text-anchor="end">{v}</text>')

    step = []
    for i, (d, v) in enumerate(days):
        step.append(f'{"M" if i == 0 else "L"}{x(d):.1f},{y(v):.1f}')
        step.append(f'L{x(d + timedelta(days=1)):.1f},{y(v):.1f}')
    out.append(f'<path class="cpv-level" d="{" ".join(step)}"/>')

    labelled = set()
    for d, _ in days:
        if d.day == 1 and d.month not in labelled:
            labelled.add(d.month)
            out.append(f'<text class="cpv-ax" x="{x(d):.1f}" y="{height - 9}" '
                       f'text-anchor="middle">{d:%b}</text>')

    spread = pstdev(before)
    sigma = (standing - sum(before) / len(before)) / spread
    # The return period is the figure that survives scrutiny; the sigma count is
    # arithmetic on days that carry over from one another, so it reads far rarer
    # than it is. Both are quoted, neither derived from the other.
    verdict = (f"{standing} open &#183; a {RETURN_PERIOD} peak, and {sigma:.1f} "
               f"standard deviations above a typical day")
    out.append(f'<circle class="cpv-now" cx="{x(days[-1][0] + timedelta(days=1)):.1f}" '
               f'cy="{y(standing):.1f}" r="3.5" data-tip="{verdict}"/>')
    out.append(f'<text class="cpv-now-t" x="{width - right + 7}" '
               f'y="{y(standing) + 5:.1f}" data-tip="{verdict}">{standing} open</text>')
    out.append("</svg>")
    return "\n".join(out), width



def delivered_per_month(routes, year):
    """Distinct CRs shipped as a tack deliverable, by the month the tack closed."""
    months = defaultdict(set)
    for path in sorted(routes.glob("*.yaml")):
        for tack in (yaml.safe_load(path.read_text()) or {}).get("tacks") or []:
            when = re.match(rf"{year}-(\d{{2}})", str(tack.get("done_at") or ""))
            url = (tack.get("deliverable") or {}).get("url") or ""
            if when and CR_URL.search(url):
                months[int(when.group(1))].add(url.split("#")[0].rstrip("/"))
    return {month: len(urls) for month, urls in months.items()}


def cr_figure(routes):
    """Change requests delivered per month, with the running month projected."""
    now = datetime.now(LOCAL)
    counts = delivered_per_month(routes, now.year)
    months = sorted(counts)
    if not months:
        sys.exit(f"{routes}: no change requests found")

    # The running month is only part-served, so its bar is what has landed and a
    # dashed outline carries the rest of the month at the rate so far.
    days_in = calendar.monthrange(now.year, now.month)[1]
    partial = months[-1] == now.month
    projected = round(counts[now.month] * days_in / now.day) if partial else 0

    # Sized to the width its sibling figures run at, so a reader scrolling the post
    # meets one column rather than three. The bars take their share of that.
    # A fixed hundred rather than a scale fitted to the tallest bar, so the reader
    # measures the year against a round number instead of against its own worst
    # month. The projection is the one thing allowed to run past it.
    width, height, left, right = FIG_W, 230, 34, 20
    axis_max, base, apex = 100, 200.0, 40.0
    pitch = (width - left - right) / len(months)
    bar = pitch * 0.64
    scale = (base - apex) / axis_max

    out = [
        f'<svg class="cpv" viewBox="0 0 {width:g} {height}" role="img" '
        f'aria-label="Bar chart of change requests delivered per month against a scale '
        f'of a hundred, rising steeply from January. The running month is drawn with a '
        f'dashed outline showing where it lands at the rate so far, above the hundred '
        f'line.">',
    ]
    for v in range(0, axis_max + 1, 20):
        y_tick = base - v * scale
        out.append(f'<line class="cpv-grid" x1="{left}" x2="{width - right}" '
                   f'y1="{y_tick:.1f}" y2="{y_tick:.1f}"/>')
        out.append(f'<text class="cpv-ax" x="{left - 8}" y="{y_tick + 4:.1f}" '
                   f'text-anchor="end">{v}</text>')
    for i, month in enumerate(months):
        x = left + i * pitch + (pitch - bar) / 2
        n = counts[month]
        name = calendar.month_abbr[month]
        if partial and month == now.month:
            top = base - projected * scale
            out.append(f'<rect class="cpv-ghost" x="{x:g}" y="{top:.1f}" width="{bar:.1f}" '
                       f'height="{base - top:.1f}" rx="3" '
                       f'data-tip="{name} · ~{projected} at the rate so far"/>')
            out.append(f'<text class="cpv-guess" x="{x + bar / 2:.1f}" '
                       f'y="{top + 13:.1f}" text-anchor="middle">?</text>')
            tip = f"{name} · {n} so far, through the {now.day}th"
        else:
            tip = f"{name} · {n} change requests"
        y = base - n * scale
        out.append(f'<rect class="cpv-bar{" cpv-partial" if partial and month == now.month else ""}" '
                   f'x="{x:g}" y="{y:.1f}" width="{bar:.1f}" height="{n * scale:.1f}" rx="3" '
                   f'data-tip="{tip}"/>')
        out.append(f'<text class="cpv-ax" x="{x + bar / 2:.1f}" y="{height - 11}" '
                   f'text-anchor="middle">{name}</text>')
    out.append("</svg>")
    return "\n".join(out), width



def splice(text, marker, svg, width):
    pattern = re.compile(
        rf"<!-- cpv:begin {marker} -->.*?<!-- cpv:end {marker} -->", re.S)
    if not pattern.search(text):
        sys.exit(f"{POST.name}: no cpv:begin/cpv:end markers for {marker!r}")
    figure = (f'<!-- cpv:begin {marker} -->\n'
              f'<div class="cpv-fig cpv-fig--{marker}" style="--fig-w:{width}px">\n'
              f'<div class="cpv-scroll">{svg}</div>\n'
              f'<!-- cpv:end {marker} -->')
    return pattern.sub(lambda _: figure, text, count=1)


def main():
    if len(sys.argv) != 3:
        sys.exit(f"usage: {sys.argv[0]} <repo-viz.json> <cr-events.json>")
    data = json.loads(Path(sys.argv[1]).read_text())
    year = datetime.now(LOCAL).year
    jan1 = datetime(year, 1, 1, tzinfo=LOCAL)
    times = [(name, when) for name, when in commit_times(data) if when >= jan1]

    text = POST.read_text()
    events = json.loads(Path(sys.argv[2]).read_text())["events"]
    svg, width = wip_figure(events, year)
    text = splice(text, "wip", svg, width)
    print(f"  wip: {width}px wide")
    for marker, build in [("hour", hour_figure), ("week", week_figure)]:
        svg, width = build(times)
        text = splice(text, marker, svg, width)
        print(f"  {marker}: {width}px wide")
    svg, width = cr_figure(TACK)
    text = splice(text, "cr", svg, width)
    print(f"  cr: {width:g}px wide")
    POST.write_text(text)
    print(f"{len(times)} commits -> {POST}")


if __name__ == "__main__":
    main()
