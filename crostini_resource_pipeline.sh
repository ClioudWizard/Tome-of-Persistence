#!/usr/bin/env bash
set -euo pipefail

PIPE_DIR="resource_env"
mkdir -p "$PIPE_DIR"

HOSTNAME=$(hostname)
CROSTINI=false
if [[ -f "/etc/lsb-release" ]] && grep -qi 'CHROMEOS' /etc/lsb-release; then
  CROSTINI=true
fi
if [[ "$HOSTNAME" == "penguin" ]]; then
  CROSTINI=true
fi

if [[ "$CROSTINI" != true ]]; then
  cat <<'WARNING'
Warning: This helper is optimized for Crostini/Linux VM environments.
It will still generate a piped resource environment, but some integrations
may be specific to the `penguin` Crostini user profile.
WARNING
fi

echo "Generating resource environment in $PIPE_DIR..."

echo "# Generated resource environment for Tome-of-Persistence" > "$PIPE_DIR/resource.env"
echo "# Source this file before running project experiments." >> "$PIPE_DIR/resource.env"

declare -a VARS=(USER HOME SHELL PATH TERM LANG LC_ALL XDG_CONFIG_HOME XDG_DATA_HOME XDG_CACHE_HOME)
for key in "${VARS[@]}"; do
  if [[ -n "${!key-}" ]]; then
    printf 'export %s=%q\n' "$key" "${!key}" >> "$PIPE_DIR/resource.env"
  fi
done

echo "# Optional automation paths" >> "$PIPE_DIR/resource.env"
if [[ -d "$HOME/devtools-pipeline" ]]; then
  ln -sf "$HOME/devtools-pipeline" "$(pwd)/devtools-pipeline"
  printf 'export DEVTOOLS_PIPELINE=%q\n' "$HOME/devtools-pipeline" >> "$PIPE_DIR/resource.env"
  echo "Linked devtools-pipeline from home into workspace."
elif [[ -d "$(pwd)/devtools-pipeline" ]]; then
  printf 'export DEVTOOLS_PIPELINE=%q\n' "$(pwd)/devtools-pipeline" >> "$PIPE_DIR/resource.env"
fi

cat > "$PIPE_DIR/load_resource_env.sh" <<'EOF'
#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/resource.env" ]]; then
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/resource.env"
else
  echo "Missing resource.env in $SCRIPT_DIR"
  exit 1
fi
EOF
chmod +x "$PIPE_DIR/load_resource_env.sh"

echo "Resource environment generated: $PIPE_DIR/resource.env"
echo "Load it with: source $PIPE_DIR/load_resource_env.sh"
echo "Then run your project or experiment commands with the piped environment."