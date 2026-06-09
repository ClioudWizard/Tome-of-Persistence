export function lineageToArray(root, maxDepth = 20) {
  const result = [];
  function walk(node, depth) {
    if (!node || depth > maxDepth) return;
    result.push(node.tag);
    for (const child of node.children || []) walk(child, depth + 1);
    for (const shadowRoot of node.shadow || []) walk(shadowRoot, depth + 1);
  }
  walk(root, 0);
  return result;
}
