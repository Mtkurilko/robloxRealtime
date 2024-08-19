import React, { useState } from 'react';
import * as fengari from 'fengari-web';

function LuaRunner({ code }) {
  const [output, setOutput] = useState('');

  const runLuaCode = () => {
    const result = fengari.load(code)()
    setOutput(result)
  };

  return (
    <div className="lua-runner">
      <button onClick={runLuaCode}>Run Lua Code</button>
      <pre>{output}</pre>
    </div>
  );
}

export default LuaRunner;