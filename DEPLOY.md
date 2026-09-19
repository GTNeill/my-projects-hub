# Deploying to Railway

The app is a single Bun service: it serves the built React frontend and the
Hono/oRPC API from one process (`packages/web/src/__server.ts`).

## 1. Create the service

New Project → Deploy from GitHub repo → pick this repo. Railway reads
`railway.json` and builds with the `Dockerfile`, so no builder config is needed.

## 2. Attach a volume — REQUIRED

Screenshots live on the service's own filesystem, and Railway wipes the
container filesystem on every deploy. Without a volume, every image disappears
the next time you push.

Service → Settings → Volumes → New Volume, **mount path `/data`**.

The Dockerfile already sets `SHOTS_DIR=/data/shots`, so nothing else is needed
once the volume is mounted. 1 GB is plenty — the whole set is a few MB.

## 3. Environment variables

Copy these from the local root `.env` into Railway's service variables:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Turso libsql URL |
| `DATABASE_AUTH_TOKEN` | Turso token |
| `BETTER_AUTH_SECRET` | keep the same value, or every session is invalidated |
| `ADMIN_EMAILS` | `george@gneill.net` |
| `WEBSITE_URL` | `https://tech.gneill.net` |
| `APPLICATION_ID` | from `.env` |
| `RUNABLE_URL` | from `.env` |
| `AI_GATEWAY_BASE_URL` | from `.env` (unused today, keep for parity) |
| `AI_GATEWAY_API_KEY` | from `.env` |
| `AUTUMN_SECRET_KEY` | from `.env` |
| `NODE_ENV` | `production` |
| `SHOTS_DIR` | `/data/shots` (already the Dockerfile default) |

`PORT` is injected by Railway; the server reads it.

### The `VITE_*` ones are build-time, not runtime

Vite inlines them when the image is built, so setting them as plain service
variables does nothing. Add them as **build args** (Settings → Build → Build
Arguments), or leave them off and take the Dockerfile defaults:

| Build arg | Default baked into the Dockerfile |
| --- | --- |
| `VITE_REFERRAL_CODE` | `gtn` |
| `VITE_SUPPORT_URL` | `https://ko-fi.com/georgeneill` |
| `VITE_RUNABLE_AUTH_ISSUER` | none — **must be passed**, Google sign-in on `/admin` breaks without it |
| `VITE_APPLICATION_ID` | none — **must be passed**, same reason |

Take the last two from the local `.env`.

## 4. Domain

Service → Settings → Networking → Custom Domain → `tech.gneill.net`. Railway
gives you a CNAME target; add it at your DNS host as a CNAME for `tech`.

Then set `WEBSITE_URL=https://tech.gneill.net` and add the same origin to the
allowed redirect/callback list on the Runable managed-auth application, or the
Google sign-in round trip will bounce.

## 5. First deploy: re-capture screenshots

The volume starts empty while the database still points at screenshot keys from
this sandbox. Once the site is up, sign in at `/admin` and hit **Refresh** on
each project (or clear + "Capture missing") so the images get written to the
volume. Uploads for the auth-walled projects need re-doing by hand there too.

## Local development

`bun run dev` on port 4200. Screenshots go to `./.data/shots` (gitignored) via
`SHOTS_DIR` in the root `.env`.
