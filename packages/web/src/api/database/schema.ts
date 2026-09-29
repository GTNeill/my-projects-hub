import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

/** A project shown on the public index page. */
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  /** S3 key of the captured screenshot, null until the first capture succeeds. */
  screenshotKey: text("screenshot_key"),
  /** Bumped on every successful capture — used as a cache-busting version. */
  screenshotVersion: integer("screenshot_version").notNull().default(0),
  /** "auto" = captured from the live URL, "upload" = an image the admin uploaded. */
  shotSource: text("shot_source", { enum: ["auto", "upload"] })
    .notNull()
    .default("auto"),
  screenshotUpdatedAt: integer("screenshot_updated_at", { mode: "timestamp" }),
  /** Manual image override; when set it wins over the captured screenshot. */
  imageUrl: text("image_url"),
  hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Project = typeof projects.$inferSelect;

/**
 * Copy for the About card behind the "Built by George Neill" byline.
 *
 * One row, always id 1. A missing row means "nothing has been edited yet", and
 * the API answers with the defaults in ../lib/about.ts instead.
 */
export const aboutCard = sqliteTable("about_card", {
  id: integer("id").primaryKey(),
  /** Card title, shown above the bio. */
  heading: text("heading").notNull().default(""),
  /** The bio as written in the admin textarea: paragraphs split by a blank line. */
  bio: text("bio").notNull().default(""),
  /** Empty hides the LinkedIn pill. */
  linkedinUrl: text("linkedin_url").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type AboutCardRow = typeof aboutCard.$inferSelect;
