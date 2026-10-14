# Documentation strategy

**Owner:** Documentation Agent. **Reviewers:** All domain owners; QA for evidence; PM for narrative. **Status:** Planning baseline. **Version:** 0.1. **Date:** 2026-10-14.

## Ownership and source of truth

The repository documentation is the project record. Domain agents own factual correctness in their folders; Documentation owns navigation, conventions, links, and editorial consistency. Product plan, requirements, KPI dictionary, data dictionary, access matrix, and contracts each have one maintained source; other documents link to them rather than duplicating definitions.

Current project-level ownership: README and index belong to Documentation; overall plan and phase/workflow governance belong to the orchestrator; business assumptions/traceability belong to BA; scope decisions belong to PM; risks belong to their listed owners; architecture records belong to Architect. These central documents are planning baseline version 0.1 dated 2026-10-14. Future domain documents carry explicit metadata.

## Document conventions

Use descriptive lowercase filenames and relative links. Each domain document records owner, reviewers, status, version, and date. Future status values are Draft, In review, Accepted, and Superseded. Proposed planning content is not an Accepted business specification.

Maintain document versions in repository history during future execution; this planning delivery does not create a commit. Accepted milestone snapshots should link exact artifact versions and review evidence. Superseded decisions remain available with links to their replacements.

For every future capability distinguish Planned, Simulated, Implemented, and Verified. Verified requires a validation evidence link. A design mockup, fixture, or architecture diagram alone cannot establish implemented integration or security.

## Future artifact templates

| Artifact | Required content | Owner |
| --- | --- | --- |
| Requirement/use case | ID, audience, question, scope, priority, behavior, exceptions, acceptance, links | BA |
| Architecture decision | Context, options, decision/status, rationale, consequences, reviewers | Architect |
| Data definition | Entity/field meaning, grain, identity, relationships, units, nulls, timestamp, sensitivity | Database |
| KPI | Purpose, formula, denominator/eligibility, date basis, scope, freshness, limitations | Analytics |
| Contract | Inputs, filters, scope, result grain, states/errors, cutoff, data dependencies | Backend |
| Screen/interaction | Journey, role, state behavior, filters, drilldowns, component/accessibility rules | UX/Frontend |
| Report | Audience, scope, period, fields/KPIs, cutoff, format capability, expected totals | Reporting |
| Validation evidence | Requirement/scenario IDs, artifact version, environment, expected/actual result, status, issue | QA |
| Runbook | Prerequisites, configuration, startup, reset, checks, recovery, limitations | DevOps |

## Review and update cadence

Update documents with the affected decision or deliverable, before downstream handoff. At every phase gate, domain owners review accuracy, Documentation checks links and terminology, and QA checks requirement/evidence coverage. PM reviews scope and presentation claims. After a metric or contract change, update all consuming references in the same work item.

Review for contradictions, unresolved assumptions, unsupported completion claims, stale diagrams, missing owners, and broken links. Keep open questions in the governance registers with owner and needed-by phase.

## Future presentation and handover package

Produce a presenter script for leadership, learning, operations, and reporting journeys; stakeholder walkthrough; architecture explanation; setup/reset/recovery guide; report examples; release notes; known limitations; outstanding backlog; and production transition roadmap. Add a `docs/presentation/` folder when those artifacts are actually created in Phase 6.

Handover includes an indexed versioned package, accepted scope, scenario snapshot, validation summary, implemented/simulated/planned capability list, decision history, and owners for unresolved work. Screenshots or diagrams must match the accepted prototype version.

## Current planning completion

The current package provides all 13 charters, domain planning briefs, dependency/workflow rules, phase plan, registers, and documentation structure. Review document completeness and links, then stop. Future design assets, fixtures, detailed contracts, executable tests, application code, and deployment materials remain planned deliverables.
