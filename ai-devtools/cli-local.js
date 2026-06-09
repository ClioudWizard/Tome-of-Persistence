#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { LocalAIAssistant } from './lib/local-ai.js';
import { LocalCodeAnalyzer } from './lib/local-analyzer.js';
import { LocalCodeGenerator } from './lib/local-generator.js';
import { CommandParser } from './lib/parser.js';
import { ContextManager } from './lib/context.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assistant = new LocalAIAssistant();
const analyzer = new LocalCodeAnalyzer();
const generator = new LocalCodeGenerator();
const parser = new CommandParser();
const context = new ContextManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '🔎 ai-devtools> '
});

const commands = {
  help: {
    description: 'Show available commands',
    handler: () => {
      console.log('\n📚 Available Commands:');
      console.log('  help                    - Show this help message');
      console.log('  init                    - Initialize local AI setup');
      console.log('  config                  - Show current configuration');
      console.log('  ask <query>             - Ask AI assistant a question');
      console.log('  generate <type>         - Generate code (function, test, module)');
      console.log('  analyze <file>          - Analyze code file');
      console.log('  debug <error>           - Get debugging suggestions');
      console.log('  refactor <file>         - Suggest code refactoring');
      console.log('  doc <file>              - Generate documentation');
      console.log('  context                 - Show project context');
      console.log('  load <project-dir>      - Load project context');
      console.log('  export <format>         - Export conversation (json, md)');
      console.log('  clear                   - Clear conversation history');
      console.log('  history                 - Show conversation history');
      console.log('  ollama                  - Setup Ollama for better AI');
      console.log('  exit                    - Exit the CLI\n');
    }
  },
  
  init: {
    description: 'Initialize setup',
    handler: async () => {
      console.log('\n⚙️  Initializing AI DevTools (Local Mode)...\n');
      await assistant.initialize();
      console.log('✅ Setup complete!\n');
    }
  },
  
  config: {
    description: 'Show configuration',
    handler: () => {
      console.log('\n⚙️  Configuration:');
      console.log(JSON.stringify(assistant.config, null, 2));
      console.log(`\n📡 Current Mode: ${assistant.mode.toUpperCase()}\n`);
    }
  },
  
  ask: {
    description: 'Ask assistant',
    handler: async (query) => {
      if (!query) {
        console.log('⚠️  Usage: ask <query>');
        return;
      }
      console.log('\n🤔 Processing...\n');
      const response = await assistant.query(query, context.getContext());
      console.log(`💬 Assistant:\n${response}\n`);
      context.addInteraction('ask', query, response);
    }
  },
  
  generate: {
    description: 'Generate code',
    handler: async (type, ...args) => {
      if (!type) {
        console.log('⚠️  Usage: generate <type> [description]');
        console.log('  Types: function, test, module, component, api');
        return;
      }
      console.log(`\n🔨 Generating ${type}...\n`);
      const description = args.join(' ') || type;
      const generated = await generator.generate(type, description);
      console.log('📄 Generated Code:');
      console.log(generated);
      console.log('');
      context.addInteraction('generate', type, generated);
    }
  },
  
  analyze: {
    description: 'Analyze code',
    handler: (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n🔍 Analyzing code...\n');
      const analysis = analyzer.analyzeCode(code, file);
      const output = analyzer.formatAnalysis(analysis);
      console.log(output);
      context.addInteraction('analyze', file, output);
    }
  },
  
  debug: {
    description: 'Debug error',
    handler: async (error) => {
      if (!error) {
        console.log('⚠️  Usage: debug <error-message>');
        return;
      }
      console.log('\n🐛 Debugging...\n');
      const suggestions = await assistant.query(`Debug this error: ${error}`);
      console.log(`🔧 Suggestions:\n${suggestions}\n`);
      context.addInteraction('debug', error, suggestions);
    }
  },
  
  refactor: {
    description: 'Suggest refactoring',
    handler: (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n♻️  Analyzing refactoring opportunities...\n');
      // Use local analyzer
      const analysis = analyzer.analyzeCode(code, file);
      const suggestions = analyzer.getCodeSuggestions(code);
      let output = `📊 Refactoring Suggestions for ${file}:\n\n`;
      suggestions.forEach(s => output += `  💡 ${s}\n`);
      console.log(output);
      context.addInteraction('refactor', file, output);
    }
  },
  
  doc: {
    description: 'Generate documentation',
    handler: (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n📖 Generating documentation...\n');
      const doc = `// Documentation for ${file}\n\n${this.extractJSDoc(code)}`;
      console.log(doc);
      context.addInteraction('doc', file, doc);
    }
  },
  
  context: {
    description: 'Show project context',
    handler: () => {
      const ctx = context.getContext();
      console.log('\n📋 Project Context:');
      console.log(JSON.stringify(ctx, null, 2));
      console.log('');
    }
  },
  
  load: {
    description: 'Load project',
    handler: (projectDir) => {
      if (!projectDir) {
        console.log('⚠️  Usage: load <project-directory>');
        return;
      }
      if (!fs.existsSync(projectDir)) {
        console.log(`⚠️  Directory not found: ${projectDir}`);
        return;
      }
      console.log(`\n📂 Loading project from ${projectDir}...`);
      context.loadProject(projectDir);
      console.log('✅ Project context loaded.\n');
    }
  },
  
  export: {
    description: 'Export conversation',
    handler: (format) => {
      format = format || 'json';
      if (!['json', 'md'].includes(format)) {
        console.log('⚠️  Format must be json or md');
        return;
      }
      const exported = context.exportConversation(format);
      const filename = `conversation.${format === 'json' ? 'json' : 'md'}`;
      fs.writeFileSync(filename, exported);
      console.log(`\n💾 Exported to ${filename}\n`);
    }
  },
  
  clear: {
    description: 'Clear history',
    handler: () => {
      context.clearHistory();
      console.log('\n🗑️  Conversation history cleared.\n');
    }
  },
  
  history: {
    description: 'Show history',
    handler: () => {
      const hist = context.getHistory();
      console.log('\n📜 Conversation History:');
      if (hist.length === 0) {
        console.log('  (empty)');
      } else {
        hist.forEach((entry, i) => {
          console.log(`  ${i + 1}. ${entry.type}: ${entry.input.substring(0, 60)}...`);
        });
      }
      console.log('');
    }
  },
  
  ollama: {
    description: 'Setup Ollama',
    handler: () => {
      console.log('\n🤖 Ollama Setup Guide\n');
      console.log('1. Download Ollama: https://ollama.ai');
      console.log('2. Install and run: ollama serve');
      console.log('3. In another terminal: ollama pull mistral');
      console.log('4. Set OLLAMA_HOST: export OLLAMA_HOST=localhost:11434');
      console.log('5. Restart ai-devtools for automatic Ollama detection\n');
      console.log('Supported models: mistral, llama2, neural-chat, etc.\n');
    }
  },
  
  exit: {
    description: 'Exit CLI',
    handler: () => {
      console.log('\n👋 Goodbye!\n');
      process.exit(0);
    }
  }
};

async function processCommand(line) {
  const { command, args } = parser.parse(line);
  
  if (!command) return;
  
  const cmd = commands[command];
  if (!cmd) {
    console.log(`⚠️  Unknown command: ${command}. Type 'help' for available commands.\n`);
    return;
  }
  
  try {
    await cmd.handler(...args);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
  }
}

async function main() {
  console.log('\n🔎 AI DevTools - Local Mode (No API Keys Required)');
  console.log('Type "help" for available commands\n');
  
  await assistant.initialize();
  
  rl.prompt();
  
  rl.on('line', async (line) => {
    await processCommand(line.trim());
    rl.prompt();
  });
  
  rl.on('close', () => {
    console.log('\n👋 Goodbye!\n');
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
