import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../database";
import { siteSettings } from "../database/schema";
import { admin, withUser } from "../middleware/auth";

export const settings = {
  get: withUser.handler(async () => {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
    return { tidycalUrl: row?.tidycalUrl ?? "https://tidycal.com/gneill" };
  }),
  update: admin.input(z.object({
    tidycalUrl: z.string().trim().url("Enter a complete booking URL.").refine(
      (url) => new URL(url).protocol === "https:",
      "Use an HTTPS booking URL.",
    ),
  })).handler(async ({ input }) => {
    await db.insert(siteSettings).values({ id: 1, ...input }).onConflictDoUpdate({
      target: siteSettings.id,
      set: input,
    });
    return input;
  }),
};