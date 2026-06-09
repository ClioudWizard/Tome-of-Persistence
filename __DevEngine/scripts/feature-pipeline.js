export function runFeaturePipeline(stages, payload) {
  return stages.reduce((state, stage) => stage(state), payload);
}
