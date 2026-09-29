import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../database";
import * as schema from "../database/schema";
import { admin, withUser } from "../middleware/auth";
import { DEFAULT_ABOUT, bioParagraphs } from "../lib/about";

/** The single row this table ever holds. */
const ROW_ID = 1;

function shape(row: { heading: string; bio: string; linkedinUrl: string }) {
  return {
    heading: row.heading.trim() || DEFAULT_ABOUT.heading,
    /** Raw text, for the admin textarea. */
    bio: row.bio,
    /** Split for rendering, so the card does no parsing of its own. */
    paragraphs: bioParagraphs(row.bio),
    linkedinUrl: row.linkedinUrl.trim(),
  };
}

async function read() {
  const [row] = await db
    .select()
    .from(schema.aboutCard)
    .where(eq(schema.aboutCard.id, ROW_ID));
  // No row means nothing has been edited yet — serve what the site ships with.
  return shape(row ?? DEFAULT_ABOUT);
}

async function write(values: { heading: string; bio: string; linkedinUrl: string }) {
  await db
    .insert(schema.aboutCard)
    .values({ id: ROW_ID, ...values, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.aboutCard.id,
      set: { ...values, updatedAt: new Date() },
    });
  return shape(values);
}

export const about = {
  /** Public — the copy the About card renders. */
  get: withUser.handler(read),

  update: admin
    .input(
      z.object({
        heading: z.string().min(1, "Give the card a heading."),
        bio: z.string().min(1, "The bio cannot be empty."),
        // Blank is allowed on purpose: it hides the LinkedIn pill.
        linkedinUrl: z.union([z.literal(""), z.string().url("Enter a full URL, including https://")]),
      }),
    )
    .handler(({ input }) =>
      write({
        heading: input.heading.trim(),
        bio: input.bio.trim(),
        linkedinUrl: input.linkedinUrl.trim(),
      }),
    ),

  /** Puts the shipped wording back, for when an edit went wrong. */
  reset: admin.handler(() => write({ ...DEFAULT_ABOUT })),
};
