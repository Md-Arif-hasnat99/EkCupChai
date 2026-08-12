import React, { useState, useEffect } from 'react';

export default function ChalkSlateCounter() {
  const [count, setCount] = useState(142);
  const [useHindi, setUseHindi] = useState(false);

  const toDevanagari = (num) => {
    const devDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return String(num).split('').map(d => devDigits[parseInt(d)] || d).join('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 3) - 1;
      setCount(prev => Math.max(120, Math.min(185, prev + change)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="listener-counter" 
      className="chalk-slate-panel"
      onClick={() => setUseHindi(!useHindi)}
      title="Click to toggle Hindi/English numerals"
    >
      <div className="slate-wood-frame">
        <div className="slate-surface">
          <div className="chalk-header-text">एक कप चाय ☕</div>
          <div className="chalk-counter-body">
            <span className="chalk-number">
              {useHindi ? toDevanagari(count) : count}
            </span>
            <span className="chalk-label">log abhi yahan hain</span>
          </div>
          <div className="chalk-subtext">लोग अभी यहाँ हैं</div>
          <div className="chalk-dust"></div>
        </div>
      </div>
    </div>
  );
}
