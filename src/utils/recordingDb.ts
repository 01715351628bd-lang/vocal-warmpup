import type { Lang, RecordedTake } from '../types/studio';
import { tr } from './storage';

const REC_DB = 'vws11_recordings';
const REC_STORE = 'takes';

function openRecDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(REC_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(REC_STORE)) {
        db.createObjectStore(REC_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Database error'));
  });
}

export async function saveTake(
  blob: Blob,
  duration: number,
  meta: { label?: string; note?: string; avgPitchHz?: number; dominantNote?: string } = {}
): Promise<number> {
  const db = await openRecDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(REC_STORE, 'readwrite');
    const req = tx.objectStore(REC_STORE).add({
      blob,
      duration,
      created: Date.now(),
      type: blob.type || 'audio/webm',
      label: meta.label || '',
      note: meta.note || '',
      avgPitchHz: meta.avgPitchHz,
      dominantNote: meta.dominantNote,
    });
    req.onsuccess = () => resolve(Number(req.result));
    req.onerror = () => reject(req.error || new Error('Save failed'));
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getTakes(): Promise<RecordedTake[]> {
  const db = await openRecDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(REC_STORE, 'readonly');
    const req = tx.objectStore(REC_STORE).getAll();
    req.onsuccess = () => {
      const items = (req.result || []) as RecordedTake[];
      items.sort((a, b) => b.created - a.created);
      resolve(items);
      db.close();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function getTake(id: number): Promise<RecordedTake | null> {
  const db = await openRecDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(REC_STORE, 'readonly').objectStore(REC_STORE).get(Number(id));
    req.onsuccess = () => {
      resolve((req.result as RecordedTake) || null);
      db.close();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function updateTakeMeta(
  id: number,
  patch: Partial<Pick<RecordedTake, 'label' | 'note'>>
): Promise<void> {
  const db = await openRecDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(REC_STORE, 'readwrite');
    const store = tx.objectStore(REC_STORE);
    const getReq = store.get(Number(id));
    getReq.onsuccess = () => {
      const existing = getReq.result as RecordedTake | undefined;
      if (!existing) {
        reject(new Error('Recording not found'));
        return;
      }
      store.put({
        ...existing,
        label: patch.label !== undefined ? patch.label : existing.label,
        note: patch.note !== undefined ? patch.note : existing.note,
      });
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function deleteTake(id: number): Promise<void> {
  const db = await openRecDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(REC_STORE, 'readwrite');
    tx.objectStore(REC_STORE).delete(Number(id));
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ===== Universal WAV Encoder for effortless cross-app sharing =====
function writeAscii(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(2, buffer.numberOfChannels);
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export async function convertBlobToWav(blob: Blob): Promise<Blob> {
  if (blob.type === 'audio/wav' || blob.type === 'audio/wave') {
    return blob;
  }
  const Ctor =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) throw new Error('AudioContext unavailable');
  const ctx = new Ctor();
  try {
    const arr = await blob.arrayBuffer();
    const decoded = await ctx.decodeAudioData(arr);
    return audioBufferToWavBlob(decoded);
  } finally {
    ctx.close().catch(() => {});
  }
}

export function getSafeBaseFilename(take: RecordedTake): string {
  const raw = (take.label || `vocal-take-${take.id}`).trim();
  const safe = raw.replace(/[^\w\u0980-\u09FF-]+/g, '-').replace(/^-+|-+$/g, '');
  return safe || `vocal-take-${take.id}`;
}

export function getOriginalExtension(mimeType: string): string {
  const lower = (mimeType || '').toLowerCase();
  if (lower.includes('mp4') || lower.includes('aac') || lower.includes('m4a')) return 'm4a';
  if (lower.includes('ogg')) return 'ogg';
  if (lower.includes('wav')) return 'wav';
  return 'webm';
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2500);
}

export async function downloadTakeAsFormat(
  take: RecordedTake,
  format: 'wav' | 'original' = 'wav'
): Promise<{ filename: string; usedOriginal: boolean }> {
  const base = getSafeBaseFilename(take);
  if (format === 'wav') {
    try {
      const wavBlob = await convertBlobToWav(take.blob);
      const filename = `${base}.wav`;
      triggerBlobDownload(wavBlob, filename);
      return { filename, usedOriginal: false };
    } catch {
      // Fallback to original format if browser cannot decode
    }
  }
  const ext = getOriginalExtension(take.type);
  const filename = `${base}.${ext}`;
  triggerBlobDownload(take.blob, filename);
  return { filename, usedOriginal: true };
}

export function buildShareSummaryText(take: RecordedTake, lang: Lang): string {
  const title = take.label || `${tr(lang, 'রেকর্ডিং', 'Take')} #${take.id}`;
  const mins = Math.floor(take.duration / 60);
  const secs = String(take.duration % 60).padStart(2, '0');
  const parts = [
    `🎙️ ${title} (${mins}:${secs})`,
    take.avgPitchHz
      ? `${tr(lang, 'গড় পিচ', 'Avg pitch')}: ${Math.round(take.avgPitchHz)} Hz${take.dominantNote ? ` (${take.dominantNote})` : ''}`
      : '',
    take.note ? `${tr(lang, 'নোট', 'Notes')}: ${take.note}` : '',
    'Vocal Warm-up Studio',
  ].filter(Boolean);
  return parts.join('\n');
}

export function canUseNativeFileShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
}

export async function shareTakeAudioFile(
  take: RecordedTake,
  lang: Lang,
  format: 'wav' | 'original' = 'wav'
): Promise<{ status: 'shared' | 'downloaded' | 'cancelled'; message: string }> {
  const base = getSafeBaseFilename(take);
  let targetBlob = take.blob;
  let ext = getOriginalExtension(take.type);

  if (format === 'wav') {
    try {
      targetBlob = await convertBlobToWav(take.blob);
      ext = 'wav';
    } catch {
      // fallback to original
    }
  }

  const filename = `${base}.${ext}`;
  const mime = targetBlob.type || (ext === 'wav' ? 'audio/wav' : 'audio/webm');
  const file = new File([targetBlob], filename, { type: mime });
  const title = take.label || `${tr(lang, 'কণ্ঠ রেকর্ডিং', 'Voice Take')} #${take.id}`;
  const text = buildShareSummaryText(take, lang);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    const supportsFileShare =
      typeof navigator.canShare === 'function' &&
      (() => {
        try {
          return navigator.canShare({ files: [file] });
        } catch {
          return false;
        }
      })();

    if (supportsFileShare) {
      try {
        await navigator.share({
          title,
          text,
          files: [file],
        });
        return {
          status: 'shared',
          message: tr(lang, 'অডিও ফাইল সফলভাবে শেয়ার করা হয়েছে!', 'Audio file shared successfully!'),
        };
      } catch (err) {
        const name = (err as Error)?.name;
        if (name === 'AbortError') {
          return {
            status: 'cancelled',
            message: tr(lang, 'শেয়ার বাতিল করা হয়েছে', 'Share cancelled'),
          };
        }
        // If native share fails inside iframe or desktop policy, fall through to download
      }
    }
  }

  // Fallback: instant file download so user can drag/attach anywhere cleanly
  triggerBlobDownload(targetBlob, filename);
  return {
    status: 'downloaded',
    message: tr(
      lang,
      `এই ব্রাউজারে সরাসরি ফাইল-শেয়ার সীমিত — "${filename}" ডাউনলোড হয়েছে, এখন হোয়াটসঅ্যাপ বা মেসেঞ্জারে পাঠাতে পারেন।`,
      `Direct file share isn't supported in this browser — "${filename}" downloaded for easy sharing.`
    ),
  };
}
