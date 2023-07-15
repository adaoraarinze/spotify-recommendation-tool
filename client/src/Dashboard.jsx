import { useEffect, useState } from 'react';
import React from 'react';

import useAuth from './hooks/useAuth';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [info, setInfo] = useState();
  var profile;
  var topTracks = [5];
  var recentlyPlayed = [5];


  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    console.log('rendered');
  }, [accessToken]);


  async function getProfile() {
  spotifyApi.getMe().then(
    function(data) {
      console.log('personal info', data.body);
      profile = data.body.display_name
    },
    function(err) {
      console.error(err);
    }
  );
  }

  async function getTopTracks() {
  spotifyApi.getMyTopTracks({ limit: 5 }).then(
    function(data) {
      console.log('top tracks', data.body);
      topTracks = data.body.items[0].name
    },
    function(err) {
      console.error(err);
    }
  );
  }

  async function getRecentlyPlayed() {
  spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 }).then(
    function(data) {
      console.log('recently played', data.body);
      recentlyPlayed = data.body.items[0].track.name
    },
    function(err) {
      console.error(err);
    }
  );
  }

  getProfile();
  getTopTracks();
  getRecentlyPlayed();

  const clickProfile = () => setInfo(profile);
  const clickTopTracks = () => setInfo(topTracks);
  const clickRecentlyPlayed = () => setInfo(recentlyPlayed);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          logged in
        </p>
        <button onClick={clickProfile}>
          profile
        </button>
        <button onClick={clickTopTracks}>
          top tracks
        </button>
        <button onClick={clickRecentlyPlayed}>
          recently played
        </button>
        <p>{info}</p>  
      </header>
    </div>
  );
};

export default Dashboard;
