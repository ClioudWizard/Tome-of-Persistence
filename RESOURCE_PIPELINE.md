# Crostini Resource Environment Pipeline

This repository now supports a piped resource environment for Crostini/Linux VM experiments.

## Purpose

The `crostini_resource_pipeline.sh` helper creates a reproducible resource environment from the current shell and links the local `devtools-pipeline` workspace if available.

## How it works

- Detects Crostini or Linux VM environment by hostname and `/etc/lsb-release`.
- Exports a filtered set of shell variables into `resource_env/resource.env`.
- Generates `resource_env/load_resource_env.sh` to source the piped environment.
- Optionally links `~/devtools-pipeline` into the workspace if the directory exists.

## Usage

1. From your Crostini VM shell inside the repository:
   ```bash
   cd /workspaces/Tome-of-Persistence
   bash crostini_resource_pipeline.sh
   ```
2. Load the generated environment:
   ```bash
   source resource_env/load_resource_env.sh
   ```
3. Run project experiments with the piped-in environment:
   ```bash
   npm test
   # or any experiment command
   ```

## Notes

- The generated file is safe to commit if you want a shared project resource entrypoint, but it does not contain sensitive secrets unless they are present in your current shell.
- If your Crostini home contains `devtools-pipeline`, it will be linked into the workspace for direct project integration.
