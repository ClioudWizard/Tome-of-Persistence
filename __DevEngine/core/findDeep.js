export function findDeep(root, selector, options = {}) {
  const { maxDepth = 20, depth = 0 } = options;
  if (depth > maxDepth) {
    throw new Error('findDeep exceeded max recursion depth');
  }
  const normalized = selector.trim();
  const matches = [];

  function test(node) {
    if (!node || typeof node !== 'object') return false;
    if (node.tag === normalized) return true;
    if (node.id && `#${node.id}` === normalized) return true;
    if (node.classes && node.classes.includes(normalized)) return true;
    return false;
  }

  if (test(root)) {
    matches.push(root);
  }

  const children = [...(root.children || []), ...(root.shadow || [])];
  for (const child of children) {
    matches.push(...findDeep(child, normalized, { maxDepth, depth: depth + 1 }));
  }

  return matches;
}
