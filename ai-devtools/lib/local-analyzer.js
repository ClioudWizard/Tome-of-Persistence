import fs from 'fs';
import path from 'path';

/**
 * Local Code Analyzer - No API required
 * Static analysis for code quality, patterns, and issues
 */
export class LocalCodeAnalyzer {
  constructor() {}
  
  analyzeCode(code, filename) {
    const issues = [];
    const metrics = {};
    
    // Basic metrics
    metrics.lines = code.split('\n').length;
    metrics.chars = code.length;
    metrics.functions = (code.match(/function\s+\w+|const\s+\w+\s*=/g) || []).length;
    
    // Check for common issues
    if (code.includes('console.log')) {
      issues.push('⚠️  Debug code detected (console.log)');
    }
    if (code.match(/var\s+\w+/)) {
      issues.push('💡 Consider using const/let instead of var');
    }
    if (code.match(/==(?!=)/)) {
      issues.push('🔍 Found loose equality (==) - use strict (===)');
    }
    if (code.match(/\.then\(.*\.catch|try.*catch/s) === null && code.includes('async')) {
      issues.push('⚠️  Async functions without error handling');
    }
    if (code.match(/function.*{[^{}]*}/m)?.length > 1) {
      issues.push('📌 Consider breaking down large functions');
    }
    
    return {
      filename,
      quality: 'GOOD',
      metrics,
      issues,
      suggestions: this.getCodeSuggestions(code)
    };
  }
  
  getCodeSuggestions(code) {
    const suggestions = [];
    
    if (code.length < 100) suggestions.push('Code is very short - ensure completeness');
    if (!code.includes('Error') && !code.includes('throw')) suggestions.push('Consider adding error handling');
    if (!code.includes('//') && !code.includes('/*')) suggestions.push('Add comments to explain complex logic');
    if (code.match(/function/g) && !code.match(/Test|test|describe|it\(/)) suggestions.push('Consider adding unit tests');
    
    return suggestions;
  }
  
  formatAnalysis(analysis) {
    let output = '\n📊 Code Analysis Report\n';
    output += '════════════════════════\n\n';
    
    output += `File: ${analysis.filename}\n`;
    output += `Quality: ${analysis.quality}\n\n`;
    
    output += '📈 Metrics:\n';
    output += `  Lines: ${analysis.metrics.lines}\n`;
    output += `  Characters: ${analysis.metrics.chars}\n`;
    output += `  Functions: ${analysis.metrics.functions}\n\n`;
    
    if (analysis.issues.length > 0) {
      output += 'Issues Found:\n';
      analysis.issues.forEach(issue => {
        output += `  ${issue}\n`;
      });
      output += '\n';
    }
    
    if (analysis.suggestions.length > 0) {
      output += 'Suggestions:\n';
      analysis.suggestions.forEach(suggestion => {
        output += `  💡 ${suggestion}\n`;
      });
    }
    
    return output;
  }
}
