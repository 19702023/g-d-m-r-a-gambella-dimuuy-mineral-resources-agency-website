import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import TextValue "mo:caffeineai-oql/TextValue";
import Registry "blob-storage/registry";
import DocumentsApi "mixins/documents-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let documentRegistry : Registry.Registry;

  include MixinAuthorization(accessControlState, null);
  include DocumentsApi(documentRegistry);
  include ApiDocMixin();

  include Expose({
    entities = [
      documentRegistry.references.toEntity("document", "FileReference", "path")
        .sample({ path = "documents/example.pdf"; hash = "0" })
        .public_()
        .build(),
    ];
  });
};
