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
  const [topTracksLinks, setTopTracksLinks] = useState([]);
  const [recentlyPlayedLinks, setRecentlyPlayedLinks] = useState([]);
  const [recommendationsLinks, setRecommendationsLinks] = useState([]);
  const [links, setLinks] = useState([]);
  const [list, showList] = useState(false);
  const [trackIds, setTrackIds] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMe();
      setProfileName(body.display_name);
      setProfileImg(body.images[1].url);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMyTopTracks({ limit: 10 });
      let ids = "";
      let [array, imageArray, linkArray] = [[], [], []];
      body.items.forEach(function (items, index) {
        let [tempArray, artistNames] = [[], []];
        items.artists.forEach(function (artists) {
          artistNames.push(artists.name)
        });
        artistNames = artistNames.join(", ")
        tempArray.push(
          index + 1 + '. ' + items.name + ' by '
        );
        imageArray.push(
          items.album.images[2].url
        );
        linkArray.push(
          items.external_urls.spotify
        );
        tempArray = tempArray.concat(artistNames);
        array.push(tempArray);
        if ((index + 1) <= 5) {
          ids += items.id + ",";
        }
      });
      ids = ids.slice(0, -1);
      setTrackIds(ids);
      setTopTracks(array);
      setTopTracksImages(imageArray);
      setTopTracksLinks(linkArray);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      const { body } = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 });
      let [array, imageArray, linkArray] = [[], [], []];
      body.items.forEach(function (track, index) {
        let [tempArray, artistNames] = [[], []];
        track.track.artists.forEach(function (artists) {
          artistNames.push(artists.name)
        });
        artistNames = artistNames.join(", ")
        tempArray.push(
          index + 1 + '. ' + track.track.name + ' by '
        );
        imageArray.push(
          track.track.album.images[2].url
        );
        linkArray.push(
          track.track.external_urls.spotify
        );
        tempArray = tempArray.concat(artistNames);
        array.push(tempArray);
      });
      setRecentlyPlayed(array);
      setRecentlyPlayedImages(imageArray);
      setRecentlyPlayedLinks(linkArray);
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    if (!trackIds) return setTrackIds("");
    (async () => {
      const { body } = await spotifyApi.getRecommendations({ limit: 10, seed_tracks: trackIds });
      let [array, imageArray, linkArray] = [[], [], []];
      body.tracks.forEach(function (tracks, index) {
        let [tempArray, artistNames] = [[], []];
        tracks.artists.forEach(function (artists) {
          artistNames.push(artists.name)
        });
        artistNames = artistNames.join(", ")
        tempArray.push(
          index + 1 + '. ' + tracks.name + ' by '
        );
        imageArray.push(
          tracks.album.images[2].url
        );
        linkArray.push(
          tracks.external_urls.spotify
        );
        tempArray = tempArray.concat(artistNames);
        array.push(tempArray);
      });
      setRecommendations(array);
      setRecommendationsImages(imageArray);
      setRecommendationsLinks(linkArray);
    })();
  }, [accessToken, trackIds]);

  const clickTopTracks = () => {
    setInfo(topTracks);
    setAlbumImages(topTracksImages);
    setLinks(topTracksLinks);
    showList(true);
  }

  const clickRecentlyPlayed = () => {
    setInfo(recentlyPlayed);
    setAlbumImages(recentlyPlayedImages);
    setLinks(recentlyPlayedLinks);
    showList(true);
  }

  const clickRecommendations = () => {
    setInfo(recommendations);
    setAlbumImages(recommendationsImages);
    setLinks(recommendationsLinks);
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
                <div class="list-items"><p><img src={albumImages[0]} alt=""></img> <a href={links[0]} target='_blank' rel='noreferrer'>{info[0]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[1]} alt=""></img> <a href={links[1]} target='_blank' rel='noreferrer'>{info[1]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[2]} alt=""></img> <a href={links[2]} target='_blank' rel='noreferrer'>{info[2]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[3]} alt=""></img> <a href={links[3]} target='_blank' rel='noreferrer'>{info[3]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[4]} alt=""></img> <a href={links[4]} target='_blank' rel='noreferrer'>{info[4]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[5]} alt=""></img> <a href={links[5]} target='_blank' rel='noreferrer'>{info[5]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[6]} alt=""></img> <a href={links[6]} target='_blank' rel='noreferrer'>{info[6]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[7]} alt=""></img> <a href={links[7]} target='_blank' rel='noreferrer'>{info[7]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[8]} alt=""></img> <a href={links[8]} target='_blank' rel='noreferrer'>{info[8]}</a></p></div>
                <div class="list-items"><p><img src={albumImages[9]} alt=""></img> <a href={links[9]} target='_blank' rel='noreferrer'>{info[9]}</a></p></div>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
