export function listComponents(root) {
  const components = [];

  function walk(node) {
    if (!node) return;
    components.push(node.tag || 'unknown');
    for (const child of node.children || []) {
      walk(child);
    }
    for (const shadowRoot of node.shadow || []) {
      walk(shadowRoot);
    }
  }

  walk(root);
  return components;
}

export function scrapeDeepLogs(logLines, selector) {
  return logLines.filter((line) => line.includes(selector));
}

export function traceLineage(node, maxDepth = 20, depth = 0) {
  if (depth > maxDepth) {
    return ['<max depth exceeded>'];
  }
  const lineage = [node.tag || 'unknown'];
  for (const child of node.children || []) {
    lineage.push(...traceLineage(child, maxDepth, depth + 1));
  }
  for (const shadowRoot of node.shadow || []) {
    lineage.push(...traceLineage(shadowRoot, maxDepth, depth + 1));
  }
  return lineage;
}
