'use client';

import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'disclaimerAcknowledged';

interface DisclaimerProps {
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAcknowledge = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <div className={`max-w-4xl mx-auto px-6 ${className}`}>
      <div className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-2xl p-4 text-[11px] text-[#8A5A44] dark:text-stone-400 font-mono tracking-wider leading-relaxed flex items-start gap-3">
        <span className="text-sm">🪷</span>
        <div className="flex-1">
          <strong className="text-[#C27A5D] uppercase tracking-widest font-bold block mb-1">
            Disclaimer
          </strong>
          Ojas is an educational wellness platform. Information, recommendations, and predictions provided here are based on classical Ayurvedic references (Charaka/Sushruta Samhita) and a predictive model. They do not constitute medical advice or clinical diagnosis. Always consult a qualified medical professional for health concerns.
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAcknowledge}
              className="text-[#C27A5D] dark:text-[#C27A5D] border border-[#C27A5D]/40 dark:border-[#C27A5D]/30 rounded px-3 py-1 text-[10px] uppercase tracking-widest font-mono hover:bg-[#C27A5D]/10 transition-colors duration-150"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

