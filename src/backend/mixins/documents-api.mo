import Registry "../blob-storage/registry";
import Types "../types/common";

mixin (registry : Registry.Registry) {
  /// Register (or overwrite) the reference for a document path.
  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    ignore caller;
    Registry.add(registry, path, hash);
  };

  /// Look up a single document reference by path. Traps when the path is unknown.
  public query ({ caller }) func getFileReference(path : Text) : async Types.FileReference {
    ignore caller;
    Registry.get(registry, path);
  };

  /// List every registered document reference.
  public query ({ caller }) func listFileReferences() : async [Types.FileReference] {
    ignore caller;
    Registry.list(registry);
  };

  /// Remove a document reference by path. Removing an unknown path is a no-op.
  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    ignore caller;
    Registry.remove(registry, path);
  };
};
