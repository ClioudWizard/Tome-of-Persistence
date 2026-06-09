# 🔮 AI DevTools - Interactive CLI

A powerful interactive CLI for AI-powered development assistance using Google Gemini and Anthropic Claude.

## Features

✨ **AI-Powered Assistance**
- Ask questions about code and development
- Analyze code for bugs and improvements
- Generate code snippets and complete modules
- Debug errors with AI suggestions
- Generate documentation automatically
- Suggest refactoring improvements
- Create test cases

📊 **Project Context**
- Load and track project structure
- Maintain conversation history
- Export conversations as JSON or Markdown
- Analyze multiple files

🚀 **Development Features**
- Function generation
- Test case generation
- Module scaffolding
- Component templates
- API endpoint generation

## Installation

### Prerequisites
- Node.js >= 14
- API keys for Gemini and/or Claude

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize configuration:
   ```bash
   ./cli.js
   > init
   ```

4. Set API keys:
   ```bash
   export GEMINI_API_KEY="your-gemini-key"
   export ANTHROPIC_API_KEY="your-anthropic-key"
   ```

### Global Installation

```bash
npm run install-global
ai-devtools
```

## Usage

### Interactive Mode

Start the CLI:
```bash
./cli.js
# or
ai-devtools
```

You'll see the prompt:
```
🔮 ai-devtools> 
```

### Available Commands

#### Basic Commands

**help** - Show available commands
```
> help
```

**exit** - Exit the CLI
```
> exit
```

#### Configuration

**init** - Initialize AI assistant
```
> init
```

**config** - Show current configuration
```
> config
```

#### AI Queries

**ask** - Ask a question
```
> ask How do I implement a binary search in JavaScript?
```

**analyze** - Analyze a code file
```
> analyze src/utils.js
```

**debug** - Get debugging help
```
> debug "TypeError: Cannot read property 'map' of undefined"
```

**refactor** - Suggest refactoring improvements
```
> refactor src/api.js
```

**doc** - Generate documentation
```
> doc src/helpers.js
```

#### Code Generation

**generate** - Generate code
```
> generate function "validate email addresses"
> generate test "user authentication"
> generate module "cache manager"
> generate component "user profile card"
> generate api "POST endpoint for creating users"
```

**test** - Generate test cases
```
> test src/math.js
```

#### Project Management

**load** - Load project context
```
> load /path/to/project
```

**context** - Show project context
```
> context
```

**history** - Show conversation history
```
> history
```

**clear** - Clear conversation history
```
> clear
```

**export** - Export conversation
```
> export json
> export md
```

## Configuration

Configuration is stored in `~/.ai-devtools/config.json`:

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

## Examples

### Example 1: Debug an Error

```
> debug "ReferenceError: myFunction is not defined at Object.<anonymous>"
💬 Assistant:
This error means you're trying to use a function that hasn't been defined yet.
Common causes:
1. Function is defined after it's called
2. Function is in a different scope
3. Typo in function name
...
```

### Example 2: Generate a Function

```
> generate function "shuffle an array randomly"
📄 Generated Code:

function shuffleArray(array) {
  // Fisher-Yates shuffle algorithm
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Example usage:
const nums = [1, 2, 3, 4, 5];
console.log(shuffleArray(nums));
```

### Example 3: Analyze Code

```
> analyze src/app.js
💬 Assistant:
📊 Analysis:
✓ Code Quality: Good
⚠ Issues Found:
  - Missing error handling in line 45
  - Potential memory leak with event listener
✓ Performance: No major concerns
⚠ Security: Input validation needed
...
```

### Example 4: Load Project and Ask Questions

```
> load ~/my-project
✅ Project context loaded.

> ask What are the main dependencies in this project?
💬 Assistant:
Based on the project context, the main dependencies are:
1. express - Web framework
2. react - UI library
3. axios - HTTP client
...
```

## Project Structure

```
ai-devtools/
├── cli.js                 # Main CLI entry point
├── package.json           # NPM configuration
├── README.md              # This file
└── lib/
    ├── manager.js         # AI provider management
    ├── parser.js          # Command parser
    ├── context.js         # Project context manager
    └── generator.js       # Code generator
```

## API Providers

### Google Gemini
- Get API key: https://ai.google.dev
- Model: `gemini-pro`
- Good for: General queries, code analysis, documentation

### Anthropic Claude
- Get API key: https://console.anthropic.com
- Model: `claude-3-sonnet-20240229`
- Good for: Complex reasoning, detailed analysis

## Troubleshooting

### "No AI provider configured"
```bash
# Set environment variables or run:
ai-devtools
> init
```

### API Key Issues
```bash
# Verify keys are set
echo $GEMINI_API_KEY
echo $ANTHROPIC_API_KEY

# Check config file
cat ~/.ai-devtools/config.json
```

### Commands Not Found
```bash
# Reinstall globally
npm run install-global

# Or run locally
node ./cli.js
```

## Contributing

Contributions are welcome! Please submit pull requests to improve the CLI.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
