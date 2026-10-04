import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createActor } from "../backend";
import type { FileReference } from "../backend";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";

// Build a storage client bound to the current identity. The platform's
// createActorWithConfig builds its own HttpAgent the same way; the generated
// Backend wrapper does not expose the agent, so we construct one here.
async function createStorageClient(identity: unknown): Promise<StorageClient> {
  const envConfig = await loadConfig();
  const agent = new HttpAgent({
    host: envConfig.backend_host,
    identity: identity as never,
  });
  if (envConfig.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running",
      );
      console.error(err);
    });
  }
  return new StorageClient(
    envConfig.bucket_name,
    envConfig.storage_gateway_url,
    envConfig.backend_canister_id,
    envConfig.project_id,
    agent,
  );
}

// Hook to fetch the list of files
export const useFileList = () => {
  const { actor } = useActor(createActor);

  return useQuery<FileReference[]>({
    queryKey: ["fileList"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend is not available");
      return await actor.listFileReferences();
    },
    enabled: !!actor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Unified hook for getting file URLs
export const useFileUrl = (path: string) => {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();

  const getFileReference = async (path: string) => {
    if (!actor) throw new Error("Backend is not available");
    const storageClient = await createStorageClient(identity);
    const fileReference = await actor.getFileReference(path);
    return await storageClient.getDirectURL(fileReference.hash);
  };

  return useQuery({
    queryKey: ["fileUrl", path],
    queryFn: () => getFileReference(path),
    enabled: !!path && !!actor,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useFileUpload = () => {
  const { actor } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const [isUploading, setIsUploading] = useState(false);
  const { invalidateFileList } = useInvalidateQueries();

  const uploadFile = async (
    path: string,
    data: File,
    onProgress?: (percentage: number) => void,
  ): Promise<{
    path: string;
    hash: string;
    url: string;
  }> => {
    if (!actor) {
      throw new Error("Backend is not available");
    }

    const envConfig = await loadConfig();
    if (
      !envConfig.storage_gateway_url ||
      envConfig.storage_gateway_url === "nogateway"
    ) {
      throw new Error("Storage is not configured for this deployment");
    }

    const storageClient = await createStorageClient(identity);

    setIsUploading(true);

    try {
      const bytes = new Uint8Array(await data.arrayBuffer());
      const { hash } = await storageClient.putFile(
        bytes,
        onProgress,
        data.type || "application/pdf",
        data.name,
      );
      await actor.registerFileReference(path, hash);
      await invalidateFileList();
      const url = await storageClient.getDirectURL(hash);
      return { path, hash, url };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};

export const useFileDelete = () => {
  const { actor } = useActor(createActor);
  const [isDeleting, setIsDeleting] = useState(false);
  const { invalidateFileList, invalidateFileUrl } = useInvalidateQueries();

  const deleteFile = async (path: string): Promise<void> => {
    if (!actor) {
      throw new Error("Backend is not available");
    }

    setIsDeleting(true);

    try {
      await actor.dropFileReference(path);
      await invalidateFileList();
      invalidateFileUrl(path);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFile, isDeleting };
};

// Utility to invalidate queries
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateFileList: () =>
      queryClient.invalidateQueries({ queryKey: ["fileList"] }),
    invalidateFileUrl: (path: string) =>
      queryClient.invalidateQueries({ queryKey: ["fileUrl", path] }),
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
      queryClient.invalidateQueries({ queryKey: ["fileUrl"] });
    },
  };
};
