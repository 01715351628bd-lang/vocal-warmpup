import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX, Wind, X } from 'lucide-react';
import type { Lang } from '../types/studio';
import { formatNum, tr } from '../utils/storage';

interface BreathingOverlayProps {
  lang: Lang;
  muted?: boolean;
  onClose: () => void;
}

type PhaseKey = 'inhale' | 'hold' | 'exhale';

interface PhaseSpec {
  key: PhaseKey;
  sec: number;
  labelBn: string;
  labelEn: string;
  cueBn: string;
  cueEn: string;
  color: string;
}

const PHASES: PhaseSpec[] = [
  {
    key: 'inhale',
    sec: 4,
    labelBn: 'শ্বাস নিন',
    labelEn: 'Inhale',
    cueBn: 'নাক দিয়ে ধীরে ও গভীরভাবে শ্বাস নিন',
    cueEn: 'Breathe in slowly through your nose',
    color: '#3de0b5',
  },
  {
    key: 'hold',
    sec: 7,
    labelBn: 'ধরে রাখুন',
    labelEn: 'Hold',
    cueBn: 'কাঁধ শিথিল রেখে আরামে ধরে রাখুন',
    cueEn: 'Hold gently with relaxed shoulders',
    color: '#45b0ff',
  },
  {
    key: 'exhale',
    sec: 8,
    labelBn: 'ধীরে ছাড়ুন',
    labelEn: 'Exhale',
    cueBn: 'মুখ দিয়ে সমান ধারায় সম্পূর্ণ শ্বাস ছাড়ুন',
    cueEn: 'Exhale smoothly and completely through the mouth',
    color: '#8b7cf6',
  },
];

const TOTAL_CYCLE_MS = (4 + 7 + 8) * 1000;

export const BreathingOverlay: React.FC<BreathingOverlayProps> = ({ lang, muted = false, onClose }) => {
  const [running, setRunning] = useState(true);
  const [soundOn, setSoundOn] = useState(!muted);
  const [targetCycles, setTargetCycles] = useState<number>(4);
  const [phaseIdx, setPhaseIdx] = useState<number>(0);
  const [phaseRemain, setPhaseRemain] = useState<number>(4);
  const [cycleNum, setCycleNum] = useState<number>(1);
  const [completedAll, setCompletedAll] = useState<boolean>(false);

  const circleRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const elapsedMsRef = useRef<number>(0);
  const lastTickRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const lastPhaseCueRef = useRef<string>('');
  const chimeCtxRef = useRef<AudioContext | null>(null);

  const playPhaseCue = useCallback(
    (phase: PhaseKey) => {
      if (!soundOn) return;
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        if (!chimeCtxRef.current) chimeCtxRef.current = new Ctor();
        const ctx = chimeCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(
          phase === 'inhale' ? 392 : phase === 'hold' ? 523.25 : 329.63,
          now
        );
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } catch {
        // ignore audio cue failure
      }
    },
    [soundOn]
  );

  // Escape closes overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (chimeCtxRef.current) {
        chimeCtxRef.current.close().catch(() => {});
        chimeCtxRef.current = null;
      }
    };
  }, [onClose]);

  useEffect(() => {
    const CIRCUMFERENCE = 2 * Math.PI * 108;

    const updateVisuals = (msTotal: number) => {
      const cyclePos = msTotal % TOTAL_CYCLE_MS;
      let idx = 0;
      let intoPhase = cyclePos;
      if (cyclePos < 4000) {
        idx = 0;
        intoPhase = cyclePos;
      } else if (cyclePos < 11000) {
        idx = 1;
        intoPhase = cyclePos - 4000;
      } else {
        idx = 2;
        intoPhase = cyclePos - 11000;
      }

      const spec = PHASES[idx];
      const phaseProgress = Math.min(1, Math.max(0, intoPhase / (spec.sec * 1000)));
      const remain = Math.max(1, Math.ceil((spec.sec * 1000 - intoPhase) / 1000));
      const curCycle = Math.floor(msTotal / TOTAL_CYCLE_MS) + 1;

      // Ease in-out scale for inhale expand -> hold steady pulse -> exhale contract
      const ease = 0.5 - Math.cos(Math.PI * phaseProgress) / 2;
      let scale = 0.68;
      if (spec.key === 'inhale') {
        scale = 0.68 + ease * 0.44;
      } else if (spec.key === 'hold') {
        scale = 1.12 + Math.sin(phaseProgress * Math.PI * 3) * 0.02;
      } else {
        scale = 1.12 - ease * 0.44;
      }

      if (circleRef.current) {
        circleRef.current.style.transform = `scale(${scale.toFixed(4)})`;
        circleRef.current.style.boxShadow = `0 0 46px ${spec.color}55, inset 0 0 28px ${spec.color}40`;
        circleRef.current.style.borderColor = spec.color;
      }
      if (ringRef.current) {
        ringRef.current.style.stroke = spec.color;
        ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - phaseProgress));
      }

      setPhaseIdx(idx);
      setPhaseRemain(remain);
      setCycleNum(Math.min(targetCycles, curCycle));

      const cueKey = `${curCycle}-${spec.key}`;
      if (lastPhaseCueRef.current !== cueKey && curCycle <= targetCycles) {
        lastPhaseCueRef.current = cueKey;
        playPhaseCue(spec.key);
      }
    };

    if (!running) {
      lastTickRef.current = null;
      updateVisuals(elapsedMsRef.current);
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current !== null) {
        elapsedMsRef.current += now - lastTickRef.current;
      }
      lastTickRef.current = now;

      if (elapsedMsRef.current >= targetCycles * TOTAL_CYCLE_MS) {
        elapsedMsRef.current = targetCycles * TOTAL_CYCLE_MS - 1;
        updateVisuals(elapsedMsRef.current);
        setRunning(false);
        setCompletedAll(true);
        return;
      }

      updateVisuals(elapsedMsRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, targetCycles, playPhaseCue]);

  const handleReset = () => {
    elapsedMsRef.current = 0;
    lastTickRef.current = null;
    lastPhaseCueRef.current = '';
    setCompletedAll(false);
    setPhaseIdx(0);
    setPhaseRemain(4);
    setCycleNum(1);
    setRunning(true);
  };

  const activePhase = PHASES[phaseIdx];
  const CIRC = 2 * Math.PI * 108;

  return (
    <div
      className="fixed inset-0 z-[75] bg-[#060918]/92 backdrop-blur-lg flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={tr(lang, '৪-৭-৮ শ্বাস-প্রশ্বাস অনুশীলন', '4-7-8 Breathing Exercise')}
      onClick={onClose}
    >
      <div
        className="studio-card w-full max-w-md p-5 sm:p-6 space-y-5 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-left">
            <span className="w-9 h-9 rounded-2xl grid place-items-center bg-[#3de0b5]/15 border border-[#3de0b5]/35 text-[#3de0b5]">
              <Wind className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--tx)] m-0">
                {tr(lang, '৪-৭-৮ শ্বাস-প্রশ্বাস', '4-7-8 Breathing')}
              </h2>
              <p className="text-[11px] text-[var(--mu)] m-0 font-mono-num">
                {tr(lang, 'রাউন্ড', 'Cycle')} {formatNum(cycleNum, lang)} / {formatNum(targetCycles, lang)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSoundOn((v) => !v)}
              aria-label={soundOn ? tr(lang, 'শব্দ বন্ধ', 'Mute cue') : tr(lang, 'শব্দ চালু', 'Enable cue')}
              className="studio-btn-sec min-w-[40px] min-h-[40px] rounded-full grid place-items-center cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[var(--ac2)]" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={tr(lang, 'বন্ধ করুন', 'Close')}
              className="studio-btn-sec min-w-[40px] min-h-[40px] rounded-full grid place-items-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phase Indicator Pills (4 - 7 - 8) */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {PHASES.map((p, idx) => {
            const isCur = idx === phaseIdx && !completedAll;
            return (
              <div
                key={p.key}
                className={`py-1.5 px-2 rounded-xl border font-semibold transition-all ${
                  isCur
                    ? 'bg-[var(--bg2)] text-[var(--tx)] shadow'
                    : 'bg-[var(--bg2)]/40 border-[var(--bd)] text-[var(--mu)]'
                }`}
                style={isCur ? { borderColor: p.color } : undefined}
              >
                <span className="font-mono-num">{formatNum(p.sec, lang)}s</span> ·{' '}
                <span>{lang === 'bn' ? p.labelBn : p.labelEn}</span>
              </div>
            );
          })}
        </div>

        {/* Animated Expanding/Contracting Circle */}
        <div className="relative h-64 flex items-center justify-center my-1">
          <svg
            viewBox="0 0 240 240"
            className="absolute w-60 h-60 -rotate-90 pointer-events-none"
            aria-hidden="true"
          >
            <circle
              cx="120"
              cy="120"
              r="108"
              fill="none"
              stroke="rgba(148,163,184,0.16)"
              strokeWidth="6"
            />
            <circle
              ref={ringRef}
              cx="120"
              cy="120"
              r="108"
              fill="none"
              stroke={activePhase.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
            />
          </svg>

          <div
            ref={circleRef}
            className="w-40 h-40 rounded-full border-2 flex flex-col items-center justify-center will-change-transform"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2), rgba(61,224,181,0.14) 55%, rgba(139,124,246,0.22))',
              borderColor: activePhase.color,
              transform: 'scale(0.68)',
            }}
          >
            {completedAll ? (
              <>
                <span className="text-2xl">✨</span>
                <span className="text-sm font-extrabold text-[var(--tx)] mt-1">
                  {tr(lang, 'সম্পন্ন!', 'Complete!')}
                </span>
              </>
            ) : (
              <>
                <span
                  className="text-4xl font-extrabold font-mono-num leading-none"
                  style={{ color: activePhase.color }}
                >
                  {formatNum(phaseRemain, lang)}
                </span>
                <span className="text-sm font-extrabold text-[var(--tx)] mt-1.5">
                  {lang === 'bn' ? activePhase.labelBn : activePhase.labelEn}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Guidance Cue */}
        <p className="text-sm font-semibold text-[var(--tx)] m-0 min-h-[2.5rem] flex items-center justify-center">
          {completedAll
            ? tr(
                lang,
                'চমৎকার! আপনার শ্বাস ও কণ্ঠ এখন রেকর্ডিংয়ের জন্য প্রস্তুত।',
                'Great job! Your breath and vocal tract are calm and ready to record.'
              )
            : lang === 'bn'
              ? activePhase.cueBn
              : activePhase.cueEn}
        </p>

        {/* Cycle Count Selector */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-[var(--mu)] font-semibold">{tr(lang, 'রাউন্ড:', 'Cycles:')}</span>
          {[4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setTargetCycles(n);
                if (completedAll) handleReset();
              }}
              className={`min-h-[34px] px-3 rounded-xl font-mono-num font-bold cursor-pointer ${
                targetCycles === n ? 'studio-btn-pri' : 'studio-btn-sec'
              }`}
            >
              {formatNum(n, lang)}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5">
          {completedAll ? (
            <button
              type="button"
              onClick={handleReset}
              className="studio-btn-pri flex-1 min-h-[46px] rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{tr(lang, 'আবার শুরু করুন', 'Restart')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="studio-btn-pri flex-1 min-h-[46px] rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{running ? tr(lang, 'বিরতি', 'Pause') : tr(lang, 'চালু করুন', 'Resume')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="studio-btn-sec min-h-[46px] px-4 rounded-2xl inline-flex items-center justify-center gap-1.5 text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{tr(lang, 'রিসেট', 'Reset')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
