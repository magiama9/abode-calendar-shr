// import { useState } from 'react';
import Cal from './components/calendar';
import LandingPage from './components/landingPage';
import './App.css';
// import { useAuth0 } from './utils/contexts/auth0-context';

function App() {
  // const { isAuthenticated, getIdTokenClaims, user } = useAuth0();

  return (
    <>
      {/* <LandingPage /> */}
      <div>
        <Cal />
      </div>
    </>
  );
}

export default App;
