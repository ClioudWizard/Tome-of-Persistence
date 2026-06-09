# __DevEngine Runtime Documentation

This folder holds the runtime scaffolding for the DevEngine system described by the Tome of Persistence.

- `core/monolith.js` exposes the runtime and hook emulation.
- `core/findDeep.js` provides recursive deep DOM traversal.
- `core/telemetry.js` powers component listing, log scraping, and lineage tracing.
- `scripts/` includes modular feature components for UI scraping and analytics.

## Usage

1. Run `npm install`.
2. Use `npm test` to validate the scaffold.
3. Attach the DOM model and logs through `__DevEngine.attachDOM()` and `__DevEngine.setLogs()`.
4. Run `__DevEngine.orchestratePipeline('selector')`.
