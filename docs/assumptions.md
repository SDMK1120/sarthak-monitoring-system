# Sarthak dashboard assumptions and open decisions

**Owner:** Business Analyst Agent. **Reviewers:** Product Manager, Analytics, Database Architect, Security, Solution Architect. **Status:** Open-decision register through implementation foundation. **Version:** 1.1. **Date:** 2026-10-14.

## Confirmed context

Sarthak is an Offline-First LMS. Its dashboard is a centralized cloud-based monitoring and analytics platform. All monitoring areas in [product requirements](product-requirements.md) and the role names CM, JDM, SDM, and Super Admin are confirmed by the user. The project remains a demonstration prototype, and this delivery is documentation only.

Confirmed role names do not establish an organizational hierarchy, geographic assignment model, or permission matrix. The following working assumptions support specification and are not approved business policies.

## Business and metric assumptions

| ID | Proposed assumption or open decision | Owner | Validation needed before implementation |
| --- | --- | --- | --- |
| A-01 | Centers map to districts and regions; clusters/divisions are organizational scopes that may differ from geography | BA | Approve hierarchy, membership cardinality, unmapped records, and history of reassignment. |
| A-02 | CM has assigned cluster/center scope; JDM and SDM have broader explicit assignments; Super Admin has platform-wide monitoring | BA, Security | Approve role/scope matrix, overlap/delegation rules, and drilldown/detail permissions. |
| A-03 | Onboarding is an explicit center lifecycle milestone | BA | Define qualifying status, onboarding date, deactivated/deleted records, and historical cutoff behavior. |
| A-04 | Active/inactive is a business classification separate from sync freshness | BA, Analytics | Choose recorded lifecycle status or an approved activity rule, qualifying events, window/threshold, and unknown treatment. |
| A-05 | A category groups schemes and centers may participate in multiple schemes | BA, Database | Confirm taxonomy, assignment validity dates, overlap rules, and distinct/group count semantics. |
| A-06 | Monthly batch creation uses original batch creation time | Analytics, BA | Confirm timestamp availability, calendar/timezone, cancellation/deletion rules, and historical corrections. |
| A-07 | Batch utilization uses eligible occupied seats divided by approved capacity | Analytics, BA | Confirm eligibility, active-versus-all enrollment policy, cutoff/cohort behavior, capacity changes, and overcapacity treatment. |
| A-08 | Enrollment records and unique learners are different measures | BA, Database | Define identity, duplicate enrollments, transfers, cancellations, and learner counting across batches. |
| A-09 | Attendance belongs to learner-session opportunities with explicit present/absent/unrecorded states | BA, Analytics | Confirm eligible sessions, scheduled-versus-recorded denominator, holidays/cancellations, and coverage reporting. |
| A-10 | Assessments have attempt, grading, and outcome states | BA, Analytics | Approve eligibility, pass thresholds, retake/attempt selection, ungraded handling, and unique-learner versus attempt measures. |
| A-11 | Course completion uses a source-defined eligible course assignment | BA, Analytics | Confirm completion criteria, revoked/corrected outcomes, cohort policy, and completion timestamps. |
| A-12 | Certification status is supplied independently of completion | BA, Reporting | Confirm status vocabulary, eligibility, issuing authority, timing, external source availability, and permitted identifiers. |
| A-13 | District/regional performance uses shared indicators rather than a composite score | PM, Analytics | Approve comparison set, population/period equivalence, denominator displays, and aggregation mappings. |

## Data and prototype assumptions

| ID | Proposed assumption or open decision | Owner | Validation needed before implementation |
| --- | --- | --- | --- |
| A-14 | Cloud observations exclude activity not yet uploaded | Architect, Analytics | Identify source signals and coverage; avoid pretending to know pending local record counts unless reported by the source. |
| A-15 | Event and receipt timestamps plus stable source identity are available conceptually | Database, Architect | Agree missing timestamps, clock skew, retry deduplication, conflict, late-arrival, and correction policies. |
| A-16 | Asia/Kolkata is a candidate reporting timezone | PM, Analytics | Confirm timezone and date-boundary rules; session environment timezone alone does not establish product policy. |
| A-17 | Freshness thresholds and sync status vocabulary remain undecided | Architect, BA | Define expected sync cadence, stale threshold, partial/failed meaning, and device-to-center aggregation. |
| A-18 | Synthetic fixtures can support the demonstration without real LMS ingestion | PM, Security, Database | Agree synthetic coverage, fixed reference date, stable IDs, snapshot version, and reset expectations. |
| A-19 | Historical status/capacity/membership may be unavailable | Database, Analytics | Decide which as-of metrics are supported; otherwise label current-state measures instead of inventing history. |
| A-20 | MVP includes report previews; executable file exports are optional | PM, Reporting | Confirm selected formats and which actions work versus are simulated. |
| A-21 | Prototype may use simulated role selection or a service-backed access model | Architect, Security | Decide implementation mode and required enforcement; label simulations and validate negatives where enforcement exists. |
| A-22 | Learner-level details are minimized and optional | Security, BA | Approve detail visibility and report/export rules; use synthetic records exclusively for the prototype. |
| A-23 | Visual identity, language, viewport targets, accessibility target, and runtime/hosting stack are open | UX, Architect, DevOps | Agree presentation environment and usable design criteria without implying production service levels. |
| A-24 | Block is proposed as a geographic area below district with optional center-to-block mapping; it does not equal a cluster | BA, Database, Security | Approve hierarchy, coverage, effective mapping/reassignment, direct district consistency, and role visibility; no block membership may be inferred from names. |
| A-25 | Learner engagement is proposed as distinct eligible learners with received attendance, valid assessment, or new completion evidence in the period | Analytics, BA, PM | Approve signal set, enrollment overlap/identity rules, period attribution, and coverage label; lesson/time-on-task signals are outside this proxy. |
| A-26 | Observed sync health uses an explicit expected-target roster, source cadence, required delivery coverage, and publication evidence | Architect, Analytics, BA | Approve expected/exempt targets, classification/deadline rules, and evidence availability; recent successful transfer alone cannot establish healthy coverage. |
| A-27 | User Management and Settings are requested design surfaces; administrative writes, delegated directory access, provisioning handoff, preference persistence, and policy-review controls remain proposed | PM, BA, Security, Architect, UI/UX | Approve directory/action permissions, exact scope/effective-date behavior, self-affecting/privileged changes, identity-provider handoff, persistence/audit/conflict rules, and policy-version activation; titles alone grant none of these actions. |
| A-28 | Service-backed API contracts use a proposed external identity/server-session profile and explicit optional admin, preferences, report/export/scheduler and source-ingress boundaries | Backend, Security, Architect, Database, Reporting | Approve exact identity/CSRF/session/cookie profile, permission catalogue, limits/error/version/idempotency policies, additional operational persistence, recipient rules, source event schemas and source processing feedback before implementing the conditional APIs. |
| A-29 | The security strategy proposes role-capability bindings, action-specific multi-role scopes, MFA/step-up, numerical session review targets, service boundaries and audit/data/API policies | Security, BA, Backend, Architect, PM, DevOps | Approve grants/delegation, privileged/self-change and emergency-access policies, identity/session/MFA profiles and limits, audit failure/retention, encryption/key/service-credential handling, and validation evidence; proposed matrix cells and timeouts are not configured controls. |

## Resolution process

Resolve business definitions with Product Manager and the stakeholder; Analytics and Database review grain, dates, and totals; Security reviews access; Architect reviews source feasibility. Record the chosen policy, rationale, owner, date, and affected requirements. Update the relevant specification and notify downstream UX, Backend, Frontend, Reporting, and QA owners.

Blocking decisions include A-01–04 for scopes/center counts, A-07–12 for learning rates, and A-14–17 for offline-data meaning. Exploration may proceed with labeled examples, but final contracts must not treat these proposals as accepted rules.

This register supplements the initial [governance register](governance/registers.md). For this Phase 2 scope, the five new documents take precedence over earlier provisional persona lists and capability priorities. Technology, integration, hosting, and production controls remain unselected.

The analytics phase adds [proposed metric calculation policies](metric-definitions.md) and [four-level KPI views](analytics-kpis.md). These select concrete candidate formulas for review, including attendance against eligible opportunities with coverage, assignment cohorts, and independent certification eligibility. They do not mark A-03–17 accepted. A-24–26 record the new block, engagement, and sync-health decisions before implementation readiness.

The [UI and UX page design](dashboard-pages.md) includes the newly requested User Management and Settings pages. A-27 separates their proposed future controls from the earlier monitoring-only MVP. The design phase does not activate accounts, change grants or policies, persist preferences, or implement an identity provider.

The backend phase adds [API contracts](api-specification.md) and [service responsibilities](service-design.md). A-28 records remaining profile, field/persistence, and source-contract approval gates. Documented endpoints do not select a runtime/database, implement trusted access, create exports/schedules, or connect the LMS.

The [security strategy and RBAC matrix](security-rbac.md) makes proposed capability bindings and controls explicit. A-29 keeps those policy decisions open. Authentication evidence never grants a role automatically, and a capability from one assignment cannot be combined with unrelated scopes to broaden access.

Implementation Phase 1 selects React/TypeScript/Vite/Tailwind, Fastify/TypeScript and PostgreSQL as instructed, and delivers the [foundation scaffold](getting-started.md). Earlier statements about unselected frameworks/database are historical to their documentation phases. Business modules, physical domain schemas, live database verification, identity/RBAC, source integration, reporting automation and hosting remain outside this implemented foundation.
