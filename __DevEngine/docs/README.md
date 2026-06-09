# __DevEngine Runtime Documentation

## Overview

`__DevEngine` is a mock runtime environment for DOM traversal, telemetry collection, and feature extraction in Crostini VMs and Linux containers.

## Modules

### Core (`__DevEngine/core/`)
- **monolith.js** — Main runtime class; attaches to `globalThis`
- **findDeep.js** — Recursive DOM traversal with selector matching
- **telemetry.js** — Component listing, log scraping, lineage tracing

### Scripts (`__DevEngine/scripts/`)
- **ast-feature-extractor.js** — Extract code features (async, proxy detection)
- **dom-lineage-tracer.js** — Convert DOM tree to lineage array
- **ui-element-scraper.js** — Collect all UI elements with metadata
- **ui-collision-detector.js** — Identify duplicate/conflicting elements
- **feature-pipeline.js** — Orchestrate AST, DOM, and lineage analysis

## Quick Start

```bash
npm install
npm test
```

## API Reference

### Attach DOM and Logs
```javascript
engine.attachDOM(domRoot);
engine.setLogs(logLines);
```

### Run Pipeline
```javascript
const result = engine.orchestratePipeline('selector');
console.log(result.matched);      // matched nodes
console.log(result.collision);    // collision summary
console.log(result.lineage);      // full lineage
console.log(result.interception); // hook call counts
```

### Utility Functions
- `engine.findDeep(selector)` — Find matching elements
- `engine.listComponents()` — List all components
- `engine.scrapeDeepLogs(selector)` — Filter logs by selector
- `engine.traceLineage(maxDepth)` — Get full lineage

## Testing

The test harness validates:
- DOM attachment
- Selector matching
- Hook interception counts
- Collision detection
- Log scraping accuracy
