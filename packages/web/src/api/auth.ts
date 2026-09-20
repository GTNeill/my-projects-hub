import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";

/**
 * Google sign-in against this app's own Google Cloud OAuth client.
 *
 * The app used to authenticate through Runable's managed-auth broker, but that
 * broker only accepts redirect origins registered on the Runable application
 * record — it rejects tech.gneill.net with "Unrecognized managed auth origin".
 * Owning the OAuth client removes that dependency.
 *
 * Authorized redirect URI to register in Google Cloud:
 *   <WEBSITE_URL>/api/auth/callback/google
 */

/**
 * The public origin this app is served from, used to build the OAuth redirect
 * URI. Google matches that URI as an exact string, so the scheme has to be
 * right: a WEBSITE_URL of `http://tech.gneill.net` sends Google a plain-http
 * redirect_uri and sign-in dies with `Error 400: redirect_uri_mismatch`.
 *
 * Anything that isn't localhost is served over TLS, so upgrade the scheme here
 * rather than trusting the deployment's env var to carry it. Trailing slashes
 * go too, or better-auth emits a doubled `//api/auth`.
 */
export function publicBaseUrl(): string | undefined {
  const raw = process.env.WEBSITE_URL?.trim();
  if (!raw) return undefined;

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return raw.replace(/\/+$/, "");
  }

  const isLocal =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]";
  if (!isLocal) url.protocol = "https:";

  return url.toString().replace(/\/+$/, "");
}

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: publicBaseUrl(),
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: { enabled: false },
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: (request) => {
    const origin = request?.headers.get("origin");
    return origin ? [origin] : [];
  },
});
