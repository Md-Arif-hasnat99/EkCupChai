import React from 'react';

export default function LcdDisplay({ isPlaying, isPaused, trackNum, totalTracks, title, currentTime, totalDuration }) {
  const statusText = isPlaying ? (isPaused ? '⏸ PAUSED' : '● PLAYING') : '⏹ STOPPED';

  const formatTime = (timeInSec) => {
    const mins = String(Math.floor(timeInSec / 60)).padStart(2, '0');
    const secs = String(Math.floor(timeInSec % 60)).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progressPercent = totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;

  return (
    <div className="lcd-screen amber-glow">
      <div className="lcd-top-status">
        <span className="lcd-status-text">{statusText}</span>
        <span className="lcd-status-text">TRACK {trackNum}/{totalTracks}</span>
      </div>
      
      <div className="lcd-song-title-display">
        <span className="song-title-text">{title}</span>
      </div>

      {/* Progress Line Bar */}
      <div className="lcd-progress-container">
        <div className="progress-line-bg">
          <div className="progress-line-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="lcd-bottom-info">
        <span className="lcd-time">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
        <span className="lcd-freq">STEREO</span>
      </div>
    </div>
  );
}
