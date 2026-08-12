/* ==========================================================================
   WEB AUDIO API SYNTHESIZER & LOCAL AUDIO PLAYER ENGINE
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.staticGain = null;
    this.kettleGain = null;
    this.nightGain = null;

    this.staticNode = null;
    this.kettleNode = null;
    this.nightNode = null;

    this.activeMelodies = [];
    this.sequenceInterval = null;

    // HTML5 Audio element for local MP3/WAV file playback
    this.localAudioElement = null;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    // Master Volume
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.75;
    this.masterGain.connect(this.audioCtx.destination);

    // Music Channel
    this.musicGain = this.audioCtx.createGain();
    this.musicGain.gain.value = 0.8;
    this.musicGain.connect(this.masterGain);

    // HTML5 Audio Node for local files
    this.localAudioElement = new Audio();
    const sourceNode = this.audioCtx.createMediaElementSource(this.localAudioElement);
    sourceNode.connect(this.musicGain);

    // Setup Ambient Noise Generators
    this._setupStaticNoise();
    this._setupKettleSteam();
    this._setupNightAmbiance();
  }

  setMasterVolume(val) {
    if (!this.audioCtx) return;
    const vol = Math.max(0, Math.min(1, val));
    this.masterGain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    if (this.localAudioElement) {
      this.localAudioElement.volume = vol;
    }
  }

  playLocalTrack(audioUrl) {
    this.init();
    this.stopMelody();

    if (this.localAudioElement) {
      const targetSrc = window.location.origin + encodeURI(audioUrl);
      if (this.localAudioElement.src !== targetSrc && audioUrl) {
        this.localAudioElement.src = audioUrl;
      }
      this.localAudioElement.play().catch(err => {
        console.warn('Playback error or no file at url:', audioUrl, err);
      });
    }
  }

  pauseLocalTrack() {
    if (this.localAudioElement) {
      this.localAudioElement.pause();
    }
    this.stopMelody();
  }

  seekLocalTrack(seconds) {
    if (this.localAudioElement) {
      this.localAudioElement.currentTime = seconds;
    }
  }

  _setupStaticNoise() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.staticNode = this.audioCtx.createBufferSource();
    this.staticNode.buffer = buffer;
    this.staticNode.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    this.staticGain = this.audioCtx.createGain();
    this.staticGain.gain.value = 0;

    this.staticNode.connect(filter);
    filter.connect(this.staticGain);
    this.staticGain.connect(this.masterGain);
    this.staticNode.start();
  }

  _setupKettleSteam() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.kettleNode = this.audioCtx.createBufferSource();
    this.kettleNode.buffer = buffer;
    this.kettleNode.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3200;

    this.kettleGain = this.audioCtx.createGain();
    this.kettleGain.gain.value = 0;

    this.kettleNode.connect(filter);
    filter.connect(this.kettleGain);
    this.kettleGain.connect(this.masterGain);
    this.kettleNode.start();
  }

  _setupNightAmbiance() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
    }

    this.nightNode = this.audioCtx.createBufferSource();
    this.nightNode.buffer = buffer;
    this.nightNode.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850;

    this.nightGain = this.audioCtx.createGain();
    this.nightGain.gain.value = 0;

    this.nightNode.connect(filter);
    filter.connect(this.nightGain);
    this.nightGain.connect(this.masterGain);
    this.nightNode.start();
  }

  playButtonClick() {
    this.init();
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, this.audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  triggerRadioStaticBurst() {
    this.init();
    if (!this.audioCtx || !this.staticGain) return;
    const currentStatic = this.staticGain.gain.value;
    this.staticGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    this.staticGain.gain.exponentialRampToValueAtTime(currentStatic > 0 ? currentStatic : 0.001, this.audioCtx.currentTime + 0.4);
  }

  playChaiPourSound() {
    this.init();
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 1.5;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.05);
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1750;
    filter.Q.value = 4.5;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }

  startMelody() {
    this.init();
    this.stopMelody();

    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
    const sequence = [0, 2, 4, 3, 1, 4, 2, 0, 3, 5, 4, 2];
    let seqIdx = 0;

    this.sequenceInterval = setInterval(() => {
      if (!this.audioCtx) return;
      const freq = notes[sequence[seqIdx % sequence.length]];
      seqIdx++;

      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);

      osc.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.85);

      this.activeMelodies.push(osc);
    }, 600);
  }

  stopMelody() {
    if (this.sequenceInterval) {
      clearInterval(this.sequenceInterval);
      this.sequenceInterval = null;
    }
    this.activeMelodies.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.activeMelodies = [];
  }

  toggleKettle(active) {
    if (this.kettleGain && this.audioCtx) {
      this.kettleGain.gain.setValueAtTime(active ? 0.04 : 0, this.audioCtx.currentTime);
    }
  }

  toggleNight(active) {
    if (this.nightGain && this.audioCtx) {
      this.nightGain.gain.setValueAtTime(active ? 0.05 : 0, this.audioCtx.currentTime);
    }
  }

  toggleStatic(active) {
    if (this.staticGain && this.audioCtx) {
      this.staticGain.gain.setValueAtTime(active ? 0.15 : 0, this.audioCtx.currentTime);
    }
  }
}

export const audioEngine = new AudioEngine();
