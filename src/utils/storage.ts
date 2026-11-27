import type { AppState, Lang, SessionStep } from '../types/studio';

export const STORAGE_KEY = 'vws1_v11';
export const LEGACY_STORAGE_KEY = 'vws1_v1';

export function defState(): AppState {
  return {
    lang: 'bn',
    theme: 'dark',
    gender: 'any',
    voice: '',
    rate: 0.85,
    pitch: 1,
    vvol: 1,
    bg: 'ambient',
    bgvol: 0.5,
    master: 0.8,
    mute: false,
    fav: [],
    hist: [],
    days: {},
    sessions: 0,
    remOn: false,
    rem: '07:00',
    goal: 10,
    sa: 130.81,
    rd: {},
    last: null,
    tw: { fav: [], done: {} },
    challenge7: { doneDays: [], lastDayCompletedAt: {} },
  };
}

export function loadState(): AppState {
  try {
    const fresh = localStorage.getItem(STORAGE_KEY);
    if (fresh) {
      const parsed = JSON.parse(fresh) || {};
      return {
        ...defState(),
        ...parsed,
        challenge7: {
          doneDays: [],
          lastDayCompletedAt: {},
          ...(parsed.challenge7 || {}),
        },
      };
    }
    const old = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (old) return { ...defState(), ...(JSON.parse(old) || {}) };
  } catch {
    // ignore storage parse failure
  }
  return defState();
}

export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    localStorage.setItem('vws_t', '1');
    localStorage.removeItem('vws_t');
    return true;
  } catch {
    return false;
  }
}

export const dk = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayMin = (state: AppState): number => state.days[dk()] || 0;

export const totalMin = (state: AppState): number =>
  Object.values(state.days).reduce((acc, v) => acc + v, 0);

export function getStreak(state: AppState): number {
  let count = 0;
  const d = new Date();
  if (!state.days[dk(d)]) {
    d.setDate(d.getDate() - 1);
  }
  while ((state.days[dk(d)] || 0) > 0) {
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export const formatNum = (val: string | number, lang: Lang): string =>
  lang === 'bn' ? String(val).replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : String(val);

export const tr = (lang: Lang, bn: string, en: string): string => (lang === 'bn' ? bn : en);

export const sanitizeSteps = (steps: [string, number][], validIds: Set<string>): SessionStep[] =>
  steps
    .filter(([id]) => validIds.has(id))
    .map(([id, d]) => ({ id, d }));
