# Test scenario catalogue

**Owner:** QA Agent. **Reviewers:** Business Analyst, Analytics and Product Manager. **Version:** 1.0. **Created:** 2026-10-15.

A scenario describes an end-to-end or business risk; its linked test cases contain reproducible data, steps and expected results. This catalogue contains **23 scenarios**: 18 for current delivery and five future gates. None is marked passed merely because it is documented.

Read the [test plan](test-plan.md) for scope, environment and execution rules. The current application has no real role login/RBAC, learning-outcome modules, report exports, persisted incidents or ingestion service.

## Scenario index

| Scenario | Objective | Current readiness | Cases |
| --- | --- | --- | --- |
| [TS-ENV-01](#ts-env-01) | Environment, build and local presentation readiness | Current | TC-ENV-01, TC-ENV-02, TC-ENV-03, TC-ENV-04, TC-ENV-05, TC-ENV-06, TC-ENV-07 |
| [TS-API-01](#ts-api-01) | Safe API rejection and error behavior | Current | TC-API-01, TC-API-02, TC-API-03, TC-API-04 |
| [TS-API-02](#ts-api-02) | Transport contracts and cancellation | Current | TC-API-05, TC-API-06 |
| [TS-EX-01](#ts-ex-01) | Executive center/scheme scope | Current | TC-EX-01, TC-EX-02, TC-EX-03, TC-EX-04 |
| [TS-EX-02](#ts-ex-02) | Batch flows and weighted current stock | Current | TC-EX-05, TC-EX-06, TC-EX-07, TC-EX-08, TC-EX-09 |
| [TS-EX-03](#ts-ex-03) | Time windows, history and publication | Current | TC-EX-10, TC-EX-11, TC-EX-12 |
| [TS-CTR-01](#ts-ctr-01) | Center listing, search, sort and pagination | Current | TC-CTR-01, TC-CTR-02, TC-CTR-03, TC-CTR-04 |
| [TS-CTR-02](#ts-ctr-02) | Activity and geographic drilldowns | Current | TC-CTR-05, TC-CTR-06, TC-CTR-07, TC-CTR-08 |
| [TS-CTR-03](#ts-ctr-03) | Center detail and return context | Current | TC-CTR-09, TC-CTR-10, TC-CTR-11, TC-CTR-12 |
| [TS-SYNC-01](#ts-sync-01) | Expected-roster health and evidence policy | Current | TC-SYNC-01, TC-SYNC-02, TC-SYNC-03 |
| [TS-SYNC-02](#ts-sync-02) | Failed transfers and scoped target listing | Current | TC-SYNC-04, TC-SYNC-05, TC-SYNC-06 |
| [TS-SYNC-03](#ts-sync-03) | Exact timestamps and target drilldowns | Current | TC-SYNC-07, TC-SYNC-08, TC-SYNC-09 |
| [TS-SYNC-04](#ts-sync-04) | Primary alerts and actionable evidence | Current | TC-SYNC-10, TC-SYNC-11, TC-SYNC-12 |
| [TS-ALR-01](#ts-alr-01) | Escalation age and recipient policy | Current | TC-ALR-01, TC-ALR-02, TC-ALR-03, TC-ALR-04 |
| [TS-ALR-02](#ts-alr-02) | Request-local editable rule evaluation | Current | TC-ALR-05, TC-ALR-06, TC-ALR-07, TC-ALR-08, TC-ALR-09, TC-ALR-10 |
| [TS-UX-01](#ts-ux-01) | Loading, failure, empty and race conditions | Current | TC-UX-01, TC-UX-02, TC-UX-03, TC-UX-04 |
| [TS-UX-02](#ts-ux-02) | Accessibility, viewport/browser and stakeholder journeys | Current | TC-UX-05, TC-UX-06, TC-UX-07, TC-UX-08 |
| [TS-DEMO-01](#ts-demo-01) | Stakeholder rehearsal and repeatability | Current | TC-DEMO-01, TC-DEMO-02, TC-DEMO-03, TC-DEMO-04, TC-DEMO-05 |
| [TS-FUT-01](#ts-fut-01) | Identity and enforced role authorization | Future gate | TC-FUT-01 |
| [TS-FUT-02](#ts-fut-02) | Source-backed learning analytics | Future gate | TC-FUT-02 |
| [TS-FUT-03](#ts-fut-03) | Reports, exports and schedules | Future gate | TC-FUT-03 |
| [TS-FUT-04](#ts-fut-04) | Real ingestion and delayed/duplicate evidence | Future gate | TC-FUT-04 |
| [TS-FUT-05](#ts-fut-05) | Operational lifecycle and production qualification | Future gate | TC-FUT-05 |

### TS-ENV-01

**Environment, build and local presentation readiness**

- **Objective:** Check repeatable setup, independent database readiness, configuration safety and owned server lifecycle.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C06, AC-C09. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-ENV-01](test-cases.md#tc-env-01), [TC-ENV-02](test-cases.md#tc-env-02), [TC-ENV-03](test-cases.md#tc-env-03), [TC-ENV-04](test-cases.md#tc-env-04), [TC-ENV-05](test-cases.md#tc-env-05), [TC-ENV-06](test-cases.md#tc-env-06), [TC-ENV-07](test-cases.md#tc-env-07).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-API-01

**Safe API rejection and error behavior**

- **Objective:** Reject invalid/malformed/oversized requests and unavailable resources with safe, correlated errors.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C02, AC-C06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-API-01](test-cases.md#tc-api-01), [TC-API-02](test-cases.md#tc-api-02), [TC-API-03](test-cases.md#tc-api-03), [TC-API-04](test-cases.md#tc-api-04).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-API-02

**Transport contracts and cancellation**

- **Objective:** Validate response envelopes/data and prevent invalid or obsolete responses from becoming displayed metrics.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C03, AC-C06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-API-05](test-cases.md#tc-api-05), [TC-API-06](test-cases.md#tc-api-06).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-EX-01

**Executive center/scheme scope**

- **Objective:** Reconcile center partitions and nonadditive memberships under applied filter intersections.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-CM-01, AC-CM-02, AC-C02. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-EX-01](test-cases.md#tc-ex-01), [TC-EX-02](test-cases.md#tc-ex-02), [TC-EX-03](test-cases.md#tc-ex-03), [TC-EX-04](test-cases.md#tc-ex-04).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-EX-02

**Batch flows and weighted current stock**

- **Objective:** Verify creation-cohort counts, weighted capacity, exclusions, null denominators and lifecycle inclusion.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-CM-03, AC-JDM-03, AC-C03, AC-C04. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-EX-05](test-cases.md#tc-ex-05), [TC-EX-06](test-cases.md#tc-ex-06), [TC-EX-07](test-cases.md#tc-ex-07), [TC-EX-08](test-cases.md#tc-ex-08), [TC-EX-09](test-cases.md#tc-ex-09).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-EX-03

**Time windows, history and publication**

- **Objective:** Preserve real paired month boundaries, history-at-cutoff and explicit publication consistency.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C03, AC-C09. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-EX-10](test-cases.md#tc-ex-10), [TC-EX-11](test-cases.md#tc-ex-11), [TC-EX-12](test-cases.md#tc-ex-12).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-CTR-01

**Center listing, search, sort and pagination**

- **Objective:** List the complete center population deterministically and recover from invalid/out-of-range context.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C02, AC-C06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-CTR-01](test-cases.md#tc-ctr-01), [TC-CTR-02](test-cases.md#tc-ctr-02), [TC-CTR-03](test-cases.md#tc-ctr-03), [TC-CTR-04](test-cases.md#tc-ctr-04).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-CTR-02

**Activity and geographic drilldowns**

- **Objective:** Keep comparison scope independent of the selected activity status while applying geography/scheme/search.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-CM-01, AC-JDM-02, AC-C02. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-CTR-05](test-cases.md#tc-ctr-05), [TC-CTR-06](test-cases.md#tc-ctr-06), [TC-CTR-07](test-cases.md#tc-ctr-07), [TC-CTR-08](test-cases.md#tc-ctr-08).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-CTR-03

**Center detail and return context**

- **Objective:** Trace profile/history/batches/targets, reconcile fact attribution and preserve listing context.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-CM-03, AC-CM-06, AC-C03. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-CTR-09](test-cases.md#tc-ctr-09), [TC-CTR-10](test-cases.md#tc-ctr-10), [TC-CTR-11](test-cases.md#tc-ctr-11), [TC-CTR-12](test-cases.md#tc-ctr-12).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-SYNC-01

**Expected-roster health and evidence policy**

- **Objective:** Reconcile target H/D/U while keeping activity/connectivity distinct from health.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-CM-06, AC-C03, AC-C04. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-SYNC-01](test-cases.md#tc-sync-01), [TC-SYNC-02](test-cases.md#tc-sync-02), [TC-SYNC-03](test-cases.md#tc-sync-03).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-SYNC-02

**Failed transfers and scoped target listing**

- **Objective:** Distinguish latest transfer outcomes from degraded health and apply deterministic bounded target queries.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C02, AC-CM-06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-SYNC-04](test-cases.md#tc-sync-04), [TC-SYNC-05](test-cases.md#tc-sync-05), [TC-SYNC-06](test-cases.md#tc-sync-06).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-SYNC-03

**Exact timestamps and target drilldowns**

- **Objective:** Preserve full observation/last-success evidence, missing values and return publication context.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-CM-06, AC-C03, AC-C06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-SYNC-07](test-cases.md#tc-sync-07), [TC-SYNC-08](test-cases.md#tc-sync-08), [TC-SYNC-09](test-cases.md#tc-sync-09).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-SYNC-04

**Primary alerts and actionable evidence**

- **Objective:** Deduplicate alerts by target and keep missing evidence informational with clearly scoped counts.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** Synchronization implementation guide; AC-C04, AC-CM-06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-SYNC-10](test-cases.md#tc-sync-10), [TC-SYNC-11](test-cases.md#tc-sync-11), [TC-SYNC-12](test-cases.md#tc-sync-12).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-ALR-01

**Escalation age and recipient policy**

- **Objective:** Verify exact inclusive role thresholds against the published reference age, without inferred outage duration.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** Synchronization implementation guide; AC-C03, AC-C04. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-ALR-01](test-cases.md#tc-alr-01), [TC-ALR-02](test-cases.md#tc-alr-02), [TC-ALR-03](test-cases.md#tc-alr-03), [TC-ALR-04](test-cases.md#tc-alr-04).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-ALR-02

**Request-local editable rule evaluation**

- **Objective:** Validate custom rules, retain default source/policy, and handle preview paging/reset/cancellation.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** Synchronization implementation guide; AC-C06, AC-C09. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-ALR-05](test-cases.md#tc-alr-05), [TC-ALR-06](test-cases.md#tc-alr-06), [TC-ALR-07](test-cases.md#tc-alr-07), [TC-ALR-08](test-cases.md#tc-alr-08), [TC-ALR-09](test-cases.md#tc-alr-09), [TC-ALR-10](test-cases.md#tc-alr-10).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-UX-01

**Loading, failure, empty and race conditions**

- **Objective:** Present each request state honestly and publish only the latest consistent context.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-UX-01](test-cases.md#tc-ux-01), [TC-UX-02](test-cases.md#tc-ux-02), [TC-UX-03](test-cases.md#tc-ux-03), [TC-UX-04](test-cases.md#tc-ux-04).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-UX-02

**Accessibility, viewport/browser and stakeholder journeys**

- **Objective:** Check keyboard/text alternatives and perform browser/UAT work beyond existing Chromium assertions.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C07; proposed role personas. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-UX-05](test-cases.md#tc-ux-05), [TC-UX-06](test-cases.md#tc-ux-06), [TC-UX-07](test-cases.md#tc-ux-07), [TC-UX-08](test-cases.md#tc-ux-08).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-DEMO-01

**Stakeholder rehearsal and repeatability**

- **Objective:** Rehearse linked evidence, direct URLs, reset, controlled recovery and accurate capability claims.
- **Scope/readiness:** Current prototype; manual and partially automated checks still require their own execution evidence.
- **Requirement/design trace:** AC-C09, AC-C02, AC-C06. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** Use F0 and the applicable isolated injection dataset in the test plan. Follow each case's specific preconditions.
- **Test cases:** [TC-DEMO-01](test-cases.md#tc-demo-01), [TC-DEMO-02](test-cases.md#tc-demo-02), [TC-DEMO-03](test-cases.md#tc-demo-03), [TC-DEMO-04](test-cases.md#tc-demo-04), [TC-DEMO-05](test-cases.md#tc-demo-05).
- **Completion:** Every applicable case/parameter row has a recorded result and evidence; failures are triaged against the plan's exit criteria.

### TS-FUT-01

**Identity and enforced role authorization**

- **Objective:** Validate real CM/JDM/SDM/Super Admin scope and sessions only after those controls exist.
- **Scope/readiness:** Not ready until the stated platform capability and approved rules exist.
- **Requirement/design trace:** AC-C01, REQ-001. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** See the linked future case's implementation prerequisites; the current synthetic UI cannot prove this scenario.
- **Test cases:** [TC-FUT-01](test-cases.md#tc-fut-01).
- **Completion:** Keep excluded from the demo pass rate; activate only when its implementation gate is accepted.

### TS-FUT-02

**Source-backed learning analytics**

- **Objective:** Validate attendance/assessment/completion/certification with approved eligibility and real evidence.
- **Scope/readiness:** Not ready until the stated platform capability and approved rules exist.
- **Requirement/design trace:** AC-CM-04, AC-CM-05. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** See the linked future case's implementation prerequisites; the current synthetic UI cannot prove this scenario.
- **Test cases:** [TC-FUT-02](test-cases.md#tc-fut-02).
- **Completion:** Keep excluded from the demo pass rate; activate only when its implementation gate is accepted.

### TS-FUT-03

**Reports, exports and schedules**

- **Objective:** Reconcile all report outputs and recheck recipient/artifact authority.
- **Scope/readiness:** Not ready until the stated platform capability and approved rules exist.
- **Requirement/design trace:** AC-C08; reporting strategy. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** See the linked future case's implementation prerequisites; the current synthetic UI cannot prove this scenario.
- **Test cases:** [TC-FUT-03](test-cases.md#tc-fut-03).
- **Completion:** Keep excluded from the demo pass rate; activate only when its implementation gate is accepted.

### TS-FUT-04

**Real ingestion and delayed/duplicate evidence**

- **Objective:** Validate receipt lineage, deduplication, late arrivals and reproducible publications.
- **Scope/readiness:** Not ready until the stated platform capability and approved rules exist.
- **Requirement/design trace:** AC-C05. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** See the linked future case's implementation prerequisites; the current synthetic UI cannot prove this scenario.
- **Test cases:** [TC-FUT-04](test-cases.md#tc-fut-04).
- **Completion:** Keep excluded from the demo pass rate; activate only when its implementation gate is accepted.

### TS-FUT-05

**Operational lifecycle and production qualification**

- **Objective:** Qualify persisted incidents, notifications, measurable operation, recovery and audit.
- **Scope/readiness:** Not ready until the stated platform capability and approved rules exist.
- **Requirement/design trace:** Architecture/security/roadmap; not a current feature acceptance claim. References identify related intent, not complete satisfaction of the broader proposed criteria.
- **Entry/data:** See the linked future case's implementation prerequisites; the current synthetic UI cannot prove this scenario.
- **Test cases:** [TC-FUT-05](test-cases.md#tc-fut-05).
- **Completion:** Keep excluded from the demo pass rate; activate only when its implementation gate is accepted.
