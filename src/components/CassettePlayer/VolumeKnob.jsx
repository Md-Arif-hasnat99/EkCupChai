import React, { useState, useRef, useEffect } from 'react';

export default function VolumeKnob({ volume, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startVolRef = useRef(volume);

  const percent = Math.round(volume * 100);
  const angle = -135 + (volume * 270);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startVolRef.current = volume;
    document.body.style.cursor = 'ns-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaY = startYRef.current - e.clientY;
      const deltaVol = deltaY / 150;
      onChange(Math.max(0, Math.min(1, startVolRef.current + deltaVol)));
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    onChange(Math.max(0, Math.min(1, volume + delta)));
  };

  return (
    <div className="rotary-knob-container">
      <label className="knob-label">MASTER VOL</label>
      <div 
        className="rotary-knob" 
        tabIndex="0" 
        role="slider" 
        aria-valuenow={percent} 
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div className="knob-face">
          <div 
            className="knob-notch" 
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          />
        </div>
      </div>
      <span className="knob-val">{percent}%</span>
    </div>
  );
}
