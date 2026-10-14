# Decisions risks and assumptions

This register retains the initial planning proposals and records subsequent user confirmations. Decision states are Open, Proposed, or Accepted. The demonstration purpose, documentation-only boundary, monitoring areas, and CM/JDM/SDM/Super Admin role names are confirmed. Detailed business policies and organizational assignments remain open; see [Phase 2 assumptions](../assumptions.md).

## Decision register

| ID | Decision | Status | Owner | Needed by |
| --- | --- | --- | --- | --- |
| DEC-001 | Prototype serves demonstration and presentation of centralized offline-first LMS oversight | Accepted by user instruction | PM | Phase 0 |
| DEC-002 | Current delivery contains planning only and stops before implementation | Accepted by user instruction | Orchestrator | Phase 0 |
| DEC-003 | Use synthetic identities and repeatable scenarios for the demonstration | Proposed | PM, Security, Database | Phase 1 |
| DEC-004 | Define organizational hierarchy and scope assignments for the confirmed roles | Open | BA, PM | Before scope/contract baseline |
| DEC-005 | Select local fixture-based or service-backed prototype mode | Open | Architect, Backend, Frontend | Phase 2 |
| DEC-006 | Define completion, active participation, assessment eligibility, and attempt selection | Open | BA, Analytics | Phase 2 |
| DEC-007 | Define freshness thresholds, reporting timezone, late-arrival and snapshot policies | Open | Analytics, Architect, Database | Phase 2 |
| DEC-008 | Choose design direction, languages, responsive targets, and accessibility target | Open | UX, PM | Phase 3 |
| DEC-009 | Decide simulated role switching versus implemented sign-in/scope enforcement | Open | PM, Security, Architect | Phase 2 |
| DEC-010 | Decide preview-only reports versus working downloads and formats | Open | Reporting, PM, Backend | Phase 3 |
| DEC-011 | Framework/database selections are confirmed in DEC-027; deployment/hosting and production runtime profile remain open | Open | Architect, delivery owners, DevOps | Before deployment |
| DEC-012 | Confirm center, scheme, batch, enrollment, attendance, assessment, completion, certification, synchronization, district, and region monitoring | Accepted by user instruction | PM, BA | Phase 2 documentation |
| DEC-013 | Deliver Phase 2 as five business/product documents; architecture and implementation remain future work | Accepted by user instruction | Orchestrator | Current delivery |
| DEC-014 | Use CM (Cluster Manager), JDM (Junior Divisional Manager), SDM (Senior Divisional Manager), and Super Admin roles | Accepted by user instruction | BA, Security | Phase 2 documentation |
| DEC-015 | Execute architecture documentation with high/low-level design, components, modules, data flow, synchronization, authentication, RBAC, scalability, and cloud deployment diagrams | Accepted by user instruction | Solution Architect | Architecture documentation delivery |
| DEC-016 | Execute database design documentation for schema, entities, relationships, ER diagrams, dictionary, indexing, and audit across all requested modules | Accepted by user instruction | Database Architect | Database documentation delivery |
| DEC-017 | Define executive, regional, district, and block KPIs and eight requested metric calculations as documentation | Accepted by user instruction | Analytics | Analytics documentation delivery |
| DEC-018 | Approve detailed block mappings, engagement proxy, attendance/cohort conventions, expected sync targets, and health policies | Open | BA, Analytics, Database, Architect | Before analytics implementation |
| DEC-019 | Define eight required reports with filters, drilldowns, export formats, and scheduled-reporting strategy as documentation | Accepted by user instruction | Reporting | Reporting documentation delivery |
| DEC-020 | Approve executable formats, schedule/recipient permissions, recurrence/timezone, snapshot freeze, delivery channels, retry/misfire policy, and retention | Open | PM, Reporting, Security, Architect, DevOps | Before reporting automation implementation |
| DEC-021 | Design the four role experiences and eight requested pages with navigation, layout, widgets, charts, filters, flows, and textual wireframes as documentation | Accepted by user instruction | UI/UX | UI and UX documentation delivery |
| DEC-022 | Approve directory/administrative permissions, user lifecycle/handoff, personal settings persistence, and policy-change review/activation for the new design surfaces | Open | PM, BA, Security, Architect | Before administrative/settings implementation |
| DEC-023 | Specify authentication, user, center, batch, analytics, reporting, and synchronization APIs and backend service design as documentation | Accepted by user instruction | Backend | Backend documentation delivery |
| DEC-024 | Approve API identity/session/security profile, limits, permissions, optional-feature persistence, source payload/feedback contracts, and exact validation/error policies | Open | Backend, Security, Architect, Database, Reporting | Before backend implementation |
| DEC-025 | Define authentication, authorization, four-role RBAC, sessions, audit, API security and data security as documentation | Accepted by user instruction | Security | Security documentation delivery |
| DEC-026 | Approve exact role-capability/delegation and multi-role policies, MFA/step-up/session targets, audit failure/retention, data/key protection and operational security profiles | Open | Security, BA, Backend, Architect, DevOps | Before security enforcement implementation |
| DEC-027 | Implement foundation only using React, TypeScript, Vite, Tailwind, Fastify and PostgreSQL, with environment/shared types/logging/errors; no business modules | Accepted by user instruction | Orchestrator, Frontend, Backend | Implementation Phase 1 |

Architecture options and decision status are detailed in [technical decisions](../technical-decisions.md). Remaining proposed patterns do not resolve business/identity policies or approve a hosting vendor, production runtime profile, live integration, or deployment.

DEC-027 supersedes the earlier unselected framework/database assumption for the implementation foundation. The [setup guide](../getting-started.md) records concrete versions and scaffold behavior; hosting, business schemas, source integration, identity, role grants, metrics and operational targets remain separate decisions.

## Assumption register

| ID | Planning assumption | Validation owner | Consequence if false |
| --- | --- | --- | --- |
| ASM-001 | Organization, region/program, and center form useful demonstration levels | BA | Revise hierarchy, scope rules, filters, and dataset. |
| ASM-002 | Leadership, manager, center, and operations journeys cover the core presentation | PM | Reprioritize screens and scenarios. |
| ASM-003 | Synthetic data can represent relevant workflows without a live LMS | Architect, BA | Define approved source examples and reconsider integration scope. |
| ASM-004 | Demonstration shows cloud observations, not complete unuploaded local activity | Architect, Analytics | Revisit ingestion/freshness claims and architecture. |
| ASM-005 | A 30-working-day future sequence is feasible with timely reviews | Orchestrator, PM | Re-estimate after discovery and mode selection. |
| ASM-006 | Individual learner details may be shown only if the role/access decision permits them | Security, BA | Use aggregated or anonymized views. |

## Risk register

| ID | Risk and impact | Mitigation | Owner | Planning priority |
| --- | --- | --- | --- | --- |
| RSK-001 | Prototype is mistaken for a production-connected platform | Label synthetic data and simulated integrations; keep a limitations narrative. | PM, Documentation | High |
| RSK-002 | Offline or absent uploads are read as inactivity | Separate connectivity, sync outcome, coverage, and freshness; distinguish unknown from zero. | Analytics, UX, Architect | High |
| RSK-003 | Charts and reports disagree | Shared KPI definitions, snapshot cutoff, fixtures, and hand-calculated QA expectations. | Analytics, Reporting, QA | High |
| RSK-004 | Retried or late events distort metrics | Stable event identity, deduplication policy, event-time reporting, reconciliation scenarios. | Database, Backend, QA | High |
| RSK-005 | Navigation hiding is mistaken for access enforcement | Explicit simulation labels; server scope and negative tests if services are implemented. | Security, Backend | High |
| RSK-006 | Optional features displace core demo journeys | Prioritize P0, record scope changes, defer P2 until core acceptance. | PM | Medium |
| RSK-007 | Preview failure disrupts the presentation | Repeatable reset, known snapshot, recovery procedure, rehearsal, documented fallback. | DevOps, QA | High |
| RSK-008 | Charts or dense tables are inaccessible or unreadable | Keyboard/focus criteria, chart alternatives, responsive review, presentation-scale checks. | UX, Frontend, QA | Medium |
| RSK-009 | Documentation claims outpace actual functionality | Domain reviews and separate Planned, Simulated, Implemented, and Verified capability statuses. | Documentation, QA | Medium |

## Requirement traceability convention

Use identifiers REQ for requirements, UC for journeys, KPI for metrics, RPT for reports, SCN for data scenarios, TC for validation cases, ADR for architecture decisions, and CHG for changes. Domain owners assign sequential numbers when detailed deliverables are created.

Example proposed trace: REQ-001 organizational overview → UC-001 leadership drilldown → overview/center screens → KPI completion definition and center/enrollment records → SCN healthy/stale centers → TC dashboard/report reconciliation. This is an illustrative mapping, not a completed requirement or test.

The future traceability matrix records requirement ID, priority, owner, journey, screen, data fields, KPI/report dependencies, contract, scenario, validation case, status, and evidence link. BA owns it; every agent supplies changes; QA checks completeness.
