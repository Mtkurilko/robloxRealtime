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
    <div>
      <Editor
      height="90vh"
      defaultLanguage="lua"
      value={code}
      defaultValue="// This is a placeholder, start below"
      onChange={handleCodeChange}
    />
    </div>
  );
}

export default App;