import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioSynth';

const ALBUMS = [
  {
    name: "ROAD-SIDE MEMORIES '96",
    tag: "TAPE A",
    coverStyle: "linear-gradient(135deg, #5c1d24, #9a3b26)",
    tracks: [
      { title: "CHAI TAPRI MEMORIES", artist: "Vintage Radio Lo-Fi", duration: 184 },
      { title: "SHAM KI CHAI & BPL STEREO", artist: "Highway Nostalgia", duration: 215 },
      { title: "GAON KI GALIYAN", artist: "Acoustic Dusk Harmony", duration: 198 }
    ]
  },
  {
    name: "90s HIGHWAY HITS",
    tag: "TAPE B",
    coverStyle: "linear-gradient(135deg, #1e3f3f, #d99a38)",
    tracks: [
      { title: "MONSOON HIGHWAY '98", artist: "Cassette Lo-Fi Dreams", duration: 202 },
      { title: "MIDNIGHT BUS TO MUMBAI", artist: "Retro Synth Breeze", duration: 176 }
    ]
  },
  {
    name: "CHAI TAPRI EVENING RAGAS",
    tag: "TAPE C",
    coverStyle: "linear-gradient(135deg, #3d1b38, #8c3b27)",
    tracks: [
      { title: "EVENING RAGA LO-FI", artist: "Sitar & Dusk Vibes", duration: 240 },
      { title: "RAIN ON TIN ROOF CHAI", artist: "Monsoon Night Raga", duration: 210 }
    ]
  }
];

export default function RetroPlayerBar({ onTapeStateChange }) {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const currentAlbum = ALBUMS[currentAlbumIndex];
  const currentTrack = currentAlbum.tracks[currentTrackIndex];

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
    audioEngine.startMelody();
  };

  const handlePause = () => {
    audioEngine.playButtonClick();
    if (!isPlaying) return;
    if (isPaused) {
      setIsPaused(false);
      audioEngine.startMelody();
    } else {
      setIsPaused(true);
      audioEngine.stopMelody();
    }
  };

  const handleStop = () => {
    audioEngine.playButtonClick();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    audioEngine.stopMelody();
  };

  const handleNextTrack = () => {
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    setCurrentTrackIndex((prev) => (prev + 1) % currentAlbum.tracks.length);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handlePrevTrack = () => {
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    setCurrentTrackIndex((prev) => (prev - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handleSwitchAlbum = () => {
    const nextIdx = (currentAlbumIndex + 1) % ALBUMS.length;
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    setCurrentAlbumIndex(nextIdx);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
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
  };

  return (
    <div className="retro-player-bar-container">
      
      {/* Left Side: Retro Album Artwork */}
      <div 
        className="retro-album-art" 
        style={{ background: currentAlbum.coverStyle }}
        onClick={handleSwitchAlbum}
        title="Click to change Tape / Album"
      >
        <div className="art-label-hindi">एक कप चाय</div>
        <div className="art-tag">{currentAlbum.tag}</div>
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
