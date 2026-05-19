'use client';

import React from 'react';

interface DisclaimerProps {
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '' }) => {
  return (
    <div className={`max-w-4xl mx-auto px-6 ${className}`}>
      <div className="bg-[#FDF6EC] dark:bg-stone-900/60 border border-orange-100/50 dark:border-stone-850 rounded-2xl p-4 text-[11px] text-[#8A5A44] dark:text-stone-400 font-mono tracking-wider leading-relaxed flex items-start gap-3">
        <span className="text-sm">🪷</span>
        <div>
          <strong className="text-[#C27A5D] uppercase tracking-widest font-bold block mb-1">
            Disclaimer
          </strong>
          Ojas is an educational wellness platform. Information, recommendations, and predictions provided here are based on classical Ayurvedic references (Charaka/Sushruta Samhita) and a predictive model. They do not constitute medical advice or clinical diagnosis. Always consult a qualified medical professional for health concerns.
        </div>
      </div>
    </div>
  );
};
