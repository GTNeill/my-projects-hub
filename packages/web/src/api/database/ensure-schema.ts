import { sql } from "drizzle-orm";
import { db } from "./__client";

/**
 * Creates the tables this app needs if the database it is pointed at does not
 * have them yet, then reports what it found.
 *
 * Why this exists: the schema was only ever applied by running `drizzle-kit
 * push` by hand from a laptop against whatever DATABASE_URL happened to be in
 * the local .env. A deployed instance pointed at any other database — a fresh
 * Turso db, a different account, a restored one — came up with no tables at
 * all, and the only symptom was a 500 on every request and "no such table:
 * verification" the moment anyone tried to sign in. A deploy should be able to
 * stand itself up against an empty database.
 *
 * Every statement is CREATE ... IF NOT EXISTS, so this is a no-op on a database
 * that is already set up and it never touches existing rows. It is not a
 * migration system: it creates missing tables, and does not alter tables that
 * exist but are out of date. Column changes still need a real migration.
 *
 * The DDL is drizzle-kit's own output for ./schema.ts and ./auth-schema.ts, so
 * it must be regenerated (`drizzle-kit generate`) whenever those change.
 */
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS projects (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    tagline text DEFAULT '' NOT NULL,
    description text DEFAULT '' NOT NULL,
    screenshot_key text,
    screenshot_version integer DEFAULT 0 NOT NULL,
    shot_source text DEFAULT 'auto' NOT NULL,
    screenshot_updated_at integer,
    image_url text,
    hidden integer DEFAULT false NOT NULL,
    featured integer DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS user (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified integer DEFAULT false NOT NULL,
    image text,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS user_email_unique ON user (email)`,
  `CREATE TABLE IF NOT EXISTS session (
    id text PRIMARY KEY NOT NULL,
    expires_at integer NOT NULL,
    token text NOT NULL,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS session_token_unique ON session (token)`,
  `CREATE INDEX IF NOT EXISTS session_userId_idx ON session (user_id)`,
  `CREATE TABLE IF NOT EXISTS account (
    id text PRIMARY KEY NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at integer,
    refresh_token_expires_at integer,
    scope text,
    password text,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade
  )`,
  `CREATE INDEX IF NOT EXISTS account_userId_idx ON account (user_id)`,
  `CREATE TABLE IF NOT EXISTS verification (
    id text PRIMARY KEY NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at integer NOT NULL,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification (identifier)`,
];

/** Host only — it says which database is wired up without leaking the token. */
function databaseHost() {
  try {
    return process.env.DATABASE_URL
      ? new URL(process.env.DATABASE_URL.replace(/^libsql:/, "https:")).host
      : "unset";
  } catch {
    return "unparseable";
  }
}

export async function ensureSchema() {
  const host = databaseHost();
  try {
    const before = await db.all<{ name: string }>(
      sql`select name from sqlite_master where type = 'table' order by name`,
    );
    const had = before.map((row) => row.name).filter((name) => !name.startsWith("sqlite_"));

    for (const statement of STATEMENTS) await db.run(sql.raw(statement));

    const after = await db.all<{ name: string }>(
      sql`select name from sqlite_master where type = 'table' order by name`,
    );
    const now = after.map((row) => row.name).filter((name) => !name.startsWith("sqlite_"));
    const created = now.filter((name) => !had.includes(name));

    // Always logged: on a deployed instance this line is the only way to tell
    // which database the running container actually reached.
    console.log(
      `[schema] db=${host} tables=${now.join(",") || "none"}` +
        (created.length ? ` created=${created.join(",")}` : " created=none"),
    );
    return { host, tables: now, created };
  } catch (error) {
    // Never take the process down over this — a bad DATABASE_URL should still
    // serve the site and show up in the logs rather than crash-loop.
    const chain: string[] = [];
    let current: unknown = error;
    while (current instanceof Error && chain.length < 5) {
      chain.push(current.message);
      current = current.cause;
    }
    console.error(`[schema] db=${host} failed: ${chain.join(" <- ") || "unknown error"}`);
    return { host, tables: [], created: [], error: chain.join(" <- ") };
  }
}
