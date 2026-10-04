export const idlFactory = ({ IDL }) => {
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  return IDL.Service({
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
