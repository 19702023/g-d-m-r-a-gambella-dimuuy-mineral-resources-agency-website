# Project Guidance

## User Preferences

- Delete control belongs on the 'Available Documents' list items
- PDF upload must work reliably end-to-end

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- FileStorage uses the platform @caffeineai/object-storage StorageClient with a separate HttpAgent built from loadConfig().backend_host and useInternetIdentity().identity; config.ts re-exports loadConfig and hooks/useActor.ts re-exports useActor from @caffeineai/core-infrastructure.
- useFileUrl uses staleTime: Infinity, so any path whose hash can change (re-upload) must invalidate ['fileUrl', path] on mutation, not just ['fileList'].
- pnpm bindgen reads src/backend/dist/backend.did, so the mops-built src/backend/main.mo is the authoritative actor; dfx.json's backend_extended path is stale.
- Motoko has no triple-quoted string literals; build multi-line text with #-concatenated single-line literals using \n escapes.
- The OQL Expose mixin declares an internal transient let registry; an actor field also named registry collides (M0051) — rename the actor field and map it in the migration.
