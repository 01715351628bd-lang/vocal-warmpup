import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  HelpCircle,
  ListChecks,
  Mic,
  RefreshCw,
  Search,
  Volume2,
  XCircle,
} from 'lucide-react';
import { PROMITO_CATS, PROMITO_WORDS, type PromitoCat, type PromitoWordItem } from '../data/promitoDiction';
import type { AppState, StudioPrefill } from '../types/studio';
import { speakCue } from '../utils/audioEngine';
import { formatNum, tr } from '../utils/storage';

interface PromitoViewProps {
  state: AppState;
  onBack: () => void;
  onRecordPrompt: (prefill: StudioPrefill) => void;
}

type PromitoMode = 'list' | 'quiz';
const MASTERED_KEY = 'vws_promito_mastered_v1';

function loadMastered(): string[] {
  try {
    const raw = localStorage.getItem(MASTERED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export const PromitoView: React.FC<PromitoViewProps> = ({ state, onBack, onRecordPrompt }) => {
  const lang = state.lang;
  const L = lang === 'bn' ? 0 : 1;

  const [mode, setMode] = useState<PromitoMode>('list');
  const [cat, setCat] = useState<'all' | PromitoCat>('all');
  const [query, setQuery] = useState('');
  const [masteredIds, setMasteredIds] = useState<string[]>(() => loadMastered());

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOrder, setQuizOrder] = useState<number[]>(() =>
    PROMITO_WORDS.map((_, i) => i).sort(() => Math.random() - 0.5)
  );
  const [pickedOption, setPickedOption] = useState<'wrong' | 'standard' | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    try {
      localStorage.setItem(MASTERED_KEY, JSON.stringify(masteredIds));
    } catch {
      // Ignore storage quota issues
    }
  }, [masteredIds]);

  const speak = (text: string, rate = 0.72) => {
    speakCue(text, state, { overrideLang: 'bn', rateOverride: rate });
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMITO_WORDS.filter((item) => {
      if (cat !== 'all' && item.cat !== cat) return false;
      if (!q) return true;
      return `${item.word} ${item.wrong} ${item.standard} ${item.ruleBn} ${item.verseSample}`
        .toLowerCase()
        .includes(q);
    });
  }, [cat, query]);

  const masteredPct = Math.round((masteredIds.length / PROMITO_WORDS.length) * 100);

  // Quiz item & deterministic option order based on index parity
  const currentQuizItem: PromitoWordItem =
    PROMITO_WORDS[quizOrder[quizIndex % quizOrder.length] ?? 0] || PROMITO_WORDS[0];
  const standardFirst = (quizOrder[quizIndex % quizOrder.length] ?? 0) % 2 === 0;
  const quizOptions: { kind: 'standard' | 'wrong'; label: string }[] = standardFirst
    ? [
        { kind: 'standard', label: currentQuizItem.standard },
        { kind: 'wrong', label: currentQuizItem.wrong },
      ]
    : [
        { kind: 'wrong', label: currentQuizItem.wrong },
        { kind: 'standard', label: currentQuizItem.standard },
      ];

  const handleAnswerQuiz = (kind: 'standard' | 'wrong') => {
    if (pickedOption) return;
    setPickedOption(kind);
    const isCorrect = kind === 'standard';
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    if (isCorrect && !masteredIds.includes(currentQuizItem.id)) {
      setMasteredIds((prev) => [...prev, currentQuizItem.id]);
    }
  };

  const handleNextQuiz = () => {
    setPickedOption(null);
    setQuizIndex((prev) => prev + 1);
  };

  const handleResetQuiz = () => {
    setQuizOrder(PROMITO_WORDS.map((_, i) => i).sort(() => Math.random() - 0.5));
    setQuizIndex(0);
    setPickedOption(null);
    setQuizScore({ correct: 0, total: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tr(lang, 'স্টুডিওতে ফিরুন', 'Back to Studio')}</span>
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)] font-mono-num">
          {formatNum(PROMITO_WORDS.length, lang)} {tr(lang, 'টি শব্দ', 'words')}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
          🗣️ {tr(lang, 'প্রমিত বাংলা উচ্চারণ', 'Standard Bengali Pronunciation')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1.5 leading-relaxed">
          {tr(
            lang,
            'প্রাত্যহিক জীবনে আঞ্চলিকতা বা অসতর্কতার কারণে আমরা এমন অনেক শব্দ ভুল উচ্চারণ করি, যা আবৃত্তির সময় অবশ্যই বর্জন করতে হয়। বহুল প্রচলিত কিছু শব্দের ভুল ও প্রমিত (শুদ্ধ) উচ্চারণের তালিকা নিচে দেওয়া হলো।',
            'Regional habits or everyday carelessness lead to common mispronunciations that must be avoided in recitation. Compare common mistakes with Standard Bengali diction below.'
          )}
        </p>
      </div>

      {/* Mastery Card + Mode Tabs */}
      <section className="studio-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--ok)]" />
            <span className="text-sm font-bold text-[var(--tx)]">
              {tr(lang, 'প্রমিত উচ্চারণ আয়ত্ত:', 'Mastered words:')}
            </span>
          </div>
          <span className="text-xs font-extrabold font-mono-num text-[var(--ok)]">
            {formatNum(masteredIds.length, lang)} / {formatNum(PROMITO_WORDS.length, lang)} ({formatNum(masteredPct, lang)}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--bg2)] border border-[var(--bd)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${masteredPct}%`,
              background: 'linear-gradient(90deg, #12a97c, #2b8cf0)',
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setMode('list')}
            className={`min-h-[44px] px-3 rounded-xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold cursor-pointer ${
              mode === 'list' ? 'studio-btn-pri' : 'studio-btn-sec text-[var(--mu)]'
            }`}
          >
            <ListChecks className="w-4 h-4 shrink-0" />
            <span>{tr(lang, 'তালিকা ও তুলনা', 'Word Comparison')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`min-h-[44px] px-3 rounded-xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold cursor-pointer ${
              mode === 'quiz' ? 'studio-btn-pri' : 'studio-btn-sec text-[var(--mu)]'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>{tr(lang, 'উচ্চারণ যাচাই কুইজ', 'Pronunciation Quiz')}</span>
          </button>
        </div>
      </section>

      {mode === 'list' ? (
        <div className="space-y-4">
          {/* Search + Category Filter */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--mu)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr(
                  lang,
                  'শব্দ বা উচ্চারণ খুঁজুন (যেমন: স্বাধীন, ঐতিহ্য, লক্ষ্মী, অতিথি)...',
                  'Search word or rule (e.g. স্বাধীন, ঐতিহ্য, লক্ষ্মী)...'
                )}
                className="w-full min-h-[46px] rounded-2xl border border-[var(--bd)] bg-[var(--card)] pl-10 pr-4 text-sm text-[var(--tx)]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(PROMITO_CATS) as ('all' | PromitoCat)[]).map((k) => {
                const active = cat === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCat(k)}
                    className={`min-h-[38px] px-3 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      active ? 'studio-btn-pri' : 'studio-btn-sec text-[var(--mu)] hover:text-[var(--tx)]'
                    }`}
                  >
                    {PROMITO_CATS[k][L]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column Header Guide (Desktop) */}
          <div className="hidden md:grid md:grid-cols-12 gap-3 px-4 py-2.5 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)] text-xs font-extrabold uppercase tracking-wide text-[var(--mu)]">
            <div className="col-span-3">{tr(lang, 'শব্দ', 'Word')}</div>
            <div className="col-span-3 text-[var(--danger)]">
              ✕ {tr(lang, 'প্রচলিত ভুল উচ্চারণ', 'Common Wrong Form')}
            </div>
            <div className="col-span-4 text-[var(--ok)]">
              ✓ {tr(lang, 'আবৃত্তিতে প্রমিত উচ্চারণ', 'Standard Recitation')}
            </div>
            <div className="col-span-2 text-right">{tr(lang, 'অনুশীলন', 'Practice')}</div>
          </div>

          {/* Word Comparison List */}
          {filtered.length === 0 ? (
            <div className="studio-card p-6 text-center text-sm text-[var(--mu)]">
              {tr(lang, 'কোনো শব্দ পাওয়া যায়নি।', 'No words matched your search.')}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item, idx) => {
                const isDone = masteredIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className={`studio-card p-4 sm:p-4 space-y-3 transition-colors ${
                      isDone ? 'border-[var(--ok)]/40' : ''
                    }`}
                  >
                    {/* Main 3-Column Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      {/* 1. শব্দ */}
                      <div className="md:col-span-3 flex items-center justify-between md:block gap-2">
                        <div>
                          <span className="text-[11px] font-mono-num font-bold text-[var(--mu)]">
                            #{formatNum(idx + 1, lang)} · {PROMITO_CATS[item.cat][L]}
                          </span>
                          <h3 className="text-xl font-extrabold text-[var(--tx)] m-0 mt-0.5">
                            {item.word}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleMastered(item.id)}
                          className={`md:hidden min-h-[38px] px-2.5 rounded-xl inline-flex items-center gap-1 text-xs font-bold cursor-pointer ${
                            isDone
                              ? 'bg-[var(--ok)]/18 text-[var(--ok)] border border-[var(--ok)]/40'
                              : 'studio-btn-sec text-[var(--mu)]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isDone ? tr(lang, 'আয়ত্ত', 'Done') : tr(lang, 'চিহ্নিত', 'Mark')}</span>
                        </button>
                      </div>

                      {/* 2. প্রচলিত ভুল উচ্চারণ */}
                      <div className="md:col-span-3 p-2.5 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/25">
                        <div className="md:hidden text-[11px] font-bold text-[var(--danger)] mb-0.5">
                          ✕ {tr(lang, 'প্রচলিত ভুল উচ্চারণ', 'Common Mistake')}
                        </div>
                        <div className="text-sm font-semibold text-[var(--tx)]/90 line-through decoration-[var(--danger)]/60">
                          {item.wrong}
                        </div>
                      </div>

                      {/* 3. আবৃত্তিতে প্রমিত উচ্চারণ */}
                      <div className="md:col-span-4 p-2.5 rounded-xl bg-[var(--ok)]/12 border border-[var(--ok)]/30">
                        <div className="md:hidden text-[11px] font-bold text-[var(--ok)] mb-0.5">
                          ✓ {tr(lang, 'আবৃত্তিতে প্রমিত উচ্চারণ', 'Standard Pronunciation')}
                        </div>
                        <div className="text-base font-extrabold text-[var(--ok)]">
                          {item.standard}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => speak(item.word, 0.7)}
                          aria-label={`${tr(lang, 'শুনুন', 'Listen')}: ${item.word}`}
                          className="studio-btn-pri min-w-[44px] min-h-[42px] px-3 rounded-xl inline-flex items-center justify-center gap-1 text-xs cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="md:hidden">{tr(lang, 'শুনুন', 'Listen')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onRecordPrompt({
                              title: `${tr(lang, 'প্রমিত উচ্চারণ', 'Standard Diction')}: ${item.word}`,
                              note: `${tr(lang, 'প্রমিত রূপ', 'Standard')}: ${item.standard} (${item.wrong} নয়)`,
                              promptText: `${item.word} → ${item.standard}\n\n${item.verseSample}`,
                            })
                          }
                          aria-label={`${tr(lang, 'স্টুডিওতে রেকর্ড', 'Record in Studio')}: ${item.word}`}
                          className="studio-btn-sec min-w-[42px] min-h-[42px] px-2.5 rounded-xl inline-flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
                        >
                          <Mic className="w-4 h-4 text-[var(--ac2)]" />
                          <span className="md:hidden">{tr(lang, 'রেকর্ড', 'Record')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleMastered(item.id)}
                          aria-label={tr(lang, 'আয়ত্ত চিহ্নিত করুন', 'Mark mastered')}
                          aria-pressed={isDone}
                          className={`hidden md:inline-flex min-w-[42px] min-h-[42px] rounded-xl items-center justify-center cursor-pointer ${
                            isDone
                              ? 'bg-[var(--ok)]/18 text-[var(--ok)] border border-[var(--ok)]/45'
                              : 'studio-btn-sec text-[var(--mu)]'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Rule & Sample Poetic Context */}
                    <div className="pt-2 border-t border-[var(--bd)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--mu)]">
                      <p className="m-0 leading-relaxed">
                        <b className="text-[var(--ac)]">{tr(lang, 'নিয়ম:', 'Rule:')}</b>{' '}
                        {lang === 'bn' ? item.ruleBn : item.ruleEn}
                      </p>
                      <button
                        type="button"
                        onClick={() => speak(item.verseSample, 0.78)}
                        className="text-left sm:text-right text-xs font-semibold text-[var(--tx)]/85 hover:text-[var(--ac2)] cursor-pointer bg-transparent border-0 p-0 shrink-0"
                      >
                        📜 “{item.verseSample}” 🔊
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Pronunciation Quiz Mode */
        <section className="studio-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--tx)] m-0">
                🎯 {tr(lang, 'আবৃত্তিতে প্রমিত উচ্চারণ যাচাই', 'Standard Pronunciation Check')}
              </h2>
              <p className="text-xs text-[var(--mu)] m-0 mt-0.5">
                {tr(
                  lang,
                  'নিচের শব্দটির প্রচলিত ভুল বাদ দিয়ে আবৃত্তির প্রমিত শুদ্ধ উচ্চারণ কোনটি তা বেছে নিন।',
                  'Pick the standard Bengali recitation pronunciation and avoid the common mistake.'
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold font-mono-num bg-[var(--bg2)] border border-[var(--bd)] text-[var(--ac)]">
                {tr(lang, 'স্কোর:', 'Score:')} {formatNum(quizScore.correct, lang)} / {formatNum(quizScore.total, lang)}
              </span>
              <button
                type="button"
                onClick={handleResetQuiz}
                aria-label={tr(lang, 'নতুন করে শুরু', 'Reset quiz')}
                className="studio-btn-sec min-w-[40px] min-h-[40px] rounded-xl grid place-items-center cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg2)]/80 border border-[var(--bd)] text-center space-y-2">
            <span className="text-xs font-semibold text-[var(--mu)]">
              {PROMITO_CATS[currentQuizItem.cat][L]}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--tx)]">
              {currentQuizItem.word}
            </div>
            <button
              type="button"
              onClick={() => speak(currentQuizItem.word, 0.7)}
              className="studio-btn-sec min-h-[38px] px-3.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[var(--ac)]" />
              <span>{tr(lang, 'শব্দটি শুনুন', 'Hear word')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt) => {
              const chosen = pickedOption === opt.kind;
              const revealed = pickedOption !== null;
              let cardCls = 'studio-card hover:border-[var(--ac)]';
              if (revealed) {
                if (opt.kind === 'standard') {
                  cardCls = 'bg-[var(--ok)]/16 border-2 border-[var(--ok)]';
                } else if (chosen) {
                  cardCls = 'bg-[var(--danger)]/14 border-2 border-[var(--danger)]';
                }
              }
              return (
                <button
                  key={opt.kind}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleAnswerQuiz(opt.kind)}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer disabled:cursor-default flex items-center justify-between gap-2 ${cardCls}`}
                >
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--mu)]">
                      {tr(lang, 'সম্ভাব্য উচ্চারণ', 'Option')}
                    </div>
                    <div className="text-lg font-extrabold text-[var(--tx)] mt-0.5">{opt.label}</div>
                  </div>
                  {revealed && opt.kind === 'standard' && (
                    <CheckCircle2 className="w-5 h-5 text-[var(--ok)] shrink-0" />
                  )}
                  {revealed && chosen && opt.kind === 'wrong' && (
                    <XCircle className="w-5 h-5 text-[var(--danger)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {pickedOption && (
            <div className="studio-card-conj p-4 space-y-2.5">
              <div className="text-sm font-extrabold text-[var(--tx)]">
                {pickedOption === 'standard'
                  ? tr(lang, '✓ চমৎকার! এটাই আবৃত্তিতে প্রমিত উচ্চারণ।', '✓ Correct! That is the standard recitation form.')
                  : tr(
                      lang,
                      `✕ এটি প্রচলিত ভুল উচ্চারণ। শুদ্ধ রূপ: ${currentQuizItem.standard}`,
                      `✕ That is the common mistake. Standard form: ${currentQuizItem.standard}`
                    )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--tx)]/85 m-0 leading-relaxed">
                <b>{tr(lang, 'কারণ:', 'Why:')}</b> {lang === 'bn' ? currentQuizItem.ruleBn : currentQuizItem.ruleEn}
              </p>
              <p className="text-xs text-[var(--mu)] m-0">
                📜 {currentQuizItem.verseSample}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleNextQuiz}
                  className="studio-btn-pri min-h-[44px] px-5 rounded-2xl text-sm cursor-pointer"
                >
                  {tr(lang, 'পরবর্তী শব্দ →', 'Next word →')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onRecordPrompt({
                      title: `${tr(lang, 'প্রমিত উচ্চারণ', 'Diction')}: ${currentQuizItem.word}`,
                      note: `${currentQuizItem.standard} (${currentQuizItem.wrong} নয়)`,
                      promptText: `${currentQuizItem.word} → ${currentQuizItem.standard}\n${currentQuizItem.verseSample}`,
                    })
                  }
                  className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-[var(--ac2)]" />
                  <span>{tr(lang, 'স্টুডিওতে বলুন', 'Speak in Studio')}</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
