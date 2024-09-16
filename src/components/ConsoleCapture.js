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

  return (
    <div>
      <h3>Captured Console Output</h3>
      <div id="console-output" style={{ backgroundColor: '#808080', padding: '10px', borderRadius: '5px' }}>
        {logs.length === 0 ? (
          <p>No logs yet...</p>
        ) : (
          logs.map((log, index) => <p key={index}>{log}</p>)
        )}
      </div>
    </div>
  );
};

export default ConsoleCapture;
