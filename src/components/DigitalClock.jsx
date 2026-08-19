import React, { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div id="retro-analog-clock" className="retro-analog-clock-container">
      <div className="clock-dial">
        {/* Dial markers */}
        <div className="dial-marker marker-12"></div>
        <div className="dial-marker marker-3"></div>
        <div className="dial-marker marker-6"></div>
        <div className="dial-marker marker-9"></div>
        
        {/* Hands */}
        <div 
          className="clock-hand hour-hand" 
          style={{ transform: `rotate(${hourDeg}deg)` }}
        ></div>
        <div 
          className="clock-hand minute-hand" 
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        ></div>
        <div 
          className="clock-hand second-hand" 
          style={{ transform: `rotate(${secondDeg}deg)` }}
        ></div>
        
        {/* Center pin */}
        <div className="clock-center-pin"></div>
      </div>
    </div>
  );
}
