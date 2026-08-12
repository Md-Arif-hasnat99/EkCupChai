import React, { useState, useEffect } from 'react';

export default function DigitalClock({ isTapePlaying }) {
  const [timeStr, setTimeStr] = useState('12:00:00');
  const [ampm, setAmPm] = useState('PM');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampmVal = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = String(hours).padStart(2, '0');
      const blink = now.getSeconds() % 2 === 0 ? ':' : ' ';

      setTimeStr(`${hoursStr}${blink}${minutes}${blink}${seconds}`);
      setAmPm(ampmVal);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="digital-clock" class="retro-clock-panel">
      <div className="clock-bezel">
        <div className="clock-header">
          <span className="brand-tag">BPL DIGITAL</span>
          <span className="model-tag">ALARM-1996</span>
        </div>
        <div className="led-display">
          <span className="led-digits">{timeStr}</span>
          <span className="led-ampm">{ampm}</span>
        </div>
        <div className="clock-indicators">
          <span className="indicator active">● SLEEP</span>
          <span className="indicator">● ALARM</span>
          <span className={`indicator ${isTapePlaying ? 'active' : ''}`}>
            ● TAPE SYNC
          </span>
        </div>
      </div>
    </div>
  );
}
