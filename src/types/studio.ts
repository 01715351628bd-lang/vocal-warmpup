export type Lang = 'bn' | 'en';
export type Theme = 'dark' | 'light';
export type VoiceGender = 'any' | 'f' | 'm';
export type BgSoundKind = 'auto' | 'ambient' | 'tanpura' | 'drone' | 'nature' | 'breath' | 'om' | 'off';
export type ExLevel = 'B' | 'I' | 'A';
export type AppView = 'home' | 'ex' | 'rt' | 'studio' | 'promito' | 'tw' | 'poetry' | 'pg' | 'set' | 'about';

export interface Exercise {
  id: string;
  c: string;
  bn: string;
  en: string;
  l: ExLevel;
  d: number;
  a: BgSoundKind;
  lg?: 'bn' | 'en';
  ob: [string, string];
  st: [string[], string[]];
}

export interface RoutineDef {
  n: [string, string];
  i: [string, number][];
}

export interface SessionStep {
  id: string;
  d: number;
}

export interface SessionHistoryItem {
  ts: number;
  ids: string[];
  sec: number;
  name: string;
}

export interface TwisterItem {
  id: string;
  l: 'bn' | 'en';
  v: 1 | 2 | 3;
  g?: 1;
  f: string;
  x: string;
}

export interface PoetryWord {
  w: string;
  s: string[];
  p: string;
  h: string;
  tip: string;
}

export interface ChallengeCycleRecord {
  id: string;
  startedAt?: number;
  completedAt: number;
  daysCompleted: number;
}

export interface Challenge7Progress {
  startedAt?: number;
  doneDays: number[];
  lastDayCompletedAt?: Record<number, number>;
  completedCycles?: ChallengeCycleRecord[];
  cycleArchived?: boolean;
}

export interface AppState {
  lang: Lang;
  theme: Theme;
  gender: VoiceGender;
  voice: string;
  rate: number;
  pitch: number;
  vvol: number;
  bg: BgSoundKind;
  bgvol: number;
  master: number;
  mute: boolean;
  fav: string[];
  hist: SessionHistoryItem[];
  days: Record<string, number>;
  sessions: number;
  remOn: boolean;
  rem: string;
  goal?: number;
  sa?: number;
  rd: Record<string, [string, number][]>;
  last: { list: SessionStep[]; name: string } | null;
  tw: {
    fav: string[];
    done: Record<string, number>;
  };
  challenge7?: Challenge7Progress;
}

export interface RecordedTake {
  id: number;
  blob: Blob;
  duration: number;
  created: number;
  type: string;
  label: string;
  note: string;
  avgPitchHz?: number;
  dominantNote?: string;
}

export interface PitchReading {
  hz: number | null;
  note: string;
  sargam: string;
  cents: number;
  confidence: number;
  rms: number;
}

export interface StudioPrefill {
  title: string;
  note: string;
  promptText: string;
}
