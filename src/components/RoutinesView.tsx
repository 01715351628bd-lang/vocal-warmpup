import React, { useState } from 'react';
import { ArrowUp, Minus, Play, Plus, RotateCcw, X } from 'lucide-react';
import { CAT_EMOJI, EXERCISES, EX_MAP, ROUTINES, catColor } from '../data/exercises';
import type { AppState, SessionStep, StudioPrefill } from '../types/studio';
import { formatNum, tr } from '../utils/storage';
import { Challenge7Card } from './Challenge7Card';

interface RoutinesViewProps {
  state: AppState;
  onUpdateRoutines: (rd: Record<string, [string, number][]>) => void;
  onStartRoutine: (routineId: string) => void;
  onStartChallengeDay: (dayNum: number, steps: SessionStep[], title: string) => void;
  onToggleChallengeDay: (dayNum: number) => void;
  onResetChallenge: () => void;
  onRecordBaseline: (prefill: StudioPrefill) => void;
  onToast: (msg: string) => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  state,
  onUpdateRoutines,
  onStartRoutine,
  onStartChallengeDay,
  onToggleChallengeDay,
  onResetChallenge,
  onRecordBaseline,
  onToast,
}) => {
  const lang = state.lang;
  const L = lang === 'bn' ? 0 : 1;
  const [selectedAdd, setSelectedAdd] = useState<Record<string, string>>({});

  const getSteps = (key: string): [string, number][] =>
    (state.rd[key] || ROUTINES[key].i).map((x) => [x[0], x[1]]);

  const setSteps = (key: string, steps: [string, number][]) => {
    onUpdateRoutines({ ...state.rd, [key]: steps });
  };

  const handleMoveUp = (key: string, idx: number) => {
    if (idx <= 0) return;
    const steps = getSteps(key);
    [steps[idx - 1], steps[idx]] = [steps[idx], steps[idx - 1]];
    setSteps(key, steps);
  };

  const handleAdjustDuration = (key: string, idx: number, delta: number) => {
    const steps = getSteps(key);
    steps[idx][1] = Math.max(1, Math.min(15, steps[idx][1] + delta));
    setSteps(key, steps);
  };

  const handleRemoveStep = (key: string, idx: number) => {
    const steps = getSteps(key);
    if (steps.length <= 1) {
      onToast(tr(lang, 'অন্তত একটি ধাপ থাকতে হবে', 'At least one step is required'));
      return;
    }
    steps.splice(idx, 1);
    setSteps(key, steps);
  };

  const handleAddStep = (key: string) => {
    const exId = selectedAdd[key] || EXERCISES[0].id;
    const ex = EX_MAP[exId];
    if (!ex) return;
    const steps = getSteps(key);
    steps.push([exId, ex.d || 2]);
    setSteps(key, steps);
    onToast(tr(lang, 'ধাপ যোগ হয়েছে', 'Step added'));
  };

  const handleResetDefault = (key: string) => {
    const next = { ...state.rd };
    delete next[key];
    onUpdateRoutines(next);
    onToast(tr(lang, 'ডিফল্টে ফেরা হয়েছে', 'Restored default'));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
          {tr(lang, 'দৈনিক রুটিন', 'Daily routines')}
        </h1>
        <p className="text-sm text-[var(--mu)] mt-1">
          {tr(
            lang,
            'ধাপ যোগ, সরানো বা ক্রম বদলে নিজের রুটিন সাজান — টাং টুইস্টার ও যুক্তাক্ষরও ধাপ হিসেবে দেওয়া যায়।',
            'Add, remove or reorder steps — twisters and conjunct drills can be steps too.'
          )}
        </p>
      </div>

      <Challenge7Card
        state={state}
        onStartDaySession={onStartChallengeDay}
        onToggleDayDone={onToggleChallengeDay}
        onResetChallenge={onResetChallenge}
        onRecordBaseline={onRecordBaseline}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.keys(ROUTINES).map((key) => {
          const rt = ROUTINES[key];
          const steps = getSteps(key);
          const totalMin = steps.reduce((acc, x) => acc + x[1], 0);
          const isCustom = Boolean(state.rd[key]);

          return (
            <section key={key} className="studio-card p-4 sm:p-5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--tx)] m-0">{rt.n[L]}</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)] font-mono-num shrink-0">
                    {formatNum(totalMin, lang)} {tr(lang, 'মিনিট', 'min')}
                  </span>
                </div>

                <div className="divide-y divide-[var(--bd)]">
                  {steps.map(([exId, mins], idx) => {
                    const ex = EX_MAP[exId];
                    if (!ex) return null;
                    const color = catColor(ex.c);
                    return (
                      <div key={`${exId}-${idx}`} className="py-2 flex flex-wrap items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-extrabold text-white shrink-0 font-mono-num"
                          style={{ background: color }}
                        >
                          {formatNum(idx + 1, lang)}
                        </span>
                        <span className="flex-1 min-w-[130px] text-sm font-semibold text-[var(--tx)]">
                          {CAT_EMOJI[ex.c] || ''} {lang === 'bn' ? ex.bn : ex.en}
                        </span>
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveUp(key, idx)}
                            aria-label="move up"
                            className="studio-btn-sec min-w-[36px] min-h-[36px] rounded-xl grid place-items-center cursor-pointer disabled:opacity-40"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustDuration(key, idx, -1)}
                            aria-label="decrease minutes"
                            className="studio-btn-sec min-w-[36px] min-h-[36px] rounded-xl grid place-items-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <b className="min-w-[1.6em] text-center text-sm font-mono-num text-[var(--tx)]">
                            {formatNum(mins, lang)}
                          </b>
                          <button
                            type="button"
                            onClick={() => handleAdjustDuration(key, idx, 1)}
                            aria-label="increase minutes"
                            className="studio-btn-sec min-w-[36px] min-h-[36px] rounded-xl grid place-items-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(key, idx)}
                            aria-label="remove step"
                            className="studio-btn-sec min-w-[36px] min-h-[36px] rounded-xl grid place-items-center text-[var(--danger)] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Step */}
                <div className="flex gap-2 mt-3">
                  <select
                    aria-label={tr(lang, 'ধাপ বেছে নিন', 'Choose a step')}
                    value={selectedAdd[key] || EXERCISES[0].id}
                    onChange={(e) => setSelectedAdd((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="flex-1 min-w-0 min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3 text-xs sm:text-sm text-[var(--tx)]"
                  >
                    {EXERCISES.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {CAT_EMOJI[ex.c] || '•'} {lang === 'bn' ? ex.bn : ex.en}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddStep(key)}
                    className="studio-btn-sec min-h-[44px] px-3.5 rounded-2xl text-xs sm:text-sm font-semibold shrink-0 cursor-pointer"
                  >
                    ＋ {tr(lang, 'যোগ', 'Add')}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onStartRoutine(key)}
                  className="studio-btn-pri flex-1 min-h-[46px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{tr(lang, 'রুটিন শুরু', 'Start routine')}</span>
                </button>
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => handleResetDefault(key)}
                    className="studio-btn-sec min-h-[46px] px-4 rounded-2xl inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{tr(lang, 'ডিফল্ট', 'Default')}</span>
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-xs text-[var(--mu)]">
        {tr(lang, 'প্লেয়ারে বিরতি, পরবর্তী/আগের ও পুনরাবৃত্তি বোতাম আছে।', 'The player has pause, next/previous and repeat controls.')}
      </p>
    </div>
  );
};
