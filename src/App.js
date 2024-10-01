import React, { useEffect, useState, useRef } from 'react';
import LuaRunner from './components/LuaRunner';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import InputBox from './components/InputBox';

const socket = io('http://148.100.178.33:4000'); // CHANGE TO YOUR IP OR REMAP SOCKET TO BACKEND

function App() {
  const [code, setCode] = useState('-- This is just a placeholder, stare below here\n'); // Current code value
  const [username, setUsername] = useState('null');
  const usernameRef = useRef('null');
  const editorRef = useRef(null); // Ref to store the editor instance
  const isTyping = useRef(false); // To check if the user is typing

  useEffect(() => {
    function onJoin() {
      let storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        usernameRef.current = storedUsername;
        socket.emit('createRoom', storedUsername);
      } else {
        const newUsername = (Math.random() + 1).toString(36).substring(5);
        localStorage.setItem('username', newUsername);
        setUsername(newUsername);
        usernameRef.current = newUsername;
        socket.emit('createRoom', newUsername);
      }
    }

    onJoin();

    return () => {
      socket.off('codeUpdate');
    };
  }, []);

  useEffect(() => {
    socket.on('codeUpdate', (data) => {
      if (!isTyping.current) {
        setCode(data); // Update the editor only when not typing
      }
    });

    return () => {
      socket.off('codeUpdate');
    };
  }, []);

  const handleCodeChange = (value) => {
    isTyping.current = true;
    setCode(value);

    // Emit the new code with a short delay to allow continuous typing
    setTimeout(() => {
      socket.emit('codeUpdate', value, username);
      isTyping.current = false;
    }, 300); // Debounce by 300ms
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor; // Store editor instance in the ref
  };

  const handleFileLoad = (content) => {
    setCode(content);
    socket.emit('codeUpdate', content, username);
  };

  return (
    <>
      <div>
        <InputBox onFileLoad={handleFileLoad} code={code} />
      </div>
      <div className="Box-Border">
      <div className="Box">
        <Editor
          theme="vs-dark"
          height="90vh"
          width="45vw"
          defaultLanguage="lua"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          className="Edit-Box"
        />
      </div>
      </div>
      <div className="consoleArea">
        <LuaRunner code={code} />
      </div>
    </>
  );
}

export default App;
