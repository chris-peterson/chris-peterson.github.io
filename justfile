docs:
    docsify serve docs --open

# Refresh per-project language stats in docs/projects.yml from the GitHub API
refresh-languages:
    python3 scripts/refresh-languages.py

# Refresh the post list in docs/blog/README.md from the files in docs/blog/
refresh-blog:
    python3 scripts/refresh-blog.py
