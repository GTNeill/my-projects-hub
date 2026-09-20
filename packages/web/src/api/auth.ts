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
export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL,
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
