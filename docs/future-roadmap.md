# Future roadmap

This roadmap follows the implemented Executive Dashboard, Center Monitoring and Synchronization Monitoring prototype. Sequence reflects dependencies; no delivery dates, staffing budget or production approval is implied. The current release remains a synthetic presentation application.

| Stage | Outcome | Dependencies and responsible disciplines | Exit evidence |
| --- | --- | --- | --- |
| 1. Approve operational definitions | Agreed activity, capacity, enrollment, sync freshness, geography and escalation policies | Product/Business Analysis, Analytics, Security; stakeholder review of current assumptions | Signed metric glossary, role-to-scope assignments, source-field availability and examples for unknown/zero denominators |
| 2. Establish trusted identity and persistence | Real users, scoped authorization, PostgreSQL domain schema and migrations | Stage 1; Solution/Database Architecture, Backend, Security | Deny-by-default API enforcement for CM/JDM/SDM/Super Admin; migration/rollback proof; audit and backup/restore tests |
| 3. Integrate offline source evidence | Durable source ingestion and reproducible published snapshots | Stage 2; Backend, Data, DevOps, QA | Idempotent receipt/retry handling; occurrence-versus-receipt lineage; complete expected-target roster; late-data/reconciliation tests |
| 4. Expand operational and learning views | Dedicated batch/scheme pages plus attendance, assessment, completion and certification analytics | Source coverage and approved denominators; Analytics, Frontend, QA | Comparable scoped calculations with coverage/exclusions; trusted histories rather than reconstructed outcomes |
| 5. Implement operational alerts | Persisted alert episodes, acknowledgement/resolution and approved notifications | Stages 1–3; Security, Backend, DevOps, Product | Versioned policies, authorized editors, deduplicated episodes, bounded retries, routing/recipient checks and delivery audit; missing evidence never becomes an invented outage |
| 6. Deliver reporting | Eight designed reports, exports and authorized schedules | Trusted snapshots, identity and learning/operational datasets; Reporting, Backend, Frontend | Filter/denominator parity with dashboard, reproducible exports, recipient authorization at execution and artifact retrieval |
| 7. Qualify cloud operation | Deployment, observability, accessibility and recoverability | Service-backed modules plus hosting decisions; DevOps, QA, Security | SPA/API routing, secrets/TLS, measured load/cost, accessibility audit, incident runbooks, backup restore and disaster-recovery proof |

Stages 4–6 may proceed in parallel once their data and authorization dependencies are met. Cloud experimentation can begin earlier, but it does not replace production qualification.

## Immediate stakeholder decisions

1. Confirm the demonstration's three implemented modules and the next highest-value missing capability.
2. Define each role's organizational/geographic scope; role names alone do not establish inherited access.
3. Identify real source owners and field availability for activity, capacity, expected sync targets and learning outcomes.
4. Approve operational cadence, pending deadlines and escalation timing. Current 24-hour/2-hour and 0/2/6/24-hour values are illustrative.
5. Prioritize report formats and delivery channels, including who may receive/export learner-level data.
6. Choose the hosting environment, data residency, retention, recovery and acceptance requirements before estimating production delivery.

Presentation refinements should preserve the deterministic fixture, reset paths and honest capability labels. Future fixtures may add stakeholder scenarios, but cannot silently replace the baseline or simulate live organizational measurements.

See the [implementation assumptions](known-assumptions.md), [reporting design](reporting-strategy.md), [security design](security-rbac.md), [technical decisions](technical-decisions.md) and [original project plan](project-plan.md).
