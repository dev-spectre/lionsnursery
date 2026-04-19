# Lions Nursery

Next.js app for Lions Landscape Nursery (catalogue, orders, admin).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and set `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and other required variables.

## Database

```bash
npm run db:migrate    # local development
npm run db:seed       # optional seed data
```

## Deploy on Vercel

1. **Environment variables** (Project → Settings → Environment Variables): set at least `DATABASE_URL` (Neon or Postgres), `AUTH_SECRET`, `AUTH_URL` (your production site URL, e.g. `https://your-app.vercel.app`), `ADMIN_EMAIL`, and any Cloudinary or email variables you use. Vercel injects these at build and runtime; you do not rely on `.env.local` in the cloud.

2. **Build command**
   - **`npm run build`** (default in `package.json`): runs `prisma generate` then `next build`. Use this if migrations are applied separately or you want the build to succeed without running migrations against the database during CI.
   - **`npm run build:vercel`**: runs `prisma generate`, **`prisma migrate deploy`**, then `next build`. Use only when `DATABASE_URL` is set on Vercel and the database is reachable during the build (needed for migrate-on-build).

3. **Prisma client**: `postinstall` runs `prisma generate`, so the client is generated after `npm install` on Vercel. Ensure lifecycle scripts are not disabled in the install command.

4. **Prisma config**: `prisma.config.ts` reads `DATABASE_URL` via `env("DATABASE_URL")`. The variable name in Vercel must match.

See [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying) for general Vercel setup.
