# Tome-of-Persistence
Gilgamesh

## Dashboard Reference

See `DASHBOARD_DOCUMENT.md` for the Sovereign Mesh visualization prompt and Barracks environment guidance.

## DevEngine Build Integration

This repository now includes a runtime scaffold for `__DevEngine` and a Crostini-ready build helper.

### Quick start

1. In your Crostini Linux VM or Linux workspace:
   - `cd /workspaces/Tome-of-Persistence`
   - `npm install`
   - `npm test`

2. To validate the build helper:
   - `bash setup_crostini_build.sh`

### Files added

- `package.json`
- `setup_crostini_build.sh`
- `__DevEngine/`
  - `core/`
  - `scripts/`
  - `docs/`
  - `test/`

### Purpose

The scaffold provides:
- a mock runtime for `__DevEngine`
- deep DOM traversal via `findDeep`
- telemetry helpers for `listComponents`, `scrapeDeepLogs`, and `traceLineage`
- a test harness for runtime validation
- Crostini VM build integration support

