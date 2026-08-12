import React, { useState } from 'react';
import DigitalClock from './components/DigitalClock';
import ChalkSlateCounter from './components/ChalkSlateCounter';
import RetroPlayerBar from './components/RetroPlayerBar';
import NewspaperModal from './components/NewspaperModal';
import { audioEngine } from './utils/audioSynth';

export default function App() {
  const [isBulbOn, setIsBulbOn] = useState(true);
  const [isNewspaperOpen, setIsNewspaperOpen] = useState(false);
  const [isTapePlaying, setIsTapePlaying] = useState(false);
  const [steamKey, setSteamKey] = useState(0);

  const handleBulbClick = () => {
    audioEngine.playButtonClick();
    setIsBulbOn(prev => !prev);
  };

  const handleKettleClick = () => {
    audioEngine.playButtonClick();
    setSteamKey(prev => prev + 1);
  };

  const handleGlassesClick = () => {
    audioEngine.playChaiPourSound();
  };

  const handleNewspaperClick = () => {
    audioEngine.playButtonClick();
    setIsNewspaperOpen(true);
  };

  return (
    <div id="scene-container" className="scene-container">
      {/* Responsive Background Images */}
      <picture className="bg-picture">
        <source media="(max-aspect-ratio: 1/1)" srcset="/assets/bg-1.jpg" />
        <img 
          src="/assets/bg-2.jpg" 
          alt="एक कप चाय - 90s Roadside Chai Stall at Dusk" 
          id="bg-img" 
          className="bg-img" 
        />
      </picture>

      {/* Ambient Overlays */}
      <div className="dusk-overlay"></div>
      <div className="vintage-grain-overlay"></div>

      {/* Interactive Scene Hotspots */}
      <div className="hotspots-layer">
        <div 
          id="bulb-hotspot" 
          className="hotspot bulb-hotspot" 
          title="Light Bulb (Click to toggle glow)"
          onClick={handleBulbClick}
        >
          <div 
            className="bulb-glow-element" 
            style={{ opacity: isBulbOn ? 1 : 0.1 }}
          />
        </div>

        <div 
          id="kettle-hotspot" 
          className="hotspot kettle-hotspot" 
          title="Tea Kettle (Click for steam & sound)"
          onClick={handleKettleClick}
        >
          <div key={steamKey} className="steam-container">
            <span className="steam-puff"></span>
            <span className="steam-puff"></span>
            <span className="steam-puff"></span>
          </div>
        </div>

        <div 
          id="glasses-hotspot" 
          className="hotspot glasses-hotspot" 
          title="Cutting Chai Glasses (Click for pour sound)"
          onClick={handleGlassesClick}
        />

        <div 
          id="newspaper-hotspot" 
          className="hotspot newspaper-hotspot" 
          title="Read 1996 Newspaper (Click to open)"
          onClick={handleNewspaperClick}
        />
      </div>

      {/* TOP-LEFT: 90s RED LED DIGITAL CLOCK */}
      <DigitalClock isTapePlaying={isTapePlaying} />

      {/* TOP-RIGHT: LIVE LISTENER CHALK SLATE COUNTER */}
      <ChalkSlateCounter />

      {/* AUTHENTIC STANDARD RETRO PLAYER BAR */}
      <RetroPlayerBar onTapeStateChange={setIsTapePlaying} />

      {/* RETRO NEWSPAPER POPUP MODAL */}
      <NewspaperModal 
        isOpen={isNewspaperOpen} 
        onClose={() => setIsNewspaperOpen(false)} 
      />
    </div>
  );
}
