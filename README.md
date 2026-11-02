# RegisterFlow

Point-of-sale web application for neighborhood corner shops (Harbor Street Market, Elmwood Corner Grocer, and Beacon Hill Provisions).

## Quick Start

```bash
cp .env.example .env && createdb registerflow
npm install
npm run db:migrate && npm run db:seed
npm run dev
npm test
```

## Workspaces

- `web/`: React 18, Vite, TypeScript, React Router, TanStack Query, CSS Modules.
- `api/`: Node 22, Express, TypeScript, Zod validation, `pg` with SQL queries.
- `db/`: Numbered PostgreSQL schema migrations and deterministic seed data (3 stores, 40 products, 150 historical sales).
