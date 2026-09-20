import type { RouterClient } from "@orpc/server";
import { eq } from "drizzle-orm";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { projects } from "./routes/projects";
import { auth } from "./auth";
import { db } from "./database";
import * as schema from "./database/schema";
import { contentTypeFor, readShot } from "./lib/shot-store";

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
 */
app.get("/api/diag", async (c) => {
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

  return c.json({
    websiteUrl: process.env.WEBSITE_URL ?? null,
    googleRedirectUri: process.env.WEBSITE_URL
      ? `${process.env.WEBSITE_URL.replace(/\/+$/, "")}/api/auth/callback/google`
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
