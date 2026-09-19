import { z } from "zod";
import { asc, eq, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { deleteShot, extFor, writeShot } from "../lib/shot-store";
import { db } from "../database";
import * as schema from "../database/schema";
import { admin, withUser, adminEmails } from "../middleware/auth";
import { captureScreenshot, hostOf, normalizeUrl } from "../lib/screenshot";

type Row = schema.Project;

function shape(row: Row) {
  return {
    id: row.id,
    title: row.title,
    url: normalizeSafe(row.url),
    host: hostOf(row.url),
    tagline: row.tagline,
    description: row.description,
    image: row.imageUrl?.trim()
      ? row.imageUrl.trim()
      : row.screenshotKey
        ? `/api/shot/${row.id}?v=${row.screenshotVersion}`
        : null,
    hasShot: Boolean(row.screenshotKey || row.imageUrl?.trim()),
    shotSource: row.shotSource,
    imageUrl: row.imageUrl ?? "",
    hidden: row.hidden,
    featured: row.featured,
    sortOrder: row.sortOrder,
    screenshotUpdatedAt: row.screenshotUpdatedAt,
  };
}

function normalizeSafe(raw: string) {
  try {
    return normalizeUrl(raw);
  } catch {
    return raw;
  }
}

async function byId(id: number): Promise<Row> {
  const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!row) throw new ORPCError("NOT_FOUND", { message: "Project not found" });
  return row;
}

async function refreshShot(row: Row) {
  try {
    const key = await captureScreenshot(row.id, row.url);
    if (row.screenshotKey && row.screenshotKey !== key) await deleteShot(row.screenshotKey);
    await db
      .update(schema.projects)
      .set({
        screenshotKey: key,
        screenshotVersion: row.screenshotVersion + 1,
        screenshotUpdatedAt: new Date(),
        shotSource: "auto",
        updatedAt: new Date(),
      })
      .where(eq(schema.projects.id, row.id));
    return { ok: true as const, message: "Screenshot updated" };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error ? error.message : "Capture failed" };
  }
}

export const projects = {
  /** Public list — visible projects only. */
  list: withUser.handler(async () => {
    const rows = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.hidden, false))
      .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id));
    return rows.map(shape);
  }),

  /** Who am I / am I allowed in the admin console. */
  me: withUser.handler(({ context }) => {
    const allowed = adminEmails();
    const email = context.user?.email?.toLowerCase() ?? "";
    return {
      signedIn: Boolean(context.user),
      email: context.user?.email ?? null,
      name: context.user?.name ?? null,
      isAdmin: Boolean(context.user) && (allowed.length === 0 || allowed.includes(email)),
    };
  }),

  /** Admin list — everything, hidden included. */
  listAll: admin.handler(async () => {
    const rows = await db
      .select()
      .from(schema.projects)
      .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id));
    return rows.map(shape);
  }),

  create: admin
    .input(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
        tagline: z.string().default(""),
        description: z.string().default(""),
        hidden: z.boolean().default(false),
      }),
    )
    .handler(async ({ input }) => {
      const [{ max }] = await db
        .select({ max: sql<number>`coalesce(max(${schema.projects.sortOrder}), 0)` })
        .from(schema.projects);
      const [row] = await db
        .insert(schema.projects)
        .values({
          title: input.title.trim(),
          url: normalizeSafe(input.url),
          tagline: input.tagline.trim(),
          description: input.description.trim(),
          hidden: input.hidden,
          sortOrder: (max ?? 0) + 10,
        })
        .returning();
      void refreshShot(row);
      return shape(row);
    }),

  update: admin
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        url: z.string().min(1).optional(),
        tagline: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        hidden: z.boolean().optional(),
        featured: z.boolean().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const row = await byId(input.id);
      const next: Partial<Row> = { updatedAt: new Date() };
      if (input.title !== undefined) next.title = input.title.trim();
      if (input.url !== undefined) next.url = normalizeSafe(input.url);
      if (input.tagline !== undefined) next.tagline = input.tagline;
      if (input.description !== undefined) next.description = input.description;
      if (input.imageUrl !== undefined) next.imageUrl = input.imageUrl.trim();
      if (input.hidden !== undefined) next.hidden = input.hidden;
      if (input.featured !== undefined) next.featured = input.featured;
      await db.update(schema.projects).set(next).where(eq(schema.projects.id, input.id));
      const urlChanged = next.url !== undefined && next.url !== row.url;
      // Never overwrite an image the admin uploaded by hand.
      if (urlChanged && row.shotSource !== "upload") void refreshShot({ ...row, ...next } as Row);
      return shape({ ...row, ...next } as Row);
    }),

  remove: admin.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    await byId(input.id);
    await db.delete(schema.projects).where(eq(schema.projects.id, input.id));
    return { ok: true };
  }),

  /** Move a project one slot up or down in the public order. */
  move: admin
    .input(z.object({ id: z.number(), direction: z.enum(["up", "down"]) }))
    .handler(async ({ input }) => {
      const rows = await db
        .select()
        .from(schema.projects)
        .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id));
      const index = rows.findIndex((r) => r.id === input.id);
      if (index === -1) throw new ORPCError("NOT_FOUND");
      const swapWith = input.direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= rows.length) return { ok: true };
      const reordered = [...rows];
      [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
      await Promise.all(
        reordered.map((row, i) =>
          db
            .update(schema.projects)
            .set({ sortOrder: (i + 1) * 10, updatedAt: new Date() })
            .where(eq(schema.projects.id, row.id)),
        ),
      );
      return { ok: true };
    }),

  /** Re-capture one screenshot, synchronously so the admin sees the result. */
  refreshScreenshot: admin.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    const row = await byId(input.id);
    return refreshShot(row);
  }),

  /**
   * Store an image the admin uploaded for this project. Used for the projects
   * sitting behind an auth wall, where no capture service can reach them.
   */
  uploadShot: admin
    .input(
      z.object({
        id: z.number(),
        file: z.file().max(8 * 1024 * 1024, "Image is larger than 8MB."),
      }),
    )
    .handler(async ({ input }) => {
      const row = await byId(input.id);
      const ext = extFor(input.file.type);
      if (!ext) {
        throw new ORPCError("BAD_REQUEST", { message: "Upload a PNG, JPG or WebP image." });
      }
      const key = `${input.id}-upload-${Date.now()}.${ext}`;
      await writeShot(key, new Uint8Array(await input.file.arrayBuffer()));
      if (row.screenshotKey) await deleteShot(row.screenshotKey);

      const next: Partial<Row> = {
        screenshotKey: key,
        screenshotVersion: row.screenshotVersion + 1,
        screenshotUpdatedAt: new Date(),
        shotSource: "upload",
        updatedAt: new Date(),
      };
      await db.update(schema.projects).set(next).where(eq(schema.projects.id, input.id));
      return shape({ ...row, ...next } as Row);
    }),

  /** Drop the current image entirely, so the card falls back to the placeholder. */
  clearShot: admin.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    const row = await byId(input.id);
    if (row.screenshotKey) await deleteShot(row.screenshotKey);
    const next: Partial<Row> = {
      screenshotKey: null,
      screenshotUpdatedAt: null,
      shotSource: "auto",
      updatedAt: new Date(),
    };
    await db.update(schema.projects).set(next).where(eq(schema.projects.id, input.id));
    return shape({ ...row, ...next } as Row);
  }),

  /** Capture every project that has no screenshot yet. */
  captureMissing: admin.handler(async () => {
    const rows = await db.select().from(schema.projects);
    const pending = rows.filter((r) => !r.screenshotKey && !r.imageUrl?.trim());
    const results = [];
    for (const row of pending) results.push({ id: row.id, ...(await refreshShot(row)) });
    return { attempted: pending.length, results };
  }),
};
