# Sarthak dashboard MVP scope

**Owner:** Product Manager Agent. **Reviewers:** Business Analyst, UI/UX, Solution Architect, QA. **Status:** Proposed implementation scope based on confirmed monitoring requirements. **Version:** 0.2. **Date:** 2026-10-14.

## MVP objective

Deliver a realistic demonstration of centralized monitoring and analytics for the Sarthak Offline-First LMS across CM, JDM, SDM, and Super Admin views. Every user-specified monitoring area is included at summary level with relevant scoped drilldowns. This document defines future construction scope; the current delivery remains documentation only.

## Included capabilities

| MVP area | Included experience | Requirements |
| --- | --- | --- |
| Role views and filtering | Four role views; assigned scope; applicable geographic, scheme, course/batch, and date filters | REQ-001–002 |
| Center network | Total onboarded, active, inactive, unknown classification; center lists; scheme category and scheme breakdowns | REQ-003–007 |
| Batches and enrollment | Monthly creation chart, batch utilization, batch list, enrollments and unique learners | REQ-008–010 |
| Learning participation and outcomes | Attendance coverage, assessment outcomes, course completion, certification status | REQ-011–014 |
| Offline synchronization | Last sync, outcome/freshness, stale/unknown/partial states, explanatory coverage notices | REQ-015 |
| Geographic review | District and region comparisons with shared indicators and drilldowns | REQ-016–017 |
| Reporting | Scoped on-screen report previews with matching totals and metadata | REQ-018 |
| Quality and demonstration | State coverage, accessible interaction criteria, synthetic scenario reset, consistent expected values | REQ-019–022 |

Candidate navigation is Overview, Centers and Schemes, Batches and Learners, Learning Outcomes, Synchronization, Geographic Performance, and Reports. UX can consolidate sections if every included capability remains discoverable.

## Demonstration dataset and journeys

Use synthetic examples spanning multiple scheme categories, schemes, districts, regions, centers, and batches. Include known active/inactive centers, an unclassified center, overlapping scheme memberships, an underutilized batch, missing capacity, attendance awaiting upload, pending assessment grading, completed-but-not-certified enrollment, a late sync backlog, a duplicate retry, and a partial sync failure.

CM reviews assigned centers and batches. JDM compares assigned districts. SDM investigates regional/divisional trends within assigned scope. Super Admin reviews overall coverage by geography and schemes. Exact assignments remain proposed. Each journey ends with a matching report preview and a visible data cutoff.

## Optional after core acceptance

Working CSV/PDF/XLSX downloads, saved filter presets, advanced learner-level exploration, and richer comparative visualizations may follow the core walkthrough. They must not displace any confirmed monitoring area. Actual authentication and service-backed authorization depend on the chosen prototype mode; any simulated controls remain clearly labeled.

## Outside the MVP baseline

Live LMS connectors, a functioning offline sync engine, production ingestion, real learner datasets, operational write workflows, assessment delivery, certificate issuance, external certification verification, automated notifications, scheduled reports, predictive analytics, unexplained composite rankings, production cloud provisioning, and production availability commitments are excluded.

District/regional performance means comparison of defined indicators. It does not require an invented score, league table, or causal explanation.

## MVP exit criteria

All REQ-001–022 have reviewed acceptance coverage. All four role journeys are demonstrable. Counts/rates reconcile for identical scope and snapshot; missing data and synchronization limitations are understandable. Core journeys have no unresolved critical/high defects after future validation. Report previews, scenario reset, known limitations, and a presenter walkthrough are ready.

These are proposed future acceptance criteria, not completed implementation or test results. This documentation phase ends after the five documents and their index are checked.
