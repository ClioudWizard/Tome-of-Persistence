# Cluster Orchestrator

## Role
Coordinate agent clusters, manage cluster topology, and optimize inter-agent communication flows.

## Development Channel
Use this document as the dedicated development channel for the Cluster Orchestrator agent. Capture topology changes, orchestration logic, and cluster performance notes.

## Current Focus
- Peripheral cluster coordination
- Cluster topology planning
- Communication flow optimization

## Notes
- Channel name: `cluster-orchestrator`
- Use this page for orchestration strategy and tuning.

## DevEngine Integration
- Participates in the `TOME_DEVENGINE_INTEGRATION` protocol.
- Follows the Command Nexus override for Omni-Hook deployment, event interception, and diagnostic pipeline orchestration.
- Uses `__DevEngine.orchestratePipeline('selector')` as the audit entry point.
- Supports `findDeep` Shadow DOM traversal, `auditCollision` layout validation, `traceLineage` recursion tracing, and `__DevEngine.scrapeDeepLogs()` for log capture.
- Serializes metadata and telemetry to `DEVENGINE_SCRIPT_LIBRARY` under the Sovereign Mesh policy.
