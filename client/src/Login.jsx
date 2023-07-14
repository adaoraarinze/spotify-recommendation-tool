import React from 'react';

const scopes = [
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative"
]

export const loginUrl = `https://accounts.spotify.com/authorize
?client_id=${process.env.REACT_APP_CLIENT_ID}
&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}
&scope=${scopes.join("%20")}
&response_type=code`

function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Spotify tool
        </p>
        <a
          href={loginUrl}
          id="signInButton"
        >
          sign in with spotify
        </a>
      </header>
    </div>
  );
}

export default Login;
