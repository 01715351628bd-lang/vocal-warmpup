import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mic,
  Play,
  Puzzle,
  Search,
  Volume2,
} from 'lucide-react';
import { ABRITTI_GROUPS, ABRITTI_MODULES, type AbrittiGroup } from '../data/abrittiGuide';
import { POETRY_SAMPLE_LINE, POETRY_WORDS } from '../data/exercises';
import type { AppState, StudioPrefill } from '../types/studio';
import { speakCue } from '../utils/audioEngine';
import { formatNum, tr } from '../utils/storage';

interface PoetryLabViewProps {
  state: AppState;
  onBack: () => void;
  onRecordPrompt: (prefill: StudioPrefill) => void;
}

type LabTab = 'guide' | 'words';
const READ_STORAGE_KEY = 'vws_abritti_read_v1';

function loadReadIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export const PoetryLabView: React.FC<PoetryLabViewProps> = ({ state, onBack, onRecordPrompt }) => {
  const lang = state.lang;
  const L = lang === 'bn' ? 0 : 1;

  const [tab, setTab] = useState<LabTab>('guide');
  const [groupFilter, setGroupFilter] = useState<'all' | AbrittiGroup>('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(ABRITTI_MODULES[0].id);
  const [readIds, setReadIds] = useState<string[]>(() => loadReadIds());
  const readerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(readIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [readIds]);

  const speakWord = (text: string, rate = 0.78) => {
    speakCue(text, state, { overrideLang: 'bn', rateOverride: rate });
  };

  const toggleRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ABRITTI_MODULES.filter((m) => {
      const matchGroup = groupFilter === 'all' || m.group === groupFilter;
      if (!matchGroup) return false;
      if (!q) return true;
      const haystack = [
        m.titleBn,
        m.titleEn,
        m.subtitleBn,
        m.subtitleEn,
        m.summaryBn,
        m.summaryEn,
        ...m.points.map((p) => `${p.titleBn} ${p.detailBn} ${p.titleEn} ${p.detailEn}`),
        ...(m.samples?.map((s) => `${s.word} ${s.spoken} ${s.noteBn}`) ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [groupFilter, query]);

  const activeModule = useMemo(
    () =>
      filteredModules.find((m) => m.id === activeId) ||
      ABRITTI_MODULES.find((m) => m.id === activeId) ||
      ABRITTI_MODULES[0],
    [filteredModules, activeId]
  );

  const activeIndex = ABRITTI_MODULES.findIndex((m) => m.id === activeModule.id);
  const prevModule = activeIndex > 0 ? ABRITTI_MODULES[activeIndex - 1] : null;
  const nextModule = activeIndex < ABRITTI_MODULES.length - 1 ? ABRITTI_MODULES[activeIndex + 1] : null;

  const selectChapter = (id: string, shouldScroll = false) => {
    setActiveId(id);
    if (shouldScroll) {
      window.setTimeout(() => {
        readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    }
  };

  const readPct = Math.round((readIds.length / ABRITTI_MODULES.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tr(lang, 'ফিরে যান', 'Back')}</span>
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)] font-mono-num">
          {formatNum(ABRITTI_MODULES.length, lang)} {tr(lang, 'অধ্যায়', 'chapters')} ·{' '}
          {formatNum(POETRY_WORDS.length, lang)} {tr(lang, 'কঠিন শব্দ', 'hard words')}
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
          📜 {tr(lang, 'আবৃত্তি ল্যাব ও পাঠশালা', 'Abritti Lab & Poetry Diction')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1">
          {tr(
            lang,
            `আবৃত্তির তত্ত্ব, ইতিহাস, প্রমিত উচ্চারণ, বাগযন্ত্র ও কণ্ঠনালীর ব্যায়াম, মঞ্চকৌশল এবং ${formatNum(POETRY_WORDS.length, lang)}টি কঠিন শব্দের অনুশীলন।`,
            `Recitation theory, history, standard Bengali pronunciation, articulatory drills, stagecraft & ${POETRY_WORDS.length} poetry word breakdowns.`
          )}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)]">
        <button
          type="button"
          onClick={() => setTab('guide')}
          className={`min-h-[46px] px-3 rounded-xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'guide'
              ? 'studio-btn-pri shadow-md'
              : 'bg-transparent text-[var(--mu)] hover:text-[var(--tx)]'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>{tr(lang, 'আবৃত্তি পাঠশালা (১৪)', 'Recitation Guide (14)')}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('words')}
          className={`min-h-[46px] px-3 rounded-xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tab === 'words'
              ? 'studio-btn-pri shadow-md'
              : 'bg-transparent text-[var(--mu)] hover:text-[var(--tx)]'
          }`}
        >
          <Puzzle className="w-4 h-4 shrink-0" />
          <span>
            {tr(lang, `কঠিন শব্দ ও নমুনা (${formatNum(POETRY_WORDS.length, lang)})`, `Hard Words Drill (${POETRY_WORDS.length})`)}
          </span>
        </button>
      </div>

      {tab === 'guide' ? (
        <div className="space-y-4">
          {/* Study Progress + Search + Group Filter */}
          <section className="studio-card p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[var(--tx)] m-0">
                  🎓 {tr(lang, 'সম্পূর্ণ আবৃত্তি পাঠ্যক্রম', 'Complete Recitation Curriculum')}
                </h2>
                <p className="text-xs text-[var(--mu)] m-0 mt-0.5">
                  {tr(
                    lang,
                    'যেকোনো অধ্যায়ে ট্যাপ করে বিস্তারিত পড়ুন, শুদ্ধ উচ্চারণ শুনুন ও স্টুডিওতে চর্চা করুন।',
                    'Tap any chapter to study its rules, listen to standard pronunciation, and practise in Studio.'
                  )}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold font-mono-num bg-[var(--bg2)] border border-[var(--bd)] text-[var(--ac)]">
                {formatNum(readIds.length, lang)} / {formatNum(ABRITTI_MODULES.length, lang)}{' '}
                {tr(lang, 'সম্পন্ন', 'read')}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[var(--bg2)] overflow-hidden border border-[var(--bd)]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${readPct}%`,
                  background: 'var(--grad)',
                }}
              />
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[var(--mu)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr(
                  lang,
                  'অধ্যায় বা শব্দ খুঁজুন (যেমন: উচ্চারণ, ছন্দ, মাইক্রোফোন, বাগযন্ত্র)...',
                  'Search chapters or rules (e.g. pronunciation, meter, microphone)...'
                )}
                className="w-full min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] pl-10 pr-4 text-sm text-[var(--tx)]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(ABRITTI_GROUPS) as ('all' | AbrittiGroup)[]).map((key) => {
                const active = groupFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setGroupFilter(key)}
                    className={`min-h-[38px] px-3 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      active
                        ? 'studio-btn-pri'
                        : 'studio-btn-sec text-[var(--mu)] hover:text-[var(--tx)]'
                    }`}
                  >
                    {ABRITTI_GROUPS[key][L]}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 14-Chapter Index Grid */}
          {filteredModules.length === 0 ? (
            <div className="studio-card p-6 text-center text-sm text-[var(--mu)]">
              {tr(lang, 'কোনো অধ্যায় পাওয়া যায়নি।', 'No chapters matched your search.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredModules.map((mod) => {
                const isSelected = mod.id === activeModule.id;
                const isDone = readIds.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => selectChapter(mod.id, true)}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'studio-card-conj ring-2 ring-[var(--ac)]/60'
                        : 'studio-card hover:border-[var(--ac)]/50'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-[var(--bg2)] border border-[var(--bd)] grid place-items-center text-xl shrink-0">
                      {mod.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[11px] font-mono-num font-bold text-[var(--ac)]">
                          {tr(lang, 'অধ্যায়', 'Ch.')} {formatNum(String(mod.num).padStart(2, '0'), lang)}
                        </span>
                        {isDone && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--ok)] shrink-0" aria-label="Completed" />
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[var(--tx)] m-0 mt-0.5 leading-snug">
                        {lang === 'bn' ? mod.titleBn : mod.titleEn}
                      </h3>
                      <p className="text-[11px] text-[var(--mu)] m-0 mt-0.5 line-clamp-2 leading-snug">
                        {lang === 'bn' ? mod.subtitleBn : mod.subtitleEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Focused Chapter Reader */}
          <article ref={readerRef} className="studio-card p-4 sm:p-6 space-y-4 scroll-mt-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--bd)] pb-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="w-12 h-12 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)] grid place-items-center text-2xl shrink-0">
                  {activeModule.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono-num font-extrabold text-[var(--ac)]">
                      {tr(lang, 'অধ্যায়', 'Chapter')} {formatNum(String(activeModule.num).padStart(2, '0'), lang)} /{' '}
                      {formatNum(ABRITTI_MODULES.length, lang)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
                      {ABRITTI_GROUPS[activeModule.group][L]}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--tx)] m-0 mt-1 leading-tight">
                    {lang === 'bn' ? activeModule.titleBn : activeModule.titleEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1">
                    {lang === 'bn' ? activeModule.subtitleBn : activeModule.subtitleEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleRead(activeModule.id)}
                className={`min-h-[44px] px-3.5 rounded-2xl inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer shrink-0 ${
                  readIds.includes(activeModule.id)
                    ? 'bg-[var(--ok)]/18 text-[var(--ok)] border border-[var(--ok)]/40'
                    : 'studio-btn-sec'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {readIds.includes(activeModule.id)
                    ? tr(lang, 'পড়া হয়েছে', 'Studied')
                    : tr(lang, 'পড়া চিহ্নিত করুন', 'Mark as read')}
                </span>
              </button>
            </div>

            {/* Summary & Deep-Dive Explanation */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg2)]/70 border border-[var(--bd)] space-y-2.5">
              <p className="text-sm sm:text-base font-medium text-[var(--tx)] m-0 leading-relaxed">
                {lang === 'bn' ? activeModule.summaryBn : activeModule.summaryEn}
              </p>
              <div className="pt-2.5 border-t border-[var(--bd)]/70">
                <div className="text-xs font-extrabold text-[var(--ac)] mb-1">
                  📖 {tr(lang, 'সহজ ও বিস্তারিত ব্যাখ্যা', 'Detailed Explanation')}
                </div>
                <p className="text-xs sm:text-sm text-[var(--mu)] m-0 leading-relaxed">
                  {lang === 'bn' ? activeModule.deepDiveBn : activeModule.deepDiveEn}
                </p>
              </div>
            </div>

            {/* Listen / Studio Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  speakWord(
                    `${activeModule.titleBn}। ${activeModule.summaryBn} ${activeModule.deepDiveBn} ${activeModule.points
                      .map((p) => `${p.titleBn}: ${p.detailBn}`)
                      .join(' ')}`,
                    0.82
                  )
                }
                className="studio-btn-pri min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{tr(lang, 'সম্পূর্ণ অধ্যায় শুনুন', 'Listen to full chapter')}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onRecordPrompt({
                    title: `${activeModule.titleBn} — ${tr(lang, 'চর্চা', 'Practice')}`,
                    note: activeModule.subtitleBn,
                    promptText: lang === 'bn' ? activeModule.practiceBn : activeModule.practiceEn,
                  })
                }
                className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[var(--ac2)]" />
                <span>{tr(lang, 'স্টুডিওতে চর্চা ও রেকর্ড', 'Practice in Studio')}</span>
              </button>
            </div>

            {/* Key Points Grid */}
            <div className="space-y-2.5">
              <h3 className="text-sm sm:text-base font-bold text-[var(--tx)] m-0">
                📌 {tr(lang, 'মূল নিয়ম ও বিস্তারিত আলোচনা', 'Key Concepts & Detailed Steps')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeModule.points.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg2)]/55 border border-[var(--bd)] flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--ac)]/20 text-[var(--ac)] text-xs font-extrabold font-mono-num grid place-items-center shrink-0">
                        {formatNum(i + 1, lang)}
                      </span>
                      <h4 className="text-sm font-bold text-[var(--tx)] m-0 leading-snug">
                        {lang === 'bn' ? pt.titleBn : pt.titleEn}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--mu)] m-0 leading-relaxed">
                      {lang === 'bn' ? pt.detailBn : pt.detailEn}
                    </p>
                    {(pt.exampleBn || pt.exampleEn) && (
                      <div className="mt-0.5 p-2.5 rounded-xl bg-[var(--card)]/70 border border-[var(--bd)] text-xs text-[var(--tx)]/90 leading-relaxed">
                        <span className="font-bold text-[var(--ac2)]">
                          {tr(lang, 'উদাহরণ: ', 'Example: ')}
                        </span>
                        {lang === 'bn' ? pt.exampleBn : pt.exampleEn}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pronunciation / Phonetic Samples when available */}
            {activeModule.samples && activeModule.samples.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm sm:text-base font-bold text-[var(--tx)] m-0">
                  🔊 {tr(lang, 'উদাহরণ, ছন্দ ও প্রমিত উচ্চারণ তালিকা', 'Examples & Pronunciation Guide')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.samples.map((sample, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-2xl bg-[var(--bg2)]/80 border border-[var(--bd)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-base font-extrabold text-[var(--tx)]">
                          {sample.word}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[var(--ac2)] mt-0.5">
                          {tr(lang, 'উচ্চারণ / ভঙ্গি:', 'Delivery:')} {sample.spoken}
                        </div>
                        <div className="text-xs text-[var(--mu)] mt-0.5 leading-relaxed">
                          {lang === 'bn' ? sample.noteBn : sample.noteEn}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakWord(sample.word, 0.7)}
                        aria-label={`${tr(lang, 'শুনুন', 'Listen')}: ${sample.word}`}
                        className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-xl grid place-items-center shrink-0 cursor-pointer hover:border-[var(--ac)]"
                      >
                        <Volume2 className="w-4 h-4 text-[var(--ac)]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes & Fixes */}
            {activeModule.mistakes.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm sm:text-base font-bold text-[var(--tx)] m-0">
                  ⚠️ {tr(lang, 'সাধারণ ভুল ও শুদ্ধ সমাধান', 'Common Mistakes & How to Fix')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activeModule.mistakes.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-2xl bg-[var(--bg2)]/65 border border-[var(--bd)] space-y-2"
                    >
                      <div className="text-xs sm:text-sm text-[var(--danger)] font-semibold leading-relaxed">
                        ✕ {tr(lang, 'যা এড়িয়ে চলবেন: ', 'Avoid: ')}
                        <span className="font-normal text-[var(--tx)]/85">
                          {lang === 'bn' ? m.wrongBn : m.wrongEn}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--ok)] font-semibold leading-relaxed">
                        ✓ {tr(lang, 'সঠিক পদ্ধতি: ', 'Fix: ')}
                        <span className="font-normal text-[var(--tx)]">
                          {lang === 'bn' ? m.fixBn : m.fixEn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Practice Drill + Steps */}
            <div className="studio-card-conj p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#ff8a4c]">
                  🎙️ {tr(lang, 'ধাপে ধাপে হাতে-কলমে অনুশীলন', 'Step-by-Step Hands-on Practice')}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    speakWord(
                      `${activeModule.practiceBn}। ${(activeModule.practiceStepsBn || []).join(' ')}`,
                      0.8
                    )
                  }
                  className="studio-btn-sec min-h-[36px] px-3 rounded-xl inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[var(--ac)]" />
                  <span>{tr(lang, 'নির্দেশনা শুনুন', 'Hear steps')}</span>
                </button>
              </div>
              <p className="text-sm sm:text-base font-semibold text-[var(--tx)] m-0 leading-relaxed">
                {lang === 'bn' ? activeModule.practiceBn : activeModule.practiceEn}
              </p>
              <ol className="list-none p-0 m-0 space-y-1.5">
                {(lang === 'bn' ? activeModule.practiceStepsBn : activeModule.practiceStepsEn).map(
                  (stepText, stIdx) => (
                    <li key={stIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--tx)]/90">
                      <span className="w-5 h-5 rounded-full bg-[#ff8a4c]/20 text-[#ff8a4c] text-[11px] font-extrabold font-mono-num grid place-items-center shrink-0 mt-0.5">
                        {formatNum(stIdx + 1, lang)}
                      </span>
                      <span className="leading-relaxed">{stepText}</span>
                    </li>
                  )
                )}
              </ol>
            </div>

            {/* Prev / Next Chapter Footer */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--bd)]">
              <button
                type="button"
                disabled={!prevModule}
                onClick={() => prevModule && selectChapter(prevModule.id, true)}
                className="studio-btn-sec min-h-[44px] px-3.5 rounded-2xl inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[220px]">
                  {prevModule
                    ? lang === 'bn'
                      ? prevModule.titleBn
                      : prevModule.titleEn
                    : tr(lang, 'শুরু', 'Start')}
                </span>
              </button>
              <button
                type="button"
                disabled={!nextModule}
                onClick={() => nextModule && selectChapter(nextModule.id, true)}
                className="studio-btn-pri min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <span className="truncate max-w-[140px] sm:max-w-[220px]">
                  {nextModule
                    ? lang === 'bn'
                      ? nextModule.titleBn
                      : nextModule.titleEn
                    : tr(lang, 'সমাপ্ত', 'Finished')}
                </span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </article>
        </div>
      ) : (
        <div className="space-y-4">
          <section className="studio-card p-4 sm:p-5 space-y-3">
            <h3 className="text-base font-bold text-[var(--tx)] m-0">
              {tr(lang, 'যেভাবে কঠিন শব্দ অনুশীলন করবেন', 'How to practise difficult words')}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--mu)] m-0 leading-relaxed">
              {tr(
                lang,
                'প্রথমে শব্দের অংশগুলো আলাদা করে বলুন। তারপর ধীরে জুড়ে বলুন, শেষে কবিতার লাইনের মধ্যে স্বাভাবিক ছন্দে ব্যবহার করুন। হাইফেন কেবল শেখার সুবিধার জন্য; এটি অভিধানভিত্তিক আনুষ্ঠানিক শব্দবিভাজনের দাবি নয়।',
                'Say each chunk separately, join them slowly, then use the word naturally in a poetic line. Hyphens are practice aids, not formal dictionary syllabification.'
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => speakWord(POETRY_WORDS.map((w) => w.w).join('। '), 0.72)}
                className="studio-btn-pri min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{tr(lang, 'সব শব্দ শুনুন', 'Listen to all')}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onRecordPrompt({
                    title: tr(lang, 'কবিতা আবৃত্তি নমুনা', 'Poetry sample recitation'),
                    note: tr(lang, 'নমুনা লাইন ও কঠিন শব্দ অনুশীলন', 'Sample line and difficult words practice'),
                    promptText: POETRY_SAMPLE_LINE,
                  })
                }
                className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[var(--ac2)]" />
                <span>{tr(lang, 'নমুনা আবৃত্তি রেকর্ড করুন', 'Record recitation')}</span>
              </button>
            </div>
          </section>

          {/* 20 Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POETRY_WORDS.map((item, idx) => (
              <article key={item.w} className="studio-card p-4 sm:p-5 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-[var(--tx)] m-0">
                      {formatNum(idx + 1, lang)}. {item.w}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
                      {formatNum(item.s.length, lang)} {tr(lang, 'অংশ', 'parts')}
                    </span>
                  </div>

                  <div className="my-3 p-3 rounded-2xl bg-[var(--bg2)]/80 border border-[var(--bd)] text-lg font-bold text-[var(--tx)]">
                    {item.s.map((chunk, j) => (
                      <React.Fragment key={j}>
                        <span>{chunk}</span>
                        {j < item.s.length - 1 && <span className="text-[var(--ac2)] mx-1.5">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="text-sm text-[var(--tx)] m-0">
                    <b>{tr(lang, 'একসঙ্গে:', 'Joined:')}</b> {item.p}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1">
                    <b>{tr(lang, 'গঠন:', 'Build:')}</b> {item.h}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1.5">💡 {item.tip}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => speakWord(item.w, 0.72)}
                    className="studio-btn-pri min-h-[42px] px-3.5 rounded-2xl inline-flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{tr(lang, 'শুনুন', 'Listen')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => speakWord(item.s.join(' ... '), 0.62)}
                    className="studio-btn-sec min-h-[42px] px-3.5 rounded-2xl inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    <Puzzle className="w-4 h-4" />
                    <span>{tr(lang, 'ভেঙে শুনুন', 'Hear chunks')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onRecordPrompt({
                        title: `${tr(lang, 'উচ্চারণ', 'Diction')}: ${item.w}`,
                        note: item.tip,
                        promptText: `${item.w} (${item.p}) — ${item.tip}`,
                      })
                    }
                    className="studio-btn-sec min-h-[42px] px-3 rounded-2xl inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-[var(--ac2)]" />
                    <span>{tr(lang, 'রেকর্ড', 'Record')}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Recitation Sample Drill */}
          <section className="studio-card-conj p-5 space-y-3">
            <h3 className="text-base font-bold text-[var(--tx)] m-0">
              {tr(lang, 'আবৃত্তির নমুনা অনুশীলন', 'Recitation drill')}
            </h3>
            <p className="text-lg sm:text-xl font-bold leading-relaxed text-[var(--tx)] m-0 p-3.5 rounded-2xl bg-[var(--bg2)]/75 border border-[var(--bd)]">
              {POETRY_SAMPLE_LINE}
            </p>
            <p className="text-xs sm:text-sm text-[var(--mu)] m-0">
              / চিহ্নে শ্বাস নিন; “নির্ঝরিণী”, “স্রোতস্বিনী”, “গোধূলিলগ্নে”, “চিরন্তন” শব্দে ধীরে স্পষ্টতা আনুন।
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => speakWord('নির্ঝরিণীর স্রোতস্বিনী ধ্বনি। গোধূলিলগ্নে জাগায় চিরন্তন স্মৃতি।', 0.78)}
                className="studio-btn-pri min-h-[46px] px-5 rounded-2xl inline-flex items-center gap-2 text-sm cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{tr(lang, 'নমুনা শুনুন', 'Hear sample')}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onRecordPrompt({
                    title: tr(lang, 'কবিতা আবৃত্তি নমুনা', 'Poetry sample recitation'),
                    note: 'নির্ঝরিণীর স্রোতস্বিনী ধ্বনি / গোধূলিলগ্নে জাগায় চিরন্তন স্মৃতি।',
                    promptText: POETRY_SAMPLE_LINE,
                  })
                }
                className="studio-btn-sec min-h-[46px] px-5 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[var(--ac2)]" />
                <span>{tr(lang, 'স্টুডিওতে রেকর্ড ও শেয়ার', 'Record & share in Studio')}</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
