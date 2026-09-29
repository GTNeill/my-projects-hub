import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

/** Copy for the About card. Fetched on page load so the card is ready on click. */
export function useAbout() {
  return useQuery(orpc.about.get.queryOptions({ staleTime: 60_000 }));
}

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: orpc.about.key() });
}

export function useUpdateAbout() {
  const invalidate = useInvalidate();
  return useMutation(orpc.about.update.mutationOptions({ onSuccess: invalidate }));
}

export function useResetAbout() {
  const invalidate = useInvalidate();
  return useMutation(orpc.about.reset.mutationOptions({ onSuccess: invalidate }));
}
