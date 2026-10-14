# Implemented feature walkthrough

**Project:** Sarthak-Monitoring-System. **Status:** local synthetic presentation prototype. Use this inventory with the [Stakeholder demonstration guide](stakeholder-demo-guide.md), [setup instructions](getting-started.md), and the individual implementation notes for [Executive Dashboard](executive-dashboard.md), [Center Monitoring](center-monitoring.md) and [Synchronization Monitoring](synchronization-monitoring.md).

The frontend runs at **http://127.0.0.1:4173** with `npm run demo`, or **http://127.0.0.1:5173** with `npm run dev`. Both modes require the Fastify API on port 3001 and use the frontend's `/api` proxy. The fixed snapshot is **demo-2026-09-v1**, published through **30 September 2026, 12:00:00 UTC / 17:30:00 IST (UTC+05:30)**.

## Delivery inventory

| Area | Implemented behavior | Planned capabilities |
| --- | --- | --- |
| Executive Dashboard | Total/active/inactive/unknown center cards; scheme coverage; cohort batch/enrollment counts; weighted stock utilization; batch and center history charts; target-health summary; searchable/paginated local center table; geographic/scheme/period filters | Additional attendance, engagement, assessment, completion and certification KPI integrations; authorized role-specific landing experiences |
| Center Monitoring | Dedicated server-paginated directory; region/district/scheme/status/search filters; name/code/status sorting; status comparison; geographic drilldowns; center profile, activity history, all recorded batch facts and expected sync targets; context-preserving details/back navigation | Operational center writes, real organization mappings and source-backed center histories |
| Synchronization Monitoring | Expected-target H/D/U cards and coverage; latest-result filters/counts; exact last observation and successful-sync timestamps; target details; primary alert feed with severity/cause/age/recipient recommendation | Actual source ingestion, attempt/retry history, device management and source-initiated synchronization |
| Escalation rules | Default CM/JDM/SDM/Super Admin thresholds; editable enablement/hours/severity; validated POST evaluation with local pagination; reset and explicit preview/default distinction | Persisted policy changes, notification delivery, acknowledgement, assignment and operational escalation workflow |
| APIs and shared contracts | Seven dashboard, four center and six synchronization route patterns; runtime request/response validation; safe envelopes/errors; liveness and PostgreSQL readiness checks | Broader proposed platform APIs, production identity integration and protected data scopes |
| PostgreSQL | Connection configuration, pool/TLS safeguards, local container configuration and readiness query | Business migrations, persistent centers/learners/batches, analytics materialization, policy and audit storage |
| Reports and learning outcomes | Design documents describe requirements | Report generation/export/scheduling and learner attendance, assessment, course completion and certification implementation |
| Identity and administration | Synthetic/demo labeling; proposed CM/JDM/SDM/Super Admin documentation | Login, RBAC enforcement, assigned geography, user management, settings administration and production audit logging |
| Deployment and verification | Local development/build/preview commands; automated type, unit/API and browser checks; responsive layouts | Hosted cloud environment, production operational acceptance and scale validation |

“Route patterns” includes parameterized detail routes. The six synchronization patterns include a POST evaluation endpoint; this POST evaluates request-local rules and does not persist them. Earlier architecture/API documents describe a wider platform vision than this delivered slice.

## Direct bookmarks

Append these paths to the frontend origin. Queries are scoped data filters, not authorization grants.

| Bookmark | Purpose and expected result |
| --- | --- |
| `/` | Executive landing. Reset gives 84 centers, 68 active, 11 inactive, 5 unknown; 288 April–September batches; 6,935 cohort enrollments; 68.4% snapshot utilization. |
| `/centers` | Full center network, ten rows per server page, geographic comparison and status cards. |
| `/centers?region_id=region-1&district_id=district-1` | North Region / District 01: seven centers before an activity selection. |
| `/centers?region_id=region-1&district_id=district-2&scheme_id=scheme-2&activity_status=active&search=SAR-002` | Intersection that identifies Sarthak Center 02. |
| `/centers/center-1` | Center 01: unknown activity, recorded history/batches, target-1 missing evidence and target-2 failed observation. |
| `/centers/center-2` | Center 02: active recorded status and six batch records in the full published history. |
| `/synchronization` | 168 expected targets: 32 healthy, 102 degraded, 34 unknown. Default alert population: 119 primary alerts. |
| `/synchronization?result=failed` | Seventeen latest failed transfers; useful for preview pagination. |
| `/synchronization?region_id=region-1&district_id=district-1&center_id=center-1&result=failed` | One matching failed target: target-2. |
| `/synchronization/targets/target-1` | Missing evidence: null timestamps and unknown age; informational review without inferred failure or recipient escalation. |
| `/synchronization/targets/target-2` | Known failed observation, four hours old at the snapshot; default recommendation JDM. |
| `/api/health/live` | API liveness through the frontend proxy. This does not establish database readiness. |
| `/api/health/ready` | PostgreSQL connectivity check; 503 is possible while synthetic modules remain usable. |

Detail links generated by a listing carry its filters, page and publication context. **Back to centers** and **Back to synchronization** restore that context. Direct bookmarked details have a valid default return context. Refreshing a detail route works in the local SPA preview/development server; a future deployment needs equivalent history fallback and API proxy configuration.

## Executive Dashboard

Use **Region**, **Scheme** and **Event period**, then **Apply filters**. **Reset filters** restores all regions/schemes and the last six available months. **Refresh** reloads the published snapshot rather than advancing data or asking an offline center to synchronize.

Center counts use recorded status at the snapshot, including a separate unknown count. The **Batches created** and **Learner enrollments** cards use the selected batch-creation cohort; enrollment records do not mean distinct learners. **Batch utilization** uses weighted occupied seats/capacity in comparable planned/running batches at the fixed snapshot. Its numerator and denominator both exclude missing/zero capacity. A period-only change can change creation counts while leaving stock utilization unchanged.

Scheme coverage is distinct-center membership and can overlap. Every chart provides **View data table**. Center status cards filter the dashboard's local directory, while the dedicated **Center monitoring** navigation opens the server-backed module. **Open synchronization monitoring** and exception links open the synchronization module and real target detail endpoint.

## Center Monitoring

Stage **Region**, **District**, **Scheme**, **Activity status**, **Search centers**, **Sort by** and **Sort order**; commit with **Apply filters**. Search supports center name/code. Changing region clears district; district choices remain within the selected region. **Previous page** and **Next page** update the URL and obtain another server page.

The four center cards compare total/active/inactive/unknown **before the activity filter**, after geographic, scheme and search constraints. Clicking a status card narrows the directory while retaining that comparison. **Show region …** and **Show district …** provide explicit geographical drilldowns. Empty matches, invalid filter URLs and an out-of-range page have distinct actionable states.

Open a center name to inspect profile/onboarding, source status history, batch records and sync observations. Batch counts cover all available creation dates; when a listing scheme is selected, its batch counts use the batch's own scheme. Center details show the center's full snapshot records. Recorded activity is independent of synchronization health; missing sync evidence never makes a center inactive.

## Synchronization Monitoring

Stage **Region**, **District**, **Center**, **Sync health**, **Transfer result** and **Search sync targets**, then **Apply filters**. Parent geography changes clear incompatible child selections. **Monitor failed transfers** and **Monitor partial transfers** use the latest observed result; they do not count every past attempt.

Expected-target cards compare health before health/result filters, within the applied geographic/search scope. Healthy + degraded + unknown reconciles to the expected roster. Health is healthy / expected targets; classification coverage is (healthy + degraded) / expected targets. The default 168-target roster yields 19.0% health and 79.8% classification coverage. Connectivity is shown separately.

**Synchronization target listing** exposes last observation and **Last successful sync** with date, seconds and **IST (UTC+05:30)**. Target-2's two timestamps are 30 Sept 2026, **13:30:00 IST (UTC+05:30)**; the fixed snapshot is **17:30:00 IST**, producing a four-hour evidence age. Target detail also shows latest result, delivery completeness, publication evidence, location, center link and classification reason. This slice does not expose a historical transfer-attempt timeline.

The default **Synchronization alerts** feed contains one primary observation per target: 17 information, 85 warning and 17 critical alerts. Severity totals displayed above it describe the scope before health/result filters; the feed itself follows the selected filters. Missing evidence has unknown age and no inferred recipient escalation. Alert age describes its reference observation, not a proven incident's lifetime. Target and alert tables have separately labeled pagination controls sharing the current route's page selection; a page outside either population offers recovery.

## Escalation preview

Default thresholds are **CM 0**, **JDM 2**, **SDM 6** and **Super Admin 24** hours. The editor provides **Enable escalation preview**, role-specific **after hours** fields and **Adjust alert severities**. Values must be strictly increasing, CM must remain zero, and thresholds are bounded to 720 hours.

For a reproducible example, open `/synchronization?result=failed`, set **SDM after hours** to **3**, and click **Preview escalation**. Four-hour failed observations change from default JDM to SDM in **Escalation preview alerts**. **Next preview page** evaluates the next page with the same draft rules without changing the main URL. Editing the draft or using **Reset escalation rules** clears old preview results; reset restores the defaults.

The evaluation POST returns `preview: true`. No policy is saved and no notification is delivered. Opening a preview target displays **Default-rule alert recommendation**, evaluated using the default GET policy. Leaving the preview page clears its local draft. Disabling recipient recommendations can be evaluated separately; it does not disable monitoring or remove the primary observations.

## Demonstration boundaries

There is no role selector or authenticated account to demonstrate. CM/JDM/SDM/Super Admin are proposed personas and recommendation labels, not enforced access modes. The application uses a shared, immutable synthetic publication; fixed histories demonstrate navigation and metric semantics, not live ingestion or persisted operational changes. Use [Stakeholder demonstration guide](stakeholder-demo-guide.md) to present this distinction consistently.
