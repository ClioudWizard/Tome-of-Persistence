# Tome-of-Persistence
Gilgamesh

## 🚀 Quick Start (Crostini Linux VM)

```bash
cd ~/Tome-of-Persistence

# Pull latest changes
git pull origin main

# Install all dependencies
npm install

# Test the build
npm test
```

---

## 📚 Main Components

### 1. **DevEngine Runtime** (`__DevEngine/`)
Mock runtime for DOM traversal, telemetry, and feature extraction.

```bash
npm test  # Run test harness
```

See [`__DevEngine/docs/README.md`](/__DevEngine/docs/README.md) for details.

### 2. **AI DevTools CLI** (`ai-devtools/`)

#### **Mode A: Local (API-Keyless - Recommended for VM)**

```bash
cd ai-devtools
npm install  # Only needed first time
node cli-local.js
```

✅ **Works offline, no API keys needed**
✅ **Template-based code generation**
✅ **Static code analysis**
✅ **Optional Ollama for better AI**

#### **Mode B: Cloud API (Requires API Keys)**

```bash
cd ai-devtools
export GEMINI_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"
node cli.js
```

See [`ai-devtools/README.md`](ai-devtools/README.md) for full documentation.

### 3. **Crostini Resource Pipeline**

Capture and inject your Linux VM environment:

```bash
bash crostini_resource_pipeline.sh
source resource_env/load_resource_env.sh
npm test
```

See [`RESOURCE_PIPELINE.md`](RESOURCE_PIPELINE.md) for details.

---

## 🎯 AI DevTools - Local Mode Quick Reference

### Start the CLI
```bash
cd ~/Tome-of-Persistence/ai-devtools
node cli-local.js
```

### Available Commands
```
help              - Show all commands
ask <query>       - Ask a question
generate <type>   - Generate code (function, test, module, component, api)
analyze <file>    - Analyze code file
debug <error>     - Debug error message
refactor <file>   - Suggest refactoring
doc <file>        - Generate documentation
load <dir>        - Load project
context           - Show project context
export json|md    - Export conversation
history           - View history
ollama            - Setup Ollama guide
exit              - Quit
```

### Usage Examples

**Generate a function:**
```bash
🔎 ai-devtools> generate function "shuffle array"
```

**Analyze code:**
```bash
🔎 ai-devtools> analyze src/app.js
```

**Debug error:**
```bash
🔎 ai-devtools> debug "TypeError: Cannot read property 'map'"
```

**Ask a question:**
```bash
🔎 ai-devtools> ask How do I implement binary search?
```

---

## 🤖 Upgrade to Ollama (For Better AI - Optional)

Ollama provides local AI inference completely offline.

```bash
# Install Ollama (one-time setup)
curl https://ollama.ai/install.sh | sh

# Download a model (one-time setup)
ollama pull mistral

# Run Ollama in background
ollama serve &

# Set environment and run CLI
export OLLAMA_HOST=localhost:11434
cd ~/Tome-of-Persistence/ai-devtools
node cli-local.js
```

✅ **Auto-detected by cli-local.js**
✅ **Falls back to templates if Ollama unavailable**
✅ **Completely free and offline**

---

## 📦 Directory Structure

```
Tome-of-Persistence/
├── ai-devtools/                    # AI DevTools CLI
│   ├── cli.js                      # Cloud API mode
│   ├── cli-local.js                # Local mode (recommended for VM)
│   ├── package.json
│   ├── README.md
│   └── lib/
│       ├── manager.js              # AI provider management
│       ├── local-ai.js             # Local pattern matching + Ollama
│       ├── local-analyzer.js       # Static code analysis
│       ├── local-generator.js      # Template-based generation
│       ├── parser.js
│       ├── context.js
│       └── generator.js
│
├── __DevEngine/                    # Runtime scaffold
│   ├── core/
│   │   ├── monolith.js            # Main runtime
│   │   ├── findDeep.js            # DOM traversal
│   │   └── telemetry.js           # Logging & tracing
│   ├── scripts/                   # Utility scripts
│   ├── docs/                      # Documentation
│   └── test/
│       └── run.js                 # Test harness
│
├── agents/                         # Sovereign Mesh agents
├── resource_env/                   # Generated resource pipeline
├── package.json
├── README.md                       # This file
├── RESOURCE_PIPELINE.md
├── CROSTINI_MIGRATION.md
├── DASHBOARD_DOCUMENT.md
└── setup_crostini_build.sh
```

---

## 🔗 Important Files

| File | Purpose |
|------|---------|
| [`ai-devtools/README.md`](ai-devtools/README.md) | Full AI DevTools documentation |
| [`__DevEngine/docs/README.md`](__DevEngine/docs/README.md) | DevEngine runtime docs |
| [`RESOURCE_PIPELINE.md`](RESOURCE_PIPELINE.md) | Crostini environment pipeline |
| [`CROSTINI_MIGRATION.md`](CROSTINI_MIGRATION.md) | VM migration guide |
| [`DASHBOARD_DOCUMENT.md`](DASHBOARD_DOCUMENT.md) | Dashboard visualization |

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Validate build
bash setup_crostini_build.sh

# Generate resource pipeline
bash crostini_resource_pipeline.sh

# Run AI DevTools (local mode - no API keys)
cd ai-devtools
node cli-local.js

# Run AI DevTools (cloud mode - with API keys)
export GEMINI_API_KEY="your-key"
node ai-devtools/cli.js
```

---

## 📋 Feature Comparison

### AI DevTools Modes

| Feature | Local Mode | Cloud Mode |
|---------|-----------|-----------|
| **Setup** | Immediate ✅ | Needs API keys |
| **Cost** | Free ✅ | Cloud fees |
| **Offline** | Yes ✅ | No |
| **Code Gen** | Templates ✅ | AI-powered |
| **Analysis** | Static ✅ | AI-powered |
| **Ollama** | Auto-detect ✅ | No |

### DevEngine Runtime

| Feature | Status |
|---------|--------|
| DOM traversal | ✅ Complete |
| Shadow DOM support | ✅ Complete |
| Collision detection | ✅ Complete |
| Telemetry | ✅ Complete |
| Hook interception | ✅ Complete |
| Test harness | ✅ Complete |

---

## 🐛 Troubleshooting

### Files not found after git pull
```bash
git pull origin main
git status  # Check for changes
ls -la ai-devtools/  # Verify directory exists
```

### Module errors in ai-devtools
```bash
cd ai-devtools
npm install  # Reinstall dependencies
```

### cli-local.js not found
```bash
cd ~/Tome-of-Persistence
git pull origin main
cd ai-devtools
node cli-local.js
```

### Ollama connection issues
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it:
ollama serve &

# Verify setup
export OLLAMA_HOST=localhost:11434
node cli-local.js  # Should auto-detect
```

---

## 📖 Learning Resources

### AI DevTools
- [Full Documentation](ai-devtools/README.md)
- [Local Mode Guide](ai-devtools/README.md#quick-start)
- [Ollama Setup](ai-devtools/README.md#upgrade-to-ollama-for-better-ai)

### DevEngine
- [Runtime Documentation](__DevEngine/docs/README.md)
- [Architecture Blueprint](__DevEngine/docs/blueprint.md)
- [Test Examples](__DevEngine/test/run.js)

### Crostini VM
- [Migration Guide](CROSTINI_MIGRATION.md)
- [Resource Pipeline](RESOURCE_PIPELINE.md)

---

## 🎯 Next Steps

1. **Update local repo:**
   ```bash
   cd ~/Tome-of-Persistence
   git pull origin main
   ```

2. **Run AI DevTools (local mode):**
   ```bash
   cd ai-devtools
   npm install
   node cli-local.js
   ```

3. **Try a command:**
   ```bash
   🔎 ai-devtools> help
   🔎 ai-devtools> generate function "hello world"
   ```

4. **Optional: Install Ollama for better AI**
   ```bash
   curl https://ollama.ai/install.sh | sh
   ollama pull mistral
   ```

---

## 📝 License

MIT

## 👤 Author

ClioudWizard

---

**✨ Start with local mode - no API keys needed! ✨**
