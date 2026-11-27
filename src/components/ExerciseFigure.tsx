import React from 'react';
import { Maximize2 } from 'lucide-react';
import { EX_EMOJI, EX_IMAGES, IMG_POS } from '../data/assets';
import { CAT_EMOJI, catColor } from '../data/exercises';
import type { Exercise, Lang } from '../types/studio';
import { tr } from '../utils/storage';

interface ExerciseFigureProps {
  exercise: Exercise;
  lang: Lang;
  size?: 'sm' | 'md';
  onZoom?: (id: string) => void;
}

export const ExerciseFigure: React.FC<ExerciseFigureProps> = ({
  exercise,
  lang,
  size = 'sm',
  onZoom,
}) => {
  const name = lang === 'bn' ? exercise.bn : exercise.en;
  const imgSrc = EX_IMAGES[exercise.id];
  const color = catColor(exercise.c);
  const widthClass = size === 'md' ? 'w-32' : 'w-24 sm:w-28';

  if (!imgSrc) {
    return (
      <figure
        className={`relative m-0 shrink-0 ${widthClass} aspect-[3/5] rounded-2xl overflow-hidden border border-[var(--bd)] grid place-items-center shadow-lg`}
        style={{
          background: `radial-gradient(circle at 30% 18%, color-mix(in srgb, ${color} 48%, transparent), transparent 62%), linear-gradient(160deg, color-mix(in srgb, ${color} 26%, var(--bg2)), var(--bg2))`,
        }}
        role="img"
        aria-label={name}
      >
        <svg
          className="absolute left-0 right-0 bottom-[14%] w-full opacity-55 pointer-events-none"
          viewBox="0 0 100 40"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M0 20Q12 2 25 20T50 20T75 20T100 20" />
          <path d="M0 28Q12 12 25 28T50 28T75 28T100 28" opacity="0.5" />
        </svg>
        <span className="relative z-10 text-4xl drop-shadow-md select-none">
          {EX_EMOJI[exercise.id] || CAT_EMOJI[exercise.c] || '🎙️'}
        </span>
      </figure>
    );
  }

  return (
    <figure
      className={`relative m-0 shrink-0 ${widthClass} aspect-[3/5] rounded-2xl overflow-hidden border border-[var(--bd)] bg-[var(--bg2)] shadow-lg`}
    >
      <img
        src={imgSrc}
        alt={`${name} — ${tr(lang, 'সঠিক অনুশীলন ভঙ্গি', 'correct practice posture')}`}
        decoding="async"
        draggable={false}
        className="block w-full h-full object-cover select-none"
        style={{ objectPosition: IMG_POS[exercise.id] || '50% 30%' }}
      />
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: 'linear-gradient(180deg, transparent 62%, rgba(8, 12, 28, 0.58))',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      />
      {onZoom && (
        <button
          type="button"
          onClick={() => onZoom(exercise.id)}
          aria-label={tr(lang, 'ছবি বড় করুন', 'Enlarge picture')}
          className="absolute right-1.5 bottom-1.5 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#080c1c]/65 backdrop-blur-md text-white border border-white/40 hover:bg-[#080c1c]/85 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
    </figure>
  );
};
