/* ==========================================================================
   एक कप चाय (EK CUP CHAI) - 90s ROADSIDE CHAI STALL NOSTALGIA SCRIPT
   Interactive Web Audio Synth, Cassette Player, Controls & Ambiance
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    isPlaying: false,
    isPaused: false,
    currentTapeIndex: 0,
    currentTrackIndex: 0,
    volume: 0.75,
    currentTime: 0,
    timerInterval: null,
    listenerCount: 142,
    hindiNumerals: false,
    lightBulbOn: true,
    ambientKettle: true,
    ambientNight: true,
    ambientStatic: false,
    knobAngle: 45 // 0% is -135deg, 100% is 135deg
  };

  // Cassette Tapes & Playlists
  const tapes = [
    {
      name: "TAPE A - ROAD-SIDE MEMORIES '96",
      label: "ROAD-SIDE MEMORIES '96",
      tracks: [
        { title: "TRACK 1: CHAI TAPRI MEMORIES - VINTAGE RADIO LO-FI", duration: 184, freq: "FM 93.5 MHz", audioType: "melody1" },
        { title: "TRACK 2: SHAM KI CHAI & BPL STEREO - HIGHWAY NOSTALGIA", duration: 215, freq: "FM 98.3 MHz", audioType: "melody2" },
        { title: "TRACK 3: GAON KI GALIYAN - ACOUSTIC DUSK HARMONY", duration: 198, freq: "FM 104.0 MHz", audioType: "melody3" }
      ]
    },
    {
      name: "TAPE B - 90s HIGHWAY HITS",
      label: "90s HIGHWAY HITS",
      tracks: [
        { title: "TRACK 1: MONSOON HIGHWAY '98 - CASSETTE LO-FI DREAMS", duration: 202, freq: "FM 92.7 MHz", audioType: "melody2" },
        { title: "TRACK 2: MIDNIGHT BUS TO MUMBAI - RETRO SYNTH BREEZE", duration: 176, freq: "FM 100.6 MHz", audioType: "melody1" }
      ]
    },
    {
      name: "TAPE C - CHAI TAPRI EVENING RAGAS",
      label: "EVENING RAGAS & AMBIENT",
      tracks: [
        { title: "TRACK 1: EVENING RAGA LO-FI - SITAR & DUSK VIBES", duration: 240, freq: "AM 840 kHz", audioType: "melody3" },
        { title: "TRACK 2: RAIN ON TIN ROOF CHAI - MONSOON NIGHT RAGA", duration: 210, freq: "AM 1080 kHz", audioType: "melody1" }
      ]
    }
  ];

  // ==========================================
  // WEB AUDIO API SOUND SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let masterGain = null;
  let staticGain = null;
  let kettleGain = null;
  let nightGain = null;
  let musicGain = null;

  function initAudioContext() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Master Volume Gain
    masterGain = audioCtx.createGain();
    masterGain.gain.value = state.volume;
    masterGain.connect(audioCtx.destination);

    // Music Channel Gain
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.8;
    musicGain.connect(masterGain);

    // Initialize Ambient Sound Nodes
    setupStaticNoiseGenerator();
    setupKettleSteamGenerator();
    setupNightAmbianceGenerator();
  }

  // Radio Static Noise Synth
  let staticNode = null;
  function setupStaticNoiseGenerator() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    staticNode = audioCtx.createBufferSource();
    staticNode.buffer = noiseBuffer;
    staticNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    staticGain = audioCtx.createGain();
    staticGain.gain.value = state.ambientStatic ? 0.15 : 0;

    staticNode.connect(filter);
    filter.connect(staticGain);
    staticGain.connect(masterGain);
    staticNode.start();
  }

  // Steam Kettle Sound Synth
  let kettleNode = null;
  function setupKettleSteamGenerator() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    kettleNode = audioCtx.createBufferSource();
    kettleNode.buffer = noiseBuffer;
    kettleNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;

    kettleGain = audioCtx.createGain();
    kettleGain.gain.value = state.ambientKettle ? 0.04 : 0;

    kettleNode.connect(filter);
    filter.connect(kettleGain);
    kettleGain.connect(masterGain);
    kettleNode.start();
  }

  // Night Crickets Ambiance Synth
  let nightNode = null;
  function setupNightAmbianceGenerator() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
    }

    nightNode = audioCtx.createBufferSource();
    nightNode.buffer = noiseBuffer;
    nightNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    nightGain = audioCtx.createGain();
    nightGain.gain.value = state.ambientNight ? 0.05 : 0;

    nightNode.connect(filter);
    filter.connect(nightGain);
    nightGain.connect(masterGain);
    nightNode.start();
  }

  // Mechanical Button Snap Sound
  function playButtonClickSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  // Radio Tuning Burst Sound
  function triggerRadioTuningStatic() {
    if (!audioCtx || !staticGain) return;
    const originalGain = state.ambientStatic ? 0.15 : 0;
    staticGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    staticGain.gain.exponentialRampToValueAtTime(originalGain > 0 ? originalGain : 0.001, audioCtx.currentTime + 0.4);
  }

  // Cutting Chai Pouring Sound Effect
  function playChaiPourSound() {
    initAudioContext();
    if (!audioCtx) return;
    
    // Water trickle noise
    const bufferSize = audioCtx.sampleRate * 1.5;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.05);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 5;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    noise.start();
  }

  // Synth Nostalgic Audio Loop Engine
  let activeMelodyOscs = [];
  function playSynthesizedNostalgicAudio() {
    stopSynthesizedNostalgicAudio();
    if (!audioCtx || !state.isPlaying) return;

    // Harmonious retro 90s pentatonic lo-fi chord sequence (C Major / A Minor nostalgia)
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
    const sequence = [0, 2, 4, 3, 1, 4, 2, 0, 3, 5, 4, 2];
    let seqIdx = 0;

    const noteInterval = setInterval(() => {
      if (!state.isPlaying || state.isPaused) {
        clearInterval(noteInterval);
        return;
      }
      const freq = notes[sequence[seqIdx % sequence.length]];
      seqIdx++;

      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(noteGain);
      noteGain.connect(musicGain);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);

      activeMelodyOscs.push(osc);
    }, 600);
  }

  function stopSynthesizedNostalgicAudio() {
    activeMelodyOscs.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    activeMelodyOscs = [];
  }

  // ==========================================
  // DOM ELEMENTS & EVENT BINDINGS
  // ==========================================
  const clockTime = document.getElementById('clock-time');
  const clockAmPm = document.getElementById('clock-ampm');
  const listenerCount = document.getElementById('listener-count');
  
  const spoolLeft = document.getElementById('spool-left');
  const spoolRight = document.getElementById('spool-right');
  const tapeLabelTitle = document.getElementById('tape-label-title');
  const cassetteBody = document.getElementById('cassette-body');

  const lcdModeStatus = document.getElementById('lcd-mode-status');
  const lcdTrackNum = document.getElementById('lcd-track-num');
  const lcdSongTitle = document.getElementById('lcd-song-title');
  const lcdTimeCode = document.getElementById('lcd-time-code');
  const lcdFreq = document.getElementById('lcd-freq');

  const btnPlay = document.getElementById('btn-play');
  const btnPause = document.getElementById('btn-pause');
  const btnStop = document.getElementById('btn-stop');
  const btnRewind = document.getElementById('btn-rewind');
  const btnFFwd = document.getElementById('btn-ffwd');
  const btnEject = document.getElementById('btn-eject');

  const volumeKnob = document.getElementById('volume-knob');
  const knobNotch = document.getElementById('knob-notch');
  const volumeValDisplay = document.getElementById('volume-val-display');

  const tapeTabs = document.querySelectorAll('.tape-tab');
  const btnAmbKettle = document.getElementById('btn-amb-kettle');
  const btnAmbRain = document.getElementById('btn-amb-rain');
  const btnAmbStatic = document.getElementById('btn-amb-static');

  const bulbHotspot = document.getElementById('bulb-hotspot');
  const bulbGlow = document.getElementById('bulb-glow');
  const kettleHotspot = document.getElementById('kettle-hotspot');
  const glassesHotspot = document.getElementById('glasses-hotspot');
  const newspaperHotspot = document.getElementById('newspaper-hotspot');
  const newspaperModal = document.getElementById('newspaper-modal');
  const closeNewspaperBtn = document.getElementById('close-newspaper-btn');

  // ==========================================
  // CLOCK FUNCTIONALITY
  // ==========================================
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');

    // Blinking colon effect
    const blink = now.getSeconds() % 2 === 0 ? ':' : ' ';
    clockTime.textContent = `${hoursStr}${blink}${minutes}${blink}${seconds}`;
    clockAmPm.textContent = ampm;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // ==========================================
  // DYNAMIC LISTENER COUNTER
  // ==========================================
  const toDevanagari = (num) => {
    const devDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(num).split('').map(d => devDigits[parseInt(d)] || d).join('');
  };

  function updateListenerCounter() {
    // Organic fluctuation (+1, -1, or 0)
    const change = Math.floor(Math.random() * 3) - 1;
    state.listenerCount = Math.max(120, Math.min(185, state.listenerCount + change));

    if (state.hindiNumerals) {
      listenerCount.textContent = toDevanagari(state.listenerCount);
    } else {
      listenerCount.textContent = state.listenerCount;
    }
  }

  setInterval(updateListenerCounter, 4500);

  document.getElementById('listener-counter').addEventListener('click', () => {
    state.hindiNumerals = !state.hindiNumerals;
    updateListenerCounter();
  });

  // ==========================================
  // PLAYER UI UPDATES
  // ==========================================
  function getCurrentTrack() {
    return tapes[state.currentTapeIndex].tracks[state.currentTrackIndex];
  }

  function updatePlayerDisplay() {
    const currentTape = tapes[state.currentTapeIndex];
    const track = getCurrentTrack();

    tapeLabelTitle.textContent = currentTape.label;
    lcdTrackNum.textContent = `TR-0${state.currentTrackIndex + 1} / 0${currentTape.tracks.length}`;
    lcdSongTitle.textContent = track.title;
    lcdFreq.textContent = track.freq;

    if (state.isPlaying && !state.isPaused) {
      lcdModeStatus.textContent = "● PLAYING";
      spoolLeft.classList.add('rotating');
      spoolRight.classList.add('rotating');
      spoolLeft.classList.remove('fast-rotating');
      spoolRight.classList.remove('fast-rotating');
    } else if (state.isPaused) {
      lcdModeStatus.textContent = "⏸ PAUSED";
      spoolLeft.classList.remove('rotating', 'fast-rotating');
      spoolRight.classList.remove('rotating', 'fast-rotating');
    } else {
      lcdModeStatus.textContent = "⏹ STOPPED";
      spoolLeft.classList.remove('rotating', 'fast-rotating');
      spoolRight.classList.remove('rotating', 'fast-rotating');
    }

    updateTimecode();
  }

  function updateTimecode() {
    const mins = String(Math.floor(state.currentTime / 60)).padStart(2, '0');
    const secs = String(state.currentTime % 60).padStart(2, '0');
    lcdTimeCode.textContent = `${mins}:${secs}`;
  }

  function startPlaybackTimer() {
    stopPlaybackTimer();
    state.timerInterval = setInterval(() => {
      if (state.isPlaying && !state.isPaused) {
        state.currentTime++;
        const track = getCurrentTrack();
        if (state.currentTime >= track.duration) {
          nextTrack();
        } else {
          updateTimecode();
        }
      }
    }, 1000);
  }

  function stopPlaybackTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  // ==========================================
  // CASSETTE CONTROL ACTIONS
  // ==========================================
  function playCassette() {
    initAudioContext();
    playButtonClickSound();

    state.isPlaying = true;
    state.isPaused = false;
    updatePlayerDisplay();
    startPlaybackTimer();
    playSynthesizedNostalgicAudio();

    btnPlay.classList.add('active-state');
    btnPause.classList.remove('active-state');
    btnStop.classList.remove('active-state');
  }

  function pauseCassette() {
    playButtonClickSound();
    if (!state.isPlaying) return;

    state.isPaused = !state.isPaused;
    if (state.isPaused) {
      stopSynthesizedNostalgicAudio();
      btnPause.classList.add('active-state');
      btnPlay.classList.remove('active-state');
    } else {
      playSynthesizedNostalgicAudio();
      btnPlay.classList.add('active-state');
      btnPause.classList.remove('active-state');
    }
    updatePlayerDisplay();
  }

  function stopCassette() {
    playButtonClickSound();
    state.isPlaying = false;
    state.isPaused = false;
    state.currentTime = 0;
    stopPlaybackTimer();
    stopSynthesizedNostalgicAudio();
    updatePlayerDisplay();

    btnStop.classList.add('active-state');
    btnPlay.classList.remove('active-state');
    btnPause.classList.remove('active-state');
  }

  function nextTrack() {
    triggerRadioTuningStatic();
    playButtonClickSound();

    const currentTape = tapes[state.currentTapeIndex];
    state.currentTrackIndex = (state.currentTrackIndex + 1) % currentTape.tracks.length;
    state.currentTime = 0;

    // Fast rewind visual effect
    spoolLeft.classList.add('fast-rotating');
    spoolRight.classList.add('fast-rotating');
    setTimeout(() => {
      updatePlayerDisplay();
      if (state.isPlaying && !state.isPaused) {
        playSynthesizedNostalgicAudio();
      }
    }, 300);
  }

  function prevTrack() {
    triggerRadioTuningStatic();
    playButtonClickSound();

    const currentTape = tapes[state.currentTapeIndex];
    state.currentTrackIndex = (state.currentTrackIndex - 1 + currentTape.tracks.length) % currentTape.tracks.length;
    state.currentTime = 0;

    spoolLeft.classList.add('fast-rotating');
    spoolRight.classList.add('fast-rotating');
    setTimeout(() => {
      updatePlayerDisplay();
      if (state.isPlaying && !state.isPaused) {
        playSynthesizedNostalgicAudio();
      }
    }, 300);
  }

  function switchTape(tapeIndex) {
    if (tapeIndex === state.currentTapeIndex) return;
    triggerRadioTuningStatic();
    playButtonClickSound();

    state.currentTapeIndex = tapeIndex;
    state.currentTrackIndex = 0;
    state.currentTime = 0;

    tapeTabs.forEach((tab, idx) => {
      if (idx === tapeIndex) tab.classList.add('active');
      else tab.classList.remove('active');
    });

    updatePlayerDisplay();
    if (state.isPlaying && !state.isPaused) {
      playSynthesizedNostalgicAudio();
    }
  }

  // ==========================================
  // ROTARY VOLUME KNOB INTERACTION
  // ==========================================
  function updateVolume(newVol) {
    state.volume = Math.max(0, Math.min(1, newVol));
    const percent = Math.round(state.volume * 100);
    volumeValDisplay.textContent = `${percent}%`;

    // Angle mapping: 0% -> -135deg, 100% -> 135deg
    const angle = -135 + (state.volume * 270);
    knobNotch.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    if (masterGain) {
      masterGain.gain.setValueAtTime(state.volume, audioCtx.currentTime);
    }
  }

  let isDraggingKnob = false;
  let startY = 0;
  let startVol = 0;

  volumeKnob.addEventListener('mousedown', (e) => {
    isDraggingKnob = true;
    startY = e.clientY;
    startVol = state.volume;
    document.body.style.cursor = 'ns-resize';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingKnob) return;
    const deltaY = startY - e.clientY;
    const deltaVol = deltaY / 150;
    updateVolume(startVol + deltaVol);
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingKnob) {
      isDraggingKnob = false;
      document.body.style.cursor = 'default';
    }
  });

  volumeKnob.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    updateVolume(state.volume + delta);
  });

  // ==========================================
  // BUTTON & TAB EVENT LISTENERS
  // ==========================================
  btnPlay.addEventListener('click', playCassette);
  btnPause.addEventListener('click', pauseCassette);
  btnStop.addEventListener('click', stopCassette);
  btnFFwd.addEventListener('click', nextTrack);
  btnRewind.addEventListener('click', prevTrack);
  btnEject.addEventListener('click', () => {
    stopCassette();
    switchTape((state.currentTapeIndex + 1) % tapes.length);
  });

  tapeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.getAttribute('data-tape'));
      switchTape(idx);
    });
  });

  // Ambient Switches Toggles
  btnAmbKettle.addEventListener('click', () => {
    playButtonClickSound();
    state.ambientKettle = !state.ambientKettle;
    btnAmbKettle.classList.toggle('active', state.ambientKettle);
    if (kettleGain && audioCtx) {
      kettleGain.gain.setValueAtTime(state.ambientKettle ? 0.04 : 0, audioCtx.currentTime);
    }
  });

  btnAmbRain.addEventListener('click', () => {
    playButtonClickSound();
    state.ambientNight = !state.ambientNight;
    btnAmbRain.classList.toggle('active', state.ambientNight);
    if (nightGain && audioCtx) {
      nightGain.gain.setValueAtTime(state.ambientNight ? 0.05 : 0, audioCtx.currentTime);
    }
  });

  btnAmbStatic.addEventListener('click', () => {
    playButtonClickSound();
    state.ambientStatic = !state.ambientStatic;
    btnAmbStatic.classList.toggle('active', state.ambientStatic);
    if (staticGain && audioCtx) {
      staticGain.gain.setValueAtTime(state.ambientStatic ? 0.15 : 0, audioCtx.currentTime);
    }
  });

  // ==========================================
  // STALL INTERACTIVE HOTSPOTS
  // ==========================================
  // Hanging Bulb Toggle
  bulbHotspot.addEventListener('click', () => {
    initAudioContext();
    playButtonClickSound();
    state.lightBulbOn = !state.lightBulbOn;
    bulbGlow.style.opacity = state.lightBulbOn ? '1' : '0.1';
  });

  // Tea Kettle Steam Burst
  kettleHotspot.addEventListener('click', () => {
    initAudioContext();
    playButtonClickSound();
    const puffs = document.querySelectorAll('.steam-puff');
    puffs.forEach(p => {
      p.style.animation = 'none';
      p.offsetHeight; // trigger reflow
      p.style.animation = 'steamRise 1.5s infinite ease-out';
    });
  });

  // Tea Glasses Pouring Sound
  glassesHotspot.addEventListener('click', () => {
    playChaiPourSound();
  });

  // Retro Newspaper Modal
  newspaperHotspot.addEventListener('click', () => {
    playButtonClickSound();
    newspaperModal.classList.remove('hidden');
  });

  closeNewspaperBtn.addEventListener('click', () => {
    playButtonClickSound();
    newspaperModal.classList.add('hidden');
  });

  // Initialize Default State
  updatePlayerDisplay();
  updateVolume(0.75);

})();
