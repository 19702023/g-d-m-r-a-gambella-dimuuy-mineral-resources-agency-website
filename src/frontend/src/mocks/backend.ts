import type { backendInterface, FileReference, Result, Result__1, UserRole } from "../backend";

const sampleFiles: FileReference[] = [
  { path: "documents/annual-report.pdf", hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90" },
  { path: "documents/mining-permit.pdf", hash: "0f1e2d3c4b5a69788796a5b4c3d2e1f0" },
];

export const mockBackend: backendInterface = {
  _initialize_access_control: async () => undefined,
  _internet_identity_sign_in_finish: async (): Promise<Result__1> => ({ __kind__: "ok", ok: null }),
  _internet_identity_sign_in_start: async (): Promise<Uint8Array> => new Uint8Array(),
  assignCallerUserRole: async (_user, _role: UserRole) => undefined,
  dropFileReference: async (path: string) => {
    const idx = sampleFiles.findIndex((f) => f.path === path);
    if (idx >= 0) sampleFiles.splice(idx, 1);
  },
  execute: async (_qJson: string): Promise<Result> => ({ hasMore: false, rows: [] }),
  getApiDoc: async () => "# Backend API",
  getCallerUserRole: async () => "admin" as UserRole,
  getFileReference: async (path: string): Promise<FileReference> => {
    const found = sampleFiles.find((f) => f.path === path);
    if (!found) throw new Error(`Unknown path: ${path}`);
    return found;
  },
  isCallerAdmin: async () => true,
  listFileReferences: async (): Promise<Array<FileReference>> => [...sampleFiles],
  registerFileReference: async (path: string, hash: string) => {
    const existing = sampleFiles.find((f) => f.path === path);
    if (existing) existing.hash = hash;
    else sampleFiles.push({ path, hash });
  },
  schema: async () => "{}",
};
