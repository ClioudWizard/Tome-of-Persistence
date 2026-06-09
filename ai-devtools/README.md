# 🔮 AI DevTools - Interactive CLI for Linux VM

A powerful interactive CLI for AI-powered development assistance using Google Gemini and Anthropic Claude.

## ✨ Features

✅ **AI-Powered Development**
- Interactive REPL interface
- 19 development commands
- Real-time code analysis
- Error debugging assistance
- Code generation templates
- Documentation generation

🤖 **Dual AI Provider Support**
- Google Gemini (default)
- Anthropic Claude (optional)
- Configurable switching

💾 **Project Intelligence**
- Auto-scan project structure
- Track conversation history
- Export conversations (JSON/Markdown)
- Persistent configuration

## 🚀 Installation

### Quick Start

```bash
# Navigate to project
cd ~/Tome-of-Persistence/ai-devtools

# Install dependencies
npm install

# Optional: Set API keys
export GEMINI_API_KEY="your-gemini-api-key"
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Run the CLI
node cli.js
```

### Global Installation

```bash
cd ai-devtools
npm run install-global
ai-devtools
```

## 📋 Available Commands

### Help & Info
- `help` - Display all commands
- `exit` - Quit the CLI

### Configuration
- `init` - Initialize API key configuration
- `config` - Show current settings

### AI Queries
- `ask <query>` - Ask the AI assistant
- `analyze <file>` - Analyze code file
- `debug <error>` - Debug error messages
- `refactor <file>` - Suggest code improvements
- `doc <file>` - Generate documentation

### Code Generation
- `generate function <description>` - Generate function
- `generate test <description>` - Generate test cases
- `generate module <description>` - Generate module
- `generate component <description>` - Generate React component
- `generate api <description>` - Generate API endpoint
- `test <file>` - Generate tests for file

### Project Management
- `load <project-dir>` - Load project context
- `context` - Show project information
- `history` - Show conversation history
- `export json` - Export as JSON
- `export md` - Export as Markdown
- `clear` - Clear conversation history

## 💻 Usage Examples

### Interactive Session

```bash
🔮 AI DevTools - Interactive CLI for Linux VM
Type "help" for available commands

🔮 ai-devtools> help

📚 Available Commands:
  help                    - Show this help message
  init                    - Initialize AI assistant configuration
  config                  - Show current configuration
  ask <query>             - Ask AI assistant a question
  ...

🔮 ai-devtools> ask How do I implement binary search?
🤔 Processing...

💬 Assistant:
Binary search is an efficient algorithm for finding an element in a sorted array...

🔮 ai-devtools>
```

### Generate Code

```bash
🔮 ai-devtools> generate function "validate email address"
🔨 Generating function...

📄 Generated Code:
/**
 * Validates if a string is a valid email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmail(email) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

// Usage
console.log(validateEmail('user@example.com')); // true
console.log(validateEmail('invalid-email'));   // false
```

### Analyze Code

```bash
🔮 ai-devtools> analyze src/utils.js
🔍 Analyzing code...

📊 Analysis:
✓ Code Quality: Good
⚠ Issues Found:
  - Missing error handling in line 45
  - Potential memory leak with event listener
✓ Performance: No major concerns
```

### Debug Error

```bash
🔮 ai-devtools> debug "TypeError: Cannot read property 'map' of undefined"
🐛 Debugging...

🔧 Debug Suggestions:
This error occurs when you're trying to call .map() on a value that is undefined.

Common causes:
1. Variable not initialized
2. API response not parsed correctly
3. Destructuring assignment failed

Solutions:
1. Add null checks: if (array && array.map)
2. Use optional chaining: array?.map(...)
3. Provide default value: array || []
```

### Load Project & Ask

```bash
🔮 ai-devtools> load ~/my-project
📂 Loading project from ~/my-project...
✅ Project context loaded.

🔮 ai-devtools> ask What are the main dependencies?
💬 Assistant:
Based on your package.json, the main dependencies are:
1. express@^4.18.0 - Web framework
2. react@^18.2.0 - UI library
3. axios@^1.3.0 - HTTP client
...
```

## ⚙️ Configuration

Configuration saved to `~/.ai-devtools/config.json`:

```json
{
  "provider": "gemini",
  "geminiKey": "your-key-here",
  "claudeKey": "your-key-here",
  "model": "gemini-pro",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

### Environment Variables

```bash
# API Keys
export GEMINI_API_KEY="your-gemini-key"
export ANTHROPIC_API_KEY="your-anthropic-key"

# Provider selection
export AI_PROVIDER="gemini"  # or "claude"
```

## 🔗 API Providers

### Google Gemini
- Get API key: https://ai.google.dev
- Model: `gemini-pro`
- Best for: General queries, code analysis, documentation

### Anthropic Claude
- Get API key: https://console.anthropic.com
- Model: `claude-3-sonnet-20240229`
- Best for: Complex reasoning, detailed analysis

## 📁 Project Structure

```
ai-devtools/
├── cli.js              # Main interactive CLI
├── package.json        # NPM configuration
├── README.md           # Documentation
└── lib/
    ├── manager.js      # AI provider management
    ├── parser.js       # Command parser
    ├── context.js      # Project context manager
    └── generator.js    # Code generation
```

## 🐛 Troubleshooting

### "No AI provider configured"
```bash
# Set environment variables
export GEMINI_API_KEY="your-key"
node cli.js
```

### API Connection Issues
```bash
# Verify API keys
echo $GEMINI_API_KEY
echo $ANTHROPIC_API_KEY

# Check internet connection
ping google.com
```

### Module Not Found
```bash
# Reinstall dependencies
npm install

# Or specific modules
npm install @google/generative-ai @anthropic-ai/sdk
```

## 🎯 Next Steps

1. ✅ Install and configure
2. ✅ Load your project with `load <path>`
3. ✅ Start asking questions with `ask`
4. ✅ Generate code with `generate`
5. ✅ Export conversations with `export`

## 📝 License

MIT

## 👤 Author

ClioudWizard

---

**Enjoy your AI-powered development workflow! 🚀**
