import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Lang } from '../types/studio';
import { tr } from '../utils/storage';

export const VoiceSafetyCard: React.FC<{ lang: Lang }> = ({ lang }) => {
  return (
    <section className="studio-card-warn p-4 sm:p-5 my-3.5">
      <h3 className="flex items-center gap-2 text-base font-bold text-[var(--tx)] m-0 mb-2">
        <ShieldCheck className="w-5 h-5 text-[var(--warn)] shrink-0" />
        <span>{tr(lang, 'কণ্ঠ সুরক্ষা', 'Voice safety')}</span>
      </h3>
      <ul className="list-disc pl-5 m-0 space-y-1 text-sm text-[var(--mu)] leading-relaxed">
        <li>{tr(lang, 'ধীরে শুরু করুন; চিৎকার করবেন না।', 'Start gently; avoid shouting.')}</li>
        <li>
          {tr(
            lang,
            'উঁচু বা নিচু স্বর জোর করবেন না; দীর্ঘক্ষণ শ্বাস আটকাবেন না।',
            'Do not force high or low notes; avoid long breath holds.'
          )}
        </li>
        <li>
          {tr(
            lang,
            'বিরতি নিন। ব্যথা, মাথা ঘোরা বা স্থায়ী ভাঙা গলা হলে থামুন।',
            'Take breaks. Stop if you feel pain, dizziness or lasting hoarseness.'
          )}
        </li>
        <li>
          {tr(
            lang,
            'এই অ্যাপ কোনো রোগের চিকিৎসা নয়; শুধু সাধারণ কণ্ঠ-অনুশীলন।',
            'This app does not treat medical conditions; it is for ordinary voice practice.'
          )}
        </li>
      </ul>
    </section>
  );
};
