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
- a piped Crostini resource environment for experiments

## Crostini Resource Pipeline

This project also includes a resource environment helper that pipes your Crostini shell state into the workspace.

### Bootstrap the resource environment

1. Run from your Crostini VM:
   - `bash crostini_resource_pipeline.sh`
2. Load the generated pipeline:
   - `source resource_env/load_resource_env.sh`
3. Run your experiments with the injected environment:
   - `npm test`
   - `npm run resource:bootstrap`

If you want to migrate the project into your VM and initialize the Crostini bridge, use:

- `bash migrate_to_crostini.sh`

See `RESOURCE_PIPELINE.md` and `CROSTINI_MIGRATION.md` for details.

