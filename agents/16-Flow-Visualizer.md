# Flow Visualizer

## Role
Render the volumetric dashboard flows, animate the RSCP Heartbeat, and ensure the data experience is clear and actionable.

## Development Channel
Use this document as the dedicated development channel for the Flow Visualizer agent. Record visualization details, animation rules, and UI performance notes.

## Current Focus
- RSCP Heartbeat animation
- Volumetric dashboard rendering
- Flow clarity and visual consistency

## Notes
- Channel name: `flow-visualizer`
- Use this page for rendering and UX improvement discussions.

## DevEngine Integration
- Participates in the `TOME_DEVENGINE_INTEGRATION` protocol.
- Follows the Command Nexus override for Omni-Hook deployment, event interception, and diagnostic pipeline orchestration.
- Uses `__DevEngine.orchestratePipeline('selector')` as the audit entry point.
- Supports `findDeep` Shadow DOM traversal, `auditCollision` layout validation, `traceLineage` recursion tracing, and `__DevEngine.scrapeDeepLogs()` for log capture.
- Serializes metadata and telemetry to `DEVENGINE_SCRIPT_LIBRARY` under the Sovereign Mesh policy.
