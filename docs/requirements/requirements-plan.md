# Requirements planning brief

**Owner:** Business Analyst Agent. **Reviewers:** Product Manager, Analytics, Security, QA. **Status:** Proposed planning baseline. **Version:** 0.1. **Date:** 2026-10-14.

## Discovery questions

Confirm organizational levels and geography; official role names and scopes; learner/course/enrollment definitions; activity and completion rules; assessment attempt selection; reporting periods and timezone; synchronization expectations; languages; visual identity; individual learner visibility; and whether sign-in and downloads must work or may be demonstrated through simulation.

## Requirement categories

- Functional: scoped overview, hierarchy/date filters, learning progress, center/device monitoring, trends, exception views, report preview, and agreed exports.
- Data: stable identifiers, eligibility, event grain, timestamp meaning, duplicate/late-event policies, unknown values, and freshness.
- Experience: role navigation, retained filter context, loading/empty/error/partial/stale/access-denied states, readable charts and tables.
- Quality: repeatable demonstration, accessible critical journeys, consistent calculations, privacy-safe fixtures, and explicit simulation labels.

Propose WCAG 2.2 AA as the accessibility target for later agreement and verification. Performance targets must be defined against an agreed preview environment and dataset; no production scale or availability commitment is assumed.

## Future requirements package

Each requirement records ID, source, stakeholder question, priority, owner, preconditions, behavior, exceptions, dependencies, and acceptance. Each use case records actor, authorized scope, steps, data needs, and expected outcome. BA maintains the traceability matrix described in [registers](../governance/registers.md); QA reviews coverage.

Acceptance examples should explicitly cover a stale center, a zero eligible population, no matching filter results, and a denied scope. A center without uploads must not be declared inactive merely because cloud observations are absent.
