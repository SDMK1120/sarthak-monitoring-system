# Sarthak dashboard page specifications

**Owner:** UI/UX Agent. **Reviewers:** Product Manager, Business Analyst, Analytics, Reporting, Security, Frontend, QA. **Status:** Proposed experience design; permissions and visual direction pending review. **Version:** 0.8. **Date:** 2026-10-14.

## Scope and document map

Specify the eight requested pages for Super Admin, SDM, JDM, and CM. This is a textual UI/UX design, not a rendered application, clickable prototype, or React implementation. [UI strategy](ui-strategy.md) defines the shared shell and interaction rules; [wireframe descriptions](wireframe-description.md) define screen composition; [user flows](user-flows.md) connect pages into journeys.

User Management and Settings are newly requested design surfaces. Their proposed administrative controls extend the previous monitoring-only experience at design level. They do not approve provisioning, operational writes, unrestricted administration, or a new implementation commitment. A-27 in [assumptions](assumptions.md) records the required permission/lifecycle decisions.

## Role experience and page access

| Page | Super Admin | SDM | JDM | CM |
| --- | --- | --- | --- | --- |
| P-01 Executive Dashboard | Proposed overall monitoring | Assigned regional/divisional summary | Assigned district/operational summary | Assigned cluster/center summary |
| P-02 Center Monitoring | Permitted center network | Assigned centers and contributors | Assigned centers and district contributors | Assigned local centers |
| P-03 Batch Monitoring | Permitted batch coverage | Assigned-area capacity/outcomes | Assigned-area batch investigation | Assigned-center batch/attendance investigation |
| P-04 Scheme Analytics | Permitted scheme distribution | Assigned-area comparisons | Assigned-area coverage | Local scheme coverage |
| P-05 Synchronization Health | Permitted platform observations | Assigned-area evidence coverage | Assigned-location exceptions | Assigned center/device observations |
| P-06 Reports | Permitted catalogue/comparisons | Assigned regional report emphasis | Assigned district report emphasis | Local performance/status/sync reports |
| P-07 User Management | Proposed directory access; administration requires separate grants | No default entry; delegated scoped read only if approved | No default entry; delegated scoped read only if approved | No default entry; delegated scoped read only if approved |
| P-08 Settings | Personal preferences; policy panel only with explicit authority | Personal preferences | Personal preferences | Personal preferences |

This is a navigation proposal, not an accepted permission matrix. Role names do not establish geography or inheritance. Learner detail, regional/district comparison, exports, scheduling, directory access, and administration are separately checked capabilities. Hidden navigation does not enforce access; direct links must receive equivalent checks in any future service-backed mode.

## Shared page requirements

Monitoring pages P-01–06 show page title, assigned scope, business period/cohort, stock as-of time where needed, data-as-of notice, and demo label. Definition and coverage details are available beside relevant metrics. Each page has supported draft filters, Apply, Reset, active chips, scoped search where useful, and accessible chart/table alternatives. A filter cannot appear applied while the page still shows unlabeled results from the previous context.

Header actions are contextual: Open report preview, inspect data coverage, or refresh to available data. Refresh does not request LMS synchronization. Export/schedule/edit controls appear only when the respective experience is permitted and implemented, or in a clearly labeled nonpersistent demonstration. Settings and User Management use separate context rules described below.

## P-01 Executive Dashboard

**Question:** What needs attention in my authorized operations, and how complete is the evidence? **Navigation:** Primary landing page for all roles; subtitle explains actual scope rather than implying global access.

**Layout:** Context/filter strip; center-network cards; operational/learning metric cards; paired trends and geographic comparisons; prioritized observation list; coverage notice. Super Admin emphasizes overall scheme/region coverage, SDM regions and districts, JDM districts and centers, CM centers and batches.

**Widgets:** Total onboarded, active, inactive, and unknown centers; batch utilization with seats/capacity; attendance with recording coverage; observed learner engagement; assignment completion; certification; sync health with healthy/degraded/unknown targets. All eight KPIs use [metric definitions](metric-definitions.md). Supporting counts distinguish enrollments from unique learners.

**Charts:** Column chart of original monthly batch creation; grouped geographic comparison bars for a chosen indicator and its denominator; center classification bar; outcome breakdown with unknown statuses. CM defaults to an assigned-center comparison rather than an unpermitted district chart. Historical trend lines require actual snapshot/history support.

**Filters:** Assigned geography/unit, scheme/category, event period, separately labeled assignment cohort/as-of cutoff; block only where approved mapping exists. **Interactions:** Center cards open P-02 status detail; utilization opens P-03; schemes open P-04; sync exceptions open P-05; report actions open matching P-06 preview. Region/district drilldown remains within P-01/P-02 with breadcrumbs.

**States and traceability:** No assigned scope, no results, partial source coverage, unknown denominator, and failed refresh remain distinct. REQ-001–022 as applicable; UF-01–04.

## P-02 Center Monitoring

**Question:** Which centers are onboarded/active/inactive, and what contributes to a center finding? **Layout:** Network summary; status/scheme breakdown; center table; selected-center detail panel.

**Widgets/charts:** Onboarded, active, inactive, unknown counts; classification coverage; distinct-center scheme/category bars with overlap note; selected center's batches, learning indicators, and independent sync observations. Avoid an unapproved center performance score.

**Table:** Center code/name, region/district/optional block, recorded activity status, schemes, known batch/enrollment counts, sync freshness, and data coverage. Capacity/learning percentages include denominator access. Sortable columns and deterministic pagination are specified; table search operates only on permitted center metadata.

**Filters:** Geography/unit, scheme/category, as-of cutoff, snapshot context; status is a local center-list filter with a label that distinguishes its results from full-context summary counts. **Detail:** Overview, Batches, Learning, Synchronization tabs; learning details include attendance/assessment/completion/certification through P-03. Learner identities require permission.

**Actions:** Open batch/sync detail; open RPT-001, RPT-002, or RPT-003 in P-06 with matching scope. No center creation, source status editing, or inferred inactivity from stale sync. **States/trace:** Unmapped geography and unknown classification remain visible. REQ-003–007, REQ-015–019; UF-01–04.

## P-03 Batch Monitoring

**Question:** How are batches formed and utilized, and where are participation/outcome gaps? **Layout:** Creation/occupancy summary, creation trend, batch list, then selected-batch detail tabs.

**Widgets:** Batches created during the selected event period; utilization for the separately stated stock population; seats/capacity; eligible enrollments and unique learners; attendance/coverage, assessment grading/outcomes, assignment completion, and independent certification. Missing capacity and unknown eligibility are visible exclusions.

**Charts:** Monthly creation columns; utilization bars showing comparable counts and optional overcapacity; attendance present/absent/unrecorded breakdown; assessment graded/pending outcomes; completed and certification status breakdowns. Different grains are separate views, not stacked into one total.

**Table/detail:** Batch code, center, course, attributed scheme, original creation time, lifecycle, capacity, eligible seats, utilization, coverage. Detail tabs are Capacity and Enrollment, Attendance, Assessments, Completion, Certification. Session/assignment summaries precede any permission-controlled learner detail.

**Filters:** Center/geography/unit, course, batch, attributed scheme/category, creation interval, lifecycle/detail status; learning event period, assignment cohort, and stock cutoff are explicitly labeled rather than merged into one ambiguous date field.

**Actions:** Open related center, inspect sync confidence, open RPT-005 or center learning preview. No batch creation, enrollment edits, attendance entry, assessment execution, or certificate issuance. **States/trace:** Zero/missing capacity is unavailable; unrecorded is not absent; completion is not certification. REQ-008–014; UF-03–04.

## P-04 Scheme Analytics

**Question:** How do scheme coverage and attributed learning outcomes differ? **Layout:** Category/selected-scheme context, two population sections, comparative charts, scheme table, selected-scheme detail.

**Widgets:** Distinct participating centers and status split; attributed batch creation/enrollments; comparable utilization, attendance/coverage, engagement, completion/certification; associated-center sync coverage. Each widget names its population.

**Charts:** Category/ scheme horizontal bars for distinct center coverage; separate grouped bars for batch-attributed measures and rate denominators. An overlap note accompanies coverage totals; charts never imply mutually exclusive center groups when membership overlaps.

**Filters:** Category/scheme, approved geography/center, period/cohort/cutoff, course/batch for outcomes. **Interactions:** Category → scheme → participating centers in P-02; scheme → attributed batches in P-03; associated-center sync → P-05; RPT-004 preview → P-06.

**States/trace:** Unassigned membership and null batch scheme have distinct buckets. Learning outcomes use batches.scheme_id, not every scheme attached to the center. Associated-center sync is not scheme-specific transfer success. REQ-006–014, REQ-018; UF-05.

## P-05 Synchronization Health

**Question:** Which observations are recent and complete enough for review? **Layout:** Target-health cards; independent transfer/connectivity/freshness controls; center/target table; selected-target run timeline and coverage detail.

**Widgets:** Healthy/degraded/unknown expected targets; classification/roster coverage; trustworthy last-success time; pending/partial/failed runs; publication coverage. Unknown local backlog is not displayed as zero. Health and run success rate use separate labels/denominators.

**Charts:** Target classification bars; observed transfer outcomes by period; available run timeline with occurrence/receipt/processing milestones clearly labeled. A recent publication of old activity does not claim current source activity.

**Filters:** Assigned geography/center/unit, source/device, health classification, transfer outcome, freshness, observed run interval, evaluation cutoff. **Detail:** Sanitized run/receipt evidence, source-reported expectations, last success, coverage, and unavailable reasons. Raw payloads, credentials, and unrestricted logs are excluded.

**Actions:** Open associated center or RPT-006 preview; refresh received observations. No Retry sync or Force upload action is proposed. **States/trace:** Never observed, known never-successful, stale, partial, failed, and pending are distinct where evidence supports them; offline is not automatically unhealthy. REQ-015, REQ-019; UF-01/04.

## P-06 Reports

**Question:** Can I share a consistent, scoped finding? **Layout:** Permitted report catalogue, filter/context panel, preview workspace, and separately labeled run/schedule history.

**Catalogue:** RPT-001 Center Performance; RPT-002 Active Center; RPT-003 Inactive Center; RPT-004 Scheme Performance; RPT-005 Batch Creation; RPT-006 Synchronization; RPT-007 District Comparison; RPT-008 Region Comparison. Detail and capability rules are in [reporting strategy](reporting-strategy.md).

**Widgets/charts:** Context summary, result/coverage counts, template-specific tables/charts, data-as-of and source notices. No unrelated vanity metric cards. **Filters:** The selected template's supported scope, dates/cohort/cutoff, scheme/course/status, and snapshot; locked active/inactive reports cannot silently select the opposite status.

**Actions:** Preview; optional implemented PDF/XLSX/CSV exports; proposed schedule design with cadence/timezone/recipient review. Preview is the default; unsupported downloads/schedules are explicitly labeled demonstrations or omitted. Report history status distinguishes generated, notified, accessed, failed, and expired where future evidence exists.

**Interactions:** Arrive from another page with matching report/context; preview without changing the snapshot silently; inspect details; return to source finding. Future scheduling uses recipient-specific permission intersections. **States/trace:** Empty, incomplete, denied, failed, expired, and oversized export states. REQ-018; UF-06–07.

## P-07 User Management

**Question:** Who has approved dashboard access, and to which scope? **Layout:** Directory search/filter toolbar, permitted-principal table, user access detail, optional reviewed assignment-change form, audit summary.

**Widgets:** Permitted directory counts by role/account state, pending proposed changes where that future workflow exists, and selected principal's current scopes. Counts refer only to metadata the viewer may see, not inferred hidden users. No chart is required; an accessible role distribution bar is optional if it helps the reviewer.

**Table/detail:** Display label, confirmed role names, allowed scope summary, enabled/disabled state, and last access only if collected/permitted. Contact/identity-provider details are minimized or masked; passwords, tokens, and learner records never appear. Broader assignments outside the viewer's directory authority are not disclosed.

**Filters:** Separate administrative context: permitted organization/directory scope, role, account state, allowed area/unit, scoped text search. Monitoring period/scheme filters do not carry into user access editing.

**Proposed actions:** View assignment detail; for separately granted future administration, propose a user onboarding handoff, assign/remove an approved role/scope, or disable access. Review before committing; require exact target scope, effective dates, change reason, and refreshed permission/version check. The design must not imply direct control of an external identity provider or an invitation already sent.

**Guards:** No automatic title hierarchy, blank-scope wildcard, self-elevation, or modification of unseen assignments. Privileged/self-affecting changes and preservation of management authority need A-27 policy approval. Changes that affect report/schedule access explain the consequence and invalidate affected access in a future implementation.

**States/trace:** Read-only, no directory permission, stale assignment version, validation conflict, proposed/nonpersistent change, save failure, and verified saved outcome are distinct. This page is a newly requested design extension, not covered as an implemented workflow by existing REQ-001–022. UF-08.

## P-08 Settings

**Question:** Which presentation preferences can I change, and which platform policies apply? **Layout:** Personal Preferences for all roles; Report Preferences where permitted; read-only Data and Reporting Policy reference; proposed Policy Administration only with explicit authority.

**Personal controls:** Display density, table rows preference within future limits, date/number presentation, and optional display timestamp timezone. Display preference does not silently change reporting calendar, cohort, or KPI calculations. Preserve the approved report timezone visibly. Language/theme controls remain provisional until supported design/content exists.

**Report preferences:** Default permitted template/format and notification preference only if the corresponding future feature is available; personal choices do not grant schedule/export rights. No actual email subscriptions are created by a mock setting.

**Policy reference:** Current approved reporting timezone, center classification rule, sync cadence/freshness conventions, retention/export policy, and definition status where known. Undecided values say Not configured/Policy pending rather than inventing defaults. Proposed policy changes include an impact preview and review path; activation is outside this design phase.

**Widgets/charts:** Section forms, current/proposed value comparison, policy/status badges, save state. No performance chart or infrastructure-console controls are needed. **Filters:** Section selection and local search only; no monitoring geography/date filter strip.

**Actions/states:** Save personal preferences if future persistence exists; otherwise label Preview preference — not saved. Cancel, restore agreed personal defaults, and warn before leaving dirty forms. Distinguish personal save from proposed policy submission; no source/LMS records are modified. UF-09–10; A-23/A-27.

## Experience acceptance

All eight pages have a clear question, layout, widgets/charts, supported filters, and interactions. All four roles have scoped landing/navigation behavior. Critical states, keyboard/chart alternatives, filter continuity, report parity, administrative scope separation, and demo labels follow [UI strategy](ui-strategy.md). Numeric policy, exact permission matrices, branding, real persistence, and source availability remain explicit dependencies, not achieved implementation outcomes.
