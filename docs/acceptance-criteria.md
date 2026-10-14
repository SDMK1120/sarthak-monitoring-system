# Sarthak dashboard business acceptance criteria

**Owner:** Business Analyst Agent. **Reviewers:** QA, Product Manager, Analytics, Security, UI/UX. **Status:** Proposed acceptance specification; not executed. **Version:** 0.3. **Date:** 2026-10-14.

These criteria define future observable results for the [user stories](user-stories.md) and [use cases](use-cases.md). They are not passed tests or stakeholder approval. Given/When/Then clauses use synthetic scenarios and agreed policy versions. Unresolved policy dependencies in [assumptions](assumptions.md) block implementation readiness rather than silently selecting business rules.

## Shared criteria for all four roles

| ID | Given | When | Then | Requirements |
| --- | --- | --- | --- | --- |
| AC-C01 | An explicit CM/JDM/SDM/Super Admin assignment and an out-of-scope record | The user requests summaries, details, or reports for that record | In enforced mode the request is denied without exposing its values; in simulation mode scope behavior and role selection are labeled and never claimed as security enforcement. | REQ-001 |
| AC-C02 | A valid monitoring context | The user applies compatible filters and drills down | Scope/filters/period remain visible and consistent; unsupported combinations are explained; role scope is not expanded by a filter. | REQ-002 |
| AC-C03 | Agreed timezone, date basis, and snapshot version | The user reviews stock and flow indicators | Stock counts identify their cutoff and flow counts their event period; historical views without source history are limited/labeled, and receipt time is not substituted for business event time. | REQ-002, REQ-008, REQ-019 |
| AC-C04 | Unknown source values or a zero eligible denominator | A card, chart, table, or preview is rendered | Unknown/unavailable is distinct from zero; no fabricated percentage is shown; coverage and exclusions are explained. | REQ-009–015, REQ-019 |
| AC-C05 | A fixture with stable source-event identity and a valid delayed event | A supplied retry/later-receipt scenario is reviewed | Retries do not inflate totals; late events affect the original business period under the policy; existing previews keep or disclose their cutoff/version. No actual sync engine is implied. | REQ-008, REQ-015, REQ-021–022 |
| AC-C06 | Loading, no assigned scope, no matches, source error, partial/stale observations, or denied access | A critical view enters each applicable state | Each state has an explicit message; failed/unavailable data is not shown as zero or success; available partial values retain coverage notices. | REQ-019 |
| AC-C07 | A critical role journey and agreed design/accessibility targets | The user navigates by keyboard or uses chart/table alternatives | Focus is visible and ordered; controls have meaningful labels; status is not color-only; chart information is available as text/table; content is readable at agreed viewport targets. Conformance requires separate validation. | REQ-020 |
| AC-C08 | Identical authorized scope, filters, period, definitions, and snapshot | The user opens a report preview from any role | Totals reconcile with the dashboard; scope, timezone, cutoff, generation time, coverage, and synthetic-data label appear. Unsupported exports remain preview-only. | REQ-018, REQ-022 |
| AC-C09 | A versioned synthetic scenario and expected-results ledger | A presenter resets and repeats the walkthrough | Stable identifiers, reference dates, and expected totals are restored; no real learner data/production credentials appear; implemented, simulated, and planned actions are distinguishable. | REQ-021–022 |

## CM story criteria

| ID and story | Given | When | Then |
| --- | --- | --- | --- |
| AC-CM-01 / US-CM-01 | Assigned centers with agreed onboarding/status rules and an unknown classification | CM opens center summary and each status drilldown | Distinct counts match their lists; active + inactive + unknown reconciles to onboarded for exclusive statuses at the same cutoff; stale sync does not change classification. |
| AC-CM-02 / US-CM-02 | Assigned centers with multiple scheme memberships and an unassigned mapping | CM groups by category/scheme and selects a group | Centers are distinct within each group; overlap/non-additivity and unassigned coverage are visible; the selected group's list matches its count. |
| AC-CM-03 / US-CM-03 | Batches with source creation dates, eligible seats/capacity, and repeated learner enrollment | CM reviews monthly creation and a batch | Creation uses original month; eligible enrollment and unique learners are separate; utilization shows comparable numerator/denominator and unavailable capacity explicitly. |
| AC-CM-04 / US-CM-04 | Present, absent, and unrecorded eligible session opportunities | CM reviews batch attendance | Counts and recording coverage are visible under the agreed denominator; unrecorded/unsynced opportunities are not classified absent. |
| AC-CM-05 / US-CM-05 | Graded/pending assessments and completed assignments with and without issued certificates | CM inspects outcomes | Attempt-selection and eligibility rules appear; pending is not fail; completion and certification remain independent; restricted detail is not exposed. |
| AC-CM-06 / US-CM-06 | An assigned active center with stale sync and a never-synced device | CM reviews sync observations | Business activity, connectivity, outcome, freshness, and coverage are distinct; never-synced has no invented timestamp or local backlog count. |

## JDM story criteria

| ID and story | Given | When | Then |
| --- | --- | --- | --- |
| AC-JDM-01 / US-JDM-01 | Two assigned districts with different eligible populations and coverage | JDM compares the same period/indicators | Both denominators and coverage are shown; comparisons use equivalent rules; no unexplained score or inference from absent uploads appears. |
| AC-JDM-02 / US-JDM-02 | Assigned district/center mappings and overlapping schemes | JDM drills from district to status or scheme center list | Geography and period persist; distinct center counts reconcile; overlap is labeled; outside-scope centers remain unavailable. |
| AC-JDM-03 / US-JDM-03 | Comparable batches with different capacities plus one missing-capacity batch | JDM reviews aggregate utilization | Utilization uses summed eligible seats/summed capacity over the same comparable batch set; excluded capacity/seat coverage is disclosed; it is not an average of batch percentages. |
| AC-JDM-04 / US-JDM-04 | Comparable batches with pending attendance/grading and distinct certification states | JDM compares participation and outcomes | Eligibility and unknown coverage are displayed; missing attendance is not absent, ungraded is not fail, and completed does not mean certified. |
| AC-JDM-05 / US-JDM-05 | Assigned districts containing healthy, partial, and stale sources | JDM investigates district differences through sync views | Freshness/coverage limitations remain attached to the district finding; sync exceptions do not silently reclassify centers as inactive. |
| AC-JDM-06 / US-JDM-06 | A filtered district finding at a fixed snapshot | JDM opens its management preview | AC-C08 holds; report scope matches JDM assignments and the chosen district context; broader districts and unpermitted details are not exposed. |

## SDM story criteria

| ID and story | Given | When | Then |
| --- | --- | --- | --- |
| AC-SDM-01 / US-SDM-01 | Assigned regions with approved mappings and shared KPI rules | SDM compares regional indicators | Equivalent periods, populations, denominators, and coverage appear; rates aggregate source numerators/denominators rather than averaging district rates. |
| AC-SDM-02 / US-SDM-02 | A region with mapped districts/centers and unmapped source records | SDM drills through geographic levels | Filters/cutoff persist; additive totals reconcile for valid mappings; unmapped/overlapping contributions are explained rather than silently lost. |
| AC-SDM-03 / US-SDM-03 | Region-scoped scheme memberships with overlap | SDM compares category and scheme distribution | Distinct group counts and overlap notices appear; regional overall distinct centers are not replaced by summed scheme memberships. |
| AC-SDM-04 / US-SDM-04 | Original batch creation events and comparable seat/capacity records across assigned areas | SDM reviews trends and utilization | Original-month creation counts reconcile with batches; aggregate utilization uses comparable summed seats/capacity; enrollment and unique learners are separately labeled. |
| AC-SDM-05 / US-SDM-05 | Regional attendance/outcome records with equivalent eligibility and incomplete coverage | SDM compares learning indicators | Definitions and eligible populations are visible, incomplete observations qualify comparisons, and certification is independent of completion. |
| AC-SDM-06 / US-SDM-06 | A regional finding with stale/partial sources at a known cutoff | SDM previews its report | AC-C08 holds; the preview retains source coverage/freshness and explicitly identifies its regional scope and snapshot. |

## Super Admin story criteria

| ID and story | Given | When | Then |
| --- | --- | --- | --- |
| AC-SA-01 / US-SA-01 | Overall center records with active, inactive, unknown, and supported unmapped geography | Super Admin reviews platform coverage | Distinct onboarded/status counts reconcile under the rule; unmapped geography is disclosed; global monitoring does not imply learner-detail rights. |
| AC-SA-02 / US-SA-02 | Multiple categories/schemes with overlap and unassigned memberships | Super Admin opens scheme distribution and lists | Group counts match distinct members; overlap and unassigned records are visible; schemes do not inflate the overall center count. |
| AC-SA-03 / US-SA-03 | Platform batches, original creation timestamps, capacity, and eligible enrollments | Super Admin reviews overall trends and details | Monthly counts and comparable weighted utilization reconcile; enrollments and learners remain separate; missing capacity is disclosed. |
| AC-SA-04 / US-SA-04 | Platform learning observations with unknown attendance, pending grading, and independently sourced certification | Super Admin reviews participation/outcomes | Agreed eligibility and status rules appear; unknown/pending remain separate, zero denominators are unavailable, and completed-but-not-certified remains identifiable. |
| AC-SA-05 / US-SA-05 | Synthetic healthy, never-synced, failed, partial, stale, retry, and late-arrival observations | Super Admin inspects sync/data-quality scenarios | All applicable states are distinguishable; retry counts remain stable; late effects use the policy; unknown local activity/backlog is not invented. |
| AC-SA-06 / US-SA-06 | Supported geography and a fixed platform or selected-area snapshot | Super Admin compares regions/districts and opens a preview | Valid additive totals reconcile across levels; mappings/coverage are explained; AC-C08 holds; report details respect separately approved permissions. |

## Reference examples for future validation

These small synthetic examples illustrate expected arithmetic, not approved source policies or a generated dataset.

- Center classification: with 10 eligible onboarded centers and exclusive statuses of 6 active, 2 inactive, and 2 unknown, the summary is 10 and each drilldown has its stated distinct count. A stale active center remains active under a recorded-status policy.
- Scheme overlap: 3 centers in Scheme A and 2 in Scheme B with 1 shared center means 4 distinct overall centers across those memberships, not 5.
- Capacity: batches with 10 eligible seats/20 capacity and 20 seats/80 capacity give aggregate utilization 30/100 = 30 percent, not the simple average of 50 and 25 percent. A missing-capacity batch is excluded from both comparable numerator and denominator and disclosed separately.
- Enrollment: one synthetic learner eligible in two batches contributes 2 enrollment records and 1 distinct learner at the shared scope.
- Attendance: 12 present, 3 absent, and 5 unrecorded out of 20 eligible opportunities means 15 recorded and 5 unknown. The displayed rate follows the approved denominator policy; it must not silently convert the 5 unknown opportunities to absence.
- Outcomes: 6 completed of 10 eligible course assignments gives 60 percent under that agreed rule. If 4 of those completed assignments have source-issued certificates, the remaining 2 are not automatically certified. A certification rate requires its own approved eligibility denominator.
- Late receipt: a valid batch created in January but received in February remains a January creation; a duplicate delivery changes neither January nor February counts. Existing report snapshots retain/disclose their cutoff.

## Acceptance evidence and readiness

BA maintains story-to-requirement traceability; QA defines later validation cases and independently calculated expected results. Evidence should record story/criterion IDs, scenario and policy versions, scope, filters, period/timezone, snapshot, expected/actual result, outcome, and linked defects. Criteria must be verified for each relevant role rather than relying on a Super Admin-only run.

Business analysis is documentation-complete when all four personas, 24 stories, seven workflows, ten use cases, and their criteria are linked and consistent with REQ-001–022. It does not resolve the outstanding assumptions or prove application acceptance. Final readiness requires stakeholder review of business rules and scopes; future release acceptance additionally requires executed validation evidence.
