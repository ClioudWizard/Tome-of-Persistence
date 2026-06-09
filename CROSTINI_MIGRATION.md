# Crostini Migration Guide

## Overview

This guide covers migrating the Tome-of-Persistence project into a Crostini Linux VM and establishing a bridge between the VM and your workspace.

## Prerequisites

- Crostini Linux VM running in ChromeOS
- Node.js and npm installed in the VM
- Access to the workspace or shared directory

## Migration Steps

### 1. Clone into Crostini

In your Crostini VM:

```bash
cd /home/penguin
git clone https://github.com/ClioudWizard/Tome-of-Persistence.git
cd Tome-of-Persistence
```

### 2. Run Setup Script

```bash
bash setup_crostini_build.sh
```

This will:
- Verify npm installation
- Detect the Crostini environment
- Install dependencies
- Run the test harness

### 3. Initialize Resource Pipeline

```bash
bash crostini_resource_pipeline.sh
source resource_env/load_resource_env.sh
```

### 4. Verify Installation

```bash
npm run check
npm test
```

## Workspace Bridge

### Shared Workspace Directory

If your workspace is mounted at `/mnt/chromeos/` or `/tmp/`:

```bash
# Link workspace to VM
ln -s /mnt/chromeos/workspace /home/penguin/workspace-link
export WORKSPACE_ROOT=/home/penguin/workspace-link
```

### Two-Way Sync

For continuous development, use `rsync` or `git`:

```bash
# Pull latest from workspace
git pull origin main

# Push changes back
git push origin feature/my-work
```

### IDE Integration

If using VS Code with Crostini extension:
1. Open VS Code
2. Install "Remote - SSH" or "Remote - Containers"
3. Connect to `penguin@localhost:22`
4. Clone/open the project in the VM

## Troubleshooting

### npm install fails

- Ensure npm is installed: `npm --version`
- Clear cache: `npm cache clean --force`
- Retry: `npm install`

### Tests won't run

- Verify Node.js: `node --version`
- Check file permissions: `chmod +x __DevEngine/test/run.js`
- Run directly: `node __DevEngine/test/run.js`

### Resource environment not loading

- Check the script exists: `ls -la resource_env/load_resource_env.sh`
- Verify permissions: `chmod +x resource_env/load_resource_env.sh`
- Debug: `bash -x resource_env/load_resource_env.sh`

### Workspace files not syncing

- Check mount point: `ls /mnt/chromeos/`
- Verify symlink: `readlink workspace-link`
- Use `rsync` for manual sync: `rsync -av /home/penguin/Tome-of-Persistence/ /mnt/chromeos/workspace/`

## Advanced Configuration

### Environment Customization

Edit `resource_env/resource.env` to add custom variables:

```bash
echo 'export MY_CUSTOM_VAR=custom_value' >> resource_env/resource.env
```

### Devtools Integration

Place your devtools pipeline in `~/devtools-pipeline/`:

```bash
mkdir -p ~/devtools-pipeline
# Add your devtools scripts/binaries here
bash crostini_resource_pipeline.sh
```

The pipeline will automatically link and export it.

## Next Steps

- Explore `__DevEngine/docs/` for runtime documentation
- Review `__DevEngine/test/run.js` for example usage
- Check `DASHBOARD_DOCUMENT.md` for Sovereign Mesh visualization
