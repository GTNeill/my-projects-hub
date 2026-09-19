import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, orpc } from "../lib/api";

export function useProjects() {
  return useQuery(orpc.projects.list.queryOptions({ staleTime: 30_000 }));
}

export function useMe() {
  return useQuery(orpc.projects.me.queryOptions());
}

export function useAllProjects(enabled: boolean) {
  return useQuery(orpc.projects.listAll.queryOptions({ enabled, retry: false }));
}

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: orpc.projects.key() });
}

export function useCreateProject() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.create.mutationOptions({ onSuccess: invalidate }));
}

export function useUpdateProject() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.update.mutationOptions({ onSuccess: invalidate }));
}

export function useRemoveProject() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.remove.mutationOptions({ onSuccess: invalidate }));
}

export function useMoveProject() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.move.mutationOptions({ onSuccess: invalidate }));
}

export function useRefreshScreenshot() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.refreshScreenshot.mutationOptions({ onSuccess: invalidate }));
}

export function useCaptureMissing() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.captureMissing.mutationOptions({ onSuccess: invalidate }));
}

export function useClearShot() {
  const invalidate = useInvalidate();
  return useMutation(orpc.projects.clearShot.mutationOptions({ onSuccess: invalidate }));
}

/**
 * Uploads an image for one project. The file rides along in the RPC call and
 * the server writes it to the instance filesystem.
 */
export function useUploadShot() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      if (!file.type.startsWith("image/")) throw new Error("Pick an image file (PNG or JPG).");
      if (file.size > 8 * 1024 * 1024) throw new Error("Image is larger than 8MB.");
      return client.projects.uploadShot({ id, file });
    },
    onSuccess: invalidate,
  });
}
