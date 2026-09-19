import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { auth } from "../auth";

/** Emails allowed into the admin console (root .env: ADMIN_EMAILS=a@b.com,c@d.com). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Optional auth — `context.user` is the session user or null. */
export const withUser = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  return next({ context: { user: session?.user ?? null } });
});

/** Admin-only procedures — signed in AND on the allowlist. */
export const admin = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) throw new ORPCError("UNAUTHORIZED");
  const allowed = adminEmails();
  const email = session.user.email?.toLowerCase() ?? "";
  if (allowed.length > 0 && !allowed.includes(email)) {
    throw new ORPCError("FORBIDDEN", { message: "This account is not an admin." });
  }
  return next({ context: { user: session.user } });
});
