export function detectCollision(nodes) {
  return nodes.filter((node) => node.classes?.includes('collision'));
}
