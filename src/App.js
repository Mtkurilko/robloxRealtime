import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import MyEditor from './components/MyEditor'

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

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    socket.emit('codeUpdate', e.target.value);
  };

  return (
    <div>
      <MyEditor
        value={code}
        onChange={handleCodeChange}
      />
    </div>
  );
}

export default App;