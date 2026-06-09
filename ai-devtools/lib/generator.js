import { AIAssistantManager } from './manager.js';

export class CodeGenerator {
  constructor() {
    this.manager = new AIAssistantManager();
  }
  
  async generate(type, description) {
    const prompts = {
      function: `Generate a JavaScript/Node.js function: ${description}\nInclude:
1. Function signature with JSDoc
2. Implementation with best practices
3. Error handling
4. Usage example`,
      
      test: `Generate Jest test cases for: ${description}\nInclude:
1. Setup and teardown
2. Positive test cases
3. Edge cases
4. Error scenarios`,
      
      module: `Generate a JavaScript module: ${description}\nInclude:
1. Module structure with exports
2. Helper functions
3. Error handling
4. Configuration options`,
      
      component: `Generate a React component: ${description}\nInclude:
1. Functional component with hooks
2. Props validation
3. Event handlers
4. Styling with CSS-in-JS`,
      
      api: `Generate a REST API endpoint: ${description}\nInclude:
1. Route definition
2. Middleware
3. Error handling
4. Input validation`
    };
    
    const prompt = prompts[type] || prompts.function;
    await this.manager.initialize();
    return this.manager.query(prompt);
  }
  
  async generateTests(code, filename) {
    const prompt = `Generate comprehensive test cases for this code:\n\nFilename: ${filename}\n\`\`\`\n${code}\n\`\`\`\n\nUse Jest framework and include:\n1. Unit tests for each function\n2. Integration tests\n3. Edge case tests\n4. Error handling tests`;
    await this.manager.initialize();
    return this.manager.query(prompt);
  }
}
