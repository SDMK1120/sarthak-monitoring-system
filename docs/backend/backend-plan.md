# Backend service planning brief

**Owner:** Backend Agent. **Reviewers:** Architect, Security, Frontend, QA. **Status:** Proposed planning baseline. **Version:** 0.1. **Date:** 2026-10-14.

Inventory the data needs for organizational hierarchy, learning summaries/details, center/device observations, synchronization, analytics, and reports. Every need must map to a documented fixture interface or future service contract.

Contracts specify identifiers, authorized organization scope, date interval boundaries, timezone, filtering, sorting, pagination, result grain, snapshot cutoff, freshness, null values, and success/empty/partial/failure behavior. Error categories include invalid filters, unavailable source, denied scope, and failed report preparation. Contract examples may be written in prose and tables during specification; no service code is part of this delivery.

The fixture-versus-service decision must preserve consistent business semantics. If a backend is selected, scope must be enforced in queries and report generation rather than relying on screen visibility. If a fixture-only role selector is selected, document its simulated behavior.

Future LMS ingestion is a separate boundary covering event identity, idempotency, duplicate handling, validation, reconciliation, and diagnostics. Displaying simulated synchronization does not demonstrate a working sync engine.

Deliver an interface inventory, reviewed behavior specifications, error catalogue, service backlog, and fixture replacement criteria before implementation.

The subsequent [API specification](../api-specification.md) and [service design](../service-design.md) document 44 proposed endpoints and their shared contracts. These cover the requested seven API groups while keeping administration, persistence, reporting automation, and real source ingestion conditional. No backend implementation is delivered by these specifications.
