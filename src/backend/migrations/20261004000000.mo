import AccessControl "mo:caffeineai-authorization/access-control";
import BaseOrderedMap "mo:base/OrderedMap";
import BaseText "mo:base/Text";
import Map "mo:core/Map";

module {
  // Pre-conversion (deployed) stable shape: the legacy document registry only,
  // backed by mo:base/OrderedMap.
  type FileReference = {
    path : Text;
    hash : Text;
  };

  type OldRegistry = {
    var references : BaseOrderedMap.Map<Text, FileReference>;
  };

  public type OldActor = {
    registry : OldRegistry;
  };

  // New shape: authorization state added alongside the preserved registry,
  // renamed to `documentRegistry` to avoid colliding with the OQL Expose
  // mixin's internal `registry` binding, and migrated to mo:core/Map.
  type NewRegistry = {
    var references : Map.Map<Text, FileReference>;
  };

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    documentRegistry : NewRegistry;
  };

  public func migration(old : OldActor) : NewActor {
    let oldMap = BaseOrderedMap.Make(BaseText.compare);
    let references = Map.empty<Text, FileReference>();
    for ((path, ref) in oldMap.entries(old.registry.references)) {
      references.add(path, ref);
    };
    {
      accessControlState = AccessControl.initState();
      documentRegistry = { var references };
    };
  };
};
