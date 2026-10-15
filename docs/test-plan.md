# Project test plan

**Project:** Sarthak-Monitoring-System. **Owner:** QA Agent. **Reviewers:** Business Analyst, Analytics, module owners, Security and Product Manager. **Version:** 1.0. **Created:** 2026-10-15. **Status:** Test design baseline; this documentation delivery is not a fresh test execution or stakeholder sign-off.

## Objectives and companion documents

Verify that stakeholders can follow reproducible network → center → synchronization evidence, interpret metrics correctly, inspect failures and preview escalation without misleading claims about live data or production capabilities.

- [Test scenarios](test-scenarios.md): 23 risk/business scenarios, including five future implementation gates.
- [Detailed test cases](test-cases.md): 77 definitions; 72 current-delivery cases and five future cases.
- [Business acceptance criteria](acceptance-criteria.md): broader proposed stakeholder intent, not a statement that every criterion is implemented.
- [Known assumptions](known-assumptions.md), [feature walkthrough](feature-walkthrough.md) and [stakeholder guide](stakeholder-demo-guide.md): delivery boundary, metric semantics and rehearsal path.

The existing [validation planning brief](qa/validation-plan.md) is historical planning context. This plan is the current operational QA design. Tests already exist in the repository, but neither source presence nor a documentation link establishes a new passing run.

## Scope

| Current area | Required coverage |
| --- | --- |
| Executive Dashboard | Center partition/unknowns, geography/scheme filters, nonadditive memberships, batch creation cohorts, weighted stock utilization, trends, data-table alternatives and publication consistency |
| Center Monitoring | Search/sort/bounded server pagination, compound geography/scheme/activity scope, pre-status comparisons, geographic/status drilldowns, detail evidence and preserved return context |
| Synchronization Monitoring | Expected-target H/D/U, failure/partial versus degraded distinction, exact observation/last-success timestamps, primary alerts, missing evidence and target drilldowns |
| Escalation previews | Ordered thresholds, inclusive boundaries, missing ages, cause severity, request-local policy, default immutability, local pagination, reset/cancellation and no-delivery labels |
| Foundation | Environment validation, liveness/readiness separation, safe errors/correlation, payload limits, API clients and shared schemas, formatter/types/builds and Compose configuration |
| Shared experience/demo | Loading/error/retry/empty/race states, direct URLs/history, mobile layouts, keyboard/chart alternatives, browser compatibility, reset and honest stakeholder narratives |

Future-gated coverage includes real identity/session/RBAC, attendance/assessment/completion/certification, exports/scheduled reports, real source ingestion/deduplication/late data, persisted incident acknowledgement/resolution and notifications, cloud recovery/load/security qualification. The cases define future acceptance intent but are **Not ready**, excluded from current-demo exit calculations. Do not test a proposed production control as if it exists today.

## Test strategy and levels

| Level | Approach | Evidence |
| --- | --- | --- |
| Pure service/calculation | Independent small populations; manually derived numerators/denominators; exact time boundaries | Vitest service assertions and fixture inputs |
| API/component integration | Fastify injection with isolated database adapters; schema and safe-error checks; scope intersections | Request/response, status, context and assertions |
| Browser client/UI integration | Testing Library with mocked fetch/service results and delayed/canceled requests | User-action assertions, submitted query/body and state transitions |
| Real-browser E2E | Playwright against actual API proxy and compiled/development UI | Browser report, route/request evidence, screenshot/trace when applicable |
| Manual/exploratory/UAT | Complete linked rehearsal, keyboard/contrast/zoom, Firefox and role-perspective review | Named tester, precise steps/browser/actual result and stakeholder decisions |
| Future production qualification | Only after capability/policy/data gates are delivered | Dedicated authorized environments, approved criteria and auditable results |

Use positive, negative, boundary, equivalence-partition and state-transition testing. Prioritize population/cutoff correctness, misleading zeros/unknowns, invalid scope, stale responses, missing evidence and accidental policy mutation. Expand parameter rows explicitly rather than relying only on one happy path.

## Test data oracles

### F0 — published demonstration fixture

Source: [synthetic repository](../apps/api/src/modules/executive/repository.ts). Reset all overview filters before comparing the unfiltered baseline.

| Item | Independent expected value / interpretation |
| --- | --- |
| Snapshot/cutoff | `demo-2026-09-v1`; `2026-09-30T12:00:00.000Z` = 30 September 2026, 17:30 IST |
| Centers | 84 total = 68 active + 11 inactive + 5 unknown; classifiable share 94.0% |
| Geography and scheme membership | Three regions, twelve districts, four schemes; 100 memberships across 84 distinct centers; grouping counts are not additive network totals |
| Executive default creation cohort | Inclusive 1 April through exclusive 1 October 2026; 288 original batch creations and 6,935 attached enrollment records |
| Complete available batch history | 336 batch facts and 8,022 attached enrollment records; center detail uses this center-specific all-history view |
| Current batch stock | 168 current, 151 comparable, 17 excluded for unknown/zero capacity; 3,640 occupied comparable seats / 5,320 capacity = 68.4% |
| Sync roster | 168 expected targets, two per center; 32 healthy, 102 degraded, 34 unknown; health 19.0%, classification 79.8% |
| Primary alerts | 119 total: 17 information, 85 warning, 17 critical; 17 in-deadline pending targets have no primary incident alert |
| Evidence drilldown | Center-1: unknown activity; target-1 missing evidence, target-2 failed. Center-2: active, six all-history batches, two expected targets |
| Target-2 recommendation | Latest/last-success evidence08:00UTC =13:30 IST; reference age4h at cutoff; default JDM, custom SDM threshold3h changes preview to SDM |
| Different timestamps | Target-4 latest observation11:00UTC =16:30 IST; last success08:00UTC =13:30 IST; never collapse the two fields |
| Default illustrative policy | Health cadence24h, pending deadline2h; escalation CM0/JDM2/SDM6/Super Admin24h; these are synthetic policies |

Do not use the machine's current date as the evaluation cutoff. `meta.generated_at` is response-generation time, not evidence freshness. Enrollment records are not unique learners. Creation-period flows must not be compared with fixed-cutoff stock as though they shared a period denominator.

### I1 — isolated analytics/center populations

Use the existing service-test fixture factories/injectable repository, not edits to the shared demo dataset. Weighted utilization: current capacities20/80 and occupied seats10/20 yield30/100=30%. Add null-capacity100 seats and zero-capacity40 seats: both batches are excluded from numerator and denominator. Capacity20/seats25 yields125%; no comparable capacity yields null. Add planned, completed and future-created batches and tied center names/statuses to exercise lifecycle and pagination boundaries.

### I2 — isolated synchronization evidence

Create isolated target variants in the service harness: fresh complete published success, offline healthy, failure/partial, stale success, overdue pending, incomplete/unpublished delivery, missing timestamps and in-deadline pending. For escalation compare ages0/1.999/2/5.999/6/23.999/24h. Health deadlines use strict greater-than; role thresholds use greater-than-or-equal. Missing/future/untrustworthy ages must not imply endless downtime or highest escalation.

### I3 — controlled errors and asynchronous ordering

Use mocked fetch/service adapters or Playwright interception for malformed envelopes/data, safe server errors, network failure, slow requests, older responses arriving last, mismatched snapshots and invalid preview modes. Use sentinel secrets solely to verify masking; never copy real credentials into evidence. Controlled failure must not stop unrelated or presenter-owned processes.

## Environments and browser matrix

Use the workspace Node/npm engine requirements and lockfile; record actual versions for each run. Run `npm ci` and `npm run setup:env` before a clean-environment cycle. Existing `.env` values must be preserved. PostgreSQL is optional for synthetic business endpoints, though API configuration including a valid `DATABASE_URL` is required.

| Target | Planned evidence / limitation |
| --- | --- |
| Local development | Web5173, API3001; `npm run dev`; real browser checks via `npm run test:browser` |
| Compiled presentation | Web4173, API3001; `npm run demo`; compiled checks via `npm run test:demo` |
| Chromium desktop/mobile | Existing E2E scenarios use1440×1000 and390×844; capture installed browser/OS version |
| Firefox | Manual critical-path suite planned; **Not run** by this documentation delivery. Prior Chromium success does not imply Firefox validation |
| Edge/Safari | Additional compatibility runs where available; document Not run/Not applicable with environment reason, rather than inventing a pass |
| Accessibility | Existing chart-table/viewport assertions plus manual keyboard, contrast, zoom and assistive-technology assessment; no blanket WCAG-conformance claim |
| Real PostgreSQL/cloud | Separate integration/production validation. Previous review lacked a running Docker daemon; mocked readiness does not prove live DB integration |

Browser runners start their own temporary servers. Keep API3001 and the selected web port free, run one dev/demo mode at a time, and leave a user-requested app available unless its owner authorizes interruption. Screenshots/traces go under ignored `test-results/`; record durable evidence locations if needed without committing secrets or generated dependencies.

## Existing automation and coverage interpretation

| Area | Existing files |
| --- | --- |
| Foundation | [app.test.ts](../apps/api/test/app.test.ts), [env.test.ts](../apps/api/test/env.test.ts) |
| Executive | [API](../apps/api/test/executive-api.test.ts), [calculations](../apps/api/test/executive-calculations.test.ts), [client](../apps/web/test/executive-service.test.ts), [UI](../apps/web/test/executive-page.test.tsx), [E2E](../e2e/executive-dashboard.spec.ts) |
| Center | [API](../apps/api/test/centers-api.test.ts), [service](../apps/api/test/centers-service.test.ts), [client](../apps/web/test/centers-service.test.ts), [UI](../apps/web/test/centers-page.test.tsx), [E2E](../e2e/center-monitoring.spec.ts) |
| Synchronization/rules | [API](../apps/api/test/synchronization-api.test.ts), [alerts](../apps/api/test/synchronization-alerts.test.ts), [client](../apps/web/test/synchronization-service.test.ts), [UI](../apps/web/test/synchronization-page.test.tsx), [E2E](../e2e/synchronization-monitoring.spec.ts) |

The previously reported baseline was **86 API/service tests +39 frontend tests =125**, plus **nine Chromium E2E scenarios**. This is historical review evidence, not a run performed to create these documents. Parameterized automated invocations, scenario definitions and the77 documented cases are different counts and are not interchangeable.

Each detailed case identifies related existing automation, partial coverage or a manual/future gap. A file reference does not establish that every newly documented edge is already asserted. Gaps explicitly include Firefox/other browsers, full keyboard/contrast/zoom coverage, some positive numeric/date edges, the complete linked rehearsal and real database/production operation.

## Execution sequence and commands

1. Record build identity, source state, environment and fixture/policy IDs. Obtain free test ports without disrupting a running presentation.
2. Verify setup/configuration and pure service/API cases first; resolve unsafe errors or incorrect KPI denominators before UI acceptance.
3. Run client/UI state and interaction cases, followed by the appropriate real-browser suite.
4. Complete manual cross-browser/accessibility and stakeholder rehearsal cases; triage findings and repeat affected checks after fixes.
5. Record exclusions, sign-off and residual risk. Do not change future cases to Passed just to complete a dashboard tally.

From the repository root:

```text
npm run format:check
npm run check
npm run db:config
npx playwright install chromium
npm run test:demo
```

`npm run check` already includes formatting, types, API/UI tests and builds. The separate format command is useful for a quick check; do not rerun broad suites without a new change/failure/reason. `npm run test:browser` is the alternative development-browser mode; it executes the same nine E2E scenarios against development serving rather than adding nine distinct cases.

For focused workspace execution, build shared contracts first and then run the required workspace tests. Do not start standalone clients against stale shared declarations. Installation/browser download may need internet access; source fixture tests and demo business queries do not require a live LMS.

## Entry, exit and suspension criteria

**Entry:** Authorized feature/build scope is identified; source contracts and F0 baseline available; setup is valid; isolated mocks/test data are available; correct ports and browser environment are available; testers know what is synthetic versus implemented/planned.

**Current-demo exit:** Every applicable P0 case/parameter row has recorded passing evidence; required source/config/type/build checks pass; core metrics and snapshots reconcile; no unresolved critical/high demonstration defect; key manual/UAT results or explicit risk acceptance are recorded; known limitations and future gates remain visible. A historical automated baseline alone is not a new exit sign-off.

Suspend a run for an unsafe environment, invalid fixture/publication, a startup blocker, accidental secret exposure or a core data-integrity defect that makes downstream results misleading. Keep blocked/not-run cases distinct from failures. Resume after the environment or defect is addressed, then retest the affected path and justified regressions.

## Priorities, defects and ownership

- **P0:** Core presentation or evidence correctness. **P1:** Important regression/quality behavior. **P2:** Supplementary review. Priority is not the same as defect severity.
- **Critical:** App cannot demonstrate its core journey, or sensitive information is exposed. **High:** Wrong population/KPI/publication, broken essential drilldown or material misleading evidence. **Medium:** Workaround-supported interaction/layout issue. **Low:** Minor cosmetic/documentation inconsistency.
- QA owns cases and evidence. BA/Analytics review business meaning and independent oracles. Backend/Frontend own implementation fixes. DevOps owns assigned environment issues. Security reviews data/access findings. Product Manager/stakeholders own acceptance and residual-risk decisions; the orchestrator coordinates integration.
- Defects record ID, case/build/environment, steps, expected/actual result, evidence, severity, priority, owner and retest outcome. Do not silently weaken an assertion or increase wait times to hide an application race; document any justified environment timing adjustment.

## Execution record template

Create a separate dated execution record; keep these design documents stable. Allowed statuses: **Not run, Pass, Fail, Blocked, Not ready, Not applicable**. Exclusions need a reason and approver where relevant. Not ready/not applicable cases do not become passing results.

| Run ID / build identity | Environment/browser/OS | Fixture / policy | Tester / time | Case + parameter row | Actual result | Status | Evidence / defect |
| --- | --- | --- | --- | --- | --- | --- | --- |
| To be recorded | To be recorded | demo-2026-09-v1 / explicit rules | To be recorded | Case ID and exact inputs | To be recorded | Not run | To be recorded |

Report pass rate only over actually executed Pass+Fail rows, with blocked/not-run/future exclusions shown separately. Report automated test invocations and manual cases separately to avoid double-counting the same behavior.

**This documentation delivery:** reviewed existing tests and implementation guides; added test design and traceability; validated document references. No fresh application, browser, Firefox, production or UAT execution is implied.
