docs:
    docsify serve docs --open

# Refresh per-project language stats in docs/projects.yml from the GitHub API
refresh-languages:
    python3 scripts/refresh-languages.py
