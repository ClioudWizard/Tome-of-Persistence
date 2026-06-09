import fs from 'fs';
import path from 'path';
import http from 'http';

/**
 * Local AI Assistant - No API keys required
 * Supports: Ollama, local static analysis, template generation
 */
export class LocalAIAssistant {
  constructor() {
    this.config = this.loadConfig();
    this.ollama = null;
    this.conversationHistory = [];
    this.mode = this.detectMode();
  }
  
  loadConfig() {
    const configPath = path.join(process.env.HOME || '/root', '.ai-devtools-local', 'config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {
      mode: 'local', // local, ollama, mock
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'mistral',
      temperature: 0.7,
      maxTokens: 1024
    };
  }
  
  detectMode() {
    // Check if Ollama is running
    return this.isOllamaAvailable() ? 'ollama' : 'mock';
  }
  
  isOllamaAvailable() {
    return process.env.OLLAMA_HOST || fs.existsSync('/usr/local/bin/ollama');
  }
  
  async initialize() {
    const configDir = path.join(process.env.HOME || '/root', '.ai-devtools-local');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    console.log(`\n✅ Local AI Mode: ${this.mode.toUpperCase()}`);
    
    if (this.mode === 'ollama') {
      console.log(`🤖 Using Ollama at ${this.config.ollamaUrl}`);
      console.log(`   Model: ${this.config.ollamaModel}`);
      console.log('   Tip: Run `ollama pull mistral` to get started\n');
    } else if (this.mode === 'mock') {
      console.log('📚 Using local pattern matching & templates');
      console.log('   Install Ollama for better results: https://ollama.ai\n');
    }
    
    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }
  
  async query(prompt, context = {}) {
    if (this.mode === 'ollama') {
      return this.queryOllama(prompt, context);
    } else {
      return this.queryMock(prompt, context);
    }
  }
  
  async queryOllama(prompt, context) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        model: this.config.ollamaModel,
        prompt: prompt,
        temperature: this.config.temperature,
        stream: false
      });
      
      const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        timeout: 30000
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            this.conversationHistory.push({ role: 'user', content: prompt });
            this.conversationHistory.push({ role: 'assistant', content: result.response });
            resolve(result.response);
          } catch (err) {
            reject(err);
          }
        });
      });
      
      req.on('error', (err) => {
        console.log('\n⚠️  Ollama not available. Falling back to mock mode.\n');
        this.mode = 'mock';
        resolve(this.queryMock(prompt, context));
      });
      
      req.write(body);
      req.end();
    });
  }
  
  queryMock(prompt, context) {
    // Intelligent pattern matching responses
    const lowerPrompt = prompt.toLowerCase();
    
    // Code generation patterns
    if (lowerPrompt.includes('function') || lowerPrompt.includes('implement')) {
      return this.generateMockFunction(prompt);
    }
    if (lowerPrompt.includes('test') || lowerPrompt.includes('jest')) {
      return this.generateMockTests(prompt);
    }
    if (lowerPrompt.includes('binary search')) {
      return this.generateBinarySearch();
    }
    if (lowerPrompt.includes('sort')) {
      return this.generateSortFunction();
    }
    if (lowerPrompt.includes('email') || lowerPrompt.includes('validate')) {
      return this.generateValidator();
    }
    if (lowerPrompt.includes('error') || lowerPrompt.includes('debug')) {
      return this.generateDebugAdvice(prompt);
    }
    if (lowerPrompt.includes('refactor') || lowerPrompt.includes('improve')) {
      return this.generateRefactoringAdvice();
    }
    
    // Default response
    return `📚 Local Analysis:\n\nYour query: "${prompt}"\n\nThis is a mock response from local pattern matching. For better results, install Ollama:\n  curl https://ollama.ai/install.sh | sh\n  ollama pull mistral\n  export OLLAMA_HOST=localhost:11434`;
  }
  
  generateMockFunction(prompt) {
    return `/**
 * Generated function from local template
 * Query: ${prompt}
 */
function myFunction(input) {
  // Validate input
  if (!input) {
    throw new Error('Input is required');
  }
  
  // Process
  const result = processInput(input);
  
  // Return result
  return result;
}

// Usage example
console.log(myFunction('example'));

💡 Tip: Use 'ask "describe your function"' for more detailed generation with Ollama`;
  }
  
  generateMockTests(prompt) {
    return `describe('MyFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(input);
    expect(result).toBeDefined();
  });
  
  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow();
  });
  
  it('should validate input', () => {
    const result = myFunction(validInput);
    expect(result).toEqual(expectedOutput);
  });
});

💡 Note: Mock test generation. Install Ollama for smarter tests.`;
  }
  
  generateBinarySearch() {
    return `/**
 * Binary Search Implementation
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = arr[mid];
    
    if (midValue === target) {
      return mid;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // not found
}

// Usage
const sorted = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(sorted, 7)); // 3`;
  }
  
  generateSortFunction() {
    return `/**
 * Quick Sort Implementation
 * Time Complexity: O(n log n) average
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Usage
const nums = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(nums)); // [11, 12, 22, 25, 34, 64, 90]`;
  }
  
  generateValidator() {
    return `/**
 * Email Validator
 */
function validateEmail(email) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password Validator
 */
function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

// Tests
console.log(validateEmail('user@example.com'));  // true
console.log(validatePassword('SecurePass123'));   // true`;
  }
  
  generateDebugAdvice(prompt) {
    const errorPatterns = {
      'cannot read property': 'Check if the variable is null or undefined. Use optional chaining: obj?.property',
      'is not a function': 'Verify the function exists and is imported correctly',
      'undefined is not an object': 'Initialize objects before accessing properties',
      'syntax error': 'Check brackets, quotes, and semicolons',
      'module not found': 'Verify the file path and that npm install was run',
      'null': 'Ensure variables are initialized before use',
      'async': 'Add await keyword or use .then().catch()'
    };
    
    let advice = '🐛 Debug Suggestions (from local pattern matching):\n\n';
    
    for (const [pattern, solution] of Object.entries(errorPatterns)) {
      if (prompt.toLowerCase().includes(pattern)) {
        advice += `✅ ${solution}\n\n`;
      }
    }
    
    if (!advice.includes('✅')) {
      advice += `Common debugging steps:\n1. Add console.log() at key points\n2. Check error stack trace\n3. Verify variable types\n4. Test with sample data`;
    }
    
    return advice + '\n\n💡 Install Ollama for AI-powered debugging';
  }
  
  generateRefactoringAdvice() {
    return `♻️  Code Refactoring Suggestions:\n
1. 📌 Extract Functions\n   - Break down large functions into smaller, focused ones
   
2. 🔄 DRY (Don't Repeat Yourself)\n   - Move repeated code into reusable functions
   
3. 📦 Improve Naming\n   - Use clear, descriptive variable and function names
   
4. ⚡ Optimize Loops\n   - Consider using map(), filter(), reduce()
   
5. 🛡️  Add Error Handling\n   - Wrap risky operations in try-catch blocks
   
6. 💬 Add Comments\n   - Document complex logic and edge cases
   
7. 🧪 Write Tests\n   - Increase code coverage and reliability

💡 For AI-powered analysis, install Ollama and use 'ask' command`;
  }
}
