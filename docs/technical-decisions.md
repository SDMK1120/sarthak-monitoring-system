# Sarthak dashboard technical decisions

**Owner:** Solution Architect Agent. **Reviewers:** Product Manager, Database Architect, Backend, Frontend, Analytics, Reporting, Security, DevOps, QA. **Status:** Proposed architecture decisions; no implementation technology approved. **Version:** 0.4. **Date:** 2026-10-14.

## Decision authority and recording

Implementation Phase 1 now confirms the frontend/API/database stack in DEC-027: React/TypeScript/Vite/Tailwind, Fastify/TypeScript, and PostgreSQL. [Scaffold setup](getting-started.md) records the implemented infrastructure. The ADRs below retain their original proposed architectural scope; their prior unselected-technology statements describe the earlier documentation milestone, not the current foundation.

The user confirms an Offline-First LMS, centralized monitoring purpose, demonstration context, four role names, monitoring areas, and this documentation-only architecture delivery. All design recommendations below remain Proposed. They are architecture proposals linked to existing DEC entries in [the governance register](governance/registers.md), not retrospective approvals or new accepted register entries. Open business assumptions in [assumptions](assumptions.md) retain their status.

On approval, record decision owner, review date, rationale, selected alternative, affected requirements, and change impact. Amend these ADRs and the governance register together; if scope/metric meaning changes, BA updates requirements/stories/criteria before downstream contracts freeze. Earlier DEC-013 records the prior Phase 2 delivery; the present instruction authorizes architecture documentation, not implementation.

## ADR-001 — Logical layered architecture and prototype mode

**Status:** Proposed. **Owner:** Solution Architect, PM. **Links:** DEC-001, DEC-005, DEC-011; A-18, A-23; REQ-021–022.

**Proposal:** Separate presentation, application policy/evaluation, and data responsibilities logically, with a future ingestion adapter. Start with one coherent application rather than independent domain services. Choose either a fixture-only demonstration or a service-backed synthetic prototype after reviewing access/enforcement and presentation needs.

**Alternatives:** A static fixture demonstration minimizes runtime dependencies but cannot protect a synthetic bundle delivered to users. A service-backed prototype can demonstrate trusted authorization and shared publication behavior, with greater setup and operations cost. Independent microservices add deployment and consistency work without an approved workload requiring them.

**Consequence and gate:** Contracts describe logical behavior across either mode. PM/Architect/Security must choose mode and label simulations before build; no framework, database, provider, or vendor is selected by this ADR.

## ADR-002 — Versioned facts, definitions, and coherent snapshots

**Status:** Proposed. **Owner:** Database Architect, Analytics, Solution Architect. **Links:** DEC-003, DEC-006–007; A-03–13, A-19; REQ-003–018, REQ-022.

**Proposal:** Evaluate normalized facts at their business grain using shared versioned definitions and publish coherent snapshots. Keep historical mappings/status/capacity only where supported; otherwise identify current-state limitations. Rates aggregate eligible numerators/denominators; distinct counts retain identity semantics.

**Alternatives:** Screen-specific calculations are quick to prototype but risk inconsistent totals. A single unversioned mutable dataset cannot explain prior reports or late corrections. A warehouse is a possible future optimization, not a prerequisite for the demonstration.

**Consequence and gate:** Snapshot identity includes scenario/publication and definition versions plus cutoff/coverage. Before contract approval, BA/Analytics resolve eligibility, timezone, historical availability, and metric denominators. Retention duration and report artifact storage remain open.

## ADR-003 — Offline observations and idempotent future ingestion

**Status:** Proposed. **Owner:** Solution Architect, Database Architect, Backend. **Links:** DEC-007; A-14–17; REQ-008, REQ-015, REQ-019, REQ-022.

**Proposal:** Keep occurrence, receipt, processing, publication, and last-success times separate. Treat transfer outcome, connectivity, freshness, and coverage as independent observations. Deduplicate stable source/event identity before metrics; unresolved references, conflicting revisions, and suspect clocks require explicit policy.

**Alternatives:** Reporting by upload month distorts monthly batch creation. Treating a recent upload as full freshness hides old or partial source data. Blind overwrites and duplicate counting cannot establish reconciliation integrity.

**Consequence and gate:** The demonstration illustrates duplicate/late/partial cases through supplied snapshots. Future source contracts must establish retry identity, acknowledgement milestones, correction precedence, clock policy, completeness evidence, and device-to-center aggregation. Freshness thresholds, expected cadence, and local-backlog visibility remain unapproved.

## ADR-004 — Separate authentication from role and scope policy

**Status:** Proposed. **Owner:** Security, Solution Architect, BA. **Links:** DEC-004, DEC-009; A-01–02, A-21–22; REQ-001–002, REQ-018.

**Proposal:** Label simulated role selection explicitly. If service-backed access is selected, use trusted identity integration with OpenID Connect as a candidate protocol, then resolve explicit assignments/capabilities at the application boundary. Enforce scope before query/aggregation/report creation and recheck artifact access. Partition caches by effective permission and snapshot context.

**Alternatives:** Client-only navigation hiding cannot enforce access. Role names alone do not prove geographic scope. Automatic title-based inheritance risks broader access than the business has approved.

**Consequence and gate:** CM, JDM, SDM, and Super Admin all need reviewable access rules, including no-scope and denied cases. Security must approve identity/session handling, assignment changes, historical access, learner fields, report/download permissions, and negative scenarios before enforcement is claimed. No identity provider or complete permission matrix is selected.

## ADR-005 — Shared reporting context with preview baseline

**Status:** Proposed. **Owner:** Reporting, Analytics, Security. **Links:** DEC-010; A-20, A-22; REQ-018, REQ-022.

**Proposal:** Produce preview templates from the shared scoped metric context and pinned snapshot. Display filters, role scope, reporting timezone, cutoff, definition/publication versions, generation time, coverage, and synthetic-data label. Optional export uses the same policy and values.

**Alternatives:** Independent report queries against latest data can disagree with the user's dashboard snapshot. Unlabeled download placeholders can imply functionality that does not exist. Scheduled delivery/email is outside the stated MVP boundary.

**Consequence and gate:** PM/Reporting choose preview-only versus executable exports and formats. Security decides artifact access and retention if files are produced; generation does not create permanent access entitlement.

## ADR-006 — Minimal candidate deployment with measured scaling

**Status:** Proposed. **Owner:** DevOps, Solution Architect, PM. **Links:** DEC-005, DEC-011; A-18, A-23; REQ-019, REQ-021.

**Proposal:** Select minimal HTTPS presentation hosting for fixture mode, or add one application boundary and private synthetic repository for service mode. Keep production ingress, durable queues/workers, read-model optimization, redundancy, and recovery controls as conditional future additions after workload and risk review.

**Alternatives:** Full production topology increases prototype dependencies without a defined production workload. Ignoring future receipt durability and isolation would weaken a later live integration. These concerns can be documented without deploying them now.

**Consequence and gate:** No deployment occurs in this phase. Define audience, environment, region, operational ownership, dataset size, concurrency, sync bursts, latency/availability objectives, publication lag targets, backup needs, and recovery objectives before capacity selection. No numerical SLO or cloud service is approved.

## Blocking choices and follow-up ownership

| Choice | Owners | Downstream effect |
| --- | --- | --- |
| Fixture versus service mode; simulated versus enforced identity | PM, Architect, Security | Deployment, contracts, cache/session rules, negative test scope |
| Role assignments, overlap, historical membership and detail privileges | BA, Security | Every filter, aggregate, drilldown, comparison, report |
| Metric eligibility, denominators, activity rules, taxonomy and history | BA, Analytics, Database | Scenario records, evaluator definitions, reconciliation expectations |
| Reporting timezone, freshness, correction/late-arrival and partial-publication rules | Analytics, Architect, Database | Event attribution, sync projections, publication and report versions |
| Hosting, source contracts, retention, capacity, SLO and recovery targets | DevOps, Architect, Security, Database | Future runtime sizing, integration controls, operations |

Architecture documentation can be reviewed now. Implementation readiness requires the applicable blocking choices to be resolved with recorded evidence; exploratory synthetic examples must remain visibly provisional. No package installation, code generation, live integration, or deployment is part of this delivery.
