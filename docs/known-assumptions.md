# Known implementation assumptions

**Project:** Sarthak Monitoring System. **Review date:** 2026-10-14. **Scope:** Current implemented demonstration; these assumptions are distinct from the broader proposed business rules in [assumptions](assumptions.md).

The current application demonstrates monitoring using invented, immutable facts. Its calculations are reproducible, but its results are not organizational performance measurements or evidence that the cloud has received all offline LMS activity. The [implemented architecture](architecture-summary.md) explains the runtime boundary.

## Fixed synthetic population

| Item | Current assumption or observed fixture value |
| --- | --- |
| Published snapshot | `demo-2026-09-v1`, cutoff `2026-09-30T12:00:00.000Z` |
| Geography | Three named regions, twelve synthetic districts; district-to-region and center geography mappings are fixed |
| Centers | 84 onboarded centers: 68 active, 11 inactive, 5 unknown |
| Schemes | Four schemes in two categories; 100 scheme memberships across 84 distinct centers |
| Available creation history | January through September 2026; query boundaries from `2026-01-01` through exclusive `2026-10-01` |
| Executive default period | Inclusive `2026-04-01` through exclusive `2026-10-01` |
| All-history batch facts | 336 unique batches, with 8,022 enrollment records attached to those batches |
| Default-period cohort | 288 created batches and 6,935 attached enrollment records |
| Current batch stock | 168 current batches: 151 comparable and 17 excluded for missing/zero capacity |
| Current utilization | 3,640 occupied comparable seats / 5,320 comparable capacity = 68.4% |
| Expected synchronization roster | Two targets per center, 168 targets in total; roster is treated as complete for this fixture |

All counts above describe the unfiltered snapshot. Geographic/scheme/search selections may narrow them. A center may belong to several schemes, so scheme bars and category counts cannot be summed to infer distinct network size. Batch/enrollment totals are attributed by each batch's own scheme and are not multiplied by center memberships.

## Activity and synchronization are independent

Active/inactive reflects the latest recorded synthetic center status at the cutoff. Missing status remains unknown; inactive is not calculated as total minus active. The unfiltered classifiable share is `(68 + 11) / 84 = 94.0%` after one-decimal rounding. Connectivity, transfer success and stale data do not change recorded center activity.

Expected-target health is classified using the fixed synthetic 24-hour success cadence and 2-hour pending deadline. Known failed/partial transfer, stale success, overdue pending or incomplete/unpublished delivery is degraded. Fresh successful complete published evidence is healthy. Insufficient evidence and pending within its permitted deadline remain unknown. Offline connectivity alone is not a failure.

| Health measure | Unfiltered fixture calculation |
| --- | --- |
| Healthy / degraded / unknown | 32 / 102 / 34; sum = 168 expected targets |
| Observed health | `32 / 168 = 19.0%` |
| Classification coverage | `(32 + 102) / 168 = 79.8%` |

Health is conservative because unknown targets remain in its denominator. A successful latest transfer is not sufficient if required delivery or publication evidence is incomplete. Center sync rollup is degraded if any expected target is degraded; healthy requires all known expected targets healthy; otherwise it is unknown. The fixture does not demonstrate incomplete expected-roster discovery or retired/exempt targets.

## Stock, flows and denominators

Executive batch creation counts original batch facts inside the selected half-open creation period. Its enrollment count describes records attached to those created batches; it is neither a count of unique people nor a stream of enrollment events during that period.

Current utilization is stock at the fixed cutoff. It uses all scoped current planned/running batches, irrespective of the selected creation period. It divides summed occupied seats by summed positive known capacity in the same comparable population; null/zero capacity is excluded from both sums. A change to creation dates alone leaves current utilization unchanged.

Directory batch/enrollment counts cover all recorded source months, narrowed by batch scheme when the directory scheme filter is selected. Center details show the center's complete recorded snapshot across schemes. Those totals may differ from the Executive Dashboard's selected creation cohort without constituting a reconciliation error.

Percentages round to one decimal place. Empty denominators produce `null`, displayed as unavailable; they do not imply zero or perfect health. Utilization is not clamped at 100%. Occupied seats in the fixture are known synthetic assignments rather than inferred unique learner participation. Attendance, learner engagement, assessment outcomes, course completion and certification calculations are not implemented by these modules.

Center analysis applies geography, scheme and search before counting classifications, then applies activity status to the directory matching count. Synchronization summaries apply geography, center and search before state/result selection; target and alert matching counts apply those additional selections. Summary population and displayed page population are intentionally different and separately named in the contracts.

## Historical evidence limits

Synthetic centers have onboarding dates and recorded monthly status observations. Trends evaluate those histories at each month cutoff rather than reusing September status for every month. The September point is limited to the published cutoff.

Batch creation/start/completion timestamps support synthetic lifecycle evaluation. Capacity, enrollment and occupied-seat assignments are fixed at batch creation and do not evolve during the lifetime. Historical utilization therefore illustrates lifecycle composition under those assignments, not changing operational enrollment or capacity evidence. Scheme memberships and geographic mappings are static; historical reassignment is not modeled.

Synchronization stores one latest result, latest observation timestamp and last-success timestamp per expected target. There is no transfer-history log, retry history, continuous incident timeline or consecutive-failure count. Refresh retrieves the same snapshot; elapsed ages do not advance with the browser or server clock. API response `generated_at` may change while data cutoff and metric results stay fixed.

## Alert and escalation assumptions

At most one alert is generated per target using primary-cause precedence: failed, partial, stale success, overdue pending, incomplete delivery/publication, then missing evidence. Stable target-based IDs make repeated reads deterministic; they do not represent a stored incident lifecycle.

The unfiltered default evaluation produces **119 alerts: 17 informational, 85 warning and 17 critical**. Seventeen within-deadline pending targets have no incident alert; seventeen targets with missing evidence have informational observations. Missing evidence is not promoted into a known failure or highest escalation.

Default recipient thresholds are CM at 0 hours, JDM at 2, SDM at 6, and Super Admin at 24. Evaluation selects the highest reached threshold. Cause-specific severity is configurable for known alert causes. The editor validates those four roles in order, requires CM at zero and strictly increasing later thresholds bounded to 720 hours.

Age is the difference between the pinned cutoff and the explicit cause reference: latest observation for failure/partial/pending/incomplete, last success for staleness. This is observation reference age, not proof of continuous outage duration. Missing, invalid or future reference ages are unavailable and receive no role recommendation. Informational missing-evidence alerts have no escalation role.

Custom rules are evaluated only for the submitted request. They do not change default GET responses, the snapshot, source classification, the 24-hour cadence or 2-hour pending deadline. Disabling recipient recommendations preserves alerts and removes recommended roles. No policy is saved and no notification is sent.

## Features and operational boundaries

| Area | Current boundary |
| --- | --- |
| Authentication and roles | APIs are public synthetic demonstration endpoints. There is no sign-in, enforced CM/JDM/SDM/Super Admin authorization or role-scoped confidentiality. Filters select data; they are not permission grants. |
| Persistence | Business records, rules and alerts are not persisted. PostgreSQL configuration and readiness checking do not create business tables or migrations. |
| Offline LMS integration | No live feed, synchronization ingestion, receipt deduplication, conflict reconciliation or offline-source completeness validation is implemented. |
| Notifications and jobs | No emails, messages, scheduled escalation, background alert worker or delivery queue is implemented. |
| Reporting | Reporting strategy exists as design documentation; report generation, exports, scheduling and stored artifacts are not implemented. |
| Auditing | Structured operational logging and request IDs exist. There is no persistent business/security audit trail or production compliance claim. |
| Hosting and scale | The repository supports local development and builds. Cloud deployment, load-tested capacity, high availability, backup/restore and production SLOs are not demonstrated. |
| Database availability | Monitoring modules run without a successful database connection; `/api/health/ready` still checks PostgreSQL and may fail independently. |

The fixture's numeric cadence, role thresholds and population are illustrative. Approval of real organizational policies, source contracts, authorization scope and production infrastructure remains future work. See [metric definitions](metric-definitions.md), [security design](security-rbac.md) and the [implementation summary](architecture-summary.md) for the corresponding proposed and implemented boundaries.
