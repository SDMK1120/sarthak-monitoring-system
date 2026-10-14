# Sarthak API specification

**Owner:** Backend Agent. **Reviewers:** Solution Architect, Business Analyst, Security, Database Architect, Analytics, Reporting, Frontend, QA. **Status:** Proposed service-backed contracts; identity, policies, and optional capabilities unapproved. **Version:** 1.0. **Date:** 2026-10-14.

## Scope and conventions

Define 44 proposed endpoints across Authentication, Users, Centers, Batches, Analytics, Reporting, and Synchronization. This is documentation, not application code, OpenAPI source, deployed routes, or executable tests. All paths below include the proposed base `/api/v1`; HTTPS hosting and runtime remain future decisions. Fixture mode may model the responses without claiming a running API or enforced identity.

Monitoring endpoints support the existing [requirements](product-requirements.md), [page specifications](dashboard-pages.md), and [metric definitions](metric-definitions.md). User administration, personal preference persistence, exports, scheduling, and actual LMS ingestion are explicitly marked extensions. Defining a route does not activate those capabilities. The [service design](service-design.md) describes their responsibility and transaction boundaries.

Fields use logical ID, string, integer, decimal, boolean, timestamp, enum, object, or array types; detailed business fields inherit [the dictionary](data-dictionary.md). R means required, O optional, and nullable means unknown/not applicable rather than zero. Timestamps include an explicit offset and are normalized to UTC. Unrecognized request fields, unsupported filters, malformed IDs, and invalid enum values are rejected rather than silently ignored.

## Shared request and response contracts

### Monitoring context Q

| Field | Type/rule | Meaning |
| --- | --- | --- |
| snapshot_id | ID, R after initial selection | Coherent published dataset selected through AN-04; never an access credential |
| region_ids, district_ids, block_ids, center_ids, unit_ids | ID arrays, O | Requested scopes intersected with current authority; explicit forbidden targets are rejected; blocks need approved mappings |
| scheme_category_ids, scheme_ids, course_ids, batch_ids | ID arrays, O only where supported | Domain filters with declared membership/attribution semantics |
| period_start, period_end | Timestamp, required as a pair for flow/activity metrics | Half-open business interval; start earlier than end |
| cohort_start, cohort_end | Timestamp, required as a pair for cohort outcomes | Explicit assignment cohort; not substituted for activity period |
| as_of | Timestamp, R for stock/health metrics | Business evaluation time; source history must support it |
| reporting_timezone | String, O | If provided must match the pinned approved snapshot/policy; presentation timezone is separate |
| detail_status | Enum, O on permitted detail endpoints | Narrows a detail population; does not silently redefine summary cohort eligibility |

GET requests serialize supported Q fields as query parameters; POST query/generation requests carry a context object. Arrays use repeated query parameter names with the same meaning as body arrays. No GET body is used. Route-specific omissions below are mandatory: a parameter is not supported merely because it exists in Q. Server context supplies organization and identity; callers cannot set authoritative role, permissions, or organization ownership.

### Pagination P and metadata M

Lists accept optional page_size (proposed default 25, allowed 1–100), cursor (opaque string), sort (allowlisted column), and direction (asc/desc). Cursor binds endpoint, normalized filters, snapshot when relevant, current permission partition/version, and stable sort plus ID. Changed context/permissions invalidates it; it is not a bearer grant. Proposed bounds are contract candidates, not performance guarantees.

JSON successes return data plus meta. Lists put items, next_cursor, and has_more in data; an optional total_matches is scoped to the full permitted filtered population, never all hidden records. M contains request_id, scoped context, applicable snapshot_id, definition versions, business interval/cohort/as_of, timezone, receipt cutoff, published/generated time where relevant, coverage/exclusions, and demo_data flag. User/auth/admin metadata omits irrelevant metric fields.

Metric values contain metric_code, value (decimal/integer or null), unit, numerator/denominator when relevant, unavailable_reason when null, definition_version, and coverage. Counts/percentages retain calculation precision; rounding follows the metric policy. Lists, summaries, previews, and exports use the same canonical population, not just the current UI page.

### Errors headers and authorization

| Status | Contract use |
| --- | --- |
| 200 | Successful JSON read/query or ready content |
| 201 | Created resource with Location pointing to a separately authorized read |
| 202 | Durably accepted asynchronous work; not completed generation or ingestion |
| 204 | Successful local sign-out with no body |
| 303 | Validated identity callback redirects to a permitted local destination |
| 400 | Malformed syntax/auth callback parameters |
| 401 | Missing/expired/invalid user session or source identity |
| 403 | Action capability denied, before disclosing target information |
| 404 | Resource absent or outside scope, indistinguishable to caller |
| 409 | Idempotency/content conflict, changed cursor/context, or incompatible state |
| 410 | Previously authorized snapshot/artifact retired or expired |
| 412 / 428 | Supplied write precondition failed / required precondition missing |
| 413 / 415 / 422 | Oversized payload / unsupported media type / semantically invalid contract |
| 429 / 503 | Rate limit / unavailable dependency or required publication |

Status semantics follow [HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); the endpoint mapping and error categories above are proposed application policy. Errors return error.code, safe message, optional field_errors, request_id, and retryable boolean. They never expose raw queries, secrets, provider assertions, or forbidden-record existence. Unknown metric evidence is a 200 result with null/reason/coverage; dependency failure is not a fabricated zero.

Dashboard endpoints use a proposed server-managed session cookie, not client-selected roles. Unsafe cookie-authenticated operations require an approved Origin/CSRF check; auth callback has its own transaction protection. Sensitive JSON, auth, directory, and private report responses use a no-store cache policy; any internal metric cache is separately permission-partitioned. Credentials and codes never enter general request logs.

Mutating resource endpoints specify Idempotency-Key where needed and If-Match for versioned existing resources. Replay requires the same authenticated principal, endpoint, normalized content, and current authorization; changed content returns 409. ETags are opaque versions, not IDs or grants. Current authorization precedes returning a prior cached/idempotent response. Limits, key retention, and rate policies require later review.

Capability names below are proposed labels, not approved role grants. All four user roles require explicit capabilities and effective scopes. Lists implicitly intersect assigned scope; explicitly requested forbidden IDs receive a safe denial. Detail access checks object ownership, action, fields, current membership, and historical access policy. Source identities use a separate source registry and cannot call dashboard/admin APIs as users.

The [security RBAC proposal](security-rbac.md) supplies canonical capability names and action-specific scope binding. Resolve each action only against assignments that grant it; a more powerful role in one area cannot borrow another role's unrelated scope. Current permission cells remain unapproved until recorded policy acceptance.

## Authentication APIs

Candidate identity integration uses OpenID Connect Authorization Code flow with PKCE, transaction-bound state/nonce, and validated issuer/audience/signature evidence. Provider and exact session/expiry profiles remain open. This proposal is informed by [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) and [OAuth Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html); application roles/scopes are resolved separately.

### AUTH-01 Start sign-in

**Endpoint:** POST /api/v1/auth/sign-in

**Request:** Body return_path (string, O, local application path only). No password, role, arbitrary issuer, or callback URL supplied by caller.

**Response:** 200 data.authorization_url and transaction expiry; set protected short-lived transaction state. The URL belongs to the configured provider; browser navigation performs the next step. 503 if the approved identity configuration/provider is unavailable.

**Validation:** Allowlisted local return path; approved browser Origin policy; bounded single-use transaction; server-controlled callback, state, nonce, and PKCE setup. Never accept an external return destination or log identity-flow secrets.

**Authorization:** Public pre-login entry with abuse controls; it grants no dashboard access. Disabled identity/organization is checked before an authenticated session can be established. Demo selection is not this endpoint.

### AUTH-02 Complete identity callback

**Endpoint:** GET /api/v1/auth/callback

**Request:** Provider query code/state, or error/state for a failed transaction; browser transaction binding required. Provider-specific extra parameters require an allowlist.

**Response:** 303 to the previously validated local destination after establishing a rotated session; invalid/failed flow returns a safe sign-in error without issuing a session. No token/code is returned as application JSON.

**Validation:** Single-use code/transaction, state binding, configured issuer/callback, PKCE exchange, nonce and identity evidence, permitted identity linkage, expiry, and enabled account/organization. Failed/replayed callback does not fall back to a demo principal.

**Authorization:** Only the correlated identity-flow transaction; resolve trusted subject to approved user and current assignments. Provider claims alone cannot grant organization/role scope.

### AUTH-03 Read current session

**Endpoint:** GET /api/v1/auth/session

**Request:** Session cookie; no body or authoritative role parameters.

**Response:** 200 user_id, minimal display label, current assigned roles, permitted capabilities/scope summaries, authorization_version, session expiry, csrf_token for subsequent protected operations, and demo flag. 401 for absent/invalid session.

**Validation:** Session integrity, expiry/revocation, enabled principal/organization, current assignment versions. No refresh/access tokens or hidden user assignments exposed.

**Authorization:** Authenticated subject's own session. No assignments is a valid empty scope summary, not global visibility.

### AUTH-04 Renew session

**Endpoint:** POST /api/v1/auth/session/renew

**Request:** Current session and CSRF protection; empty body. No refresh token, role, or desired lifetime accepted from browser.

**Response:** 200 updated allowed expiry and current authorization_version with rotated protected session as policy requires; 401 if renewal is not permitted, 503 on required identity dependency failure.

**Validation:** Configured renewal/absolute lifetime, revocation, provider evidence if required, current account/assignments, and CSRF. Renewal cannot bypass required reauthentication or revive revoked privileges.

**Authorization:** Same current subject only. This is an application-session operation, not a public token endpoint.

### AUTH-05 Sign out

**Endpoint:** POST /api/v1/auth/sign-out

**Request:** Session cookie and CSRF check when a session exists; empty body.

**Response:** 204 after local session invalidation/cookie clearance, including repeated no-active-session calls under the safe request policy. External provider/global logout is a separately configured optional flow, not promised here.

**Validation:** Safe-origin/CSRF policy, session binding, and idempotent local revocation.

**Authorization:** Current caller's local session only; cannot sign out arbitrary users. Frontend clears sensitive held views.

## User APIs

Directory/admin/preferences are proposed UI extensions under A-27. They do not modify LMS users or directly provision an identity provider. Directory visibility and editing authority are separate capabilities.

### USER-01 List permitted users

**Endpoint:** GET /api/v1/users

**Request:** Query role_code, account_status, permitted area_id/unit_id, search (all O), and P; no monitoring Q/date/scheme context.

**Response:** 200 user items with ID, display_label, allowed role/scope summaries, account state, opaque resource version; scoped list metadata only.

**Validation:** Allowlisted role/state/search fields, bounded search, compatible authorized directory target, P rules. Counts and summaries do not expose users/assignments outside directory authority.

**Authorization:** users.directory.read and permitted directory population. No automatic access for CM/JDM/SDM or title-only Super Admin.

### USER-02 Read permitted user access

**Endpoint:** GET /api/v1/users/{user_id}

**Request:** Path user_id; no body.

**Response:** 200 permitted profile, roles, assignment IDs/versions, scopes/effective dates, account state and ETag. Optional audit summary only with separate evidence permission; 404 for inaccessible user.

**Validation:** ID/organization, field projection, directory membership and privacy policy. Never return credential material or unseen broader assignments.

**Authorization:** users.directory.read plus target authority; audit summary additionally requires audit.read.scoped for the relevant evidence. Own-session information is AUTH-03, not a directory bypass.

### USER-03 Create dashboard principal record

**Endpoint:** POST /api/v1/users — optional administration extension

**Request:** Idempotency-Key; body display_label (R), approved identity_link_reference (O), change_reason (R). No password, external role claims, organization override, or invitation-delivery instruction.

**Response:** 201 minimal user resource, state, version, and identity_link_status. Without a verified linkage, the proposed record remains disabled/pending linkage rather than able to sign in. No invitation-sent claim.

**Validation:** Approved identity-reference verification, duplicate issuer/subject policy, string limits, reason, organizational ownership, enabled-state policy; unknown reference cannot become arbitrary trusted identity.

**Authorization:** users.create within explicit administrative boundary. External identity onboarding/handoff requires its own approved workflow; this route does not silently create provider accounts or send messages.

### USER-04 Update allowed profile or account state

**Endpoint:** PATCH /api/v1/users/{user_id} — optional administration extension

**Request:** If-Match and Idempotency-Key; body allowed display_label and/or account_status (enabled/disabled), plus change_reason (R); at least one permitted change.

**Response:** 200 verified updated permitted resource and new ETag; 412 for stale precondition, 422 for invalid lifecycle action. Save failure never returns success.

**Validation:** Strict field allowlist, current version, verified identity before enabling, target ownership, approved self-affecting/management-authority guards. Identity linkage and role/scope changes are not profile fields.

**Authorization:** users.profile.update and/or users.status.update as applicable, plus control over the affected principal. A scoped directory reader cannot disable a broader principal merely by seeing one assignment.

### USER-05 Change explicit role assignments

**Endpoint:** PATCH /api/v1/users/{user_id}/assignments — optional administration extension

**Request:** If-Match of exposed assignment-set version; Idempotency-Key; change_reason (R); changes array (R). Each item specifies add/revoke/change_scope, applicable assignment_id, approved role_id for additions, exact typed scope targets and effective start/end. No wildcard empty scope.

**Response:** 200 permitted changed assignment summaries, new assignment-set ETag and authorization_version; transactional all-or-nothing result, never a partial broad replacement.

**Validation:** Nonempty bounded changes, matching scope kind/target, same organization, effective intervals, no prohibited overlap, current version, target/role delegation authority, approved privileged/self-change policy. Unseen assignments cannot be overwritten or removed.

**Authorization:** users.assignments.manage for every affected role, assignment, and target; not title inheritance. Revocation updates current access/cache/report/schedule entitlements with audit evidence.

### USER-06 Read assignable role catalogue

**Endpoint:** GET /api/v1/users/role-catalog

**Request:** Optional permitted target_user_id and directory scope selector; no monitoring dates.

**Response:** 200 only role definitions/actions/scope target kinds the caller may inspect or delegate; response distinguishes read-only catalogue from assignable actions.

**Validation:** Static route takes precedence over user ID matching; permitted target/context; no hidden capability enumeration outside catalogue policy.

**Authorization:** users.directory.read for permitted reference view; users.assignments.manage needed for assignable choices. Returned choices do not replace write-time checks.

### USER-07 Read own preferences

**Endpoint:** GET /api/v1/users/me/preferences — optional persistence extension

**Request:** Current session; no body or target user.

**Response:** 200 supported density/date/number/display-time preferences, persistence mode, ETag, and approved reporting-timezone reference. Unsupported controls are not invented.

**Validation:** Known principal, supported preference definitions, default provenance. Preferences are current personal settings, not a reporting snapshot.

**Authorization:** Own enabled session and preferences.read. Cannot read another principal's preferences through this route.

### USER-08 Update own preferences

**Endpoint:** PATCH /api/v1/users/me/preferences — optional persistence extension

**Request:** If-Match and CSRF; body allowed density, date/number display, display_timezone and table_page_size fields; at least one change.

**Response:** 200 verified saved preferences and new ETag; validation/conflict failure retains no false save outcome.

**Validation:** Supported enum/timezone and bounded page size; no reporting calendar, metric rule, policy threshold, permission, credential, or notification activation field. Repeated identical update is harmless.

**Authorization:** Own preferences.update only. Personal presentation cannot grant exports, schedule access, or change KPI meanings.

## Center APIs

### CENTER-01 List centers

**Endpoint:** GET /api/v1/centers

**Request:** Q snapshot, geographic/unit/scheme filters, as_of; activity_status and scoped search (O); P. No course/batch/event-period filter on the network list.

**Response:** 200 distinct center items with identity, applicable geography, onboarding/activity rule/status, relevant scheme labels and coverage; summary fields declare their own grain.

**Validation:** Allowed filters, classification/history support, status vocabulary, P and same-snapshot canonical center versions. No duplicated list rows from overlapping schemes or grants.

**Authorization:** centers.read within current assigned center population; optional source/learner fields require separate permissions.

### CENTER-02 Read center detail

**Endpoint:** GET /api/v1/centers/{center_id}

**Request:** Path center ID, snapshot_id and as_of (R); no body.

**Response:** 200 center version/context, geography/scheme coverage, allowed related-view links and availability; 404 if missing/forbidden. Related learning metrics come from matching batch/analytics contracts, not an unpinned latest query.

**Validation:** Center belongs to current permitted population; snapshot contains supported version/history; links retain context and do not expose forbidden IDs.

**Authorization:** centers.read for that center; current authority is rechecked for historical content.

### CENTER-03 Read center network summary

**Endpoint:** GET /api/v1/centers/summary

**Request:** Q snapshot, geographic/unit/scheme filters and as_of; no local list activity_status filter.

**Response:** 200 onboarded, active, inactive, unknown counts, classification coverage, rule/version, membership overlap notices, and M.

**Validation:** Exclusive status reconciliation, distinct center identity, consistent history/cutoff. Static summary route is not treated as a center ID.

**Authorization:** centers.read with authorized scope applied before counting; inaccessible global summaries cannot be filtered after calculation.

### CENTER-04 Read center scheme memberships

**Endpoint:** GET /api/v1/centers/{center_id}/scheme-memberships

**Request:** center_id, snapshot_id, as_of; optional category/scheme selector and P.

**Response:** 200 valid membership rows, category/scheme, effective intervals, source coverage and overlap note; missing history is explicit.

**Validation:** Same-center ownership, approved temporal mapping, canonical membership revisions and allowed filters. Rows are membership grain, not additional centers.

**Authorization:** centers.read plus schemes.coverage.read within that center; no cross-scope taxonomy/member leakage.

## Batch APIs

### BATCH-01 List batches

**Endpoint:** GET /api/v1/batches

**Request:** Q snapshot, geographic/center/unit/scheme/course filters and as_of; creation_start/end and lifecycle_status (O), P. Creation dates explicitly refer to original source time.

**Response:** 200 batch identity, center/course/attributed scheme, source creation time, applicable lifecycle/capacity/eligible seats/utilization and exclusions, with distinct grain labels.

**Validation:** Date pairing, supported history, comparable capacity/seat population, policy versions and allowlisted sorting. Missing source creation time is not receipt month.

**Authorization:** batches.read through permitted center ownership; no operational batch creation/edit permission is implied.

### BATCH-02 Read batch detail

**Endpoint:** GET /api/v1/batches/{batch_id}

**Request:** batch_id, snapshot_id, as_of (R).

**Response:** 200 batch/context, capacity/lifecycle observation, related tab availability, numerator/denominator/exclusions and M; 404 if missing/forbidden.

**Validation:** Batch's center in current scope, snapshot version/history, valid course/scheme relationships. Current capacity cannot silently replace historical capacity.

**Authorization:** batches.read for the parent center; permitted tab availability does not authorize subsequent detail automatically.

### BATCH-03 Read enrollment breakdown

**Endpoint:** GET /api/v1/batches/{batch_id}/enrollments

**Request:** batch_id, snapshot_id, as_of; optional eligibility/lifecycle detail filter, P, detail_level=aggregate or permitted identity (default aggregate).

**Response:** 200 eligible enrollment count, distinct canonical learner count, known/unknown eligibility coverage, and allowed enrollment items. Restricted learner labels/keys are absent in aggregate mode.

**Validation:** Canonical enrollment identities, same batch, duplicate/transfer policy, allowlisted detail fields and unchanged summary population label.

**Authorization:** batches.read and learning.summary.read; learning.learner_detail.read for identity items. Learner membership elsewhere does not expose its other enrollments.

### BATCH-04 Read attendance breakdown

**Endpoint:** GET /api/v1/batches/{batch_id}/attendance

**Request:** batch_id, Q snapshot, period_start/end; optional session_id, attendance_status, P and permitted detail_level.

**Response:** 200 known eligible opportunities, present/absent/unrecorded/unknown, primary Attendance %, recording coverage, separately labeled observed-only rate, and session/allowed participation items.

**Validation:** Same-batch session/opportunity links, eligible roster evidence, session event period, canonical corrections; unavailable roster makes the required denominator unavailable.

**Authorization:** learning.summary.read for batch center; learning.learner_detail.read for identities. No attendance write is exposed.

### BATCH-05 Read assessments

**Endpoint:** GET /api/v1/batches/{batch_id}/assessments

**Request:** batch_id, Q snapshot, period_start/end and/or explicitly supported cohort/as_of; assessment_id/grading_status (O), P and permitted detail_level. Date_basis must select attempt period or assignment cohort when both modes are supported.

**Response:** 200 eligibility, attempts/distinct learners, selected-attempt rule, graded/pending/pass/fail counts/rates with denominators, and allowed attempt result rows.

**Validation:** Same-course assignment/assessment, valid selection/grade rule, date-basis compatibility, unknown grading not fail; reject an undecided policy rather than inventing one.

**Authorization:** learning.summary.read through batch center; learning.learner_detail.read for identifying outcomes. No attempt delivery or grading mutation.

### BATCH-06 Read course outcomes

**Endpoint:** GET /api/v1/batches/{batch_id}/course-outcomes

**Request:** batch_id, Q snapshot, cohort_start/end and as_of; outcome_kind=completion/certification/both (default both), permitted detail status/level, P.

**Response:** 200 separate completion and certification populations, counts/rates/status coverage, definition versions, and permitted assignment observations. Shared learner does not merge assignment denominators.

**Validation:** Cohort dates and source eligibility, current-status evidence at cutoff, independent certificate rules, conflicts/unknowns, same-batch assignment ownership.

**Authorization:** learning.summary.read; learning.learner_detail.read and learning.certificate_identifier.read for separately restricted fields. No certificate issuance or source outcome edit.

## Analytics APIs

### AN-01 Read scoped filter options

**Endpoint:** GET /api/v1/analytics/filter-options

**Request:** snapshot_id and as_of where mapping requires it; requested option_kind (R: geography/unit/center/scheme/course/batch), compatible parent selectors and P (O).

**Response:** 200 only permitted option IDs/labels, kind, supported descendants/filter combinations, mapping coverage and M. Block availability is explicit.

**Validation:** Option kind/parent compatibility, current scope, supported mappings, search/sort limits if requested. Filter options themselves are restricted data.

**Authorization:** monitoring.read plus domain option visibility; no globally enumerable center/user/source identifiers.

### AN-02 Read metric definitions

**Endpoint:** GET /api/v1/analytics/definitions

**Request:** snapshot_id (R), metric_codes array (O), P.

**Response:** 200 permitted pinned definitions: code/version, name, grain/unit, eligibility/formula/time basis, exclusions, missing/coverage rules, approval state and demonstration policy label. No executable query expressions.

**Validation:** Requested codes exist in that approved or labeled synthetic snapshot definition set; unsupported versions rejected, not replaced silently.

**Authorization:** analytics.read with allowed metric metadata; restricted source diagnostic policy remains separate.

### AN-03 Query metrics and comparisons

**Endpoint:** POST /api/v1/analytics/query

**Request:** Body context Q (R), metric_codes array (R), group_by (O: none/region/district/block/center/scheme_category/scheme/course/batch), permitted dimension selections and P for groups. Date fields depend on the requested metric set.

**Response:** 200 metric values, grouped source-grain results, numerator/denominator/coverage, group context and M. No trustworthy denominator returns null/reason; a rejected query uses a contract error rather than fabricated zeros.

**Validation:** Bounded metric/group set; compatible contexts and date bases; block and other mappings available; scheme center membership versus batch attribution labeled; parent rates recomputed; incompatible policies return 422/POLICY_NOT_READY.

**Authorization:** analytics.read plus applicable analytics.compare.region, analytics.compare.district, or analytics.compare.block for geographic comparisons, over each action's preauthorized center population. POST is read-only but cookie CSRF policy still applies; no Idempotency-Key required for this pure query.

### AN-04 Discover permitted publications

**Endpoint:** GET /api/v1/analytics/snapshots

**Request:** Optional available_before, scenario_version and selector=latest_published; P. Organization is trusted context, not a caller-selected arbitrary tenant.

**Response:** 200 permitted snapshot IDs/versions, publication/receipt times, timezone, available metric versions, demo flag and scoped availability. No raw complete manifest/global coverage payload is exposed.

**Validation:** Published immutable content availability, allowed scenario/time selectors, deterministic ordering; empty/required-unavailable publication state is explicit. Subsequent reads pin the returned ID rather than independently choosing latest.

**Authorization:** monitoring.read for relevant assigned population. Publications containing no authorized readable content do not grant a data path.

## Reporting APIs

All eight RPT-001–008 templates use [reporting strategy](reporting-strategy.md). Scheduling/export routes are optional extensions. A scheduler is not triggered by documentation or by mere template discovery.

### REPORT-01 Read permitted templates

**Endpoint:** GET /api/v1/report-templates

**Request:** Optional report_code, availability=preview/export/schedule, P.

**Response:** 200 permitted template IDs/versions, report names, fields/grains, supported filters, available output capabilities and required date context. Unsupported executable capabilities are not advertised as working.

**Validation:** Allowlisted selectors, current configuration and immutable template versions; no arbitrary dynamic template execution.

**Authorization:** reports.preview with permitted catalogue; export/schedule capability determines corresponding availability flags only.

### REPORT-02 Request preview or export generation

**Endpoint:** POST /api/v1/report-runs

**Request:** Idempotency-Key; body template_id, context Q, output_kind (all R: preview or configured PDF/XLSX/CSV), optional authorized detail selection. Caller cannot set requester identity, finished status, or artifact location.

**Response:** 202 durably recorded run_id, status=requested, pinned context, authorized polling/content locations and M. This candidate async contract applies even to preview; 202 does not mean an artifact is ready.

**Validation:** Template/context/metric-version compatibility; locked status reports; available format, size/field limits, exact snapshot, and required history. Required capability disabled returns a clear error, not a successful placeholder.

**Authorization:** reports.preview or reports.export for chosen output, plus every field/population permission. Worker rechecks current requester rights before producing content.

### REPORT-03 List visible report runs

**Endpoint:** GET /api/v1/report-runs

**Request:** Optional own/history scope selector, template, status, generated interval and P; no arbitrary requester identity unless history-management permission exists.

**Response:** 200 visible run IDs, template/context descriptions, generation state/time, allowed content availability and expiry. No inaccessible result values or broad prior-scope metadata leak.

**Validation:** Allowed selectors, current history visibility, distinct run state versus delivery/access state, and P context binding.

**Authorization:** reports.history.read within own/permitted run population and current content scope. Ownership is necessary where applicable, but not sufficient after revocation.

### REPORT-04 Read run status

**Endpoint:** GET /api/v1/report-runs/{run_id}

**Request:** Path run_id; no body.

**Response:** 200 requested/running/ready/failed/expired status, safe progress/failure, pinned context and content_available; an optional file link always points to a protected access route.

**Validation:** State evidence, current access, immutable template/snapshot, artifact expiry. A ready generation is not notification delivered/read.

**Authorization:** Current permitted requester or separately approved recipient/history viewer, with scope/field rights covering that result; 404 for inaccessible run.

### REPORT-05 Access ready content

**Endpoint:** GET /api/v1/report-runs/{run_id}/content

**Request:** run_id; optional permitted dataset/part selector for a reviewed multi-file export. Output format is fixed by the run, not an arbitrary query override.

**Response:** 200 preview JSON data/M or approved binary/text download with matching media type, safe Content-Disposition, complete metadata and coverage. 409 if not ready; 410 if expired after authorization; generation failure has a safe error.

**Validation:** Ready state, integrity/size/part allowlist, expiry and matching pinned context. Export covers the declared full population or disclosed partial limit; no public artifact redirect bypass.

**Authorization:** Current preview/export plus exact report population/field rights checked at access. Permission change blocks old broad results or requires safe regeneration; downloaded content cannot be recalled.

### REPORT-06 Create proposed schedule resource

**Endpoint:** POST /api/v1/report-schedules — future automation extension

**Request:** Idempotency-Key; template/version, requested scope/filters, recurrence, timezone, period/cohort/as_of rule, snapshot selection/freeze/wait policy, configured formats, registered recipient IDs, channel, effective dates and failure/retry/expiry policies (R under approved profile).

**Response:** 201 schedule_id, configuration version/ETag, state=draft, validated next-occurrence preview and recipient-scope summary. Creating a draft activates no job or delivery.

**Validation:** Full schedule profile, supported timezone/formats/channel, period/cutoff semantics, bounded registered recipients, no arbitrary email targets, owner/recipient intersections, and approved limits. No policy-free recurrence silently defaults.

**Authorization:** reports.schedule.manage plus template/format/requested-scope and recipient-selection authority. Owner is trusted subject, not body field.

### REPORT-07 List visible schedules

**Endpoint:** GET /api/v1/report-schedules — future automation extension

**Request:** Optional permitted owner scope, template, state, P.

**Response:** 200 permitted schedule metadata/version, state, timezone/recurrence, safe next occurrence and current recipient availability; no hidden recipient contact details.

**Validation:** Allowlisted scope/state, current access, date policy, metadata projection. Draft/paused/suspended/retired configurations are distinct from executed runs.

**Authorization:** reports.schedule.read for owned or explicitly delegated schedules; no administrative global list from role title alone.

### REPORT-08 Revise or transition schedule

**Endpoint:** PATCH /api/v1/report-schedules/{schedule_id} — future automation extension

**Request:** If-Match, Idempotency-Key; allowed configuration changes or state transition, plus change_reason. Activation requires complete validated profile and explicit state=active request.

**Response:** 200 verified configuration/new ETag/state and next-occurrence preview; no generated/delivered claim. 412 for stale version, 422 for prohibited transition.

**Validation:** Draft/active/paused/suspended/retired transition policy, current owner/recipients, allowed fields, configuration version, timezone/period/format policy; changed configuration must not duplicate an already identified occurrence.

**Authorization:** reports.schedule.manage for that schedule and every revised recipient/scope/format; current rights rechecked. Retirement/pause does not erase prior run/audit evidence.

### REPORT-10 Read schedule configuration

**Endpoint:** GET /api/v1/report-schedules/{schedule_id} — future automation extension

**Request:** Path schedule_id; no body or caller-selected owner.

**Response:** 200 permitted configuration, immutable/current configuration version, state, safe recipient-scope summaries, next-occurrence preview and ETag. This is the protected Location target for a created draft schedule.

**Validation:** Current parent access, safe recipient projection, valid configuration version and date/format policy. Unavailable next occurrence is explicitly pending, not a fabricated job time.

**Authorization:** reports.schedule.read for the owner or explicitly delegated principal; editing, occurrence content, and recipient report runs require independent capabilities/checks.

### REPORT-09 Read schedule occurrences

**Endpoint:** GET /api/v1/report-schedules/{schedule_id}/occurrences — future automation extension

**Request:** schedule_id, optional intended-period range/state and P.

**Response:** 200 occurrence IDs/intended periods, schedule version, generation and sanitized delivery states, permissible report run links, skipped/held/failed reasons. Notification acceptance is not recipient read evidence.

**Validation:** Parent schedule access, occurrence identity/history integrity, current field scope, permitted linked runs and pagination.

**Authorization:** reports.schedule.read and reports.history.read for the schedule; recipient-specific run content is independently authorized and not exposed by the occurrence list.

## Synchronization APIs

SYNC-01–05 observe cloud evidence and never command an offline client to sync. SYNC-06–07 are a future source-ingestion boundary with machine/source identities, not CM/JDM/SDM/Super Admin sessions.

### SYNC-01 Read synchronization summary

**Endpoint:** GET /api/v1/sync/summary

**Request:** Q snapshot, assigned geographic/center/unit filters, as_of; observed run period and source selector (O); scheme selection only if explicitly supported as associated-center population.

**Response:** 200 expected targets, healthy/degraded/unknown and coverage, separately labeled run outcomes/success rate, last-success availability and source limitations.

**Validation:** Approved cadence/expectation/coverage policy, declared target versus run grains, consistent snapshot/cutoff. Policy unavailable returns N/A/reason for health, not assumed healthy targets.

**Authorization:** sync.monitor.read after current center-scope restriction; sensitive diagnostic fields not included.

### SYNC-02 List targets

**Endpoint:** GET /api/v1/sync/targets

**Request:** Q snapshot/geography/center/unit/as_of, source/device, health/freshness filters (O), P.

**Response:** 200 scoped registered expected target identities/mappings, trustworthy last-success, observed connectivity/outcome, health/reason/coverage, with unknown backlog when unreported.

**Validation:** Effective device mapping, source cadence and classification evidence, allowed fields and P. Unresolved center mapping is not an unscoped publicly visible target.

**Authorization:** sync.monitor.read for parent center; unresolved telemetry requires separate restricted operations authority.

### SYNC-03 List observed runs

**Endpoint:** GET /api/v1/sync/runs

**Request:** snapshot_id, observed_start/end, allowed center/source/device selectors, outcome/freshness detail filters and P. Evaluation cutoff is separate if health fields requested.

**Response:** 200 distinct run observations, source-reported times/counts where known, transfer outcome, mapped center, processing/publication coverage and safe reason.

**Validation:** Observed-run date basis, canonical attempt identity, same-source mapping, no inferred local records; history states reflect publication context.

**Authorization:** sync.monitor.read within mapped center scope; raw payloads and credentials are never returned.

### SYNC-04 Read run evidence

**Endpoint:** GET /api/v1/sync/runs/{run_id}

**Request:** run_id, snapshot_id (R).

**Response:** 200 allowed attempt evidence, source/device/center mapping, outcome, trustworthy timestamps, declared expectation/reconciliation and publication state; 404 if inaccessible.

**Validation:** Current scope and observed version, source run ownership, accurate received/processed/published distinctions. A successful transfer cannot imply complete local activity.

**Authorization:** sync.monitor.read for that center; operational evidence beyond normal fields requires sync.diagnostics.read.

### SYNC-05 Read sanitized receipt history

**Endpoint:** GET /api/v1/sync/runs/{run_id}/receipts

**Request:** run_id, snapshot_id; disposition/event-kind selectors (O), P.

**Response:** 200 permitted receipt IDs, matched event revision references where allowed, receipt time, accepted/duplicate/conflict/rejected/unresolved disposition, sanitized reasons/correlation. No raw event payload or unnecessary learner key.

**Validation:** Parent run/source consistency, safe field projection, receipt grain versus canonical facts, cursor/context rules.

**Authorization:** sync.diagnostics.read plus parent center authority; no implicit diagnostic access from sync health viewing.

### SYNC-06 Submit source transfer observations

**Endpoint:** POST /api/v1/ingestion/sync-runs — future integration extension

**Request:** Approved source authentication and Idempotency-Key; body source_run_key, source_contract_version, observation_revision (R); optional registered device/center keys, observed start/end, outcome/connectivity, reported expectations/backlog and sanitized source error. Organization/source identity are server-bound.

**Response:** 202 durable observation receipt ID, validation/processing status and source-visible correlation; not a declaration that learner data is applied or fully synchronized. No dashboard session issued.

**Validation:** Registered enabled source/device mapping, source contract/revision, count units/nonnegative values, timestamp/clock policy, allowed observation fields, duplicate/conflicting content. Unknown signals remain unknown. Durable failure returns 503, not accepted success.

**Authorization:** Source principal with ingestion.telemetry.write only for its namespace and permitted source-center registrations. User session/role cannot submit this data or impersonate a device.

### SYNC-07 Deliver source event revisions

**Endpoint:** POST /api/v1/ingestion/event-deliveries — future integration extension

**Request:** Source authentication and Idempotency-Key; body contract_version and events array (R), source_run_key (O). Each event has source_event_key, source_revision, allowed event_kind, stable business record/source references and typed domain observation (R), occurred_at nullable, and supersedes_revision (O for a supported correction). Observation fields map to the approved dictionary/source contract; no arbitrary table/organization/permission selector.

**Response:** 202 durable per-event receipt IDs and receipt dispositions/processing status, correlation and accepted-delivery counts with declared grain. Receipt acceptance is not applied fact or published snapshot. Source processing-status feedback beyond the receipt requires a separately reviewed callback/polling contract.

**Validation:** Bounded size/batch cardinality, complete source revision identity, permitted event family/field schema, same-source references, digest computed/verified server-side, required domain constraints, clock/conflict policy. Existing same revision with different content is conflict/quarantine, never a second fact. A structurally invalid request is rejected; any per-record dispositions must declare which deliveries were durably recorded.

**Authorization:** Source-scoped ingestion.events.write for approved domain event families and mapped centers; dashboard user privileges never substitute. Canonical fact/event ledger/outbox commit atomically; retries cannot inflate metrics.

## Contract completion and open items

Every endpoint above defines endpoint, request, response, validation, and authorization. Resolve mode, exact identity/session profile, numeric limits, detailed source event schemas, permission matrices, administrative policies, snapshot/history availability, executable exports, scheduler persistence/recipients, error-profile details, and operational targets before implementation. Optional disabled routes may be absent; they must not return simulated success in enforced mode. No routes, credentials, source integrations, jobs, or application code are produced by this document.
