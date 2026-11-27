import React, { useEffect, useState } from 'react';
import { ChevronRight, Square, Trash2, Volume2, VolumeX } from 'lucide-react';
import { SA_KEYS } from '../data/exercises';
import type { AppState, Lang, Theme, VoiceGender } from '../types/studio';
import {
  ensureAudioEngine,
  getLangVoices,
  hasSpeechSynthesis,
  pickVoice,
  speakCue,
  startBgSound,
  stopBgSound,
  stopSpeech,
} from '../utils/audioEngine';
import { formatNum, tr } from '../utils/storage';
import { VoiceSafetyCard } from './VoiceSafetyCard';

interface SettingsViewProps {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onResetAll: () => void;
  onOpenAbout: () => void;
  onToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdate,
  onResetAll,
  onOpenAbout,
  onToast,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [testingTanpura, setTestingTanpura] = useState(false);
  const lang = state.lang;
  const voices = getLangVoices(lang);
  const picked = pickVoice(state);

  useEffect(() => {
    return () => {
      stopBgSound(true);
    };
  }, []);

  const handleToggleTanpuraTest = () => {
    if (testingTanpura) {
      stopBgSound(false);
      setTestingTanpura(false);
    } else {
      ensureAudioEngine(state);
      startBgSound('tanpura', Number(state.sa) || 130.81);
      setTestingTanpura(true);
    }
  };

  const handleTestVoice = () => {
    const ok = speakCue(
      tr(lang, 'এটি একটি পরীক্ষামূলক নির্দেশনা।', 'This is a test instruction.'),
      state
    );
    if (!ok) {
      onToast(tr(lang, 'ভয়েস সমর্থিত নয়', 'Speech unsupported'));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
        {tr(lang, 'সেটিংস', 'Settings')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Language & Theme */}
        <section className="studio-card p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              {tr(lang, 'ভাষা', 'Language')}
            </label>
            <select
              value={state.lang}
              onChange={(e) => onUpdate({ lang: e.target.value as Lang })}
              className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              <option value="bn">বাংলা</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              {tr(lang, 'থিম', 'Theme')}
            </label>
            <select
              value={state.theme}
              onChange={(e) => onUpdate({ theme: e.target.value as Theme })}
              className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              <option value="dark">{tr(lang, 'ডার্ক', 'Dark')}</option>
              <option value="light">{tr(lang, 'লাইট', 'Light')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              🎯 {tr(lang, 'দৈনিক লক্ষ্য', 'Daily goal')}
            </label>
            <select
              value={Number(state.goal) || 10}
              onChange={(e) => onUpdate({ goal: Number(e.target.value) })}
              className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              {[5, 10, 15, 20, 30].map((m) => (
                <option key={m} value={m}>
                  {formatNum(m, lang)} {tr(lang, 'মিনিট', 'min')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              🎼 {tr(lang, 'সা-এর স্বর (তানপুরা)', 'Sa (tonic) for tanpura')}
            </label>
            <select
              value={Number(state.sa) || 130.81}
              onChange={(e) => {
                const nextSa = Number(e.target.value);
                onUpdate({ sa: nextSa });
                if (testingTanpura) {
                  ensureAudioEngine(state);
                  startBgSound('tanpura', nextSa);
                }
              }}
              className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              {SA_KEYS.map(([label, hz]) => (
                <option key={label} value={hz}>
                  {label} ({hz} Hz)
                </option>
              ))}
            </select>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
              <button
                type="button"
                onClick={handleToggleTanpuraTest}
                className={`min-h-[42px] px-4 rounded-2xl inline-flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                  testingTanpura ? 'studio-btn-pri' : 'studio-btn-sec'
                }`}
              >
                {testingTanpura ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[var(--ac2)]" />}
                <span>
                  {testingTanpura
                    ? tr(lang, 'তানপুরা বন্ধ', 'Stop Tanpura')
                    : tr(lang, 'রিয়ালিস্টিক তানপুরা শুনুন', 'Test Realistic Tanpura')}
                </span>
              </button>
            </div>
            <p className="text-xs text-[var(--mu)] m-0 mt-1.5">
              {tr(
                lang,
                'সাধনার অনুশীলনে ব্যাকগ্রাউন্ড সাউন্ড "তানপুরা" বা অটো থাকলে এবং লাইভ পিচ সরগমে এই স্বর ব্যবহৃত হবে।',
                'Used for Tanpura sound during sadhana and for live Sargam note detection.'
              )}
            </p>
          </div>
        </section>

        {/* Voice guidance */}
        <section className="studio-card p-5 space-y-3">
          <h3 className="text-base font-bold text-[var(--tx)] m-0">
            {tr(lang, 'ভয়েস গাইডেন্স', 'Voice guidance')}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              {tr(lang, 'পছন্দ', 'Preference')}
            </label>
            <select
              value={state.gender}
              onChange={(e) => onUpdate({ gender: e.target.value as VoiceGender })}
              className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              <option value="any">{tr(lang, 'যেকোনো', 'Any')}</option>
              <option value="f">{tr(lang, 'মহিলা', 'Female')}</option>
              <option value="m">{tr(lang, 'পুরুষ', 'Male')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
              {tr(lang, 'ভয়েস', 'Voice')}
            </label>
            <select
              value={state.voice}
              onChange={(e) => onUpdate({ voice: e.target.value })}
              className="w-full min-h-[48px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
            >
              <option value="">{tr(lang, 'স্বয়ংক্রিয়', 'Automatic')}</option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[var(--mu)]">
              <span>{tr(lang, 'গতি', 'Rate')}</span>
              <span className="font-mono-num">{state.rate.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.4"
              step="0.05"
              value={state.rate}
              onChange={(e) => onUpdate({ rate: Number(e.target.value) })}
              className="studio-range"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[var(--mu)]">
              <span>{tr(lang, 'পিচ', 'Pitch')}</span>
              <span className="font-mono-num">{state.pitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={state.pitch}
              onChange={(e) => onUpdate({ pitch: Number(e.target.value) })}
              className="studio-range"
            />
          </div>

          <p className="text-xs text-[var(--mu)] m-0">
            {hasSpeechSynthesis()
              ? voices.length
                ? `${formatNum(voices.length, lang)}${tr(lang, ' টি ভয়েস পাওয়া গেছে। ', ' voice(s) found. ')}`
                : tr(lang, 'এই ভাষার কোনো ভয়েস নেই। ', 'No voice for this language. ')
              : tr(lang, 'SpeechSynthesis সমর্থিত নয়। ', 'SpeechSynthesis unsupported. ')}
            {picked.note}
          </p>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleTestVoice}
              className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{tr(lang, 'পরীক্ষা', 'Test')}</span>
            </button>
            <button
              type="button"
              onClick={stopSpeech}
              className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{tr(lang, 'থামান', 'Stop')}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Reminder */}
      <section className="studio-card p-5 space-y-3">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'রিমাইন্ডার', 'Reminder')}</h3>
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2.5 text-sm font-semibold text-[var(--tx)] cursor-pointer">
            <input
              type="checkbox"
              checked={state.remOn}
              onChange={(e) => onUpdate({ remOn: e.target.checked })}
              className="w-5 h-5 accent-[var(--ac)] cursor-pointer"
            />
            <span>{tr(lang, 'চালু', 'Enabled')}</span>
          </label>
          <input
            type="time"
            value={state.rem}
            onChange={(e) => onUpdate({ rem: e.target.value })}
            className="min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
          />
        </div>
        <p className="text-xs text-[var(--mu)] m-0">
          {tr(
            lang,
            'সীমাবদ্ধতা: এটি অ্যাপ-ভিতরের রিমাইন্ডার (অ্যাপ খুললে দেখায়)। নোটিফিকেশন পাঠানো হয় না।',
            'Limitation: this is an in-app reminder shown when the app opens. No system notifications are sent.'
          )}
        </p>
      </section>

      <VoiceSafetyCard lang={lang} />

      <section className="studio-card p-5 space-y-1.5">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'অ্যাপ ও গোপনীয়তা', 'About & privacy')}</h3>
        <p className="text-xs sm:text-sm text-[var(--mu)] m-0 leading-relaxed">
          Vocal Warm-up Studio · v2.0 Studio Pro
          <br />
          {tr(
            lang,
            '৫০টি কণ্ঠ-কৌশল, কবিতা আবৃত্তি, লাইভ পিচ অ্যানালাইজার, রেকর্ডার ও সহজ শেয়ারিং।',
            '50 vocal techniques, poetry recitation lab, live pitch analyzer, recorder & easy sharing.'
          )}
          <br />
          {tr(lang, 'সব তথ্য শুধু আপনার ডিভাইসে সংরক্ষিত; কোনো লগইন বা সার্ভার নেই।', 'All data stays on your device; no login or server.')}
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenAbout}
          className="studio-card min-h-[48px] px-4 rounded-2xl flex items-center justify-between text-sm font-semibold text-[var(--tx)] cursor-pointer"
        >
          <span>ℹ️ {tr(lang, 'অ্যাপ সম্পর্কে ও নির্মাতা', 'About & creator')}</span>
          <ChevronRight className="w-4 h-4 text-[var(--mu)]" />
        </button>

        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="min-h-[48px] px-4 rounded-2xl border border-[var(--danger)]/60 text-[var(--danger)] bg-transparent flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{tr(lang, 'সব ডেটা রিসেট', 'Reset all data')}</span>
        </button>
      </div>

      {/* Confirm Reset Dialog */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-5"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="studio-card p-5 max-w-sm w-full space-y-4">
            <p className="text-base font-bold text-[var(--tx)] m-0">
              {tr(lang, 'সব অগ্রগতি ও সেটিংস মুছে যাবে। নিশ্চিত?', 'This erases all progress and settings. Sure?')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="studio-btn-sec min-h-[44px] px-4 rounded-2xl text-sm font-semibold cursor-pointer"
              >
                {tr(lang, 'বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(false);
                  onResetAll();
                }}
                className="min-h-[44px] px-5 rounded-2xl bg-[var(--danger)] text-white text-sm font-bold border-0 cursor-pointer"
              >
                {tr(lang, 'নিশ্চিত', 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
