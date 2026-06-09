import engine from '../core/monolith.js';

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
  '2026-06-09 [info] startup complete',
  '<div class="line-content">line A</div>',
  '<div class="line-content">line B</div>'
];

engine.attachDOM(domRoot);
engine.setLogs(logs);

const pipeline = engine.orchestratePipeline('line-content');
console.log('Pipeline result:', pipeline);

if (pipeline.matched.length !== 1) {
  throw new Error('Expected exactly one matched node for line-content');
}
if (pipeline.interception.fetchCalls !== 1 || pipeline.interception.eventCalls !== 1) {
  throw new Error('Expected hook interception counts to be 1');
}

const collisionPipeline = engine.orchestratePipeline('shadow-item');
if (collisionPipeline.collision.count !== 1) {
  throw new Error('Expected one collision issue for shadow-item selector');
}
console.log('Runtime scaffolding test passed.');
