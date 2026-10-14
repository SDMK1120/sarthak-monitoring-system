# Sarthak Monitoring System

Sarthak-Monitoring-System is a working demonstration dashboard for the vision of a centralized cloud platform supporting the Sarthak Offline-First LMS. Executive Dashboard, Center Monitoring and Synchronization Monitoring are implemented. Broader learning analytics, reporting and role-based access are documented future capabilities.

For stakeholder presentations, start with the [final summary report](docs/final-summary-report.md) and [stakeholder demo guide](docs/stakeholder-demo-guide.md). After installing dependencies, run `npm run demo` to build and serve the compiled application at `http://127.0.0.1:4173` with its API proxy. `npm run test:demo` verifies the compiled presentation flow.

Implementation Phase 2 adds a working Executive Dashboard with center KPIs, scheme distribution, batch analytics, synchronization health, historical charts and scoped filters. React/TypeScript/Vite/Tailwind uses a Fastify/TypeScript API and shared runtime-validated contracts. Dashboard data comes from a deterministic synthetic repository; PostgreSQL remains configured for future persistence. Authentication/RBAC, source ingestion, schema migrations and reporting are planned.

From the repository root:

```sh
npm ci
npm run setup:env
npm run dev
```

The frontend is at `http://127.0.0.1:5173`, and the API is at `http://127.0.0.1:3001`. The synthetic dashboard works without PostgreSQL. To start the optional local database, run `npm run db:up` with a running Docker daemon. Readiness reports 503 until PostgreSQL is reachable.

Center Monitoring adds a dedicated searchable directory, activity/geographic analysis, filters, drilldowns and center details at `/centers`. It uses the same synthetic snapshot as the Executive Dashboard. See [Center Monitoring](docs/center-monitoring.md) for its API contracts and calculation rules.

Synchronization Monitoring at `/synchronization` adds target health, failed-transfer monitoring, exact timestamps, generated alerts and editable escalation previews. See [Synchronization Monitoring](docs/synchronization-monitoring.md). Rules are previewed per request; no external notification is sent.

Run `npm run check` for type checks, backend/frontend tests and builds. See [Executive Dashboard implementation](docs/executive-dashboard.md) and [environment setup](docs/getting-started.md) for contracts, metric semantics, configuration and testing.

Start with the [documentation index](docs/README.md) and [overall project plan](docs/project-plan.md). The [agent charters](docs/agents/agent-charters.md) define the 13 specialized AI roles.
