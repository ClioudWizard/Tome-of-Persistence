# Resource Pipeline Documentation

## Overview

The Crostini resource pipeline captures and injects environment variables from your VM into the workspace, enabling seamless cross-environment development and testing.

## Files

- `crostini_resource_pipeline.sh` — Main bootstrap script
- `resource_env/` — Generated environment directory
  - `resource.env` — Exported environment variables
  - `load_resource_env.sh` — Loader script

## Usage

### 1. Bootstrap the Pipeline

Run from your Crostini VM:

```bash
bash crostini_resource_pipeline.sh
```

This generates:
- `resource_env/resource.env` — Captured environment
- `resource_env/load_resource_env.sh` — Loader utility

### 2. Load the Environment

In your workspace or VM shell:

```bash
source resource_env/load_resource_env.sh
```

### 3. Run Experiments

```bash
npm test
npm run resource:bootstrap
```

## Environment Variables Captured

The pipeline captures:
- `USER`, `HOME`, `SHELL`, `PATH`
- `TERM`, `LANG`, `LC_ALL`
- `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_CACHE_HOME`

## Devtools Pipeline

If `~/devtools-pipeline` exists in your home directory, it is automatically linked and exported as `$DEVTOOLS_PIPELINE` in the resource environment.

## Troubleshooting

- **Missing resource.env**: Re-run `bash crostini_resource_pipeline.sh`
- **Permission denied**: Ensure `crostini_resource_pipeline.sh` is executable: `chmod +x crostini_resource_pipeline.sh`
- **Environment not loading**: Verify `load_resource_env.sh` path and run `source` from the correct directory

## Notes

- The pipeline detects Crostini by checking `/etc/lsb-release` and hostname (`penguin`)
- Non-Crostini environments receive a warning but the pipeline still functions
- Variables are exported using `printf %q` for proper shell escaping
