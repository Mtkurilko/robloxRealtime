import React, { useEffect, useState } from 'react';
import LuaRunner from './components/LuaRunner';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import InputBox from "./components/InputBox";
import { useFileContent } from './components/useFileContent';

const socket = io('http://localhost:4000');

function App() {
  const [code, setCode] = useState('');
  const { fileContent, loadCode, handleFileChange } = useFileContent();

  useEffect(() => {
    socket.on('codeUpdate', (data) => {
      setCode(data);
    });

    return () => {
      socket.off('codeUpdate');
    };
  }, []);

  const handleCodeChange = (value, event) => {
    setCode(value);
    socket.emit('codeUpdate', value);
  };

  const handleFileLoad = (content) => {
    setCode(content); // Update the editor with the file content
    socket.emit('codeUpdate', content);
  };

  return (
    <>
      <div className="InputArea">
        <InputBox onFileLoad={handleFileLoad} />
      </div>
      <div className="Box">
        <Editor
          theme="vs-dark"
          height="90vh"
          width="45vw"
          defaultLanguage="lua"
          value={code}
          defaultValue="-- 'This is a placeholder, start below'"
          onChange={handleCodeChange}
          className="Edit-Box"
        />
      </div>
      <div className="consoleArea">
        <LuaRunner code={code} />
      </div>
    </>
  );
}

export default App;
