# Center Monitoring implementation

## Scope and ownership

Center Monitoring adds a dedicated center directory and details experience to the existing Executive Dashboard. The Backend Agent owns shared contracts, center queries/analysis/details and Fastify integration. The Frontend Agent owns routes, listing, geographic drilldowns, details and dashboard links. The QA Agent independently verifies the API and interface; the orchestrator owns integration, browser checks and documentation.

This is a complete read-only monitoring module for the current synthetic demonstration. It shares the same immutable 84-center repository and `demo-2026-09-v1` snapshot as the Executive Dashboard. The fixed data cutoff is 30 September 2026 at 12:00 UTC. PostgreSQL persistence, live offline ingestion, identity and role enforcement remain broader platform work. No source activity is changed through the dashboard.

## Pages and user flows

- `/centers`: searchable, sortable, server-paginated directory with region, district, scheme and recorded activity filters.
- `/centers/:id`: center identity, onboarding/geography/schemes, recorded activity history, batch records/capacity and independent synchronization evidence.
- The Executive Dashboard and sidebar link to Center Monitoring and center details. Filters and page state are encoded in the listing URL; details preserve a local return route so Back to centers restores that context. Direct detail URLs and browser refresh work through the frontend SPA fallback.

Filters are staged until Apply; applying a new scope resets pagination. Region selection narrows valid district choices. Summary counts and geographic comparisons apply geography, scheme and search but exclude the selected activity status. This keeps active/inactive/unknown comparison visible when the directory is narrowed to one status. The directory's matching count explicitly reflects the status filter. Geographic drilldowns set a region/district, and status cards narrow the list. Reset restores the full center network.

Unknown recorded activity stays distinct from inactive. Center sync classification is separately derived from its expected targets: any degraded target makes center sync degraded; all expected targets healthy makes it healthy; missing/unclassifiable evidence remains unknown. Last successful transfer does not establish center activity status. Snapshot and demonstration notices remain visible on both pages.

## Implemented APIs

All routes are GET requests under `/api/v1/centers`, using the existing `{data, meta}` success envelope and safe error envelope. Shared Zod schemas and inferred types live in `packages/shared/src/centers.ts`.

| Endpoint | Request | Response data |
| --- | --- | --- |
| `/options` | Optional `snapshot_id` | Snapshot context, regions, districts with region parents, schemes with category names |
| `/` | Listing query | Snapshot context, `items`, `matching_total`, `page`, `page_size`, `total_pages` |
| `/analysis` | Listing query | Snapshot context, `scope_before_status`, `by_region`, `by_district`, `matching_total`, selected activity status |
| `/:id` | Optional `snapshot_id` | Snapshot context, profile, activity history, batch facts/summary, expected sync targets/summary |

Listing and analysis accept optional `region_id`, `district_id`, `scheme_id`, `activity_status`, `search`, `snapshot_id`; `page` defaults to 1, `page_size` to 10, `sort` to `name`, and `order` to `asc`. Status accepts active/inactive/unknown; sort accepts name/code/status; order accepts asc/desc. Search is bounded to 100 characters. Page is a positive integer capped at 1,000,000 and page size is 1–50. Sort order uses a deterministic center-ID tie breaker. Filters combine with AND.

Unsupported fields, malformed values, unknown scopes, and a district that does not belong to the selected region return 400. Missing centers or unavailable snapshots return 404. Detail requests accept only snapshot context; list filters do not alter an individual center's history. Empty matches return an empty list with a matching count of zero rather than a request failure.

Example: `/api/v1/centers?region_id=region-1&district_id=district-1&activity_status=active&page=1&page_size=10&sort=code&order=asc&snapshot_id=demo-2026-09-v1`.

## Data and calculation rules

Directory batch/enrollment counts cover all batches in the fixed snapshot, narrowed to the selected batch scheme where a scheme filter is applied. Center memberships select centers; batch facts are attributed by their own scheme, so overlapping memberships never duplicate enrollment counts. These counts cover the available synthetic creation history rather than the Executive Dashboard's selected creation period.

Individual details always show that center's full published snapshot history. Batch lifecycle distinguishes planned/running/completed. Current utilization includes planned/running batches with known positive capacity, computes summed occupied seats divided by summed comparable capacity, and excludes missing/zero capacity from both sums. Empty denominators display N/A. Seat/capacity assignments remain immutable synthetic facts; historical changes to capacity or enrollments are not modeled.

Sync details expose expected target IDs, connectivity, transfer result, completeness/publication evidence, last success, classification and reason. Health is healthy targets divided by all expected targets; classification coverage is healthy plus degraded divided by expected targets. Demonstration cadence is 24 hours and pending deadline is 2 hours. They are fixed illustrative policies rather than approved operational thresholds.

## Running and verification

Run `npm run dev` and open http://127.0.0.1:5173/centers. The API must run on port 3001 for the development proxy; PostgreSQL is optional for this synthetic module. A deployed frontend needs SPA history fallback and an `/api` reverse proxy, as described in [environment setup](getting-started.md).

`npm run check` runs source/test type checks, API/frontend tests and production builds. `npm run test:browser` exercises the real API and browser routes, filters, drilldowns, details, navigation and mobile layout; install Chromium once with `npx playwright install chromium`. Browser tests own their temporary development servers. No production authentication or real source synchronization is claimed by these checks.
