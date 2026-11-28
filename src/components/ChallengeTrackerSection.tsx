import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Play, RotateCcw, Target, Trophy } from 'lucide-react';
import { CHALLENGE_7_DAYS } from '../data/challenge7';
import type { AppState, SessionStep } from '../types/studio';
import { dk, formatNum, getStreak, tr } from '../utils/storage';

interface ChallengeTrackerSectionProps {
  state: AppState;
  onStartChallengeDay: (dayNum: number, steps: SessionStep[], title: string) => void;
  onToggleChallengeDay: (dayNum: number) => void;
  onResetChallenge: () => void;
}

const MINI_RING_R = 16;
const MINI_RING_C = 2 * Math.PI * MINI_RING_R;

export const ChallengeTrackerSection: React.FC<ChallengeTrackerSectionProps> = ({
  state,
  onStartChallengeDay,
  onToggleChallengeDay,
  onResetChallenge,
}) => {
  const lang = state.lang;
  const loc = lang === 'bn' ? 'bn-BD' : 'en-US';
  const goal = Math.max(1, Number(state.goal) || 10);

  const challenge = state.challenge7;
  const doneDays = challenge?.doneDays || [];
  const timestamps = challenge?.lastDayCompletedAt || {};
  const completedCycles = challenge?.completedCycles || [];

  const nextDay =
    CHALLENGE_7_DAYS.find((d) => !doneDays.includes(d.day))?.day || CHALLENGE_7_DAYS[6].day;
  const [selectedDay, setSelectedDay] = useState<number>(nextDay);

  const activeDef = CHALLENGE_7_DAYS.find((d) => d.day === selectedDay) || CHALLENGE_7_DAYS[0];
  const activeMinutes = activeDef.steps.reduce((sum, [, mins]) => sum + mins, 0);
  const isSelectedDone = doneDays.includes(activeDef.day);

  // Consecutive challenge day streak from Day 1 (e.g., Days 1,2,3 -> 3) or longest contiguous streak
  const challengeSequenceStreak = useMemo(() => {
    let best = 0;
    let cur = 0;
    for (let d = 1; d <= 7; d += 1) {
      if (doneDays.includes(d)) {
        cur += 1;
        if (cur > best) best = cur;
      } else {
        cur = 0;
      }
    }
    return best;
  }, [doneDays]);

  // Rolling 7-day daily voice warm-up goal status
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 6 + i);
      const key = dk(d);
      const mins = Math.round((state.days[key] || 0) * 10) / 10;
      const pct = Math.min(100, Math.round((mins / goal) * 100));
      const metGoal = mins >= goal;
      const partial = mins > 0 && mins < goal;
      return {
        key,
        date: d,
        mins,
        pct,
        metGoal,
        partial,
        isToday: i === 6,
      };
    });
  }, [goal, state.days]);

  const goalsMetThisWeek = last7Days.filter((d) => d.metGoal).length;

  // Consecutive days meeting the daily minute goal
  const goalStreak = useMemo(() => {
    let count = 0;
    const d = new Date();
    if ((state.days[dk(d)] || 0) < goal) {
      d.setDate(d.getDate() - 1);
    }
    while ((state.days[dk(d)] || 0) >= goal) {
      count += 1;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [goal, state.days]);

  const practiceStreak = getStreak(state);

  // History of completed challenge days (current cycle timestamps) + recorded challenge sessions
  const challengeSessionHistory = useMemo(() => {
    const items: {
      id: string;
      title: string;
      ts: number;
      subtitle: string;
      kind: 'cycle' | 'day' | 'session';
    }[] = [];

    completedCycles.forEach((cycle, idx) => {
      const spanDays = cycle.startedAt
        ? Math.max(1, Math.round((cycle.completedAt - cycle.startedAt) / 864e5) + 1)
        : 7;
      items.push({
        id: `cycle-${cycle.id}`,
        title: tr(
          lang,
          `৭ দিনের চ্যালেঞ্জ চক্র #${formatNum(completedCycles.length - idx, lang)} সম্পন্ন`,
          `7-Day Challenge Cycle #${completedCycles.length - idx} Completed`
        ),
        ts: cycle.completedAt,
        subtitle: tr(
          lang,
          `${formatNum(cycle.daysCompleted, lang)}/৭ দিন · ${formatNum(spanDays, lang)} দিনে সম্পূর্ণ`,
          `${cycle.daysCompleted}/7 days · Finished in ${spanDays} day${spanDays === 1 ? '' : 's'}`
        ),
        kind: 'cycle',
      });
    });

    Object.entries(timestamps).forEach(([dayStr, ts]) => {
      const dayNum = Number(dayStr);
      const def = CHALLENGE_7_DAYS.find((item) => item.day === dayNum);
      if (!def || !ts) return;
      items.push({
        id: `day-${dayNum}-${ts}`,
        title: lang === 'bn' ? def.titleBn : def.titleEn,
        ts,
        subtitle: tr(lang, 'চ্যালেঞ্জ দিন সম্পন্ন', 'Challenge day completed'),
        kind: 'day',
      });
    });

    state.hist
      .filter((h) => /7-Day|৭ দিনের|Challenge|চ্যালেঞ্জ/i.test(h.name))
      .forEach((h, idx) => {
        items.push({
          id: `hist-${h.ts}-${idx}`,
          title: h.name,
          ts: h.ts,
          subtitle: tr(
            lang,
            `${formatNum(Math.round((h.sec / 60) * 10) / 10, lang)} মিনিট · ${formatNum(h.ids.length, lang)} ধাপ`,
            `${Math.round((h.sec / 60) * 10) / 10} min · ${h.ids.length} steps`
          ),
          kind: 'session',
        });
      });

    return items.sort((a, b) => b.ts - a.ts);
  }, [completedCycles, lang, state.hist, timestamps]);

  const progressPct = Math.round((doneDays.length / 7) * 100);

  return (
    <section className="studio-card p-4 sm:p-5 space-y-5">
      {/* Header & Streak Summary */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ac2)]">
            <Flame className="w-4 h-4 shrink-0" />
            <span>{tr(lang, '৭ দিনের চ্যালেঞ্জ ও দৈনিক লক্ষ্য ট্র্যাকার', '7-Day Challenge & Goal Tracker')}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--tx)] m-0">
            {doneDays.length === 7
              ? tr(lang, 'সপ্তাহের কণ্ঠ-রূপান্তর চ্যালেঞ্জ সম্পন্ন', '7-Day Voice Challenge Complete')
              : tr(lang, 'দৈনিক ওয়ার্ম-আপ ও চ্যালেঞ্জ অগ্রগতি', 'Daily Warm-up & Challenge Progress')}
          </h2>
          <p className="text-xs text-[var(--mu)] m-0 font-mono-num">
            {formatNum(doneDays.length, lang)}/{formatNum(7, lang)} {tr(lang, 'দিন সম্পন্ন', 'days done')}
            {' · '}
            {formatNum(progressPct, lang)}%
            {' · '}
            {tr(lang, 'মোট সম্পন্ন চক্র', 'Completed cycles')}: {formatNum(completedCycles.length, lang)}
          </p>
        </div>

        {/* Action: Reset / Start New Cycle when all 7 days are done or in progress */}
        {doneDays.length > 0 && (
          <button
            type="button"
            onClick={onResetChallenge}
            className="studio-btn-sec min-h-[44px] px-4 rounded-xl inline-flex items-center gap-2 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {doneDays.length === 7
                ? tr(lang, 'নতুন ৭ দিনের চক্র শুরু', 'Start New 7-Day Cycle')
                : tr(lang, 'রিসেট', 'Reset')}
            </span>
          </button>
        )}
      </div>

      {/* 3 Streak & Completion Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-b border-[var(--bd)] py-3.5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[var(--bg2)] border border-[var(--bd)] grid place-items-center text-[#ff8a4c] shrink-0">
            <Flame className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="text-lg font-extrabold font-mono-num text-[var(--tx)]">
              {formatNum(challengeSequenceStreak, lang)} / {formatNum(7, lang)}
            </div>
            <div className="text-xs text-[var(--mu)]">
              {tr(lang, 'টানা চ্যালেঞ্জ ধারা', 'Challenge day streak')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[var(--bg2)] border border-[var(--bd)] grid place-items-center text-[var(--ok)] shrink-0">
            <Target className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="text-lg font-extrabold font-mono-num text-[var(--tx)]">
              {formatNum(goalStreak, lang)} {tr(lang, 'দিন', 'days')}
              <span className="text-xs font-normal text-[var(--mu)]">
                {' '}
                ({formatNum(goalsMetThisWeek, lang)}/{formatNum(7, lang)} {tr(lang, 'সপ্তাহে', 'wk')})
              </span>
            </div>
            <div className="text-xs text-[var(--mu)]">
              {tr(
                lang,
                `দৈনিক লক্ষ্য (${formatNum(goal, lang)} মি.) ধারা`,
                `Daily goal (${goal}m) streak`
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[var(--bg2)] border border-[var(--bd)] grid place-items-center text-[var(--ac)] shrink-0">
            <Trophy className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="text-lg font-extrabold font-mono-num text-[var(--tx)]">
              {formatNum(completedCycles.length, lang)}
              <span className="text-xs font-normal text-[var(--mu)]">
                {' · '}
                {formatNum(practiceStreak, lang)}d {tr(lang, 'অনুশীলন', 'active')}
              </span>
            </div>
            <div className="text-xs text-[var(--mu)]">
              {tr(lang, 'সম্পন্ন ৭-দিনের চ্যালেঞ্জ', 'Completed 7-day challenges')}
            </div>
          </div>
        </div>
      </div>

      {/* Part A: Last 7 Calendar Days Daily Warm-up Goal Rings */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[var(--tx)] m-0">
            {tr(lang, 'গত ৭ দিনের দৈনিক ওয়ার্ম-আপ লক্ষ্য', 'Last 7 Days Daily Warm-up Goals')}
          </h3>
          <span className="text-xs text-[var(--mu)] font-mono-num">
            {tr(lang, 'দৈনিক লক্ষ্য', 'Target')}: {formatNum(goal, lang)} {tr(lang, 'মিনিট', 'min')}/
            {tr(lang, 'দিন', 'day')}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {last7Days.map((day) => {
            const strokeColor = day.metGoal
              ? 'var(--ok)'
              : day.partial
                ? 'var(--ac2)'
                : 'var(--bd)';
            const statusText = day.metGoal
              ? tr(lang, 'লক্ষ্য পূর্ণ', 'Met')
              : day.partial
                ? tr(lang, 'আংশিক', 'Partial')
                : tr(lang, 'বাকি', 'Rest');
            return (
              <div
                key={day.key}
                className={`p-2 rounded-2xl border flex flex-col items-center gap-1 text-center ${
                  day.isToday
                    ? 'bg-[var(--bg2)] border-[var(--ac)]/50'
                    : 'bg-[var(--bg2)]/55 border-[var(--bd)]'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    day.isToday ? 'text-[var(--tx)] font-bold' : 'text-[var(--mu)]'
                  }`}
                >
                  {day.date.toLocaleDateString(loc, { weekday: 'short' })}
                </span>

                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90" aria-hidden="true">
                    <circle
                      cx="20"
                      cy="20"
                      r={MINI_RING_R}
                      fill="none"
                      stroke="var(--bd)"
                      strokeWidth="3.5"
                    />
                    {day.mins > 0 && (
                      <circle
                        cx="20"
                        cy="20"
                        r={MINI_RING_R}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={MINI_RING_C}
                        strokeDashoffset={MINI_RING_C * (1 - day.pct / 100)}
                      />
                    )}
                  </svg>
                  <span className="absolute inset-0 grid place-items-center text-[10px] font-bold font-mono-num text-[var(--tx)]">
                    {day.metGoal ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--ok)]" />
                    ) : (
                      formatNum(Math.round(day.mins), lang)
                    )}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-medium truncate max-w-full ${
                    day.metGoal
                      ? 'text-[var(--ok)]'
                      : day.partial
                        ? 'text-[var(--ac2)]'
                        : 'text-[var(--mu)]'
                  }`}
                >
                  {statusText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part B: 7-Day Voice Change Challenge Step Status */}
      <div className="space-y-3 pt-2 border-t border-[var(--bd)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[var(--tx)] m-0">
            {tr(lang, '৭ দিনের ভয়েস চেঞ্জ চ্যালেঞ্জ স্ট্যাটাস', '7-Day Voice Challenge Completion')}
          </h3>
          <span className="text-xs text-[var(--mu)] font-mono-num">
            {formatNum(doneDays.length, lang)}/{formatNum(7, lang)} · {formatNum(progressPct, lang)}%
          </span>
        </div>

        {/* Linear progress bar */}
        <div className="h-2 rounded-full bg-[var(--bg2)] border border-[var(--bd)] overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #ff8a4c, #8b7cf6, #3de0b5)',
            }}
          />
        </div>

        {/* 7 Interactive Day Nodes */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {CHALLENGE_7_DAYS.map((d) => {
            const isDone = doneDays.includes(d.day);
            const isSelected = d.day === selectedDay;
            const doneDate = timestamps[d.day];
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                aria-pressed={isSelected}
                className={`min-h-[54px] px-1 py-1.5 rounded-2xl border flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'studio-btn-pri border-transparent'
                    : isDone
                      ? 'bg-emerald-500/12 border-emerald-500/40 text-emerald-500 dark:text-emerald-300'
                      : 'bg-[var(--bg2)] border-[var(--bd)] text-[var(--mu)] hover:text-[var(--tx)]'
                }`}
              >
                <span className="text-[11px] font-bold font-mono-num whitespace-nowrap">
                  {tr(lang, `দিন ${formatNum(d.day, lang)}`, `Day ${d.day}`)}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 opacity-60 shrink-0" />
                )}
                {doneDate && (
                  <span className="text-[9px] font-mono-num opacity-85 truncate max-w-full">
                    {new Date(doneDate).toLocaleDateString(loc, { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Details & Direct Actions */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <div className="text-sm font-bold text-[var(--tx)]">
              {lang === 'bn' ? activeDef.titleBn : activeDef.titleEn}
            </div>
            <div className="text-xs text-[var(--mu)]">
              {lang === 'bn' ? activeDef.focusBn : activeDef.focusEn}
              {' · '}
              <span className="font-mono-num">
                ~{formatNum(activeMinutes, lang)} {tr(lang, 'মিনিট', 'min')}
              </span>
              {timestamps[activeDef.day] && (
                <>
                  {' · '}
                  <span className="font-mono-num text-[var(--ok)]">
                    {tr(lang, 'সম্পন্ন:', 'Done:')}{' '}
                    {new Date(timestamps[activeDef.day]).toLocaleDateString(loc)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const steps: SessionStep[] = activeDef.steps.map(([id, d]) => ({ id, d }));
                const title = lang === 'bn' ? activeDef.titleBn : activeDef.titleEn;
                onStartChallengeDay(activeDef.day, steps, title);
              }}
              className="studio-btn-pri min-h-[44px] px-4 rounded-xl inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{tr(lang, 'অনুশীলন শুরু', 'Start Warm-up')}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleChallengeDay(activeDef.day)}
              className={`min-h-[44px] px-4 rounded-xl inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                isSelectedDone
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 dark:text-emerald-300'
                  : 'studio-btn-sec'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isSelectedDone
                  ? tr(lang, 'সম্পন্ন হয়েছে', 'Completed')
                  : tr(lang, 'সম্পন্ন চিহ্ন দিন', 'Mark Done')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Part C: History of Successfully Completed Challenges */}
      <div className="space-y-2.5 pt-3 border-t border-[var(--bd)]">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[var(--tx)] m-0">
            {tr(lang, 'সম্পন্ন চ্যালেঞ্জের ইতিহাস', 'Completed Challenge History')}
          </h3>
          <span className="text-xs text-[var(--mu)] font-mono-num">
            {formatNum(challengeSessionHistory.length, lang)} {tr(lang, 'টি রেকর্ড', 'entries')}
          </span>
        </div>

        {challengeSessionHistory.length === 0 ? (
          <p className="text-xs sm:text-sm text-[var(--mu)] m-0 py-1">
            {tr(
              lang,
              'এখনও কোনো চ্যালেঞ্জ সম্পন্ন হয়নি — দিন ১ শুরু করে আপনার প্রথম সাফল্য নথিভুক্ত করুন।',
              'No completed challenges yet — finish Day 1 to record your first challenge milestone.'
            )}
          </p>
        ) : (
          <div className="divide-y divide-[var(--bd)]">
            {challengeSessionHistory.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {entry.kind === 'cycle' ? (
                    <Trophy className="w-4 h-4 text-[#ff8a4c] shrink-0" />
                  ) : entry.kind === 'day' ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--ok)] shrink-0" />
                  ) : (
                    <Calendar className="w-4 h-4 text-[var(--ac2)] shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--tx)] truncate">{entry.title}</div>
                    <div className="text-xs text-[var(--mu)] font-mono-num">{entry.subtitle}</div>
                  </div>
                </div>
                <span className="text-xs text-[var(--mu)] font-mono-num whitespace-nowrap shrink-0">
                  {formatNum(new Date(entry.ts).toLocaleDateString(loc), lang)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
