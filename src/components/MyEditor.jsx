import React from 'react';
import MonacoEditor from 'react-monaco-editor';

const MyEditor = () => {
  const editorDidMount = (editor, monaco) => {
    monaco.languages.register({ id: 'lua' });
    monaco.languages.setMonarchTokensProvider('lua', {
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, 'identifier'],
          [/--.*/, 'comment'],
          [/[{}()\[\]]/, '@brackets'],
          [/[<>]/, '@brackets'],
          [/\d+/, 'number'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop'],
        ],
      },
    });
  };

  return (
    <MonacoEditor
      width="800"
      height="600"
      language="lua"
      theme="vs-dark"
      value="-- Your Lua code here"
      editorDidMount={editorDidMount}
    />
  );
};

export default MyEditor;