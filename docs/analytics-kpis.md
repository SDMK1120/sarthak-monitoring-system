# Sarthak analytics KPI catalogue

**Owner:** Analytics Agent. **Reviewers:** Business Analyst, Product Manager, Database Architect, Reporting, Security, QA. **Status:** Proposed analytics baseline; policies and targets awaiting review. **Version:** 0.6. **Date:** 2026-10-14.

## Purpose and common definitions

Define executive, regional, district, and block monitoring for Sarthak's centralized dashboard. All views reuse the calculations in [metric definitions](metric-definitions.md). This delivery defines analytics; it does not calculate live results, implement queries, or approve business thresholds.

The four levels are geographic/review contexts, not additional user roles. CM, JDM, SDM, and Super Admin retain explicit access assignments. An executive view does not confer platform-wide access; a regional or block selection never expands the user's permitted center set.

| KPI ID | Indicator | Unit and time basis | Required companion information |
| --- | --- | --- | --- |
| KPI-01 | Active Centers | Distinct centers at cutoff | Onboarded, inactive, unknown counts; classification rule; freshness |
| KPI-02 | Inactive Centers | Distinct centers at cutoff | Onboarded and unknown counts; business status separate from sync |
| KPI-03 | Batch Utilization | Percent occupied eligible seats / comparable capacity at cutoff | Seats, capacity, included batch count, excluded capacity/eligibility, overcapacity |
| KPI-04 | Attendance % | Confirmed present / known eligible session opportunities during period | Present, absent, unrecorded/unknown; attendance recording coverage; observed-only rate |
| KPI-05 | Learner Engagement | Percent distinct eligible learners with qualifying received activity during period | Engaged/eligible counts, qualifying signal types, identity/coverage limitations |
| KPI-06 | Course Completion | Percent completed / eligible course assignments in selected cohort at cutoff | Counts, cohort rule, unknown eligibility/outcomes, source completion policy |
| KPI-07 | Certification Rate | Percent currently issued / certification-eligible assignments in selected cohort at cutoff | Eligibility, issued/pending/revoked/expired/unknown statuses independent of completion |
| KPI-08 | Sync Health | Percent healthy observed targets / expected targets at evaluation cutoff | Healthy, degraded, unknown, expectation/classification coverage, cadence and cutoff |

KPI-04, KPI-05, KPI-06, and KPI-07 can understate actual activity/outcomes when source records have not arrived. They describe confirmed received evidence for the defined population, not proof of absence or failure. KPI-08 describes evidence for declared synchronization targets, not guaranteed knowledge of every local offline event.

## Executive KPIs

**Decision focus:** Overall authorized coverage, capacity use, participation, outcomes, and confidence in observations.

| KPI | Executive interpretation and presentation |
| --- | --- |
| KPI-01–02 | Onboarded/active/inactive/unknown cards and trend snapshots; identify the scale of known center exceptions. |
| KPI-03 | Weighted utilization across comparable batches, with missing-capacity and overcapacity counts; review capacity distribution. |
| KPI-04 | Period attendance with recording coverage; inspect whether participation evidence is sufficient to interpret. |
| KPI-05 | Distinct observed engaged learners and eligible population; describe the received participation proxy. |
| KPI-06 | Eligible-assignment completion by cohort, with unknown outcomes; review outcome progression. |
| KPI-07 | Certification status distribution and eligible rate; separate issuance gaps from completion. |
| KPI-08 | Healthy/degraded/unknown targets and stale/partial/failed observations; identify evidence limitations affecting other KPIs. |

Supporting indicators include distinct onboarded centers; centers by scheme category/scheme; monthly batch creation; eligible enrollments versus distinct learners; assessment attempts, grading and pass results under the selected policy; and geographic mapping coverage. Drilldown follows authorized region → district → block → center where mappings exist.

Super Admin is the proposed broadest monitoring audience; SDM/JDM/CM may see executive-style summaries only for their own assignments. No title implies unrestricted learner-detail or report rights.

## Regional KPIs

**Decision focus:** Compare authorized regions and investigate contributing districts/blocks/centers.

| KPI | Regional interpretation and drilldown |
| --- | --- |
| KPI-01–02 | Regional distinct center classification, district contributions, and unmapped coverage. |
| KPI-03 | Regional summed eligible seats / summed comparable capacity; drill into district and batch exclusions. |
| KPI-04 | Regional eligible-session presence and coverage; compare equal periods and population rules. |
| KPI-05 | Distinct engaged learners across authorized regional enrollments; deduplicate across contributing batches/districts. |
| KPI-06 | Cohort completion from source assignment counts; drill into courses and districts. |
| KPI-07 | Eligible certification outcomes, independent status distribution, and delayed issuance evidence. |
| KPI-08 | Expected target-weighted health and observation coverage, with district/source exceptions. |

Supporting scheme distribution, batch-creation trends, enrollment, and assessments use the same source-grain rules. SDM and Super Admin are proposed audiences; other roles require explicit permission. Regional differences do not establish causes or justify an unapproved composite ranking.

## District KPIs

**Decision focus:** Locate center/batch contributors and distinguish operational exceptions from incomplete uploads.

| KPI | District interpretation and drilldown |
| --- | --- |
| KPI-01–02 | District center network and classified exceptions, with block/center lists. |
| KPI-03 | Comparable district batch utilization; batch capacity, occupancy, and exclusions. |
| KPI-04 | District session attendance and recording coverage by block/center/batch. |
| KPI-05 | Distinct eligible learner participation observed during the period; qualifying activity breakdown. |
| KPI-06 | Eligible course assignment outcomes by block/course/batch, using identical cohort rules. |
| KPI-07 | Eligible certification rate and completed-but-not-certified observations where supported. |
| KPI-08 | Expected target health with block/center details, source cadence, and processing/freshness states. |

JDM is the proposed primary district reviewer; SDM and Super Admin can review permitted districts; CM gets only assigned-center context or separately permitted comparisons. Unmapped blocks remain in a disclosed bucket rather than disappearing from district totals.

## Block KPIs

**Decision focus:** Review the local center network and learning/operational exceptions within an approved block.

| KPI | Block interpretation and drilldown |
| --- | --- |
| KPI-01–02 | Distinct onboarded/status counts and each contributing center. |
| KPI-03 | Local seats/capacity, underutilized/overcapacity batches, and unknown capacity. |
| KPI-04 | Eligible session attendance, missing observations, and source recording coverage. |
| KPI-05 | Local distinct learners with qualifying received activity; no inferred disengagement from missing uploads. |
| KPI-06 | Eligible assignment completion by course/batch with policy and cutoff. |
| KPI-07 | Eligible certificate status by course/batch; issuance stays independent of completion. |
| KPI-08 | Registered expected targets and center/device evidence; offline operation is evaluated against cadence, not penalized automatically. |

CM is a proposed local audience, but a cluster does not automatically equal a block. JDM/SDM/Super Admin see blocks only within their approved assignments. A block is proposed as a geographic area below district, with a center-to-block mapping extension documented in the [dictionary](data-dictionary.md). A-24 requires hierarchy/membership approval. Missing mappings mean unavailable block comparison or an explicit unmapped bucket, not fabricated block membership.

## Rollup and presentation rules

- Authorize the center population before every count, ratio, grouping, drilldown, and report. Overlapping assignments do not duplicate a center or learner identity.
- Recompute rates from aggregated comparable numerators and denominators. Never average region/district/block percentages to produce a parent percentage.
- Distinct learner counts and overlapping scheme memberships are not generally additive. Center-to-geography rollups are additive only for an approved nonoverlapping mapping at the same cutoff.
- Keep unknown geography, capacity, eligibility, status, and source observations visible. Publish coverage alongside rates and show sample sizes before comparing areas.
- Compare identical metric versions, cohorts, periods, timezone, scope meaning, and snapshots/cutoffs. Historical corrections create a new publication rather than silently changing a prior report.
- No numerical target, red/amber/green boundary, ranking weight, minimum sample threshold, or production SLA is approved. Synthetic example thresholds in definitions are illustrative only.

## Calculation and requirement traceability

| KPI | Requirement | Main logical inputs |
| --- | --- | --- |
| KPI-01–02 | REQ-003–005 | centers, center_versions |
| KPI-03 | REQ-008–010 | batches, batch_versions, enrollments, enrollment_versions |
| KPI-04 | REQ-011 | learning_sessions, session_participations, participation_versions |
| KPI-05 | REQ-010–013; proposed participation proxy A-25 | Authorized eligible enrollments plus attendance, attempts, completion observations |
| KPI-06 | REQ-013 | course_assignments, completion_versions |
| KPI-07 | REQ-014 | course_assignments, certification_versions |
| KPI-08 | REQ-015 | devices, device_center_memberships, sync_runs, source_events, event_receipts, publication lineage |
| Geographic grouping | REQ-016–017; requested block extension A-24 | geographic_areas and applicable center mappings |
| Reporting and reproducibility | REQ-018–019, REQ-021–022 | metric_definitions, dataset_snapshots, snapshot_metric_definitions, report_runs |

Block views and the explicit engagement proxy refine the monitoring baseline. Their business meanings remain proposed; they do not create new roles, approve a geographic hierarchy, or implement new LMS activity tracking.

## Analytics acceptance

Each KPI must have numerator/population, denominator where relevant, source grain, eligibility/exclusion policy, period/cutoff, rounding, source coverage, and validation example. All four levels use identical definitions. QA later validates the examples and scope behavior against versioned synthetic fixtures. The present phase checks documentation completeness and links, not executed analytics results.
