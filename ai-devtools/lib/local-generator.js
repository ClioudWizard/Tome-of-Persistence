/**
 * Local Code Generator - Template-based code generation
 * No API required - uses pattern matching and templates
 */
export class LocalCodeGenerator {
  constructor() {
    this.templates = this.initializeTemplates();
  }
  
  initializeTemplates() {
    return {
      function: {
        basic: `/**
 * Function description
 * @param {type} param - Parameter description
 * @returns {type} Return description
 */
function myFunction(param) {
  if (!param) {
    throw new Error('Parameter is required');
  }
  
  // Implementation
  const result = processParam(param);
  
  return result;
}`,
        
        async: `/**
 * Async function
 * @async
 * @param {type} param - Parameter description
 * @returns {Promise<type>} Return description
 */
async function myAsyncFunction(param) {
  try {
    const result = await fetchData(param);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`,
        
        recursive: `/**
 * Recursive function
 * @param {type} param - Parameter description
 * @param {number} depth - Recursion depth (prevent infinite loops)
 * @returns {type} Return description
 */
function recursiveFunction(param, depth = 0) {
  const MAX_DEPTH = 10;
  if (depth > MAX_DEPTH) {
    throw new Error('Max recursion depth exceeded');
  }
  
  if (isBaseCase(param)) {
    return baseCase;
  }
  
  return recursiveFunction(nextParam, depth + 1);
}`
      },
      
      test: {
        jest: `describe('MyModule', () => {
  beforeEach(() => {
    // Setup
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  describe('myFunction', () => {
    it('should work with valid input', () => {
      const result = myFunction('valid');
      expect(result).toBeDefined();
    });
    
    it('should throw with invalid input', () => {
      expect(() => myFunction(null)).toThrow();
    });
    
    it('should handle edge cases', () => {
      const result = myFunction('');
      expect(result).toEqual(expectedValue);
    });
  });
});`,
        
        integration: `describe('API Integration', () => {
  it('should fetch data successfully', async () => {
    const data = await fetchAPI();
    expect(data).toHaveProperty('id');
  });
  
  it('should handle errors gracefully', async () => {
    await expect(fetchAPI('invalid')).rejects.toThrow();
  });
});`
      },
      
      module: `/**
 * Module description
 * @module moduleName
 */

/**
 * Initialize the module
 */
export function init() {
  console.log('Module initialized');
}

/**
 * Main functionality
 */
export function main(options = {}) {
  const { debug = false } = options;
  if (debug) console.log('Debug mode enabled');
  
  // Implementation
}

/**
 * Cleanup
 */
export function destroy() {
  console.log('Module destroyed');
}

export default { init, main, destroy };`,
      
      component: `import React, { useState, useEffect } from 'react';

/**
 * Component description
 * @component
 * @example
 * return <MyComponent title="Hello" />
 */
function MyComponent({ title = 'Default' }) {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Fetch data or setup
    return () => {
      // Cleanup
    };
  }, []);
  
  const handleClick = () => {
    setState(prev => !prev);
  };
  
  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={handleClick}>Toggle</button>
      {state && <p>State is true</p>}
    </div>
  );
}

export default MyComponent;`,
      
      api: `import express from 'express';

const router = express.Router();

/**
 * GET endpoint
 */
router.get('/api/resource/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    const resource = getResource(id);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST endpoint
 */
router.post('/api/resource', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    const resource = createResource(data);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;`
      }
    };
  }
  
  async generate(type, description) {
    const template = this.selectTemplate(type, description);
    
    return `// 📝 Generated from template\n// Description: ${description}\n\n${template}\n\n// 💡 Customize this template for your needs`;
  }
  
  selectTemplate(type, description) {
    const desc = description.toLowerCase();
    
    if (type === 'function') {
      if (desc.includes('async') || desc.includes('fetch') || desc.includes('promise')) {
        return this.templates.function.async;
      }
      if (desc.includes('recursive') || desc.includes('tree') || desc.includes('graph')) {
        return this.templates.function.recursive;
      }
      return this.templates.function.basic;
    }
    
    if (type === 'test') {
      if (desc.includes('integration') || desc.includes('api')) {
        return this.templates.test.integration;
      }
      return this.templates.test.jest;
    }
    
    if (type === 'module') {
      return this.templates.module;
    }
    
    if (type === 'component') {
      return this.templates.component;
    }
    
    if (type === 'api') {
      return this.templates.api;
    }
    
    return this.templates.function.basic;
  }
}
