# Sarthak database design

**Owner:** Database Architect Agent. **Reviewers:** Solution Architect, Business Analyst, Analytics, Security, Backend, Reporting, QA. **Status:** Proposed logical schema; engine and business policies unselected. **Version:** 0.6. **Date:** 2026-10-14.

## Purpose and scope

Define the relational data responsibilities for centralized Sarthak monitoring. This is a documented logical schema, not executable SQL, migrations, a deployed database, or a new source-system workflow. Fixture mode can represent these entities in a versioned synthetic package; a future service-backed implementation can map them to an approved database. Physical types, engine, storage sizes, partitioning, and retention remain open.

The design implements the meaning of [product requirements](product-requirements.md) and the boundaries in [system architecture](system-architecture.md). Field-level definitions are in [the data dictionary](data-dictionary.md); relationships and Mermaid diagrams are in [the entity relationship model](entity-relationship-model.md). Proposed rules below do not resolve the business questions in [assumptions](assumptions.md).

## Schema conventions

Every entity has an opaque primary key `id`. Organization-owned entities also have required `organization_id`; relationships between them must use the same organization. Roles, permissions, and their grant catalogue are global definitions, not global data-access grants. No table stores passwords, login tokens, or provider secrets.

Stable identity tables separate an entity from changing observations. Version tables record immutable business observations with a stable parent, version number, provenance, business-valid interval, observation time, and optional supersession. Membership tables also record versioned effective intervals. Their rows are not all counted as independent business objects. A published view selects one applicable non-superseded version per business identity under its snapshot and policy.

Intervals use inclusive start and exclusive end; null end means open-ended, not an infinite entitlement. Timestamps are UTC instants; the reporting timezone is separately selected under A-16. Null means unknown/not supplied/not applicable as defined by each field, never zero, absence, failure, or inactive by default.

## Entity list and logical schema

Identity means a stable business record; version means an immutable observation; operational means lifecycle state may change through controlled processing. Derived records never replace canonical facts.

| Entity | Module and grain | Principal relationships | Key constraint |
| --- | --- | --- | --- |
| organizations | Shared boundary; one monitored organization | Parent of organization-owned data | Unique organization code |
| geographic_areas | Centers/Analytics; one region, district, or proposed block | Optional parent area in same organization | Unique organization/area code; acyclic approved geography |
| organizational_units | Users/Centers; one cluster or division concept | Optional parent unit | Unique organization/unit code; no assumed geography equivalence |
| centers | Centers; stable center identity | Source system | Unique source-system/center key within organization |
| center_versions | Centers; one center observation/version | Center, optional district/block areas, source event | Unique center/version number |
| unit_center_memberships | Centers/RBAC; versioned unit-to-center membership | Unit, center, provenance | Unique association key/version within organization |
| scheme_categories | Schemes; one category | Organization | Unique organization/category code |
| schemes | Schemes; one scheme | Category | Unique organization/scheme code |
| center_scheme_memberships | Schemes; versioned center-to-scheme association | Center, scheme, provenance | Unique association key/version within organization |
| users | Users; one dashboard principal | Organization; external issuer/subject if enforced | Unique organization/issuer/subject when present |
| roles | Roles; one role definition | Grant catalogue | Unique code: CM, JDM, SDM, SUPER_ADMIN |
| permissions | Roles; one capability | Grant catalogue | Unique permission code |
| role_permissions | Roles; effective grant of one capability | Role, permission | No overlapping effective duplicate grants for role/permission |
| user_role_assignments | Users/Roles; effective user-role assignment | User, role | No overlapping identical active grants under approved policy |
| assignment_scopes | Users/Roles; effective target attached to assignment | Assignment; exactly one organization/area/unit/center target | No duplicate effective target for assignment |
| courses | Batch/Assessments; one course identity | Source system | Unique source-system/course key |
| batches | Batch Management; stable source batch identity | Center, course, optional scheme, source system | Unique source-system/batch key |
| batch_versions | Batch Management; one batch observation/version | Batch, source event | Unique batch/version number |
| learners | Learners; stable learner identity | Source system | Unique source-system/learner key; names are not identifiers |
| enrollments | Learners/Batch; stable enrollment record | Learner, batch, source system | Unique source-system/enrollment key; not unique learner/batch without policy |
| enrollment_versions | Learners; one enrollment status/version | Enrollment, source event | Unique enrollment/version number |
| course_assignments | Learners/Completion; one enrollment-course assignment instance | Enrollment, course | Unique source-system/assignment key |
| completion_versions | Analytics; one assignment completion observation/version | Course assignment, source event | Unique assignment/version number |
| learning_sessions | Attendance; stable scheduled session | Batch, source system | Unique source-system/session key |
| session_participations | Attendance; one enrollment-session opportunity | Enrollment, session | Unique enrollment/session within organization |
| participation_versions | Attendance; one eligibility/attendance observation/version | Participation, source event | Unique participation/version number |
| assessments | Assessments; one assessment definition | Course, source system | Unique source-system/assessment key |
| assessment_attempts | Assessments; one submitted/started source attempt | Assessment, course assignment, source system | Unique source-system/attempt key |
| attempt_result_versions | Assessments; one grading observation/version | Attempt, source event | Unique attempt/version number |
| certification_versions | Analytics; one assignment certification-status observation/version | Course assignment, source event | Unique assignment/version number; external certificate uniqueness policy open |
| source_systems | Sync; one authenticated source namespace | Organization | Unique organization/source code |
| devices | Sync; stable device identity | Source system | Unique source-system/device key |
| device_center_memberships | Sync; versioned device-center assignment | Device, center, provenance | No simultaneous center assignment for a device under proposed policy |
| sync_runs | Synchronization Logs; one observed transfer attempt | Source, optional device/center | Unique source-system/run key; retries may be new runs |
| source_events | Synchronization Logs; one stable event revision/dedup record | Source, optional superseded event | Unique source-system/event key/source revision |
| event_receipts | Synchronization Logs; one observed delivery | Run, source, optional canonical event | Receipt ID is distinct; retries are retained as receipts |
| projection_outbox | Sync/Analytics; one committed projection instruction | Source event | Unique event/projector/projection version |
| metric_definitions | Analytics; one immutable metric policy version | Organization | Unique organization/metric code/definition version |
| dataset_snapshots | Analytics/Reports; one coherent publication | Organization; immutable content/manifest | Unique organization/snapshot version |
| snapshot_metric_definitions | Analytics; one pinned metric per snapshot | Snapshot, metric definition | Unique snapshot/metric code |
| analytics_results | Analytics; one derived metric/context result | Snapshot, metric definition | Unique full context fingerprint for metric/group |
| report_templates | Reports; one immutable template version | Organization | Unique organization/template code/version |
| report_runs | Reports; one scoped preview/generation instance | User, template, snapshot | A run ID never grants access to its content |
| audit_events | Audit; one security or material-change event | Organization; optional actor user/source event | Append-only audit ID; no arbitrary business-target FK |

All 44 entities are design responsibilities, not a requirement to deploy 44 tables for the presentation prototype. History/association constraints may require transactional validation where the selected engine cannot enforce them directly. The schema does not assume source-assigned IDs are unique across source namespaces or organizations.

## Integrity and relationship rules

1. Every organization-owned FK preserves organization ownership. A globally unique ID alone must not allow an assignment, batch, event, or report to cross that boundary.
2. An assignment scope has a target kind and exactly one matching populated target FK. Organization-wide scope uses the assignment's organization explicitly; null targets never mean global access. An assignment with no scopes grants no monitored population.
3. A district's proposed parent is a region; a block's proposed parent is a district. Center geography is taken from the applicable center version's district and optional block. When both mappings exist, block parent and direct district must agree. When only a known block is supplied, district may be resolved through its approved parent with lineage. Membership/history availability and possible non-tree geography require A-01/A-24 validation; unavailable block mappings remain unknown and are not inferred from clusters.
4. Schemes are many-to-many with centers through effective membership. A scheme-associated batch must have a compatible valid center membership or be marked unresolved, not silently remapped.
5. A batch belongs to one center and one course in this proposed baseline. Multiple-course batches would require a batch-course bridge before implementation. Course assignments must agree with the enrollment's batch course under that baseline.
6. Attendance links to an enrollment-session opportunity; the enrollment and session must belong to the same batch. Missing observations do not imply absence. Session cancellation, eligibility, and late-enrollment effects require A-09.
7. Assessment attempts link to an assignment and assessment of the same course. Scores do not alone determine pass unless the approved policy says so. Completion and certification observations are independent.
8. Valid end is after start when both are known; version numbers increase within a stable parent/association, and supersession points to an older row for that same parent. Competing corrections are quarantined or resolved under an approved policy, not counted twice.
9. Immutable dimensions and fact copies in published content preserve names, geography, scheme memberships, capacity, and rules for earlier reports. Source history is never fabricated simply because a version table exists.

Historical selection needs both business-valid time and the cloud's known observation set. Supersession replaces the relevant assertion under the correction policy; it does not indiscriminately erase earlier valid periods. Successive state changes need explicit source intervals or an approved rule for deriving the prior interval's end. Missing/ambiguous validity supports only a labeled observed/current view, not a fabricated historical result. Snapshot manifests retain the exact resolved versions so old reports do not depend on later correction choices.

Source namespaces represent approved identity domains, not automatically one namespace per device. Distinct learner metrics count canonical learner IDs within authorized enrollments. Cross-source matching is unresolved under A-08; if a unified identity cannot be established, disclose that coverage/identity limitation rather than claiming a deduplicated count of real people. Learner names, certificate numbers, and contact details are not matching keys by default.

## Offline receipt and publication strategy

Source events are the dedup ledger for a stable source/event/revision identity. Event receipts preserve each delivery, its digest, observed run, timestamp, disposition, and correlation. An identical retry points to the same canonical event; changed content for the same identity is a conflict until validated. A new correction revision requires explicit lineage and source policy.

Commit the accepted canonical observation, applied event status, and projection-outbox instruction atomically. A unique identity check alone is insufficient if a crash can mark an event applied without its fact. Concurrent workers must not both apply the same revision. Separate projection consumes outbox instructions idempotently and publishes a coherent new snapshot; publication failure leaves the preceding snapshot available with a staleness notice.

Occurrence time drives business-period attribution; receipt time drives cloud observation cutoff. Successful transfer, accepted processing, publication, device connectivity, and freshness remain independent. Unknown local backlog is null unless the source reports it. Partial-run publication policy and clock/conflict rules remain A-14–17 decisions.

Snapshots reference immutable materialized content and a checksummed manifest containing canonical record/version membership, source cutoff, mappings, coverage, and pinned metric definitions. This may be a synthetic package or an approved private archive; it is not an unspecified pointer to the latest mutable database state. Reports retain the exact snapshot, template, definition set, filters, timezone, and scope fingerprint. Access is checked against current permissions even when content is historical.

## Indexing strategy

The following are candidate logical indexes, not DDL or measured performance results. Primary keys and declared uniqueness come first; additional indexes follow actual query plans, cardinalities, retention, and write cost. Composite organization/FK keys protect ownership independently of read optimization.

| Query or integrity need | Candidate key/order | Rationale and constraint |
| --- | --- | --- |
| Source identity and retries | source_events: organization, source, event key, source revision; event_receipts: run, received time, ID | Unique canonical revisions with retained duplicate receipt history |
| Effective role/scope resolution | user_role_assignments: organization, user, valid interval; assignment_scopes: assignment, target kind, valid interval | Resolve current permissions before queries; avoid broad grant scans |
| Area and unit membership | geographic_areas: organization, parent, kind; unit_center_memberships: organization, unit, valid interval, center | Scoped center set and geography drilldown |
| Center versions and scheme coverage | center_versions: organization, center, version; district area/valid time; memberships: organization, scheme, valid interval, center | Latest applicable status and distinct group membership |
| Batch creation and capacity | batches: organization, center, source creation time, ID; batch_versions: batch, version | Monthly creation uses source event time; capacity is an observation, not a join to today's value |
| Enrollment and learner detail | enrollments: organization, batch, learner, ID; enrollment_versions: enrollment, version | Counts at enrollment grain and identity-aware learner deduplication |
| Attendance | learning_sessions: organization, batch, session start, ID; session_participations: session, enrollment; participation_versions: participation, version | Session denominator and matching observed statuses |
| Assessments/outcomes | assessment_attempts: organization, assignment, assessment, attempt time, ID; result/completion/certification versions: parent, version | Apply attempt selection and outcome rules before aggregation |
| Sync operations | sync_runs: organization, center, observed start, ID; device, observed start, ID; outbox: state, next attempt time, ID | Scoped investigation and bounded retry work; stale age is computed with a policy, not stored as permanent truth |
| Snapshot/metric retrieval | dataset_snapshots: organization, version; analytics_results: context fingerprint/metric/group | Version-safe reuse; current authorization must precede returning cached results |
| Reports and audit | report_runs: organization, requester, generation time, ID; audit_events: organization, recorded time, ID and correlation | Scoped history/investigation without indexing sensitive raw payloads |

Use bounded pagination with a deterministic time-plus-ID tie breaker. Partial indexes on queued/retryable states, partitioning of large receipt/audit histories, or materialized geographic summaries are future options, justified by measured workload. Distinct learners and overlapping schemes cannot be recovered by summing precomputed distinct counts. Derived utilization retains comparable numerators/denominators and excluded coverage.

## Audit strategy

Keep audit_events separate from sync diagnostics and business history. Record grant/revocation and scope changes, denied access, relevant sign-in/session outcomes if identity is implemented, source admission/conflicts, material record corrections, snapshot publication, report generation/access/export, and operational configuration changes if later introduced. Each event carries organization, actor kind, actor reference when known, action, outcome, target locator, correlation, time, applicable permission/snapshot versions, and redacted change summary.

Canonical accepted changes and their audit record should commit together or use a durable audit outbox. If mandatory audit evidence cannot be persisted, privileged changes/exports must fail closed under the approved audit policy; read availability versus audit availability is a separate open operational decision. A reset operation in a synthetic demonstration is labeled and does not delete production audit history.

Treat the log as append-only to application writers; restrict read access and keep audit administration separate from ordinary monitoring. Optional tamper-evidence/export to protected storage requires a future implementation and must not be claimed now. Do not log passwords, tokens, raw identity assertions, unnecessary learner PII, complete imported payloads, or full report contents. Audit target locators preserve evidence even if a business record is later removed; they are validated metadata, not a generic query capability.

Retention, anonymization/deletion, artifact expiry, backup, and restore policies remain open with Security/Database/DevOps. Do not default to indefinite personal-data retention. Historical metric reproduction must be reconciled with deletion obligations before production. Deletion should restrict or preserve referenced histories according to that policy; automatic cascading deletion of enrollment facts, reports, or audit evidence is not proposed.

## Review and completion criteria

The analytics phase extends the proposed geography with BLOCK and center_versions.block_area_id without adding an entity. [Analytics KPIs](analytics-kpis.md) and [metric definitions](metric-definitions.md) specify cross-level aggregation, engagement signals, and sync-health evidence; approval of those policies remains open.

Validate all 11 requested modules plus completion/certification and geographic support; PK/FK and interval rules; all four role scope paths; duplicate/concurrent receipt behavior; late/corrected event attribution; unknown eligibility/attendance; capacity changes; independent certification; and report reproduction after publication changes. The ER diagrams and dictionary must use the same entity names and FK optionality. No schema has been executed, index benchmarked, audit control verified, or migration generated.
