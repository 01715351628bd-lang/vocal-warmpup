import React from 'react';
import { ArrowLeft, Copy, Phone } from 'lucide-react';
import { ABOUT_IMG } from '../data/assets';
import type { Lang } from '../types/studio';
import { formatNum, tr } from '../utils/storage';

interface AboutViewProps {
  lang: Lang;
  onBack: () => void;
  onToast: (msg: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ lang, onBack, onToast }) => {
  const tel = '01303557531';
  const shownTel = lang === 'bn' ? formatNum(tel, lang) : tel;

  const features: [string, string, string][] = [
    ['🎙️', tr(lang, 'ভয়েস স্টুডিও', 'Voice Studio'), tr(lang, 'লাইভ পিচ, রেকর্ডার ও শেয়ার', 'Live pitch, recorder & share')],
    ['🧘', tr(lang, '৫০টি কৌশল', '50 techniques'), tr(lang, 'শ্বাস, স্বর, উচ্চারণ ও আবৃত্তি', 'Breath, voice, diction & recitation')],
    ['🗣️', tr(lang, 'টাং টুইস্টার', 'Tongue twisters'), tr(lang, 'যুক্তাক্ষরসহ বাংলা ও English', 'Bangla incl. conjuncts, English')],
    ['🗓️', tr(lang, 'কাস্টম রুটিন', 'Custom routines'), tr(lang, 'ধাপ যোগ, সরানো, ক্রম বদল', 'Add, remove, reorder steps')],
    ['🔊', tr(lang, 'ভয়েস গাইডেন্স', 'Voice guidance'), tr(lang, 'ধাপে ধাপে নির্দেশনা', 'Step-by-step spoken cues')],
    ['📈', tr(lang, 'অগ্রগতি', 'Progress'), tr(lang, 'ধারা, হিটম্যাপ ও অর্জন', 'Streaks, heatmap, badges')],
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tel);
      onToast(tr(lang, 'নম্বর কপি হয়েছে', 'Number copied'));
    } catch {
      onToast(tel);
    }
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
          <span>{tr(lang, 'পেছনে', 'Back')}</span>
        </button>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
          Vocal Warm-up Studio
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
        {tr(lang, 'অ্যাপ সম্পর্কে', 'About')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <section className="md:col-span-5 studio-card overflow-hidden p-0 border-[var(--ac)]/50">
          <div className="relative aspect-square max-h-[380px] w-full overflow-hidden bg-black">
            <img
              src={ABOUT_IMG}
              alt={tr(lang, 'অ্যাপ নির্মাতা মাসুম বিল্লাহ', 'App creator Masum Billah')}
              decoding="async"
              className="block w-full h-full object-cover object-[50%_28%]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, transparent 45%, rgba(8,12,28,0.92)), linear-gradient(135deg, rgba(139,124,246,0.18), transparent 55%)',
              }}
            />
            <div className="absolute left-4 right-4 bottom-4 z-10 text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-[#cfd6ff]">
                {tr(lang, 'অ্যাপ নির্মাতা', 'App creator')}
              </div>
              <h2 className="text-2xl font-extrabold m-0 mt-0.5 drop-shadow">
                {tr(lang, 'মাসুম বিল্লাহ', 'Masum Billah')}
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-2">
            <div className="text-xs font-semibold text-[var(--mu)]">{tr(lang, 'মোবাইল', 'Mobile')}</div>
            <div className="text-2xl font-extrabold font-mono-num studio-gradient-text">{shownTel}</div>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <a
                href="tel:+8801303557531"
                className="studio-btn-pri min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm no-underline"
              >
                <Phone className="w-4 h-4" />
                <span>{tr(lang, 'কল করুন', 'Call')}</span>
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{tr(lang, 'নম্বর কপি', 'Copy number')}</span>
              </button>
            </div>
          </div>
        </section>

        <div className="md:col-span-7 space-y-4">
          <section className="studio-card p-5 space-y-2">
            <h3 className="text-base font-bold text-[var(--tx)] m-0">Vocal Warm-up Studio</h3>
            <p className="text-sm text-[var(--mu)] m-0 leading-relaxed">
              {tr(
                lang,
                'কণ্ঠ গরম করা, উচ্চারণ ও আবৃত্তির অনুশীলনের জন্য একটি সহজ, অফলাইন-বান্ধব অ্যাপ। শ্বাস, গুনগুন, ট্রিল, অনুরণন ও যুক্তাক্ষরের অনুশীলন এক জায়গায়।',
                'A simple, offline-friendly app for voice warm-ups, clear pronunciation and recitation — breath, humming, trills, resonance and Bengali conjunct drills in one place.'
              )}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-3">
            {features.map(([icon, title, sub], idx) => (
              <div key={idx} className="studio-card p-3.5 space-y-0.5">
                <span className="text-2xl block">{icon}</span>
                <b className="block text-sm text-[var(--tx)]">{title}</b>
                <small className="block text-xs text-[var(--mu)]">{sub}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="studio-card p-5 space-y-1">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">🔒 {tr(lang, 'গোপনীয়তা', 'Privacy')}</h3>
        <p className="text-xs sm:text-sm text-[var(--mu)] m-0">
          {tr(
            lang,
            'সব তথ্য ও রেকর্ডিং শুধু আপনার ডিভাইসে থাকে; কোনো লগইন বা সার্ভার নেই।',
            'All data and recordings stay on your device; no login or server.'
          )}
        </p>
      </section>

      <section className="studio-card-warn p-5 space-y-1">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">{tr(lang, 'সতর্কতা', 'Notice')}</h3>
        <p className="text-xs sm:text-sm text-[var(--mu)] m-0">
          {tr(
            lang,
            'এই অ্যাপ চিকিৎসার বিকল্প নয়। ব্যথা বা স্থায়ী গলাভাঙা থাকলে অনুশীলন বন্ধ করে চিকিৎসকের পরামর্শ নিন।',
            'This app is not medical care. Stop and see a doctor if you have pain or lasting hoarseness.'
          )}
        </p>
      </section>

      <p className="text-center text-xs text-[var(--mu)] pt-2">
        © {new Date().getFullYear()} {tr(lang, 'মাসুম বিল্লাহ', 'Masum Billah')} · Vocal Warm-up Studio
      </p>
    </div>
  );
};
