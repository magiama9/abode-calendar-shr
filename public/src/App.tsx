// import { useState } from 'react';
import Cal from './components/calendar';
import './App.css';

function App() {
  return (
    <>
      <div>
        <Cal />
      </div>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
      </div>
    </>
  );
}

export default App;
