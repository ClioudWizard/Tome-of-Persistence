#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { AIAssistantManager } from './lib/manager.js';
import { CommandParser } from './lib/parser.js';
import { ContextManager } from './lib/context.js';
import { CodeGenerator } from './lib/generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manager = new AIAssistantManager();
const parser = new CommandParser();
const context = new ContextManager();
const generator = new CodeGenerator();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '🔮 ai-devtools> '
});

const commands = {
  help: {
    description: 'Show available commands',
    handler: () => {
      console.log('\n📚 Available Commands:');
      console.log('  help                    - Show this help message');
      console.log('  init                    - Initialize AI assistant configuration');
      console.log('  config                  - Show current configuration');
      console.log('  ask <query>             - Ask AI assistant a question');
      console.log('  generate <type>         - Generate code (function, test, module)');
      console.log('  analyze <file>          - Analyze code file');
      console.log('  debug <error>           - Get debugging suggestions');
      console.log('  refactor <file>         - Suggest code refactoring');
      console.log('  doc <file>              - Generate documentation');
      console.log('  test <file>             - Generate test cases');
      console.log('  context                 - Show project context');
      console.log('  load <project-dir>      - Load project context');
      console.log('  export <format>         - Export conversation (json, md)');
      console.log('  clear                   - Clear conversation history');
      console.log('  history                 - Show conversation history');
      console.log('  exit                    - Exit the CLI\n');
    }
  },
  init: {
    description: 'Initialize AI assistant',
    handler: async () => {
      console.log('\n⚙️  Initializing AI Assistant Configuration...\n');
      await manager.initialize();
      console.log('✅ Configuration saved.\n');
    }
  },
  config: {
    description: 'Show configuration',
    handler: () => {
      const config = manager.getConfig();
      console.log('\n⚙️  Current Configuration:');
      console.log(JSON.stringify(config, null, 2));
      console.log('');
    }
  },
  ask: {
    description: 'Ask assistant',
    handler: async (query) => {
      if (!query) {
        console.log('⚠️  Please provide a query. Usage: ask <query>');
        return;
      }
      console.log('\n🤔 Processing...\n');
      const response = await manager.query(query, context.getContext());
      console.log(`💬 Assistant:\n${response}\n`);
      context.addInteraction('user', query, response);
    }
  },
  generate: {
    description: 'Generate code',
    handler: async (type, ...args) => {
      if (!type) {
        console.log('⚠️  Usage: generate <type> [args]');
        console.log('  Types: function, test, module, component, api');
        return;
      }
      console.log(`\n🔨 Generating ${type}...\n`);
      const generated = await generator.generate(type, args.join(' '));
      console.log('📄 Generated Code:');
      console.log(generated);
      console.log('');
    }
  },
  analyze: {
    description: 'Analyze code',
    handler: async (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n🔍 Analyzing code...\n');
      const analysis = await manager.analyzeCode(code, file);
      console.log(`📊 Analysis:\n${analysis}\n`);
      context.addInteraction('analysis', file, analysis);
    }
  },
  debug: {
    description: 'Debug error',
    handler: async (error) => {
      if (!error) {
        console.log('⚠️  Please provide an error message or stack trace');
        return;
      }
      console.log('\n🐛 Debugging...\n');
      const suggestions = await manager.debugError(error);
      console.log(`🔧 Debug Suggestions:\n${suggestions}\n`);
      context.addInteraction('debug', error, suggestions);
    }
  },
  refactor: {
    description: 'Suggest refactoring',
    handler: async (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n♻️  Refactoring analysis...\n');
      const suggestions = await manager.suggestRefactoring(code, file);
      console.log(`✨ Refactoring Suggestions:\n${suggestions}\n`);
      context.addInteraction('refactor', file, suggestions);
    }
  },
  doc: {
    description: 'Generate documentation',
    handler: async (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n📖 Generating documentation...\n');
      const doc = await manager.generateDocumentation(code, file);
      console.log(`📚 Documentation:\n${doc}\n`);
      context.addInteraction('doc', file, doc);
    }
  },
  test: {
    description: 'Generate tests',
    handler: async (file) => {
      if (!file || !fs.existsSync(file)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
      }
      const code = fs.readFileSync(file, 'utf8');
      console.log('\n🧪 Generating test cases...\n');
      const tests = await generator.generateTests(code, file);
      console.log(`✅ Generated Tests:\n${tests}\n`);
      context.addInteraction('test', file, tests);
    }
  },
  context: {
    description: 'Show project context',
    handler: () => {
      const ctx = context.getContext();
      console.log('\n📍 Project Context:');
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
          console.log(`  ${i + 1}. ${entry.type}: ${entry.input.substring(0, 50)}...`);
        });
      }
      console.log('');
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
  console.log('\n🔮 AI DevTools - Interactive CLI for Linux VM');
  console.log('Type "help" for available commands\n');
  
  await manager.initialize();
  
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
