# Sarthak data dictionary

**Owner:** Database Architect Agent. **Reviewers:** Business Analyst, Analytics, Security, Backend, Reporting, QA. **Status:** Proposed logical field definitions; physical types and policies open. **Version:** 0.6. **Date:** 2026-10-14.

This dictionary defines all 44 entities in [database design](database-design.md). Types are logical, not SQL. The [ER model](entity-relationship-model.md) describes cardinalities. Fields, statuses, and boundaries are proposals pending the relevant [assumptions](assumptions.md); no records or database are created here.

## Types and inherited fields

**ID** is an opaque stable identifier; **Text** is bounded text with limits selected later; **Code** is a validated vocabulary value; **Instant** is a UTC timestamp; **Date** is a calendar date with declared business meaning; **Integer** is a whole count/version; **Decimal** is exact numeric precision selected later; **Boolean** is true/false; **Document** is structured metadata validated against a versioned contract. R means required; N means nullable. FK always names a parent in the text; inherited organization FKs apply even when diagrams omit their arrows. Fields grouped on one row have the same type/nullability; their meanings remain separately stated.

| Common field | Type and rule | Meaning |
| --- | --- | --- |
| id | ID, R, PK on every entity | Unique row identity; version row IDs are not stable parent business IDs |
| organization_id | ID, R, FK organizations | On every entity except organizations, roles, permissions, role_permissions; cross-organization references forbidden |
| created_at | Instant, R | Cloud/fixture record creation time; not source business creation or last update |

Version fields below are inherited by center_versions, batch_versions, enrollment_versions, completion_versions, participation_versions, attempt_result_versions, certification_versions, unit_center_memberships, center_scheme_memberships, and device_center_memberships.

| Version field | Type and rule | Meaning |
| --- | --- | --- |
| version_no | Integer, R, positive | Increasing version within parent identity or association key; not global commit order |
| valid_from / valid_to | Instant, N | Source business-valid interval; unknown start prevents unsupported historical claims; end, when known, is later than start |
| recorded_at | Instant, R | When the cloud records this immutable observation |
| occurred_at / received_at | Instant, N | Source occurrence and cloud receipt respectively; null preserves unavailable evidence |
| source_event_id | ID, N, FK source_events | Applied provenance; optional for validated synthetic/reference records |
| supersedes_id | ID, N, FK same version table | Previous observation for the same parent/association; no cycles |

Membership validity starts are required for an accepted effective mapping. A mapping without trustworthy effective dates is unresolved or current-only, not silently given historical validity. Superseded rows remain evidence; canonical selection uses the pinned snapshot, not all row counts. A correction may overlap the old asserted interval because it replaces that assertion; independently active memberships must satisfy the interval rules in database design.

## Organizations and geography

### organizations

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code / name | Text, R; code unique | Boundary identifier and display name |
| status | Code, R | Enabled/disabled organization lifecycle; proposed vocabulary |
| authorization_version | Integer, R, nonnegative | Advances when effective access policy changes; cache/report invalidation input |

### geographic_areas

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code / name | Text, R | Area identity/display; code unique within organization |
| area_kind | Code, R | REGION, DISTRICT, or proposed BLOCK under A-24 |
| parent_area_id | ID, N, FK geographic_areas | Region for a district; district for a block; root region has no parent |
| status | Code, R | Current reference availability; historical reference state is retained in snapshot content |

### organizational_units

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code / name | Text, R | Unique organization code and display name |
| unit_kind | Code, R | Proposed CLUSTER or DIVISION; unrelated to automatic role access |
| parent_unit_id | ID, N, FK organizational_units | Optional approved operational parent; no cycles |
| status | Code, R | Current reference availability |

## Centers and schemes

### centers

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Identity namespace, including a synthetic source |
| source_center_key | Text, R | Stable key unique within source and organization |
| display_code | Text, R | Center label; not identity proof |

### center_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| center_id | ID, R, FK centers | Stable center |
| name | Text, R | Observed center display name |
| district_area_id | ID, N, FK geographic_areas | Observed district; null is unmapped, not hidden exclusion |
| block_area_id | ID, N, FK geographic_areas | Proposed block under A-24; when supplied, its district parent must agree with any direct district mapping; null is unknown/not supplied |
| onboarding_status | Code, R | Proposed pending/onboarded/unknown; qualifying policy A-03 |
| onboarded_at | Instant, N | Source onboarding milestone; unknown when unavailable |
| activity_status | Code, R | Active/inactive/unknown under A-04 |
| classification_rule_version | Text, N | Applied activity policy; required when derived classification is asserted |

### unit_center_memberships

Inherits version fields; accepted mappings require valid_from.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| association_key | Text, R | Stable identity of the membership across corrections |
| unit_id / center_id | ID, R, FKs organizational_units / centers | Operational unit and member center |
| membership_status | Code, R | Active/ended/unresolved mapping observation |

### scheme_categories

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code / name | Text, R | Unique category code and label |
| status | Code, R | Reference lifecycle |

### schemes

| Field | Type and rule | Meaning |
| --- | --- | --- |
| category_id | ID, R, FK scheme_categories | Proposed one category per scheme |
| code / name | Text, R | Unique scheme code and label |
| status | Code, R | Reference lifecycle; category/name copies are snapshot-pinned |

### center_scheme_memberships

Inherits version fields; accepted mappings require valid_from.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| association_key | Text, R | Stable source/synthetic membership key |
| center_id / scheme_id | ID, R, FKs centers / schemes | Many-to-many membership |
| membership_status | Code, R | Active/ended/unresolved observation |

## Users and roles

### users

| Field | Type and rule | Meaning |
| --- | --- | --- |
| display_label | Text, R | Minimal principal label; synthetic in demonstration |
| identity_issuer / identity_subject | Text, N | External identity pair; both present or both absent; unique within organization when present |
| is_demo_identity | Boolean, R | Explicit simulated principal flag; not a login grant |
| status | Code, R | Enabled/disabled principal; current access check |

### roles

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code | Code, R, unique | CM, JDM, SDM, SUPER_ADMIN |
| name | Text, R | Cluster Manager, Junior Divisional Manager, Senior Divisional Manager, Super Admin |

### permissions

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code | Code, R, unique | Proposed view/compare/detail/report capability identifier |
| description | Text, R | Exact action and field/detail boundary; no implicit write capability |

### role_permissions

| Field | Type and rule | Meaning |
| --- | --- | --- |
| role_id / permission_id | ID, R, FKs roles / permissions | Effective capability grant |
| valid_from | Instant, R | Grant effective start |
| valid_to | Instant, N | Revocation/end; changes are audited and increment affected authorization versions |

### user_role_assignments

| Field | Type and rule | Meaning |
| --- | --- | --- |
| user_id / role_id | ID, R, FKs users / roles | Assigned principal and role |
| valid_from | Instant, R | Effective grant start |
| valid_to | Instant, N | Effective end/revocation |
| assignment_version | Integer, R | Revision used for authorization/caching; updates are audited |

### assignment_scopes

| Field | Type and rule | Meaning |
| --- | --- | --- |
| assignment_id | ID, R, FK user_role_assignments | Scope belongs to this grant |
| scope_kind | Code, R | ORGANIZATION, AREA, UNIT, or CENTER |
| organization_target_id | ID, N, FK organizations | Populated only for ORGANIZATION and equals owning organization |
| area_id / unit_id / center_id | ID, N, respective FKs geographic_areas / organizational_units / centers | Exactly one target across these and organization_target_id, matching scope_kind |
| valid_from | Instant, R | Scope start |
| valid_to | Instant, N | Scope end/revocation; no overlapping duplicate targets |

Effective permission combines role grant, assignment, target validity, current approved unit/geography membership, and field/action rules. No scopes means no data, not organization-wide access. Historical data is still authorized against current permissions; policy for historical center membership remains A-02.

## Batches and learners

### courses

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Source namespace |
| source_course_key / name | Text, R | Stable source key and current label, copied into snapshots |

### batches

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Source namespace |
| source_batch_key / display_code | Text, R | Stable identity and display label |
| center_id / course_id | ID, R, FKs centers / courses | Proposed single center/course per batch |
| scheme_id | ID, N, FK schemes | Unknown/not scheme-linked when null |
| source_created_at | Instant, N | Original creation time; absent value excludes monthly attribution with coverage notice |

### batch_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| batch_id | ID, R, FK batches | Stable batch |
| lifecycle_status | Code, R | Proposed planned/running/completed/cancelled/unknown |
| approved_capacity | Integer, N, nonnegative | Eligible seat capacity; zero/missing cannot be a utilization denominator |
| planned_start_at / planned_end_at | Instant, N | Source planning dates; end after start when both supplied |

### learners

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Source identity namespace |
| source_learner_key | Text, R | Unique source identity; cross-source matching requires an approved reconciliation process |
| display_label | Text, N | Synthetic/anonymized display only; no required contact/identity-document data |

### enrollments

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Enrollment identity namespace |
| source_enrollment_key | Text, R | Stable source enrollment ID |
| learner_id / batch_id | ID, R, FKs learners / batches | Learner and batch; repeat source assignments are separate identities if valid |
| enrolled_at | Instant, N | Original business enrollment time, not receipt time |

### enrollment_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| enrollment_id | ID, R, FK enrollments | Stable enrollment |
| lifecycle_status | Code, R | Proposed active/cancelled/transferred/completed/unknown |
| is_eligible | Boolean, N | Eligibility under named policy; null is unresolved |
| eligibility_rule_version | Text, N | Required when eligibility is derived rather than directly source-defined |

### course_assignments

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Assignment namespace |
| source_assignment_key | Text, R | Stable assignment instance; repeats require separate identity |
| enrollment_id / course_id | ID, R, FKs enrollments / courses | Assignment grain; course agrees with batch under current proposal |
| assigned_at | Instant, N | Source assignment time |

### completion_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| assignment_id | ID, R, FK course_assignments | Course assignment whose outcome is observed |
| completion_status | Code, R | Proposed in_progress/completed/not_completed/unknown |
| is_eligible | Boolean, N | Eligible assignment under completion policy |
| completed_at | Instant, N | Supported completion evidence time |
| completion_rule_version | Text, N | Applied source/business criterion version |

## Attendance

### learning_sessions

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Session namespace |
| source_session_key | Text, R | Stable session identity |
| batch_id | ID, R, FK batches | Session's batch |
| starts_at / ends_at | Instant, N | Source schedule; absent time prevents unsupported date grouping |
| session_status | Code, R | Proposed scheduled/held/cancelled/unknown; source corrections and snapshot copies retained |

### session_participations

| Field | Type and rule | Meaning |
| --- | --- | --- |
| session_id / enrollment_id | ID, R, FKs learning_sessions / enrollments | Unique same-batch learner-session opportunity |
| opportunity_source | Code, R | Source roster or approved reconstructed roster; not proof of attendance |

### participation_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| participation_id | ID, R, FK session_participations | Opportunity identity |
| is_eligible | Boolean, N | Eligible attendance opportunity; unknown requires coverage disclosure |
| attendance_status | Code, R | Present/absent/unrecorded/unknown under approved vocabulary |
| recorded_by_source_at | Instant, N | Time source captured attendance, distinct from session and upload times |
| eligibility_rule_version | Text, N | Named attendance rule for derived eligibility |

A known eligible opportunity without an observation is unrecorded/unknown. An unavailable source roster does not prove that no eligible opportunities existed. Attendance rate denominator is A-09, not a default inferred from available rows.

## Assessments and certification

### assessments

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Assessment namespace |
| source_assessment_key / title | Text, R | Stable assessment identity and display label |
| course_id | ID, R, FK courses | Assessed course |
| maximum_score | Decimal, N, nonnegative | Source scale when available; no assumed pass threshold |

### assessment_attempts

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Attempt namespace |
| source_attempt_key | Text, R | Stable attempt ID; retry delivery is not another attempt |
| assessment_id / assignment_id | ID, R, FKs assessments / course_assignments | Same-course assessment and assigned learner-course instance |
| attempted_at | Instant, N | Source attempt time |
| attempt_number | Integer, N, positive | Source sequence when trustworthy; not the selection policy |

### attempt_result_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| attempt_id | ID, R, FK assessment_attempts | Stable attempt |
| grading_status | Code, R | Pending/graded/invalid/unknown |
| score | Decimal, N | Grade only when supported; scale from assessment/source revision |
| outcome | Code, N | Pass/fail only when supported by grading and policy; pending is not fail |
| graded_at | Instant, N | Source grading time |
| assessment_rule_version | Text, N | Grading/attempt-selection policy associated with interpretation |

Assessment-eligible populations come from assignment/assessment policy, not only from attempts that exist. Historical assessment scale and source rules are pinned in snapshot content.

### certification_versions

Inherits version fields.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| assignment_id | ID, R, FK course_assignments | Independent certification status for this assignment |
| certification_status | Code, R | Source-supported issued/pending/not_issued/not_eligible/revoked/expired/unknown; vocabulary A-12 |
| is_eligible | Boolean, N | Certification eligibility; not inferred from completion without policy |
| external_certificate_key / issuer_label | Text, N | Source credential identity/issuer; identifiers are restricted detail |
| issued_at / expires_at | Instant, N | Source evidence only; dates must be consistent when both available |
| certification_rule_version | Text, N | Eligibility/status interpretation rule |

Multiple credentials per assignment are not assumed. If A-12 permits multiple issuers/credential types simultaneously, add a stable credential entity and scope versions to it before implementation. No certification row or missing identifier alone means not-issued; no observation means unknown.

## Synchronization logs

### source_systems

| Field | Type and rule | Meaning |
| --- | --- | --- |
| code / name | Text, R | Unique namespace and source label |
| source_kind | Code, R | Synthetic_fixture or future_lms_adapter |
| status | Code, R | Enabled/disabled source admission state |
| contract_version | Text, N | Approved identity/payload contract; credentials live outside this table |

### devices

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Source namespace |
| source_device_key / label | Text, R | Stable device identity and minimal display label |
| status | Code, R | Registered/retired/unknown device lifecycle, not connectivity |

### device_center_memberships

Inherits version fields; accepted mappings require valid_from.

| Field | Type and rule | Meaning |
| --- | --- | --- |
| association_key | Text, R | Stable mapping identity |
| device_id / center_id | ID, R, FKs devices / centers | Device's approved center mapping |
| membership_status | Code, R | Active/ended/unresolved |

### sync_runs

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Authenticated/synthetic reporting source |
| source_run_key | Text, R | Stable observed transfer attempt ID |
| device_id / center_id | ID, N, FKs devices / centers | Source-attempt mapping; unresolved center is restricted diagnostics, not an unrestricted user row |
| observed_started_at / observed_ended_at | Instant, N | Source attempt times; missing evidence retained |
| last_observed_at | Instant, R | Cloud observation of this attempt's current state |
| transfer_outcome | Code, R | Observed pending/successful/partial/failed/unknown; not freshness |
| connectivity_observation | Code, R | Connected/disconnected/unknown, with observation timestamp |
| reported_expected_count / reported_pending_local_count | Integer, N, nonnegative | Source-reported expectations/backlog only; unknown is null |
| accepted_count / rejected_count | Integer, N, nonnegative | Processing counts with declared record grain; not independent learner metrics |
| error_code | Code, N | Sanitized operational failure category |

Never successfully synchronized is derived from supported history, not a fabricated run. Freshness is computed from trustworthy observations and a policy, not permanently stored in transfer_outcome.

### source_events

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Dedup namespace |
| source_event_key / source_revision | Text, R | Unique source event revision; missing identity prevents accepted processing |
| payload_digest | Text, R | Canonical-content digest; algorithm/version documented by source contract |
| event_kind | Code, R | Validated domain event family |
| occurred_at | Instant, N | Original business event time |
| first_received_at | Instant, R | First cloud receipt of this revision |
| applied_at | Instant, N | Committed canonical application time, never set before successful commit |
| processing_state | Code, R | Received/validated/applied/quarantined under candidate lifecycle |
| supersedes_event_id | ID, N, FK source_events | Earlier accepted source revision for same source/business event |
| safe_payload_reference | Text, N | Protected payload reference when approved; not raw payload in dashboard/log |

### event_receipts

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_system_id | ID, R, FK source_systems | Admitted source; unauthenticated requests stay outside accepted event storage |
| sync_run_id | ID, N, FK sync_runs | Run when reliably identified |
| source_event_id | ID, N, FK source_events | Matched canonical revision; null for unmatched/rejected receipt |
| incoming_event_key / incoming_revision | Text, N | Untrusted candidate identity; null for malformed input |
| incoming_digest | Text, N | Compared content digest when computable |
| received_at | Instant, R | This delivery's cloud time |
| disposition | Code, R | Accepted/duplicate/conflict/rejected/unresolved |
| error_code / correlation_id | Text, N | Sanitized reason and investigation link |

### projection_outbox

| Field | Type and rule | Meaning |
| --- | --- | --- |
| source_event_id | ID, R, FK source_events | Canonical event committed with the instruction |
| projector_code / projection_version | Text, R | Unique event/projector/version processing identity |
| state | Code, R | Queued/processing/succeeded/retryable/blocked; bounded operational lifecycle |
| attempt_count | Integer, R, nonnegative | Processing retries, not source learner attempts |
| next_attempt_at / processed_at | Instant, N | Retry schedule and successful processing evidence |
| error_code | Code, N | Sanitized failure cause |

## Analytics and reports

### metric_definitions

| Field | Type and rule | Meaning |
| --- | --- | --- |
| metric_code / definition_version / name | Text, R | Stable KPI code, immutable version, and display label |
| grain / unit | Code, R | Count/rate/population grain and result units |
| rule_specification | Document, R | Prose/validated rules for source, eligibility, numerator, denominator, missingness, date basis, rounding, and coverage; not executable code |
| approval_status | Code, R | Draft/reviewed/accepted; no assumed business approval |

### dataset_snapshots

| Field | Type and rule | Meaning |
| --- | --- | --- |
| snapshot_version | Text, R | Unique organization publication identity |
| scenario_version | Text, N | Synthetic scenario identity; null for future source publication |
| publication_state | Code, R | Building/published/failed/retired; only coherent published content is queryable |
| receipt_cutoff_at / published_at | Instant, N | Receipt boundary and publication time; required for published snapshot |
| reporting_timezone | Text, R | Agreed timezone used for calendar grouping |
| content_reference / content_checksum | Text, R for published | Immutable complete materialized content reference and integrity digest |
| content_manifest | Document, R for published | Exact record/version membership, reference copies, lineage, policy references, and archive format |
| coverage_metadata | Document, R | Source/population omissions, unknown mappings, unavailable history, and observation limits |

Snapshot versions are not based on arrival sequence IDs alone: concurrently committed data requires a coherent publication boundary. The archived content and pinned definitions are immutable; lifecycle retirement is an audited operational change, not content mutation.

### snapshot_metric_definitions

| Field | Type and rule | Meaning |
| --- | --- | --- |
| snapshot_id / metric_definition_id | ID, R, FKs dataset_snapshots / metric_definitions | Exact definition selected for publication |
| metric_code | Text, R | Equals referenced definition's code; unique within snapshot, validated transactionally |

### analytics_results

| Field | Type and rule | Meaning |
| --- | --- | --- |
| snapshot_id / metric_definition_id | ID, R, respective FKs | Pinned data and approved calculation version |
| context_fingerprint | Text, R | Canonical key covering organization, authorized center membership/action/field policy and version, snapshot, metric, filters, grouping, period, cutoff, timezone |
| context_metadata | Document, R | Corresponding validated context and group identity; no arbitrary untrusted executable filter |
| value / numerator / denominator | Decimal, N | Result and comparable rate parts; null result may mean unavailable; counts use exact integral semantics |
| unavailable_reason | Code, N | Required when no result is available |
| coverage_metadata | Document, R | Included/excluded populations and missing observations |
| computed_at | Instant, R | Derived result computation time |

A definition must be pinned to the referenced snapshot. Cache lookup never supplies authorization; current policy checks precede return. Direct querying of global aggregates is not a way to reconstruct restricted scope. Derived results may be omitted entirely in a small fixture implementation.

### report_templates

| Field | Type and rule | Meaning |
| --- | --- | --- |
| template_code / template_version / name | Text, R | Immutable template identity and label |
| specification | Document, R | Fields, KPI codes, layout, allowed filters, metadata, supported preview/optional format capabilities |
| approval_status | Code, R | Reviewed state; no implied completed export |

### report_runs

| Field | Type and rule | Meaning |
| --- | --- | --- |
| requested_by_user_id | ID, R, FK users | Synthetic/trusted requester, not permanent access entitlement |
| template_id / snapshot_id | ID, R, FKs report_templates / dataset_snapshots | Pinned template and publication |
| authorization_version | Integer, R | Permission version at generation; rechecked at access |
| context_fingerprint / context_metadata | Text / Document, R | Authorized membership, filters, period, timezone, scope description, cutoff, pinned definitions |
| output_kind | Code, R | Preview or separately approved download format |
| run_status | Code, R | Requested/ready/failed/expired; optional asynchronous states only if implemented |
| generated_at / expires_at | Instant, N | Successful generation and optional access expiry |
| artifact_reference / artifact_checksum | Text, N | Private optional artifact; not a public URL granting access |
| error_code | Code, N | Sanitized failure; failed generation is not ready |

## Audit

### audit_events

| Field | Type and rule | Meaning |
| --- | --- | --- |
| actor_kind | Code, R | User/source/system/unknown |
| actor_user_id / source_event_id | ID, N, FKs users / source_events | Applicable actor/provenance references; unknown actors are not invented |
| action_code / outcome | Code, R | Material/security action and success/denied/failure outcome |
| target_kind / target_reference | Text, N | Validated evidence locator, intentionally not a polymorphic FK or permission grant |
| correlation_id | Text, R | Cross-component investigation ID |
| occurred_at / recorded_at | Instant, R | Action occurrence and audit persistence; source-event time remains separate |
| authorization_version | Integer, N | Applied permission version when relevant |
| snapshot_id | ID, N, FK dataset_snapshots | Referenced publication when relevant |
| change_summary | Document, N | Redacted before/after differences and reason; no secrets/raw learner payloads |

Audit IDs and facts are append-only; retention/anonymization require a separately approved process. User/source deletion must not silently cascade-delete evidence. Unauthenticated source admission failures may be audited with unknown actor and no source_event FK.

## Sensitive-data and policy notes

External identity subjects, source learner keys, detailed learner outcomes, certificate identifiers, report references, and audit locators require restricted access and minimization in future production. Organization/geography/scheme labels are scoped organizational data, not automatically public. Only invented identities and values are used in the demonstration.

Length limits, numeric precision, digest algorithm, engine-specific constraints, status vocabularies, source revision order, multiple credentials/courses, retention periods, and performance targets are unselected. Dictionary metadata supports review; it does not establish field availability or authorize operational writes.
