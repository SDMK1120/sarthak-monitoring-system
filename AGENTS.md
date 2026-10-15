# Sarthak Monitoring System project instructions

## Project and current delivery

This repository is a stakeholder demonstration for a centralized monitoring platform supporting the Sarthak Offline-First LMS. Executive Dashboard, Center Monitoring and Synchronization Monitoring are implemented. Business data is a deterministic synthetic snapshot; identity/RBAC, real ingestion, PostgreSQL domain persistence, report delivery and operational notifications remain future work.

Read the relevant implementation guide before changing behavior: [Executive Dashboard](docs/executive-dashboard.md), [Center Monitoring](docs/center-monitoring.md), [Synchronization Monitoring](docs/synchronization-monitoring.md). Use [known assumptions](docs/known-assumptions.md) for metric boundaries. Earlier design documents describe the broader target platform.

## Local team

The [agent catalogue](agents/README.md) links the orchestrator, 13 specialist roles and historical runtime aliases. Reusable role instructions live in `agents/roles/`; project-local Codex definitions live in `.codex/agents/`. Read the assigned role and [handoff workflow](agents/workflow.md) before acting as a specialist.

Creating or reading definitions does not start agents. When the user requests team work, assign ready bounded tasks within available runtime capacity. Use a single owner for shared schemas, manifests and integration files. Avoid overlapping edits. The project configuration caps child threads at three in addition to the primary; a stricter runtime limit wins. Preserve the parent model and permissions unless explicitly instructed otherwise.

Honor the current user scope: a documentation-only assignment produces documentation, and an implementation assignment changes only the authorized feature. Existing historical planning restrictions do not freeze later user-authorized implementation.

## Engineering conventions

- Frontend: React, TypeScript, Vite, Tailwind and Recharts under `apps/web`.
- Backend: Fastify/TypeScript under `apps/api`; shared Zod contracts/types under `packages/shared`.
- Source facts: `apps/api/src/modules/executive/repository.ts`; reuse them across modules.
- Coordinate shared contracts before parallel API/UI implementation. Preserve strict validation, safe envelopes, deterministic pagination, snapshot context and abort-safe requests.
- Keep center activity, connectivity and synchronization health independent. Unknown activity is not inactive; missing sync evidence is not a known failure.
- Weighted utilization uses summed comparable seats/capacity and disclosed exclusions. Separate creation-period flows from fixed-cutoff stock and enrollment records from unique learners.
- Escalation previews are request-local, leave default rules unchanged and send no notifications. Disabling recipient recommendations retains alerts.
- Use Prettier through `npm run format` / `npm run format:check`. Markdown layout is intentionally outside that formatter.
- Follow existing accessible labels, chart data-table alternatives, responsive styles, loading/error/empty states and URL-preserved drilldowns.

## Verification and operation

Run checks appropriate to the change. `npm run check` covers formatting, source/test types, API/frontend tests and builds. `npm run db:config` validates Compose without needing a running Docker daemon.

Use `npm run test:browser` for development-browser scenarios or `npm run test:demo` for the same scenarios against compiled output. These commands own temporary servers; keep their ports free and coordinate with other agents.

Local dev uses 5173/API3001. Compiled presentation mode uses `npm run demo` on 4173/API3001 with an explicit proxy. Do not launch both modes on API3001. Stop only processes owned by your task; leave a user-requested running application available unless the user requests otherwise.

Synthetic monitoring does not require a running database, but valid environment configuration is required. Database readiness may be 503 while the demo works. Never include local environment values, credentials, logs or generated artifacts in commits.

## Handoff and publishing

Report changed files, actual commands/results, unresolved issues and downstream owners. Claim only tests you executed or evidence clearly attributed to an independent reviewer. Do not fabricate historical agent contributions.

Commit, push, publish, deploy or send external messages only when authorized by the current task/session. Inherit permission and approval settings; do not add global model, credential or sandbox overrides to repository agent definitions.
