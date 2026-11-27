import React from 'react';
import { ChevronRight, Play, RotateCw, ScrollText, Sparkles } from 'lucide-react';
import { CATS, CAT_EMOJI, QUOTES, ROUTINES, TW } from '../data/exercises';
import type { AppState, SessionStep } from '../types/studio';
import { formatNum, getStreak, todayMin, totalMin, tr } from '../utils/storage';
import { VoiceSafetyCard } from './VoiceSafetyCard';

interface HomeViewProps {
  state: AppState;
  onStartRoutine: (routineId: string) => void;
  onContinueLast: (list: SessionStep[], name: string) => void;
  onSelectCategory: (catId: string) => void;
  onOpenTwisters: () => void;
  onOpenPoetry: () => void;
  onOpenStudio: () => void;
  onOpenAbout: () => void;
}

const DAILY_RING_R = 36;
const DAILY_RING_C = 2 * Math.PI * DAILY_RING_R;

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  onStartRoutine,
  onContinueLast,
  onSelectCategory,
  onOpenTwisters,
  onOpenPoetry,
  onOpenStudio,
  onOpenAbout,
}) => {
  const lang = state.lang;
  const L = lang === 'bn' ? 0 : 1;
  const goal = Number(state.goal) || 10;
  const tm = todayMin(state);
  const pct = Math.min(100, (tm / goal) * 100);
  const quote = QUOTES[new Date().getDate() % QUOTES.length][L];
  const dailyTw = TW[Math.floor(Date.now() / 864e5) % TW.length];

  const hr = new Date().getHours();
  const greeting =
    lang === 'bn'
      ? hr < 5
        ? 'শুভ রাত্রি 🌙'
        : hr < 12
          ? 'শুভ সকাল ☀️'
          : hr < 15
            ? 'শুভ দুপুর 🌤️'
            : hr < 18
              ? 'শুভ বিকেল 🌇'
              : hr < 20
                ? 'শুভ সন্ধ্যা 🌆'
                : 'শুভ রাত্রি 🌙'
      : hr < 5
        ? 'Good night 🌙'
        : hr < 12
          ? 'Good morning ☀️'
          : hr < 17
            ? 'Good afternoon 🌤️'
            : 'Good evening 🌆';

  let showReminder = false;
  if (state.remOn && state.rem && tm === 0) {
    const [rh, rm] = state.rem.split(':').map(Number);
    const now = new Date();
    if (now.getHours() * 60 + now.getMinutes() >= rh * 60 + rm) {
      showReminder = true;
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center gap-3.5">
        <svg width="46" height="46" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
          <defs>
            <linearGradient id="brandLogoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8b7cf6" />
              <stop offset="1" stopColor="#45b0ff" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="13" fill="url(#brandLogoGrad)" />
          <path d="M9 20h3M15 13v14M21 9v22M27 14v12M33 20h-3" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--tx)] m-0">
            Vocal Warm-up Studio
          </h1>
          <p className="text-xs sm:text-sm text-[var(--mu)] m-0">
            {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </header>

      {showReminder && (
        <div className="studio-card-warn p-4 text-sm font-semibold text-[var(--tx)]">
          ⏰ {tr(lang, 'আজকের অনুশীলনের সময় হয়েছে!', 'Time for today’s practice!')}
        </div>
      )}

      {/* Hero + Stats 2-Column on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <section
          className="lg:col-span-7 rounded-[24px] p-5 sm:p-6 text-white overflow-hidden relative flex flex-col justify-between shadow-2xl"
          style={{
            background:
              'radial-gradient(circle at 92% 0%, rgba(255,255,255,0.3), transparent 46%), var(--grad)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-90">{greeting}</div>
              <h2 className="text-2xl font-extrabold m-0 mt-1 leading-snug">
                {tr(lang, 'আজ কণ্ঠ গরম করুন।', 'Warm up your voice today.')}
              </h2>
            </div>
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 84 84" className="w-full h-full -rotate-90">
                <circle cx="42" cy="42" r={DAILY_RING_R} fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="8" />
                <circle
                  cx="42"
                  cy="42"
                  r={DAILY_RING_R}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={DAILY_RING_C}
                  strokeDashoffset={DAILY_RING_C * (1 - pct / 100)}
                  className="transition-[stroke-dashoffset] duration-700"
                />
              </svg>
              <b className="absolute inset-0 grid place-items-center text-base font-extrabold font-mono-num">
                {formatNum(Math.round(pct), lang)}%
              </b>
            </div>
          </div>

          <div className="mt-3 space-y-0.5 text-sm text-white/90">
            <p className="m-0">{quote}</p>
            <p className="m-0 font-semibold font-mono-num">
              {tr(lang, 'আজ', 'Today')}: {formatNum(Math.round(tm * 10) / 10, lang)}/{formatNum(goal, lang)}{' '}
              {tr(lang, 'মিনিট', 'min')}
            </p>
          </div>

          {/* Animated decorative bars inside hero */}
          <div className="flex items-center gap-1 h-7 my-3 opacity-45" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => (
              <span
                key={i}
                className="flex-1 h-full rounded-full bg-white animate-wave-bar"
                style={{ animationDelay: `${-i * 0.1}s` }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onStartRoutine('beg')}
              className="min-h-[48px] px-5 rounded-2xl bg-white text-[#4b3fd0] font-extrabold text-sm inline-flex items-center gap-2 shadow-lg cursor-pointer border-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{tr(lang, 'অনুশীলন শুরু', 'Start practice')}</span>
            </button>
            <button
              type="button"
              disabled={!state.last}
              onClick={() => state.last && onContinueLast(state.last.list, state.last.name)}
              className="min-h-[48px] px-4 rounded-2xl bg-white/18 border border-white/35 text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-45"
            >
              <RotateCw className="w-4 h-4" />
              <span>{tr(lang, 'চালিয়ে যান', 'Continue')}</span>
            </button>
            <button
              type="button"
              onClick={onOpenStudio}
              className="min-h-[48px] px-4 rounded-2xl bg-white/18 border border-white/35 text-white font-semibold text-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎙️ {tr(lang, 'ভয়েস স্টুডিও', 'Studio')}</span>
            </button>
          </div>
        </section>

        {/* 4 Stat Tiles */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {[
            { ic: '⏱', color: '#8b7cf6', val: formatNum(Math.round(totalMin(state)), lang), lbl: tr(lang, 'মোট মিনিট', 'Total minutes') },
            { ic: '🔥', color: '#ff8a4c', val: formatNum(getStreak(state), lang), lbl: tr(lang, 'দিনের ধারা', 'Day streak') },
            { ic: '✅', color: '#3de0b5', val: formatNum(state.sessions, lang), lbl: tr(lang, 'সম্পন্ন সেশন', 'Sessions') },
            { ic: '🎯', color: '#45b0ff', val: formatNum(Math.round(tm * 10) / 10, lang), lbl: tr(lang, 'আজকের মিনিট', 'Today (min)') },
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
              <div className="min-w-0">
                <b className="block text-xl sm:text-2xl font-extrabold font-mono-num text-[var(--tx)] leading-tight">
                  {tile.val}
                </b>
                <small className="block text-xs text-[var(--mu)] leading-snug">{tile.lbl}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Routines Carousel */}
      <section className="space-y-2">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'দ্রুত রুটিন', 'Quick routines')}</h3>
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {Object.keys(ROUTINES).map((key) => {
            const rt = ROUTINES[key];
            const steps = state.rd[key] || rt.i;
            const totalM = steps.reduce((acc, s) => acc + s[1], 0);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onStartRoutine(key)}
                className="studio-card shrink-0 w-44 text-left p-3.5 flex flex-col justify-between gap-2 cursor-pointer hover:border-[var(--ac)]/50 transition-colors"
              >
                <div>
                  <b className="block text-sm font-bold text-[var(--tx)] leading-snug">{rt.n[L]}</b>
                  <span className="block text-xs text-[var(--mu)] mt-1 font-mono-num">
                    {formatNum(totalM, lang)} {tr(lang, 'মিনিট', 'min')} · {formatNum(steps.length, lang)}{' '}
                    {tr(lang, 'ধাপ', 'steps')}
                  </span>
                </div>
                <span className="w-8 h-8 rounded-full studio-btn-pri grid place-items-center text-xs">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Cards: Daily Twister + Sadhana + Poetry Recitation Lab */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <section className="studio-card p-4 sm:p-5 flex flex-col justify-between gap-3 border-[var(--ac)]/45">
          <div>
            <div className="text-xs font-bold text-[var(--ac)] uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tr(lang, 'আজকের টাং টুইস্টার', 'Today’s twister')}</span>
            </div>
            <h3 className="text-base font-bold text-[var(--tx)] m-0 mt-1">
              🗣️ {tr(lang, 'জিভের জড়তা কাটান', 'Loosen your tongue')}
            </h3>
            <p className="text-base font-bold text-[var(--tx)] mt-2.5 leading-relaxed bg-[var(--bg2)]/70 p-3 rounded-xl border border-[var(--bd)]">
              {dailyTw.x}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTwisters}
            className="studio-btn-pri min-h-[44px] px-4 rounded-2xl text-sm cursor-pointer"
          >
            {tr(lang, 'টাং টুইস্টার অনুশীলন', 'Practice tongue twisters')}
          </button>
        </section>

        <section className="studio-card-chant p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--tx)] m-0">
              🪷 {tr(lang, 'কণ্ঠ-সাধনা ও চ্যান্ট', 'Voice sadhana & chants')}
            </h3>
            <p className="text-sm text-[var(--mu)] mt-2">
              {tr(lang, 'ভ্রামরী · ওম · সা-সাধনা · সরগম · অলঙ্কার · মীড়', 'Bhramari · Om · Sa · Sargam · Alankar · Meend')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectCategory('chant')}
              className="studio-btn-pri min-h-[44px] px-4 rounded-2xl text-sm cursor-pointer"
            >
              {tr(lang, 'সাধনা শুরু করুন', 'Open sadhana')}
            </button>
            <button
              type="button"
              onClick={() => onStartRoutine('morning')}
              className="studio-btn-sec min-h-[44px] px-3.5 rounded-2xl text-sm font-semibold cursor-pointer"
            >
              ▶ {tr(lang, 'ভোরের ১০ মিনিট', 'Morning 10 min')}
            </button>
          </div>
        </section>

        <section className="studio-card-conj p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--tx)] m-0 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#ff8a4c]" />
              <span>{tr(lang, 'কবিতা আবৃত্তি ল্যাব', 'Poetry diction lab')}</span>
            </h3>
            <p className="text-sm text-[var(--mu)] mt-2">
              {tr(
                lang,
                '২০টি কঠিন বাংলা শব্দ ভেঙে উচ্চারণ, শুনে অনুশীলন ও সরাসরি রেকর্ডিং।',
                '20 difficult Bengali words with chunked cues, audio playback, and direct recording.'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenPoetry}
            className="studio-btn-pri min-h-[44px] px-4 rounded-2xl text-sm cursor-pointer"
          >
            {tr(lang, 'আবৃত্তি ল্যাব খুলুন', 'Open recitation lab')}
          </button>
        </section>
      </div>

      {/* Quick Categories */}
      <section className="space-y-2">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">
          {tr(lang, 'দ্রুত বিভাগ (৫০টি কৌশল)', 'Quick categories (50 techniques)')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CATS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelectCategory(key)}
              className="studio-btn-sec min-h-[42px] px-3.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:border-[var(--ac)]"
            >
              <span>{CAT_EMOJI[key]}</span>
              <span>{CATS[key][L]}</span>
            </button>
          ))}
        </div>
      </section>

      <VoiceSafetyCard lang={lang} />

      <button
        type="button"
        onClick={onOpenAbout}
        className="w-full min-h-[46px] rounded-2xl border border-dashed border-[var(--bd)] text-[var(--mu)] text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:text-[var(--tx)] cursor-pointer bg-transparent"
      >
        <span>{tr(lang, 'অ্যাপ নির্মাতা: মাসুম বিল্লাহ', 'App creator: Masum Billah')}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
