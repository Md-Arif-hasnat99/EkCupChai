import React from 'react';

export default function TapeButtons({ isPlaying, isPaused, onPlay, onPause, onStop, onRewind, onFFwd, onEject }) {
  return (
    <div className="tape-buttons-row">
      <button className="deck-btn btn-rew" onClick={onRewind} title="Rewind / Previous Track">
        <span className="silkscreen-icon">⏮</span>
        <span className="deck-btn-label">REW</span>
      </button>
      <button 
        className={`deck-btn btn-play ${isPlaying && !isPaused ? 'active-state' : ''}`} 
        onClick={onPlay} 
        title="Play Cassette"
      >
        <span className="silkscreen-icon">▶</span>
        <span className="deck-btn-label">PLAY</span>
      </button>
      <button 
        className={`deck-btn btn-pause ${isPaused ? 'active-state' : ''}`} 
        onClick={onPause} 
        title="Pause Cassette"
      >
        <span className="silkscreen-icon">⏸</span>
        <span className="deck-btn-label">PAUSE</span>
      </button>
      <button 
        className={`deck-btn btn-stop ${!isPlaying && !isPaused ? 'active-state' : ''}`} 
        onClick={onStop} 
        title="Stop"
      >
        <span className="silkscreen-icon">⏹</span>
        <span className="deck-btn-label">STOP</span>
      </button>
      <button className="deck-btn btn-ff" onClick={onFFwd} title="Fast Forward / Next Track">
        <span className="silkscreen-icon">⏭</span>
        <span className="deck-btn-label">FFWD</span>
      </button>
      <button className="deck-btn btn-eject-btn" onClick={onEject} title="Change Cassette Tape">
        <span className="silkscreen-icon">⏏</span>
        <span className="deck-btn-label">EJECT</span>
      </button>
    </div>
  );
}
