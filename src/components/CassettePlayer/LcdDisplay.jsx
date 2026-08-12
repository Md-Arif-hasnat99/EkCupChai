import React from 'react';

export default function LcdDisplay({ isPlaying, isPaused, trackNum, totalTracks, title, currentTime, freq }) {
  const statusText = isPlaying ? (isPaused ? '⏸ PAUSED' : '● PLAYING') : '⏹ STOPPED';

  const mins = String(Math.floor(currentTime / 60)).padStart(2, '0');
  const secs = String(currentTime % 60).padStart(2, '0');
  const timecode = `${mins}:${secs}`;

  return (
    <div className="lcd-screen amber-glow">
      <div className="lcd-top-status">
        <span className="lcd-status-text">{statusText}</span>
        <span className="lcd-status-text">TR-0{trackNum} / 0{totalTracks}</span>
      </div>
      
      <div className="lcd-marquee-wrapper">
        <div className="lcd-marquee-text">{title}</div>
      </div>

      <div className="lcd-bottom-info">
        <span className="lcd-time">{timecode}</span>
        <span className="lcd-freq">{freq}</span>
      </div>
    </div>
  );
}
