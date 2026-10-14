# Local infrastructure

`docker-compose.yml` defines PostgreSQL 17 for development, bound to loopback, with a named data volume and health check. Run `npm run setup:env` and `npm run db:up` from the repository root with Docker running. Root `.env` holds Compose settings; `apps/api/.env` holds the matching connection URL.

`npm run db:down` stops this project's container and retains its volume. There are no business tables, migrations, seeds, or schema initialization scripts. Use an existing PostgreSQL instance instead by setting the API's `DATABASE_URL`. Container credentials in examples are for local development only.
