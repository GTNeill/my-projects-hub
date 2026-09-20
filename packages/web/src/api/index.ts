import type { RouterClient } from "@orpc/server";
import { eq } from "drizzle-orm";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { projects } from "./routes/projects";
import { auth, publicBaseUrl } from "./auth";
import { adminEmails } from "./middleware/auth";
import { db } from "./database";
import * as schema from "./database/schema";
import { ensureSchema } from "./database/ensure-schema";
import { contentTypeFor, readShot } from "./lib/shot-store";

// Stand the schema up before serving, so an instance pointed at an empty
// database works instead of 500ing on every query. Awaited on purpose: it is
// one round trip at boot, and answering requests against a table-less database
// only produces errors nobody can act on. Logs which database it reached.
const schemaState = await ensureSchema();

// API features are oRPC procedures, one file per feature in ./routes/,
// composed into this router — typed end-to-end via the clients
// (web: src/web/lib/api.ts, mobile: lib/api.ts).
export const router = {
  ping,
  projects,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

/**
 * Config check for a deployed instance: which env vars arrived, and whether the
 * database answers. Reports presence only — never a value that is a secret.
 *
 * Admin session required. Even presence booleans and the database hostname map
 * out the deployment for anyone who asks, so this is not public.
 */
app.get("/api/diag", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const allowed = adminEmails();
  const email = session?.user.email?.toLowerCase() ?? "";
  if (!session || (allowed.length > 0 && !allowed.includes(email))) {
    return c.json({ error: "Not found" }, 404);
  }

  const present = (name: string) => Boolean(process.env[name]?.trim());
  // Drizzle's top-level message is just the SQL, so walk the cause chain —
  // that is where libsql puts "no such table" vs an auth/URL failure.
  let database = "ok";
  try {
    await db.select().from(schema.projects).limit(1);
  } catch (error) {
    const chain: string[] = [];
    let current: unknown = error;
    while (current instanceof Error && chain.length < 5) {
      chain.push(current.message);
      current = current.cause;
    }
    database = chain.length ? chain.join(" <- ") : "failed";
  }

  // Host only: it identifies which Turso database is wired up, and the
  // credential that must stay secret is the auth token, not the hostname.
  let databaseHost: string | null = null;
  try {
    databaseHost = process.env.DATABASE_URL
      ? new URL(process.env.DATABASE_URL.replace(/^libsql:/, "https:")).host
      : null;
  } catch {
    databaseHost = "unparseable";
  }

  // The derived base URL, not the raw env var: that is what better-auth
  // actually hands Google, and what the Google Console entry has to match.
  const resolvedBaseUrl = publicBaseUrl();

  return c.json({
    websiteUrl: process.env.WEBSITE_URL ?? null,
    resolvedBaseUrl: resolvedBaseUrl ?? null,
    googleRedirectUri: resolvedBaseUrl
      ? `${resolvedBaseUrl}/api/auth/callback/google`
      : null,
    env: {
      DATABASE_URL: present("DATABASE_URL"),
      DATABASE_AUTH_TOKEN: present("DATABASE_AUTH_TOKEN"),
      BETTER_AUTH_SECRET: present("BETTER_AUTH_SECRET"),
      GOOGLE_CLIENT_ID: present("GOOGLE_CLIENT_ID"),
      GOOGLE_CLIENT_SECRET: present("GOOGLE_CLIENT_SECRET"),
      ADMIN_EMAILS: present("ADMIN_EMAILS"),
      SHOTS_DIR: process.env.SHOTS_DIR ?? null,
    },
    database,
    databaseHost,
    schema: schemaState,
  });
});

/** Serves a project's stored screenshot off the instance filesystem. */
app.get("/api/shot/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) return c.json({ error: "Bad id" }, 400);
  const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!row?.screenshotKey) return c.json({ error: "No screenshot" }, 404);
  const bytes = await readShot(row.screenshotKey);
  if (!bytes) return c.json({ error: "Screenshot unavailable" }, 404);
  return new Response(bytes, {
    status: 200,
    headers: {
      "content-type": contentTypeFor(row.screenshotKey),
      "cache-control": "public, max-age=604800",
    },
  });
});

export default app;
