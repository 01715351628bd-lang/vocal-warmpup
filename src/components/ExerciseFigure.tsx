import React from 'react';
import { Maximize2 } from 'lucide-react';
import { EX_EMOJI, EX_IMAGES, IMG_POS } from '../data/assets';
import { CAT_EMOJI, catColor } from '../data/exercises';
import type { Exercise, Lang } from '../types/studio';
import { tr } from '../utils/storage';

interface ExerciseFigureProps {
  exercise: Exercise;
  lang: Lang;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  speaking?: boolean;
  onZoom?: (id: string) => void;
}

type PostureMode =
  | 'breath'
  | 'om'
  | 'hum'
  | 'trill'
  | 'articulate'
  | 'pitch'
  | 'reso'
  | 'proj'
  | 'calm';

function resolvePostureMode(ex: Exercise): PostureMode {
  switch (ex.c) {
    case 'breath':
      return 'breath';
    case 'om':
    case 'chant':
      return 'om';
    case 'hum':
      return 'hum';
    case 'lip':
    case 'tongue':
      return 'trill';
    case 'clarity':
    case 'artic':
    case 'tw':
      return 'articulate';
    case 'pitch':
      return 'pitch';
    case 'reso':
      return 'reso';
    case 'proj':
    case 'dyn':
      return 'proj';
    case 'cool':
    case 'relax':
    default:
      return 'calm';
  }
}

function postureClass(mode: PostureMode): string {
  switch (mode) {
    case 'breath':
      return 'anim-posture-breath';
    case 'om':
      return 'anim-posture-serene';
    case 'hum':
      return 'anim-posture-hum';
    case 'trill':
      return 'anim-posture-trill';
    case 'articulate':
      return 'anim-posture-articulate';
    case 'pitch':
      return 'anim-posture-pitch';
    case 'reso':
      return 'anim-posture-hum';
    case 'proj':
      return 'anim-posture-project';
    case 'calm':
      return 'anim-posture-calm';
  }
}

const VocalGestureOverlay: React.FC<{
  mode: PostureMode;
  color: string;
  speaking?: boolean;
}> = ({ mode, color, speaking }) => {
  switch (mode) {
    case 'breath':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Diaphragm expansion rings */}
          <circle
            cx="60"
            cy="128"
            r="24"
            stroke={color}
            strokeWidth="1.8"
            className="anim-ripple-1"
            style={{ transformOrigin: '60px 128px' }}
          />
          <circle
            cx="60"
            cy="128"
            r="24"
            stroke="#ffffff"
            strokeOpacity="0.65"
            strokeWidth="1.2"
            className="anim-ripple-2"
            style={{ transformOrigin: '60px 128px' }}
          />
          {/* Smooth inhale/exhale airflow streamlines */}
          <path
            d="M28 148 Q44 128 60 128 T92 148"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.72"
            className="anim-flow-dash"
          />
          <path
            d="M42 78 Q60 66 78 78"
            stroke="#ffffff"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="anim-trill-air"
          />
        </svg>
      );

    case 'om':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Subtle rotating sacred mandala halo */}
          <circle
            cx="60"
            cy="64"
            r="34"
            stroke={color}
            strokeOpacity="0.45"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="anim-aura-spin"
            style={{ transformOrigin: '60px 64px' }}
          />
          {/* Concentric OM / nada ripples from chest-throat */}
          <circle
            cx="60"
            cy="92"
            r="22"
            stroke={color}
            strokeWidth="1.8"
            className="anim-ripple-1"
            style={{ transformOrigin: '60px 92px' }}
          />
          <circle
            cx="60"
            cy="92"
            r="22"
            stroke="#ffd08a"
            strokeOpacity="0.7"
            strokeWidth="1.3"
            className="anim-ripple-2"
            style={{ transformOrigin: '60px 92px' }}
          />
          <circle
            cx="60"
            cy="92"
            r="22"
            stroke={color}
            strokeWidth="1.1"
            className="anim-ripple-3"
            style={{ transformOrigin: '60px 92px' }}
          />
        </svg>
      );

    case 'hum':
    case 'reso':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Nasal / facial mask resonance rings */}
          <circle
            cx="60"
            cy="72"
            r="16"
            stroke={color}
            strokeWidth="1.8"
            className="anim-ripple-1"
            style={{ transformOrigin: '60px 72px' }}
          />
          <circle
            cx="60"
            cy="72"
            r="16"
            stroke="#ffffff"
            strokeOpacity="0.65"
            strokeWidth="1.2"
            className="anim-ripple-2"
            style={{ transformOrigin: '60px 72px' }}
          />
          {/* Sympathetic harmonic wave across cheekbones */}
          <path
            d="M20 74 Q36 66 50 74 T78 74 T100 74"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.72"
            className="anim-flow-dash"
          />
        </svg>
      );

    case 'trill':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Fluttering lip/tongue vibration wavelets */}
          <g className="anim-trill-air" style={{ transformOrigin: '60px 84px' }}>
            <path
              d="M36 82 Q44 76 52 82 T68 82 T84 82"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M42 90 Q50 85 58 90 T78 90"
              stroke="#ffffff"
              strokeOpacity="0.78"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="32" cy="80" r="2.2" fill={color} opacity="0.85" />
            <circle cx="88" cy="80" r="2.2" fill={color} opacity="0.85" />
          </g>
        </svg>
      );

    case 'articulate':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Crisp speech articulation arcs & syllabic cadence bars */}
          <path
            d="M78 74 Q88 82 78 90"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            className="anim-proj-1"
            style={{ transformOrigin: '78px 82px' }}
          />
          <path
            d="M84 68 Q97 82 84 96"
            stroke="#ffffff"
            strokeOpacity="0.75"
            strokeWidth="1.7"
            strokeLinecap="round"
            className="anim-proj-2"
            style={{ transformOrigin: '84px 82px' }}
          />
          {/* Syllabic voice cadence indicator at lower third */}
          <g opacity={speaking ? 0.95 : 0.72}>
            <rect x="44" y="156" width="4" height="14" rx="2" fill={color} className="anim-syllable-1" style={{ transformOrigin: '46px 170px' }} />
            <rect x="53" y="152" width="4" height="18" rx="2" fill="#ffffff" className="anim-syllable-2" style={{ transformOrigin: '55px 170px' }} />
            <rect x="62" y="150" width="4" height="20" rx="2" fill={color} className="anim-syllable-3" style={{ transformOrigin: '64px 170px' }} />
            <rect x="71" y="155" width="4" height="15" rx="2" fill="#ffffff" className="anim-syllable-4" style={{ transformOrigin: '73px 170px' }} />
          </g>
        </svg>
      );

    case 'pitch':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Smooth melodic contour line + gliding pitch orb */}
          <path
            d="M16 154 C38 154, 48 122, 64 122 C80 122, 88 144, 104 134"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.82"
            className="anim-flow-dash"
          />
          <circle cx="36" cy="144" r="4.5" fill="#ffffff" stroke={color} strokeWidth="2" className="anim-pitch-orb" />
        </svg>
      );

    case 'proj':
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Directional forward projection wave arcs */}
          <path
            d="M72 72 Q86 84 72 96"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
            className="anim-proj-1"
            style={{ transformOrigin: '72px 84px' }}
          />
          <path
            d="M80 64 Q98 84 80 104"
            stroke="#ffffff"
            strokeOpacity="0.82"
            strokeWidth="2"
            strokeLinecap="round"
            className="anim-proj-2"
            style={{ transformOrigin: '80px 84px' }}
          />
          <path
            d="M88 56 Q110 84 88 112"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            className="anim-proj-3"
            style={{ transformOrigin: '88px 84px' }}
          />
        </svg>
      );

    case 'calm':
    default:
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 120 200"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 148 Q40 134 64 148 T110 142"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
            className="anim-flow-dash"
          />
          <circle
            cx="60"
            cy="96"
            r="26"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            className="anim-ripple-1"
            style={{ transformOrigin: '60px 96px' }}
          />
        </svg>
      );
  }
};

const VectorPostureScene: React.FC<{
  mode: PostureMode;
  color: string;
  emoji: string;
  isLarge: boolean;
  speaking?: boolean;
}> = ({ mode, color, emoji, isLarge, speaking }) => {
  const emojiSize = isLarge ? 'text-7xl' : 'text-4xl';
  const motionCls = postureClass(mode);

  return (
    <>
      {/* Ambient pulsing glow behind focal gesture */}
      <div
        className="absolute w-3/4 aspect-square rounded-full pointer-events-none animate-breathe-glow"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${color} 42%, transparent), transparent 72%)`,
        }}
      />

      {/* Category-specific animated vocal posture & gesture SVG backdrop */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 120 200"
        fill="none"
        aria-hidden="true"
      >
        {/* Subtle upright spine / posture guide */}
        <line
          x1="60"
          y1="30"
          x2="60"
          y2="170"
          stroke={color}
          strokeOpacity="0.16"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />

        {mode === 'breath' && (
          <>
            <circle cx="60" cy="100" r="26" stroke={color} strokeWidth="2" className="anim-ripple-1" style={{ transformOrigin: '60px 100px' }} />
            <circle cx="60" cy="100" r="26" stroke={color} strokeWidth="1.4" className="anim-ripple-2" style={{ transformOrigin: '60px 100px' }} />
            <path d="M12 152 Q36 132 60 152 T108 152" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.65" className="anim-flow-dash" />
          </>
        )}

        {(mode === 'om' || mode === 'reso') && (
          <>
            <circle cx="60" cy="100" r="36" stroke={color} strokeOpacity="0.45" strokeWidth="1.4" strokeDasharray="5 6" className="anim-aura-spin" style={{ transformOrigin: '60px 100px' }} />
            <circle cx="60" cy="100" r="24" stroke={color} strokeWidth="2" className="anim-ripple-1" style={{ transformOrigin: '60px 100px' }} />
            <circle cx="60" cy="100" r="24" stroke={color} strokeWidth="1.5" className="anim-ripple-2" style={{ transformOrigin: '60px 100px' }} />
            <circle cx="60" cy="100" r="24" stroke={color} strokeWidth="1.2" className="anim-ripple-3" style={{ transformOrigin: '60px 100px' }} />
          </>
        )}

        {mode === 'hum' && (
          <>
            <circle cx="60" cy="96" r="22" stroke={color} strokeWidth="1.9" className="anim-ripple-1" style={{ transformOrigin: '60px 96px' }} />
            <path d="M12 140 Q28 128 44 140 T76 140 T108 140" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.72" className="anim-flow-dash" />
            <path d="M18 152 Q36 144 54 152 T90 152" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
          </>
        )}

        {mode === 'trill' && (
          <g className="anim-trill-air" style={{ transformOrigin: '60px 136px' }}>
            <path d="M18 136 Q30 124 42 136 T66 136 T90 136 T104 136" stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity="0.82" />
            <path d="M24 148 Q38 139 52 148 T80 148 T98 148" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.52" />
          </g>
        )}

        {mode === 'articulate' && (
          <>
            <path d="M78 86 Q92 100 78 114" stroke={color} strokeWidth="2.2" strokeLinecap="round" className="anim-proj-1" style={{ transformOrigin: '78px 100px' }} />
            <path d="M86 76 Q104 100 86 124" stroke={color} strokeWidth="1.8" strokeLinecap="round" className="anim-proj-2" style={{ transformOrigin: '86px 100px' }} />
            <g opacity={speaking ? 1 : 0.8}>
              <rect x="40" y="148" width="5" height="16" rx="2.5" fill={color} className="anim-syllable-1" style={{ transformOrigin: '42.5px 164px' }} />
              <rect x="51" y="140" width="5" height="24" rx="2.5" fill={color} className="anim-syllable-2" style={{ transformOrigin: '53.5px 164px' }} />
              <rect x="62" y="136" width="5" height="28" rx="2.5" fill={color} className="anim-syllable-3" style={{ transformOrigin: '64.5px 164px' }} />
              <rect x="73" y="144" width="5" height="20" rx="2.5" fill={color} className="anim-syllable-4" style={{ transformOrigin: '75.5px 164px' }} />
            </g>
          </>
        )}

        {mode === 'pitch' && (
          <>
            <path d="M14 154 C36 154, 48 122, 66 122 C84 122, 92 144, 108 132" stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity="0.78" className="anim-flow-dash" />
            <circle cx="38" cy="144" r="4.5" fill={color} className="anim-pitch-orb" />
          </>
        )}

        {mode === 'proj' && (
          <>
            <path d="M72 82 Q90 100 72 118" stroke={color} strokeWidth="2.4" strokeLinecap="round" className="anim-proj-1" style={{ transformOrigin: '72px 100px' }} />
            <path d="M82 72 Q104 100 82 128" stroke={color} strokeWidth="2" strokeLinecap="round" className="anim-proj-2" style={{ transformOrigin: '82px 100px' }} />
            <path d="M92 62 Q118 100 92 138" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="anim-proj-3" style={{ transformOrigin: '92px 100px' }} />
          </>
        )}

        {mode === 'calm' && (
          <>
            <circle cx="60" cy="100" r="28" stroke={color} strokeOpacity="0.45" strokeWidth="1.5" className="anim-ripple-1" style={{ transformOrigin: '60px 100px' }} />
            <path d="M10 152 Q35 140 60 152 T110 148" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" className="anim-flow-dash" />
          </>
        )}
      </svg>

      {/* Centerpiece expressive gesture icon */}
      <span
        className={`relative z-10 ${emojiSize} drop-shadow-md select-none ${motionCls}`}
        style={{ willChange: 'transform' }}
      >
        {emoji}
      </span>
    </>
  );
};

export const ExerciseFigure: React.FC<ExerciseFigureProps> = ({
  exercise,
  lang,
  size = 'sm',
  active = true,
  speaking = false,
  onZoom,
}) => {
  const name = lang === 'bn' ? exercise.bn : exercise.en;
  const imgSrc = EX_IMAGES[exercise.id];
  const color = catColor(exercise.c);
  const mode = resolvePostureMode(exercise);
  const motionCls = postureClass(mode);
  const emoji = EX_EMOJI[exercise.id] || CAT_EMOJI[exercise.c] || '🎙️';

  const sizeClass =
    size === 'lg'
      ? 'w-[min(78vw,340px)] max-h-[72vh]'
      : size === 'md'
        ? 'w-32'
        : 'w-24 sm:w-28';

  const pausedClass = active ? '' : 'anim-paused';

  if (!imgSrc) {
    return (
      <figure
        className={`relative m-0 shrink-0 ${sizeClass} aspect-[3/5] rounded-2xl overflow-hidden border border-[var(--bd)] grid place-items-center shadow-lg ${pausedClass}`}
        style={{
          background: `radial-gradient(circle at 30% 18%, color-mix(in srgb, ${color} 48%, transparent), transparent 62%), linear-gradient(160deg, color-mix(in srgb, ${color} 26%, var(--bg2)), var(--bg2))`,
        }}
        role="img"
        aria-label={name}
      >
        <VectorPostureScene
          mode={mode}
          color={color}
          emoji={emoji}
          isLarge={size === 'lg'}
          speaking={speaking}
        />
        {onZoom && size !== 'lg' && (
          <button
            type="button"
            onClick={() => onZoom(exercise.id)}
            aria-label={tr(lang, 'চিত্র বড় করুন', 'Enlarge illustration')}
            className="absolute right-1.5 bottom-1.5 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#080c1c]/55 backdrop-blur-md text-white border border-white/35 hover:bg-[#080c1c]/80 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </figure>
    );
  }

  return (
    <figure
      className={`relative m-0 shrink-0 ${sizeClass} aspect-[3/5] rounded-2xl overflow-hidden border border-[var(--bd)] bg-[var(--bg2)] shadow-lg ${pausedClass}`}
    >
      {/* Animated living vocal posture image */}
      <div className={`w-full h-full ${motionCls}`}>
        <img
          src={imgSrc}
          alt={`${name} — ${tr(lang, 'সঠিক অনুশীলন ভঙ্গি', 'correct practice posture')}`}
          decoding="async"
          draggable={false}
          className="block w-full h-full object-cover select-none"
          style={{ objectPosition: IMG_POS[exercise.id] || '50% 30%' }}
        />
      </div>

      {/* Category-matched vocal expression & gesture overlay */}
      <VocalGestureOverlay mode={mode} color={color} speaking={speaking} />

      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: 'linear-gradient(180deg, transparent 62%, rgba(8, 12, 28, 0.58))',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      />
      {onZoom && size !== 'lg' && (
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
