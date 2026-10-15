# Complete documentation index

**Review baseline:** 14 October 2026. This index distinguishes working implementation from proposed platform design. For current behavior, prefer the final review, implementation guides and executable source/tests. Earlier phase documents are retained as design/history; their descriptions of future controls are not implementation claims.

## Presentation and current delivery

| Document | Purpose / status |
| --- | --- |
| [Final summary report](final-summary-report.md) | Final review, readiness, verified evidence and remaining limits |
| [Stakeholder demo guide](stakeholder-demo-guide.md) | Reproducible presentation, setup and recovery |
| [Feature walkthrough](feature-walkthrough.md) | Actual screens, navigation, filters and evidence |
| [Architecture summary](architecture-summary.md) | Implemented components, Mermaid flow and runtime boundary |
| [Known assumptions](known-assumptions.md) | Fixed data, metric policies, missing integrations and practical limits |
| [Future roadmap](future-roadmap.md) | Dependency-ordered future outcomes and acceptance gates |
| [Presentation talking points](presentation-talking-points.md) | Slide/screen narrative, role emphasis and honest Q&A |
| [Getting started](getting-started.md) | Workspace, environment, dev/demo commands and troubleshooting |
| [Executive Dashboard](executive-dashboard.md) | Implemented seven dashboard APIs and UI metric semantics |
| [Center Monitoring](center-monitoring.md) | Implemented directory, details, activity analysis and four APIs |
| [Synchronization Monitoring](synchronization-monitoring.md) | Implemented target health, alerts, previews and six APIs |
| [Repository overview](../README.md) / [documentation entry](README.md) | Starting links and current project scope |
| [Chat session exports](chat-exports/README.md) | Recorded user/assistant conversation snapshots; historical content rather than current implementation instructions |

## Test planning and verification

- [Test plan](test-plan.md): strategy, scope, fixtures, environments, entry/exit and execution reporting.
- [Test scenarios](test-scenarios.md): 23 scenario definitions, including future implementation gates.
- [Detailed test cases](test-cases.md): 77 reproducible definitions and links to existing automated assertions or documented manual/partial gaps.
- [Historical validation brief](qa/validation-plan.md): original planning context.

Definitions are not passing execution records; historical test counts and a fresh build's observed results must be reported separately.

## Product and business requirements

- [Project overview](project-overview.md), [business goals](business-goals.md), [product requirements](product-requirements.md), [MVP scope](mvp-scope.md), [business assumptions](assumptions.md).
- [User personas](user-personas.md), [user stories](user-stories.md), [acceptance criteria](acceptance-criteria.md), [business workflows](business-workflows.md), [use cases](use-cases.md).

These documents describe the broader platform and four proposed roles. The final walkthrough identifies the implemented subset; unimplemented learning/reporting/identity criteria have not been verified by current tests.

## Architecture, data, services and security design

- [System architecture](system-architecture.md), [high-level design](high-level-design.md), [module breakdown](module-breakdown.md), [technical decisions](technical-decisions.md).
- [Database design](database-design.md), [entity relationships](entity-relationship-model.md), [data dictionary](data-dictionary.md).
- [API specification](api-specification.md), [service design](service-design.md), [security and RBAC](security-rbac.md).

The database schema, 44-endpoint platform proposal, cloud architecture and RBAC/session controls remain design artifacts. The current implementation has 17 business route patterns and two health patterns; it does not implement the entire proposed API catalogue.

## Analytics, reporting and experience design

- [Analytics KPI catalogue](analytics-kpis.md), [metric definitions](metric-definitions.md).
- [Reporting strategy](reporting-strategy.md): eight proposed reports, exports and schedules.
- [Dashboard page design](dashboard-pages.md), [user flows](user-flows.md), [UI strategy](ui-strategy.md), [wireframe descriptions](wireframe-description.md).

Current analytics use approved-for-demo synthetic policies only. Dedicated learning modules, the eight-page design, reports and administration remain broader targets rather than completed screens.

## Team, execution and initial planning

| Area | Documents |
| --- | --- |
| Overall execution | [Project plan](project-plan.md), [agent charters](agents/agent-charters.md) |
| Repository-local agents | [Team catalogue](../agents/README.md), [workflow](../agents/workflow.md), [execution history](../agents/execution-history.md), [task template](../agents/task-template.md), [project instructions](../AGENTS.md) |
| Governance | [Workflow](governance/workflow.md), [phase plan](governance/phase-plan.md), [registers](governance/registers.md) |
| Documentation | [Documentation strategy](documentation/strategy.md) |
| Product/requirements | [Product brief](product/product-brief.md), [requirements plan](requirements/requirements-plan.md) |
| Architecture/UX/data | [Architecture plan](architecture/architecture-plan.md), [decision records](architecture/decisions/README.md), [design plan](ux/design-plan.md), [data plan](data/data-plan.md) |
| Implementation disciplines | [Backend plan](backend/backend-plan.md), [frontend plan](frontend/frontend-plan.md), [analytics plan](analytics/analytics-plan.md), [reporting plan](reporting/reporting-plan.md) |
| Qualification/delivery | [Security plan](security/security-plan.md), [validation plan](qa/validation-plan.md), [delivery plan](devops/delivery-plan.md) |

Planning records define responsibilities and dependencies; their existence does not establish completion. Backend, Frontend and independent QA agents contributed to the implemented modules and final review, with the orchestrator coordinating integration and final reporting.
