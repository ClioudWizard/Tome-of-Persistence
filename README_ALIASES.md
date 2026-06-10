# Tome of Persistence Aliases and Shell Workflow Helpers

This file documents the alias and wrapper functions provided by `tome_aliases.sh`.

## Purpose

The aliases are designed to give you fast, repeatable commands for working with the repository and its Crostini/Linux VM workflows.

## Setup

Source the helpers from your shell session:

```bash
source /workspaces/Tome-of-Persistence/tome_aliases.sh
```

For automatic availability, add the following to your shell startup file (`~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`):

```bash
if [[ -f /workspaces/Tome-of-Persistence/tome_aliases.sh ]]; then
  source /workspaces/Tome-of-Persistence/tome_aliases.sh
fi
```

## Available helpers

### `tome`

Change directory to the repository root:

```bash
tome
```

### `tt` / `tome_test`

Run the repository test harness from the repo root:

```bash
tt
# or
```

```bash
tome_test
```

### `tc` / `tome_check`

Verify Node and npm versions:

```bash
tc
```

### `tome_build`

Run the build helper from the repo root:

```bash
tome_build
```

### `tr` / `tome_resource`

Regenerate the piped Crostini resource environment:

```bash
tr
# or
```

```bash
tome_resource
```

### `tl` / `tome_load`

Source the generated `resource_env` loader:

```bash
tl
# or
```

```bash
tome_load
```

### `tb` / `tome_bootstrap`

Run the full bootstrap flow:

```bash
tb
# or
```

```bash
tome_bootstrap
```

This executes the same workflow as `bash bootstrap_repo.sh`.

### `tome_spell`

A chained workflow that runs the full bootstrap flow and then loads the generated environment:

```bash
tome_spell
```

### `tome_cli <args>`

Run the DevEngine CLI from the repo root with arbitrary arguments:

```bash
tome_cli status
```

## Notes

- These helpers always operate from the repository root regardless of your current working directory.
- `tome_spell` is the fastest way to bootstrap the repo and load the environment in one command.
- Keep the `tome_aliases.sh` file in the repo root so it stays in sync with the project.
