import React from 'react';

export default function AmbientSwitches({ kettleActive, nightActive, staticActive, onToggleKettle, onToggleNight, onToggleStatic }) {
  return (
    <div className="ambient-switches-rack">
      <label className="switches-label">AMBIENT VIBES</label>
      <div className="switch-buttons-grid">
        <button 
          className={`retro-toggle-btn ${kettleActive ? 'active' : ''}`}
          onClick={onToggleKettle}
          title="Kettle Boiling Ambiance"
        >
          <span className="toggle-icon">🫖</span> STEAM
        </button>
        <button 
          className={`retro-toggle-btn ${nightActive ? 'active' : ''}`}
          onClick={onToggleNight}
          title="Dusk Crickets & Rain"
        >
          <span className="toggle-icon">🌧️</span> NIGHT
        </button>
        <button 
          className={`retro-toggle-btn ${staticActive ? 'active' : ''}`}
          onClick={onToggleStatic}
          title="Radio Tuning Static"
        >
          <span className="toggle-icon">📻</span> STATIC
        </button>
      </div>
    </div>
  );
}
