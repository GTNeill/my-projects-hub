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
