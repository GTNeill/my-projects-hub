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
| `WEBSITE_URL` | `https://tech.gneill.net` — **not** the `localhost:4200` value the local `.env` carries |
| `GOOGLE_CLIENT_ID` | from `.env`, see §4 |
| `GOOGLE_CLIENT_SECRET` | from `.env`, see §4 |
| `AI_GATEWAY_BASE_URL` | from `.env` (unused today, keep for parity) |
| `AI_GATEWAY_API_KEY` | from `.env` |
| `AUTUMN_SECRET_KEY` | from `.env` |
| `NODE_ENV` | `production` |
| `SHOTS_DIR` | `/data/shots` (already the Dockerfile default) |

`PORT` is injected by Railway; the server reads it.

If the service still carries `APPLICATION_ID`, `RUNABLE_URL`,
`VITE_RUNABLE_AUTH_ISSUER` or `VITE_APPLICATION_ID` from an earlier deploy,
delete them. Nothing reads them any more (see §4).

### The `VITE_*` ones are build-time, not runtime

Vite inlines them when the image is built, so setting them as plain service
variables does nothing. Add them as **build args** (Settings → Build → Build
Arguments), or leave them off and take the Dockerfile defaults:

| Build arg | Default baked into the Dockerfile |
| --- | --- |
| `VITE_REFERRAL_CODE` | `gtn` |
| `VITE_SUPPORT_URL` | `https://ko-fi.com/georgeneill` |

Nothing auth-related is a build arg. The Google credentials are read by the
server at runtime only.

## 4. Google sign-in on `/admin`

`/admin` used to sign in through Runable's managed-auth broker. That broker
validates the calling origin against Runable's own record for this app, and
that record only ever allowed the Runable preview origin — `tech.gneill.net`
came back `Unrecognized managed auth origin`, and there is no app-side setting
that changes it. So the app now uses **its own Google OAuth client** through
Better Auth's native `socialProviders.google`.

Set up once, in Google Cloud Console → APIs & Services → Credentials:

1. Create Credentials → OAuth client ID → **Web application**.
2. Authorized redirect URIs — add exactly:
   - `https://tech.gneill.net/api/auth/callback/google`
   - optionally `http://localhost:4200/api/auth/callback/google`, if you want
     to click through a real Google sign-in on the dev server. Production does
     not need it.
3. Put the client ID and secret into `GOOGLE_CLIENT_ID` /
   `GOOGLE_CLIENT_SECRET`, both locally and in Railway.

The redirect URI is always `<WEBSITE_URL>/api/auth/callback/google`, and it has
to match the Google Console entry exactly — scheme, host, no trailing slash. A
mismatch shows up as Google's `redirect_uri_mismatch` error page instead of the
consent screen.

To stop the most common version of that mistake, the app normalises
`WEBSITE_URL` before handing it to better-auth: a missing scheme or a plain
`http://` one is upgraded to `https://` for any non-localhost host, and
trailing slashes are stripped. `localhost` and `127.0.0.1` keep `http`. So the
production redirect URI is `https://tech.gneill.net/api/auth/callback/google`
even if the Railway variable says `http://tech.gneill.net` — but set it with
`https://` anyway, since other things read the variable raw.

`GET /api/diag` reports `resolvedBaseUrl` and `googleRedirectUri`: those are
the values actually sent to Google, so compare the Console entry against them
rather than against the env var.

Sessions are first-party cookies now (no bearer tokens), so the API and the
frontend must be served from the same origin — which they are, one Bun process.

## 5. Domain

Service → Settings → Networking → Custom Domain → `tech.gneill.net`. Railway
gives you a CNAME target; add it at your DNS host as a CNAME for `tech`.

Then set `WEBSITE_URL=https://tech.gneill.net` and confirm the matching
redirect URI is registered on the Google OAuth client (§4).

## 6. Checking the config of a running instance

`GET /api/diag` reports which variables actually reached the container, the
redirect URI it will send to Google, and whether the database answers. It needs
an admin session — signed out, it 404s — so open it in the browser after signing
in at `/admin`.

It is the fastest way to diagnose a sign-in failure, because the two things that
break it are invisible from outside: missing Google credentials, and a database
that cannot be written to (Better Auth stores the OAuth state row before it
redirects you to Google, so a dead database fails sign-in with an empty 500).

Watch for `http` vs `https` in `websiteUrl` — the redirect URI has to match the
Google Console entry exactly, and a scheme mismatch alone is enough to fail.

## 7. First deploy: re-capture screenshots

The volume starts empty while the database still points at screenshot keys from
this sandbox. Once the site is up, sign in at `/admin` and hit **Refresh** on
each project (or clear + "Capture missing") so the images get written to the
volume. Uploads for the auth-walled projects need re-doing by hand there too.

## Local development

`bun run dev` on port 4200. Screenshots go to `./.data/shots` (gitignored) via
`SHOTS_DIR` in the root `.env`.
