import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioSynth';
import { getSpotifyAccessToken, fetchSpotifyTrackInfo } from '../utils/spotifyApi';

// Configure your Spotify API credentials via the .env file
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "";

// Track & Album configuration supporting local audio files & Spotify cover images
const ALBUMS = [
  {
    name: "DDLJ & 90s CLASSICS",
    tag: "TAPE A",
    coverStyle: "linear-gradient(135deg, #5c1d24, #9a3b26)",
    tracks: [
      { 
        title: "TUJHE DEKHA TOH YEH JANA SANAM", 
        artist: "Kumar Sanu & Lata Mangeshkar • DDLJ (1995)", 
        duration: 305,
        audioUrl: "/audio/Tujhe Dekha Toh Song Dilwale Dulhania Le Jayenge Shah Rukh Khan, Kajol Lata, Kumar Sanu DDLJ.mp3",
        coverUrl: null
      },
      { 
        title: "SHAM KI CHAI & BPL STEREO", 
        artist: "Highway Nostalgia", 
        duration: 215,
        audioUrl: "/audio/track2.mp3", 
        coverUrl: null 
      },
      { 
        title: "GAON KI GALIYAN", 
        artist: "Acoustic Dusk Harmony", 
        duration: 198,
        audioUrl: "/audio/track3.mp3", 
        coverUrl: null 
      }
    ]
  },
  {
    name: "90s HIGHWAY HITS",
    tag: "TAPE B",
    coverStyle: "linear-gradient(135deg, #1e3f3f, #d99a38)",
    tracks: [
      { 
        title: "MONSOON HIGHWAY '98", 
        artist: "Cassette Lo-Fi Dreams", 
        duration: 202,
        audioUrl: "/audio/track4.mp3", 
        coverUrl: null 
      },
      { 
        title: "MIDNIGHT BUS TO MUMBAI", 
        artist: "Retro Synth Breeze", 
        duration: 176,
        audioUrl: "/audio/track5.mp3", 
        coverUrl: null 
      }
    ]
  }
];

export default function RetroPlayerBar({ onTapeStateChange }) {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [dynamicCoverUrl, setDynamicCoverUrl] = useState(null);

  const currentAlbum = ALBUMS[currentAlbumIndex];
  const currentTrack = currentAlbum.tracks[currentTrackIndex];

  useEffect(() => {
    async function loadSpotifyCover() {
      if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        setDynamicCoverUrl(null);
        return;
      }
      try {
        const token = await getSpotifyAccessToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
        if (token) {
          // Clean the artist name (remove bullet points and year details for friendly search query)
          const cleanArtist = currentTrack.artist.split('•')[0].split('(')[0].trim();
          const query = `${currentTrack.title} ${cleanArtist}`;
          
          const info = await fetchSpotifyTrackInfo(query, token);
          if (info && info.albumCover) {
            setDynamicCoverUrl(info.albumCover);
          } else {
            setDynamicCoverUrl(null);
          }
        }
      } catch (err) {
        console.error('Error fetching Spotify cover:', err);
        setDynamicCoverUrl(null);
      }
    }
    loadSpotifyCover();
  }, [currentTrack]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, currentTrack]);

  useEffect(() => {
    if (onTapeStateChange) {
      onTapeStateChange(isPlaying && !isPaused);
    }
  }, [isPlaying, isPaused, onTapeStateChange]);

  const handlePlay = () => {
    audioEngine.playButtonClick();
    setIsPlaying(true);
    setIsPaused(false);
    audioEngine.playLocalTrack(currentTrack.audioUrl);
  };

  const handlePause = () => {
    audioEngine.playButtonClick();
    if (!isPlaying) return;
    if (isPaused) {
      setIsPaused(false);
      audioEngine.playLocalTrack(currentTrack.audioUrl);
    } else {
      setIsPaused(true);
      audioEngine.pauseLocalTrack();
    }
  };

  const handleStop = () => {
    audioEngine.playButtonClick();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    audioEngine.pauseLocalTrack();
  };

  const handleNextTrack = () => {
    audioEngine.playButtonClick();
    const nextIdx = (currentTrackIndex + 1) % currentAlbum.tracks.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.playLocalTrack(currentAlbum.tracks[nextIdx].audioUrl);
    }
  };

  const handlePrevTrack = () => {
    audioEngine.playButtonClick();
    const prevIdx = (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.playLocalTrack(currentAlbum.tracks[prevIdx].audioUrl);
    }
  };

  const handleSwitchAlbum = () => {
    const nextIdx = (currentAlbumIndex + 1) % ALBUMS.length;
    audioEngine.playButtonClick();
    setCurrentAlbumIndex(nextIdx);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.playLocalTrack(ALBUMS[nextIdx].tracks[0].audioUrl);
    }
  };

  const formatTime = (timeInSec) => {
    const mins = String(Math.floor(timeInSec / 60)).padStart(2, '0');
    const secs = String(Math.floor(timeInSec % 60)).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progressPercent = currentTrack.duration > 0 
    ? Math.min(100, (currentTime / currentTrack.duration) * 100) 
    : 0;

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = Math.floor(ratio * currentTrack.duration);
    setCurrentTime(newTime);
    audioEngine.seekLocalTrack(newTime);
  };

  return (
    <div className="retro-player-bar-container">
      
      {/* Left Side: Retro Album Artwork or Spotify Cover Image */}
      <div 
        className="retro-album-art" 
        style={{ 
          background: (dynamicCoverUrl || currentTrack.coverUrl) 
            ? `url("${dynamicCoverUrl || currentTrack.coverUrl}") center/cover` 
            : currentAlbum.coverStyle 
        }}
        onClick={handleSwitchAlbum}
        title="Click to change Tape / Album"
      >
        {!(dynamicCoverUrl || currentTrack.coverUrl) && (
          <>
            <div className="art-label-hindi">एक कप चाय</div>
            <div className="art-tag">{currentAlbum.tag}</div>
          </>
        )}
      </div>

      {/* Center: Track Details, Progress Bar & Retro Buttons */}
      <div className="retro-main-section">
        
        {/* Track Title & Artist */}
        <div className="retro-track-header">
          <div className="retro-title-text">{currentTrack.title}</div>
          <div className="retro-artist-text">{currentTrack.artist} • {currentAlbum.name}</div>
        </div>

        {/* Standard Mechanical Retro Control Buttons */}
        <div className="retro-controls-row">
          <button className="retro-mech-btn" onClick={handlePrevTrack} title="Previous Track">
            <span className="mech-icon">⏮</span>
            <span className="mech-text">PREV</span>
          </button>
          
          {isPlaying && !isPaused ? (
            <button className="retro-mech-btn active-state" onClick={handlePause} title="Pause">
              <span className="mech-icon">⏸</span>
              <span className="mech-text">PAUSE</span>
            </button>
          ) : (
            <button className="retro-mech-btn" onClick={handlePlay} title="Play">
              <span className="mech-icon">▶</span>
              <span className="mech-text">PLAY</span>
            </button>
          )}

          <button className="retro-mech-btn" onClick={handleStop} title="Stop">
            <span className="mech-icon">⏹</span>
            <span className="mech-text">STOP</span>
          </button>

          <button className="retro-mech-btn" onClick={handleNextTrack} title="Next Track">
            <span className="mech-icon">⏭</span>
            <span className="mech-text">NEXT</span>
          </button>
        </div>

        {/* Progress Line & Timing */}
        <div className="retro-timing-row">
          <span className="retro-time-code">{formatTime(currentTime)}</span>
          <div className="retro-progress-bg" onClick={handleProgressBarClick}>
            <div 
              className="retro-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="retro-time-code">{formatTime(currentTrack.duration)}</span>
        </div>

      </div>

    </div>
  );
}
