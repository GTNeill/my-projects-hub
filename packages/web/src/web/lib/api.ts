import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouterClient } from "../../api";

const link = new RPCLink({
  url: `${window.location.origin}/api/rpc`,
  // The Better Auth session rides along as a first-party cookie.
  fetch: (request, init) => fetch(request, { ...init, credentials: "include" }),
});

/** Direct typed client: await client.projects.list() */
export const client: AppRouterClient = createORPCClient(link);

/** TanStack Query helpers: useQuery(orpc.projects.list.queryOptions()) */
export const orpc = createTanstackQueryUtils(client);
