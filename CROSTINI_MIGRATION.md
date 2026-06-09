# Crostini VM Migration

This guide helps you move the `Tome-of-Persistence` repository into your Crostini VM and activate the bridged resource environment.

## Steps

1. Open a terminal inside your Crostini VM.
2. Run this migration helper from your VM shell:

```bash
bash /path/to/repo/migrate_to_crostini.sh
```

If the helper is not already available inside the VM, clone the repository manually first:

```bash
cd ~
git clone https://github.com/ClioudWizard/Tome-of-Persistence.git
cd Tome-of-Persistence
bash migrate_to_crostini.sh
```

3. Load the generated environment:

```bash
source resource_env/load_resource_env.sh
```

4. Confirm the bridge is active:

```bash
hostname
whoami
pwd
echo "$DEVTOOLS_PIPELINE"
```

5. Run the DevEngine test harness:

```bash
npm test
```

## Notes

- The helper clones the repo into `~/Tome-of-Persistence` inside the VM.
- If the repo already exists in that location, the script will print an update note instead of recloning.
- The script also runs `npm install` and bootstraps the resource environment.
