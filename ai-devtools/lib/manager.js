import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export class AIAssistantManager {
  constructor() {
    this.config = this.loadConfig();
    this.gemini = null;
    this.claude = null;
    this.conversationHistory = [];
  }
  
  loadConfig() {
    const configPath = path.join(process.env.HOME, '.ai-devtools', 'config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {
      provider: 'gemini',
      geminiKey: process.env.GEMINI_API_KEY,
      claudeKey: process.env.ANTHROPIC_API_KEY,
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048
    };
  }
  
  async initialize() {
    const configDir = path.join(process.env.HOME, '.ai-devtools');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    if (this.config.geminiKey) {
      this.gemini = new GoogleGenerativeAI(this.config.geminiKey);
    }
    
    if (this.config.claudeKey) {
      this.claude = new Anthropic({ apiKey: this.config.claudeKey });
    }
    
    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }
  
  getConfig() {
    return { ...this.config, geminiKey: '***', claudeKey: '***' };
  }
  
  async query(prompt, context = {}) {
    const contextStr = this.formatContext(context);
    const fullPrompt = `${contextStr}\n\nUser Query:\n${prompt}`;
    
    if (this.config.provider === 'claude' && this.claude) {
      return this.queryClaude(fullPrompt);
    } else if (this.gemini) {
      return this.queryGemini(fullPrompt);
    } else {
      throw new Error('No AI provider configured. Run: init');
    }
  }
  
  async queryGemini(prompt) {
    const model = this.gemini.getGenerativeModel({ model: this.config.model });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    this.conversationHistory.push({ role: 'user', content: prompt });
    this.conversationHistory.push({ role: 'assistant', content: text });
    return text;
  }
  
  async queryClaude(prompt) {
    const response = await this.claude.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: this.config.maxTokens,
      messages: [
        { role: 'user', content: prompt }
      ]
    });
    const text = response.content[0].text;
    this.conversationHistory.push({ role: 'user', content: prompt });
    this.conversationHistory.push({ role: 'assistant', content: text });
    return text;
  }
  
  async analyzeCode(code, filename) {
    const prompt = `Analyze this code and provide insights on:
1. Code quality and style
2. Potential bugs or issues
3. Performance considerations
4. Security concerns

Filename: ${filename}

\`\`\`
${code}
\`\`\``;
    return this.query(prompt);
  }
  
  async debugError(errorMsg) {
    const prompt = `I encountered this error. Please help me debug it and suggest fixes:

${errorMsg}

Provide:
1. What this error means
2. Common causes
3. Step-by-step debugging approach
4. Potential solutions`;
    return this.query(prompt);
  }
  
  async suggestRefactoring(code, filename) {
    const prompt = `Please review this code and suggest refactoring improvements:

Filename: ${filename}

\`\`\`
${code}
\`\`\`

Suggest improvements for:
1. Readability
2. Maintainability
3. Performance
4. Best practices
5. Code reuse`;
    return this.query(prompt);
  }
  
  async generateDocumentation(code, filename) {
    const prompt = `Generate comprehensive documentation for this code:

Filename: ${filename}

\`\`\`
${code}
\`\`\`

Include:
1. Overview and purpose
2. Parameters and return values
3. Usage examples
4. Edge cases
5. Dependencies`;
    return this.query(prompt);
  }
  
  formatContext(context) {
    if (!context || Object.keys(context).length === 0) return '';
    return `Context:\n${JSON.stringify(context, null, 2)}`;
  }
}
