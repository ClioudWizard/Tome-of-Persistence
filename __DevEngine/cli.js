#!/usr/bin/env node
import { execFile } from 'node:child_process';
import engine from './core/monolith.js';

const args = process.argv.slice(2);
const cmd = args[0] || 'help';

function showHelp() {
  console.log(`__DevEngine CLI

Usage:
  node __DevEngine/cli.js help
  node __DevEngine/cli.js status
  node __DevEngine/cli.js run [selector]
  node __DevEngine/cli.js kairos
  node __DevEngine/cli.js test
`);
}

function status() {
  console.log('DevEngine CLI status:');
  console.log('- Runtime attached:', !!engine.__runtime);
  console.log('- Components:', Object.keys(engine.components || {}).join(', ') || 'none');
}

function runPipeline(selector = 'line-content') {
  const domRoot = {
    tag: 'body',
    children: [
      {
        tag: 'div',
        id: 'main',
        classes: ['container'],
        children: [
          { tag: 'span', classes: ['line-content', 'status'] },
          {
            tag: 'section',
            classes: ['shadow-host'],
            shadow: [{ tag: 'div', classes: ['shadow-item', 'collision'] }]
          }
        ]
      }
    ]
  };

  const logs = [
    '2026-06-10 [info] startup complete',
    '<div class="line-content">line A</div>',
    '<div class="line-content">line B</div>'
  ];

  engine.attachDOM(domRoot);
  engine.setLogs(logs);
  const result = engine.orchestratePipeline(selector);
  console.log('Pipeline result:', JSON.stringify(result, null, 2));
}

function runKairos() {
  const runtime = engine.__runtime;
  if (!runtime) {
    console.error('Runtime is not initialized.');
    process.exit(1);
  }

  console.log('Kairos timeline simulation:');
  const events = [
    { event: 'bootstrap', status: 'init' },
    { event: 'sync', status: 'ready' },
    { event: 'forecast', horizon: 'near' }
  ];
  console.log(JSON.stringify(events, null, 2));
}

function runTest() {
  const testFile = new URL('./test/run.js', import.meta.url).pathname;
  execFile('node', [testFile], { stdio: 'inherit' }, (error) => {
    if (error) {
      process.exit(error.code || 1);
    }
  });
}

switch (cmd) {
  case 'help':
    showHelp();
    break;
  case 'status':
    status();
    break;
  case 'run':
    runPipeline(args[1]);
    break;
  case 'kairos':
    runKairos();
    break;
  case 'test':
    runTest();
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    showHelp();
    process.exit(1);
}
