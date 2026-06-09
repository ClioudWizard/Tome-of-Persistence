import { findDeep } from './findDeep.js';
import { listComponents, scrapeDeepLogs, traceLineage } from './telemetry.js';

const globalObject = typeof globalThis !== 'undefined' ? globalThis : {};

class DevEngineRuntime {
  constructor() {
    this.fetchCalls = 0;
    this.eventCalls = 0;
    this.scriptLibrary = [];
    this.logs = [];
    this.domRoot = null;
  }

  attachDOM(root) {
    this.domRoot = root;
  }

  setLogs(lines) {
    this.logs = lines;
  }

  overrideFetch() {
    return (url, options) => {
      this.fetchCalls += 1;
      return { url, status: 200, body: 'mocked' };
    };
  }

  overrideAddEventListener() {
    return (eventType, callback) => {
      this.eventCalls += 1;
      return { eventType, callback };
    };
  }

  initializeHooks() {
    return {
      fetch: this.overrideFetch(),
      addEventListener: this.overrideAddEventListener()
    };
  }

  orchestratePipeline(selector) {
    if (!this.domRoot) {
      throw new Error('DevEngine DOM root not attached');
    }
    const hooks = this.initializeHooks();
    hooks.fetch('https://mock.endpoint/test');
    hooks.addEventListener('click', () => {});
    const matched = findDeep(this.domRoot, selector, { maxDepth: 20 });
    const collision = matched.filter((node) => node.classes?.includes('collision'));
    const payload = {
      hooks,
      matched: matched.map((node) => node.tag),
      collision: { count: collision.length, issues: collision.map((node) => node.tag) },
      lineage: traceLineage(this.domRoot, 20),
      logs: scrapeDeepLogs(this.logs, selector),
      interception: { fetchCalls: this.fetchCalls, eventCalls: this.eventCalls }
    };
    this.scriptLibrary.push(payload);
    return payload;
  }
}

const runtime = new DevEngineRuntime();

if (!globalObject.__DevEngine) {
  globalObject.__DevEngine = {
    attachDOM: runtime.attachDOM.bind(runtime),
    setLogs: runtime.setLogs.bind(runtime),
    orchestratePipeline: runtime.orchestratePipeline.bind(runtime),
    listComponents: (selector) => listComponents(runtime.domRoot),
    scrapeDeepLogs: (selector) => scrapeDeepLogs(runtime.logs, selector),
    findDeep: (selector) => findDeep(runtime.domRoot, selector),
    traceLineage: (maxDepth) => traceLineage(runtime.domRoot, maxDepth),
    getScriptLibrary: () => runtime.scriptLibrary,
    __runtime: runtime
  };
}

export default globalObject.__DevEngine;
