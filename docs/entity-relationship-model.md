# Sarthak entity relationship model

**Owner:** Database Architect Agent. **Reviewers:** Solution Architect, Business Analyst, Analytics, Security, Backend, QA. **Status:** Proposed logical ER model. **Version:** 0.6. **Date:** 2026-10-14.

These diagrams split the 44-entity [schema](database-design.md) into readable domains. They are documentation, not executable schema. Each entity's complete fields, inherited organization ownership, provenance, and nullability are in [the dictionary](data-dictionary.md). Mermaid diagrams show representative key fields; omitted fields and repeated ownership/provenance arrows still apply.

`||` means exactly one, `o|` zero or one, and `o{` zero or many. Cardinality describes possible stored records, not permission inheritance or evidence that every source has uploaded complete data. All organization-owned relationships preserve organization equality. The proposed geographic tree, operational-unit mappings, and temporal membership constraints require A-01/A-02 approval.

## Users roles and center scope

```mermaid
erDiagram
    organizations ||--o{ users : owns
    users ||--o{ user_role_assignments : receives
    roles ||--o{ user_role_assignments : assigns
    roles ||--o{ role_permissions : grants
    permissions ||--o{ role_permissions : defines
    user_role_assignments ||--o{ assignment_scopes : bounds
    organizations o|--o{ assignment_scopes : organization_target
    geographic_areas o|--o{ assignment_scopes : area_target
    organizational_units o|--o{ assignment_scopes : unit_target
    centers o|--o{ assignment_scopes : center_target
    organizations ||--o{ geographic_areas : owns
    geographic_areas o|--o{ geographic_areas : parent_of
    organizations ||--o{ organizational_units : owns
    organizational_units o|--o{ organizational_units : parent_of
    organizational_units ||--o{ unit_center_memberships : has
    centers ||--o{ unit_center_memberships : belongs_through
    centers ||--o{ center_versions : observed_as
    geographic_areas o|--o{ center_versions : district_of
    geographic_areas o|--o{ center_versions : block_of
    organizations {
        ID id PK
        Integer authorization_version
    }
    users {
        ID id PK
        ID organization_id FK
    }
    roles {
        ID id PK
        Code code UK
    }
    permissions {
        ID id PK
        Code code UK
    }
    role_permissions {
        ID id PK
        ID role_id FK
        ID permission_id FK
    }
    user_role_assignments {
        ID id PK
        ID user_id FK
        ID role_id FK
    }
    assignment_scopes {
        ID id PK
        ID assignment_id FK
        Code scope_kind
    }
    geographic_areas {
        ID id PK
        ID parent_area_id FK
        Code area_kind
    }
    organizational_units {
        ID id PK
        ID parent_unit_id FK
        Code unit_kind
    }
    centers {
        ID id PK
        ID source_system_id FK
    }
    center_versions {
        ID id PK
        ID center_id FK
        ID district_area_id FK
        ID block_area_id FK
    }
    unit_center_memberships {
        ID id PK
        ID unit_id FK
        ID center_id FK
    }
```

Every assignment_scopes row populates exactly one matching target FK. The four optional target relationships are alternatives, not four simultaneously granted scopes. An organization target is explicit; an assignment without any scopes grants none. A district has a region parent and a proposed block has a district parent, while a root region has no parent. A-24 must approve block membership; a center's block parent must agree with its district when both are supplied. Cluster/division operational units have independent effective center memberships and do not automatically follow geography or represent blocks.

## Schemes batches and enrollments

```mermaid
erDiagram
    scheme_categories ||--o{ schemes : categorizes
    centers ||--o{ center_scheme_memberships : participates
    schemes ||--o{ center_scheme_memberships : includes
    centers ||--o{ batches : hosts
    schemes o|--o{ batches : supports
    courses ||--o{ batches : teaches
    batches ||--o{ batch_versions : observed_as
    batches ||--o{ enrollments : contains
    learners ||--o{ enrollments : enrolls_through
    enrollments ||--o{ enrollment_versions : observed_as
    enrollments ||--o{ course_assignments : has
    courses ||--o{ course_assignments : assigned_as
    scheme_categories {
        ID id PK
        Text code
    }
    schemes {
        ID id PK
        ID category_id FK
    }
    center_scheme_memberships {
        ID id PK
        ID center_id FK
        ID scheme_id FK
        Text association_key
    }
    courses {
        ID id PK
        ID source_system_id FK
    }
    batches {
        ID id PK
        ID center_id FK
        ID course_id FK
        ID scheme_id FK
    }
    batch_versions {
        ID id PK
        ID batch_id FK
        Integer approved_capacity
    }
    learners {
        ID id PK
        ID source_system_id FK
    }
    enrollments {
        ID id PK
        ID learner_id FK
        ID batch_id FK
    }
    enrollment_versions {
        ID id PK
        ID enrollment_id FK
    }
    course_assignments {
        ID id PK
        ID enrollment_id FK
        ID course_id FK
    }
```

Centers and schemes are many-to-many through versioned memberships. A batch's optional scheme link is not a substitute for validating its center's scheme membership. One learner can have many distinct enrollments across centers/batches; learner identity has no exclusive center owner. Authorization selects permitted enrollments first and then counts distinct learner IDs within that population.

One course per batch and one category per scheme are proposed baseline simplifications. Multiple-course batches or time-varying scheme taxonomy require approved mapping/version extensions. Full dimension copies are pinned in published snapshots so later labels or mapping changes do not alter earlier reports.

## Attendance assessments completion and certification

```mermaid
erDiagram
    batches ||--o{ learning_sessions : schedules
    learning_sessions ||--o{ session_participations : offers
    enrollments ||--o{ session_participations : eligible_through
    session_participations ||--o{ participation_versions : observed_as
    courses ||--o{ assessments : defines
    assessments ||--o{ assessment_attempts : receives
    course_assignments ||--o{ assessment_attempts : attempts
    assessment_attempts ||--o{ attempt_result_versions : graded_as
    course_assignments ||--o{ completion_versions : completed_as
    course_assignments ||--o{ certification_versions : certified_as
    learning_sessions {
        ID id PK
        ID batch_id FK
        Instant starts_at
    }
    session_participations {
        ID id PK
        ID session_id FK
        ID enrollment_id FK
    }
    participation_versions {
        ID id PK
        ID participation_id FK
        Code attendance_status
    }
    assessments {
        ID id PK
        ID course_id FK
    }
    assessment_attempts {
        ID id PK
        ID assessment_id FK
        ID assignment_id FK
    }
    attempt_result_versions {
        ID id PK
        ID attempt_id FK
        Code grading_status
    }
    completion_versions {
        ID id PK
        ID assignment_id FK
        Code completion_status
    }
    certification_versions {
        ID id PK
        ID assignment_id FK
        Code certification_status
    }
```

There is at most one stable session_participations identity for an enrollment/session pair, but multiple observation versions. The enrollment's batch must equal the session's batch. Roster-derived opportunities can exist before attendance observations; missing observations are unrecorded/unknown. No roster means unknown denominator coverage, not zero opportunities.

An attempt's assessment and assignment must have the same course. Attempt-selection and eligibility policies are separate from the existence of attempts. Completion and certification both reference the assignment; neither depends on the other's row. Certification is one status timeline per assignment in this proposed baseline; multiple concurrent credentials require a credential identity extension. Missing observations never imply failure, absence, or not-issued status.

## Source events and synchronization observations

```mermaid
erDiagram
    source_systems ||--o{ devices : registers
    devices ||--o{ device_center_memberships : assigned_through
    centers ||--o{ device_center_memberships : hosts
    source_systems ||--o{ sync_runs : observes
    devices o|--o{ sync_runs : reports
    centers o|--o{ sync_runs : attributed_to
    source_systems ||--o{ source_events : namespaces
    source_events o|--o{ source_events : supersedes
    source_systems ||--o{ event_receipts : receives
    sync_runs o|--o{ event_receipts : groups
    source_events o|--o{ event_receipts : matched_by
    source_events ||--o{ projection_outbox : projects_through
    source_systems {
        ID id PK
        ID organization_id FK
    }
    devices {
        ID id PK
        ID source_system_id FK
    }
    device_center_memberships {
        ID id PK
        ID device_id FK
        ID center_id FK
    }
    sync_runs {
        ID id PK
        ID source_system_id FK
        ID device_id FK
        ID center_id FK
    }
    source_events {
        ID id PK
        ID source_system_id FK
        ID supersedes_event_id FK
    }
    event_receipts {
        ID id PK
        ID source_system_id FK
        ID sync_run_id FK
        ID source_event_id FK
    }
    projection_outbox {
        ID id PK
        ID source_event_id FK
    }
```

Additional required source_systems relationships apply to centers, courses, batches, learners, enrollments, course_assignments, learning_sessions, assessments, and assessment_attempts. Every inherited version source_event_id is an optional provenance relationship. Version supersedes_id is an optional self-reference constrained to the same stable parent or association.

A run can have unresolved device/center mapping, but such telemetry cannot bypass role scope as a user-facing unowned record. Receipts may have no canonical event after validation rejection. Many identical receipts can map to one event revision. A correction is a new accepted source revision; same identity/revision with conflicting digest does not become a second canonical fact.

Outbox uniqueness and the canonical write share a commit boundary. Transfer success does not itself guarantee projection/publication success, freshness, or complete local activity coverage.

## Analytics reports and audit

```mermaid
erDiagram
    dataset_snapshots ||--o{ snapshot_metric_definitions : pins
    metric_definitions ||--o{ snapshot_metric_definitions : used_as
    dataset_snapshots ||--o{ analytics_results : evaluates
    metric_definitions ||--o{ analytics_results : defines
    dataset_snapshots ||--o{ report_runs : reproduces
    report_templates ||--o{ report_runs : formats
    users ||--o{ report_runs : requests
    users o|--o{ audit_events : acts_in
    source_events o|--o{ audit_events : provenance_for
    dataset_snapshots o|--o{ audit_events : referenced_in
    dataset_snapshots {
        ID id PK
        Text snapshot_version
        Text content_reference
    }
    metric_definitions {
        ID id PK
        Text metric_code
        Text definition_version
    }
    snapshot_metric_definitions {
        ID id PK
        ID snapshot_id FK
        ID metric_definition_id FK
    }
    analytics_results {
        ID id PK
        ID snapshot_id FK
        ID metric_definition_id FK
    }
    report_templates {
        ID id PK
        Text template_version
    }
    report_runs {
        ID id PK
        ID requested_by_user_id FK
        ID template_id FK
        ID snapshot_id FK
    }
    audit_events {
        ID id PK
        ID actor_user_id FK
        ID source_event_id FK
        ID snapshot_id FK
    }
```

Published content is an immutable materialized dataset/manifest, not a generic foreign key to whichever canonical records are current. Manifest validation proves its exact record versions and definition membership. An analytics result must use a definition pinned to its snapshot and the complete authorized context; an aggregate row is never an access grant.

Report templates and publications are pinned, but report access is checked against current permissions. Optional private artifacts inherit this access check. Audit targets use redacted evidence locators rather than arbitrary polymorphic FKs; removing a source record must not automatically erase audit evidence.

## Relationship and business-rule review

| Area | Business cardinality or invariant | Acceptance concern |
| --- | --- | --- |
| Roles/scopes | User-to-role is many-to-many through assignments; each assignment has zero or more explicit targets | No target means no data; role titles never establish geography |
| Geography | Proposed region-to-district-to-block-to-center path, with direct district fallback and optional unknown block | Unknown mapping remains visible; no inferred cluster/block equivalence or invented history |
| Operational units | Units and centers are many-to-many through effective memberships | Deduplicate center identity across overlapping grants |
| Schemes | Categories have schemes; centers have many scheme memberships | Group totals may be non-additive |
| Batches/enrollment | Center/course have batches; learners and batches connect through enrollments | Enrollment counts differ from distinct learners |
| Attendance | Enrollment/session opportunity is unique; observations are versioned | Missing is not absent; batch mismatch is invalid |
| Outcomes | Assignment has many attempt observations and independent completion/certification timelines | Grade pending is not fail; completion is not certificate evidence |
| Sync | Source event revision has many receipts and projection instructions | Retry delivery does not inflate accepted facts |
| Snapshots/reports | Publication pins definitions; report pins publication/template/context | Identical context yields reconcilable values |
| Audit | Optional actors and provenance, append-only event identity | Unknown actor is allowed; restricted evidence survives approved record lifecycle changes |

Conditional relationships, nonoverlap, same-course/batch checks, and snapshot manifest validation require explicit constraints or transactional validation in a later implementation. Diagram completeness does not prove source availability or deployed enforcement.
