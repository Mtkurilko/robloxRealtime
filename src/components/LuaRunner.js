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
      <button className="run" onClick={runLuaCode}>Run</button>
      <pre><ConsoleCapture/>
      <h3>Return Value</h3>
      <div id="console-output" style={{backgroundColor: '#808080', padding: '10px', borderRadius: '5px'}}>
          {output}
      </div>
      <button className="clear" onClick={clearLuaCode}>Clear</button>
      </pre>
  </div>
  );
}

export default LuaRunner;