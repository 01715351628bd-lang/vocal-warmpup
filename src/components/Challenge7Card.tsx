import React, { useState } from 'react';
import { Check, CheckCircle2, Flame, Mic, Play, RotateCcw } from 'lucide-react';
import { CHALLENGE_7_DAYS } from '../data/challenge7';
import { CAT_EMOJI, EX_MAP } from '../data/exercises';
import type { AppState, SessionStep, StudioPrefill } from '../types/studio';
import { formatNum, tr } from '../utils/storage';

interface Challenge7CardProps {
  state: AppState;
  onStartDaySession: (dayNum: number, steps: SessionStep[], title: string) => void;
  onToggleDayDone: (dayNum: number) => void;
  onResetChallenge: () => void;
  onRecordBaseline?: (prefill: StudioPrefill) => void;
  compact?: boolean;
}

export const Challenge7Card: React.FC<Challenge7CardProps> = ({
  state,
  onStartDaySession,
  onToggleDayDone,
  onResetChallenge,
  onRecordBaseline,
  compact = false,
}) => {
  const lang = state.lang;
  const doneDays = state.challenge7?.doneDays || [];
  const nextIncompleteDay =
    CHALLENGE_7_DAYS.find((d) => !doneDays.includes(d.day))?.day || CHALLENGE_7_DAYS[6].day;
  const [selectedDay, setSelectedDay] = useState<number>(nextIncompleteDay);
  const [expanded, setExpanded] = useState<boolean>(!compact);

  const activeDef = CHALLENGE_7_DAYS.find((d) => d.day === selectedDay) || CHALLENGE_7_DAYS[0];
  const totalMins = activeDef.steps.reduce((acc, s) => acc + s[1], 0);
  const doneCount = doneDays.length;
  const progressPct = Math.round((doneCount / 7) * 100);
  const isSelectedDone = doneDays.includes(activeDef.day);

  const launchDay = () => {
    const steps: SessionStep[] = activeDef.steps.map(([id, d]) => ({ id, d }));
    const title = lang === 'bn' ? activeDef.titleBn : activeDef.titleEn;
    onStartDaySession(activeDef.day, steps, title);
  };

  return (
    <section
      className="studio-card p-4 sm:p-5 space-y-4 border-[var(--ac)]/45"
      style={{
        background:
          'radial-gradient(circle at 95% 0%, rgba(255,138,76,0.18), transparent 45%), radial-gradient(circle at 0% 100%, rgba(61,224,181,0.12), transparent 45%), var(--card)',
      }}
    >
      {/* Header + Progress */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-[#ff8a4c]">
            <Flame className="w-3.5 h-3.5" />
            <span>{tr(lang, '৭ দিনের ভয়েস চেঞ্জ চ্যালেঞ্জ', '7-Day Voice Change Warm-up Challenge')}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[var(--tx)] m-0 mt-1">
            {doneCount === 7
              ? tr(lang, '৭ দিনের কণ্ঠ রূপান্তর সম্পন্ন! 🎉', '7-Day Voice Transformation Complete! 🎉')
              : tr(lang, 'ধাপে ধাপে কণ্ঠে গভীরতা, স্পষ্টতা ও শক্তি আনুন', 'Build depth, clarity & projection day by day')}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold font-mono-num bg-[var(--bg2)] border border-[var(--bd)] text-[var(--tx)]">
            {formatNum(doneCount, lang)} / {formatNum(7, lang)} {tr(lang, 'দিন', 'days')} ({formatNum(progressPct, lang)}%)
          </span>
          {compact && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="studio-btn-sec min-h-[34px] px-3 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {expanded ? tr(lang, 'সংক্ষিপ্ত', 'Collapse') : tr(lang, 'সব ৭ দিন', 'View 7 days')}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 rounded-full bg-[var(--bg2)] border border-[var(--bd)] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #ff8a4c, #8b7cf6, #3de0b5)',
          }}
        />
      </div>

      {/* 7-Day Selector Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {CHALLENGE_7_DAYS.map((d) => {
          const isDone = doneDays.includes(d.day);
          const isSelected = d.day === selectedDay;
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => {
                setSelectedDay(d.day);
                if (!expanded) setExpanded(true);
              }}
              className={`min-h-[46px] rounded-2xl border flex flex-col items-center justify-center gap-0.5 text-xs font-bold cursor-pointer transition-all ${
                isSelected
                  ? 'studio-btn-pri border-transparent'
                  : isDone
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-[var(--bg2)] border-[var(--bd)] text-[var(--mu)] hover:text-[var(--tx)]'
              }`}
            >
              <span className="font-mono-num text-[11px]">{tr(lang, `দিন ${formatNum(d.day, lang)}`, `D${d.day}`)}</span>
              {isDone ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Plan Details */}
      {expanded && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg2)]/85 border border-[var(--bd)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-extrabold text-[var(--tx)] m-0">
                {lang === 'bn' ? activeDef.titleBn : activeDef.titleEn}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-0.5">
                {lang === 'bn' ? activeDef.focusBn : activeDef.focusEn}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono-num bg-[var(--card)] border border-[var(--bd)] text-[var(--ac2)]">
              ~{formatNum(totalMins, lang)} {tr(lang, 'মিনিট', 'min')}
            </span>
          </div>

          {/* Exercise Chips */}
          <div className="flex flex-wrap gap-1.5">
            {activeDef.steps.map(([id, mins], idx) => {
              const ex = EX_MAP[id];
              if (!ex) return null;
              return (
                <span
                  key={`${id}-${idx}`}
                  className="px-2.5 py-1 rounded-xl bg-[var(--card)] border border-[var(--bd)] text-xs font-semibold text-[var(--tx)] inline-flex items-center gap-1"
                >
                  <span>{CAT_EMOJI[ex.c] || '🎵'}</span>
                  <span>{lang === 'bn' ? ex.bn : ex.en}</span>
                  <span className="text-[var(--mu)] font-mono-num">({formatNum(mins, lang)}m)</span>
                </span>
              );
            })}
          </div>

          <p className="text-xs text-[var(--ok)] m-0 leading-relaxed">
            💡 {lang === 'bn' ? activeDef.tipBn : activeDef.tipEn}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={launchDay}
              className="studio-btn-pri flex-1 min-h-[46px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {tr(lang, `দিন ${formatNum(activeDef.day, lang)} শুরু করুন`, `Start Day ${activeDef.day} Warm-up`)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onToggleDayDone(activeDef.day)}
              className={`min-h-[46px] px-3.5 rounded-2xl inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer ${
                isSelectedDone
                  ? 'bg-emerald-500/20 border border-emerald-500/45 text-emerald-400'
                  : 'studio-btn-sec'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSelectedDone
                  ? tr(lang, 'সম্পন্ন ✓', 'Completed ✓')
                  : tr(lang, 'সম্পন্ন চিহ্ন দিন', 'Mark Done')}
              </span>
            </button>

            {onRecordBaseline && (
              <button
                type="button"
                onClick={() =>
                  onRecordBaseline({
                    title: `7-Day Voice Challenge — Day ${activeDef.day}`,
                    note: lang === 'bn' ? activeDef.focusBn : activeDef.focusEn,
                    promptText:
                      lang === 'bn'
                        ? '“আজ আমার কণ্ঠ স্পষ্ট, গভীর এবং আত্মবিশ্বাসী — আমি প্রতিটি শব্দ শান্তভাবে ও সুরে উচ্চারণ করছি।”'
                        : '“Today my voice is clear, resonant, and steady — I speak every syllable with calm confidence.”',
                  })
                }
                className="studio-btn-sec min-h-[46px] px-3.5 rounded-2xl inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[var(--ac2)]" />
                <span>{tr(lang, 'ভয়েস চেক রেকর্ড', 'Voice Check')}</span>
              </button>
            )}

            {doneCount > 0 && (
              <button
                type="button"
                onClick={onResetChallenge}
                title={tr(lang, 'চ্যালেঞ্জ রিসেট করুন', 'Reset 7-day challenge')}
                className="studio-btn-sec min-h-[46px] px-3 rounded-2xl inline-flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer text-[var(--mu)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{tr(lang, 'রিসেট', 'Reset')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
