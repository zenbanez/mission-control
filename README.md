# Project: Mission Control

## Overview
A Next.js-based dashboard for project, task, and memory visualization.

## Sub-folders
- **public**: Static assets including logos and icons.
- **src**: Source code for the dashboard application.
- **node_modules**: Project dependencies.

## Changelog
- **2026-03-31 (v1.1)**:
  - **Clickable File Browser**: Enabled deep-linking into directories and file-level previews.
  - **Markdown Rendering**: Added `react-markdown` and `remark-gfm` for formatted previews of `.md` files.
  - **Style Stability**: Switched to browser-side Tailwind 4 compiler to bypass environment-specific PostCSS build errors.
  - **Service Management**: Implemented `scripts/start-dashboard.sh` and `scripts/rebuild-dashboard.sh` with PID-file tracking to prevent "double firing" and port conflicts.
- **2026-03-30 (v1.0)**:
  - Initial dashboard setup for project/task/memory visualization.
  - Resolved `EADDRINUSE` conflicts on port 18790 and established baseline auto-start cron.
