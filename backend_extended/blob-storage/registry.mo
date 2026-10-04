import OrderedMap "mo:base/OrderedMap";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

module {
    public type FileReference = {
        path : Text;
        hash : Text;
    };

    public type Registry = {
        var references : OrderedMap.Map<Text, FileReference>;
        var blobsToRemove : List.List<Text>;
        var gatewayPrincipals : List.List<Principal>;
    };

    public func new() : Registry {
        let pathMap = OrderedMap.Make<Text>(Text.compare);
        let references = pathMap.empty<FileReference>();
        {
            var references;
            var blobsToRemove = List.nil<Text>();
            var gatewayPrincipals = List.nil<Principal>();
        };
    };

    public func add(registry : Registry, path : Text, hash : Text) {
        let pathMap = OrderedMap.Make<Text>(Text.compare);
        let fileReference = { path; hash };
        registry.references := pathMap.put(registry.references, path, fileReference);
    };

    public func get(registry : Registry, path : Text) : FileReference {
        let pathMap = OrderedMap.Make<Text>(Text.compare);
        switch (pathMap.get(registry.references, path)) {
            case null Debug.trap("Inexistent file reference");
            case (?fileReference) fileReference;
        };
    };

    public func list(registry : Registry) : [FileReference] {
        let pathMap = OrderedMap.Make<Text>(Text.compare);
        Iter.toArray(pathMap.vals(registry.references));
    };

    public func remove(registry : Registry, path : Text) {
        let pathMap = OrderedMap.Make<Text>(Text.compare);
        switch (pathMap.get(registry.references, path)) {
            case null {};
            case (?fileReference) {
                registry.blobsToRemove := List.push(fileReference.hash, registry.blobsToRemove);
            };
        };
        registry.references := pathMap.remove(registry.references, path).0;
    };

    public func requireAuthorized(registry : Registry, caller : Principal, cashier : Text) : async () {
        let cashierPrincipal = Principal.fromText(cashier);
        if (not Principal.equal(caller, cashierPrincipal)) {
            Debug.trap("Unauthorized: caller is not the storage cashier");
        };
    };

    public func getBlobsToRemove(registry : Registry) : [Text] {
        List.toArray(registry.blobsToRemove);
    };

    public func clearBlobsRemoved(registry : Registry, hashes : [Text]) : Nat {
        var removed = 0;
        for (hash in hashes.vals()) {
            let (kept, dropped) = List.partition<Text>(registry.blobsToRemove, func(h) { not Text.equal(h, hash) });
            registry.blobsToRemove := kept;
            if (List.size(dropped) > 0) {
                removed += 1;
            };
        };
        removed;
    };

    public func updateGatewayPrincipals(registry : Registry, cashier : Text) : async () {
        let cashierPrincipal = Principal.fromText(cashier);
        if (not List.some<Principal>(registry.gatewayPrincipals, func(p) { Principal.equal(p, cashierPrincipal) })) {
            registry.gatewayPrincipals := List.push(cashierPrincipal, registry.gatewayPrincipals);
        };
    };
};
