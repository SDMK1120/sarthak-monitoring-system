# Data model and scenario planning brief

**Owner:** Database Architect Agent. **Reviewers:** BA, Analytics, Architect, Security, QA. **Status:** Proposed planning baseline. **Version:** 0.1. **Date:** 2026-10-14.

## Conceptual model

Proposed entities include Organization, Region or Program, Center, User, Role Assignment, Learner, Course, Lesson, Enrollment, Assessment Attempt, Learning Event, Device, Sync Batch/Event, Alert, and Report Snapshot. Validate the hierarchy and required detail during discovery; these are concepts, not a physical schema.

For each retained entity define identity, owner, relationships, grain, business meaning, valid values, timestamps, null meaning, and sensitivity. Analytics and Database jointly establish eligibility and aggregation grain. No actual database or schema code is created in planning.

## Synthetic scenario catalogue

| Scenario | Expected narrative | Validation concern |
| --- | --- | --- |
| Healthy center | Recent observations and successful synchronization | Baseline learning and operational totals agree. |
| Offline device | Local activity may exist without recent cloud receipt | Unknown activity is not counted as zero. |
| Backlog synchronized | Delayed valid events arrive after reconnection | Historical event-date totals update under the policy. |
| Repeated retry | The same source events are delivered again | Counts remain unchanged. |
| Partial/failed batch | Some records are accepted while others fail | Status and coverage accurately indicate incompleteness. |
| Zero eligible population | No eligible assignments match scope | Rates show unavailable rather than divide by zero. |
| Restricted scope | Another region/center is requested | Enforced access denies the query, or simulation is labeled. |

Future fixtures use a fixed reference date, reporting timezone, stable synthetic IDs, versioned snapshot, and documented expected results. If data generation is used, record its seed. Reset restores the same scenario. Never include actual learner records or production credentials.

Define deduplication identity, late-arrival reconciliation, conflict handling, missing references, clock skew, rejected records, and freshness coverage before contract freeze.
