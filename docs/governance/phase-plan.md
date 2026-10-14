# Phase execution plan

Phase 0 is the current planning delivery. Phases 1 through 7 are future work and must not start under this planning-only instruction. The illustrative 30-day sequence begins only after implementation is requested; durations depend on confirmed scope, available capacity, and review turnaround.

| Phase | Indicative working days | Entry condition | Lead and collaborators | Deliverables | Exit gate |
| --- | --- | --- | --- | --- | --- |
| 0 Team and planning | Current delivery | User vision | Orchestrator; all 13 specialists | Charters, ownership, dependencies, folder structure, workflow, phase plan, documentation strategy | All requested planning artifacts exist and links/scope are checked; stop here. |
| 1 Discovery and scope | 1–3 | New instruction to proceed | PM and BA; UX, Analytics, Reporting, Security, QA | Validated personas/hierarchy, product brief, prioritized requirements, success criteria, glossary, demo scenario map | Stakeholder validates scope and P0 journeys; all critical business assumptions have owners. |
| 2 Architecture and data design | 4–7 | Phase 1 baseline | Architect and Database; Analytics, Backend, Security, DevOps, Reporting | Context/data flows, conceptual model, KPI catalogue, data/snapshot policies, implementation-mode decision, trust boundaries | Joint data/metric review passes; mode and freshness rules are agreed; critical design contradictions resolved. |
| 3 UX and contract specification | 8–11 | Agreed journeys and provisional Phase 2 definitions | UX and Backend; Frontend, Reporting, Analytics, Security, QA | Wireframes/design prototype, component/state specifications, interfaces, report templates, scenario expectations | Every P0 requirement maps to reviewed screens/contracts; UX and contract reviews agree; implementation backlog is Ready. |
| 4 Prototype construction | 12–21 | Phase 3 gate and implementation authority | Frontend and Backend; Database, Analytics, Reporting, DevOps, Security | Future application, shared synthetic fixtures, core dashboards, report previews, optional agreed downloads, reproducible preview | P0 journeys function with stable data; integration checks and domain reviews pass; simulations are labeled. |
| 5 Integrated validation | 22–25 | Testable prototype and expected-results baseline | QA; all delivery agents, Security | Validation evidence, KPI/report reconciliation, access checks where enforced, accessibility review, defect fixes | No open critical/high defect affecting core journeys; scope checks and repeatable reset pass; limitations documented. |
| 6 Demonstration readiness | 26–28 | Phase 5 evidence | PM and Documentation; UX, QA, DevOps | Demo script, walkthrough, architecture story, known limitations, reset/recovery instructions, rehearsal record | Stakeholder accepts narrative and prototype; presenter completes rehearsal and recovery steps. |
| 7 Handover | 29–30 | Accepted presentation package | Documentation and orchestrator; all owners | Indexed final documents, release snapshot, handover notes, production roadmap, outstanding backlog | Links, ownership, versions, setup and limitations agree; stakeholder receives the package. |

UX discovery can overlap Phase 2 and QA/Security/Documentation operate throughout. Final UX and service contracts depend on agreed data semantics; this limits how much overlap is safe. The dates above assume reviews occur inside each time box; unresolved gates extend the schedule rather than being skipped.

## Critical dependency path

Scope and personas → hierarchy and eligibility rules → joint data/KPI baseline → reviewed UX and contracts → shared scenarios and core views → reconciliation and security validation → rehearsal → handover.

## Gate evidence

Each future gate records phase, artifact versions, reviewers, review date, acceptance evidence, open issues, and a decision. Business scope and presentation acceptance belong to the stakeholder. Technical review belongs to the named domain owners. The orchestrator records the outcome and schedules only work whose inputs are ready.

## Phase 0 completion checklist

- All 13 roles have missions, responsibilities, deliverables, dependencies, and acceptance conditions.
- Domain folders and an overall plan are present.
- Workflow, critical path, phase outputs, and future gates are explicit.
- Proposed features and open decisions are distinguishable from confirmed user requirements.
- Documentation strategy, traceability convention, and risk/assumption registers exist.
- No implementation code, dependency installation, provisioning, or deployment has occurred.
