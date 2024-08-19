import React, { useEffect, useState } from 'react';
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

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    socket.emit('codeUpdate', e.target.value);
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={handleCodeChange}
        rows="20"
        cols="60"
      ></textarea>
    </div>
  );
}

export default App;