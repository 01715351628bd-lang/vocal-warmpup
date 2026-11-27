import React, { useState } from 'react';
import { Check, Copy, Download, FileAudio, Share2, X } from 'lucide-react';
import type { Lang, RecordedTake } from '../types/studio';
import {
  buildShareSummaryText,
  canUseNativeFileShare,
  downloadTakeAsFormat,
  getOriginalExtension,
  shareTakeAudioFile,
} from '../utils/recordingDb';
import { formatNum, tr } from '../utils/storage';

interface ShareTakeModalProps {
  take: RecordedTake;
  lang: Lang;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ShareTakeModal: React.FC<ShareTakeModalProps> = ({ take, lang, onClose, onToast }) => {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastInfo, setLastInfo] = useState<string>('');

  const nativeSupported = canUseNativeFileShare();
  const title = take.label || `${tr(lang, 'রেকর্ডিং', 'Take')} #${take.id}`;
  const mins = Math.floor(take.duration / 60);
  const secs = String(take.duration % 60).padStart(2, '0');
  const origExt = getOriginalExtension(take.type).toUpperCase();

  const handleShareFile = async (format: 'wav' | 'original') => {
    setBusy(true);
    setLastInfo('');
    try {
      const res = await shareTakeAudioFile(take, lang, format);
      setLastInfo(res.message);
      onToast(res.message);
    } catch (err) {
      const msg = (err as Error)?.message || tr(lang, 'শেয়ার করতে সমস্যা হয়েছে', 'Could not share file');
      setLastInfo(msg);
      onToast(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async (format: 'wav' | 'original') => {
    setBusy(true);
    setLastInfo('');
    try {
      const { filename } = await downloadTakeAsFormat(take, format);
      const msg = tr(lang, `"${filename}" ডাউনলোড হয়েছে`, `Downloaded "${filename}"`);
      setLastInfo(msg);
      onToast(msg);
    } catch (err) {
      const msg = (err as Error)?.message || tr(lang, 'ডাউনলোড ব্যর্থ হয়েছে', 'Download failed');
      setLastInfo(msg);
      onToast(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleCopySummary = async () => {
    const summary = buildShareSummaryText(take, lang);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      onToast(tr(lang, 'তথ্য কপি হয়েছে', 'Practice summary copied'));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast(summary);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={tr(lang, 'অডিও শেয়ার করুন', 'Share audio recording')}
      onClick={onClose}
    >
      <div
        className="studio-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[var(--mu)]/30 mx-auto sm:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ac2)]">
              {tr(lang, 'অডিও ফাইল শেয়ার', 'Share Audio File')}
            </span>
            <h3 className="text-lg font-extrabold text-[var(--tx)] m-0 mt-0.5">{title}</h3>
            <p className="text-xs text-[var(--mu)] m-0 mt-1 font-mono-num">
              {formatNum(`${mins}:${secs}`, lang)}
              {take.avgPitchHz ? ` · ~${Math.round(take.avgPitchHz)} Hz (${take.dominantNote || ''})` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr(lang, 'বন্ধ করুন', 'Close')}
            className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-full grid place-items-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Easy Share Action */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => handleShareFile('wav')}
            className="studio-btn-pri w-full min-h-[50px] px-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {busy
                ? tr(lang, 'প্রস্তুত হচ্ছে…', 'Preparing audio…')
                : nativeSupported
                  ? tr(lang, 'সরাসরি শেয়ার করুন (.WAV — WhatsApp/সব অ্যাপে চলে)', 'Share directly (.WAV — universal)')
                  : tr(lang, 'ইউনিভার্সাল .WAV হিসেবে সেভ ও শেয়ার করুন', 'Save & share as universal .WAV')}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleDownload('wav')}
              className="studio-btn-sec min-h-[46px] px-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[var(--ok)]" />
              <span>{tr(lang, '.WAV ডাউনলোড', 'Download .WAV')}</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleDownload('original')}
              className="studio-btn-sec min-h-[46px] px-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              <FileAudio className="w-4 h-4 text-[var(--ac2)]" />
              <span>
                {origExt} {tr(lang, 'ডাউনলোড', 'file')}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleShareFile('original')}
              className="studio-btn-sec min-h-[44px] px-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{tr(lang, `শেয়ার (${origExt})`, `Share (${origExt})`)}</span>
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              className="studio-btn-sec min-h-[44px] px-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--ok)]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{tr(lang, 'নোট ও পিচ কপি', 'Copy summary')}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--mu)] m-0 leading-relaxed">
          {tr(
            lang,
            'টিপস: .WAV ফরম্যাটে রূপান্তর করলে হোয়াটসঅ্যাপ, টেলিগ্রাম, মেসেঞ্জার ও ফোনের সব প্লেয়ারে অডিও নির্বিঘ্নে বাজে।',
            'Tip: Converting to .WAV ensures smooth playback across WhatsApp, Telegram, Messenger, and all phone players.'
          )}
        </p>

        {lastInfo && (
          <div className="p-3 rounded-xl bg-[var(--bg2)] border border-[var(--bd)] text-xs text-[var(--tx)]">
            {lastInfo}
          </div>
        )}
      </div>
    </div>
  );
};
