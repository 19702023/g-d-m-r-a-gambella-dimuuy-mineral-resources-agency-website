import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Types "../types/common";

module {
  public type FileReference = Types.FileReference;

  /// Persistent document reference store, keyed by document path.
  public type Registry = {
    var references : Map.Map<Text, FileReference>;
  };

  public func new() : Registry {
    { var references = Map.empty() };
  };

  public func add(registry : Registry, path : Text, hash : Text) {
    registry.references.add(path, { path; hash });
  };

  public func get(registry : Registry, path : Text) : FileReference {
    registry.references.get(path) ?? Runtime.trap("Inexistent file reference");
  };

  public func list(registry : Registry) : [FileReference] {
    registry.references.values().toArray();
  };

  public func remove(registry : Registry, path : Text) {
    registry.references.remove(path);
  };
};
