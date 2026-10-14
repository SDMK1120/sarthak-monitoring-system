# Sarthak dashboard product requirements

**Owner:** Business Analyst Agent. **Reviewers:** Product Manager, Analytics, Security, UI/UX, QA. **Status:** Phase 2 requirements baseline; metric and permission policies pending validation. **Version:** 0.2. **Date:** 2026-10-14.

## Product definition

Provide centralized cloud-based monitoring and analytics for Sarthak, an Offline-First LMS. The demonstration must cover every monitoring area below using coherent synthetic records. All requirements are MVP priorities unless explicitly optional. Acceptance criteria define future validation; they are not test results.

## Roles and access

Support CM (Cluster Manager), JDM (Junior Divisional Manager), SDM (Senior Divisional Manager), and Super Admin views. Role names do not alone determine geographic assignments, reporting relationships, or learner-detail privileges. Use explicit role/scope assignments, with proposed responsibilities in [the overview](project-overview.md).

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| REQ-001 | Role-scoped navigation and data | Every role has a reviewable landing view. All summaries, lists, drilldowns, and reports use its assigned scope. Simulated role switching is labeled; actual service-backed authorization, if built, denies out-of-scope requests. |
| REQ-002 | Shared filters and drilldowns | Applicable period, region, district, center, scheme category, scheme, course, and batch filters appear with the active scope. Unsupported combinations are explained. Overview-to-detail navigation preserves relevant filters. |
| REQ-003 | Total onboarded centers | Count distinct centers satisfying the agreed onboarded definition within authorized scope at the selected cutoff. Drilldown contains the same centers; historical counts require onboarding/status history rather than today's list. |
| REQ-004 | Active centers | Show distinct centers classified active under a displayed, versioned business rule. Drilldown agrees with the count. Fresh uploads alone do not silently redefine center activity. |
| REQ-005 | Inactive centers | Show distinct centers classified inactive under the agreed rule. Unknown/unclassified records remain separate; offline or stale observations do not automatically make a center inactive. |
| REQ-006 | Scheme-category-wise centers | Group distinct eligible centers by scheme category. Category filters work; unassigned mappings appear explicitly. Many-to-many membership is labeled so group totals are not falsely presented as additive. |
| REQ-007 | Scheme-wise centers | Show distinct centers per scheme within category and role scope. Scheme-to-center drilldown reconciles with the group count and respects mapping validity dates when available. |
| REQ-008 | Monthly batch creation | Show distinct batches created per calendar month using the source creation timestamp and reporting timezone, not upload month. Delayed receipt can revise the original month's count; cancelled/deleted handling follows the agreed policy. |
| REQ-009 | Batch utilization | Show eligible enrolled seats divided by approved batch capacity at the selected cutoff, with numerator and denominator. Zero/missing capacity yields unavailable; over-capacity values are visible. Aggregate utilization uses summed seats divided by summed comparable capacity, not an average of percentages. |
| REQ-010 | Learner enrollments | Show enrollment records and distinct learners as separate measures. A learner in two batches contributes two eligible enrollments but one distinct learner at the applicable scope. Transfers, cancellations, and period basis follow a documented rule. |
| REQ-011 | Attendance | Show recorded present, absent, and pending/unrecorded attendance with eligible session opportunities and coverage. Any rate uses the agreed eligible learner-session denominator; missing or unsynchronized attendance is not silently marked absent. |
| REQ-012 | Assessments | Show eligible, attempted, graded, pending, pass, and fail observations where source rules permit. Assessment/attempt counts are distinguished; pass rate identifies its attempt-selection rule and valid graded denominator. |
| REQ-013 | Course completion | Show completed and eligible course assignments with the source completion rule. A completion percentage uses eligible assignments, not total learners; unknown or delayed completion remains visible. |
| REQ-014 | Certification status | Show source-issued certificates and applicable pending/not-issued, not-eligible, revoked/expired, or unknown states only when supported. Completion is not treated as proof of certification. Any certification rate states the eligible denominator. |
| REQ-015 | Synchronization status | Display last successful sync, receipt cutoff, outcome, and source freshness. Cover never synced, pending, successful, partial, failed, and stale observations as applicable. Duplicate retries do not inflate learning counts. |
| REQ-016 | District performance | Present a district comparison using the same defined center, batch, enrollment, attendance, outcome, and sync indicators. Show denominators/coverage and permit scoped drilldown; no unexplained composite score or ranking is required. |
| REQ-017 | Regional performance | Aggregate and compare approved regions using consistent definitions and source grain. Region summaries reconcile with contributing districts where geography is additive; unmapped records and overlapping assignments are disclosed. |
| REQ-018 | Scoped report preview | Provide center-network, batch/learning, and geographic/synchronization summaries. Report metadata includes role scope, filters, period, timezone, snapshot cutoff, generation time, coverage, and synthetic-data label. Totals match the dashboard for the same snapshot. Working file exports are optional. |

## Data and calculation requirements

Each metric must define source, grain, stable identifiers, eligibility, numerator/denominator, exclusions, date basis, timezone, cutoff, rounding, missing values, and late-arrival policy. Date-filter behavior must distinguish flow measures (created during a period) from stock measures (state as of a cutoff). Course/enrollment cohort filters must state their meaning.

Use separate occurrence, receipt, processing, and refresh timestamps. Late valid events update the appropriate business period under the agreed policy; retained reports identify their snapshot. Repeated source-event identity must not increase totals. Unknown, zero, and unavailable are distinct values.

Center classifications should reconcile as onboarded = active + inactive + unknown/unclassified when these statuses are mutually exclusive and use the same cutoff. Scheme group totals may exceed distinct overall centers when memberships overlap. Geographic aggregation requires an agreed center-to-district-to-region mapping and handling of unmapped records.

## Experience and quality requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| REQ-019 | Explicit states and freshness | Critical views have applicable loading, empty, error, partial, stale, unknown, and access-denied states. Labels distinguish no records from zero results and incomplete observation. |
| REQ-020 | Accessible, readable presentation | Critical journeys specify keyboard navigation, visible focus, labels, contrast, chart text/table alternatives, and agreed responsive behavior. Accessibility conformance is not claimed before validation. |
| REQ-021 | Safe and repeatable demonstration | Synthetic identities, stable scenario IDs, fixed reference dates, expected totals, and reset instructions support the same walkthrough repeatedly. No real learner data or production credentials are used. |
| REQ-022 | Reconciliation and traceability | Each monitoring requirement links to a screen/section, data scenario, and planned validation case. Hand-calculated expected totals agree with overview, detail, geographic summaries, and report preview for matching filters/cutoffs. |

## Dependencies and outstanding decisions

Source mappings, metric rules, historical data availability, role scopes, activity thresholds, attendance denominator, certification vocabulary, and reporting timezone must be resolved through [assumptions](assumptions.md) before contracts and implementation are frozen. The prototype may simulate unavailable source observations, with visible labels. None of these requirements mandates a framework, database, API implementation, or production integration in this delivery.
