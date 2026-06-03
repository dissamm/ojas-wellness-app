import React from 'react';

export const PoseIcon = ({ id, className = "w-12 h-12" }: { id: string, className?: string }) => {
  let paths = null;
  if (id === 'balasana') {
    paths = <path d="M 20 80 Q 35 45 60 55 Q 75 60 70 75 Q 50 85 20 80 M 70 75 L 75 80" />;
  } else if (id.startsWith('viparita_karani')) {
    paths = <path d="M 25 80 L 65 80 L 65 30 M 60 80 L 60 30" />;
  } else if (id === 'supta_baddha_konasana') {
    paths = <path d="M 15 80 L 85 80 M 35 80 Q 50 65 65 80 M 45 80 L 45 72 M 55 80 L 55 72" />;
  } else if (id === 'uttanasana' || id === 'prasarita_padottanasana') {
    paths = <path d="M 35 80 L 45 40 L 30 50 M 45 40 L 65 80" />;
  } else if (id === 'tadasana' || id === 'savasana_brief' || id === 'savasana') {
    paths = <path d="M 50 80 L 50 40 M 40 50 L 60 50 M 50 30 A 6 6 0 1 0 50 42 A 6 6 0 1 0 50 30" />;
  } else if (id === 'vrikshasana') {
    paths = <path d="M 50 80 L 50 40 M 50 60 L 35 68 L 50 72 M 40 50 L 60 50 M 50 30 A 6 6 0 1 0 50 42 A 6 6 0 1 0 50 30" />;
  } else if (id === 'setu_bandhasana' || id === 'matsyasana') {
    paths = <path d="M 20 80 Q 50 40 80 80 M 20 80 L 30 80 M 70 80 L 80 80" />;
  } else if (id === 'paschimottanasana' || id === 'janu_sirsasana') {
    paths = <path d="M 25 80 L 75 80 M 75 80 L 45 65 L 30 80" />;
  } else if (id === 'ananda_balasana') {
    paths = <path d="M 25 80 L 75 80 Q 50 80 40 55 Q 60 80 70 55" />;
  } else if (id === 'chandra_namaskar' || id === 'surya_namaskar') {
    paths = <path d="M 50 80 L 50 35 L 30 15 M 50 35 L 70 15 M 50 30 A 5 5 0 1 0 50 40 A 5 5 0 1 0 50 30" />;
  } else if (id === 'supta_matsyendrasana') {
    paths = <path d="M 20 80 Q 50 60 80 80 M 50 70 L 65 60 L 80 70" />;
  } else if (id === 'eka_pada_rajakapotasana' || id === 'kapotasana_var') {
    paths = <path d="M 20 80 Q 30 55 50 55 L 75 75 M 50 55 L 60 40" />;
  } else if (id === 'baddha_konasana') {
    paths = <path d="M 30 80 Q 50 65 70 80 M 40 80 L 60 80" />;
  } else if (id === 'cat_cow') {
    paths = <path d="M 25 80 C 35 70 50 70 60 75 M 60 75 L 60 65" />;
  } else if (id === 'savasana_eye_pillow') {
    paths = (
      <g>
        <path d="M 15 80 L 85 80 M 50 65 L 50 70" />
        <rect x="42" y="58" width="16" height="4" rx="1" fill="currentColor" opacity="0.8" />
      </g>
    );
  } else if (id === 'utkatasana') {
    paths = <path d="M 50 80 L 40 68 L 48 55 L 48 35 M 48 35 L 65 20 M 45 45 L 55 45" />;
  } else if (id === 'virabhadrasana_i') {
    paths = <path d="M 25 80 L 40 60 L 70 80 M 40 60 L 40 30 M 28 20 L 52 35" />;
  } else if (id === 'virabhadrasana_ii') {
    paths = <path d="M 25 80 L 45 60 L 65 80 M 45 60 L 45 35 M 20 35 L 70 35" />;
  } else if (id === 'navasana') {
    paths = <path d="M 30 50 L 50 75 L 70 50 M 50 75 L 50 65" />;
  } else if (id === 'ustrasana') {
    paths = <path d="M 35 80 L 35 55 Q 50 40 65 55 L 65 80 M 35 55 L 65 55" />;
  } else if (id === 'dhanurasana') {
    paths = <path d="M 25 60 Q 50 85 75 60 C 75 60 50 50 25 60" />;
  } else {
    // Default fallback icon (lotus-ish or abstract pose)
    paths = <path d="M 50 80 L 50 40 M 40 50 L 60 50 M 50 30 A 6 6 0 1 0 50 42 A 6 6 0 1 0 50 30" />;
  }

  return (
    <svg viewBox="0 0 100 100" className={`${className} stroke-current fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round select-none`}>
      {paths}
    </svg>
  );
};
