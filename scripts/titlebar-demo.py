#!/usr/bin/env python3
"""Serve docs/ with a page that exercises the shared titlebar on its own.

The page lives beside this script, outside docs/, so it never deploys. It is
served from the same origin as docs/ because the shared script reads
/projects.yml and the stylesheets relative to that origin on loopback.
"""

import argparse
import functools
import http.server
import webbrowser
from pathlib import Path

HERE = Path(__file__).resolve().parent
DOCS = HERE.parent / "docs"
PAGE = HERE / "titlebar-demo.html"
ROUTE = "/titlebar-demo.html"


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?", 1)[0] != ROUTE:
            return super().do_GET()
        body = PAGE.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--project", default="pwsh-forge")
    parser.add_argument("--no-open", action="store_true")
    args = parser.parse_args()

    handler = functools.partial(Handler, directory=str(DOCS))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    url = f"http://127.0.0.1:{args.port}{ROUTE}?project={args.project}"
    print(f"Titlebar demo at {url}")
    print("Pick a project from the list, or follow a project link in the bar.")
    print("Links that would leave for another site are held on the page instead.")
    print("Ctrl-C to stop.")
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
