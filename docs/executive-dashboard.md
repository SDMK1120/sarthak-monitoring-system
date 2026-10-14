# Executive Dashboard — Implementation Phase 2

## Delivery and agent ownership

The orchestrator coordinates shared contracts, dependency configuration, documentation, integration and browser verification. The Executive Backend Agent owns the synthetic repository, aggregation service and Fastify routes. The Executive Frontend Agent owns React components, API service, filters, charts and responsive styling. The Executive QA Agent independently writes backend and frontend tests and reports defects to implementation owners. These are active implementation assignments, separate from the original 13 planning charters.

## Running the demonstration

From the repository root run `npm ci`, `npm run setup:env`, then `npm run dev`. Open http://127.0.0.1:5173. Both Vite and Fastify must run; Vite proxies `/api` to port 3001. The dashboard uses synthetic in-memory facts and needs no database connection. `/api/health/ready` remains a PostgreSQL connectivity check and can return 503 while the dashboard works.

All displayed records are invented. The published snapshot is `demo-2026-09-v1`, dated 30 September 2026 at 12:00 UTC. Refresh requests the same snapshot; it does not simulate a new synchronization. Region and scheme filters select data, and do not grant or enforce a role. The demonstration endpoints are public read-only endpoints; the documented authentication and RBAC design remains future work.

## Implemented API contract

Every endpoint uses the existing success envelope `{data, meta: {request_id, generated_at}}` and safe error envelope. `generated_at` is response generation time; `context.data_as_of` is the published source cutoff. Full runtime schemas and TypeScript types are in `packages/shared/src/dashboard.ts`.

| GET endpoint | Data |
| --- | --- |
| `/api/v1/dashboard/filters` | Region/scheme options, snapshot ID, available and default periods |
| `/api/v1/dashboard/executive` | Context, center counts, scheme coverage, batches, sync, trends, center list |
| `/api/v1/dashboard/centers` | Context and center summary/list |
| `/api/v1/dashboard/schemes` | Context and scheme/category distribution |
| `/api/v1/dashboard/batches` | Context and batch summary |
| `/api/v1/dashboard/sync` | Context and target health/exception list |
| `/api/v1/dashboard/trends` | Context and monthly trend rows |

Dashboard queries accept optional `region_id`, `scheme_id`, `snapshot_id`, and paired `period_start`/`period_end`. Period boundaries are real ISO dates on the first of the month; start is inclusive and end exclusive. Available range is 1 January–1 October 2026; default is 1 April–1 October. Unknown fields, invalid dates, unpaired boundaries, unknown scopes and out-of-range/reversed periods return 400. Unknown snapshot IDs return 404. Region and scheme combine with AND. Options are unfiltered; dashboard parameters do not change the option catalogue.

Example: `/api/v1/dashboard/executive?region_id=region-1&period_start=2026-07-01&period_end=2026-10-01&snapshot_id=demo-2026-09-v1`.

The earlier 44-endpoint [API design](api-specification.md) remains a proposed broader platform contract. These seven demonstration routes are the implementation delivered by this phase.

## Metric semantics

| Metric | Implemented calculation and time basis |
| --- | --- |
| Total centers | Distinct scoped centers onboarded by the fixed snapshot |
| Active/inactive centers | Last recorded activity status by the cutoff; missing status remains unknown |
| Scheme coverage | Distinct center membership per scheme/category; a center may belong to multiple schemes, so bars are nonadditive |
| Batches created | Unique batch facts created within the selected half-open period |
| Enrollments | Enrollment records attached to that creation cohort; not unique learners or enrollment-event throughput |
| Batch utilization | Sum occupied eligible seats / sum positive known capacity in current scoped batches at the fixed snapshot; null/zero capacity excluded from both sums |
| Sync health | Healthy expected targets / all expected targets, including unknown targets in denominator |
| Sync classification | (Healthy + degraded) / all expected targets; shown separately from health |

Batch scheme attribution uses each batch's scheme, avoiding duplication across overlapping center memberships. Current stock utilization does not change when only the creation period changes. Percentages round to one decimal place; an empty denominator yields `null` and the UI displays an unavailable value. Utilization can exceed 100% and is not clamped. Excluded batch counts and unknown activity/sync counts remain visible.

Monthly center trends use actual synthetic onboarding and status histories. Batch creation uses creation timestamps; stock utilization uses lifecycle state at each month cutoff. Synthetic seat/capacity assignments are immutable throughout a batch lifetime, so this phase does not demonstrate changing enrollment, capacity or transfer histories. No actual offline source feed, retry ingestion, database analytics materialization or persisted audit log is implemented.

Expected synchronization roster contains two targets per center. A complete published fresh success is healthy. Failed, partial, incomplete, unpublished, overdue pending or stale success evidence is degraded; missing evidence or pending within deadline is unknown. The synthetic cadence is 24 hours and pending deadline 2 hours, for demonstration only. Connectivity is separate from activity and delivery health: an offline target can have valid recent evidence.

## User experience and verification

The dashboard provides scoped KPI cards, monthly trends, scheme coverage, batch analytics, synchronization exceptions and a searchable center table. Filters are staged until Apply; Reset restores the default scope. KPI links to active/inactive centers narrow the table rather than changing aggregate scope. Chart values also have text/table alternatives. Loading, retry, empty results and filtered context must remain distinguishable.

`npm run check` performs strict type checks, meaningful API/aggregation and frontend interaction tests, followed by production builds. Run `npx playwright install chromium` once, then `npm run test:browser` for real-browser verification. Browser tests start and stop their own development servers, so ports 3001 and 5173 must be available. They exercise the real API proxy, filter submission, table interaction, charts, responsive layout, keyboard access and failure recovery. Screenshots and failure traces are saved under ignored `test-results/`.

The final review introduced lazy-loaded module pages and separate React, validation and chart assets. The largest JavaScript asset is now approximately 401 kB (113 kB gzip), and the build no longer reports the earlier chunk-size advisory. This is a packaging improvement, not a measured latency claim. Use `npm run demo` for compiled local presentation mode on port 4173. See [setup](getting-started.md) and the [final review](final-summary-report.md) for verification and deployment boundaries.
