# Project documentation

This documentation includes planning/design records and implemented prototype guides. The final review and module implementation guides describe current behavior; earlier design packages describe the broader target platform. The selected stack is React/TypeScript/Vite/Tailwind, Fastify/TypeScript and PostgreSQL configuration. Production role assignments, metric policies and operational thresholds remain open.

## Stakeholder presentation and final review

1. [Final summary report](final-summary-report.md)
2. [Stakeholder demo guide](stakeholder-demo-guide.md)
3. [Feature walkthrough](feature-walkthrough.md)
4. [Implemented architecture summary](architecture-summary.md)
5. [Complete documentation index](documentation-index.md)
6. [Future roadmap](future-roadmap.md)
7. [Known assumptions](known-assumptions.md)
8. [Presentation talking points](presentation-talking-points.md)

Start here for a reproducible presentation, evidence-backed capability status, technical architecture and the decisions needed for the next stage.

## Test documentation

1. [Test plan](test-plan.md): scope, environments, independent fixture oracles, strategy, entry/exit criteria, ownership and execution records.
2. [Test scenarios](test-scenarios.md): 23 scenarios spanning current monitoring and five future gates.
3. [Detailed test cases](test-cases.md): 77 definitions with data, steps, expected results, priorities and existing-automation references.

The original [validation brief](qa/validation-plan.md) is historical. Case definitions and automation references are distinct from current execution/pass evidence.

## Repository-local agent catalogue

The [local agent catalogue](../agents/README.md) contains the orchestrator, all 13 specialist roles, native Codex definitions, dependencies, task/handoff templates and historical delivery aliases. [AGENTS.md](../AGENTS.md) supplies shared repository instructions. These reusable definitions do not start background agents or imply that every role executed every phase.

## Phase 2 business and product documentation

1. [Project overview](project-overview.md)
2. [Business goals](business-goals.md)
3. [Product requirements](product-requirements.md)
4. [MVP scope](mvp-scope.md)
5. [Assumptions and open decisions](assumptions.md)

This delivery follows the user's Phase 2 documentation request. It does not claim completion of the earlier proposed architecture/data-design phase or authorize implementation.

## Business analysis documentation

1. [User personas](user-personas.md)
2. [User stories and requirement traceability](user-stories.md)
3. [Business workflows](business-workflows.md)
4. [System use cases](use-cases.md)
5. [Acceptance criteria](acceptance-criteria.md)

The business analysis package covers CM, JDM, SDM, and Super Admin with proposed scope assignments, testable behavior, and offline-data exception paths. Business rules and permissions that remain open are tracked in [assumptions](assumptions.md). All outputs are documentation; validation criteria have not been executed.

## Architecture documentation

1. [System architecture and low-level design](system-architecture.md)
2. [High-level design, scalability, and cloud deployment](high-level-design.md)
3. [System components and module breakdown](module-breakdown.md)
4. [Technical decisions and unresolved choices](technical-decisions.md)

The architecture package covers data flow, synchronization monitoring, authentication, RBAC, scalability, and deployment boundaries. Mermaid diagrams describe logical designs. Demonstration and future production components are distinguished; no services, integrations, authentication controls, or cloud resources are implemented by this delivery.

## Database design documentation

1. [Database schema, entity inventory, indexing, and audit strategy](database-design.md)
2. [Entity relationships and Mermaid ER diagrams](entity-relationship-model.md)
3. [Field-level data dictionary](data-dictionary.md)

The database design covers all requested modules, with additional geographic, course-completion, certification, and scope-assignment support. Logical types, constraints, and history rules are documented; no SQL, migrations, database resources, or physical engine selection are included.

## Analytics documentation

1. [Executive, regional, district, and block KPI catalogue](analytics-kpis.md)
2. [Metric calculations and coverage policies](metric-definitions.md)

The analytics package defines eight shared KPIs with calculations, denominators, exclusions, time bases, rollups, and synthetic examples. Block mappings, engagement signals, cadence, and business thresholds remain proposed policies. No queries or live analytics are implemented.

## Reporting documentation

[Reporting strategy](reporting-strategy.md) defines the eight required reports, report-specific filters and drilldowns, candidate export formats, and future scheduled-reporting behavior. Schedules, exports, delivery channels, and recipient authorization are documented proposals; no reporting jobs or communications are created.

## UI and UX design documentation

1. [Dashboard pages and role-specific experience](dashboard-pages.md)
2. [User flows](user-flows.md)
3. [UI strategy](ui-strategy.md)
4. [Textual wireframe descriptions](wireframe-description.md)

The design package covers all four roles and all eight requested pages, including navigation, layout, widgets, charts, filters, responsive behavior, and user flows. User Management and policy settings are proposed design extensions requiring explicit permissions. These are documentation artifacts; no React, rendered UI, or working administrative controls are generated.

## Backend design documentation

1. [API specification](api-specification.md)
2. [Backend service design](service-design.md)

The backend package defines 44 proposed endpoints across authentication, users, centers, batches, analytics, reporting, and synchronization, with request/response, validation, and authorization contracts. Service boundaries cover scoped queries, identity, transactions, reporting, and future source ingestion. No routes, backend code, schemas, or integrations are implemented.

## Security documentation

[Security strategy and RBAC](security-rbac.md) defines authentication, authorization, the four-role capability matrix, sessions, audit logging, API protection, and data security. Role bindings, privileged controls, session targets, and operational policies remain proposals; no identity, grants, encryption resources, or security tests are implemented by the document.

## Synchronization Monitoring implementation

[Synchronization Monitoring](synchronization-monitoring.md) documents target health, failed-transfer monitoring, exact timestamps, alerts, request-local escalation previews, six API endpoints and verification. It shares the existing synthetic source roster and snapshot.

## Center Monitoring implementation

[Center Monitoring](center-monitoring.md) documents the implemented directory, details, activity comparison, filters and drilldowns, plus four center APIs and verification. The module shares the Executive Dashboard's synthetic repository and snapshot.

## Executive Dashboard implementation

[Executive Dashboard — Phase 2](executive-dashboard.md) documents the implemented seven read-only dashboard APIs, React widgets/charts, scope filters, fixed synthetic snapshot, metric denominators and active backend/frontend/QA agent assignments. The dashboard works without PostgreSQL; authentication, RBAC and source ingestion remain planned. Earlier design packages describe the broader target platform rather than implemented behavior.

## Implementation foundation

[Setup and development](getting-started.md) documents the Phase 1 foundation and Phase 2 dashboard, npm workspaces, environment setup, health routes, logging, errors and verification. React/TypeScript/Vite/Tailwind, Fastify/TypeScript and PostgreSQL are selected by the user. Broader platform modules and the earlier authentication, RBAC and reporting contracts remain planned.

## Initial planning reading order

1. [Overall project plan](project-plan.md)
2. [Agent charters](agents/agent-charters.md)
3. [Dependencies and workflow](governance/workflow.md)
4. [Phase execution plan](governance/phase-plan.md)
5. [Decisions risks and assumptions](governance/registers.md)
6. [Documentation strategy](documentation/strategy.md)

## Folder structure

```text
docs/
  README.md
  project-plan.md
  project-overview.md
  business-goals.md
  product-requirements.md
  mvp-scope.md
  assumptions.md
  user-personas.md
  user-stories.md
  business-workflows.md
  acceptance-criteria.md
  use-cases.md
  system-architecture.md
  high-level-design.md
  module-breakdown.md
  technical-decisions.md
  database-design.md
  entity-relationship-model.md
  data-dictionary.md
  analytics-kpis.md
  metric-definitions.md
  reporting-strategy.md
  dashboard-pages.md
  user-flows.md
  ui-strategy.md
  wireframe-description.md
  api-specification.md
  service-design.md
  security-rbac.md
  getting-started.md
  executive-dashboard.md
  center-monitoring.md
  synchronization-monitoring.md
  final-summary-report.md
  stakeholder-demo-guide.md
  feature-walkthrough.md
  architecture-summary.md
  documentation-index.md
  future-roadmap.md
  known-assumptions.md
  presentation-talking-points.md
  test-plan.md
  test-scenarios.md
  test-cases.md
  agents/
    agent-charters.md
  product/
    product-brief.md
  requirements/
    requirements-plan.md
  architecture/
    architecture-plan.md
    decisions/
      README.md
  ux/
    design-plan.md
  data/
    data-plan.md
  backend/
    backend-plan.md
  frontend/
    frontend-plan.md
  analytics/
    analytics-plan.md
  reporting/
    reporting-plan.md
  security/
    security-plan.md
  qa/
    validation-plan.md
  devops/
    delivery-plan.md
  documentation/
    strategy.md
  governance/
    workflow.md
    phase-plan.md
    registers.md
```

Each folder is created with a planning document. Future deliverables have named owners and acceptance conditions in the agent charters and phase plan; their presence in the plan does not mean they have already been produced or approved.
