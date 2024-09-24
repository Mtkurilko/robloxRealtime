import React, { useEffect, useState, useRef } from 'react';
import LuaRunner from './components/LuaRunner';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import InputBox from "./components/InputBox";
import { useFileContent } from './components/useFileContent';

const socket = io('http://localhost:4000');

socket.on('roomCreated', (roomId) => {
  // When the room is created
});

socket.on('userJoined', (message) => {
  // Something to do when other user's join
});

function App() {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('null');
  const { fileContent, loadCode, handleFileChange } = useFileContent();
  const usernameRef = useRef('null');  // useRef to store username


  useEffect(() => {
    function onJoin() {
      let storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        usernameRef.current = storedUsername;  // Keep ref updated
        socket.emit('createRoom', storedUsername);
      } else {
        const newUsername = (Math.random() + 1).toString(36).substring(2);
        localStorage.setItem('username', newUsername);
        setUsername(newUsername);
        usernameRef.current = newUsername;  // Keep ref updated
        socket.emit('createRoom', newUsername);
        }
      }

    // Call onJoin once on component mount
    onJoin();

    // Clean up the socket connection
    return () => {
      // socket.off('codeUpdate');
    };
  }, []);

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
    socket.emit('codeUpdate', value, username);
  };

  const handleFileLoad = (content) => {
    setCode(content); // Update the editor with the file content
    socket.emit('codeUpdate', content, username);
  };

  return (
    <>
      <div>
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
