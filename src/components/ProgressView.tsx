import React from 'react';
import type { AppState } from '../types/studio';
import { dk, formatNum, getStreak, todayMin, totalMin, tr } from '../utils/storage';

export const ProgressView: React.FC<{ state: AppState }> = ({ state }) => {
  const lang = state.lang;
  const loc = lang === 'bn' ? 'bn-BD' : 'en-US';
  const tm = todayMin(state);
  const tot = totalMin(state);
  const st = getStreak(state);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return { date: d, min: state.days[dk(d)] || 0, isToday: i === 6 };
  });
  const maxWeek = Math.max(5, ...weekDays.map((d) => d.min));

  const heatmap = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 27 + i);
    const key = dk(d);
    const m = state.days[key] || 0;
    const level = m >= 10 ? 3 : m >= 5 ? 2 : m > 0 ? 1 : 0;
    return { key, m, level };
  });

  const achievements: [boolean, string, string][] = [
    [state.sessions >= 1, '🎤', tr(lang, 'প্রথম সেশন', 'First session')],
    [st >= 3, '🔥', tr(lang, '৩ দিনের ধারা', '3-day streak')],
    [st >= 7, '⚡', tr(lang, '৭ দিনের ধারা', '7-day streak')],
    [tot >= 60, '⏳', tr(lang, '১ ঘণ্টা অনুশীলন', '1 hour practiced')],
    [state.sessions >= 10, '🏅', tr(lang, '১০ সেশন', '10 sessions')],
    [tot >= 300, '🏆', tr(lang, '৫ ঘণ্টা অনুশীলন', '5 hours practiced')],
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
        {tr(lang, 'অগ্রগতি', 'Progress')}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { ic: '🎯', color: '#45b0ff', val: formatNum(Math.round(tm * 10) / 10, lang), lbl: tr(lang, 'আজ (মিনিট)', 'Today (min)') },
          { ic: '⏱', color: '#8b7cf6', val: formatNum(Math.round(tot), lang), lbl: tr(lang, 'মোট মিনিট', 'Total min') },
          { ic: '✅', color: '#3de0b5', val: formatNum(state.sessions, lang), lbl: tr(lang, 'সেশন', 'Sessions') },
          { ic: '🔥', color: '#ff8a4c', val: formatNum(st, lang), lbl: tr(lang, 'ধারা', 'Streak') },
        ].map((tile, idx) => (
          <div key={idx} className="studio-card p-4 flex items-center gap-3">
            <span
              className="w-11 h-11 rounded-2xl grid place-items-center text-xl shrink-0"
              style={{
                background: `color-mix(in srgb, ${tile.color} 20%, transparent)`,
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tile.color} 35%, transparent)`,
              }}
            >
              {tile.ic}
            </span>
            <div>
              <b className="block text-xl font-extrabold font-mono-num text-[var(--tx)]">{tile.val}</b>
              <small className="block text-xs text-[var(--mu)]">{tile.lbl}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 7-day bar chart */}
        <section className="studio-card p-5 space-y-3">
          <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'সাপ্তাহিক', 'This week')}</h3>
          <div className="flex items-end gap-2 h-36 pt-2">
            {weekDays.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                <span className="text-[11px] font-bold font-mono-num text-[var(--tx)] min-h-[1em]">
                  {d.min > 0 ? formatNum(Math.round(d.min), lang) : ''}
                </span>
                <div
                  className={`w-full max-w-[34px] rounded-t-lg rounded-b transition-all ${
                    d.isToday ? 'opacity-100 shadow-lg' : 'opacity-75'
                  }`}
                  style={{
                    height: `${Math.max(6, (d.min / maxWeek) * 86)}px`,
                    background: 'linear-gradient(180deg, var(--ac2), var(--ac))',
                  }}
                />
                <small className={`text-[11px] ${d.isToday ? 'font-extrabold text-[var(--tx)]' : 'text-[var(--mu)]'}`}>
                  {d.date.toLocaleDateString(loc, { weekday: 'short' })}
                </small>
              </div>
            ))}
          </div>
        </section>

        {/* 28-day heatmap */}
        <section className="studio-card p-5 space-y-3">
          <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'গত ২৮ দিন', 'Last 28 days')}</h3>
          <div className="grid grid-cols-14 gap-1.5 pt-1" role="img" aria-label={tr(lang, '২৮ দিনের অনুশীলন', '28-day activity')}>
            {heatmap.map((cell) => (
              <span
                key={cell.key}
                title={`${cell.key} · ${Math.round(cell.m * 10) / 10} min`}
                className="aspect-square rounded-md border border-[var(--bd)]"
                style={{
                  background:
                    cell.level === 3
                      ? 'var(--ac)'
                      : cell.level === 2
                        ? 'color-mix(in srgb, var(--ac) 62%, var(--bg2))'
                        : cell.level === 1
                          ? 'color-mix(in srgb, var(--ac) 32%, var(--bg2))'
                          : 'var(--bg2)',
                }}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Achievements */}
      <section className="studio-card p-5 space-y-3">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'অর্জন', 'Achievements')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {achievements.map(([unlocked, icon, title], idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)] text-xs sm:text-sm font-semibold ${
                unlocked ? 'text-[var(--tx)]' : 'opacity-45 grayscale text-[var(--mu)]'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent sessions */}
      <section className="studio-card p-5 space-y-2">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'সাম্প্রতিক', 'Recent')}</h3>
        {state.hist.length === 0 ? (
          <p className="text-sm text-[var(--mu)] m-0">
            {tr(lang, 'এখনও কিছু নেই — প্রথম অনুশীলন শুরু করুন!', 'Nothing yet — start your first practice!')}
          </p>
        ) : (
          <div className="divide-y divide-[var(--bd)]">
            {state.hist.slice(0, 8).map((item, idx) => (
              <div key={idx} className="py-2 text-xs sm:text-sm text-[var(--mu)] flex items-center justify-between gap-2">
                <span className="font-semibold text-[var(--tx)]">{item.name}</span>
                <span className="font-mono-num shrink-0">
                  {formatNum(new Date(item.ts).toLocaleDateString(loc), lang)} ·{' '}
                  {formatNum(Math.round((item.sec / 60) * 10) / 10, lang)} {tr(lang, 'মিনিট', 'min')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
