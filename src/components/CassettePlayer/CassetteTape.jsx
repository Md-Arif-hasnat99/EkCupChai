import React from 'react';

export default function CassetteTape({ label, isPlaying, isPaused, isFastSpin }) {
  const spoolClass = isFastSpin 
    ? 'fast-rotating' 
    : (isPlaying && !isPaused ? 'rotating' : '');

  return (
    <div className="cassette-slot-unit">
      <div className="cassette-window">
        <div className="cassette-tape-body">
          <div className="tape-label">
            <div className="tape-title">{label}</div>
            <div className="tape-side">SIDE A - STEREO</div>
          </div>
          <div className="spool-container">
            <div className={`tape-spool spool-left ${spoolClass}`}>
              <div className="spool-teeth"></div>
              <div className="tape-roll-left"></div>
            </div>
            <div className="tape-bridge-window">
              <div className="tape-ribbon"></div>
            </div>
            <div className={`tape-spool spool-right ${spoolClass}`}>
              <div className="spool-teeth"></div>
              <div className="tape-roll-right"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="cassette-eject-bevel">
        <span className="eject-label">PRESS HEAVY TO EJECT</span>
      </div>
    </div>
  );
}
