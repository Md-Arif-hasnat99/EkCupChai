import React from 'react';
import { audioEngine } from '../utils/audioSynth';

export default function NewspaperModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="newspaper-paper">
        <button 
          className="close-paper-btn"
          onClick={() => {
            audioEngine.playButtonClick();
            onClose();
          }}
        >
          ✕ CLOSE
        </button>
        <div className="paper-header">
          <div className="paper-date">15 AUGUST 1996 • EDITION NO. 420</div>
          <h1 className="paper-title">दैनिक समाचार</h1>
          <div className="paper-sub">
            INDIA CELEBRATES 50 YEARS OF FREEDOM • GOLDEN ERAS OF LO-FI CHAI & TAPE DECKS
          </div>
        </div>
        <div className="paper-columns">
          <div className="paper-col">
            <h3>रोडसाइड चाय टपरी की यादें</h3>
            <p>
              1990 के दशक में शाम के वक्त चाय की दुकान पर रेडियो के गाने और कटिंग चाय की चुस्कियां हर शहर की पहचान हुआ करती थीं। मुरफी और ऑनडा के स्टीरियो पर पुराने सदाबहार नगमे गूंजते थे।
            </p>
          </div>
          <div class="paper-col">
            <h3>BPL & BUSH STEREO PLAYER</h3>
            <p>
              The iconic tape decks with glowing amber LCDs and mechanical click buttons defined late 90s music listening. Cassettes labeled "Highway Hits" and "Monsoon Lo-Fi" ruled the stalls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
