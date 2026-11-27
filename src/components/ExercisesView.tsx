import React, { useState } from 'react';
import { Play, Search, Star } from 'lucide-react';
import { CATS, CAT_EMOJI, EXERCISES, LEVEL_LABELS, catColor } from '../data/exercises';
import type { AppState, SessionStep } from '../types/studio';
import { formatNum, tr } from '../utils/storage';
import { ExerciseFigure } from './ExerciseFigure';

interface ExercisesViewProps {
  state: AppState;
  category: string;
  onCategoryChange: (cat: string) => void;
  onToggleFav: (id: string) => void;
  onStartExercise: (list: SessionStep[], name: string) => void;
  onOpenTwisters: () => void;
  onOpenPoetry: () => void;
  onZoomImage: (id: string) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  state,
  category,
  onCategoryChange,
  onToggleFav,
  onStartExercise,
  onOpenTwisters,
  onOpenPoetry,
  onZoomImage,
}) => {
  const [query, setQuery] = useState('');
  const [durations, setDurations] = useState<Record<string, number>>({});
  const lang = state.lang;
  const L = lang === 'bn' ? 0 : 1;

  const qLower = query.trim().toLowerCase();
  const filtered = EXERCISES.filter((e) => {
    const matchCat = category === 'all' || (category === 'fav' ? state.fav.includes(e.id) : e.c === category);
    const matchQuery =
      !qLower || (e.bn + ' ' + e.en + ' ' + (CATS[e.c] || []).join(' ')).toLowerCase().includes(qLower);
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
          {tr(lang, 'অনুশীলন', 'Exercises')}
        </h1>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] text-[var(--mu)] border border-[var(--bd)] font-mono-num">
          {formatNum(EXERCISES.length, lang)} {tr(lang, 'টি কৌশল', 'techniques')}
        </span>
      </div>

      {/* Promo banners for Tongue Twisters & Poetry Lab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="studio-card p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[var(--tx)] m-0">
              🗣️ {tr(lang, 'টাং টুইস্টার (৩৮টি)', 'Tongue twisters (38)')}
            </h3>
            <p className="text-xs text-[var(--mu)] m-0 mt-0.5">
              {tr(lang, 'আবৃত্তি ও কথায় জড়তা কাটান — বাংলা ও English', 'Fluent recitation and speech — Bangla & English')}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTwisters}
            className="studio-btn-pri min-h-[44px] px-4 rounded-2xl text-xs sm:text-sm shrink-0 cursor-pointer"
          >
            {tr(lang, 'খুলুন', 'Open')}
          </button>
        </div>

        <div className="studio-card-conj p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[var(--tx)] m-0">
              📜 {tr(lang, 'কবিতা আবৃত্তি: কঠিন শব্দ', 'Poetry diction lab')}
            </h3>
            <p className="text-xs text-[var(--mu)] m-0 mt-0.5">
              {tr(lang, '২০টি কঠিন শব্দ ভেঙে ও জুড়ে অনুশীলন', '20 challenging Bengali words & recitation drill')}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPoetry}
            className="studio-btn-pri min-h-[44px] px-4 rounded-2xl text-xs sm:text-sm shrink-0 cursor-pointer"
          >
            {tr(lang, 'খুলুন', 'Open')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--mu)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr(lang, '৫০টি কৌশলের মধ্যে খুঁজুন…', 'Search among 50 techniques…')}
          aria-label="search"
          className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] pl-10 pr-4 text-sm text-[var(--tx)]"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`shrink-0 min-h-[40px] px-4 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
            category === 'all' ? 'studio-btn-pri' : 'studio-btn-sec'
          }`}
        >
          {tr(lang, 'সব', 'All')} ({formatNum(EXERCISES.length, lang)})
        </button>
        <button
          type="button"
          onClick={() => onCategoryChange('fav')}
          className={`shrink-0 min-h-[40px] px-4 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
            category === 'fav' ? 'studio-btn-pri' : 'studio-btn-sec'
          }`}
        >
          ★ {tr(lang, 'প্রিয়', 'Favorites')}
        </button>
        {Object.keys(CATS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onCategoryChange(key)}
            className={`shrink-0 min-h-[40px] px-3.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
              category === key ? 'studio-btn-pri' : 'studio-btn-sec'
            }`}
          >
            <span>{CAT_EMOJI[key]}</span>
            <span>{CATS[key][L]}</span>
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      {filtered.length === 0 ? (
        <div className="studio-card p-6 text-center text-sm text-[var(--mu)]">
          {category === 'fav'
            ? tr(lang, 'এখনও কোনো প্রিয় অনুশীলন নেই। ☆ চাপুন।', 'No favorites yet. Tap ☆.')
            : tr(lang, 'কিছু পাওয়া যায়নি।', 'Nothing found.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((ex, idx) => {
            const isFav = state.fav.includes(ex.id);
            const dur = durations[ex.id] ?? ex.d;
            const color = catColor(ex.c);

            return (
              <article key={ex.id} className="studio-card p-4 sm:p-5 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start gap-3.5">
                    <ExerciseFigure exercise={ex} lang={lang} size="sm" onZoom={onZoomImage} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono-num font-bold text-[var(--mu)]">
                            #{formatNum(idx + 1, lang)}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--tx)] m-0 leading-snug">
                            {lang === 'bn' ? ex.bn : ex.en}
                          </h3>
                          <p className="text-xs text-[var(--mu)] m-0 mt-0.5">
                            {lang === 'bn' ? ex.en : ex.bn}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleFav(ex.id)}
                          aria-label="favorite"
                          aria-pressed={isFav}
                          className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-2xl grid place-items-center shrink-0 cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-[var(--mu)]'}`}
                          />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--tx)]/85 mt-2 mb-0">{ex.ob[L]}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2.5 text-[11px] font-semibold">
                        <span
                          className="px-2.5 py-0.5 rounded-full border"
                          style={{
                            color,
                            background: `color-mix(in srgb, ${color} 14%, transparent)`,
                            borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
                          }}
                        >
                          {CAT_EMOJI[ex.c]} {CATS[ex.c]?.[L]}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
                          {LEVEL_LABELS[ex.l][L]}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)] font-mono-num">
                          {formatNum(dur, lang)} {tr(lang, 'মিনিট', 'min')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <ol className="list-none p-0 m-0 mt-3.5 space-y-2">
                    {ex.st[L].map((stepText, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--mu)]">
                        <span
                          className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-extrabold text-white shrink-0 mt-0.5 font-mono-num"
                          style={{ background: color }}
                        >
                          {formatNum(sIdx + 1, lang)}
                        </span>
                        <span className="leading-relaxed">{stepText}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Duration + Start */}
                <div className="flex items-center gap-2.5 pt-1">
                  <select
                    aria-label={tr(lang, 'সময়কাল', 'Duration')}
                    value={dur}
                    onChange={(e) => setDurations((prev) => ({ ...prev, [ex.id]: Number(e.target.value) }))}
                    className="min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3 text-sm text-[var(--tx)]"
                  >
                    {[1, 2, 3, 5, 10].map((m) => (
                      <option key={m} value={m}>
                        {formatNum(m, lang)} {tr(lang, 'মিনিট', 'min')}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => onStartExercise([{ id: ex.id, d: dur }], lang === 'bn' ? ex.bn : ex.en)}
                    className="studio-btn-pri flex-1 min-h-[46px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{tr(lang, 'শুরু', 'Start')}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
