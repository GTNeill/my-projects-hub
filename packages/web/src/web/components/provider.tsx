import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authClient } from "../lib/auth";
import { applyStoredTheme } from "../lib/theme";

const queryClient = new QueryClient();

interface ProviderProps {
  children: React.ReactNode;
}

// App-level providers — add theme/context providers here, wrapping children.
// QueryClientProvider must stay (all API calls run through TanStack Query).
export function Provider({ children }: ProviderProps) {
  useEffect(() => {
    applyStoredTheme();
    // Finishes the returning leg of a managed sign-in redirect; no-op otherwise.
    void authClient.managedAuth.handleRedirect();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
