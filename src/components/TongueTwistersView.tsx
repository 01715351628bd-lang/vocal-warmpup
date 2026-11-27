import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Mic, Play, Square, Star } from 'lucide-react';
import { EX_MAP, TW } from '../data/exercises';
import type { AppState, SessionStep, StudioPrefill, TwisterItem } from '../types/studio';
import { hasBengaliVoice, speakCue, stopSpeech } from '../utils/audioEngine';
import { formatNum, tr } from '../utils/storage';

interface TongueTwistersViewProps {
  state: AppState;
  onBack: () => void;
  onToggleTwFav: (id: string) => void;
  onMarkTwDone: (id: string, addMinutes?: number) => void;
  onStartTwSession: (list: SessionStep[], name: string) => void;
  onRecordPrompt: (prefill: StudioPrefill) => void;
  onToast: (msg: string) => void;
}

const GUIDE_STEPS: [number, number][] = [
  [0.55, 9],
  [0.85, 7],
  [1.1, 6],
];

export const TongueTwistersView: React.FC<TongueTwistersViewProps> = ({
  state,
  onBack,
  onToggleTwFav,
  onMarkTwDone,
  onStartTwSession,
  onRecordPrompt,
  onToast,
}) => {
  const lang = state.lang;
  const [langFilter, setLangFilter] = useState<'all' | 'bn' | 'en' | 'conj'>('all');
  const [levelFilter, setLevelFilter] = useState<number>(0);
  const [guideStatus, setGuideStatus] = useState<{ id: string; text: string } | null>(null);

  const guideTimerRef = useRef<number>(0);
  const guideFallbackRef = useRef<number>(0);
  const guideActiveIdRef = useRef<string | null>(null);

  const stopAllTwisterSpeech = () => {
    window.clearTimeout(guideTimerRef.current);
    window.clearTimeout(guideFallbackRef.current);
    guideActiveIdRef.current = null;
    stopSpeech();
    setGuideStatus(null);
  };

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) stopAllTwisterSpeech();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stopAllTwisterSpeech();
    };
  }, []);

  const speakItem = (item: TwisterItem, rate: number, onEnd?: () => void): boolean => {
    return speakCue(item.x, state, {
      overrideLang: item.l,
      rateOverride: rate,
      onEnd,
    });
  };

  const runGuideStep = (item: TwisterItem, stepIndex: number) => {
    if (guideActiveIdRef.current !== item.id) return;
    if (stepIndex >= GUIDE_STEPS.length) {
      guideActiveIdRef.current = null;
      setGuideStatus(null);
      onMarkTwDone(item.id, 0.5);
      onToast(tr(lang, 'চমৎকার! সম্পন্ন।', 'Great! Completed.'));
      return;
    }

    const stepLabels = [tr(lang, 'ধীরে', 'slowly'), tr(lang, 'স্বাভাবিক গতিতে', 'at normal pace'), tr(lang, 'দ্রুত', 'fast')];
    const [rate, waitSec] = GUIDE_STEPS[stepIndex];
    let fired = false;

    const advanceToRepeat = () => {
      if (fired || guideActiveIdRef.current !== item.id) return;
      fired = true;
      window.clearTimeout(guideFallbackRef.current);
      setGuideStatus({
        id: item.id,
        text: `${tr(lang, 'এবার আপনি বলুন ×৩ — ', 'Your turn ×3 — ')}${stepLabels[stepIndex]}`,
      });
      guideTimerRef.current = window.setTimeout(() => {
        if (guideActiveIdRef.current === item.id) {
          runGuideStep(item, stepIndex + 1);
        }
      }, waitSec * 1000);
    };

    setGuideStatus({
      id: item.id,
      text: `${tr(lang, 'শুনুন: ', 'Listen: ')}${stepLabels[stepIndex]} (${formatNum(stepIndex + 1, lang)}/${formatNum(GUIDE_STEPS.length, lang)})`,
    });

    guideFallbackRef.current = window.setTimeout(advanceToRepeat, 15000);
    const spoke = speakItem(item, rate, advanceToRepeat);
    if (!spoke) {
      window.clearTimeout(guideFallbackRef.current);
      guideFallbackRef.current = window.setTimeout(advanceToRepeat, 1200);
    }
  };

  const startGuided = (item: TwisterItem) => {
    stopAllTwisterSpeech();
    guideActiveIdRef.current = item.id;
    runGuideStep(item, 0);
  };

  const launchTwisterSession = (id: 'twb' | 'twc' | 'twe') => {
    const ex = EX_MAP[id];
    if (!ex) return;
    onStartTwSession([{ id, d: ex.d }], lang === 'bn' ? ex.bn : ex.en);
  };

  const totalDone = Object.values(state.tw.done).reduce((a, b) => a + b, 0);
  const daily = TW[Math.floor(Date.now() / 864e5) % TW.length];
  const bnVoiceAvailable = hasBengaliVoice();

  const filteredList = TW.filter(
    (w) =>
      w.id !== daily.id &&
      (langFilter === 'all' || (langFilter === 'conj' ? Boolean(w.g) : w.l === langFilter)) &&
      (!levelFilter || w.v === levelFilter)
  ).sort((a, b) => Number(state.tw.fav.includes(b.id)) - Number(state.tw.fav.includes(a.id)));

  const levelName = (v: number) => [tr(lang, 'সহজ', 'Easy'), tr(lang, 'মাঝারি', 'Medium'), tr(lang, 'কঠিন', 'Hard')][v - 1];

  const renderTwCard = (w: TwisterItem, isDaily = false) => {
    const doneCount = state.tw.done[w.id] || 0;
    const isFav = state.tw.fav.includes(w.id);

    return (
      <article
        key={w.id}
        className={`studio-card p-4 sm:p-5 flex flex-col justify-between gap-3 ${
          isDaily ? 'border-[var(--ac)]/60 shadow-xl' : ''
        }`}
      >
        <div>
          {isDaily && (
            <div className="text-xs font-bold text-[var(--ac)] mb-1.5">
              ⭐ {tr(lang, 'আজকের টাং টুইস্টার', 'Today’s twister')}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
                {w.l === 'bn' ? 'বাংলা' : 'English'}
              </span>
              {w.g && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/35 text-amber-400">
                  ✦ {tr(lang, 'যুক্তাক্ষর', 'Conjunct')}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
                <span className="text-[var(--ac)] tracking-widest mr-1">
                  {'●'.repeat(w.v) + '○'.repeat(3 - w.v)}
                </span>
                {levelName(w.v)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onToggleTwFav(w.id)}
              aria-label="favorite"
              aria-pressed={isFav}
              className="studio-btn-sec min-w-[40px] min-h-[40px] rounded-xl grid place-items-center cursor-pointer"
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-[var(--mu)]'}`} />
            </button>
          </div>

          <p
            lang={w.l}
            className="text-lg sm:text-xl font-bold leading-relaxed text-[var(--tx)] my-3 p-3.5 rounded-2xl bg-[var(--bg2)]/75 border border-[var(--bd)]"
          >
            {w.x}
          </p>

          <p className="text-xs text-[var(--mu)] m-0">
            {tr(lang, 'ফোকাস ধ্বনি', 'Focus sound')}: <b className="text-[var(--tx)]">{w.f}</b>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                stopAllTwisterSpeech();
                speakItem(w, 0.55);
              }}
              className="studio-btn-sec min-h-[40px] px-3 rounded-xl text-xs font-semibold cursor-pointer"
            >
              🐢 {tr(lang, 'ধীর', 'Slow')}
            </button>
            <button
              type="button"
              onClick={() => {
                stopAllTwisterSpeech();
                speakItem(w, 0.85);
              }}
              className="studio-btn-sec min-h-[40px] px-3 rounded-xl text-xs font-semibold cursor-pointer"
            >
              ▶ {tr(lang, 'স্বাভাবিক', 'Normal')}
            </button>
            <button
              type="button"
              onClick={() => {
                stopAllTwisterSpeech();
                speakItem(w, 1.1);
              }}
              className="studio-btn-sec min-h-[40px] px-3 rounded-xl text-xs font-semibold cursor-pointer"
            >
              ⚡ {tr(lang, 'দ্রুত', 'Fast')}
            </button>
            <button
              type="button"
              onClick={stopAllTwisterSpeech}
              aria-label="stop"
              className="studio-btn-sec min-w-[40px] min-h-[40px] rounded-xl grid place-items-center cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => startGuided(w)}
              className="studio-btn-pri min-h-[44px] px-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer"
            >
              🎯 {tr(lang, 'গাইডেড অনুশীলন', 'Guided practice')}
            </button>
            <button
              type="button"
              onClick={() => {
                stopAllTwisterSpeech();
                onMarkTwDone(w.id);
                onToast(tr(lang, 'সংরক্ষিত হয়েছে', 'Saved'));
              }}
              className="studio-btn-sec min-h-[44px] px-3.5 rounded-2xl inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Check className="w-4 h-4 text-[var(--ok)]" />
              <span>
                {tr(lang, 'আমি বলেছি', 'I said it')} ({formatNum(doneCount, lang)})
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                onRecordPrompt({
                  title: `${tr(lang, 'টাং টুইস্টার', 'Twister')}: ${w.f}`,
                  note: w.x,
                  promptText: w.x,
                })
              }
              className="studio-btn-sec min-h-[44px] px-3 rounded-2xl inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-[var(--ac2)]" />
              <span>{tr(lang, 'রেকর্ড', 'Record')}</span>
            </button>
          </div>

          {guideStatus?.id === w.id && (
            <div className="text-xs sm:text-sm font-semibold text-[var(--ac2)]" role="status" aria-live="polite">
              {guideStatus.text}
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            stopAllTwisterSpeech();
            onBack();
          }}
          className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tr(lang, 'পেছনে', 'Back')}</span>
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)] font-mono-num">
          {formatNum(totalDone, lang)} {tr(lang, 'বার সম্পন্ন', 'completed')}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
        {tr(lang, 'টাং টুইস্টার (৩৮টি)', 'Tongue twisters (38)')}
      </h1>

      <section className="studio-card p-4 sm:p-5">
        <h3 className="text-base font-bold text-[var(--tx)] m-0 mb-2">
          {tr(lang, 'কীভাবে অনুশীলন করবেন', 'How to practice')}
        </h3>
        <ul className="list-disc pl-5 m-0 space-y-1 text-xs sm:text-sm text-[var(--mu)]">
          <li>{tr(lang, 'আগে স্পষ্টতা, পরে গতি।', 'Clarity first, speed second.')}</li>
          <li>
            {tr(
              lang,
              'প্রতিটি লাইন ধীর → স্বাভাবিক → দ্রুত, তিনবার করে বলুন।',
              'Say each line slow → normal → fast, three times.'
            )}
          </li>
          <li>
            {tr(
              lang,
              'ঠোঁট, জিভ ও চোয়াল শিথিল রাখুন; গলা চেপে চিৎকার করবেন না।',
              'Keep lips, tongue and jaw relaxed; don’t strain or shout.'
            )}
          </li>
          <li>
            {tr(
              lang,
              'আটকে গেলে থামুন, শ্বাস নিন, আবার ধীরে শুরু করুন।',
              'If you stumble, pause, breathe, restart slowly.'
            )}
          </li>
        </ul>
      </section>

      {!bnVoiceAvailable && (
        <div className="studio-card-warn p-4 text-xs sm:text-sm text-[var(--mu)]">
          {tr(
            lang,
            'এই ডিভাইসে বাংলা TTS ভয়েস পাওয়া যায়নি — বাংলা লাইনের জন্য লিখিত লাইন দেখে নিজে বলুন, অথবা ডিভাইস সেটিংসে বাংলা TTS ইনস্টল করুন।',
            'No Bengali TTS voice found on this device — read Bangla lines aloud yourself or install Bengali TTS in settings.'
          )}
        </div>
      )}

      <section className="studio-card-conj p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-base font-bold text-[var(--tx)] m-0">
            ✦ {tr(lang, 'সেশন হিসেবে অনুশীলন', 'Practice as a session')}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1">
            {tr(
              lang,
              'একসাথে অনেকগুলো লাইন গাইডেড সেশনে বলুন — রুটিনেও ধাপ হিসেবে যোগ করা যায়।',
              'Run many lines as one guided session — also available as routine steps.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => launchTwisterSession('twc')}
            className="studio-btn-pri min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-1.5 text-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{tr(lang, 'যুক্তাক্ষর সেশন', 'Conjunct session')}</span>
          </button>
          <button
            type="button"
            onClick={() => launchTwisterSession('twb')}
            className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{tr(lang, 'বাংলা সেশন', 'Bengali session')}</span>
          </button>
          <button
            type="button"
            onClick={() => launchTwisterSession('twe')}
            className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>English</span>
          </button>
        </div>
      </section>

      {renderTwCard(daily, true)}

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              ['all', tr(lang, 'সব', 'All')],
              ['bn', 'বাংলা'],
              ['en', 'English'],
              ['conj', tr(lang, 'যুক্তাক্ষর ✦', 'Conjuncts ✦')],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                stopAllTwisterSpeech();
                setLangFilter(id);
              }}
              className={`shrink-0 min-h-[40px] px-4 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
                langFilter === id ? 'studio-btn-pri' : 'studio-btn-sec'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[0, 1, 2, 3].map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => {
                stopAllTwisterSpeech();
                setLevelFilter(lv);
              }}
              className={`shrink-0 min-h-[40px] px-4 rounded-full text-xs sm:text-sm font-semibold cursor-pointer ${
                levelFilter === lv ? 'studio-btn-pri' : 'studio-btn-sec'
              }`}
            >
              {lv === 0 ? tr(lang, 'সব স্তর', 'All levels') : levelName(lv)}
            </button>
          ))}
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="studio-card p-6 text-center text-sm text-[var(--mu)]">
          {tr(lang, 'এই ফিল্টারে কিছু নেই।', 'Nothing for this filter.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredList.map((w) => renderTwCard(w, false))}
        </div>
      )}
    </div>
  );
};
