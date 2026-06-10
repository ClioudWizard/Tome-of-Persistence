# Tome-of-Persistence
Gilgamesh

## Dashboard Reference

See `DASHBOARD_DOCUMENT.md` for the Sovereign Mesh visualization prompt and Barracks environment guidance.

> Agent reference: alias and workflow helpers are documented in `README_ALIASES.md` at the repository root.

## DevEngine Build Integration

This repository now includes a runtime scaffold for `__DevEngine` and a Crostini-ready build helper.

### Quick start

1. From your local project root:
   - `cd ~/Tome-of-Persistence`
   - `npm install`
   - `npm test`

2. To validate the build helper:
   - `bash setup_crostini_build.sh`

3. To bootstrap the repo health flow in one command:
   - `bash bootstrap_repo.sh`
   - or `npm run bootstrap`

4. To use the DevEngine CLI:
   - `npm run cli -- status`
   - `npm run cli -- run line-content`
   - `npm run cli -- kairos`

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

## Shell aliases and wrapped workflows

Load the helper aliases for fast repo commands:

```bash
source /workspaces/Tome-of-Persistence/tome_aliases.sh
```

Add it to your shell startup file for automatic availability:

```bash
if [[ -f /workspaces/Tome-of-Persistence/tome_aliases.sh ]]; then
  source /workspaces/Tome-of-Persistence/tome_aliases.sh
fi
```

Available commands:

- `tome` — jump to the repo root
- `tt` or `tome_test` — run the repo test harness
- `tb` or `tome_bootstrap` — run the full bootstrap flow
- `tr` or `tome_resource` — regenerate the resource environment
- `tl` or `tome_load` — source `resource_env/load_resource_env.sh`
- `tome_spell` — bootstrap + load the resource environment in one chained flow
- `tome_cli <args>` — run the DevEngine CLI from the repo root

For full alias documentation and configuration details, see `README_ALIASES.md`.

