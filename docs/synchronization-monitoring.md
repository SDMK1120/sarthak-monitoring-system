# Synchronization Monitoring implementation

## Scope and ownership

The Backend Agent owns synchronization contracts, queries, target evidence, alert generation and escalation evaluation. The Frontend Agent owns the health dashboard, failed-transfer monitoring, target details, alert drilldowns and rule editor. The QA Agent independently verifies calculations, request validation and interactions; the orchestrator integrates shared transport, documentation and real-browser checks.

This module uses the same immutable synthetic roster and snapshot as Executive Dashboard and Center Monitoring: 168 expected targets across 84 centers, published as `demo-2026-09-v1` at 30 September 2026, 12:00 UTC. Public demonstration APIs work without PostgreSQL. Production identity/RBAC, source ingestion, persistent alert episodes, scheduling and notification delivery remain platform work.

## User experience

`/synchronization` provides target health counts, conservative health percentage, classification coverage, latest failed/partial transfer counts, server-paginated target observations, an alert feed and escalation-rule preview. Filters support region, district, center, health state, latest transfer result and target/center search. Apply and Reset distinguish draft controls from the applied scope. Health summaries apply geography/center/search before health/result selection, while the listing and alerts show matching observations.

`/synchronization/targets/:id` shows one target's geography, health reason, connectivity, latest transfer result, last successful synchronization, observation timestamp, delivery/publication evidence and generated alert. Back navigation preserves listing query context, and center links open existing Center Monitoring details. Unknown timestamps display missing evidence rather than an invented date or age. Browser timestamps include the full date, time and timezone; API timestamps are UTC ISO values.

The failed-transfer quick filter targets latest observed failures. Partial transfer is a separate result, and degraded targets also include stale success, overdue pending and incomplete/unpublished delivery. No transfer-history feed, retry count or continuous outage duration is inferred from a single latest observation. Refresh reloads the pinned snapshot.

## APIs and contracts

Shared runtime schemas and TypeScript types are in `packages/shared/src/synchronization.ts`. All endpoints return existing data/meta envelopes with safe errors and request correlation. Snapshot time is distinct from response generation time.

| Method and endpoint | Request | Response data |
| --- | --- | --- |
| GET `/api/v1/synchronization/options` | Optional snapshot context | Regions, districts and centers with geographic parents |
| GET `/api/v1/synchronization/dashboard` | Monitoring query | Summary before state/result, matching target page, latest-failure/partial counts, alert counts |
| GET `/api/v1/synchronization/targets/:id` | Optional `snapshot_id` | Target evidence and its default-rule alert |
| GET `/api/v1/synchronization/alerts` | Monitoring query | Matching alert page and default rules, `preview: false` |
| GET `/api/v1/synchronization/rules` | Optional snapshot context | Default rules, request-local persistence mode and delivery `none` |
| POST `/api/v1/synchronization/rules/evaluate` | `{filters?, rules}` | Matching alerts evaluated with supplied rules, `preview: true` |

Monitoring query fields: optional `region_id`, `district_id`, `center_id`, `state` (healthy/degraded/unknown), `result` (success/failed/partial/pending/unknown), `search` (maximum 100 characters), `snapshot_id`, `page` (default 1, positive integer up to 1,000,000), `page_size` (default 10, maximum 50). Queries combine filters with AND. Pagination is deterministic. Unknown/unsupported fields, invalid values, incompatible geographic selections and invalid rules return 400; missing targets or snapshots return 404. Empty scopes produce explicit empty lists and null percentage denominators.

The evaluation endpoint computes a response without modifying source evidence, default rules or shared operational state. Custom rules are not saved across page loads. Rule preview is a real API computation but does not create a delivery job, message or production configuration change.

## Health and alert policy

Health uses the existing shared classification: complete published success within the synthetic 24-hour cadence is healthy; known failure/partial transfer, stale success, overdue pending (over 2 hours), or incomplete/unpublished delivery is degraded; missing evidence and pending within deadline remain unknown. Offline connectivity alone does not establish a failure. Health percentage is healthy / all expected targets; classification coverage is (healthy + degraded) / expected targets.

At most one primary alert is generated per target and snapshot using classification precedence. Failed, partial, stale, overdue pending and incomplete evidence generate alerts. Missing evidence is informational and is not promoted into a known failure. Pending within its allowed deadline does not generate an incident alert. Healthy targets have no alert. Stable target-based alert IDs prevent duplication when repeatedly querying the same evidence.

Escalation is a recommended recipient role rather than a sent notification. The default illustrative ladder is:

| Role | Minimum reference age |
| --- | --- |
| CM | 0 hours |
| JDM | 2 hours |
| SDM | 6 hours |
| Super Admin | 24 hours |

The editor accepts an enabled flag, four thresholds in this exact role order, and information/warning/critical severity choices for failed, partial, stale, overdue-pending and incomplete causes. CM must start at zero; later thresholds must strictly increase and remain within 720 hours. Evaluation selects the highest reached threshold. Disabling escalation suppresses role recommendations without changing source health. Changing severity or thresholds does not alter the fixed health cadence or pending deadline.

Age comes from the alert's explicit reference timestamp and the published data cutoff, never from the machine's current clock. Latest-observation references are not proof of continuous incident onset; stale success uses last-success evidence. Missing/untrustworthy age remains unavailable and must not automatically trigger the highest role. These are synthetic demonstration policies, not approved organizational escalation or delivery rules.

## Verification and running

Run `npm run dev`, then open http://127.0.0.1:5173/synchronization. `npm run check` runs strict source/test checks, API/frontend tests and production builds. `npm run test:browser` exercises actual dashboard requests, target timestamps/details, failed-transfer filters, alert drilldowns, escalation previews and mobile behavior alongside existing module regressions. Install Chromium once with `npx playwright install chromium`; browser tests own temporary servers on ports 3001/5173.

Production frontend hosting requires SPA fallback for synchronization routes and forwarding `/api` to Fastify. No source synchronization, external notifications, production policy persistence or cloud deployment is claimed by this implementation.
