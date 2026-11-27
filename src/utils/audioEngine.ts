import type { AppState, BgSoundKind, Lang, VoiceGender } from '../types/studio';
import { tr } from './storage';

const SY = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
const FEM_RE = /female|woman|zira|samantha|karen|tessa|hazel|x-\w{2,3}f-/i;
const MAL_RE = /(^|[^fe])male|\bman\b|david|mark|daniel|x-\w{2,3}m-/i;

let cachedVoices: SpeechSynthesisVoice[] = [];
const voiceListeners = new Set<() => void>();

export function hasSpeechSynthesis(): boolean {
  return Boolean(SY && typeof SpeechSynthesisUtterance !== 'undefined');
}

export function refreshVoices(): SpeechSynthesisVoice[] {
  if (!SY) return [];
  cachedVoices = SY.getVoices();
  return cachedVoices;
}

if (SY) {
  refreshVoices();
  SY.onvoiceschanged = () => {
    refreshVoices();
    voiceListeners.forEach((cb) => cb());
  };
}

export function subscribeVoices(cb: () => void): () => void {
  voiceListeners.add(cb);
  return () => {
    voiceListeners.delete(cb);
  };
}

export function getLangVoices(targetLang: Lang): SpeechSynthesisVoice[] {
  const list = cachedVoices.length ? cachedVoices : refreshVoices();
  const prefix = targetLang === 'bn' ? 'bn' : 'en';
  return list.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
}

export function pickVoice(
  state: Pick<AppState, 'lang' | 'voice' | 'gender'>,
  overrideLang?: Lang
): { v: SpeechSynthesisVoice | null; note: string } {
  const target = overrideLang || state.lang;
  const list = getLangVoices(target);
  if (!hasSpeechSynthesis()) {
    return {
      v: null,
      note: tr(
        state.lang,
        'এই ডিভাইসে ভয়েস নেই — শুধু লিখিত নির্দেশনা দেখানো হবে।',
        'Speech not supported — text instructions only.'
      ),
    };
  }
  if (!list.length) {
    return {
      v: null,
      note: tr(
        state.lang,
        'এই ভাষার ভয়েস পাওয়া যায়নি; ডিফল্ট ভয়েস ব্যবহার হচ্ছে (উচ্চারণ ভিন্ন হতে পারে)। ডিভাইস সেটিংসে TTS ভয়েস ইনস্টল করুন।',
        'No voice for this language; using device default voice. Install TTS voices in device settings.'
      ),
    };
  }
  const exact = list.find((v) => v.name === state.voice);
  if (exact) return { v: exact, note: '' };
  if (state.gender !== 'any') {
    const matched = list.find((v) => (state.gender === 'f' ? FEM_RE : MAL_RE).test(v.name));
    if (matched) return { v: matched, note: '' };
    return {
      v: list[0],
      note: tr(
        state.lang,
        'নির্বাচিত লিঙ্গের ভয়েস নিশ্চিত করা যায়নি; অন্য ভয়েস ব্যবহার হচ্ছে।',
        `Could not find a ${state.gender === 'f' ? 'female' : 'male'} voice; using fallback.`
      ),
    };
  }
  return { v: list[0], note: '' };
}

export function speakCue(
  text: string,
  state: Pick<AppState, 'lang' | 'voice' | 'gender' | 'rate' | 'pitch' | 'vvol' | 'master' | 'mute'>,
  options?: {
    overrideLang?: Lang;
    rateOverride?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): boolean {
  if (!SY || typeof SpeechSynthesisUtterance === 'undefined') {
    options?.onEnd?.();
    return false;
  }
  SY.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const picked = pickVoice(state, options?.overrideLang);
  if (picked.v) {
    u.voice = picked.v;
    u.lang = picked.v.lang;
  } else {
    u.lang = (options?.overrideLang || state.lang) === 'bn' ? 'bn-BD' : 'en-US';
  }
  u.rate = options?.rateOverride ?? state.rate;
  u.pitch = state.pitch;
  u.volume = state.mute ? 0 : Math.min(1, state.vvol * state.master);
  u.onstart = () => options?.onStart?.();
  u.onend = () => options?.onEnd?.();
  u.onerror = () => options?.onEnd?.();
  SY.speak(u);
  return true;
}

export function stopSpeech(): void {
  if (SY) SY.cancel();
}

export function hasBengaliVoice(): boolean {
  return getLangVoices('bn').length > 0;
}

// ===== Realistic Acoustic Web Audio Background Engine =====
interface ActiveNodeGroup {
  g: GainNode;
  stops: (() => void)[];
}

let AC: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bgGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let roomConvolver: ConvolverNode | null = null;
let tanpuraWave: PeriodicWave | null = null;
let saturationCurve: Float32Array<ArrayBuffer> | null = null;
let pinkNoiseBuffer: AudioBuffer | null = null;
let activeGroups: ActiveNodeGroup[] = [];

function buildAcousticImpulse(ctx: AudioContext): AudioBuffer {
  const duration = 2.1;
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * duration);
  const impulse = ctx.createBuffer(2, length, rate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      // Exponential tail + soft early wooden hall reflections
      const decay = Math.exp(-t * 2.8);
      const white = Math.random() * 2 - 1;
      // Warm high-frequency damping over time
      lp = lp * 0.72 + white * 0.28;
      data[i] = lp * decay * 0.55;
    }
    // Add subtle early reflections in first 60ms
    const reflections = [0.012, 0.023, 0.037, 0.052];
    reflections.forEach((sec, idx) => {
      const sampleIdx = Math.floor((sec + ch * 0.004) * rate);
      if (sampleIdx < length) {
        data[sampleIdx] += (ch === 0 ? 0.14 : -0.14) / (idx + 1);
      }
    });
  }
  return impulse;
}

function buildTanpuraWave(ctx: AudioContext): PeriodicWave {
  // Rich harmonic series modeled after a curved jawari bridge string
  const real = new Float32Array(16);
  const imag = new Float32Array(16);
  const weights = [0, 1.0, 0.76, 0.58, 0.48, 0.42, 0.36, 0.29, 0.24, 0.19, 0.14, 0.11, 0.08, 0.06, 0.04, 0.03];
  for (let i = 1; i < 16; i++) {
    imag[i] = weights[i];
    real[i] = i % 2 === 0 ? weights[i] * 0.18 : 0;
  }
  return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
}

function buildJawariCurve(): Float32Array<ArrayBuffer> {
  const samples = 1024;
  const buffer = new ArrayBuffer(samples * 4);
  const curve = new Float32Array(buffer);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    // Gentle asymmetric warm saturation modeling the cotton jiva thread on the bridge
    curve[i] = Math.tanh(x * 1.65) + 0.06 * x * x;
  }
  return curve;
}

function getPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (pinkNoiseBuffer && pinkNoiseBuffer.sampleRate === ctx.sampleRate) {
    return pinkNoiseBuffer;
  }
  const length = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.11;
    }
  }
  pinkNoiseBuffer = buf;
  return buf;
}

export function ensureAudioEngine(state: Pick<AppState, 'mute' | 'master' | 'bgvol'>): boolean {
  const Ctor =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return false;
  if (!AC) {
    AC = new Ctor();
    masterGain = AC.createGain();
    bgGain = AC.createGain();
    analyser = AC.createAnalyser();
    analyser.fftSize = 64;

    roomConvolver = AC.createConvolver();
    roomConvolver.buffer = buildAcousticImpulse(AC);

    const dryBus = AC.createGain();
    dryBus.gain.value = 0.72;
    const wetBus = AC.createGain();
    wetBus.gain.value = 0.36;

    bgGain.connect(dryBus);
    bgGain.connect(roomConvolver);
    roomConvolver.connect(wetBus);

    dryBus.connect(masterGain);
    wetBus.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(AC.destination);

    tanpuraWave = buildTanpuraWave(AC);
    saturationCurve = buildJawariCurve();
  }
  if (AC.state === 'suspended') {
    AC.resume().catch(() => {});
  }
  updateAudioVolume(state);
  return true;
}

export function updateAudioVolume(state: Pick<AppState, 'mute' | 'master' | 'bgvol'>): void {
  if (!AC || !masterGain || !bgGain) return;
  masterGain.gain.value = state.mute ? 0 : state.master;
  bgGain.gain.value = state.bgvol * 0.38;
}

export function getBgAnalyser(): AnalyserNode | null {
  return analyser;
}

export function isBgSoundRunning(): boolean {
  return activeGroups.length > 0;
}

export function stopBgSound(immediate = false): void {
  if (!AC) {
    activeGroups = [];
    return;
  }
  const ctx = AC;
  const groups = activeGroups;
  activeGroups = [];
  groups.forEach(({ g, stops }) => {
    try {
      const now = ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(0, now + (immediate ? 0.02 : 0.45));
      setTimeout(() => {
        stops.forEach((fn) => {
          try {
            fn();
          } catch {
            // ignore
          }
        });
        try {
          g.disconnect();
        } catch {
          // ignore
        }
      }, immediate ? 40 : 520);
    } catch {
      // ignore
    }
  });
}

export function startBgSound(kind: BgSoundKind, saHz = 130.81): void {
  stopBgSound(true);
  if (!AC || !bgGain || kind === 'off' || kind === 'auto') return;

  const ctx = AC;
  const g = ctx.createGain();
  const now = ctx.currentTime;
  const stops: (() => void)[] = [];
  let disposed = false;

  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(1, now + 1.4);
  g.connect(bgGain);

  const osc = (type: OscillatorType, freq: number, vol: number, dest?: AudioNode): OscillatorNode => {
    const o = ctx.createOscillator();
    const x = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    x.gain.value = vol;
    o.connect(x);
    x.connect(dest || g);
    o.start();
    stops.push(() => o.stop());
    return o;
  };

  const lfo = (rate: number, depth: number, param: AudioParam) => {
    const o = ctx.createOscillator();
    const x = ctx.createGain();
    o.frequency.value = rate;
    x.gain.value = depth;
    o.connect(x);
    x.connect(param);
    o.start();
    stops.push(() => o.stop());
  };

  if (kind === 'tanpura') {
    // ===== Realistic Miraj/Tanjore 4-String Acoustic Tanpura Synthesis =====
    const sa = Number(saHz) || 130.81;
    const ratio = sa / 130.81;
    // Traditional 4-string tuning: Mandra Pa -> Madhya Sa (Jodi 1) -> Madhya Sa (Jodi 2) -> Kharaj Sa
    const strings = [
      { freq: 196.0 * ratio, weight: 0.72, brightPeak: 2200, sustain: 4.8 },
      { freq: 261.63 * ratio, weight: 0.68, brightPeak: 2650, sustain: 4.7 },
      { freq: 261.63 * ratio * 1.0014, weight: 0.66, brightPeak: 2500, sustain: 4.7 }, // slight natural chorus detune
      { freq: 130.81 * ratio, weight: 0.92, brightPeak: 1750, sustain: 5.5 }, // deep kharaj string
    ];
    // Humanized tempo pauses (breathing gap after Kharaj Sa)
    const stepDelaysMs = [1020, 1020, 1060, 1340];

    // Wooden Tumba gourd body resonator shared by all 4 strings
    const bodyLow = ctx.createBiquadFilter();
    bodyLow.type = 'peaking';
    bodyLow.frequency.value = 185;
    bodyLow.Q.value = 1.4;
    bodyLow.gain.value = 5.5;

    const bodyMid = ctx.createBiquadFilter();
    bodyMid.type = 'peaking';
    bodyMid.frequency.value = 430;
    bodyMid.Q.value = 1.8;
    bodyMid.gain.value = 3.5;

    const warmCutoff = ctx.createBiquadFilter();
    warmCutoff.type = 'lowpass';
    warmCutoff.frequency.value = 3400;

    bodyLow.connect(bodyMid);
    bodyMid.connect(warmCutoff);
    warmCutoff.connect(g);

    const pluckString = (strIdx: number) => {
      if (!AC || disposed) return;
      const spec = strings[strIdx % 4];
      const t0 = ctx.currentTime;

      // Dynamic jawari bridge filter: blooms upwards ~0.45s after pluck, then settles smoothly
      const jawariFilter = ctx.createBiquadFilter();
      jawariFilter.type = 'lowpass';
      jawariFilter.Q.value = 2.6;
      jawariFilter.frequency.setValueAtTime(340, t0);
      jawariFilter.frequency.exponentialRampToValueAtTime(spec.brightPeak, t0 + 0.42);
      jawariFilter.frequency.exponentialRampToValueAtTime(520, t0 + spec.sustain * 0.88);

      // Subtle nonlinear bridge shimmer (jiva buzz)
      const shaper = ctx.createWaveShaper();
      if (saturationCurve) shaper.curve = saturationCurve;

      // String amplitude envelope (soft finger release -> sustain bloom -> long acoustic decay)
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.linearRampToValueAtTime(0.42 * spec.weight, t0 + 0.065);
      env.gain.setValueAtTime(0.42 * spec.weight, t0 + 0.25);
      env.gain.exponentialRampToValueAtTime(0.001, t0 + spec.sustain);

      shaper.connect(jawariFilter);
      jawariFilter.connect(env);
      env.connect(bodyLow);

      // Main harmonic string oscillator (PeriodicWave)
      const mainOsc = ctx.createOscillator();
      if (tanpuraWave) {
        mainOsc.setPeriodicWave(tanpuraWave);
      } else {
        mainOsc.type = 'sawtooth';
      }
      mainOsc.frequency.setValueAtTime(spec.freq * 1.003, t0);
      mainOsc.frequency.exponentialRampToValueAtTime(spec.freq, t0 + 0.09); // natural pluck pitch settle
      const mainGain = ctx.createGain();
      mainGain.gain.value = 0.72;
      mainOsc.connect(mainGain);
      mainGain.connect(shaper);
      mainOsc.start(t0);
      mainOsc.stop(t0 + spec.sustain + 0.1);

      // Sympathetic upper octave harmonic bloom
      const harmOsc = ctx.createOscillator();
      harmOsc.type = 'triangle';
      harmOsc.frequency.value = spec.freq * 2.0007;
      const harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime(0.001, t0);
      harmGain.gain.linearRampToValueAtTime(0.24 * spec.weight, t0 + 0.48);
      harmGain.gain.exponentialRampToValueAtTime(0.001, t0 + spec.sustain * 0.9);
      harmOsc.connect(harmGain);
      harmGain.connect(jawariFilter);
      harmOsc.start(t0);
      harmOsc.stop(t0 + spec.sustain + 0.1);

      // Soft fingertip attack transient (barely audible organic pluck texture)
      const transientSrc = ctx.createBufferSource();
      transientSrc.buffer = getPinkNoiseBuffer(ctx);
      const transientFilter = ctx.createBiquadFilter();
      transientFilter.type = 'bandpass';
      transientFilter.frequency.value = Math.min(2400, spec.freq * 5);
      transientFilter.Q.value = 2.0;
      const transientGain = ctx.createGain();
      transientGain.gain.setValueAtTime(0.08 * spec.weight, t0);
      transientGain.gain.exponentialRampToValueAtTime(0.0005, t0 + 0.032);
      transientSrc.connect(transientFilter);
      transientFilter.connect(transientGain);
      transientGain.connect(bodyLow);
      transientSrc.start(t0);
      transientSrc.stop(t0 + 0.04);
    };

    let idx = 0;
    let nextTimer = 0;
    const scheduleNext = () => {
      if (disposed || !AC) return;
      const currentIdx = idx % 4;
      pluckString(currentIdx);
      const jitter = (Math.random() - 0.5) * 28; // natural human rubato ±14ms
      const delay = stepDelaysMs[currentIdx] + jitter;
      idx += 1;
      nextTimer = window.setTimeout(scheduleNext, delay);
    };
    scheduleNext();
    stops.push(() => {
      disposed = true;
      window.clearTimeout(nextTimer);
    });
  } else if (kind === 'ambient') {
    // ===== Warm Harmonic Pad with Organic Acoustic Breathing =====
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 720;
    padFilter.Q.value = 0.8;
    padFilter.connect(g);
    lfo(0.055, 280, padFilter.frequency);

    const sa = Number(saHz) || 130.81;
    // Root, Fifth, Octave, Warm 9th with subtle chorus detune
    const notes = [
      [sa, 0.36],
      [sa * 1.003, 0.24],
      [sa * 1.5, 0.28],
      [sa * 2.0, 0.2],
      [sa * 2.25, 0.1],
    ];
    notes.forEach(([freq, vol], idx) => {
      const o = osc(idx % 2 === 0 ? 'triangle' : 'sine', freq, vol, padFilter);
      lfo(0.03 + idx * 0.012, 0.35, o.detune);
    });
  } else if (kind === 'drone') {
    // ===== Warm Shruti-Box / Harmonium & Bowed Bass Drone =====
    const formant1 = ctx.createBiquadFilter();
    formant1.type = 'lowpass';
    formant1.frequency.value = 540;
    formant1.Q.value = 1.1;

    const chestBoost = ctx.createBiquadFilter();
    chestBoost.type = 'peaking';
    chestBoost.frequency.value = 160;
    chestBoost.gain.value = 4.5;

    formant1.connect(chestBoost);
    chestBoost.connect(g);

    const sa = Number(saHz) || 130.81;
    const reed1 = osc('sawtooth', sa * 0.5, 0.26, formant1);
    const reed2 = osc('sawtooth', sa * 0.5015, 0.24, formant1);
    osc('triangle', sa, 0.3, formant1);
    osc('sine', sa * 1.5, 0.18, formant1);
    lfo(0.08, 95, formant1.frequency); // subtle bellows swell
    lfo(0.04, 1.5, reed1.detune);
    lfo(0.05, 1.5, reed2.detune);
  } else if (kind === 'om') {
    // ===== Realistic Resonant Vocal OM + Singing Bowl Overtones =====
    const fChest = ctx.createBiquadFilter();
    fChest.type = 'bandpass';
    fChest.frequency.value = 280;
    fChest.Q.value = 1.3;

    const fThroat = ctx.createBiquadFilter();
    fThroat.type = 'bandpass';
    fThroat.frequency.value = 620;
    fThroat.Q.value = 2.0;

    const mix = ctx.createGain();
    mix.gain.value = 0.85;
    fChest.connect(mix);
    fThroat.connect(mix);
    mix.connect(g);

    // 136.1 Hz traditional OM fundamental + sub octave + chorus
    osc('sawtooth', 136.1, 0.25, fChest);
    osc('sawtooth', 136.5, 0.2, fThroat);
    osc('sine', 68.05, 0.38, g);
    const a = osc('sine', 136.1, 0.35, g);
    osc('sine', 272.2, 0.14, fThroat);
    osc('sine', 408.3, 0.08, fThroat);

    const swell = ctx.createGain();
    swell.gain.value = 0.15;
    a.connect(swell);
    lfo(0.06, 90, fThroat.frequency);
  } else if (kind === 'breath') {
    // ===== Natural Ocean-Breath + Soft Singing Bowl Guide (10s cycle) =====
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = getPinkNoiseBuffer(ctx);
    noiseSrc.loop = true;

    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.value = 460;
    airFilter.Q.value = 0.85;

    const airGain = ctx.createGain();
    airGain.gain.value = 0.42;

    noiseSrc.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(g);
    noiseSrc.start();
    stops.push(() => noiseSrc.stop());

    // Calm 0.1 Hz (10s) breathing envelope across air and warm bowl tone
    lfo(0.1, 240, airFilter.frequency);
    lfo(0.1, 0.22, airGain.gain);

    const bowlFilter = ctx.createBiquadFilter();
    bowlFilter.type = 'lowpass';
    bowlFilter.frequency.value = 650;
    bowlFilter.connect(g);
    const bowl = osc('sine', 136.1, 0.22, bowlFilter);
    osc('sine', 272.2, 0.08, bowlFilter);
    lfo(0.1, 0.1, bowl.detune);
  } else if (kind === 'nature') {
    // ===== Realistic Flowing Stream & Soft Forest Breeze (Pink Noise + Multi-Band) =====
    const streamSrc = ctx.createBufferSource();
    streamSrc.buffer = getPinkNoiseBuffer(ctx);
    streamSrc.loop = true;

    // Warm water stream body
    const waterLP = ctx.createBiquadFilter();
    waterLP.type = 'lowpass';
    waterLP.frequency.value = 780;
    waterLP.Q.value = 0.65;

    const waterGain = ctx.createGain();
    waterGain.gain.value = 0.55;

    streamSrc.connect(waterLP);
    waterLP.connect(waterGain);
    waterGain.connect(g);
    streamSrc.start();
    stops.push(() => streamSrc.stop());

    // Gentle wind through leaves sweeping independently
    const breezeSrc = ctx.createBufferSource();
    breezeSrc.buffer = getPinkNoiseBuffer(ctx);
    breezeSrc.loop = true;

    const breezeBP = ctx.createBiquadFilter();
    breezeBP.type = 'bandpass';
    breezeBP.frequency.value = 520;
    breezeBP.Q.value = 1.3;

    const breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.34;

    breezeSrc.connect(breezeBP);
    breezeBP.connect(breezeGain);
    breezeGain.connect(g);
    breezeSrc.start(0, 1.3);
    stops.push(() => breezeSrc.stop());

    lfo(0.075, 220, breezeBP.frequency);
    lfo(0.11, 0.12, breezeGain.gain);
    lfo(0.045, 160, waterLP.frequency);
  }

  activeGroups.push({ g, stops });
}

export type { VoiceGender };
