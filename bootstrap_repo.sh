#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

echo "Running bootstrap health flow in $REPO_ROOT"

npm run check
npm test
bash setup_crostini_build.sh
bash crostini_resource_pipeline.sh

echo "Bootstrap complete."
echo "Now load the generated environment with:"
echo "  source resource_env/load_resource_env.sh"
echo "Then run your commands or experiments with the piped environment."
echo "Optional: npm run resource:bootstrap"
