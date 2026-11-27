import React from 'react';
import { ArrowLeft, Mic, Play, Puzzle, Volume2 } from 'lucide-react';
import { POETRY_SAMPLE_LINE, POETRY_WORDS } from '../data/exercises';
import type { AppState, StudioPrefill } from '../types/studio';
import { speakCue } from '../utils/audioEngine';
import { formatNum, tr } from '../utils/storage';

interface PoetryLabViewProps {
  state: AppState;
  onBack: () => void;
  onRecordPrompt: (prefill: StudioPrefill) => void;
}

export const PoetryLabView: React.FC<PoetryLabViewProps> = ({ state, onBack, onRecordPrompt }) => {
  const lang = state.lang;

  const speakWord = (text: string, rate = 0.78) => {
    speakCue(text, state, { overrideLang: 'bn', rateOverride: rate });
  };

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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
          {tr(lang, '২০টি কঠিন শব্দ', '20 difficult words')}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
        📜 {tr(lang, 'কবিতা আবৃত্তি: কঠিন শব্দ', 'Poetry diction lab')}
      </h1>

      <section className="studio-card p-4 sm:p-5 space-y-3">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'যেভাবে অনুশীলন করবেন', 'How to practise')}</h3>
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
  );
};
