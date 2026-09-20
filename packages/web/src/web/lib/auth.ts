import { createAuthClient } from "better-auth/react";

/**
 * Plain Better Auth client — the session is a first-party cookie on this
 * origin, so no bearer-token plugin is needed.
 */
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  basePath: "/api/auth",
});
