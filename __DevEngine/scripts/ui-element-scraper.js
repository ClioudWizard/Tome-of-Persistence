export function scrapeUIElements(root) {
  const elements = [];
  function walk(node) {
    if (!node) return;
    elements.push({ tag: node.tag, id: node.id || null, classes: node.classes || [] });
    for (const child of node.children || []) walk(child);
    for (const shadowRoot of node.shadow || []) walk(shadowRoot);
  }
  walk(root);
  return elements;
}
