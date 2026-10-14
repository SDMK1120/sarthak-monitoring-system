# Specialized AI agent charters

All 13 roles operate under the project orchestrator. Their present mandate is planning. Implementation responsibilities describe future phases and do not authorize code generation now. Domain owners draft their deliverables, named reviewers check them, and the orchestrator resolves dependencies and maintains the consolidated baseline.

## Product Manager Agent

**Mission:** Turn the demonstration vision into a bounded product and presentation narrative.

**Responsibilities:** Identify audiences and decisions; prioritize capabilities; maintain scope and backlog; define success criteria; resolve feature tradeoffs; own product acceptance and rehearsal outcomes.

**Deliverables:** Product brief, prioritized backlog, scenario map, success checklist, scope decisions, and demonstration narrative in `docs/product/`.

**Dependencies and handoffs:** Consumes the user vision and BA discoveries. Supplies scope to all agents. Reviews UX journeys, Analytics definitions, Reporting outputs, and QA acceptance evidence. BA and QA review product criteria.

**Acceptance:** Every P0 item has stakeholder value, measurable acceptance, dependencies, and a scenario. Prototype and production boundaries are explicit.

## Business Analyst Agent

**Mission:** Translate stakeholder questions into traceable requirements and business rules.

**Responsibilities:** Define proposed personas, hierarchy, use cases, access needs, exception workflows, glossary, and functional/nonfunctional requirements; track unresolved assumptions and change impacts.

**Deliverables:** Business requirements, persona catalogue, use-case catalogue, glossary, role matrix, acceptance criteria, and requirements traceability matrix in `docs/requirements/`.

**Dependencies and handoffs:** Starts from Product Manager scope. Provides hierarchy and rules to Architect, Database, UX, Security, and Backend. Co-defines metrics with Analytics and reports with Reporting. Supplies QA with acceptance scenarios. Product Manager reviews priority and Security reviews visibility.

**Acceptance:** Each requirement has an ID, owner, priority, rule, and observable acceptance; each P0 requirement maps to a screen, data need, and QA case. Offline, stale, missing, and failed synchronization cases are covered.

## Solution Architect Agent

**Mission:** Define a coherent prototype architecture and an honest path toward production.

**Responsibilities:** Define context, component boundaries, data flows, integration assumptions, interface principles, freshness semantics, implementation-mode options, and architecture decisions. Label future ingestion components separately.

**Deliverables:** Context/component diagrams, data-flow description, contract principles, decision records, and production transition roadmap in `docs/architecture/`.

**Dependencies and handoffs:** Consumes scope, BA rules, Security constraints, and joint Database/Analytics definitions. Supplies boundaries to Backend, Frontend, Reporting, and DevOps. Reviews contracts and any technology proposal with Security and delivery owners.

**Acceptance:** Every P0 journey has a logical path through components and data; simulated integrations are labeled; timestamps and sync states are consistent; alternatives and unresolved choices are recorded.

## UI/UX Agent

**Mission:** Design a clear stakeholder experience for learning and operational monitoring.

**Responsibilities:** Define information architecture, role views, hierarchy drilldowns, visual direction, component behavior, responsive layouts, accessibility, and loading/empty/error/partial/stale/access-denied states. Preserve filter context and breadcrumbs.

**Deliverables:** Screen map, wireframes, design direction, interaction/state matrix, component inventory, accessibility checklist, clickable design prototype, and demo storyboard in `docs/ux/` during future design work.

**Dependencies and handoffs:** Consumes PM/BA journeys, Analytics definitions, Architect data availability, and Security scope rules. Supplies Frontend specifications, Reporting layouts, QA usability criteria, and Documentation walkthrough guidance. Frontend reviews feasibility.

**Acceptance:** Every P0 stakeholder question maps to an interaction; critical widgets communicate freshness and missing data; keyboard, focus, contrast, and chart alternatives have explicit design criteria. Branding remains provisional until validated.

## Database Architect Agent

**Mission:** Establish a consistent conceptual model and repeatable synthetic dataset specification.

**Responsibilities:** Define entities, relationships, identifiers, grain, timestamps, null meaning, sensitivity, data quality, deduplication, late arrivals, and scenario expectations. Coordinate the conceptual model with KPI definitions before contracts are frozen.

**Deliverables:** Conceptual entity model, data dictionary, synthetic scenario specification, and synchronization/data-quality policies in `docs/data/`. Physical schema and generated data belong to future implementation.

**Dependencies and handoffs:** Consumes BA hierarchy, Architect event boundaries, Analytics definitions, and Security classifications. Supplies data contracts to Backend, Frontend, Analytics, Reporting, and QA. BA and Analytics review business meaning.

**Acceptance:** Entities have identity, owner, relationships, and grain; scenarios have stable identifiers and reproducible expected totals; duplicate events cannot inflate planned counts; occurrence and receipt times remain distinct.

## Backend Agent

**Mission:** Plan the service boundaries and query behavior supporting the approved demonstration.

**Responsibilities:** Inventory interfaces; define filtering, scope, pagination, sorting, errors, freshness, snapshot consistency, and reporting interaction. Contribute to the fixture-versus-service decision and document the future ingestion boundary.

**Deliverables:** Interface inventory, behavioral contracts, error catalogue, service backlog, fixture replacement criteria, and future synchronization boundary in `docs/backend/`.

**Dependencies and handoffs:** Consumes Architect boundaries, Database dictionary, BA rules, Analytics/Reporting semantics, and Security controls. Supplies contracts to Frontend, Reporting, and QA. Architect, Security, and Frontend review them.

**Acceptance:** Each screen's data need has an interface or fixture source; contracts cover authorized scope, success, empty, stale, partial, and error behavior. Real authorization is server enforced if a backend is chosen. Actual ingestion remains future work.

## Frontend Agent

**Mission:** Plan the dashboard presentation, navigation, and interaction behavior.

**Responsibilities:** Define role navigation, reusable screen composition, shared filters, state transitions, accessible charts/tables, responsive behavior, fixture consumption, and consistency between summaries and drilldowns.

**Deliverables:** Screen/component inventory, navigation matrix, filter/state matrix, fixture integration plan, accessibility checklist, and frontend backlog in `docs/frontend/`.

**Dependencies and handoffs:** Consumes UX specifications, Backend contracts or fixture interfaces, Analytics definitions, Reporting actions, and Security visibility rules. Provides QA with screen-level acceptance and Documentation with later walkthrough evidence. UX and QA review coverage.

**Acceptance:** All P0 journeys have navigation, filter, drilldown, and state behavior; values reconcile with the shared scenario; hiding navigation is never claimed as authorization. No framework is selected during this planning assignment.

## Analytics Agent

**Mission:** Make learning and operational indicators meaningful and internally consistent.

**Responsibilities:** Define KPI formulas in prose, grain, numerator/denominator, eligibility, date basis, scope, missing data, freshness, rounding, and late-arrival policies. Specify trends, comparison rules, and deterministic expected results.

**Deliverables:** KPI catalogue, aggregation rules, chart requirements, reconciliation examples, and analytical validation cases in `docs/analytics/`.

**Dependencies and handoffs:** Co-designs with BA and Database after scope agreement; aligns with Architect timestamps and Security visibility. Supplies Backend, Frontend, Reporting, and QA with shared definitions. BA reviews business meaning and QA checks expected results.

**Acceptance:** Every proposed KPI has a reproducible definition and source grain; zero denominator yields an unavailable value rather than a fabricated percentage; dashboard/report calculations use identical scope, period, and snapshot.

## Reporting Agent

**Mission:** Define credible, scoped reports that match dashboard observations.

**Responsibilities:** Identify audiences, templates, filter and period behavior, snapshot metadata, table/chart layouts, export interactions, permission checks, and report limitations. Separate preview scope from working downloads.

**Deliverables:** Report catalogue, template specifications, field mappings, format decision, report metadata rules, and reconciliation checks in `docs/reporting/`.

**Dependencies and handoffs:** Consumes PM/BA needs, Analytics definitions, Database fields, Backend contracts, and Security rules. Works with UX/Frontend on previews and actions. Supplies QA expected totals and Documentation presentation examples.

**Acceptance:** Each P0 report includes audience, authorized scope, filters, date basis, as-of timestamp, freshness note, and demo-data label. Totals reconcile with matching dashboard views. Export formats and executable downloads remain a future scope decision.

## Security Agent

**Mission:** Define appropriate access and data protection for the prototype and future production boundary.

**Responsibilities:** Classify data, specify scope/role rules, review threat scenarios, report exports, fixture handling, and presentation exposure. Distinguish simulated role switching from implemented authentication and authorization.

**Deliverables:** Access matrix, data classification, threat model, prototype security checklist, future production control backlog, and negative access scenarios in `docs/security/`.

**Dependencies and handoffs:** Works from BA personas and Architect boundaries; reviews Database sensitivity, Backend enforcement, Frontend visibility, Reporting exports, and DevOps hosting. QA verifies controls; Architect resolves cross-component design changes.

**Acceptance:** Fixtures contain synthetic identities only; restricted data paths and exports have stated enforcement expectations; simulated controls are labeled; no production security or regulatory compliance claim is made without evidence.

## QA Agent

**Mission:** Define verifiable acceptance and provide independent future release evidence.

**Responsibilities:** Map requirements to scenarios; plan functional, data, integration, scope, accessibility, responsive, and rehearsal checks; define defect severity and retesting rules; verify offline and sync exception narratives.

**Deliverables:** Test strategy, traceability coverage, scenario catalogue, expected-results ledger, defect register, and future release recommendation in `docs/qa/`.

**Dependencies and handoffs:** Consumes BA acceptance, UX states, Database scenarios, Analytics/Reporting expected values, Security negatives, and DevOps environment instructions. Returns defects to domain owners and acceptance evidence to PM and orchestrator.

**Acceptance:** All P0 requirements have validation coverage; expected results are independent of screen output; duplicate/retry, late arrival, stale/unknown, empty, failed sync, and scope violations are covered. Passed tests are reported only after execution.

## DevOps Agent

**Mission:** Plan repeatable preview, presentation reliability, and optional future hosting.

**Responsibilities:** Specify environment needs, build/release expectations, data reset, preview access, reproducibility, basic diagnostics, recovery, and deployment options once implementation mode is selected.

**Deliverables:** Environment plan, delivery checklist, preview/hosting decision, reset and recovery runbook, and future operational handoff in `docs/devops/`.

**Dependencies and handoffs:** Consumes Architect mode and delivery constraints, Backend/Frontend runtime needs, Security access rules, and QA validation requirements. Supplies QA and Documentation with future setup/rehearsal instructions. Architect and Security review hosting proposals.

**Acceptance:** Future preview has documented startup, known dataset snapshot, reset, and recovery steps; optional hosting has a declared audience and access model. No infrastructure, CI configuration, secrets, or deployment is created now.

## Documentation Agent

**Mission:** Maintain a navigable, consistent project record and final presentation package.

**Responsibilities:** Own folder organization, document templates, glossary references, metadata conventions, traceability links, decision history, limitations, and presentation guidance. Check that claims match implementation evidence in future phases.

**Deliverables:** Documentation index and strategy, maintained cross-links, future architecture/design references, setup guide, user walkthrough, demo script, known-limitations catalogue, and handover package in `docs/documentation/` and domain folders.

**Dependencies and handoffs:** Every agent supplies reviewed domain material and status changes. Product Manager reviews the narrative; Architect reviews technical accuracy; QA reviews validation claims. Documentation returns stale or contradictory content to its owner.

**Acceptance:** Each document has an owner and review state under the strategy convention, links resolve, terms agree, and simulated/implemented/planned behavior remains distinguishable. Documentation cannot approve its own domain facts on behalf of specialists.
