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
  const [recommendations, setRecommendations] = useState([]);
  const [topTracksImages, setTopTracksImages] = useState([]);
  const [recentlyPlayedImages, setRecentlyPlayedImages] = useState([]);
  const [recommendationsImages, setRecommendationsImages] = useState([]);
  const [albumImages, setAlbumImages] = useState([]);
  const [list, showList] = useState(false);
  const [trackIds, setTrackIds] = useState("");

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
      let imageArray = [];
      body.items.forEach(function (items, index) {
        array.push(
          index + 1 + '. ' + items.name + ' by ' + items.artists[0].name + " "
        );
        ids += items.id +",";
        imageArray.push(
          items.album.images[2].url
        );
      });
      ids = ids.slice(0, -1);
      setTrackIds(ids);
      setTopTracks(array);
      setTopTracksImages(imageArray);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });
      console.log('recently played', body);
      let array = [];
      let imageArray = [];
      body.items.forEach(function (track, index) {
        array.push(
          index + 1 + '. ' + track.track.name + ' by ' + track.track.artists[0].name + " "
        );
        imageArray.push(
          track.track.album.images[2].url
        );
      });
      setRecentlyPlayed(array);
      setRecentlyPlayedImages(imageArray);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    if (!trackIds) return setTrackIds("");
    (async () => {
      const { body } = await spotifyApi.getRecommendations({ seed_tracks: trackIds });
      console.log('recommendations', body);
      let array = [];
      let imageArray = [];
      body.tracks.forEach(function (tracks, index) {
        array.push(
          index + 1 + '. ' + tracks.name + ' by ' + tracks.artists[0].name + " "
        );
        imageArray.push(
          tracks.album.images[2].url
        );
      });
      setRecommendations(array);
      setRecommendationsImages(imageArray);
    })();
  }, [accessToken, trackIds]);

  const clickTopTracks = () => {
    setInfo(topTracks);
    setAlbumImages(topTracksImages);
    showList(true);
  }

  const clickRecentlyPlayed = () => {
    setInfo(recentlyPlayed);
    setAlbumImages(recentlyPlayedImages);
    showList(true);
  }

  const clickRecommendations = () => {
    setInfo(recommendations);
    setAlbumImages(recommendationsImages);
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
          <div>
            <img className='profile-img' src={profileImg || blankProfile} alt="icon"></img>
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
            <>
              <div class="list-items"><p><img src={albumImages[0]} alt=""></img> {info[0]}</p></div>
              <div class="list-items"><p><img src={albumImages[1]} alt=""></img> {info[1]}</p></div>
              <div class="list-items"><p><img src={albumImages[2]} alt=""></img> {info[2]}</p></div>
              <div class="list-items"><p><img src={albumImages[3]} alt=""></img> {info[3]}</p></div>
              <div class="list-items"><p><img src={albumImages[4]} alt=""></img> {info[4]}</p></div>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
