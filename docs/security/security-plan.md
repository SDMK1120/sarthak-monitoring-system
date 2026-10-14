# Security planning brief

**Owner:** Security Agent. **Reviewers:** BA, Architect, Backend, Reporting, QA, DevOps. **Status:** Proposed planning baseline. **Version:** 0.1. **Date:** 2026-10-14.

## Prototype boundaries

Use invented identities and synthetic data. Keep production credentials and real personal data outside fixtures, documents, screenshots, and reports. Validate role/organizational visibility before permitting individual learner detail.

Simulated role switching illustrates stakeholder views; it is not authentication or authorization. If a service-backed mode is chosen, define server-enforced scope checks for data queries, details, analytics, and reports. Hidden navigation cannot replace those checks.

## Future security deliverables

Produce the role/permission/scope matrix, data classification, trust-boundary threat model, export rules, audit expectations, negative access scenarios, and production-control backlog. Threats include cross-scope reads, export leakage, stale permissions, unsafe imports, unauthorized administrative changes, and insecure synchronization.

Future production controls may include identity integration, encryption, secure transport, secret handling, retention, incident response, and reconciliation integrity. Applicable legal/regulatory obligations must be identified separately; the prototype carries no compliance claim.

Acceptance requires every capability and export to have a visibility rule and an explicit simulation/enforcement status. QA verifies denial cases if enforcement is built, including attempts to change scope or access details directly. Hosting exposure and access audience are reviewed before any future deployment.

The subsequent [security strategy and RBAC matrix](../security-rbac.md) details all seven requested security areas and the four-role capability proposal. It defines action-specific assignment scope, conditional permissions, service identity separation, session review targets and future validation. No controls or grants are implemented by that specification.
