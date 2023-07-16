import React from 'react';
import Navbar from "./Navbar";
import "./styles/Login.css"

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
&response_type=code
&show_dialog=true`

function Login() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="login">
        <div className="info">
          <p>
            Log in to discover your most listened to tracks and get recommendations!
          </p>
        </div>
        <div>
          <a
            className="login-button"
            href={loginUrl}
          >
            sign in with spotify
          </a>
        </div>
      </div>
    </>
  );
}

export default Login;
