# Detailed test cases

**Owner:** QA Agent. **Reviewers:** Business Analyst, Analytics, domain owners and Product Manager. **Version:** 1.0. **Created:** 2026-10-15.

These are reusable test definitions for the current synthetic prototype and explicitly gated future capabilities. They do not record a fresh execution. See the [test plan](test-plan.md), [scenario catalogue](test-scenarios.md) and [business acceptance specification](acceptance-criteria.md).

## Reading and executing the cases

- All current cases start **Not run** in a new execution cycle. Existing automated-test references show relevant source evidence, not a pass for this document or every expanded boundary in a case.
- **Existing automation** indicates the related behavior is asserted in the linked test source. **Partial/related coverage** identifies added checks requiring independent execution. **Manual** means no complete existing automated proof is claimed. **Not ready** cases depend on future implementation and do not enter the current-demo exit denominator.
- Preconditions F0/I1/I2/I3 refer to the [test data oracles](test-plan.md#test-data-oracles). Use isolated fixture/mocking harnesses for injected populations; do not edit production facts or stop a presenter-owned application.
- P0 is demonstration-blocking, P1 is significant regression/quality coverage, and P2 is supplementary. A future P1 case remains outside this release until its gate opens.
- Capture the actual result, status, build identity, environment, tester, timestamp and evidence in the [execution record](test-plan.md#execution-record-template). A case with several parameter rows records each row; partial success is not a full case pass.

## Case index

| Case | Title | Scenario | Priority | Coverage |
| --- | --- | --- | --- | --- |
| [TC-ENV-01](#tc-env-01) | Repeatable local installation and environment setup | [TS-ENV-01](test-scenarios.md#ts-env-01) | P0 | Manual; related setup script review |
| [TC-ENV-02](#tc-env-02) | Compiled demo startup and API proxy | [TS-ENV-01](test-scenarios.md#ts-env-01) | P0 | Existing automation |
| [TC-ENV-03](#tc-env-03) | Formatting, types, tests and builds | [TS-ENV-01](test-scenarios.md#ts-env-01) | P0 | Command-based verification; not an application test |
| [TC-ENV-04](#tc-env-04) | Database connectivity is separate from liveness | [TS-ENV-01](test-scenarios.md#ts-env-01) | P0 | Existing automation |
| [TC-ENV-05](#tc-env-05) | Valid database readiness and cleanup | [TS-ENV-01](test-scenarios.md#ts-env-01) | P1 | Existing mocked automation; real DB integration not run |
| [TC-ENV-06](#tc-env-06) | Secret-safe invalid configuration and TLS guard | [TS-ENV-01](test-scenarios.md#ts-env-01) | P0 | Existing automation |
| [TC-ENV-07](#tc-env-07) | Compose and process lifecycle | [TS-ENV-01](test-scenarios.md#ts-env-01) | P1 | Manual/command-based; not claimed automated |
| [TC-API-01](#tc-api-01) | Unknown routes and missing resources | [TS-API-01](test-scenarios.md#ts-api-01) | P0 | Existing automation |
| [TC-API-02](#tc-api-02) | Malformed JSON and schema validation | [TS-API-01](test-scenarios.md#ts-api-01) | P0 | Existing automation |
| [TC-API-03](#tc-api-03) | Unsupported and oversized request bodies | [TS-API-01](test-scenarios.md#ts-api-01) | P0 | Existing automation |
| [TC-API-04](#tc-api-04) | Unexpected errors are masked | [TS-API-01](test-scenarios.md#ts-api-01) | P0 | Existing automation |
| [TC-API-05](#tc-api-05) | Success envelopes, correlation and cache policy | [TS-API-02](test-scenarios.md#ts-api-02) | P1 | Existing automation; repeat-call/manual correlation review |
| [TC-API-06](#tc-api-06) | Client rejects invalid data and preserves cancellation | [TS-API-02](test-scenarios.md#ts-api-02) | P0 | Existing automation |
| [TC-EX-01](#tc-ex-01) | Executive center partition and coverage | [TS-EX-01](test-scenarios.md#ts-ex-01) | P0 | Existing automation |
| [TC-EX-02](#tc-ex-02) | Draft versus applied filters and reset | [TS-EX-01](test-scenarios.md#ts-ex-01) | P0 | Existing automation |
| [TC-EX-03](#tc-ex-03) | Overlapping scheme coverage and attribution | [TS-EX-01](test-scenarios.md#ts-ex-01) | P0 | Existing automation |
| [TC-EX-04](#tc-ex-04) | Section responses reconcile with the composite | [TS-EX-01](test-scenarios.md#ts-ex-01) | P1 | Existing automation |
| [TC-EX-05](#tc-ex-05) | Default creation cohort and enrollment meaning | [TS-EX-02](test-scenarios.md#ts-ex-02) | P0 | Related automation; exact monthly-sum/label review included |
| [TC-EX-06](#tc-ex-06) | Weighted utilization and excluded capacities | [TS-EX-02](test-scenarios.md#ts-ex-02) | P0 | Existing automation |
| [TC-EX-07](#tc-ex-07) | Unavailable denominator and overcapacity | [TS-EX-02](test-scenarios.md#ts-ex-02) | P0 | Existing service automation; UI N/A review |
| [TC-EX-08](#tc-ex-08) | Planned, completed and future batch lifecycle | [TS-EX-02](test-scenarios.md#ts-ex-02) | P0 | Existing automation |
| [TC-EX-09](#tc-ex-09) | Flow period changes do not change fixed stock | [TS-EX-02](test-scenarios.md#ts-ex-02) | P0 | Existing automation |
| [TC-EX-10](#tc-ex-10) | Valid dates and half-open month boundaries | [TS-EX-03](test-scenarios.md#ts-ex-03) | P0 | Existing automation |
| [TC-EX-11](#tc-ex-11) | Historical activity uses observations | [TS-EX-03](test-scenarios.md#ts-ex-03) | P0 | Existing service automation; monthly integration review |
| [TC-EX-12](#tc-ex-12) | Unavailable publication is not replaced | [TS-EX-03](test-scenarios.md#ts-ex-03) | P0 | Existing automation |
| [TC-CTR-01](#tc-ctr-01) | Complete deterministic center pagination | [TS-CTR-01](test-scenarios.md#ts-ctr-01) | P0 | Existing automation |
| [TC-CTR-02](#tc-ctr-02) | Sort stability when display values tie | [TS-CTR-01](test-scenarios.md#ts-ctr-01) | P1 | Existing automation |
| [TC-CTR-03](#tc-ctr-03) | Page, search and option validation boundaries | [TS-CTR-01](test-scenarios.md#ts-ctr-01) | P0 | Existing invalid-boundary automation; positive-edge coverage partial |
| [TC-CTR-04](#tc-ctr-04) | Out-of-range listing recovery | [TS-CTR-01](test-scenarios.md#ts-ctr-01) | P1 | Existing automation |
| [TC-CTR-05](#tc-ctr-05) | Compound center scope and geographic conflicts | [TS-CTR-02](test-scenarios.md#ts-ctr-02) | P0 | Existing automation |
| [TC-CTR-06](#tc-ctr-06) | Activity list filters retain comparison counts | [TS-CTR-02](test-scenarios.md#ts-ctr-02) | P0 | Existing automation |
| [TC-CTR-07](#tc-ctr-07) | Region/district drilldowns and draft reset | [TS-CTR-02](test-scenarios.md#ts-ctr-02) | P0 | Existing automation |
| [TC-CTR-08](#tc-ctr-08) | No-match center search is explicit | [TS-CTR-02](test-scenarios.md#ts-ctr-02) | P1 | Existing automation |
| [TC-CTR-09](#tc-ctr-09) | Detail refresh and return context | [TS-CTR-03](test-scenarios.md#ts-ctr-03) | P0 | Existing automation |
| [TC-CTR-10](#tc-ctr-10) | Detail quantities and scheme-filtered row attribution | [TS-CTR-03](test-scenarios.md#ts-ctr-03) | P0 | Existing automation |
| [TC-CTR-11](#tc-ctr-11) | Unknown center evidence and missing detail | [TS-CTR-03](test-scenarios.md#ts-ctr-03) | P0 | Existing automation |
| [TC-CTR-12](#tc-ctr-12) | Invalid/ambiguous URL and mismatched publication | [TS-CTR-03](test-scenarios.md#ts-ctr-03) | P0 | Existing automation |
| [TC-SYNC-01](#tc-sync-01) | Expected-target partition reconciles across modules | [TS-SYNC-01](test-scenarios.md#ts-sync-01) | P0 | Existing automation |
| [TC-SYNC-02](#tc-sync-02) | Connectivity does not determine health | [TS-SYNC-01](test-scenarios.md#ts-sync-01) | P0 | Existing automation |
| [TC-SYNC-03](#tc-sync-03) | Freshness, pending and incomplete evidence | [TS-SYNC-01](test-scenarios.md#ts-sync-01) | P0 | Existing classification automation; exact24h/2h positive-edge review |
| [TC-SYNC-04](#tc-sync-04) | Target pagination is complete and repeatable | [TS-SYNC-02](test-scenarios.md#ts-sync-02) | P0 | Existing automation |
| [TC-SYNC-05](#tc-sync-05) | Failed/partial quick filters preserve baseline scope | [TS-SYNC-02](test-scenarios.md#ts-sync-02) | P0 | Existing API/browser coverage; partial-button interaction review |
| [TC-SYNC-06](#tc-sync-06) | Compound target scope and invalid parents | [TS-SYNC-02](test-scenarios.md#ts-sync-02) | P0 | Existing automation |
| [TC-SYNC-07](#tc-sync-07) | Full last-success and observation timestamps | [TS-SYNC-03](test-scenarios.md#ts-sync-03) | P0 | Existing automation |
| [TC-SYNC-08](#tc-sync-08) | Missing evidence does not invent timestamps | [TS-SYNC-03](test-scenarios.md#ts-sync-03) | P0 | Existing automation |
| [TC-SYNC-09](#tc-sync-09) | Target detail direct URL, missing IDs and return scope | [TS-SYNC-03](test-scenarios.md#ts-sync-03) | P0 | Existing direct/back automation; cross-module link review |
| [TC-SYNC-10](#tc-sync-10) | One primary alert per target with expected totals | [TS-SYNC-04](test-scenarios.md#ts-sync-04) | P0 | Existing automation |
| [TC-SYNC-11](#tc-sync-11) | Healthy and in-deadline pending do not generate incident alerts | [TS-SYNC-04](test-scenarios.md#ts-sync-04) | P0 | Existing automation |
| [TC-SYNC-12](#tc-sync-12) | Alert feed drilldown and scoped counts | [TS-SYNC-04](test-scenarios.md#ts-sync-04) | P1 | Partial browser coverage; count-label/default-rule wording review |
| [TC-ALR-01](#tc-alr-01) | Exact escalation threshold boundaries | [TS-ALR-01](test-scenarios.md#ts-alr-01) | P0 | Existing automation |
| [TC-ALR-02](#tc-alr-02) | Missing and future reference times cannot force escalation | [TS-ALR-01](test-scenarios.md#ts-alr-01) | P0 | Existing missing-age automation; future-time boundary review |
| [TC-ALR-03](#tc-alr-03) | Primary reference age is pinned and reproducible | [TS-ALR-01](test-scenarios.md#ts-alr-01) | P0 | Existing automation |
| [TC-ALR-04](#tc-alr-04) | Disabling recommendations retains alerts | [TS-ALR-01](test-scenarios.md#ts-alr-01) | P0 | Existing automation |
| [TC-ALR-05](#tc-alr-05) | Custom threshold and severity preview | [TS-ALR-02](test-scenarios.md#ts-alr-02) | P0 | Existing automation |
| [TC-ALR-06](#tc-alr-06) | Strict rule-schema validation | [TS-ALR-02](test-scenarios.md#ts-alr-02) | P0 | Existing order/equality/severity/extra-field automation; remaining numeric edges require execution |
| [TC-ALR-07](#tc-alr-07) | Preview leaves default policy and alerts unchanged | [TS-ALR-02](test-scenarios.md#ts-alr-02) | P0 | Existing automation |
| [TC-ALR-08](#tc-alr-08) | Preview pagination preserves edited scope and policy | [TS-ALR-02](test-scenarios.md#ts-alr-02) | P1 | Existing automation |
| [TC-ALR-09](#tc-alr-09) | Stale preview and invalid publication are rejected | [TS-ALR-02](test-scenarios.md#ts-alr-02) | P0 | Existing automation |
| [TC-ALR-10](#tc-alr-10) | Preview errors, reset and no-delivery messaging | [TS-ALR-02](test-scenarios.md#ts-alr-02) | P1 | Existing error/reset automation; wording/manual review |
| [TC-UX-01](#tc-ux-01) | Loading is distinct from zero results | [TS-UX-01](test-scenarios.md#ts-ux-01) | P0 | Existing automation |
| [TC-UX-02](#tc-ux-02) | Failure and retry retain the latest applied scope | [TS-UX-01](test-scenarios.md#ts-ux-01) | P0 | Existing automation |
| [TC-UX-03](#tc-ux-03) | Obsolete responses cannot overwrite new navigation | [TS-UX-01](test-scenarios.md#ts-ux-01) | P0 | Existing executive/center and preview cancellation; verify module-level sync navigation separately |
| [TC-UX-04](#tc-ux-04) | Empty matches and invalid URL recovery | [TS-UX-01](test-scenarios.md#ts-ux-01) | P1 | Existing automation |
| [TC-UX-05](#tc-ux-05) | Keyboard navigation and chart alternatives | [TS-UX-02](test-scenarios.md#ts-ux-02) | P1 | Partial browser coverage; full accessibility review not run |
| [TC-UX-06](#tc-ux-06) | Responsive layout and readable horizontal tables | [TS-UX-02](test-scenarios.md#ts-ux-02) | P1 | Existing390px/desktop browser coverage; 320px/zoom manual |
| [TC-UX-07](#tc-ux-07) | Firefox and other browser compatibility | [TS-UX-02](test-scenarios.md#ts-ux-02) | P1 | Manual; no verified Firefox/Edge/Safari run |
| [TC-UX-08](#tc-ux-08) | Four stakeholder perspectives remain honest | [TS-UX-02](test-scenarios.md#ts-ux-02) | P1 | Manual/UAT; role enforcement is future scope |
| [TC-DEMO-01](#tc-demo-01) | Executive-to-center-to-target evidence journey | [TS-DEMO-01](test-scenarios.md#ts-demo-01) | P0 | Partial automation; complete linked rehearsal manual |
| [TC-DEMO-02](#tc-demo-02) | Reset reproduces baseline and refresh is fixed | [TS-DEMO-01](test-scenarios.md#ts-demo-01) | P0 | Related browser automation; three-module rehearsal manual |
| [TC-DEMO-03](#tc-demo-03) | Direct route refresh and browser history | [TS-DEMO-01](test-scenarios.md#ts-demo-01) | P0 | Existing direct/refresh/in-app back; full browser-history matrix manual |
| [TC-DEMO-04](#tc-demo-04) | Application reachability and controlled failure recovery | [TS-DEMO-01](test-scenarios.md#ts-demo-01) | P0 | Existing request-interception recovery; process-outage rehearsal manual |
| [TC-DEMO-05](#tc-demo-05) | Presentation content and claim review | [TS-DEMO-01](test-scenarios.md#ts-demo-01) | P1 | Manual/documentation review |
| [TC-FUT-01](#tc-fut-01) | Real identity and four-role authorization | [TS-FUT-01](test-scenarios.md#ts-fut-01) | P1 | Not ready; future identity/RBAC |
| [TC-FUT-02](#tc-fut-02) | Attendance, assessment, completion and certification | [TS-FUT-02](test-scenarios.md#ts-fut-02) | P1 | Not ready; future learning modules |
| [TC-FUT-03](#tc-fut-03) | Reports, exports and scheduled recipient access | [TS-FUT-03](test-scenarios.md#ts-fut-03) | P1 | Not ready; future reporting/delivery |
| [TC-FUT-04](#tc-fut-04) | Real offline ingestion, retry deduplication and late data | [TS-FUT-04](test-scenarios.md#ts-fut-04) | P1 | Not ready; future ingestion/persistence |
| [TC-FUT-05](#tc-fut-05) | Operational alert lifecycle and production qualification | [TS-FUT-05](test-scenarios.md#ts-fut-05) | P1 | Not ready; future operations and qualification |

## Environment and runtime

### TC-ENV-01

**Repeatable local installation and environment setup**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P0. **Layer:** Manual/setup.
- **Preconditions / data:** Clean clone; compatible Node/npm; existing edited .env available in an isolated copy.
- **Steps:** 1. Run npm ci and npm run setup:env. 2. Run setup:env again; compare existing environment values without publishing them.
- **Expected result:** Dependencies install from lockfile; only missing templates are copied; repeated setup does not overwrite edited values.
- **Coverage:** Manual; related setup script review.
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ENV-02

**Compiled demo startup and API proxy**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P0. **Layer:** Browser/integration.
- **Preconditions / data:** F0; free ports 3001/4173; valid API environment; database may be unavailable.
- **Steps:** 1. Run npm run demo and open http://127.0.0.1:4173/. 2. Inspect /api/health/live and /api/v1/dashboard/executive through port 4173.
- **Expected result:** Compiled UI and proxied API respond; executive baseline loads without PostgreSQL; no competing development process owns API3001.
- **Coverage:** Existing automation. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ENV-03

**Formatting, types, tests and builds**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P0. **Layer:** Tooling.
- **Preconditions / data:** Dependencies installed; retain command output with build identity.
- **Steps:** 1. Run npm run check. 2. Record each stage and final exit code.
- **Expected result:** Formatting check, strict source/test type checks, API/UI tests and shared/API/web builds succeed; results are recorded rather than inferred from historical counts.
- **Coverage:** Command-based verification; not an application test.
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ENV-04

**Database connectivity is separate from liveness**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** Isolated Fastify test instance with rejected database check.
- **Steps:** 1. Request /api/health/live. 2. Request /api/health/ready; close the app instance.
- **Expected result:** Liveness is 200 without DB; readiness is safe 503 when DB fails; database cleanup is called on close. Synthetic business endpoints still operate.
- **Coverage:** Existing automation. Evidence: [app.test.ts](../apps/api/test/app.test.ts), [executive-api.test.ts](../apps/api/test/executive-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ENV-05

**Valid database readiness and cleanup**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P1. **Layer:** API/integration.
- **Preconditions / data:** Mock connected database for automated check; separate approved local PostgreSQL for real integration.
- **Steps:** 1. Use a successful check adapter and request readiness. 2. Close the app; separately record whether a real database was available.
- **Expected result:** Mock readiness returns connected/ready and cleanup runs. A mocked result does not count as a real PostgreSQL integration pass.
- **Coverage:** Existing mocked automation; real DB integration not run. Evidence: [app.test.ts](../apps/api/test/app.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ENV-06

**Secret-safe invalid configuration and TLS guard**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P0. **Layer:** Service/config.
- **Preconditions / data:** Invalid DATABASE_URL/origin/CA combinations and production mode with DATABASE_TLS=false, using synthetic sentinel credentials.
- **Steps:** 1. Run configuration-validation cases. 2. Inspect raised errors for field names and sentinel credential values.
- **Expected result:** Invalid settings are rejected without echoing secret values; production rejects disabled verified TLS and URL SSL override flags; true/false parsing is correct.
- **Coverage:** Existing automation. Evidence: [env.test.ts](../apps/api/test/env.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ENV-07

**Compose and process lifecycle**

- **Scenario:** [TS-ENV-01](test-scenarios.md#ts-env-01). **Priority:** P1. **Layer:** Manual/setup.
- **Preconditions / data:** Valid local templates; use only task-owned processes and a separate demonstration session.
- **Steps:** 1. Run npm run db:config. 2. Start one demo session, then stop that session with Ctrl+C; inspect owned listening ports.
- **Expected result:** Compose validates without a daemon. Both owned app processes stop; unrelated processes and database volumes remain untouched. Real DB startup is separately gated on Docker availability.
- **Coverage:** Manual/command-based; not claimed automated.
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## API contracts and error safety

### TC-API-01

**Unknown routes and missing resources**

- **Scenario:** [TS-API-01](test-scenarios.md#ts-api-01). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** F0; no real credentials.
- **Steps:** 1. Request /api/v1/not-implemented. 2. Request center-9999 and target-9999 through their detail endpoints.
- **Expected result:** Unknown routes and missing records return safe 404 envelopes, not fabricated data or success; no stack traces appear.
- **Coverage:** Existing automation. Evidence: [app.test.ts](../apps/api/test/app.test.ts), [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-API-02

**Malformed JSON and schema validation**

- **Scenario:** [TS-API-01](test-scenarios.md#ts-api-01). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** Isolated app; POST /api/v1/synchronization/rules/evaluate.
- **Steps:** 1. Submit malformed JSON. 2. Submit syntactically valid JSON with unsupported fields or invalid rules.
- **Expected result:** Malformed/schema-invalid input produces consistent safe 400 errors with request correlation; defaults and source facts remain unchanged.
- **Coverage:** Existing automation. Evidence: [app.test.ts](../apps/api/test/app.test.ts), [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-API-03

**Unsupported and oversized request bodies**

- **Scenario:** [TS-API-01](test-scenarios.md#ts-api-01). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** Isolated app; sentinel body data.
- **Steps:** 1. Submit unsupported content type to a body-consuming test endpoint. 2. Submit rule-evaluation JSON exceeding the configured 1 MiB body limit.
- **Expected result:** Unsupported media is 415 and oversized body is 413; error envelopes do not expose body content.
- **Coverage:** Existing automation. Evidence: [app.test.ts](../apps/api/test/app.test.ts), [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-API-04

**Unexpected errors are masked**

- **Scenario:** [TS-API-01](test-scenarios.md#ts-api-01). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** Isolated test route or adapter throwing a sentinel private message.
- **Steps:** 1. Trigger an unexpected failure. 2. Trigger an explicit safe AppError.
- **Expected result:** Unexpected failure returns INTERNAL_ERROR/500 without the sentinel or stack; explicitly safe application errors retain their approved public message.
- **Coverage:** Existing automation. Evidence: [app.test.ts](../apps/api/test/app.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-API-05

**Success envelopes, correlation and cache policy**

- **Scenario:** [TS-API-02](test-scenarios.md#ts-api-02). **Priority:** P1. **Layer:** API.
- **Preconditions / data:** F0; include an untrusted incoming request ID.
- **Steps:** 1. Request a business endpoint twice. 2. Inspect data/meta, X-Request-Id and Cache-Control.
- **Expected result:** Success envelopes contain verified payloads and generated_at; server-generated request IDs match their response headers and cannot be replaced by the supplied ID; no-store is set.
- **Coverage:** Existing automation; repeat-call/manual correlation review. Evidence: [app.test.ts](../apps/api/test/app.test.ts), [executive-api.test.ts](../apps/api/test/executive-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-API-06

**Client rejects invalid data and preserves cancellation**

- **Scenario:** [TS-API-02](test-scenarios.md#ts-api-02). **Priority:** P0. **Layer:** Client/service.
- **Preconditions / data:** I3 mocked fetch responses: valid envelope with invalid data, safe API error, network rejection and AbortSignal.
- **Steps:** 1. Call the module clients with each mocked response. 2. Abort the active request; inspect safe client error/cancellation behavior.
- **Expected result:** Malformed payloads are INVALID_RESPONSE; safe server messages/request IDs survive; network failures hide raw socket details; cancellation is forwarded and obsolete responses cannot publish data.
- **Coverage:** Existing automation. Evidence: [executive-service.test.ts](../apps/web/test/executive-service.test.ts), [centers-service.test.ts](../apps/web/test/centers-service.test.ts), [synchronization-service.test.ts](../apps/web/test/synchronization-service.test.ts), [executive-page.test.tsx](../apps/web/test/executive-page.test.tsx), [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Executive Dashboard

### TC-EX-01

**Executive center partition and coverage**

- **Scenario:** [TS-EX-01](test-scenarios.md#ts-ex-01). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; reset all dashboard filters.
- **Steps:** 1. Open / or request /api/v1/dashboard/executive. 2. Read total, active, inactive, unknown and classification coverage.
- **Expected result:** 84 = 68 active + 11 inactive + 5 unknown; classification is 94.0%; unknown is not included in inactive.
- **Coverage:** Existing automation. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts), [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-02

**Draft versus applied filters and reset**

- **Scenario:** [TS-EX-01](test-scenarios.md#ts-ex-01). **Priority:** P0. **Layer:** UI/browser.
- **Preconditions / data:** F0; loaded default dashboard.
- **Steps:** 1. Change Region, Scheme and Event period without Apply. 2. Apply; inspect request/scope; Reset filters.
- **Expected result:** Draft edits leave existing metrics unchanged; Apply sends the intersection with pinned snapshot; Reset restores the April–September default and all-region/all-scheme scope.
- **Coverage:** Existing automation. Evidence: [executive-page.test.tsx](../apps/web/test/executive-page.test.tsx), [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-03

**Overlapping scheme coverage and attribution**

- **Scenario:** [TS-EX-01](test-scenarios.md#ts-ex-01). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** F0; center membership can overlap.
- **Steps:** 1. Sum centers reported by scheme and compare distinct network total. 2. Select a scheme and independently filter batches by batch.scheme_id.
- **Expected result:** 100 memberships span 84 distinct centers; scheme bars are nonadditive. Scoped batch/enrollment counts use the batch's own scheme and do not multiply facts across memberships.
- **Coverage:** Existing automation. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts), [centers-service.test.ts](../apps/api/test/centers-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-04

**Section responses reconcile with the composite**

- **Scenario:** [TS-EX-01](test-scenarios.md#ts-ex-01). **Priority:** P1. **Layer:** API.
- **Preconditions / data:** Same region, scheme, dates and snapshot for all requests.
- **Steps:** 1. Request the composite executive response. 2. Request centers, schemes, batches, sync and trends projections with identical query.
- **Expected result:** Each section and context equals the matching composite section; projection endpoints do not silently alter scope or publication.
- **Coverage:** Existing automation. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-05

**Default creation cohort and enrollment meaning**

- **Scenario:** [TS-EX-02](test-scenarios.md#ts-ex-02). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; period_start=2026-04-01 and period_end=2026-10-01.
- **Steps:** 1. Read batches created and enrollments. 2. Compare sum of monthly creation/enrollment rows and inspect labels.
- **Expected result:** 288 original creations and 6,935 attached enrollment records; labels do not claim unique learners or enrollment-event throughput.
- **Coverage:** Related automation; exact monthly-sum/label review included. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts), [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-06

**Weighted utilization and excluded capacities**

- **Scenario:** [TS-EX-02](test-scenarios.md#ts-ex-02). **Priority:** P0. **Layer:** Service.
- **Preconditions / data:** I1: current batches (capacity,seats)=(20,10),(80,20),(null,100),(0,40).
- **Steps:** 1. Call batchCounts at F0 cutoff. 2. Read current/comparable/excluded, summed seats/capacity and rate.
- **Expected result:** Four current, two comparable, two excluded; 30 eligible seats/100 capacity=30.0%, not the average of 50% and 25%. Excluded seats do not enter the numerator.
- **Coverage:** Existing automation. Evidence: [executive-calculations.test.ts](../apps/api/test/executive-calculations.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-07

**Unavailable denominator and overcapacity**

- **Scenario:** [TS-EX-02](test-scenarios.md#ts-ex-02). **Priority:** P0. **Layer:** Service/UI.
- **Preconditions / data:** I1 variants: no comparable capacity, then capacity20/seats25.
- **Steps:** 1. Evaluate empty/all-invalid capacity populations. 2. Evaluate the overcapacity batch and inspect rate formatting.
- **Expected result:** Zero denominator returns null/N/A, never fabricated 0%; overcapacity returns 125% without clamping. Null display in every visual is manually reviewed.
- **Coverage:** Existing service automation; UI N/A review. Evidence: [executive-calculations.test.ts](../apps/api/test/executive-calculations.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-08

**Planned, completed and future batch lifecycle**

- **Scenario:** [TS-EX-02](test-scenarios.md#ts-ex-02). **Priority:** P0. **Layer:** Service.
- **Preconditions / data:** I1 with a created planned batch starting after cutoff, a completed batch, and a not-yet-created batch.
- **Steps:** 1. Evaluate batchCounts at F0 cutoff. 2. Compare included current stock with source lifecycle timestamps.
- **Expected result:** Created planned/running stock is included; completed and future-created batches are excluded from current stock; the existing planned example is 10/40=25%.
- **Coverage:** Existing automation. Evidence: [executive-calculations.test.ts](../apps/api/test/executive-calculations.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-09

**Flow period changes do not change fixed stock**

- **Scenario:** [TS-EX-02](test-scenarios.md#ts-ex-02). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; compare April–September versus September-only.
- **Steps:** 1. Change only the event window. 2. Compare creation flows, utilization, centers and cutoff.
- **Expected result:** Creation/enrollment cohort changes, while fixed-cutoff centers and current stock stay unchanged; unfiltered stock remains 3,640/5,320=68.4% with 151 comparable and 17 excluded batches.
- **Coverage:** Existing automation. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts), [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-10

**Valid dates and half-open month boundaries**

- **Scenario:** [TS-EX-03](test-scenarios.md#ts-ex-03). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** Available Jan–Sep 2026; real ISO first-of-month paired dates.
- **Steps:** 1. Submit one missing boundary, invalid 2026-02-30, mid-month start, reversed range and out-of-range dates. 2. Submit valid September 1–October 1.
- **Expected result:** Invalid queries are 400; valid window is start-inclusive/end-exclusive. Available bounds are Jan1 through exclusive Oct1; no time basis silently changes.
- **Coverage:** Existing automation. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-11

**Historical activity uses observations**

- **Scenario:** [TS-EX-03](test-scenarios.md#ts-ex-03). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** I1 center with earlier active and later inactive observations; F0 monthly histories.
- **Steps:** 1. Resolve status at two cutoffs and inspect monthly trends. 2. Compare before-onboarding and after-onboarding populations.
- **Expected result:** Historic status follows observations at each cutoff, not today's classification projected backward; centers appear only after onboarding.
- **Coverage:** Existing service automation; monthly integration review. Evidence: [executive-calculations.test.ts](../apps/api/test/executive-calculations.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-EX-12

**Unavailable publication is not replaced**

- **Scenario:** [TS-EX-03](test-scenarios.md#ts-ex-03). **Priority:** P0. **Layer:** API/client.
- **Preconditions / data:** snapshot_id=missing; then valid F0 publication.
- **Steps:** 1. Request executive data using the missing ID. 2. Retry using the valid ID and inspect context.
- **Expected result:** Missing snapshot returns 404; valid snapshot returns its fixed context. Response generated_at is not mistaken for source data_as_of.
- **Coverage:** Existing automation. Evidence: [executive-api.test.ts](../apps/api/test/executive-api.test.ts), [executive-service.test.ts](../apps/web/test/executive-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Center Monitoring

### TC-CTR-01

**Complete deterministic center pagination**

- **Scenario:** [TS-CTR-01](test-scenarios.md#ts-ctr-01). **Priority:** P0. **Layer:** API/browser.
- **Preconditions / data:** F0; page_size=10, sort=name, order=asc.
- **Steps:** 1. Read all pages, collect center IDs and repeat page1. 2. Request page10 after the nine valid pages.
- **Expected result:** 84 unique centers exactly once; stable order and pinned snapshot; nine pages, last page four rows. Out-of-range API page returns an empty page with matching_total still84.
- **Coverage:** Existing automation. Evidence: [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-02

**Sort stability when display values tie**

- **Scenario:** [TS-CTR-01](test-scenarios.md#ts-ctr-01). **Priority:** P1. **Layer:** Service.
- **Preconditions / data:** I1 centers with tied names/status; use page boundaries.
- **Steps:** 1. Sort name/status in both directions. 2. Read adjacent pages repeatedly and compare identity order.
- **Expected result:** Supported sort fields respect order and use deterministic ID tie-breaking; no repeated or dropped centers across tied pages.
- **Coverage:** Existing automation. Evidence: [centers-service.test.ts](../apps/api/test/centers-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-03

**Page, search and option validation boundaries**

- **Scenario:** [TS-CTR-01](test-scenarios.md#ts-ctr-01). **Priority:** P0. **Layer:** API/client.
- **Preconditions / data:** F0; boundary queries listed in test file.
- **Steps:** 1. Submit page0/-1/1.5/01/1000001, page_size0/51, search length101, invalid sort/order/status and unknown query field. 2. Check valid defaults; separately exercise page_size1/50 and search lengths0/100.
- **Expected result:** Invalid inputs are 400 or client-side validation errors; valid documented bounds are accepted. Unasserted positive-edge rows must be recorded as additional execution.
- **Coverage:** Existing invalid-boundary automation; positive-edge coverage partial. Evidence: [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [centers-service.test.ts](../apps/web/test/centers-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-04

**Out-of-range listing recovery**

- **Scenario:** [TS-CTR-01](test-scenarios.md#ts-ctr-01). **Priority:** P1. **Layer:** UI.
- **Preconditions / data:** /centers?page=100&region_id=region-1.
- **Steps:** 1. Load the URL. 2. Select Go to first page.
- **Expected result:** UI does not show a reversed range or claim no centers exist when matching_total>0; action preserves region and restores page1.
- **Coverage:** Existing automation. Evidence: [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-05

**Compound center scope and geographic conflicts**

- **Scenario:** [TS-CTR-02](test-scenarios.md#ts-ctr-02). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; region-1/district-2/scheme-2/active/search SAR-002; conflict region-1/district-8.
- **Steps:** 1. Apply the valid compound query. 2. Request unknown regions/districts/schemes and the conflicting geography.
- **Expected result:** Valid selection returns center-2 only; list/analysis share geography/scheme/search. Unknown and conflicting scopes return400, not silent broadening.
- **Coverage:** Existing automation. Evidence: [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-06

**Activity list filters retain comparison counts**

- **Scenario:** [TS-CTR-02](test-scenarios.md#ts-ctr-02). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; no geographic filters.
- **Steps:** 1. Select inactive then unknown activity. 2. Compare matching_total with scope_before_status and group totals.
- **Expected result:** Inactive matching count11, unknown matching count5; pre-status summary stays84/68/11/5. Pagination does not alter summary populations.
- **Coverage:** Existing automation. Evidence: [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-07

**Region/district drilldowns and draft reset**

- **Scenario:** [TS-CTR-02](test-scenarios.md#ts-ctr-02). **Priority:** P0. **Layer:** UI/browser.
- **Preconditions / data:** F0; center monitoring loaded.
- **Steps:** 1. Choose a district then change the draft region. 2. Apply or drill North Region → District01; Reset.
- **Expected result:** Changing region clears incompatible draft district; applied geographic drilldown is encoded in URL. District01 has7 centers. Reset restores full scope and first page.
- **Coverage:** Existing automation. Evidence: [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-08

**No-match center search is explicit**

- **Scenario:** [TS-CTR-02](test-scenarios.md#ts-ctr-02). **Priority:** P1. **Layer:** API/UI.
- **Preconditions / data:** F0; search=does-not-exist.
- **Steps:** 1. Apply the search. 2. Inspect items, matching_total, summary denominator and recovery.
- **Expected result:** Items empty, total_pages0 and matching_total0; empty rates are unavailable; clear/reset can recover without classifying missing results inactive.
- **Coverage:** Existing automation. Evidence: [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-09

**Detail refresh and return context**

- **Scenario:** [TS-CTR-03](test-scenarios.md#ts-ctr-03). **Priority:** P0. **Layer:** UI/browser.
- **Preconditions / data:** Filtered center-2 listing from TC-CTR-05; retain URL.
- **Steps:** 1. Open center-2 details and refresh. 2. Use Back to centers; compare query and controls.
- **Expected result:** Center profile loads directly; snapshot, geography, scheme, status, search and page return context are preserved. Center-2 shows six all-history batches and two sync targets.
- **Coverage:** Existing automation. Evidence: [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-10

**Detail quantities and scheme-filtered row attribution**

- **Scenario:** [TS-CTR-03](test-scenarios.md#ts-ctr-03). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** F0 overlapping center and a selected scheme.
- **Steps:** 1. Compare the row's batch/enrollment counts with only matching batch.scheme_id facts. 2. Open the same center's unfiltered detail; recalculate current capacity and sync totals.
- **Expected result:** List counts honor selected batch scheme; individual detail shows complete center history. Comparable seats/capacity and target counts reconcile with source facts and equivalent executive context.
- **Coverage:** Existing automation. Evidence: [centers-service.test.ts](../apps/api/test/centers-service.test.ts), [centers-api.test.ts](../apps/api/test/centers-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-11

**Unknown center evidence and missing detail**

- **Scenario:** [TS-CTR-03](test-scenarios.md#ts-ctr-03). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** F0 center-1; missing center ID; I1 center with no targets or comparable capacity.
- **Steps:** 1. Inspect center-1 activity/history and sync independently. 2. Request missing detail and inject empty target/capacity population in service harness.
- **Expected result:** Center-1 activity remains unknown without becoming inactive; missing detail404; absent targets/denominator produce unknown sync and null utilization, not success or fabricated zero.
- **Coverage:** Existing automation. Evidence: [centers-api.test.ts](../apps/api/test/centers-api.test.ts), [centers-service.test.ts](../apps/api/test/centers-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-CTR-12

**Invalid/ambiguous URL and mismatched publication**

- **Scenario:** [TS-CTR-03](test-scenarios.md#ts-ctr-03). **Priority:** P0. **Layer:** Client/UI.
- **Preconditions / data:** Repeated region query, invalid page, and I3 listing/analysis with different snapshot IDs.
- **Steps:** 1. Load malformed/repeated context. 2. Return mismatched publications from the two clients.
- **Expected result:** Invalid context is actionable and not silently reset to a broader scope; mismatched listing/analysis is refused, and no mixed-snapshot metrics render.
- **Coverage:** Existing automation. Evidence: [centers-service.test.ts](../apps/web/test/centers-service.test.ts), [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Synchronization Monitoring

### TC-SYNC-01

**Expected-target partition reconciles across modules**

- **Scenario:** [TS-SYNC-01](test-scenarios.md#ts-sync-01). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; reset synchronization filters.
- **Steps:** 1. Read synchronization dashboard and executive sync projection. 2. Compare expected roster and health/coverage.
- **Expected result:** 168=32 healthy+102 degraded+34 unknown; health19.0%, classification79.8%; the same snapshot and expected-target grain is used across modules.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-02

**Connectivity does not determine health**

- **Scenario:** [TS-SYNC-01](test-scenarios.md#ts-sync-01). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** I2 offline target with fresh successful complete published evidence.
- **Steps:** 1. Classify that target and inspect expected roster. 2. Compare recorded center activity without changing it.
- **Expected result:** Offline target can be healthy; connectivity alone never marks a center inactive or creates a failed-transfer alert.
- **Coverage:** Existing automation. Evidence: [executive-calculations.test.ts](../apps/api/test/executive-calculations.test.ts), [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-03

**Freshness, pending and incomplete evidence**

- **Scenario:** [TS-SYNC-01](test-scenarios.md#ts-sync-01). **Priority:** P0. **Layer:** Service.
- **Preconditions / data:** I2: fresh complete success; failed; partial; stale success; pending within/over2h; delivery_complete=false or published=false.
- **Steps:** 1. Classify each variant at F0 cutoff. 2. Check precedence when failed evidence also has stale/incomplete fields; exercise exact24h/2h boundaries.
- **Expected result:** Known degradation precedes health. Fresh complete success is healthy, failed/partial/incomplete/stale/overdue are degraded; insufficient evidence and in-deadline pending remain unknown. Stale/overdue conditions use >24h/>2h, not >=. Exact-boundary assertions require independent execution.
- **Coverage:** Existing classification automation; exact24h/2h positive-edge review. Evidence: [executive-calculations.test.ts](../apps/api/test/executive-calculations.test.ts), [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-04

**Target pagination is complete and repeatable**

- **Scenario:** [TS-SYNC-02](test-scenarios.md#ts-sync-02). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** F0; page_size=50.
- **Steps:** 1. Collect IDs from every target page and repeat page2. 2. Compare order and context.
- **Expected result:** 168 unique targets; stable natural-ID order; page2 matches positions50–99 of the full ordered roster; no duplicates from multiple centers.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-05

**Failed/partial quick filters preserve baseline scope**

- **Scenario:** [TS-SYNC-02](test-scenarios.md#ts-sync-02). **Priority:** P0. **Layer:** UI/API.
- **Preconditions / data:** F0 with no geography selection.
- **Steps:** 1. Select Monitor failed transfers, then Monitor partial transfers. 2. Inspect matching list versus pre-state/result summary.
- **Expected result:** Latest failed and partial counts are17 each; these differ from102 degraded targets. A quick result filter clears a conflicting health filter; summary remains the geography/search roster.
- **Coverage:** Existing API/browser coverage; partial-button interaction review. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-06

**Compound target scope and invalid parents**

- **Scenario:** [TS-SYNC-02](test-scenarios.md#ts-sync-02). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** region-1/district-1/center-1/result failed; invalid center-in-region combination.
- **Steps:** 1. Apply the valid compound query. 2. Request missing scope IDs, unknown fields, state=offline, result=degraded, invalid paging and >100-character search.
- **Expected result:** Valid selection has target-2 only, while pre-state/result roster contains both center-1 targets. Invalid/unknown/incompatible scopes return400 without broadening.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-07

**Full last-success and observation timestamps**

- **Scenario:** [TS-SYNC-03](test-scenarios.md#ts-sync-03). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0 target-4 has latest11:00UTC and last success08:00UTC; target-2 failed08:00UTC.
- **Steps:** 1. Inspect API and target detail timestamps. 2. Compare rendered dates, seconds and timezone for observation and last successful sync.
- **Expected result:** ISO evidence is preserved; target-4 displays16:30:00 IST observation and13:30:00 IST last success, with UTC+05:30 label. Target-2 shows failed result separately from recorded last success.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-08

**Missing evidence does not invent timestamps**

- **Scenario:** [TS-SYNC-03](test-scenarios.md#ts-sync-03). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0 target-1 with missing timestamps/result.
- **Steps:** 1. Open target-1 detail and its alert. 2. Read last success, latest observation, ages and recipient.
- **Expected result:** No evidence/unknown dates and null ages are explicit. The informational alert has no recipient escalation; no epoch date, zero-age success or infinite failure duration is manufactured.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-09

**Target detail direct URL, missing IDs and return scope**

- **Scenario:** [TS-SYNC-03](test-scenarios.md#ts-sync-03). **Priority:** P0. **Layer:** API/browser.
- **Preconditions / data:** Filtered target-2 listing; missing target ID and missing snapshot.
- **Steps:** 1. Open target-2, refresh and return to synchronization. 2. Request missing detail/publication.
- **Expected result:** Target evidence loads directly and Back preserves filter/snapshot context; missing target/snapshot404. Center detail link retains the publication. Its full cross-module navigation is a manual extension where not asserted.
- **Coverage:** Existing direct/back automation; cross-module link review. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-10

**One primary alert per target with expected totals**

- **Scenario:** [TS-SYNC-04](test-scenarios.md#ts-sync-04). **Priority:** P0. **Layer:** API.
- **Preconditions / data:** F0; read every alert page.
- **Steps:** 1. Collect all alert IDs/target IDs. 2. Compare severities and causes with roster evidence.
- **Expected result:** 119 unique primary alerts:17 information,85 warning,17 critical. A failed+stale+incomplete target produces one failed primary alert, not three incidents.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-11

**Healthy and in-deadline pending do not generate incident alerts**

- **Scenario:** [TS-SYNC-04](test-scenarios.md#ts-sync-04). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** I2 healthy offline target and pending11:00UTC at12:00UTC cutoff with otherwise complete evidence.
- **Steps:** 1. Evaluate primary alerts for both. 2. Compare target states and alert-list membership.
- **Expected result:** Neither gets a primary incident alert; pending remains unknown rather than failed. F0 contains17 such within-deadline pending targets.
- **Coverage:** Existing automation. Evidence: [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts), [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-SYNC-12

**Alert feed drilldown and scoped counts**

- **Scenario:** [TS-SYNC-04](test-scenarios.md#ts-sync-04). **Priority:** P1. **Layer:** UI/browser.
- **Preconditions / data:** F0 plus a failed-result or healthy-state filter.
- **Steps:** 1. Compare feed matches with scope-level severity count subtitle. 2. Open an alert target; inspect the default-rule recommendation.
- **Expected result:** Feed follows the applied target filters; scope-before-health/result counts are labeled separately. Target detail explicitly uses default rules, even when opened from a custom preview.
- **Coverage:** Partial browser coverage; count-label/default-rule wording review. Evidence: [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Alerts and escalation rules

### TC-ALR-01

**Exact escalation threshold boundaries**

- **Scenario:** [TS-ALR-01](test-scenarios.md#ts-alr-01). **Priority:** P0. **Layer:** Service.
- **Preconditions / data:** I2 failed observation references aged0,1.999,2,5.999,6,23.999,24 hours at cutoff.
- **Steps:** 1. Evaluate default rules for every age. 2. Compare the highest reached role.
- **Expected result:** Roles are CM,CM,JDM,JDM,SDM,SDM,Super Admin respectively. Inclusive escalation thresholds use >=; they are not the > health deadlines.
- **Coverage:** Existing automation. Evidence: [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-02

**Missing and future reference times cannot force escalation**

- **Scenario:** [TS-ALR-01](test-scenarios.md#ts-alr-01). **Priority:** P0. **Layer:** Service.
- **Preconditions / data:** I2 failed target with null latest_at; then a future/untrustworthy reference.
- **Steps:** 1. Evaluate alert and elapsedHours at cutoff. 2. Inspect null ages and recipient selection.
- **Expected result:** Missing/untrustworthy age stays unavailable and never selects the highest role. Known failed evidence can retain failure severity while recipient remains null. Future-time checks not explicitly asserted in the suite require additional execution.
- **Coverage:** Existing missing-age automation; future-time boundary review. Evidence: [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-03

**Primary reference age is pinned and reproducible**

- **Scenario:** [TS-ALR-01](test-scenarios.md#ts-alr-01). **Priority:** P0. **Layer:** Service/API.
- **Preconditions / data:** F0 and I2 stale-success target; advance test wall clock to2035.
- **Steps:** 1. Evaluate before/after changing the harness clock. 2. Inspect stale reference and target-2 recommendation.
- **Expected result:** Results still use snapshot12:00UTC. Stale age derives from last_success_at; target-2 age4h recommends JDM. Observation age is not labeled continuous outage duration.
- **Coverage:** Existing automation. Evidence: [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-04

**Disabling recommendations retains alerts**

- **Scenario:** [TS-ALR-01](test-scenarios.md#ts-alr-01). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; cloned default rules enabled=false.
- **Steps:** 1. Evaluate disabled recommendations with the same filters. 2. Compare alert population and each recommended_role with default evaluation.
- **Expected result:** Alerts and health remain; recommended_role becomes null with disabled/review explanation. Disabled recommendations are not a hidden delete/suppress-alert control.
- **Coverage:** Existing automation. Evidence: [synchronization-alerts.test.ts](../apps/api/test/synchronization-alerts.test.ts), [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-05

**Custom threshold and severity preview**

- **Scenario:** [TS-ALR-02](test-scenarios.md#ts-alr-02). **Priority:** P0. **Layer:** API/UI.
- **Preconditions / data:** F0; default thresholds0/2/6/24; change SDM to3 and failed severity towarning.
- **Steps:** 1. Preview failed targets. 2. Inspect target-2 recommendation and severity.
- **Expected result:** preview=true; target-2 recommends SDM at age4h and follows edited severity. Health classifications and source timestamps do not change.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-06

**Strict rule-schema validation**

- **Scenario:** [TS-ALR-02](test-scenarios.md#ts-alr-02). **Priority:** P0. **Layer:** API/client.
- **Preconditions / data:** Rule variants: reversed/duplicate roles, nonzeroCM, equal/decreasing durations, negative/>720 hours, unknown severity/fields.
- **Steps:** 1. POST each invalid payload; repeat through client editor for unsupported numeric input. 2. Inspect safe errors and whether invalid local rules trigger network calls.
- **Expected result:** 400 safe validation for invalid server requests; locally invalid rules are blocked before fetch. Four ordered roles and increasing bounded durations are required; positive720 and negative-edge coverage is partial until separately executed.
- **Coverage:** Existing order/equality/severity/extra-field automation; remaining numeric edges require execution. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-service.test.ts](../apps/web/test/synchronization-service.test.ts), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-07

**Preview leaves default policy and alerts unchanged**

- **Scenario:** [TS-ALR-02](test-scenarios.md#ts-alr-02). **Priority:** P0. **Layer:** API/browser.
- **Preconditions / data:** F0; save GET rules and default alerts before POST.
- **Steps:** 1. Evaluate an edited policy, then GET rules/alerts again. 2. Reload the page and read default inputs.
- **Expected result:** GET defaults and source facts are unchanged; subsequent default recommendations still use0/2/6/24. Reload starts from defaults. No persistent job or external delivery is represented by the API response.
- **Coverage:** Existing automation. Evidence: [synchronization-api.test.ts](../apps/api/test/synchronization-api.test.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-08

**Preview pagination preserves edited scope and policy**

- **Scenario:** [TS-ALR-02](test-scenarios.md#ts-alr-02). **Priority:** P1. **Layer:** UI/browser.
- **Preconditions / data:** F0; result=failed; SDM threshold3.
- **Steps:** 1. Preview, then Next preview page. 2. Compare route, submitted rules, snapshot and returned rows.
- **Expected result:** Local preview pagination resubmits the same policy/scope without changing dashboard URL;17 failed alerts yield10 then7 rows. Reset restores defaults and removes preview results.
- **Coverage:** Existing automation. Evidence: [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-09

**Stale preview and invalid publication are rejected**

- **Scenario:** [TS-ALR-02](test-scenarios.md#ts-alr-02). **Priority:** P0. **Layer:** UI/client.
- **Preconditions / data:** I3 delayed preview; preview=false response; response snapshot differs from requested snapshot.
- **Steps:** 1. Start preview then edit draft rules before response resolves. 2. Return each invalid preview envelope.
- **Expected result:** Pending response is canceled/ignored after edit. Non-preview or mismatched-snapshot results raise INVALID_RESPONSE and never populate the preview table.
- **Coverage:** Existing automation. Evidence: [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-service.test.ts](../apps/web/test/synchronization-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-ALR-10

**Preview errors, reset and no-delivery messaging**

- **Scenario:** [TS-ALR-02](test-scenarios.md#ts-alr-02). **Priority:** P1. **Layer:** UI/manual.
- **Preconditions / data:** I3 safe error/network failure; valid default rules.
- **Steps:** 1. Trigger preview validation/server failure, correct draft and retry. 2. Reset rules; inspect checkbox text and delivery/persistence labels.
- **Expected result:** Errors are actionable and do not corrupt default policy. Reset clears custom results and restores thresholds. Labels state request-local/no notifications; a UI message is not proof of an operational delivery system.
- **Coverage:** Existing error/reset automation; wording/manual review. Evidence: [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [synchronization-service.test.ts](../apps/web/test/synchronization-service.test.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Shared UX, accessibility and browser coverage

### TC-UX-01

**Loading is distinct from zero results**

- **Scenario:** [TS-UX-01](test-scenarios.md#ts-ux-01). **Priority:** P0. **Layer:** UI.
- **Preconditions / data:** I3 delayed options/dashboard response in each module.
- **Steps:** 1. Open each module with delayed requests. 2. Observe controls, loading state and metrics before completion.
- **Expected result:** An explicit loading state appears; metrics are not fabricated zeros; actions requiring unavailable options are disabled until ready.
- **Coverage:** Existing automation. Evidence: [executive-page.test.tsx](../apps/web/test/executive-page.test.tsx), [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-02

**Failure and retry retain the latest applied scope**

- **Scenario:** [TS-UX-01](test-scenarios.md#ts-ux-01). **Priority:** P0. **Layer:** UI/browser.
- **Preconditions / data:** I3 failure on a filtered request; then successful response.
- **Steps:** 1. Apply a scoped query and inject a safe API/network error. 2. Select Try again and inspect the retried request and recovery.
- **Expected result:** Failure is visible rather than a false empty success. Retry uses the failed applied context; valid data recovers. Do not treat raw transport credentials as a user-facing message.
- **Coverage:** Existing automation. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts), [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx), [executive-service.test.ts](../apps/web/test/executive-service.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-03

**Obsolete responses cannot overwrite new navigation**

- **Scenario:** [TS-UX-01](test-scenarios.md#ts-ux-01). **Priority:** P0. **Layer:** UI.
- **Preconditions / data:** I3 older slow request followed by a new filtered route.
- **Steps:** 1. Start the old request. 2. Apply/navigate to a new scope; resolve new response first, then old response.
- **Expected result:** Old AbortSignal is canceled and late results ignored; the latest scope, data, loading/error state remain correct.
- **Coverage:** Existing executive/center and preview cancellation; verify module-level sync navigation separately. Evidence: [executive-page.test.tsx](../apps/web/test/executive-page.test.tsx), [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [synchronization-page.test.tsx](../apps/web/test/synchronization-page.test.tsx).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-04

**Empty matches and invalid URL recovery**

- **Scenario:** [TS-UX-01](test-scenarios.md#ts-ux-01). **Priority:** P1. **Layer:** UI/browser.
- **Preconditions / data:** No-match search; page0 URL; out-of-range page.
- **Steps:** 1. Exercise each state on center and sync pages. 2. Use Reset filters or Go to first page.
- **Expected result:** Empty, invalid and out-of-range contexts have distinct actionable messages; no silent scope expansion or misleading reversed pagination range.
- **Coverage:** Existing automation. Evidence: [centers-page.test.tsx](../apps/web/test/centers-page.test.tsx), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-05

**Keyboard navigation and chart alternatives**

- **Scenario:** [TS-UX-02](test-scenarios.md#ts-ux-02). **Priority:** P1. **Layer:** Browser/manual.
- **Preconditions / data:** Desktop layout; keyboard-only navigation.
- **Steps:** 1. Use skip link/Tab/Enter through navigation, filters and reset controls. 2. Open View data table using keyboard; inspect headers and values.
- **Expected result:** Controls have visible focus, useful labels and keyboard behavior; charts have equivalent data tables and statuses include text. Existing browser checks cover the table alternative; a full keyboard/contrast audit is manual.
- **Coverage:** Partial browser coverage; full accessibility review not run. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-06

**Responsive layout and readable horizontal tables**

- **Scenario:** [TS-UX-02](test-scenarios.md#ts-ux-02). **Priority:** P1. **Layer:** Browser/manual.
- **Preconditions / data:** 390×844 and1440×1000 viewports; add320px and200% zoom manually.
- **Steps:** 1. Open all modules/details; resize and inspect document overflow. 2. Scroll wide tables inside their containers; inspect timestamp and rule controls.
- **Expected result:** No document-level horizontal overflow at tested sizes; tables can scroll without hiding controls. The390px automated check is not certification for all sizes, zoom or screen readers.
- **Coverage:** Existing390px/desktop browser coverage; 320px/zoom manual. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-07

**Firefox and other browser compatibility**

- **Scenario:** [TS-UX-02](test-scenarios.md#ts-ux-02). **Priority:** P1. **Layer:** Manual/browser matrix.
- **Preconditions / data:** Installed Firefox with visible UI; repeat separately in Edge/Safari where available.
- **Steps:** 1. Open the running compiled demo in Firefox. 2. Repeat scope→detail→back, exact timestamp rendering, chart tables and rule preview/reset.
- **Expected result:** Critical journeys work without blocking console/network/layout defects. Record exact browser/OS versions; Chromium results do not establish Firefox/Edge/Safari passes.
- **Coverage:** Manual; no verified Firefox/Edge/Safari run.
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-UX-08

**Four stakeholder perspectives remain honest**

- **Scenario:** [TS-UX-02](test-scenarios.md#ts-ux-02). **Priority:** P1. **Layer:** Manual/UAT.
- **Preconditions / data:** F0; CM/JDM/SDM/Super Admin representatives or approved stand-ins.
- **Steps:** 1. Rehearse CM center evidence, JDM district filters, SDM region review and Super Admin governance discussion. 2. Inspect labels and access claims.
- **Expected result:** Each perspective has an intelligible journey; no login, role switching or enforced role scope is falsely demonstrated. Stakeholder acceptance needs a named sign-off.
- **Coverage:** Manual/UAT; role enforcement is future scope.
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Presentation and end-to-end rehearsal

### TC-DEMO-01

**Executive-to-center-to-target evidence journey**

- **Scenario:** [TS-DEMO-01](test-scenarios.md#ts-demo-01). **Priority:** P0. **Layer:** Browser/manual.
- **Preconditions / data:** F0; compiled demo; preserve fixed snapshot throughout.
- **Steps:** 1. Open executive KPI/directory, then a center detail. 2. Follow a sync target link, inspect evidence, then return to a module overview.
- **Expected result:** Every link resolves with the intended snapshot and real API evidence; no placeholder page or missing target. Existing module E2E tests cover parts; the complete cross-module sequence is an explicit rehearsal.
- **Coverage:** Partial automation; complete linked rehearsal manual. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-DEMO-02

**Reset reproduces baseline and refresh is fixed**

- **Scenario:** [TS-DEMO-01](test-scenarios.md#ts-demo-01). **Priority:** P0. **Layer:** Browser/manual.
- **Preconditions / data:** F0; change scopes and preview policy first.
- **Steps:** 1. Reset each module and reload default routes. 2. Refresh; compare fixture checkpoints with the plan's data oracle.
- **Expected result:** Original counts/cutoff return and unsaved previews disappear. Refresh does not claim a live synchronization or advance the source cutoff.
- **Coverage:** Related browser automation; three-module rehearsal manual. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts), [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-DEMO-03

**Direct route refresh and browser history**

- **Scenario:** [TS-DEMO-01](test-scenarios.md#ts-demo-01). **Priority:** P0. **Layer:** Browser.
- **Preconditions / data:** Compiled local proxy; /centers/center-2 and /synchronization/targets/target-2 with valid query.
- **Steps:** 1. Open each direct URL and refresh. 2. Use in-app Back and browser back/forward; inspect scope and loading.
- **Expected result:** SPA history fallback and built module chunks load; in-app return preserves query. Browser back/forward beyond the explicit E2E in-app path remains a manual extension.
- **Coverage:** Existing direct/refresh/in-app back; full browser-history matrix manual. Evidence: [center-monitoring.spec.ts](../e2e/center-monitoring.spec.ts), [synchronization-monitoring.spec.ts](../e2e/synchronization-monitoring.spec.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-DEMO-04

**Application reachability and controlled failure recovery**

- **Scenario:** [TS-DEMO-01](test-scenarios.md#ts-demo-01). **Priority:** P0. **Layer:** Browser/manual.
- **Preconditions / data:** Isolated test-owned servers or Playwright request interception; no user-owned process disruption.
- **Steps:** 1. Interrupt an intercepted API request, then restore it. 2. Verify liveness and repeat the failing action/retry.
- **Expected result:** The screen gives an actionable error and recovers after restoration; no successful data is fabricated. Database readiness503 is explained separately and is not mistaken for an application outage.
- **Coverage:** Existing request-interception recovery; process-outage rehearsal manual. Evidence: [executive-dashboard.spec.ts](../e2e/executive-dashboard.spec.ts), [app.test.ts](../apps/api/test/app.test.ts).
- **Execution status:** Not run in this documentation delivery; record a new run separately.

### TC-DEMO-05

**Presentation content and claim review**

- **Scenario:** [TS-DEMO-01](test-scenarios.md#ts-demo-01). **Priority:** P1. **Layer:** Manual/review.
- **Preconditions / data:** Stakeholder guide, walkthrough, final summary and known assumptions.
- **Steps:** 1. Check every presentation bookmark, screenshot label and expected count. 2. Search claims about exports, RBAC, real sync, persistent rules and notifications; compare actual code/guide boundary.
- **Expected result:** Documentation links resolve; synthetic cutoff and limitations are visible; future capabilities are identified as planned. No production credentials or real learner PII appear in demo evidence.
- **Coverage:** Manual/documentation review.
- **Execution status:** Not run in this documentation delivery; record a new run separately.

## Future capability gates

### TC-FUT-01

**Real identity and four-role authorization**

- **Scenario:** [TS-FUT-01](test-scenarios.md#ts-fut-01). **Priority:** P1. **Layer:** Future security/integration.
- **Preconditions / data:** Not ready: real identity provider, approved scope matrix and enforcement fixtures.
- **Steps:** 1. Authenticate each role; request allowed/out-of-scope summaries, details and exports directly. 2. Test expired sessions and forged client role/scope inputs.
- **Expected result:** Server-enforced deny-by-default scopes, safe session handling and audit evidence match approved rules. Current public synthetic APIs cannot satisfy this production case.
- **Coverage:** Not ready; future identity/RBAC.
- **Execution status:** Not ready — future implementation gate; not part of the current demo release.

### TC-FUT-02

**Attendance, assessment, completion and certification**

- **Scenario:** [TS-FUT-02](test-scenarios.md#ts-fut-02). **Priority:** P1. **Layer:** Future functional/analytics.
- **Preconditions / data:** Not ready: source-backed learning data and approved eligibility, attempt and certificate rules.
- **Steps:** 1. Compare complete, pending, missing and contradictory learning outcomes. 2. Reconcile learner, batch and geographic denominators.
- **Expected result:** Missing attendance is not absence, pending grading is not failure, completion is independent of certification; approved coverage/denominators reconcile. These modules are not implemented.
- **Coverage:** Not ready; future learning modules.
- **Execution status:** Not ready — future implementation gate; not part of the current demo release.

### TC-FUT-03

**Reports, exports and scheduled recipient access**

- **Scenario:** [TS-FUT-03](test-scenarios.md#ts-fut-03). **Priority:** P1. **Layer:** Future reporting/security.
- **Preconditions / data:** Not ready: report generation, artifact storage, scheduler and authorized recipients.
- **Steps:** 1. Generate all eight designed reports for matching dashboard scope. 2. Export, schedule and revoke recipient access before job execution/artifact retrieval.
- **Expected result:** Dashboard/report snapshot totals reconcile; supported formats render correctly; authorization is rechecked at execution and retrieval; delivery audit is retained.
- **Coverage:** Not ready; future reporting/delivery.
- **Execution status:** Not ready — future implementation gate; not part of the current demo release.

### TC-FUT-04

**Real offline ingestion, retry deduplication and late data**

- **Scenario:** [TS-FUT-04](test-scenarios.md#ts-fut-04). **Priority:** P1. **Layer:** Future integration/data.
- **Preconditions / data:** Not ready: ingestion pipeline, event identities, receipts and publication history.
- **Steps:** 1. Submit duplicate retries, reordered events and late/corrected facts. 2. Publish snapshots and inspect original business periods and receipt lineage.
- **Expected result:** Retries do not inflate learning facts; late corrections follow approved policy; publication/receipt/event timestamps remain distinct and previous snapshots reproducible.
- **Coverage:** Not ready; future ingestion/persistence.
- **Execution status:** Not ready — future implementation gate; not part of the current demo release.

### TC-FUT-05

**Operational alert lifecycle and production qualification**

- **Scenario:** [TS-FUT-05](test-scenarios.md#ts-fut-05). **Priority:** P1. **Layer:** Future operations/security/performance.
- **Preconditions / data:** Not ready: durable incidents, authorized policy changes, delivery workers, production hosting and approved targets.
- **Steps:** 1. Acknowledge/resolve persisted incidents; test deduplication, retry/delivery audit and rule versions. 2. Measure approved load/SLOs, restore backups and execute recovery/accessibility/security assessments.
- **Expected result:** Approved operational lifecycle, retention, recovery and measurable production acceptance are satisfied. Current local preview and request-local evaluator do not establish these results.
- **Coverage:** Not ready; future operations and qualification.
- **Execution status:** Not ready — future implementation gate; not part of the current demo release.
