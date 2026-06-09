export function detectCollisions(elements) {
  const collisions = [];
  const seen = new Map();
  
  for (const elem of elements) {
    const key = `${elem.tag}:${elem.id || ''}:${elem.classes.join(',')}`;
    if (seen.has(key)) {
      collisions.push({
        element: elem,
        conflictsWith: seen.get(key),
        severity: 'moderate'
      });
    } else {
      seen.set(key, elem);
    }
  }
  
  return {
    count: collisions.length,
    issues: collisions
  };
}
