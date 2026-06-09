import fs from 'fs';
import path from 'path';

export class AIAssistantManager {
  constructor() {
    this.config = this.loadConfig();
    this.gemini = null;
    this.claude = null;
    this.conversationHistory = [];
  }
  
  loadConfig() {
    const configPath = path.join(process.env.HOME || '/root', '.ai-devtools', 'config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {
      provider: 'gemini',
      geminiKey: process.env.GEMINI_API_KEY || '',
      claudeKey: process.env.ANTHROPIC_API_KEY || '',
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048
    };
  }
  
  async initialize() {
    const configDir = path.join(process.env.HOME || '/root', '.ai-devtools');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    try {
      if (this.config.geminiKey) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        this.gemini = new GoogleGenerativeAI(this.config.geminiKey);
      }
    } catch (err) {
      console.log('⚠️  Gemini SDK not installed. Run: npm install @google/generative-ai');
    }
    
    try {
      if (this.config.claudeKey) {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        this.claude = new Anthropic({ apiKey: this.config.claudeKey });
      }
    } catch (err) {
      console.log('⚠️  Claude SDK not installed. Run: npm install @anthropic-ai/sdk');
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
      return 'No AI provider configured. Please set GEMINI_API_KEY or ANTHROPIC_API_KEY environment variable.';
    }
  }
  
  async queryGemini(prompt) {
    try {
      const model = this.gemini.getGenerativeModel({ model: this.config.model });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      this.conversationHistory.push({ role: 'user', content: prompt });
      this.conversationHistory.push({ role: 'assistant', content: text });
      return text;
    } catch (error) {
      return `Error querying Gemini: ${error.message}`;
    }
  }
  
  async queryClaude(prompt) {
    try {
      const response = await this.claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: this.config.maxTokens,
        messages: [{ role: 'user', content: prompt }]
      });
      const text = response.content[0].text;
      this.conversationHistory.push({ role: 'user', content: prompt });
      this.conversationHistory.push({ role: 'assistant', content: text });
      return text;
    } catch (error) {
      return `Error querying Claude: ${error.message}`;
    }
  }
  
  async analyzeCode(code, filename) {
    const prompt = `Analyze this code and provide insights on:\n1. Code quality and style\n2. Potential bugs or issues\n3. Performance considerations\n4. Security concerns\n\nFilename: ${filename}\n\n\`\`\`\n${code}\n\`\`\``;
    return this.query(prompt);
  }
  
  async debugError(errorMsg) {
    const prompt = `I encountered this error. Please help me debug it and suggest fixes:\n\n${errorMsg}\n\nProvide:\n1. What this error means\n2. Common causes\n3. Step-by-step debugging approach\n4. Potential solutions`;
    return this.query(prompt);
  }
  
  async suggestRefactoring(code, filename) {
    const prompt = `Please review this code and suggest refactoring improvements:\n\nFilename: ${filename}\n\n\`\`\`\n${code}\n\`\`\`\n\nSuggest improvements for:\n1. Readability\n2. Maintainability\n3. Performance\n4. Best practices\n5. Code reuse`;
    return this.query(prompt);
  }
  
  async generateDocumentation(code, filename) {
    const prompt = `Generate comprehensive documentation for this code:\n\nFilename: ${filename}\n\n\`\`\`\n${code}\n\`\`\`\n\nInclude:\n1. Overview and purpose\n2. Parameters and return values\n3. Usage examples\n4. Edge cases\n5. Dependencies`;
    return this.query(prompt);
  }
  
  formatContext(context) {
    if (!context || Object.keys(context).length === 0) return '';
    return `Context:\n${JSON.stringify(context, null, 2)}`;
  }
}
