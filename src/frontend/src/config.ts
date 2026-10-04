// Local re-export of the platform config loader.
// The real implementation lives in @caffeineai/core-infrastructure; this
// module exists so app code can import `loadConfig` from a stable local path.
export { loadConfig } from "@caffeineai/core-infrastructure";
export type { CreateActorOptions, createActorFunction } from "@caffeineai/core-infrastructure";
