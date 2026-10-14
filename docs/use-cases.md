# Sarthak dashboard system use cases

**Owner:** Business Analyst Agent. **Reviewers:** Solution Architect, Product Manager, Security, QA. **Status:** Proposed business analysis baseline. **Version:** 0.3. **Date:** 2026-10-14.

The system boundary is the monitoring dashboard: scoped summaries, filtering, drilldown, analytics, and report preview. Offline learning activity, source data entry, operational corrections, assessment delivery, certificate issuance, and actual synchronization execution are outside this boundary. The demonstration uses synthetic observations; no live integration is implied.

All cases use agreed metric policies and explicit role assignments. CM, JDM, SDM, and Super Admin are confirmed roles; their proposed scopes are in [personas](user-personas.md). Preconditions that depend on an unresolved policy in [assumptions](assumptions.md) must be agreed before implementation readiness. Use cases describe required behavior, not completed functionality.

## UC-01 Establish authorized monitoring context

**Actors:** CM, JDM, SDM, Super Admin. **Trigger:** Open the dashboard or change review context. **Preconditions:** A role assignment or labeled demonstration role is available. **Inputs:** Role, assigned scope, supported filters, period.

**Main flow:** The system establishes the role context, shows assigned scope, offers compatible filters, and displays period/timezone/cutoff. The user chooses a monitoring view. The system carries the context to summaries and drilldowns.

**Alternates:** No assignments → no-assigned-scope state. No matching records → empty state. Unsupported filters → explain/reset incompatible selection. Forbidden scope → deny when enforcement exists. Simulation → label role selection as a demonstration rather than sign-in.

**Postcondition:** Visible, consistent context; no role change expands access merely through a filter. **Trace:** All stories; WF-01; REQ-001–002; AC-C01–03. **Dependencies:** A-01–02, A-16, A-21.

## UC-02 Review center lifecycle coverage

**Actors:** All four roles within assignments. **Trigger:** Inspect center coverage. **Preconditions:** UC-01 complete; onboarding/classification policy specified. **Inputs:** Scope, cutoff, status filters.

**Main flow:** Show distinct onboarded, active, inactive, and unknown centers. Explain rule and time basis. The user opens a status list and center summary; the system preserves filters and shows freshness separately.

**Alternates:** Unknown classification stays separate. Missing historical status prevents invented as-of classification and is labeled. Stale/offline observations do not automatically change a center's business status.

**Postcondition:** Counts reconcile with contributing center records under the same rule/cutoff. **Trace:** CM-01, JDM-02, SDM-02, SA-01; WF-02; REQ-003–005; respective role criteria. **Dependencies:** A-01–04, A-19.

## UC-03 Review scheme-category and scheme coverage

**Actors:** All four roles within assignments. **Trigger:** Inspect scheme distribution. **Preconditions:** UC-01 complete; scheme taxonomy/membership policy specified. **Inputs:** Category, scheme, scope, valid cutoff.

**Main flow:** Show distinct center counts by category and scheme. The user chooses a group and opens its centers. The system retains geographic context and explains overlap and unassigned mappings.

**Alternates:** No matching memberships → empty group/list. A center in multiple schemes appears once within each relevant distinct group, with non-additivity disclosed. Missing validity history limits historical views.

**Postcondition:** Group-to-list counts agree; overall distinct centers are not misrepresented by summed memberships. **Trace:** CM-02, JDM-02, SDM-03, SA-02; WF-02; REQ-006–007. **Dependencies:** A-05, A-19.

## UC-04 Review batch formation and utilization

**Actors:** All four roles within assignments. **Trigger:** Investigate batch growth or capacity. **Preconditions:** UC-01 complete; batch/enrollment/capacity policies specified. **Inputs:** Period, course/batch, geographic/scheme filters.

**Main flow:** Show batch creation by original creation month, eligible enrollments, distinct learners, capacity, and utilization. The user drills into contributing batches. The system exposes numerator/denominator, exclusions, and aggregate calculation basis.

**Alternates:** Zero/missing capacity → unavailable utilization. Overcapacity → visible value/exception. Late upload → original creation month. Multiple enrollment records → distinct learners remain separate. Missing capacity batches are disclosed rather than silently contributing seats to an incomparable denominator.

**Postcondition:** Batch detail and aggregate results reconcile at the chosen period/cutoff. **Trace:** CM-03, JDM-03, SDM-04, SA-03; WF-03; REQ-008–010. **Dependencies:** A-06–08, A-16, A-19.

## UC-05 Review attendance and recording coverage

**Actors:** All four roles; detailed identities only if permitted. **Trigger:** Investigate participation. **Preconditions:** UC-01 complete; attendance eligibility/denominator policy specified. **Inputs:** Center/batch, session period, source cutoff.

**Main flow:** Show eligible opportunities, present/absent and unrecorded/pending states, and coverage. The user inspects an authorized breakdown. The system explains rate basis and offers related sync observations through UC-07.

**Alternates:** Missing uploads → unknown/unrecorded, not absent. No eligible opportunities → unavailable rate. Unsupported learner detail → scoped aggregate remains available without exposing identities.

**Postcondition:** A participation finding retains its eligibility and observation limits. **Trace:** CM-04, JDM-04, SDM-05, SA-04; WF-04; REQ-011. **Dependencies:** A-09, A-14, A-22.

## UC-06 Review assessment, completion, and certification

**Actors:** All four roles within assignments. **Trigger:** Investigate learning outcomes. **Preconditions:** UC-01 complete; assessment/completion/certification rules specified. **Inputs:** Course/batch/cohort, period/cutoff, supported outcome filters.

**Main flow:** Show assessment eligibility, selected attempts, grading and outcomes. Show completed versus eligible assignments. Show certification source statuses independently. The user inspects authorized contributing records with rule and denominator explanations.

**Alternates:** Ungraded → pending, not fail. Zero eligibility → unavailable rate. Completion without issued certificate → separate statuses. Unsupported certification state → source limitation/unknown, not an invented status.

**Postcondition:** Outcomes reconcile while remaining distinct business facts. **Trace:** CM-05, JDM-04, SDM-05, SA-04; WF-04; REQ-012–014. **Dependencies:** A-10–12, A-19, A-22.

## UC-07 Inspect synchronization and freshness

**Actors:** All four roles within assignments. **Trigger:** Inspect a sync exception or qualify a business finding. **Preconditions:** UC-01 complete; sync observation policy defined. **Inputs:** Center/device scope, outcome filters, snapshot.

**Main flow:** Show observed connectivity, last successful sync, outcome, receipt cutoff, and source freshness separately. The user drills into available observations. In the demonstration, a supplied later snapshot can illustrate backlog receipt or retry effects without executing actual synchronization.

**Alternates:** Never synced → no fabricated last-success timestamp. Partial/failed/stale → distinct notices. Unknown local backlog → no invented pending count. Duplicate retry → unchanged learning totals. Late event → appropriate original business period revision under the policy.

**Postcondition:** The user sees what is observed and what remains unknown; no source records are modified. **Trace:** CM-06, JDM-05, SDM-06, SA-05; WF-05; REQ-015. **Dependencies:** A-14–17.

## UC-08 Compare district performance

**Actors:** JDM, SDM, Super Admin; CM only where explicitly permitted. **Trigger:** Investigate geographic differences. **Preconditions:** UC-01 complete; geography and comparison rules specified. **Inputs:** Authorized districts, equivalent period, shared indicator/filter set.

**Main flow:** Show district indicators with denominator and coverage. The user compares like-for-like metrics and opens contributing centers. The system preserves period/scheme context and shows unmatched mapping records where applicable.

**Alternates:** Incomplete coverage → qualified comparison. Overlapping assignments → deduplicated eligible records/non-additive explanation. Forbidden district → no drilldown or exposed aggregate. Unsupported history → limit comparison rather than invent values.

**Postcondition:** A district comparison is traceable to its population and snapshot, without an unapproved score. **Trace:** JDM-01–02/05, SDM-02, SA-06; WF-06; REQ-016. **Dependencies:** A-01–02, A-13, A-19.

## UC-09 Compare regional performance

**Actors:** SDM and Super Admin; JDM/CM only where explicitly permitted. **Trigger:** Review broader geographic trends. **Preconditions:** UC-01 complete; region/district mappings and comparable metrics specified. **Inputs:** Authorized regions, reporting context.

**Main flow:** Show region indicators and populations. The user selects a region and opens mapped districts through UC-08, then contributing centers where authorized. The system preserves context and explains aggregation and exclusions.

**Alternates:** Unmapped centers → disclosed coverage bucket. Overlapping memberships → explicit non-additivity. No assigned region → no-assigned-scope state. Stale sources → qualified comparison.

**Postcondition:** Additive totals reconcile across region/district/center; rates use aggregate numerator/denominator rather than averages of rates. **Trace:** SDM-01–03/05, SA-06; WF-06; REQ-017. **Dependencies:** A-01–02, A-13, A-19.

## UC-10 Preview a scoped management report

**Actors:** All four roles within report permissions. **Trigger:** Open report preview from a finding or template. **Preconditions:** UC-01 complete; supported report and snapshot available. **Inputs:** Template, authorized filters, period, cutoff/version.

**Main flow:** Confirm scope and filter context. Show preview with matching KPI definitions, totals, period/timezone, cutoff, generation time, coverage, and demo-data label. The user compares it to the source dashboard view.

**Alternates:** Snapshot changed → explain before comparing. Empty/error → explicit state. Restricted scope/detail → deny or omit consistently with agreed policy. Unsupported download → preview-only label; no success claim. Optional implemented export inherits the same scope and definitions.

**Postcondition:** A consistent preview is available; no email, scheduled delivery, or certificate issuance occurs. **Trace:** JDM-06, SDM-06, SA-06 and all roles' shared reporting behavior; WF-07; REQ-018; AC-C08. **Dependencies:** A-20–22.

## Traceability convention

Role story references in this document omit the US prefix for readability; CM-01 means US-CM-01. The canonical story IDs and acceptance mappings are in [user stories](user-stories.md). Every case inherits shared state, accessibility, synthetic-data, and reconciliation criteria AC-C01–09 in [acceptance criteria](acceptance-criteria.md). No use case grants access beyond the future approved role matrix.
