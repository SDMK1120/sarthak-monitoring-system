# Setup and development

**Status:** Foundation, Executive Dashboard, Center Monitoring and Synchronization Monitoring. **Date:** 2026-10-14.

## Scope and stack

The project uses npm workspaces with React 19, TypeScript 7, Vite 8, Tailwind 4, Fastify 5 and the PostgreSQL driver. Recharts renders dashboard charts; Zod validates shared API contracts. `package-lock.json` records exact versions. PostgreSQL 17 is the local container baseline. Executive Dashboard and Center Monitoring use shared synthetic in-memory facts; domain migrations, identity, role enforcement, source ingestion, reports and schedulers remain planned.

Vite's current Node requirement is 20.19+ or 22.12+; the workspace engine range reflects that. A maintained Node 22.12+ runtime is preferred for new environments; the installed Node 20.20.1 was also used for verification. See [Vite setup](https://vite.dev/guide/). Tailwind uses its [official Vite plugin](https://tailwindcss.com/docs/installation/using-vite), so no legacy PostCSS/Tailwind configuration is required.

The root overrides Fastify's injection helper to light-my-request 6.6.0 and uses concurrently 9 to retain Node 20 compatibility. The newer helper's transitive cookie package and concurrently 10 require Node 22. Revisit the compatibility override if the runtime floor is raised; a lockfile/install check and infrastructure tests cover it.

## Folder structure

```text
apps/
  api/
    .env.example
    package.json
    tsconfig.json
    tsconfig.test.json
    vitest.config.ts
    src/
      app.ts                 Fastify construction and infrastructure routes
      server.ts              startup and graceful shutdown
      config/env.ts          validated server configuration
      lib/database.ts        PostgreSQL pool and connectivity check
      lib/errors.ts          safe uniform API errors
      lib/logger.ts          structured logging/redaction
      modules/executive/     synthetic repository, calculations, service and routes
      modules/centers/       listing, geographic analysis, details service and routes
      modules/synchronization/ target evidence, alerts, escalation engine and routes
    test/                    infrastructure/environment and executive dashboard tests
  web/
    .env.example
    index.html
    vite.config.ts
    tsconfig.json
    src/
      main.tsx
      App.tsx                lazy-loaded module routes and loading fallback
      styles.css             Tailwind entry and base styles
      config/env.ts          public browser environment validation
      components/ErrorBoundary.tsx
      lib/api.ts             typed transport/envelope handling
      lib/logger.ts          minimal safe browser diagnostics
      features/executive/    dashboard, charts, table, filters, state and API service
      features/centers/      listing/details, URL navigation, filters, services and styles
      features/synchronization/ health, alerts, target details and rule previews
    test/                    frontend service and interaction tests
packages/shared/
  src/index.ts               errors, envelopes, pagination, health types
  src/dashboard.ts           runtime schemas and inferred dashboard types
  src/centers.ts             runtime center contracts and query validation
  src/synchronization.ts     monitoring contracts and escalation-rule validation
  package.json
  tsconfig.json
infra/
  docker-compose.yml         local PostgreSQL only
  migrations/.gitkeep        no business schema migrations yet
scripts/setup-env.mjs        copies missing .env templates without overwriting
docs/                        planning and implementation guides
package.json
package-lock.json
tsconfig.base.json
.env.example
.gitignore
.editorconfig
```

Build output is under each workspace's ignored `dist/`; node_modules, real environment files, logs and coverage are ignored. No git commit is created by this phase.

## First setup

1. Install compatible Node/npm and start Docker Desktop's Linux-container daemon if using Compose.
2. Run `npm ci` from the root for reproducible dependencies.
3. Run `npm run setup:env`. It creates only missing root/API/web `.env` files; existing configuration is preserved and values are not printed.
4. Review the three environment files. Local Compose credentials and the API connection URL must agree; the script does not resynchronize edited values.
5. Run `npm run db:config` to validate Compose, then `npm run db:up` to start only this project's PostgreSQL service and wait for its health check. Alternatively set an existing PostgreSQL connection URL and skip Compose.
6. Run `npm run dev`. Shared declarations watch for changes, Fastify reloads through tsx, and Vite serves the dashboard. Use Ctrl+C to stop the development processes. Database startup is optional for the synthetic dashboard.

`GET /api/health/live` returns a typed 200 liveness envelope independently of PostgreSQL; `GET /api/health/ready` runs `SELECT 1` and returns 200 when connected or safe 503 otherwise. Seven `/api/v1/dashboard/` endpoints implement the [Executive Dashboard contract](executive-dashboard.md); four `/api/v1/centers` endpoints implement [Center Monitoring](center-monitoring.md); six `/api/v1/synchronization` endpoints implement [Synchronization Monitoring](synchronization-monitoring.md). Other proposed platform endpoints remain planned.

The browser loads dashboard options and snapshot data through Vite's `/api` proxy. Synthetic data is labeled throughout; no login or role authorization is claimed.

## Environment variables

| Location | Variables | Behavior |
| --- | --- | --- |
| Root .env | POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT | Local Compose settings; defaults are development-only and loopback-bound |
| API .env | NODE_ENV, HOST, PORT, WEB_ORIGIN, LOG_LEVEL | Startup mode/bind address, exact browser origin and logging level; default port 3001 |
| API .env | DATABASE_URL | Required PostgreSQL URL; source URI credentials must be encoded if they contain special characters |
| API .env | DATABASE_POOL_MAX, DATABASE_CONNECTION_TIMEOUT_MS, DATABASE_QUERY_TIMEOUT_MS | Validated pool/query bounds; startup is lazy with readiness checking connectivity |
| API .env | DATABASE_TLS, DATABASE_CA_FILE | Explicit true/false; verified TLS and optional trusted CA. Production mode rejects disabled TLS; URL SSL override flags are rejected |
| Web .env | VITE_API_BASE_URL | Public root-relative API path or HTTP(S) URL without credentials/query/fragment; default /api |
| Web .env | API_PROXY_TARGET | Vite development and local preview proxy origin; not exposed as a browser environment variable |

`VITE_` variables are public bundle configuration; secrets belong only in the appropriate server/environment secret store. The API loads its own `.env` by module location, so it also starts from built output. Deployment-provided environment variables override file values. Invalid server configuration reports field names without credential values. Restart the appropriate app after environment changes.

## Commands

| Command | Purpose |
| --- | --- |
| npm run dev | Build shared package, then watch shared/API/frontend together |
| npm run demo | Copy missing environment templates, build all workspaces, serve compiled API and frontend on 3001/4173 |
| npm run demo:serve | Serve an already-built demonstration; no file watchers; Ctrl+C stops both processes |
| npm run typecheck | Strict source and API test/config checks |
| npm test | Shared build then API and frontend tests; no database required |
| npm run build | Build shared ESM/declarations, API JavaScript and frontend assets in dependency order |
| npm run format / format:check | Format / verify source and configuration with the pinned Prettier version |
| npm run check | Formatting, type checks, tests and production builds |
| npm run test:browser | Chromium integration tests; run npx playwright install chromium once; test runner owns development servers |
| npm run test:demo | The same browser scenarios against compiled API/frontend on 3001/4173; runner builds, starts and stops the demonstration |
| npm run start -w @sarthak/api | Run built Fastify output after build and environment setup |
| npm run preview -w @sarthak/web | Inspect built frontend on port 4173 with the local /api proxy; API must run separately |
| npm run db:config / db:up / db:logs / db:down | Validate/start/inspect/stop this project's local PostgreSQL |

Standalone workspace commands need the shared package built first. Local demo/preview explicitly proxies `/api`; Vite preview is a presentation tool rather than production hosting. A deployed frontend needs an /api reverse proxy or a separately built explicit API URL and matching origin, plus SPA fallback for center and synchronization routes. `db:down` retains database data in its named volume. No automatic data-volume deletion is provided.

## Logging and errors

Fastify uses structured Pino logging, with readable development output and JSON in other modes. Request IDs are server-generated and returned in `X-Request-Id`; an incoming header cannot replace them. Request logs omit query strings/headers/bodies, redaction covers credential fields, and database/unexpected-error diagnostics use safe event messages instead of raw secret-bearing errors. Logging configuration follows [Fastify logging](https://fastify.dev/docs/latest/Reference/Logging/).

Successes use shared data/meta envelopes; errors use code, safe message, request ID and retryability. Missing routes, malformed/unsupported/oversized payloads, schema validation, explicit safe application errors and unknown failures follow one handler. Unknown failures never expose messages/stacks to clients. Browser transport handles network/invalid/error envelopes and logs minimal code/correlation; React has a safe render error boundary.

The database pool has bounded connection/query waits, idle failure handling, verified optional TLS and close-on-shutdown. It does not run migrations or create domain tables. See [node-postgres connection configuration](https://node-postgres.com/features/connecting) for the underlying driver's connection model.

## Verification and practical limits

Run `npm run check` after changes. Infrastructure tests cover configuration, safe errors and connectivity behavior. Dashboard tests cover scoped metrics, status partitions, denominators, historical trends, request validation and frontend behavior. Real identity and offline source integration remain future work.

Docker's daemon was unavailable during the initial scaffold session. Compose syntax was validated, but a real PostgreSQL readiness-success check requires running Docker or a supplied PostgreSQL instance. The live app can still start and its readiness check should explicitly report unavailable. There is no claimed cloud deployment, production hardening, RBAC enforcement or installed business schema.
