import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { EX_MAP, LEVEL_LABELS } from '../data/exercises';
import type { AppState, BgSoundKind, SessionStep } from '../types/studio';
import {
  ensureAudioEngine,
  getBgAnalyser,
  hasSpeechSynthesis,
  isBgSoundRunning,
  pickVoice,
  speakCue,
  startBgSound,
  stopBgSound,
  stopSpeech,
  updateAudioVolume,
} from '../utils/audioEngine';
import { formatNum, tr } from '../utils/storage';
import { ExerciseFigure } from './ExerciseFigure';

export interface ActiveSession {
  list: SessionStep[];
  name: string;
}

interface PlayerOverlayProps {
  session: ActiveSession;
  state: AppState;
  onUpdateState: (patch: Partial<AppState>) => void;
  onCompleteSession: (spentSec: number, doneIds: string[], completed: boolean) => void;
  onClose: () => void;
  onToast: (msg: string) => void;
  onZoomImage: (id: string) => void;
}

const RING_R = 88;
const RING_C = 2 * Math.PI * RING_R;

export const PlayerOverlay: React.FC<PlayerOverlayProps> = ({
  session,
  state,
  onUpdateState,
  onCompleteSession,
  onClose,
  onToast,
  onZoomImage,
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [cueIdx, setCueIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseElapsedRef = useRef(0);
  const startedAtRef = useRef(performance.now());
  const spentRef = useRef(0);
  const doneIdsRef = useRef<string[]>([]);
  const lastCueIdxRef = useRef(-1);
  const finishedRef = useRef(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const step = session.list[stepIdx] || session.list[0];
  const ex = EX_MAP[step.id];
  const langIdx = state.lang === 'bn' ? 0 : 1;
  const totalStepSec = step.d * 60;
  const remainingSec = Math.max(0, Math.ceil(totalStepSec - elapsedSec));
  const progressRatio = Math.min(1, elapsedSec / Math.max(1, totalStepSec));

  // Keep screen awake during active playback
  useEffect(() => {
    let active = true;
    const manageWakeLock = async () => {
      try {
        if (running && 'wakeLock' in navigator && !wakeLockRef.current) {
          const lock = await navigator.wakeLock.request('screen');
          if (active) {
            wakeLockRef.current = lock;
          } else {
            await lock.release();
          }
        } else if (!running && wakeLockRef.current) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      } catch {
        wakeLockRef.current = null;
      }
    };
    manageWakeLock();
    return () => {
      active = false;
    };
  }, [running]);

  // Cleanup everything on unmount
  useEffect(() => {
    const supported = ensureAudioEngine(state);
    if (!supported) {
      onToast(tr(state.lang, 'অডিও সমর্থিত নয়', 'Audio not supported'));
    }
    return () => {
      stopBgSound(true);
      stopSpeech();
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync background audio whenever step, running state, bg kind, or Sa tonic changes
  useEffect(() => {
    updateAudioVolume(state);
    if (!running || !ex) {
      stopBgSound(false);
      return;
    }
    ensureAudioEngine(state);
    const kind = state.bg === 'auto' ? ex.a : state.bg;
    startBgSound(kind, state.sa || 130.81);
  }, [running, stepIdx, state.bg, state.sa, ex]);

  // Sync volume sliders without restarting bg oscillators
  useEffect(() => {
    updateAudioVolume(state);
  }, [state.master, state.bgvol, state.mute]);

  // Pause automatically when tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && running) {
        baseElapsedRef.current += (performance.now() - startedAtRef.current) / 1000;
        setRunning(false);
        stopSpeech();
        stopBgSound(false);
        onToast(tr(state.lang, 'অ্যাপ ব্যাকগ্রাউন্ডে গেলে বিরতি দেওয়া হয়', 'Paused while app is in background'));
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [running, state.lang, onToast]);

  // Timer & voice cue progression loop
  useEffect(() => {
    if (!ex || !running) return;
    startedAtRef.current = performance.now();

    const interval = window.setInterval(() => {
      const currentElapsed = baseElapsedRef.current + (performance.now() - startedAtRef.current) / 1000;
      if (currentElapsed >= totalStepSec) {
        spentRef.current += totalStepSec;
        if (!doneIdsRef.current.includes(ex.id)) {
          doneIdsRef.current.push(ex.id);
        }
        if (stepIdx >= session.list.length - 1) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            stopBgSound(true);
            stopSpeech();
            onCompleteSession(spentRef.current, doneIdsRef.current, true);
            onToast(tr(state.lang, 'সম্পন্ন! চমৎকার অনুশীলন।', 'Done! Great practice.'));
            onClose();
          }
          return;
        }
        baseElapsedRef.current = 0;
        startedAtRef.current = performance.now();
        lastCueIdxRef.current = -1;
        stopSpeech();
        setElapsedSec(0);
        setCueIdx(0);
        setStepIdx((prev) => prev + 1);
        return;
      }

      setElapsedSec(currentElapsed);
      const cues = ex.st[langIdx];
      const nextK = Math.min(cues.length - 1, Math.floor((currentElapsed / totalStepSec) * cues.length));
      if (nextK !== lastCueIdxRef.current) {
        lastCueIdxRef.current = nextK;
        setCueIdx(nextK);
        speakCue(cues[nextK], state, {
          overrideLang: ex.lg,
          onStart: () => setSpeaking(true),
          onEnd: () => setSpeaking(false),
        });
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, [running, stepIdx, totalStepSec, ex, langIdx, session.list.length, state, onCompleteSession, onClose, onToast]);

  // Live audio spectrum canvas visualizer
  useEffect(() => {
    let raf = 0;
    const renderWave = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          const color = getComputedStyle(document.documentElement).getPropertyValue('--ac').trim() || '#8b7cf6';
          ctx.fillStyle = color;
          const analyser = getBgAnalyser();
          const live = Boolean(analyser && isBgSoundRunning() && !state.mute && running);
          const data = new Uint8Array(32);
          if (live && analyser) {
            analyser.getByteFrequencyData(data);
          }
          for (let i = 0; i < 32; i++) {
            const v = live ? data[i] / 255 : 0;
            const bh = Math.max(3, v * h);
            ctx.fillRect(i * (w / 32) + 2, (h - bh) / 2, w / 32 - 4, bh);
          }
        }
      }
      raf = requestAnimationFrame(renderWave);
    };
    raf = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(raf);
  }, [running, state.mute]);

  if (!ex) return null;

  const togglePlayPause = () => {
    if (running) {
      baseElapsedRef.current += (performance.now() - startedAtRef.current) / 1000;
      setRunning(false);
      stopSpeech();
      stopBgSound(false);
    } else {
      ensureAudioEngine(state);
      startedAtRef.current = performance.now();
      lastCueIdxRef.current = -1;
      setRunning(true);
    }
  };

  const handleRepeat = () => {
    baseElapsedRef.current = 0;
    startedAtRef.current = performance.now();
    lastCueIdxRef.current = -1;
    setElapsedSec(0);
    setCueIdx(0);
    stopSpeech();
  };

  const handlePrev = () => {
    const curSpent = running
      ? baseElapsedRef.current + (performance.now() - startedAtRef.current) / 1000
      : baseElapsedRef.current;
    spentRef.current += Math.min(curSpent, totalStepSec);
    baseElapsedRef.current = 0;
    startedAtRef.current = performance.now();
    lastCueIdxRef.current = -1;
    stopSpeech();
    setElapsedSec(0);
    setCueIdx(0);
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const handleNext = () => {
    const curSpent = running
      ? baseElapsedRef.current + (performance.now() - startedAtRef.current) / 1000
      : baseElapsedRef.current;
    spentRef.current += Math.min(curSpent, totalStepSec);
    if (stepIdx >= session.list.length - 1) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        stopBgSound(true);
        stopSpeech();
        onCompleteSession(spentRef.current, doneIdsRef.current, true);
        onToast(tr(state.lang, 'সম্পন্ন! চমৎকার অনুশীলন।', 'Done! Great practice.'));
        onClose();
      }
      return;
    }
    baseElapsedRef.current = 0;
    startedAtRef.current = performance.now();
    lastCueIdxRef.current = -1;
    stopSpeech();
    setElapsedSec(0);
    setCueIdx(0);
    setStepIdx((i) => i + 1);
  };

  const handleEndEarly = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const curSpent = running
      ? baseElapsedRef.current + (performance.now() - startedAtRef.current) / 1000
      : baseElapsedRef.current;
    spentRef.current += Math.min(curSpent, totalStepSec);
    stopBgSound(true);
    stopSpeech();
    onCompleteSession(spentRef.current, doneIdsRef.current, false);
    onClose();
  };

  const handleRepeatVoice = () => {
    const cues = ex.st[langIdx];
    const ok = speakCue(cues[Math.max(0, cueIdx)], state, {
      overrideLang: ex.lg,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
    if (!ok) {
      onToast(tr(state.lang, 'ভয়েস নেই — লিখিত নির্দেশনা দেখুন', 'No voice — read the text'));
    }
  };

  const pv = pickVoice(state);
  const cues = ex.st[langIdx];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto px-4 pt-[max(14px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]"
      style={{
        background:
          'radial-gradient(560px 420px at 50% -8%, var(--aur1), transparent 70%), radial-gradient(480px 380px at 100% 100%, var(--aur2), transparent 70%), var(--bg)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={session.name}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setConfirmStop(true)}
            className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{tr(state.lang, 'থামান', 'Stop')}</span>
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg2)] text-[var(--mu)] border border-[var(--bd)] font-mono-num">
            {formatNum(stepIdx + 1, state.lang)} / {formatNum(session.list.length, state.lang)}
          </span>
        </div>

        <div className="flex items-start gap-4 my-4">
          <ExerciseFigure exercise={ex} lang={state.lang} size="md" onZoom={onZoomImage} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--tx)] leading-tight m-0">
              {state.lang === 'bn' ? ex.bn : ex.en}
            </h2>
            <p className="text-sm text-[var(--mu)] mt-1">
              {state.lang === 'bn' ? ex.en : ex.bn} · {LEVEL_LABELS[ex.l][langIdx]}
            </p>
            <p className="text-sm text-[var(--tx)]/85 mt-2">{ex.ob[langIdx]}</p>
          </div>
        </div>

        {/* Countdown Ring */}
        <div className="relative w-52 h-52 mx-auto my-2">
          <div
            className={`absolute inset-4 rounded-full pointer-events-none ${running ? 'animate-breathe-glow' : 'opacity-40'}`}
            style={{
              background: 'radial-gradient(circle, var(--aur1), transparent 72%)',
              filter: 'blur(12px)',
            }}
          />
          <svg viewBox="0 0 200 200" className="relative w-full h-full -rotate-90">
            <defs>
              <linearGradient id="playerRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8b7cf6" />
                <stop offset="1" stopColor="#3de0b5" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r={RING_R} fill="none" stroke="var(--bg2)" strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={RING_R}
              fill="none"
              stroke="url(#playerRingGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progressRatio)}
              className="transition-[stroke-dashoffset] duration-200 linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold font-mono-num tracking-tight text-[var(--tx)]">
            {formatNum(
              `${Math.floor(remainingSec / 60)}:${String(remainingSec % 60).padStart(2, '0')}`,
              state.lang
            )}
          </div>
        </div>

        {/* Step Dots */}
        <div className="flex justify-center gap-2 my-3">
          {cues.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx <= cueIdx
                  ? 'w-6 bg-gradient-to-r from-[var(--ac)] to-[var(--ac2)]'
                  : 'w-2 bg-[var(--bg2)] border border-[var(--bd)]'
              }`}
            />
          ))}
        </div>

        {/* Current Instruction */}
        <div className="studio-card p-5 min-h-[110px] grid place-items-center text-center text-lg sm:text-xl font-medium leading-relaxed text-[var(--tx)]">
          {cues[Math.max(0, cueIdx)]}
        </div>

        {/* Frequency Visualizer */}
        <canvas ref={canvasRef} width={600} height={60} className="w-full h-14 mt-3 rounded-xl" aria-hidden="true" />
        <p className="text-center text-xs text-[var(--mu)] mt-1">
          {running ? tr(state.lang, 'চলছে', 'Running') : tr(state.lang, 'বিরতিতে', 'Paused')} ·{' '}
          {running && (state.bg === 'auto' ? ex.a : state.bg) !== 'off'
            ? tr(state.lang, 'সাউন্ড চালু', 'sound on')
            : tr(state.lang, 'সাউন্ড বন্ধ', 'sound off')}{' '}
          ·{' '}
          {!hasSpeechSynthesis()
            ? tr(state.lang, 'শুধু লিখিত', 'text only')
            : speaking
              ? tr(state.lang, 'ভয়েস বলছে', 'voice speaking')
              : tr(state.lang, 'ভয়েস নীরব', 'voice idle')}
          {pv.note ? ` · ${pv.note}` : ''}
        </p>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={tr(state.lang, 'আগের ধাপ', 'Previous step')}
            className="studio-btn-sec w-13 h-13 rounded-full grid place-items-center cursor-pointer"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleRepeat}
            aria-label={tr(state.lang, 'পুনরায়', 'Repeat step')}
            className="studio-btn-sec w-13 h-13 rounded-full grid place-items-center cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={togglePlayPause}
            className="studio-btn-pri min-w-[144px] h-14 px-6 rounded-full inline-flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{running ? tr(state.lang, 'বিরতি', 'Pause') : tr(state.lang, 'চালু', 'Resume')}</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={tr(state.lang, 'পরবর্তী ধাপ', 'Next step')}
            className="studio-btn-sec w-13 h-13 rounded-full grid place-items-center cursor-pointer"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleRepeatVoice}
          className="studio-btn-sec w-full min-h-[48px] rounded-2xl inline-flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{tr(state.lang, 'পুনরায় শুনুন', 'Repeat voice')}</span>
        </button>

        {/* Audio Mixer */}
        <div className="studio-card p-4 sm:p-5 mt-4 space-y-3">
          <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(state.lang, 'অডিও মিক্সার', 'Audio mixer')}</h3>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[var(--mu)] mb-1">
              <span>{tr(state.lang, 'মাস্টার ভলিউম', 'Master')}</span>
              <span className="font-mono-num">{Math.round(state.master * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.master}
              onChange={(e) => onUpdateState({ master: Number(e.target.value) })}
              className="studio-range"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[var(--mu)] mb-1">
              <span>{tr(state.lang, 'ব্যাকগ্রাউন্ড', 'Background')}</span>
              <span className="font-mono-num">{Math.round(state.bgvol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.bgvol}
              onChange={(e) => onUpdateState({ bgvol: Number(e.target.value) })}
              className="studio-range"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[var(--mu)] mb-1">
              <span>{tr(state.lang, 'ভয়েস', 'Voice')}</span>
              <span className="font-mono-num">{Math.round(state.vvol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.vvol}
              onChange={(e) => onUpdateState({ vvol: Number(e.target.value) })}
              className="studio-range"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              {tr(state.lang, 'ব্যাকগ্রাউন্ড সাউন্ড', 'Background sound')}
            </label>
            <select
              value={state.bg}
              onChange={(e) => onUpdateState({ bg: e.target.value as BgSoundKind })}
              className="w-full min-h-[46px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              <option value="auto">{tr(state.lang, 'স্বয়ংক্রিয়', 'Auto (per exercise)')}</option>
              <option value="ambient">{tr(state.lang, 'অ্যাকোস্টিক অ্যাম্বিয়েন্ট', 'Acoustic ambient')}</option>
              <option value="tanpura">{tr(state.lang, 'রিয়ালিস্টিক তানপুরা', 'Realistic Tanpura')}</option>
              <option value="drone">{tr(state.lang, 'শ্রুতি-বক্স / ড্রোন', 'Shruti-box drone')}</option>
              <option value="nature">{tr(state.lang, 'প্রাকৃতিক ঝরনা ও বাতাস', 'Natural stream & breeze')}</option>
              <option value="breath">{tr(state.lang, 'মৃদু শ্বাস ও বোল', 'Breath & singing bowl')}</option>
              <option value="om">{tr(state.lang, 'ওম নাদ ও অনুরণন', 'OM resonant drone')}</option>
              <option value="off">{tr(state.lang, 'বন্ধ', 'Off')}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onUpdateState({ mute: !state.mute })}
            className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            {state.mute ? <VolumeX className="w-4 h-4 text-[var(--danger)]" /> : <Volume2 className="w-4 h-4" />}
            <span>
              {state.mute ? tr(state.lang, 'মিউট বন্ধ করুন', 'Unmute') : tr(state.lang, 'মিউট', 'Mute')}
            </span>
          </button>

          <p className="text-xs text-[var(--mu)] m-0">
            {tr(
              state.lang,
              'অ্যাকোস্টিক ফিজিক্যাল-মডেলিং (জোয়ারি তানপুরা, রুম রিভার্ব ও পিংক-নয়েজ প্রকৃতি) দ্বারা তৈরি রিয়ালিস্টিক সাউন্ড।',
              'Realistic acoustic sound synthesized via physical modeling (jawari tanpura, room reverb & pink-noise nature).'
            )}
          </p>
        </div>
      </div>

      {/* Confirm stop dialog */}
      {confirmStop && (
        <div
          className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm flex items-center justify-center p-5"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="studio-card p-5 max-w-sm w-full space-y-4">
            <p className="text-base font-bold text-[var(--tx)] m-0">
              {tr(state.lang, 'সেশন থামাবেন?', 'Stop this session?')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmStop(false)}
                className="studio-btn-sec min-h-[44px] px-4 rounded-2xl text-sm font-semibold cursor-pointer"
              >
                {tr(state.lang, 'বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleEndEarly}
                className="studio-btn-pri min-h-[44px] px-5 rounded-2xl text-sm cursor-pointer"
              >
                {tr(state.lang, 'নিশ্চিত', 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
