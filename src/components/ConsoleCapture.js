import React, { useState, useEffect } from 'react';

const ConsoleCapture = () => {
  const [logs, setLogs] = useState([]); // State to store log entries

  useEffect(() => {
    // Keep a reference to the original console.log
    const originalConsoleLog = console.log;

    // Override console.log
    console.log = function (...args) {
      const message = args.join(' '); // Combine arguments into a string
      setLogs(prevLogs => [...prevLogs, message]); // Store the log in the state

      // Call the original console.log to ensure the default behavior
      originalConsoleLog.apply(console, args);
    };

    // Clean up the override when the component unmounts
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  // Function to clear the logs
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div>
      <h3 style={{color: 'lightseagreen'}}>Captured Console Output</h3>
      <div className="console-output">
        {logs.length === 0 ? (
          <p>No logs yet...</p>
        ) : (
          logs.map((log, index) => <p key={index}>{log}</p>)
        )}
      </div>
      <button style={{borderColor: 'lightseagreen', marginTop: '1vh' }} onClick={clearLogs}>Clear Console</button>
    </div>
  );
};

export default ConsoleCapture;
