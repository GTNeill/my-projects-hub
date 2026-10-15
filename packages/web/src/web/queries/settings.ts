import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useSettings() {
  return useQuery(orpc.settings.get.queryOptions({ staleTime: 30_000 }));
}

export function useBookingUrl() {
  return useSettings().data?.tidycalUrl ?? "https://tidycal.com/gneill";
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation(orpc.settings.update.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orpc.settings.key() });
    },
  }));
}