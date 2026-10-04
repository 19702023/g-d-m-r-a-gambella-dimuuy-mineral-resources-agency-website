import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import TextValue "mo:caffeineai-oql/TextValue";
import Registry "../src/backend/blob-storage/registry";
import DocumentsApi "../src/backend/mixins/documents-api";
import ApiDocMixin "../src/backend/mixins/api-doc";

persistent actor Main {
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
