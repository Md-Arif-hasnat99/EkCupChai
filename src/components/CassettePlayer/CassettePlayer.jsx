import React, { useState, useEffect } from 'react';
import CassetteTape from './CassetteTape';
import LcdDisplay from './LcdDisplay';
import VolumeKnob from './VolumeKnob';
import AmbientSwitches from './AmbientSwitches';
import TapeButtons from './TapeButtons';
import { audioEngine } from '../../utils/audioSynth';

const TAPES = [
  {
    name: "TAPE A - ROAD-SIDE MEMORIES '96",
    label: "ROAD-SIDE MEMORIES '96",
    tracks: [
      { title: "TRACK 1: CHAI TAPRI MEMORIES - VINTAGE RADIO LO-FI", duration: 184, freq: "FM 93.5 MHz" },
      { title: "TRACK 2: SHAM KI CHAI & BPL STEREO - HIGHWAY NOSTALGIA", duration: 215, freq: "FM 98.3 MHz" },
      { title: "TRACK 3: GAON KI GALIYAN - ACOUSTIC DUSK HARMONY", duration: 198, freq: "FM 104.0 MHz" }
    ]
  },
  {
    name: "TAPE B - 90s HIGHWAY HITS",
    label: "90s HIGHWAY HITS",
    tracks: [
      { title: "TRACK 1: MONSOON HIGHWAY '98 - CASSETTE LO-FI DREAMS", duration: 202, freq: "FM 92.7 MHz" },
      { title: "TRACK 2: MIDNIGHT BUS TO MUMBAI - RETRO SYNTH BREEZE", duration: 176, freq: "FM 100.6 MHz" }
    ]
  },
  {
    name: "TAPE C - CHAI TAPRI EVENING RAGAS",
    label: "EVENING RAGAS & AMBIENT",
    tracks: [
      { title: "TRACK 1: EVENING RAGA LO-FI - SITAR & DUSK VIBES", duration: 240, freq: "AM 840 kHz" },
      { title: "TRACK 2: RAIN ON TIN ROOF CHAI - MONSOON NIGHT RAGA", duration: 210, freq: "AM 1080 kHz" }
    ]
  }
];

export default function CassettePlayer({ onTapeStateChange }) {
  const [currentTapeIndex, setCurrentTapeIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFastSpin, setIsFastSpin] = useState(false);
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

  const triggerSpinEffect = () => {
    setIsFastSpin(true);
    setTimeout(() => setIsFastSpin(false), 300);
  };

  const handleNextTrack = () => {
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    triggerSpinEffect();
    setCurrentTrackIndex((prev) => (prev + 1) % currentTape.tracks.length);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handlePrevTrack = () => {
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    triggerSpinEffect();
    setCurrentTrackIndex((prev) => (prev - 1 + currentTape.tracks.length) % currentTape.tracks.length);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handleSwitchTape = (idx) => {
    if (idx === currentTapeIndex) return;
    audioEngine.playButtonClick();
    audioEngine.triggerRadioStaticBurst();
    setCurrentTapeIndex(idx);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    if (isPlaying && !isPaused) {
      audioEngine.startMelody();
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    audioEngine.setMasterVolume(newVol);
  };

  const handleToggleKettle = () => {
    audioEngine.playButtonClick();
    const next = !kettleActive;
    setKettleActive(next);
    audioEngine.toggleKettle(next);
  };

  const handleToggleNight = () => {
    audioEngine.playButtonClick();
    const next = !nightActive;
    setNightActive(next);
    audioEngine.toggleNight(next);
  };

  const handleToggleStatic = () => {
    audioEngine.playButtonClick();
    const next = !staticActive;
    setStaticActive(next);
    audioEngine.toggleStatic(next);
  };

  return (
    <div id="cassette-player" className="retro-player-container">
      <div className="player-casing maroon-plastic-body">
        
        <div className="scratches-texture"></div>
        <div className="worn-corner-sticker">
          <span className="sticker-brand">BUSH STEREO</span>
          <span className="sticker-sub">HIGH FIDELITY TAPE</span>
          <span className="sticker-year">MAY 1996</span>
        </div>

        <div className="screw top-left"></div>
        <div className="screw top-right"></div>
        <div className="screw bottom-left"></div>
        <div className="screw bottom-right"></div>

        <div className="player-top-bar">
          <div className="brand-silkscreen">BUSH TAPE-DECK 96</div>
          <div className="tape-selector-tabs">
            {TAPES.map((t, idx) => (
              <button 
                key={idx}
                className={`tape-tab ${currentTapeIndex === idx ? 'active' : ''}`}
                onClick={() => handleSwitchTape(idx)}
              >
                TAPE {String.fromCharCode(65 + idx)}
              </button>
            ))}
          </div>
        </div>

        <div className="player-main-section">
          <CassetteTape 
            label={currentTape.label}
            isPlaying={isPlaying}
            isPaused={isPaused}
            isFastSpin={isFastSpin}
          />

          <div className="lcd-control-panel">
            <LcdDisplay 
              isPlaying={isPlaying}
              isPaused={isPaused}
              trackNum={currentTrackIndex + 1}
              totalTracks={currentTape.tracks.length}
              title={currentTrack.title}
              currentTime={currentTime}
              freq={currentTrack.freq}
            />

            <div className="controls-dials-row">
              <VolumeKnob 
                volume={volume}
                onChange={handleVolumeChange}
              />
              <AmbientSwitches 
                kettleActive={kettleActive}
                nightActive={nightActive}
                staticActive={staticActive}
                onToggleKettle={handleToggleKettle}
                onToggleNight={handleToggleNight}
                onToggleStatic={handleToggleStatic}
              />
            </div>
          </div>
        </div>

        <TapeButtons 
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onRewind={handlePrevTrack}
          onFFwd={handleNextTrack}
          onEject={() => handleSwitchTape((currentTapeIndex + 1) % TAPES.length)}
        />

      </div>
    </div>
  );
}
