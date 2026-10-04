module {
  /// A reference to a document stored off-chain.
  /// `path` is the logical document path (for example `documents/report.pdf`).
  /// `hash` is the content hash returned by the storage gateway.
  public type FileReference = {
    path : Text;
    hash : Text;
  };
};
