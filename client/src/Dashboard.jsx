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
  const [profileName, setProfileName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([])

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    console.log('rendered');
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return
    (async () => {
      const { body } = await spotifyApi.getMe();
      console.log('personal info', body);
      setProfileName(body.display_name);
      setProfileImg(body.images[1].url);
    })();
  }, [accessToken])


  useEffect(() => {
    if (!accessToken) return
    (async () => {
      const { body } = await spotifyApi.getMyTopTracks({ limit: 5 });
      console.log('top tracks', body);
      let array = []
      body.items.forEach(function(items, index) {
        array.push(
          index +
            1 +
            '. ' +
            items.name +
            ' by ' + items.artists[0].name + " "
        );
      });
      setTopTracks(array)
    })();
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    (async () => {
      const { body } = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });
      console.log('recently played', body);
      let array = []
      body.items.forEach(function(track, index) {
        array.push(
          index +
            1 +
            '. ' +
            track.track.name +
            ' by ' + track.track.artists[0].name + " "
        );
      });
      setRecentlyPlayed(array)
    })();
  }, [accessToken])

  const clickTopTracks = () => setInfo(topTracks);
  const clickRecentlyPlayed = () => setInfo(recentlyPlayed);

  return (
    <div className="App">
      <header>
        <p> hello {profileName} </p>
        <img src={profileImg} alt="icon"></img>
      </header>
      <header className="App-header">
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
