import { useEffect, useState } from 'react';
import React from 'react';
import "./styles/Dashboard.css";
import Navbar from './Navbar';
import blankProfile from "./assets/blank.png"

import useAuth from './hooks/useAuth';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [info, setInfo] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [list, showList] = useState(false);
  const [trackIds, setTrackIds] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    console.log('rendered');
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMe();
      console.log('personal info', body);
      setProfileName(body.display_name);
      setProfileImg(body.images[1].url);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMyTopTracks({ limit: 5 });
      console.log('top tracks', body);
      let ids = "";
      let array = [];
      body.items.forEach(function (items, index) {
        array.push(
          index + 1 + '. ' + items.name + ' by ' + items.artists[0].name + " "
        );
        ids += items.id +",";
      });
      ids = ids.slice(0, -1);
      setTrackIds(ids);
      setTopTracks(array);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });
      console.log('recently played', body);
      let array = [];
      body.items.forEach(function (track, index) {
        array.push(
          index + 1 + '. ' + track.track.name + ' by ' + track.track.artists[0].name + " "
        );
      });
      setRecentlyPlayed(array);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    if (!trackIds) return setTrackIds("");
    (async () => {
      const { body } = await spotifyApi.getRecommendations({ seed_tracks: trackIds });
      console.log('recommendations', body);
      let array = [];
      body.tracks.forEach(function (tracks, index) {
        array.push(
          index + 1 + '. ' + tracks.name + ' by ' + tracks.artists[0].name + " "
        );
      });
      setRecommendations(array);
    })();
  }, [accessToken, trackIds]);

  const clickTopTracks = () => {
    setInfo(topTracks);
    showList(true);
  }

  const clickRecentlyPlayed = () => {
    setInfo(recentlyPlayed);
    showList(true);
  }

  const clickRecommendations = () => {
    setInfo(recommendations);
    showList(true);
  }

  return (
    <>
      <div>
        <Navbar code={code} />
      </div>
      <div className='container'>
        <div className='profile'>
          <div className='name'>
            <text> hello, {profileName} </text>
          </div>
          <div className='img'>
            <img src={profileImg || blankProfile} alt="icon"></img>
          </div>
        </div>
        <div className='data'>
          <div class="btn-group">
            <button class="button" onClick={clickTopTracks}>
              top tracks
            </button>
            <button class="button" onClick={clickRecentlyPlayed} >
              recently played
            </button>
            <button class="button" onClick={clickRecommendations} >
              recommendations based on top tracks
            </button>
          </div>
          <div className='list'>
            {list &&
              <><li>{info[0]}</li><li>{info[1]}</li><li>{info[2]}</li><li>{info[3]}</li><li>{info[4]}</li></>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
