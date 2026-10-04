mixin () {
  /// Static Markdown documentation of the backend's public API.
  public query func getApiDoc() : async Text {
    "# Document Storage Backend\n\n" #
    "This canister stores references to PDF documents whose bytes live off-chain in\n" #
    "the Caffeine storage gateway. It does not store file bytes itself: each record\n" #
    "is a `FileReference { path : Text; hash : Text }` where `path` is the logical\n" #
    "document path (for example `documents/report.pdf`) and `hash` is the content\n" #
    "hash returned by the storage gateway after upload.\n\n" #
    "## Public methods\n\n" #
    "### `registerFileReference(path : Text, hash : Text) : async ()`\n" #
    "Update call. Creates or overwrites the reference for `path`. Calling it twice\n" #
    "with the same `path` replaces the previous hash, so it is idempotent for a\n" #
    "given `(path, hash)` pair. No authorization check is applied: any caller may\n" #
    "register a reference.\n\n" #
    "### `getFileReference(path : Text) : async FileReference`\n" #
    "Query call. Returns the reference for `path`. Traps with\n" #
    "`Inexistent file reference` when no reference is registered for that path.\n\n" #
    "### `listFileReferences() : async [FileReference]`\n" #
    "Query call. Returns every registered reference. The order is unspecified.\n\n" #
    "### `dropFileReference(path : Text) : async ()`\n" #
    "Update call. Removes the reference for `path`. Removing an unknown path is a\n" #
    "no-op and does not trap. This only removes the on-chain reference; the\n" #
    "off-chain blob is reclaimed by the storage gateway's own garbage collection.\n\n" #
    "### `getApiDoc() : async Text`\n" #
    "Query call. Returns this document.\n\n" #
    "## Authentication and identity\n\n" #
    "The document methods above are intentionally open: they do not require a signed\n" #
    "caller and do not check a role, so anonymous callers can list and read\n" #
    "references. The canister also exposes the standard Caffeine authorization\n" #
    "surface (`_initialize_access_control`, `getCallerUserRole`, `isCallerAdmin`,\n" #
    "`assignCallerUserRole`, and the Internet Identity sign-in helpers). The first\n" #
    "signed-in caller of `_initialize_access_control` becomes `admin`; later callers\n" #
    "become `user`. A caller that never registered is unregistered, and\n" #
    "`getCallerUserRole` traps with `User is not registered` for it.\n\n" #
    "The app's frontend pins an Internet Identity derivation origin, published at\n" #
    "`/.well-known/ii-derivation-origin` when available. An agent already holding\n" #
    "the user's Internet Identity authorization derives the correct per-app\n" #
    "principal against that origin (for example\n" #
    "`icp identity link web <name> --app <host>`). Such a delegation acts with the\n" #
    "user's full authority in this app until it expires.\n\n" #
    "## Units and encodings\n\n" #
    "- `path` and `hash` are UTF-8 `Text`.\n" #
    "- `hash` is the storage gateway's content hash string; it is opaque to this\n" #
    "  canister and is passed through unchanged.\n" #
    "- `FileReference` is a Candid record with fields `path` and `hash`.\n\n" #
    "## Lifecycle and polling\n\n" #
    "`registerFileReference` and `dropFileReference` are update calls and complete\n" #
    "only after the state change is committed. `getFileReference` and\n" #
    "`listFileReferences` are query calls and may be served from a replica that is\n" #
    "slightly behind; poll `listFileReferences` after an update if you need to\n" #
    "observe the change immediately.\n\n" #
    "## Mutation retry safety\n\n" #
    "`registerFileReference` is idempotent for a given `(path, hash)`: retrying a\n" #
    "failed call is safe. `dropFileReference` is idempotent: retrying after a\n" #
    "successful delete is a no-op. Neither method returns a value, so a caller that\n" #
    "loses the response can safely retry.\n\n" #
    "## Errors and gotchas\n\n" #
    "- `getFileReference` traps for an unknown path; use `listFileReferences` when\n" #
    "  the path may not exist.\n" #
    "- `dropFileReference` does not delete the off-chain blob, only the reference.\n" #
    "- The canister stores references only; uploading and downloading bytes is the\n" #
    "  frontend's responsibility through the storage gateway.\n";
  };
};
