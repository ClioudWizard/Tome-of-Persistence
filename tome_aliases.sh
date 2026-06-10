#!/usr/bin/env bash
# Source this file from your shell to expose Tome-of-Persistence workflow helpers.
# Example:
#   source /workspaces/Tome-of-Persistence/tome_aliases.sh

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function tome_repo_root() {
  printf '%s\n' "$REPO_ROOT"
}

function tome_cd() {
  cd "$REPO_ROOT" || return 1
}

function tome_check() {
  tome_cd && npm run check
}

function tome_test() {
  tome_cd && npm test
}

function tome_build() {
  tome_cd && bash setup_crostini_build.sh
}

function tome_resource() {
  tome_cd && bash crostini_resource_pipeline.sh
}

function tome_load() {
  tome_cd && source resource_env/load_resource_env.sh
}

function tome_bootstrap() {
  tome_cd && bash bootstrap_repo.sh
}

function tome_spell() {
  tome_bootstrap && tome_load
}

function tome_cli() {
  tome_cd && npm run cli -- "$@"
}

alias tome='tome_cd'
alias tb='tome_bootstrap'
alias tl='tome_load'
alias tr='tome_resource'
alias tt='tome_test'
alias tc='tome_check'
