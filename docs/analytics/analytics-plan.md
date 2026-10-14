# Analytics planning brief

**Owner:** Analytics Agent. **Reviewers:** BA, Database Architect, Reporting, QA. **Status:** Proposed planning baseline. **Version:** 0.1. **Date:** 2026-10-14.

## Proposed KPI families

Learning indicators include active participation, progress, completion, and assessment outcomes. Operational indicators include observed center/device status, synchronization success/failure, last successful receipt, and freshness coverage. Definitions and eligibility are open until joint BA/Database review.

Each KPI records ID, purpose, owner, source grain, formula in prose, numerator, denominator, eligibility/exclusions, dimensions, reporting period, date basis, timezone, rounding, missing-data behavior, freshness, late-arrival policy, and limitations.

Completion rate may use eligible course assignments, not a count of all learners; assessment pass rate needs a stated attempt-selection rule. A zero denominator produces unavailable. Learning activity uses event date under the agreed policy; synchronization monitoring uses receipt/sync observations. Exact definitions remain proposed.

## Consistency rules

Cloud receipt freshness does not prove every offline device has uploaded its activity. Show source/device freshness separately. Delayed valid events may update their original activity period; exported snapshots retain cutoff/version metadata so revisions can be explained.

Comparisons use equivalent periods and eligibility, with sample sizes and missing coverage visible. Synthetic trends demonstrate behavior and do not establish actual learning outcomes or causal effects.

Future deliverables are the KPI dictionary, dashboard mapping, chart rules, and hand-calculated expected-results matrix. Validate normal, duplicate, missing, late, and corrected records; summaries, drilldowns, and reports must reconcile for identical scope, period, and snapshot.
