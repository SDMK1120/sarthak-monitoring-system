# Sarthak metric calculation definitions

**Owner:** Analytics Agent. **Reviewers:** Business Analyst, Database Architect, Reporting, Solution Architect, Security, QA. **Status:** Proposed calculation policy version 0.1; stakeholder approval pending. **Document version:** 0.6. **Date:** 2026-10-14.

## Shared calculation contract

The [KPI catalogue](analytics-kpis.md) applies these eight definitions at executive, region, district, and block levels. This document selects explicit proposed calculation policies for review; it does not mark A-03–17 resolved or claim live measurements. Every example is invented and hand-calculated, not a dataset, implementation, or test result.

For each calculation establish the organization, currently authorized center population, filters, business period [start, end), evaluation cutoff, reporting timezone, snapshot/receipt cutoff, and metric-definition version. Canonical records are the applicable nonduplicated/non-superseded observations resolved into that snapshot. Source history and approved effective intervals are required for historical stock metrics; otherwise label current/observed state.

Eligibility uses a documented rule and the latest applicable observed version. Known ineligible records are excluded. Unknown eligibility is separately counted, not guessed as eligible or ineligible; a rate over the known-eligible subset is labeled partial eligibility coverage when the broader candidate population is uncertain. If the required population cannot be established at all, show unavailable rather than a denominator of zero.

Zero known denominator yields N/A with reason. Unknown source observations do not become zero or negative outcomes. Display exact integer counts and percentages rounded once to one decimal place using decimal half-up; retain unrounded values for rollup and report parity. Batch utilization can exceed 100 percent. Other ratios require numerator to be a subset of denominator; violations are data-quality errors, not clamped values.

Business occurrence time drives attendance/activity/month grouping. Receipt cutoff determines what the cloud knows. Late events can change earlier periods in a new snapshot. Identical retries contribute once; a valid correction replaces the relevant assertion, retaining lineage. Reports pin the same definitions, scope, and snapshot as the dashboard.

## KPI-01 Active Centers

**Meaning and proposed policy:** Distinct onboarded centers whose applicable center_versions.activity_status is active at the evaluation cutoff. The default is recorded business classification, not a recent-upload or activity-window inference.

**Calculation:** Active Centers = count of distinct center IDs in the authorized, filtered onboarded population with recorded active status. Optional Active Center Share = 100 × Active Centers / Total Onboarded Centers.

**Grain/time:** Center; stock as of cutoff. **Inputs:** centers; center_versions.onboarding_status, onboarded_at, activity_status, valid interval, classification_rule_version; geography/scheme mappings. **Exclusions:** Known not-onboarded centers; outside-scope centers; invalid duplicate identities. Unsupported onboarding/classification is a disclosed unknown population.

**Coverage:** Classifiable Share = 100 × (Active + Inactive) / Onboarded. Center status freshness is displayed separately from sync. An active center may be disconnected or stale.

**Example:** Ten known onboarded centers: six active, two inactive, two unknown. Active Centers = 6; Active Share = 60.0 percent; Classifiable Share = 80.0 percent. Unknown is not treated as inactive.

**Open policy:** A-03/A-04 onboarding and status authority. An alternative activity-window classification requires qualifying event rules, expected reporting cadence, and adequate observation coverage before adoption; no window threshold is invented here.

## KPI-02 Inactive Centers

**Calculation:** Inactive Centers = count of distinct center IDs in the same authorized onboarded population with recorded inactive status. Optional Inactive Center Share = 100 × Inactive Centers / Onboarded.

**Grain/time/inputs:** Same as KPI-01. Unknown Centers = Onboarded − Active − Inactive only if classifications are exclusive/exhaustive under the same snapshot and policy; otherwise compute and expose a reconciliation error. Do not calculate inactive as Onboarded − Active when unknown statuses exist.

**Example:** The ten-center example gives Inactive Centers = 2, Inactive Share = 20.0 percent, and Unknown Centers = 2. A stale active center does not increase inactive count.

**Aggregation:** Deduplicate center IDs before parent rollup. Scheme memberships can overlap, so scheme center totals cannot be blindly summed. **Open policy:** A-03–05.

## KPI-03 Batch Utilization

**Meaning and proposed population:** Occupied eligible seats in planned/running batches at cutoff relative to their approved usable capacity. Completed/cancelled batches are excluded from this default current-capacity view; an explicitly selected historical/cohort variant requires its own policy label.

Let comparable batches be the selected authorized batches with known positive capacity and sufficiently established seat eligibility at the same cutoff. An occupied seat is one nonduplicated enrollment record with applicable active lifecycle and is_eligible = true under the seat policy. Unknown seat eligibility prevents treating that batch's occupancy as complete; exclude it from the comparable rate and disclose its population.

**Calculation:** Batch Utilization % = 100 × sum of occupied eligible seats in comparable batches / sum of approved capacity in those same batches. Per-batch utilization uses that batch's seats/capacity. Missing/zero capacity is N/A, not zero utilization. No comparable batches is N/A.

**Inputs:** batches; batch_versions.lifecycle_status/approved_capacity; enrollments; enrollment_versions.lifecycle_status/is_eligible. **Time/grain:** Batch/enrollment seat; stock at cutoff. **Coverage:** Comparable batch count / selected batch count, excluded seats/batches, unknown capacity/eligibility. Historical capacity uses the applicable version, not today's capacity.

**Example:** Batch A has 10 seats/20 capacity; B has 20/80. Aggregate = 30/100 = 30.0 percent, not the average of 50 and 25 percent. A third batch with missing capacity contributes to neither numerator nor denominator and is disclosed. A batch with 25/20 is 125.0 percent and flagged as overcapacity, not capped.

**Open policy:** A-07/A-08 seat occupation, lifecycle exclusions, transfers/cancellations, and duplicate enrollment handling. Monthly batch creation is a separate flow count by original source creation month, not a filter silently applied to all utilization stocks.

## KPI-04 Attendance %

**Meaning and proposed primary policy:** Confirmed presence against known eligible learner-session opportunities in the selected session period. This is an observed presence proportion, potentially a lower bound on actual attendance while uploads are missing. It does not declare unrecorded opportunities absent.

Let E be known eligible opportunities; P present, A absent, and U unrecorded/unknown observations for those opportunities. Require E = P + A + U after canonical selection. Sessions known cancelled and participation known ineligible are excluded; unknown eligibility is separate coverage. Roster completeness must be stated.

**Calculations:** Attendance % = 100 × P / E. Attendance Recording Coverage % = 100 × (P + A) / E. Observed-only Attendance % = 100 × P / (P + A), displayed only with that distinct label. Possible final presence range, when E is fully known, = [100 × P/E, 100 × (P+U)/E]; it is an uncertainty range, not a forecast.

**Inputs:** learning_sessions and starts_at; session_participations; participation_versions.is_eligible/attendance_status. **Grain/time:** Enrollment-session opportunity; session business time in [start, end), observed by receipt cutoff. **Missing denominator:** Without a trustworthy eligible roster, primary Attendance % and coverage are N/A; an observed-only diagnostic may be shown with denominator limitations.

**Example:** E=20, P=12, A=3, U=5. Attendance % = 60.0; coverage = 75.0; observed-only attendance = 80.0; possible presence range = 60.0–85.0 percent. Five unknown opportunities remain unknown.

**Aggregation/open policy:** Sum eligible opportunities and states, never average batch attendance rates. A-09 must approve this primary convention, session eligibility, cancellation treatment, and roster reconstruction. Any later adoption of observed-only attendance as primary must change the metric version and label.

## KPI-05 Learner Engagement

**Meaning and proposed policy:** A received participation proxy: the share of distinct eligible learners with at least one qualifying business activity during the selected period. It is not minutes studied, lesson consumption, motivation, or a causal learning-outcome measure.

**Eligible population L:** Distinct canonical learners with at least one known eligible, noncancelled enrollment that was active during any part of the period in authorized centers. Historical lifecycle overlap must be supported; unknown dates/eligibility and unresolved cross-source identity are disclosed. A learner with multiple eligible enrollments contributes once.

**Qualifying evidence:** A present attendance observation for an eligible session in the period; a valid assessment attempt with attempted_at in the period; or a newly observed source-confirmed course completion with completed_at in the period. Each signal must belong to an eligible authorized assignment/enrollment. Unknown/invalid attempts and undated events do not qualify. Certificate issuance, synchronization messages, and administrative status changes alone do not qualify.

**Calculation:** Learner Engagement % = 100 × count of distinct learners in L with at least one qualifying received activity / count of L. Include the engaged learner count. Missing signals are “no qualifying activity received,” not proven disengagement. If no trustworthy L exists, show N/A.

**Inputs:** learners, enrollments/enrollment_versions, session observations, assessment_attempts/results where validity is established, course_assignments/completion_versions. **Time:** Signal business occurrence within period; eligible enrollment overlaps period; receipt pinned to snapshot. One learner engaging at two centers is counted once at the parent scope, so child distinct counts may not add.

**Example:** Ten eligible distinct learners; three attend, two have valid attempts, one completes. If those signal sets overlap to five unique learners, engagement = 5/10 = 50.0 percent, not 6/10. Delayed qualifying events can increase a later snapshot's observed engagement for that original period.

**Coverage/open policy:** Show signal families available, undated/unresolved exclusions, enrollment-history coverage, and source freshness. A-25 proposes these signals; A-08 resolves canonical learner identity. Lesson/time-on-task engagement requires additional source contracts and data entities, not invented events from sync logs.

## KPI-06 Course Completion

**Meaning and proposed cohort:** Eligible course assignments created during the selected assignment period, evaluated at the specified outcome cutoff. All-time or alternative cohorts need explicit labels; this metric is not merely the number of completion events occurring during the period.

Let C be distinct eligible assignment IDs in the selected cohort, established under the completion eligibility rule. Let K be the subset with a valid source-confirmed completed status at cutoff. Withdrawn/cancelled assignments are excluded only under the approved rule; unknown eligibility and undated assignment creation are disclosed separately.

**Calculation:** Course Completion % = 100 × count(K) / count(C). Show Completed Assignments and Eligible Assignments. Outcome Coverage % = 100 × known completed/not-completed/in-progress states / count(C); unknown outcomes remain in C when eligibility is known. The received completion rate is provisional while outcomes are incomplete.

**Inputs:** course_assignments.assigned_at; completion_versions.is_eligible/completion_status/completed_at/completion_rule_version; enrollment context. **Grain/time:** Course assignment; assignment cohort with stock outcome at cutoff. Multiple assignments for one learner are separate denominator items.

**Example:** Ten eligible assignments, six completed, two known in progress, two unknown: completion = 60.0 percent and outcome coverage = 80.0 percent. This is not a 60 percent learner-completion claim.

**Aggregation/open policy:** Sum assignment-level eligible/completed populations under consistent cohorts. A-11 approves eligibility and completion authority; A-19 establishes supported history. Revoked/corrected completion affects only publications containing that accepted correction.

## KPI-07 Certification Rate

**Meaning:** Currently source-issued certificates among certification-eligible course assignments in the selected assignment cohort, as of cutoff. Completion is not a substitute for certification eligibility or evidence.

Let Q be distinct assignments with known certification eligibility under the selected rule; let I be the subset whose applicable certification_status is issued and whose source evidence supports issuance by cutoff. Revoked/expired/pending/not-issued statuses are not in I. Known not-eligible assignments are outside Q; unknown eligibility is disclosed separately.

**Calculation:** Certification Rate % = 100 × count(I) / count(Q). Certification Status Coverage % = 100 × assignments in Q with known source-supported certification status / count(Q). Unknown status remains in the known-eligible denominator, making issued evidence provisional. Zero Q is N/A.

**Inputs:** course_assignments.assigned_at; certification_versions.is_eligible/certification_status/issued_at/expires_at; approved status policy. **Grain/time:** Eligible course assignment, same explicitly selected cohort convention as completion when comparing the two. “Ever issued” is a separate optional metric, not this current-status rate.

**Example:** Eight certification-eligible assignments: five currently issued, one pending, one revoked, one unknown. Certification Rate = 62.5 percent; status coverage = 87.5 percent. A completed but source-pending assignment stays pending.

**Open policy:** A-12 eligibility, issuer authority, expiry/revocation meaning, multiple credentials and statuses. If evidence is insufficient to derive current status from an old issuance record, classify it unknown instead of assuming perpetual validity.

An issued status that conflicts with a known revocation or expiry at cutoff is not counted as currently issued. Resolve it under the approved source/status policy or mark it unresolved/unknown; do not let a stale issued label override contrary evidence. A null expiry date alone does not prove perpetual validity.

## KPI-08 Sync Health

**Meaning:** Observed health of expected synchronization targets under a source-specific reporting cadence and processing policy. It is a transparent percentage with components, not a weighted composite score or proof that the cloud contains all local offline activity.

**Expected set T:** Distinct registered device/source targets with valid center mappings in authorized onboarded centers at cutoff, subject to explicit approved reporting expectations/exemptions. Retired devices and known exempt targets are excluded. Unknown device mapping/expected-roster coverage is disclosed; no known expected targets yields N/A, not 100 percent health.

For each target, evaluate required signals received by the pinned cutoff using policy parameters: maximum acceptable success age, pending/processing deadline, permitted source cadence, and required delivery-coverage evidence. These parameters must be set by an approved or visibly synthetic policy; no numeric production defaults are selected.

| Classification | Proposed rule |
| --- | --- |
| Healthy H | Most recent required transfer evidence is successful; trustworthy last success meets cadence; reported delivery expectations reconcile without unresolved/rejected required records; accepted required data is represented in the publication. |
| Degraded D | Known latest failure/partial delivery or unresolved required records; a trustworthy success is older than approved cadence; or known pending/processing evidence exceeds the approved deadline. Known never-successful history past the first required deadline may qualify. |
| Unknown U | Required evidence, timestamp, expectation, or history is missing/ambiguous; pending within its allowed deadline without enough evidence to call healthy; or conflicting signals cannot be resolved. Missing observations alone do not prove failure. |

Apply known degradation before health; remaining insufficient evidence is unknown. Classification must be reproducible from target evidence and policy, with a reason. No available cadence/expectation policy means classification and rate are N/A, with raw observations still available. Device connectivity is shown separately: expected offline operation is not automatically unhealthy.

**Calculations:** Observed Sync Health % = 100 × H / count(T). Degraded Share % = 100 × D / count(T). Unknown Share % = 100 × U / count(T). Classification Coverage % = 100 × (H+D) / count(T), with H+D+U = count(T). Health is conservative while unknown targets remain. Optional Observed Transfer Success % = 100 × successful terminal runs / (successful + partial + failed terminal runs) during the observed transfer period; pending/unknown runs are disclosed separately. This run rate is not target health.

**Inputs:** devices and effective device_center_memberships; sync_runs; matched receipts/applied events/outbox lineage; dataset_snapshots manifest and receipt cutoff; expected-target/cadence rules pinned in metric_definitions.rule_specification. Delivery completeness refers only to the declared source transfer contract. A successful transfer of old data may still have old business observations, which must be shown separately.

**Time/grain:** Expected target at evaluation cutoff for health; run observation period for the optional transfer rate. Deduplicate target and run IDs. New retries can be new run observations but never duplicate learning facts. If source expected counts or publication lineage cannot establish required coverage, the target cannot be silently labeled healthy.

**Example:** Five expected targets: two healthy, two degraded, one unknown. Health = 40.0 percent; degraded = 40.0; unknown = 20.0; classification coverage = 80.0. Illustrative only: under a synthetic 24-hour cadence, a known success aged 30 hours is stale/degraded; no 24-hour policy is approved for production.

**Center rollup/open policy:** A center is healthy only if all its known expected targets are healthy and its expected-roster coverage is complete; any known degraded target makes it degraded; otherwise insufficient evidence makes it unknown. Display center counts separately from target-weighted health. A-14–17/A-26 require source expectation, completeness, cadence, and policy agreement.

## Geography and cross-level calculation

Executive means the overall currently authorized center set. Regional/district/block populations intersect that set with approved effective geographic membership before calculation. The proposed hierarchy is region → district → block → center; direct district mapping remains useful for centers with unknown block. Clusters/divisions are separate operational units, not substitutes for blocks.

Use one applicable center geography at cutoff for this baseline, including period-based activity; label this cutoff-mapping attribution. Historical-at-event attribution is an alternative policy requiring effective mapping history and a separate version. Missing mappings remain in disclosed buckets. No block mapping means no fabricated block result. A-24 must approve mapping and reassignment policy.

Recompute parent ratios from source-grain populations. Learners active in multiple geographic groups are distinct at each group but deduplicated at parent scope. Different eligibility, cohort, timezone, cadence, or definition versions are not comparable without an explicit reconciliation. No implicit score, rank, target, or red/amber/green boundary is defined.

## Validation and publication checks

Review the synthetic examples with BA/Database/QA; verify unknowns, zero denominators, overlapping learners/schemes, excluded capacity, equal source/filter sets, multiple device outcomes, and partial/late/corrected records. Persist policy/definition version, numerator/denominator, exclusions, coverage, snapshot, timezone, and scope in derived results and report metadata. Record accepted policy choices in [assumptions](assumptions.md) and the [governance register](governance/registers.md) before implementation claims.

The calculations above are complete proposed definitions. Policy approval, source availability, executed calculations, and analytics validation remain separate future activities.
