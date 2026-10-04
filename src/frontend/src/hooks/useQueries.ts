import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { FileReference } from "../backend";
import { useActor } from "./useActor";

export function useFileReferences() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FileReference[]>({
    queryKey: ["fileList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFileReferences();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFileReference(path: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FileReference>({
    queryKey: ["fileReference", path],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getFileReference(path);
    },
    enabled: !!actor && !isFetching && !!path,
  });
}

export function useRegisterFileReference() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ path, hash }: { path: string; hash: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerFileReference(path, hash);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
}

export function useDropFileReference() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.dropFileReference(path);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
}
