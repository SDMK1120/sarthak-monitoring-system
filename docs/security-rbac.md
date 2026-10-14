# Sarthak security strategy and RBAC

**Owner:** Security Agent. **Reviewers:** Business Analyst, Solution Architect, Backend, Database Architect, Reporting, Analytics, UI/UX, DevOps, QA. **Status:** Proposed security baseline; grants, profiles, and operational targets awaiting approval. **Version:** 1.0. **Date:** 2026-10-14.

## Scope and trust boundaries

Define authentication, authorization, RBAC, sessions, audit logging, API security, and data security for the centralized Sarthak dashboard. This is documentation, not deployed identity, permission configuration, penetration testing, or compliance certification. The [44 API contracts](api-specification.md), [service design](service-design.md), [database design](database-design.md), and [reporting strategy](reporting-strategy.md) remain the functional sources.

The dashboard is cloud-based even though the LMS operates offline. Offline LMS activity and synchronization do not authorize offline access to cached sensitive dashboard records. Fixture-only demonstrations use invented identities and clearly labeled role selection; a public bundle delivered to a browser cannot enforce confidentiality of its included records. Service-backed access must implement and validate the controls selected below before claiming enforcement.

Treat user browser, external identity provider, trusted application boundary, private data/artifact storage, LMS source ingress, background workers, and audit/operational access as separate trust boundaries. Machine identities are not additional business user roles and cannot inherit CM/JDM/SDM/Super Admin privileges.

## Authentication strategy

The proposed service-backed profile uses an external identity provider with OpenID Connect Authorization Code flow, PKCE, and transaction-bound state/nonce. The trusted application validates issuer, audience, signature, expiry and flow evidence, then resolves an enabled dashboard principal by approved issuer/subject linkage. A provider claim does not establish application role or geographic scope. The protocol baseline is [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) with the [OAuth security guidance](https://www.rfc-editor.org/rfc/rfc9700.html); provider and deployment profiles remain proposed.

| Control | Proposed Sarthak policy |
| --- | --- |
| User sign-in | AUTH-01/02 use configured provider/callback and an allowlisted local return path; no caller-selected identity issuer, role, tenant entitlement, or external return URL |
| Principal linkage | Verified identity maps to organization-owned users; unknown/disabled linkage is denied or directed to an approved onboarding handoff, never auto-provisioned with monitoring access |
| Organization context | Bound by approved server-side identity/organization mapping; a host or user selector alone is not membership proof; any future context switch must verify membership and reset context |
| MFA | Propose MFA for real dashboard sign-in, with fresh provider-backed assurance for administrative grants, principal disabling, sensitive export or policy actions; supported method/recovery policy needs review |
| Credentials and recovery | Dashboard collects no LMS passwords, provider passwords, recovery codes, or browser refresh tokens; provider recovery/handoff must not silently grant application privileges |
| Abuse and availability | Bound sign-in attempts/transactions and use safe errors; unavailable identity evidence fails closed rather than falling back to a demo identity |
| Source admission | Separate verified source identity, enabled namespace, device/center registration and allowed event families; source credential mechanism/rotation is a future profile decision |

Successful identity authentication establishes a subject, not a role grant. Newly created dashboard records without verified linkage remain disabled/pending linkage under the optional onboarding design. There is no public self-registration, unrestricted role picker in enforced mode, or direct identity-provider provisioning API in the current specification.

## Authorization strategy

Use role capabilities with explicit organization, center/area/unit membership, validity, and field/action constraints. Deny ungranted actions and check every request/object rather than relying on page visibility. This approach follows [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); the role/scope rules below are Sarthak proposals.

For an action, build the permitted center set only from currently valid assignments whose roles actually grant that action. Do not combine a privilege from one role with the union of scopes from unrelated roles. Example: a subject's CM grant for Center A plus a comparison-enabled SDM grant for Region B does not authorize SDM comparison of A unless an applicable comparison grant also covers A.

The decision requires an enabled subject/organization, current capability, effective assignment/target, organization equality, current approved membership, permitted fields, valid requested context, and any step-up requirement. No scope targets means no data; blank scope never means global. Explicitly requested forbidden IDs receive safe denial. Implicit lists contain only the action's authorized population.

Apply the decision before filter-option disclosure, query, aggregation, grouping, pagination, detail joins, cache/replay return, report generation, delivery, artifact access, and audit/diagnostic reads. Historical snapshots preserve metric facts, not old access entitlement. Ownership of a run/schedule is not sufficient after revocation. Cross-organization FKs and storage boundaries must preserve organization ownership; global role catalogues are not global data grants.

Current approved geography/unit relationships determine assignment membership under the agreed historical-access rule. Region, district, proposed block, cluster, and division are not interchangeable. Geographic history remains A-01/A-24; assignment/history policy remains A-02. The snapshot's metric population and current permitted population must both be compatible with the result returned.

## RBAC matrix

All cells are proposed bindings awaiting business/security review, not accepted role configuration. **S** = recommended scoped monitoring capability once approved; **O** = own-session/personal capability only; **C** = conditional separate grant, denied unless approved and enabled; **D** = denied in this baseline. S/O are not active permissions merely because this document exists.

| Capability or action | Super Admin | SDM | JDM | CM |
| --- | --- | --- | --- | --- |
| Own session read/renew/sign-out | O | O | O | O |
| monitoring.read: scoped landing/options/publication availability | S | S | S | S |
| centers.read: counts/list/detail | S | S | S | S |
| schemes.coverage.read: allowed membership/category/scheme coverage | S | S | S | S |
| batches.read: formation/capacity/detail | S | S | S | S |
| learning.summary.read: enrollment/attendance/assessment/outcome aggregates | S | S | S | S |
| analytics.read: allowed definitions/metrics | S | S | S | S |
| analytics.compare.region: comparable permitted regions | S | S | C | C |
| analytics.compare.district: comparable permitted districts | S | S | S | C |
| analytics.compare.block: approved mapped-block comparisons | S | S | S | C |
| learning.learner_detail.read: identifying learner observations | C | C | C | C |
| learning.certificate_identifier.read: restricted credential identifiers | C | C | C | C |
| sync.monitor.read: permitted target/run health observations | S | S | S | S |
| sync.diagnostics.read: sanitized receipt/conflict evidence | C | C | C | C |
| reports.preview: permitted templates and ready previews | S | S | S | S |
| reports.history.read: own/permitted history with current result rights | S | S | S | S |
| reports.export: configured formats and permitted fields | C | C | C | C |
| reports.schedule.read: own/delegated future schedule metadata | C | C | C | C |
| reports.schedule.manage: future draft/change/activate scope | C | C | C | C |
| Own preferences.read and preferences.update: presentation only | O | O | O | O |
| users.directory.read: permitted principal metadata/catalogue | C | C | C | C |
| users.create: dashboard record/approved identity handoff | C | D | D | D |
| users.profile.update: permitted profile metadata | C | D | D | D |
| users.status.update: permitted principal enabled state | C | D | D | D |
| users.assignments.manage: approved role/scope delegation | C | D | D | D |
| policies.reference.read: permitted rule/status reference | S | S | S | S |
| policies.propose: optional reviewed policy proposal | C | D | D | D |
| audit.read.scoped: permitted security/material-change evidence | C | D | D | D |
| ingestion.telemetry.write / ingestion.events.write | D | D | D | D |
| Source attendance/grading/completion/certification writes; Force sync | D | D | D | D |
| Raw credentials, arbitrary database/cloud administration, audit deletion | D | D | D | D |

### Scope bindings and constraints

| Role | Proposed monitoring population | Explicit limits |
| --- | --- | --- |
| Super Admin | Organization-wide monitoring when an organization target is explicitly assigned | Not all organizations; no automatic directory management, learner detail, exports, audit access, or infrastructure privilege |
| SDM | Assigned region/division/area/unit center memberships | No global scope from title; division is not assumed to equal region; administrative writes denied in this baseline |
| JDM | Assigned district/operational area memberships | No access to all districts or automatic authority over CMs; regional comparison conditional |
| CM | Explicit assigned centers/clusters | Cluster is not automatically a district/block; higher-level comparisons conditional and still limited to assigned population |

Current API phrases such as “geographic comparison capability” map to the appropriate analytics.compare.region/district/block grant in this proposal; scheme coverage maps to schemes.coverage.read. An own preference grant is personal only. policies.propose and audit.read.scoped are future capabilities without new activation/deletion routes; setting design does not imply a deployed policy-write API.

Directory viewing and role delegation are distinct. A permitted editor can change only approved targets/roles/assignments, cannot remove unseen broader grants, and cannot disable a broader principal without explicit authority over that action. Self-elevation, last-management-authority preservation, privileged approval, and emergency access must be decided under A-27/A-29 before administrative writes are built. No silent break-glass Super Admin bypass is proposed.

### Non-user service identities

| Identity class | Permitted responsibility | Prohibited authority |
| --- | --- | --- |
| LMS source principal | Enabled namespace telemetry/events for registered centers and approved event families | Dashboard sessions, role grants, arbitrary organization/table selection, report browsing |
| Report worker | Process an accepted run using requester/recipient scope intersection and current permissions | Assume global audience or reuse revoked requester rights |
| Projection worker | Apply validated committed source revisions/outbox under exact organization/source ownership | Convert untrusted payload claims into role grants or duplicate learning facts |
| Scheduler/delivery worker | Authorized occurrence intent, recipient-specific generation and evidence | Broad owner's artifact delivered to narrow recipient, public bearer links, unapproved channels |
| Operational audit/security access | Separately approved minimal evidence/key/operational authority | Automatic rights granted by a business user title or app-level permission string |

Service authentication, credential lifetime, revocation and operational permissions require their own registry/profile. These classes do not add a fifth business role.

## Session management

Use a server-validated opaque session handle in a protected browser cookie; never accept role/scope authority from browser storage or token display. Cookie attributes, rotation, expiry and invalidation must be handled together. [OWASP session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) supports the general session controls; the numerical profile below is a draft Sarthak policy.

| Session control | Proposed policy or review target |
| --- | --- |
| Cookie | Secure and HttpOnly; host/path scope minimized; SameSite profile reviewed with the approved identity callback. No session IDs in URLs |
| Transaction/session generation | Unpredictable high-entropy identifiers from an approved secure generator; server-bound identity-flow state, nonce and PKCE evidence; no caller-selected handle |
| Initial authentication | Rotate identity transaction/session handle after validated sign-in; expire transaction evidence and prevent replay |
| Idle timeout | Draft 30 minutes for ordinary monitoring; inactivity is measured server-side, not trusted client timestamps |
| Absolute lifetime | Draft 8 hours from sign-in; renewal does not reset the absolute maximum |
| Privileged interaction | Draft 15-minute idle window with provider-backed MFA/step-up; sensitive change/export requires authentication freshness of at most 5 minutes |
| Pre-login transaction | Draft maximum 10 minutes or shorter provider-valid window; single-use callback evidence |
| Renewal | AUTH-04 checks current session, account, authorization version and renewal policy; no revived expired/revoked session |
| Logout/revocation | AUTH-05 revokes local session and clears browser held views; disablement/assignment changes invalidate or downgrade affected access before next sensitive response |
| Remember-me/offline dashboard | Not in this proposed profile; no long-lived browser credentials or offline learner-data cache |
| CSRF/origin | Unsafe cookie-authenticated requests require the approved token/origin policy; SameSite alone is not the complete protection plan |

Numeric targets are review proposals, not configured defaults, measured guarantees, or provider requirements. A missing approved timeout/step-up profile blocks an enforced implementation claim. Decide concurrent-session limits, renewal frequency, provider global logout, service credential TTL, and recovery behavior separately.

Authorization is refreshed per request using current policy, including after session renewal. UI clears affected content after expired/changed context and offers an appropriate sign-in/access state; it does not reveal restricted data while reauthentication is pending. Already downloaded files cannot be remotely recalled, so data minimization and access checks precede export.

## Audit logging

Use audit_events as distinct evidence from business versions, sync-run diagnostics, and application telemetry. Existing correlation/time/provenance fields are defined in [the dictionary](data-dictionary.md). Record actor kind/reference when known, organization, action, outcome, safe target locator, request/correlation ID, occurred/recorded times, applicable permission/snapshot versions, redacted changes/reason, and pipeline/run/occurrence context where relevant.

| Event family | Proposed evidence |
| --- | --- |
| Identity/session | Sign-in/step-up/renewal/logout failure or material success, disabled account/revocation, provider dependency error; never raw assertions/codes/tokens |
| Authorization | Denied action/direct object request, relevant restricted-data/export access, decision policy/version and safe reason |
| Administrative change | Principal create/disable, grant/scope changes, privileged proposal/approval/activation if introduced; exact approved target/effective dates and redacted before/after |
| Reporting | Generation request/completion/failure, permitted artifact access/export/expiry, schedule version/transition, occurrence and sanitized delivery/reissue evidence |
| Source integrity | Source admission denial, duplicate/conflicting/rejected revision, canonical correction/outbox outcome and snapshot publication |
| Data/operations | Approved retention/deletion/anonymization, restoration, key/credential lifecycle and configuration changes if later introduced |

Propose append-only application writes, restricted evidence readers, redacted payloads, log-injection-safe encoding, and monitored failure/tamper indicators. Keep secrets and unnecessary sensitive personal data out of logs. The general approach follows [OWASP logging guidance](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); event families and transactional evidence are project-specific.

Material grants, canonical accepted changes and required audit/invalidation evidence commit together or use a durable approved outbox. If mandatory evidence cannot be persisted, privileged mutations/exports fail closed under the selected policy. Read availability versus audit availability needs an explicit decision rather than assuming every logging failure can be ignored.

Application users cannot edit/delete audit records. Future protected storage or tamper-evidence may improve assurance, but no log is claimed tamper-proof by this document. Retention/anonymization and authorized lifecycle handling remain open; indefinite personal-data retention and automatic cascade deletion of evidence are not defaults. Audit locator metadata must not act as a generic unrestricted record-query mechanism.

## API security

Protect transport, authenticate the appropriate principal, enforce authorization at each boundary, validate input, and bound resource consumption. These categories align with [OWASP REST security guidance](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html); the endpoint-specific design remains in the API specification.

| Surface | Required proposed control |
| --- | --- |
| Transport/edge | HTTPS user/source entry, protected internal data connections, approved TLS/security-header profile; private repositories/archives not directly exposed |
| Browser requests | Origin/CSRF and explicit cross-origin allowlist; no credentialed wildcard CORS; approved content-security/frame policy for the eventual UI |
| Object/field authorization | Current scope before object reads, filters, aggregation, counts, joins, pagination and report access; learner/credential fields require distinct grants |
| Input/output | Strict allowed request fields/types/enums/date pairs/size, bounded searches/groups/arrays, safe output encoding, parameterized data queries, no executable caller filters/templates |
| Errors | 401 invalid session, 403 denied capability, indistinguishable 404 missing/forbidden object; safe messages/correlation only; no database/provider/payload details |
| Rate/resource limits | Per principal/source and costly operation; limits on metrics/groups, pagination, exports, recipients, payloads and queued work; bounded retries/timeouts; thresholds still pending |
| Cache/cursor/replay | Bind current action-specific scope/policy, subject when needed, context/snapshot/definitions; reauthorize before cache/idempotency return; revoke stale cursor access |
| Mutations | If-Match, strict field allowlist, atomic validation/write/audit and idempotency rules; no partial unseen assignment overwrite or mass assignment |
| Source ingress | Source namespace/device/center/event-family registration; durable receipts, identity/revision digest validation, atomic ledger/fact/outbox; no user-cookie ingestion |
| Source uncertainty | Unknown/referral/clock/conflict evidence stays unresolved; 202 receipt is not applied/published data or full synchronization |
| Reports/schedules | Protected generation/poll/content routes; owner/recipient intersections before computation; recheck at delivery and later access; no public artifact or inferred delivery success |
| Optional capability | Disabled/unimplemented features return explicit unsupported/denied state or no route; never mock success in enforced mode |

An application result may be unavailable because source/policy coverage is missing; that is not a reason to bypass authorization. Gate diagnostics and operations independently from ordinary health monitoring. No Force sync, attendance edit, assessment grading, certification issue, raw credential, or unrestricted cloud-management API is added by this strategy.

## Data security

### Classification and access

| Data class | Examples | Proposed treatment |
| --- | --- | --- |
| Scoped organizational monitoring | Center/geography/scheme labels and counts; batch/activity summaries | Organization/action-scope restricted; aggregate does not imply public data |
| Restricted learner/identity detail | Source learner keys, individual attendance/results, identity subjects, certificate identifiers | Minimize fields, use synthetic/anonymized labels in demonstration, require explicit detail capability in future production |
| Operational evidence | Sync conflicts, device mappings, audit locators, correlation/history | Sanitized diagnostics/evidence capabilities with source/organization scope; no raw imported payload by default |
| Secret material | Provider/service credentials, tokens, key material | Approved secret/key management outside browser, reports, fixtures and general logs; limited operational access |
| Derived/archive artifacts | Snapshots, cached metrics, report files and backups | Same classification as underlying data, immutable lineage and protected current access; cannot become a public bypass |

Encryption at rest and in transit is a proposed control for production data/artifacts/backups. Manage encryption keys separately from protected data, restrict key access, and define rotation/recovery ownership. Minimize retained sensitive content before choosing cryptographic storage; the general basis is [OWASP cryptographic-storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html). Algorithms, key service, retention periods, and operational recovery targets are not selected here.

### Integrity lineage and lifecycle

Enforce organization-preserving relationships, canonical source identity/revision uniqueness, effective mapping and supersession rules, and consistent eligibility/date meaning. Atomic deduplication protects counts under retries/concurrent workers. Metric definitions and publication manifests pin exact facts, dimensions, policies and coverage; report/current access is still rechecked independently.

Historical snapshots preserve facts received by the cutoff, not all offline activity. Do not classify missing learner evidence as absence/failure or derive an inactive center from sync age. Distinct learners and overlapping schemes require correct identity-aware aggregation; restricted global totals cannot be repurposed as scoped results after calculation.

Future optional spreadsheet exports need an approved inert-text policy for formula-like source labels; no macros/active imported content are proposed. Export metadata, row limits and exclusions remain visible. Private artifacts have reviewed expiry/deletion, current access and integrity checks; revocation prevents future access but cannot recall an already downloaded file.

Use isolated synthetic demonstration datasets, separate environments and approved configuration boundaries. No real learner data, production credentials, or copied production backups enter demo screenshots, fixtures or documentation. Deletion/anonymization, historical reproduction, legal obligations, backup retention and restore validation need stakeholder/domain review before production; no compliance status is asserted.

## Threats and future validation

| Scenario | Expected security result |
| --- | --- |
| Change center/district/region/block/snapshot/report ID in a direct request | Current object/action scope prevents disclosure; forbidden detail is indistinguishable from absent |
| Combine a powerful role from one assignment with another assignment's broader scope | Action-specific grant population prevents cross-assignment privilege spreading |
| Read cached metrics/cursor/replayed write after revocation | Current policy check denies/invalidate affected access before returning old data |
| Add learner/certificate fields to an aggregate query/export | Field capability prevents disclosure even when summary access is permitted |
| Broader requester schedules a result to narrower or revoked recipient | Per-recipient intersection or safe deny/regeneration; access/delivery rechecked |
| Replay identity callback or tamper role/organization/return path | Correlated identity validation and trusted server linkage reject the request |
| Unsafe cross-origin request or expired/idle session | Approved CSRF/origin and server timeout/revocation policy prevents the operation |
| Two workers process a duplicate/conflicting source revision | Atomic identity/fact/outbox handling prevents inflated facts; conflict remains evidence |
| Source payload asks for roles, another namespace or arbitrary table write | Source admission/field/event-family boundaries reject the escalation |
| Administrative save is stale or mandatory audit persistence fails | No blind overwrite or unaudited privileged commit; safe conflict/failure |
| Download a public artifact or read retired broader report content | Protected current-scope checks prevent artifact bypass; downloaded content handled by minimization policy |

QA/Security later execute scoped positive/negative tests for all four roles across relevant API groups and demonstrate denial in service-backed mode. Record resource/context versions, expected decision, actual result and evidence; a demo selector or document matrix alone does not prove enforcement. Review assumptions A-01/A-02/A-21/A-22/A-27/A-28 and the new A-29 security profile before implementation.

## Approval and completion boundaries

Choose approved role-capability bindings, exact scope/delegation and multi-role rules, provider/MFA/session/CSRF profiles, service credentials, timeout/rate limits, privileged change assurance, audit failure handling, encryption/key management, export/retention and operational recovery policies. Domain owners record acceptance in [assumptions](assumptions.md) and [governance](governance/registers.md). This security phase ends with a reviewable strategy and matrix; no accounts, grants, sessions, logs, encryption resources, or security tests are created or executed.
