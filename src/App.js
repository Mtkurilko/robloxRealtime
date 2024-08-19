import React, { useEffect, useState } from 'react';

import Editor from '@monaco-editor/react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [code, setCode] = useState('');

  useEffect(() => {
    socket.on('codeUpdate', (data) => {
      setCode(data);
    });

    return () => {
      socket.off('codeUpdate');
    };
  }, []);

  const handleCodeChange = (value,event) => {
    setCode(value);
    socket.emit('codeUpdate', value);
  };

  return (
    <div className="Box">
      <Editor
        theme="vs-dark"
        height="90vh"
        width="45vw"
        defaultLanguage="lua"
        value={code}
        defaultValue="// 'This is a placeholder, start below'"
        onChange={handleCodeChange}
        className="Edit-Box"
      />
    </div>
  );
}

export default App;