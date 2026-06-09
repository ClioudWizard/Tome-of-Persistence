#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/ClioudWizard/Tome-of-Persistence.git"
TARGET_DIR="$HOME/Tome-of-Persistence"

if [[ -d "$TARGET_DIR" ]]; then
  echo "Target directory already exists: $TARGET_DIR"
  echo "If you want to update it, run:"
  echo "  cd \"$TARGET_DIR\" && git pull --rebase origin main"
  exit 0
fi

echo "Cloning Tome-of-Persistence into Crostini home..."
git clone "$REPO_URL" "$TARGET_DIR"
cd "$TARGET_DIR"

if command -v npm >/dev/null 2>&1; then
  echo "Installing npm dependencies..."
  npm install
else
  echo "npm is not installed. Install Node.js and npm in your Crostini VM before running this script."
  exit 1
fi

echo "Generating the Crostini resource environment..."
bash crostini_resource_pipeline.sh

echo "Migration complete."
echo "Next steps:"
echo "  cd \"$TARGET_DIR\""
echo "  source resource_env/load_resource_env.sh"
echo "  npm test"
