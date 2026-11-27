import type { Lang, PitchReading } from '../types/studio';

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

const SARGAM_BN = ['সা', 'কোমল রে', 'রে', 'কোমল গা', 'গা', 'মা', 'তীব্র মা', 'পা', 'কোমল ধা', 'ধা', 'কোমল নি', 'নি'];
const SARGAM_EN = ['Sa', 'Komal Re', 'Re', 'Komal Ga', 'Ga', 'Ma', 'Tivra Ma', 'Pa', 'Komal Dha', 'Dha', 'Komal Ni', 'Ni'];

export function getRms(buf: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    sum += buf[i] * buf[i];
  }
  return Math.sqrt(sum / buf.length);
}

/**
 * YIN Pitch Detection Algorithm (CMNDF + Parabolic Interpolation).
 * Far more accurate and resistant to octave-jump errors than naive autocorrelation.
 */
export function detectPitchYin(
  buf: Float32Array,
  sampleRate: number,
  minHz = 60,
  maxHz = 1100
): { hz: number | null; confidence: number; rms: number } {
  const rms = getRms(buf);
  if (rms < 0.008) {
    return { hz: null, confidence: 0, rms };
  }

  const maxLag = Math.min(Math.floor(buf.length / 2), Math.floor(sampleRate / minHz));
  const minLag = Math.max(2, Math.floor(sampleRate / maxHz));
  if (maxLag <= minLag + 2) {
    return { hz: null, confidence: 0, rms };
  }

  const halfLen = buf.length - maxLag;
  const diff = new Float32Array(maxLag + 1);
  for (let tau = 1; tau <= maxLag; tau++) {
    let sum = 0;
    for (let i = 0; i < halfLen; i++) {
      const d = buf[i] - buf[i + tau];
      sum += d * d;
    }
    diff[tau] = sum;
  }

  const cmndf = new Float32Array(maxLag + 1);
  cmndf[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau <= maxLag; tau++) {
    runningSum += diff[tau];
    cmndf[tau] = runningSum > 0 ? (diff[tau] * tau) / runningSum : 1;
  }

  const threshold = 0.16;
  let tauEstimate = -1;
  for (let tau = minLag; tau < maxLag; tau++) {
    if (cmndf[tau] < threshold) {
      while (tau + 1 < maxLag && cmndf[tau + 1] < cmndf[tau]) {
        tau++;
      }
      tauEstimate = tau;
      break;
    }
  }

  // Fallback to global minimum if no dip passed strict threshold, provided clarity is decent
  if (tauEstimate === -1) {
    let minVal = 1;
    let bestTau = -1;
    for (let tau = minLag; tau < maxLag; tau++) {
      if (cmndf[tau] < minVal) {
        minVal = cmndf[tau];
        bestTau = tau;
      }
    }
    if (minVal < 0.28 && bestTau > minLag) {
      tauEstimate = bestTau;
    }
  }

  if (tauEstimate === -1) {
    return { hz: null, confidence: 0, rms };
  }

  const confidence = Math.max(0, Math.min(1, 1 - cmndf[tauEstimate]));

  // Parabolic interpolation around tauEstimate
  const prev = cmndf[tauEstimate - 1] ?? cmndf[tauEstimate];
  const curr = cmndf[tauEstimate];
  const next = cmndf[tauEstimate + 1] ?? cmndf[tauEstimate];
  const denom = 2 * curr - prev - next;
  const shift = Math.abs(denom) > 1e-6 ? (prev - next) / (2 * denom) : 0;
  const refinedTau = tauEstimate + Math.max(-0.5, Math.min(0.5, shift));
  const hz = sampleRate / refinedTau;

  if (!Number.isFinite(hz) || hz < minHz || hz > maxHz) {
    return { hz: null, confidence: 0, rms };
  }

  return { hz, confidence, rms };
}

export function hzToNoteInfo(hz: number, saHz = 130.81, lang: Lang = 'bn'): {
  note: string;
  sargam: string;
  cents: number;
} {
  const midiFloat = 69 + 12 * Math.log2(hz / 440);
  const midi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midi) * 100);
  const noteName = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;

  // Compute nearest Sargam swara relative to user's Sa tonic
  const semitonesFromSa = Math.round(12 * Math.log2(hz / (saHz || 130.81)));
  const swaraIndex = ((semitonesFromSa % 12) + 12) % 12;
  const sargamList = lang === 'bn' ? SARGAM_BN : SARGAM_EN;

  return {
    note: `${noteName}${octave}`,
    sargam: sargamList[swaraIndex],
    cents,
  };
}

export function analyzeFrame(
  buf: Float32Array,
  sampleRate: number,
  saHz: number,
  lang: Lang,
  prevHz: number | null
): PitchReading {
  const { hz: rawHz, confidence, rms } = detectPitchYin(buf, sampleRate);
  if (!rawHz) {
    return { hz: null, note: '—', sargam: '—', cents: 0, confidence: 0, rms };
  }

  // Light smoothing when within 15% of previous reading to prevent visual jitter
  let smoothedHz = rawHz;
  if (prevHz && Math.abs(rawHz - prevHz) / prevHz < 0.15) {
    smoothedHz = prevHz * 0.45 + rawHz * 0.55;
  }

  const info = hzToNoteInfo(smoothedHz, saHz, lang);
  return {
    hz: smoothedHz,
    note: info.note,
    sargam: info.sargam,
    cents: info.cents,
    confidence,
    rms,
  };
}
