import React from 'react';

import useAuth from './hooks/useAuth';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.getUserPlaylists().then(
    function(data) {
      console.log('Artist albums', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
  return (
    <p>logged in</p>
  );
};

export default Dashboard;
