export function extractASTFeatures(source) {
  return {
    length: source.length,
    lines: source.split(/\r?\n/).length,
    hasAsync: /async\s+function|await/.test(source),
    hasProxy: /new\s+Proxy/.test(source)
  };
}
