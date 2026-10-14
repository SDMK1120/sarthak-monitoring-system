# Sarthak dashboard user stories

**Owner:** Business Analyst Agent. **Reviewers:** Product Manager, UI/UX, Analytics, Security, QA. **Status:** Proposed business analysis baseline. **Version:** 0.3. **Date:** 2026-10-14.

All 24 stories below are core monitoring priorities within the [MVP](mvp-scope.md). They expand [REQ-001–022](product-requirements.md) without adding operational write workflows. Each role uses explicit assignments, not an assumed organizational hierarchy. US-SA denotes Super Admin.

All stories inherit REQ-001–002 and REQ-019–022 and shared criteria AC-C01–09. The requirement column lists additional domain requirements. Acceptance IDs are defined in [acceptance criteria](acceptance-criteria.md), UC IDs in [use cases](use-cases.md), and WF IDs in [business workflows](business-workflows.md). Every journey begins with UC-01/WF-01; every role can use shared UC-10/WF-07 for a report preview under REQ-018.

## CM stories

| Story ID | User story | Requirements | Traceability |
| --- | --- | --- | --- |
| US-CM-01 | As a CM, I want onboarded, active, inactive, and unknown center counts for my assigned scope so that I can identify local center exceptions. | REQ-003–005 | UC-02; WF-02; AC-CM-01 |
| US-CM-02 | As a CM, I want center breakdowns by scheme category and scheme so that I can understand coverage without double-counting overlapping memberships. | REQ-006–007 | UC-03; WF-02; AC-CM-02 |
| US-CM-03 | As a CM, I want monthly batch creation, utilization, enrollments, and unique learners so that I can investigate local capacity and participation. | REQ-008–010 | UC-04; WF-03; AC-CM-03 |
| US-CM-04 | As a CM, I want attendance states and recording coverage by authorized center/batch so that I can distinguish absence from records awaiting upload. | REQ-011 | UC-05; WF-04; AC-CM-04 |
| US-CM-05 | As a CM, I want assessment, completion, and certification status together so that I can investigate learning and certification gaps separately. | REQ-012–014 | UC-06; WF-04; AC-CM-05 |
| US-CM-06 | As a CM, I want sync outcome and source freshness for assigned centers so that I can assess whether local observations are complete enough for review. | REQ-015 | UC-07; WF-05; AC-CM-06 |

## JDM stories

| Story ID | User story | Requirements | Traceability |
| --- | --- | --- | --- |
| US-JDM-01 | As a JDM, I want comparable performance indicators for assigned districts so that I can investigate differences with their denominators and coverage. | REQ-016 | UC-08; WF-06; AC-JDM-01 |
| US-JDM-02 | As a JDM, I want district-to-center drilldowns and scheme breakdowns so that I can explain center-network differences within my scope. | REQ-003–007, REQ-016 | UC-02–03, UC-08; WF-02, WF-06; AC-JDM-02 |
| US-JDM-03 | As a JDM, I want batch growth, weighted utilization, and enrollment across assigned centers so that I can investigate capacity use. | REQ-008–010 | UC-04; WF-03; AC-JDM-03 |
| US-JDM-04 | As a JDM, I want attendance and learning outcomes for comparable batches so that I can investigate participation and certification gaps. | REQ-011–014 | UC-05–06; WF-04; AC-JDM-04 |
| US-JDM-05 | As a JDM, I want synchronization exceptions across assigned locations so that I can identify comparisons affected by stale or incomplete observations. | REQ-015–016 | UC-07–08; WF-05–06; AC-JDM-05 |
| US-JDM-06 | As a JDM, I want a scoped management report preview so that I can share the same district findings and data limitations shown on the dashboard. | REQ-018 | UC-10; WF-07; AC-JDM-06 |

## SDM stories

| Story ID | User story | Requirements | Traceability |
| --- | --- | --- | --- |
| US-SDM-01 | As an SDM, I want comparable regional indicators within my assignments so that I can identify areas needing further investigation. | REQ-017 | UC-09; WF-06; AC-SDM-01 |
| US-SDM-02 | As an SDM, I want region-to-district-to-center drilldowns so that I can understand the contributors to a regional finding. | REQ-003–005, REQ-016–017 | UC-02, UC-08–09; WF-02, WF-06; AC-SDM-02 |
| US-SDM-03 | As an SDM, I want scheme-category and scheme coverage by region so that I can compare distribution with explicit overlap rules. | REQ-006–007, REQ-017 | UC-03, UC-09; WF-02, WF-06; AC-SDM-03 |
| US-SDM-04 | As an SDM, I want monthly batch growth, enrollment, and weighted capacity utilization so that I can review resource use across my scope. | REQ-008–010 | UC-04; WF-03; AC-SDM-04 |
| US-SDM-05 | As an SDM, I want attendance, assessment, completion, and certification comparisons so that I can review outcomes using equivalent populations. | REQ-011–014, REQ-017 | UC-05–06, UC-09; WF-04, WF-06; AC-SDM-05 |
| US-SDM-06 | As an SDM, I want a regional report preview carrying synchronization coverage so that I can communicate findings without losing their evidence limitations. | REQ-015, REQ-018 | UC-07, UC-10; WF-05, WF-07; AC-SDM-06 |

## Super Admin stories

| Story ID | User story | Requirements | Traceability |
| --- | --- | --- | --- |
| US-SA-01 | As a Super Admin, I want overall onboarded, active, inactive, and unknown center counts so that I can understand platform monitoring coverage. | REQ-003–005 | UC-02; WF-02; AC-SA-01 |
| US-SA-02 | As a Super Admin, I want all scheme-category and scheme center breakdowns so that I can investigate overlap and unassigned mappings. | REQ-006–007 | UC-03; WF-02; AC-SA-02 |
| US-SA-03 | As a Super Admin, I want platform-wide monthly batch creation, utilization, and enrollment so that I can review batch and learner coverage. | REQ-008–010 | UC-04; WF-03; AC-SA-03 |
| US-SA-04 | As a Super Admin, I want attendance and learning outcome summaries so that I can demonstrate learning monitoring with separate certification status. | REQ-011–014 | UC-05–06; WF-04; AC-SA-04 |
| US-SA-05 | As a Super Admin, I want synchronization and data-quality exceptions across the platform so that I can identify incomplete observations and duplicate/late-event effects. | REQ-015 | UC-07; WF-05; AC-SA-05 |
| US-SA-06 | As a Super Admin, I want region/district comparisons and matching report previews so that I can explain overall findings with scoped contributing records. | REQ-016–018 | UC-08–10; WF-06–07; AC-SA-06 |

## Dependencies and readiness

Center stories depend on A-01–05; batch/enrollment stories on A-06–08; learning stories on A-09–12; geographic stories on A-01–02 and A-13; synchronization stories on A-14–17; reporting on A-19–22. These references are in [assumptions](assumptions.md).

Before a story is implementation-ready, its metric policy, authorized scope, source or synthetic scenario, screen mapping, and acceptance evidence plan must be agreed. Stories describe future observable behavior, not implemented functionality or passed tests.
