export class CommandParser {
  parse(input) {
    const trimmed = input.trim();
    if (!trimmed) {
      return { command: null, args: [] };
    }
    
    const parts = this.tokenize(trimmed);
    const command = parts[0];
    const args = parts.slice(1);
    
    return { command, args };
  }
  
  tokenize(input) {
    const tokens = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current) {
      tokens.push(current);
    }
    
    return tokens;
  }
}
