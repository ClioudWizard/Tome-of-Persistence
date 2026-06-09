import fs from 'fs';
import path from 'path';

export class ContextManager {
  constructor() {
    this.projectContext = {};
    this.interactions = [];
    this.fileMetadata = {};
  }
  
  loadProject(projectDir) {
    this.projectContext = {
      rootDir: projectDir,
      files: this.scanDirectory(projectDir),
      package: this.loadPackageJson(projectDir),
      timestamp: new Date().toISOString()
    };
  }
  
  scanDirectory(dir, maxDepth = 3, currentDepth = 0) {
    const files = [];
    
    if (currentDepth >= maxDepth) return files;
    
    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (this.shouldIgnore(entry)) continue;
        
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile()) {
          files.push({
            path: fullPath,
            relative: path.relative(this.projectContext.rootDir || dir, fullPath),
            size: stat.size,
            type: this.getFileType(entry)
          });
        } else if (stat.isDirectory()) {
          files.push(...this.scanDirectory(fullPath, maxDepth, currentDepth + 1));
        }
      }
    } catch (err) {
      // Skip unreadable directories
    }
    
    return files;
  }
  
  loadPackageJson(projectDir) {
    try {
      const pkgPath = path.join(projectDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      }
    } catch (err) {
      // Ignore
    }
    return null;
  }
  
  shouldIgnore(entry) {
    const ignore = ['node_modules', '.git', '.env', 'dist', 'build', '.DS_Store'];
    return ignore.includes(entry) || entry.startsWith('.');
  }
  
  getFileType(filename) {
    const ext = path.extname(filename);
    return ext ? ext.substring(1) : 'unknown';
  }
  
  addInteraction(type, input, output) {
    this.interactions.push({
      type,
      input,
      output,
      timestamp: new Date().toISOString()
    });
  }
  
  getContext() {
    return {
      project: this.projectContext,
      interactionCount: this.interactions.length,
      timestamp: new Date().toISOString()
    };
  }
  
  getHistory() {
    return this.interactions;
  }
  
  clearHistory() {
    this.interactions = [];
  }
  
  exportConversation(format = 'json') {
    if (format === 'json') {
      return JSON.stringify({
        project: this.projectContext,
        interactions: this.interactions,
        exportedAt: new Date().toISOString()
      }, null, 2);
    } else if (format === 'md') {
      let md = '# AI DevTools Conversation Export\n\n';
      md += `Generated: ${new Date().toISOString()}\n\n`;
      
      if (this.projectContext.rootDir) {
        md += `## Project\n- **Root**: ${this.projectContext.rootDir}\n\n`;
      }
      
      md += '## Interactions\n\n';
      this.interactions.forEach((interaction, i) => {
        md += `### ${i + 1}. ${interaction.type}\n`;
        md += `**Input:**\n\`\`\`\n${interaction.input}\n\`\`\`\n\n`;
        md += `**Output:**\n\`\`\`\n${interaction.output}\n\`\`\`\n\n`;
      });
      
      return md;
    }
  }
}
