#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/ClioudWizard/Tome-of-Persistence.git"
TARGET_DIR="${1:-/workspaces/Tome-of-Persistence}"

if [[ ! -d "$TARGET_DIR" || ! -d "$TARGET_DIR/.git" ]]; then
  if [[ -d "$TARGET_DIR" ]]; then
    echo "ERROR: Target exists but is not a git repository: $TARGET_DIR"
    exit 1
  fi
  echo "Cloning Tome-of-Persistence into: $TARGET_DIR"
  mkdir -p "$(dirname "$TARGET_DIR")"
  git clone "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo "Installing required system packages..."
sudo apt update
sudo apt install -y git curl build-essential python3 python3-pip

echo "Installing Node.js 20.x if needed..."
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: Node.js and npm installation failed."
  exit 1
fi

echo "Installing Node dependencies..."
npm install

echo "Running build validation..."
bash setup_crostini_build.sh

echo "Bootstrap complete."
echo "Next steps:"
echo "  source resource_env/load_resource_env.sh"
echo "  npm run resource:bootstrap"
echo "  npm test"
