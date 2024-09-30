import React, { useState } from 'react';
import * as fengari from 'fengari-web';
import ConsoleCapture from "./ConsoleCapture";


function LuaRunner({ code }) {
  const [output, setOutput] = useState('No return yet...');

  const runLuaCode = () => {
    const result = fengari.load(code)()
      if (result) {
        setOutput(result)
      }
  };

  const clearLuaCode = () => {
    setOutput('No return yet...')
  };

  return (
  <div className="lua-runner">
      <button className="run" onClick={runLuaCode}>Run <div className="runIcon"></div></button>
      <pre className={"outputBox"}><ConsoleCapture />
      <h3 style={{color: 'indianred'}}>Return Value</h3>
      <div className="console-output">
          <p>{output}</p>
      </div>
      <button style={{borderColor: 'indianred'}} className="clear" onClick={clearLuaCode}>Clear</button>
      </pre>
  </div>
  );
}

export default LuaRunner;