import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioSynth';

const TAPES = [
  {
    name: "ROAD-SIDE MEMORIES '96",
    label: "TAPE A • CHAI TAPRI LO-FI",
    coverColor: "linear-gradient(135deg, #7a2b1e, #d48b38)",
    tracks: [
      { title: "CHAI TAPRI MEMORIES", artist: "Vintage Radio Lo-Fi", duration: 184 },
      { title: "SHAM KI CHAI & BPL STEREO", artist: "Highway Nostalgia", duration: 215 },
      { title: "GAON KI GALIYAN", artist: "Acoustic Dusk Harmony", duration: 198 }
    ]
  },
  {
    name: "90s HIGHWAY HITS",
    label: "TAPE B • HIGHWAY RETRO",
    coverColor: "linear-gradient(135deg, #1e4d4d, #d49f38)",
    tracks: [
      { title: "MONSOON HIGHWAY '98", artist: "Cassette Lo-Fi Dreams", duration: 202 },
      { title: "MIDNIGHT BUS TO MUMBAI", artist: "Retro Synth Breeze", duration: 176 }
    ]
  },
  {
    name: "CHAI TAPRI EVENING RAGAS",
    label: "TAPE C • EVENING AMBIENT",
    coverColor: "linear-gradient(135deg, #4d1e46, #d45d38)",
    tracks: [
      { title: "EVENING RAGA LO-FI", artist: "Sitar & Dusk Vibes", duration: 240 },
      { title: "RAIN ON TIN ROOF CHAI", artist: "Monsoon Night Raga", duration: 210 }
    ]
  }
];

export default function SpotifyPlayer({ onTapeStateChange }) {
  const [currentTapeIndex, setCurrentTapeIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);

  const [kettleActive, setKettleActive] = useState(true);
  const [nightActive, setNightActive] = useState(true);
  const [staticActive, setStaticActive] = useState(false);

  const currentTape = TAPES[currentTapeIndex];
  const currentTrack = currentTape.tracks[currentTrackIndex];

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
    setCurrentTrackIndex((prev) => (prev + 1) % currentTape.tracks.length);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handlePrevTrack = () => {
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    setCurrentTrackIndex((prev) => (prev - 1 + currentTape.tracks.length) % currentTape.tracks.length);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handleSwitchTape = () => {
    const nextIdx = (currentTapeIndex + 1) % TAPES.length;
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    setCurrentTapeIndex(nextIdx);
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
    <div className="spotify-player-bar">
      
      {/* Left: Album Picture Thumbnail */}
      <div 
        className="spotify-album-cover" 
        style={{ background: currentTape.coverColor }}
        onClick={handleSwitchTape}
        title="Click to switch Tape/Album"
      >
        <div className="album-icon">☕</div>
        <div className="album-tape-badge">90s</div>
      </div>

      {/* Center: Track Info & Controls */}
      <div className="spotify-main-controls">
        
        {/* Track Title & Artist */}
        <div className="spotify-track-info">
          <div className="spotify-track-title">{currentTrack.title}</div>
          <div className="spotify-track-artist">{currentTrack.artist} • {currentTape.label}</div>
        </div>

        {/* Central Controls: Rewind, Play/Pause, Stop, Forward */}
        <div className="spotify-buttons-row">
          <button className="spotify-btn" onClick={handlePrevTrack} title="Previous Song">
            ⏮
          </button>
          
          {isPlaying && !isPaused ? (
            <button className="spotify-btn main-play-btn" onClick={handlePause} title="Pause">
              ⏸
            </button>
          ) : (
            <button className="spotify-btn main-play-btn" onClick={handlePlay} title="Play">
              ▶
            </button>
          )}

          <button className="spotify-btn" onClick={handleStop} title="Stop">
            ⏹
          </button>

          <button className="spotify-btn" onClick={handleNextTrack} title="Next Song">
            ⏭
          </button>
        </div>

        {/* Progress Line & Timing */}
        <div className="spotify-progress-row">
          <span className="spotify-time">{formatTime(currentTime)}</span>
          <div className="spotify-progress-bar-bg" onClick={handleProgressBarClick}>
            <div 
              className="spotify-progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="spotify-time">{formatTime(currentTrack.duration)}</span>
        </div>

      </div>

      {/* Right: Ambient Sound Toggles & Volume */}
      <div className="spotify-side-controls">
        <div className="spotify-ambient-rack">
          <button 
            className={`spotify-chip ${kettleActive ? 'active' : ''}`}
            onClick={() => {
              audioEngine.playButtonClick();
              setKettleActive(!kettleActive);
              audioEngine.toggleKettle(!kettleActive);
            }}
            title="Kettle Boiling Ambiance"
          >
            🫖
          </button>
          <button 
            className={`spotify-chip ${nightActive ? 'active' : ''}`}
            onClick={() => {
              audioEngine.playButtonClick();
              setNightActive(!nightActive);
              audioEngine.toggleNight(!nightActive);
            }}
            title="Dusk Crickets Ambiance"
          >
            🌧️
          </button>
          <button 
            className={`spotify-chip ${staticActive ? 'active' : ''}`}
            onClick={() => {
              audioEngine.playButtonClick();
              setStaticActive(!staticActive);
              audioEngine.toggleStatic(!staticActive);
            }}
            title="Radio Static"
          >
            📻
          </button>
        </div>
      </div>

    </div>
  );
}
