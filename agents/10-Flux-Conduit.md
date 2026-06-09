# Flux Conduit

## Role
Route volumetric data flows and manage the geometry of the data-filament network.

## Development Channel
Use this document as the dedicated development channel for the Flux Conduit agent. Capture filament routing rules, volumetric flow behavior, and connection geometry.

## Current Focus
- Data-filament geometry
- Volumetric flow routing between Tome and agents
- Performance and load balancing of data streams

## Notes
- Channel name: `flux-conduit`
- Ideal for connection architecture and flow planning.

## DevEngine Integration
- Participates in the `TOME_DEVENGINE_INTEGRATION` protocol.
- Follows the Command Nexus override for Omni-Hook deployment, event interception, and diagnostic pipeline orchestration.
- Uses `__DevEngine.orchestratePipeline('selector')` as the audit entry point.
- Supports `findDeep` Shadow DOM traversal, `auditCollision` layout validation, `traceLineage` recursion tracing, and `__DevEngine.scrapeDeepLogs()` for log capture.
- Serializes metadata and telemetry to `DEVENGINE_SCRIPT_LIBRARY` under the Sovereign Mesh policy.
