import React from 'react';

import Dashboard from './Dashboard';
import Login from './Login';
import "./styles/App.css"

const App = () => {
  const code = new URLSearchParams(window.location.search).get('code');

  if (!code) {
    return <Login/>
  } 
  else {
    return <Dashboard code = {code} />
  }
};

export default App;
