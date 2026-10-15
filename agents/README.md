# Repository-local agent team

This directory preserves reusable instructions for the team defined in the project charters. It also maps the specialist names used during delivery. These are local agent definitions and prompts, not running processes or exported conversation histories.

## Files

- [Project entry instructions](../AGENTS.md): baseline for all roles.
- [Workflow](workflow.md): dependencies, ownership, review gates and execution.
- [Task and handoff template](task-template.md): reusable assignment contract.
- [Execution history](execution-history.md): confirmed implementation assignments and historical names.
- [Machine-readable manifest](manifest.json): canonical roles, prompt paths and Codex files.
- [Codex project configuration](../.codex/config.toml): at most three child threads in addition to the primary; no model or permission overrides.

## Canonical roles

| ID | Agent | Reusable prompt | Codex definition |
| --- | --- | --- | --- |
| `orchestrator` | Project Orchestrator Agent | [Role guide](roles/orchestrator.md) | [TOML](../.codex/agents/orchestrator.toml) |
| `product_manager` | Product Manager Agent | [Role guide](roles/product_manager.md) | [TOML](../.codex/agents/product_manager.toml) |
| `business_analyst` | Business Analyst Agent | [Role guide](roles/business_analyst.md) | [TOML](../.codex/agents/business_analyst.toml) |
| `solution_architect` | Solution Architect Agent | [Role guide](roles/solution_architect.md) | [TOML](../.codex/agents/solution_architect.toml) |
| `ui_ux` | UI/UX Agent | [Role guide](roles/ui_ux.md) | [TOML](../.codex/agents/ui_ux.toml) |
| `database_architect` | Database Architect Agent | [Role guide](roles/database_architect.md) | [TOML](../.codex/agents/database_architect.toml) |
| `backend` | Backend Agent | [Role guide](roles/backend.md) | [TOML](../.codex/agents/backend.toml) |
| `frontend` | Frontend Agent | [Role guide](roles/frontend.md) | [TOML](../.codex/agents/frontend.toml) |
| `analytics` | Analytics Agent | [Role guide](roles/analytics.md) | [TOML](../.codex/agents/analytics.toml) |
| `reporting` | Reporting Agent | [Role guide](roles/reporting.md) | [TOML](../.codex/agents/reporting.toml) |
| `security` | Security Agent | [Role guide](roles/security.md) | [TOML](../.codex/agents/security.toml) |
| `qa` | QA Agent | [Role guide](roles/qa.md) | [TOML](../.codex/agents/qa.toml) |
| `devops` | DevOps Agent | [Role guide](roles/devops.md) | [TOML](../.codex/agents/devops.toml) |
| `documentation` | Documentation Agent | [Role guide](roles/documentation.md) | [TOML](../.codex/agents/documentation.toml) |

The 13 specialists are the original requested team. The orchestrator is an additional coordination role. The complete catalogue does not mean every role independently executed each delivered feature.

## Historical delivery names

| Name | Canonical role | Local Codex definition |
| --- | --- | --- |
| `executive_backend` | [`backend`](roles/backend.md) | [TOML](../.codex/agents/executive_backend.toml) |
| `executive_frontend` | [`frontend`](roles/frontend.md) | [TOML](../.codex/agents/executive_frontend.toml) |
| `executive_qa` | [`qa`](roles/qa.md) | [TOML](../.codex/agents/executive_qa.toml) |
| `architecture_phase` | [`solution_architect`](roles/solution_architect.md) | [TOML](../.codex/agents/architecture_phase.toml) |

Use canonical roles for new assignments. Compatibility names preserve the observed specialist identifiers without maintaining duplicate role guides.

## Use with Codex

Open or reopen this repository in a Codex session that loads its project configuration. The native definitions are the standalone TOML files under `.codex/agents/`; each names the role and instructs it to read its local Markdown guide. Model, reasoning, provider, tools and permission settings remain inherited. Availability also depends on the client and workspace configuration.

Example request inside the repository:

> Use the orchestrator to coordinate a monitoring change. Assign the backend and frontend agents separate files, then ask executive_qa for independent verification. Read the local role definitions and agree on the shared contract before implementation.

For a read-only review:

> Use security to review the API trust boundaries and documentation to check the stakeholder claims. Return findings without changing application code.

Creating the files does not automatically start the team, modify your global settings or consume model calls. A session starts work only when you ask it to perform a task.

## Use with another assistant

Provide [AGENTS.md](../AGENTS.md), the relevant role Markdown file and a completed [task template](task-template.md). The role guides use plain Markdown and repository-relative paths. Other tools may require their own adapter; the native TOML files target Codex rather than claiming automatic discovery everywhere.

## Maintenance

Keep behavior and file paths aligned with the implementation guides. Change a canonical Markdown role once; aliases refer to that guide. Update the manifest and catalogue when adding/removing a role. Preserve current user authorization over historical planning-stage restrictions.

Format the manifest with the project formatter, check relative links, and validate native definitions before handoff. Do not overwrite an existing user's global configuration, credentials or session transcripts.

Native file layout and inheritance were checked against [official OpenAI documentation: custom subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
