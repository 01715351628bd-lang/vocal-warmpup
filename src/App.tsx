import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { AudioLines, BarChart3, Clock, Home, Languages, Mic, Settings, X } from 'lucide-react';
import { AboutView } from './components/AboutView';
import { ExerciseFigure } from './components/ExerciseFigure';
import { ExercisesView } from './components/ExercisesView';
import { HomeView } from './components/HomeView';
import { PlayerOverlay, type ActiveSession } from './components/PlayerOverlay';
import { PoetryLabView } from './components/PoetryLabView';
import { ProgressView } from './components/ProgressView';
import { PromitoView } from './components/PromitoView';
import { RoutinesView } from './components/RoutinesView';
import { SettingsView } from './components/SettingsView';
import { StudioView } from './components/StudioView';
import { TongueTwistersView } from './components/TongueTwistersView';
import { EX_MAP, ROUTINES, VALID_EX_IDS } from './data/exercises';
import type { AppState, AppView, SessionStep, StudioPrefill } from './types/studio';
import { subscribeVoices } from './utils/audioEngine';
import {
  defState,
  dk,
  isLocalStorageAvailable,
  loadState,
  sanitizeSteps,
  saveState,
  tr,
} from './utils/storage';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<AppView>('home');
  const [exCategory, setExCategory] = useState<string>('all');
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [zoomExId, setZoomExId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [studioPrefill, setStudioPrefill] = useState<StudioPrefill | null>(null);
  const [, setVoiceTick] = useState(0);

  const toastTimerRef = useRef<number>(0);
  const viewRef = useRef<AppView>(view);
  const activeSessionRef = useRef<ActiveSession | null>(activeSession);
  const zoomExIdRef = useRef<string | null>(zoomExId);
  const activeChallengeDayRef = useRef<number | null>(null);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    zoomExIdRef.current = zoomExId;
  }, [zoomExId]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(''), 2800);
  }, []);

  // Sync theme, document lang, meta theme-color, and localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.classList.toggle('dark', state.theme === 'dark');
    root.lang = state.lang;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', state.theme === 'light' ? '#f1f2fb' : '#080c1c');
    }
    saveState(state);
  }, [state]);

  // Check localStorage availability once on mount
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      showToast('LocalStorage unavailable: progress will not be saved.');
    }
    return subscribeVoices(() => setVoiceTick((v) => v + 1));
  }, [showToast]);

  // Escape closes Lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomExId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const updateState = useCallback((patch: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const navigate = useCallback((nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Android hardware back button handling
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let handlePromise = CapacitorApp.addListener('backButton', () => {
      if (zoomExIdRef.current) {
        setZoomExId(null);
        return;
      }
      if (activeSessionRef.current) {
        setActiveSession(null);
        return;
      }
      const cur = viewRef.current;
      if (cur === 'tw') {
        navigate('ex');
      } else if (cur === 'poetry') {
        navigate('studio');
      } else if (cur === 'about') {
        navigate('set');
      } else if (cur !== 'home') {
        navigate('home');
      } else {
        CapacitorApp.exitApp();
      }
    });
    return () => {
      handlePromise.then((h) => h.remove()).catch(() => {});
    };
  }, [navigate]);

  const startPracticeSession = useCallback(
    (list: SessionStep[], name: string) => {
      const valid = list.filter((s) => VALID_EX_IDS.has(s.id));
      if (!valid.length) return;
      setState((prev) => ({ ...prev, last: { list: valid, name } }));
      setActiveSession({ list: valid, name });
    },
    []
  );

  const handleStartChallengeDay = useCallback(
    (dayNum: number, steps: SessionStep[], title: string) => {
      activeChallengeDayRef.current = dayNum;
      startPracticeSession(steps, title);
    },
    [startPracticeSession]
  );

  const handleToggleChallengeDay = useCallback(
    (dayNum: number) => {
      setState((prev) => {
        const current = prev.challenge7 || { doneDays: [], lastDayCompletedAt: {}, completedCycles: [], cycleArchived: false };
        const exists = current.doneDays.includes(dayNum);
        const nextDays = exists
          ? current.doneDays.filter((d) => d !== dayNum)
          : [...current.doneDays, dayNum].sort((a, b) => a - b);
        const nextTimestamps = { ...(current.lastDayCompletedAt || {}) };
        if (!exists) {
          nextTimestamps[dayNum] = Date.now();
        } else {
          delete nextTimestamps[dayNum];
        }
        const prevCycles = current.completedCycles || [];
        const shouldArchive = nextDays.length === 7 && !current.cycleArchived;
        const nextCycles = shouldArchive
          ? [
              {
                id: `${Date.now()}-${prevCycles.length + 1}`,
                startedAt: current.startedAt || Date.now(),
                completedAt: Date.now(),
                daysCompleted: 7,
              },
              ...prevCycles,
            ].slice(0, 30)
          : prevCycles;
        return {
          ...prev,
          challenge7: {
            startedAt: current.startedAt || Date.now(),
            doneDays: nextDays,
            lastDayCompletedAt: nextTimestamps,
            completedCycles: nextCycles,
            cycleArchived: shouldArchive ? true : current.cycleArchived,
          },
        };
      });
    },
    []
  );

  const handleResetChallenge = useCallback(() => {
    setState((prev) => ({
      ...prev,
      challenge7: {
        doneDays: [],
        lastDayCompletedAt: {},
        completedCycles: prev.challenge7?.completedCycles || [],
        cycleArchived: false,
      },
    }));
    showToast(tr(state.lang, 'নতুন ৭ দিনের চ্যালেঞ্জ শুরু হয়েছে', 'New 7-day challenge cycle ready'));
  }, [showToast, state.lang]);

  const startRoutineById = useCallback(
    (routineId: string) => {
      activeChallengeDayRef.current = null;
      const rt = ROUTINES[routineId];
      if (!rt) return;
      const rawSteps = state.rd[routineId] || rt.i;
      const list = sanitizeSteps(rawSteps, VALID_EX_IDS);
      const name = rt.n[state.lang === 'bn' ? 0 : 1];
      startPracticeSession(list, name);
    },
    [state.lang, state.rd, startPracticeSession]
  );

  const handleCompleteSession = useCallback(
    (spentSec: number, doneIds: string[], completed: boolean) => {
      if (spentSec < 10) return;
      const minsAdded = Math.round(spentSec / 6) / 10;
      const todayKey = dk();
      const sessionName = activeSession?.name || '';
      const challengeDay = completed ? activeChallengeDayRef.current : null;

      setState((prev) => {
        let nextChallenge = prev.challenge7;
        if (challengeDay !== null) {
          const curC = prev.challenge7 || { doneDays: [], lastDayCompletedAt: {}, completedCycles: [], cycleArchived: false };
          const nextDone = curC.doneDays.includes(challengeDay)
            ? curC.doneDays
            : [...curC.doneDays, challengeDay].sort((a, b) => a - b);
          const prevCycles = curC.completedCycles || [];
          const shouldArchive = nextDone.length === 7 && !curC.cycleArchived;
          const nextCycles = shouldArchive
            ? [
                {
                  id: `${Date.now()}-${prevCycles.length + 1}`,
                  startedAt: curC.startedAt || Date.now(),
                  completedAt: Date.now(),
                  daysCompleted: 7,
                },
                ...prevCycles,
              ].slice(0, 30)
            : prevCycles;
          nextChallenge = {
            startedAt: curC.startedAt || Date.now(),
            doneDays: nextDone,
            lastDayCompletedAt: {
              ...(curC.lastDayCompletedAt || {}),
              [challengeDay]: Date.now(),
            },
            completedCycles: nextCycles,
            cycleArchived: shouldArchive ? true : curC.cycleArchived,
          };
        }
        return {
          ...prev,
          days: {
            ...prev.days,
            [todayKey]: Math.round(((prev.days[todayKey] || 0) + minsAdded) * 10) / 10,
          },
          hist: [
            { ts: Date.now(), ids: doneIds, sec: Math.round(spentSec), name: sessionName },
            ...prev.hist,
          ].slice(0, 100),
          sessions: completed ? prev.sessions + 1 : prev.sessions,
          challenge7: nextChallenge,
        };
      });

      if (challengeDay !== null) {
        activeChallengeDayRef.current = null;
        showToast(
          tr(
            state.lang,
            `৭ দিনের চ্যালেঞ্জ — দিন ${challengeDay} সম্পন্ন হয়েছে!`,
            `7-Day Challenge — Day ${challengeDay} complete!`
          )
        );
      }
    },
    [activeSession, showToast, state.lang]
  );

  const handleToggleFav = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      fav: prev.fav.includes(id) ? prev.fav.filter((x) => x !== id) : [...prev.fav, id],
    }));
  }, []);

  const handleToggleTwFav = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tw: {
        ...prev.tw,
        fav: prev.tw.fav.includes(id)
          ? prev.tw.fav.filter((x) => x !== id)
          : [...prev.tw.fav, id],
      },
    }));
  }, []);

  const handleMarkTwDone = useCallback((id: string, addMinutes = 0) => {
    const todayKey = dk();
    setState((prev) => ({
      ...prev,
      days: addMinutes
        ? {
            ...prev.days,
            [todayKey]: Math.round(((prev.days[todayKey] || 0) + addMinutes) * 10) / 10,
          }
        : prev.days,
      tw: {
        ...prev.tw,
        done: { ...prev.tw.done, [id]: (prev.tw.done[id] || 0) + 1 },
      },
    }));
  }, []);

  const handleRecordPromptInStudio = useCallback((prefill: StudioPrefill) => {
    setStudioPrefill(prefill);
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleResetAll = useCallback(() => {
    const fresh = defState();
    setState(fresh);
    showToast(tr(fresh.lang, 'রিসেট হয়েছে', 'Reset done'));
  }, [showToast]);

  const lang = state.lang;
  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: tr(lang, 'হোম', 'Home'), icon: <Home className="w-5 h-5" /> },
    { id: 'ex', label: tr(lang, 'অনুশীলন', 'Exercises'), icon: <AudioLines className="w-5 h-5" /> },
    { id: 'rt', label: tr(lang, 'রুটিন', 'Routine'), icon: <Clock className="w-5 h-5" /> },
    { id: 'studio', label: tr(lang, 'স্টুডিও', 'Studio'), icon: <Mic className="w-5 h-5" /> },
    { id: 'promito', label: tr(lang, 'প্রমিত উচ্চারণ', 'Diction'), icon: <Languages className="w-5 h-5" /> },
    { id: 'pg', label: tr(lang, 'অগ্রগতি', 'Progress'), icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'set', label: tr(lang, 'সেটিংস', 'Settings'), icon: <Settings className="w-5 h-5" /> },
  ];

  const isNavActive = (id: AppView) =>
    view === id ||
    ((view === 'tw' || view === 'poetry') && id === 'ex') ||
    (view === 'about' && id === 'set');

  const zoomEx = zoomExId ? EX_MAP[zoomExId] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Responsive Canvas */}
      <main className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 pt-[max(18px,env(safe-area-inset-top))] pb-[calc(104px+env(safe-area-inset-bottom))] flex-1">
        {view === 'home' && (
          <HomeView
            state={state}
            onStartRoutine={startRoutineById}
            onContinueLast={startPracticeSession}
            onSelectCategory={(cat) => {
              setExCategory(cat);
              navigate('ex');
            }}
            onOpenTwisters={() => navigate('tw')}
            onOpenPoetry={() => navigate('poetry')}
            onOpenStudio={() => navigate('studio')}
            onOpenAbout={() => navigate('about')}
            onStartChallengeDay={handleStartChallengeDay}
            onToggleChallengeDay={handleToggleChallengeDay}
            onResetChallenge={handleResetChallenge}
            onRecordBaseline={handleRecordPromptInStudio}
          />
        )}

        {view === 'ex' && (
          <ExercisesView
            state={state}
            category={exCategory}
            onCategoryChange={setExCategory}
            onToggleFav={handleToggleFav}
            onStartExercise={startPracticeSession}
            onOpenTwisters={() => navigate('tw')}
            onOpenPoetry={() => navigate('poetry')}
            onZoomImage={(id) => setZoomExId(id)}
          />
        )}

        {view === 'rt' && (
          <RoutinesView
            state={state}
            onUpdateRoutines={(rd) => updateState({ rd })}
            onStartRoutine={startRoutineById}
            onStartChallengeDay={handleStartChallengeDay}
            onToggleChallengeDay={handleToggleChallengeDay}
            onResetChallenge={handleResetChallenge}
            onRecordBaseline={handleRecordPromptInStudio}
            onToast={showToast}
          />
        )}

        {view === 'studio' && (
          <StudioView
            state={state}
            prefill={studioPrefill}
            onClearPrefill={() => setStudioPrefill(null)}
            onOpenPoetry={() => navigate('poetry')}
            onOpenPromito={() => navigate('promito')}
            onToast={showToast}
          />
        )}

        {view === 'promito' && (
          <PromitoView
            state={state}
            onBack={() => navigate('studio')}
            onRecordPrompt={handleRecordPromptInStudio}
          />
        )}

        {view === 'tw' && (
          <TongueTwistersView
            state={state}
            onBack={() => navigate('ex')}
            onToggleTwFav={handleToggleTwFav}
            onMarkTwDone={handleMarkTwDone}
            onStartTwSession={startPracticeSession}
            onRecordPrompt={handleRecordPromptInStudio}
            onToast={showToast}
          />
        )}

        {view === 'poetry' && (
          <PoetryLabView
            state={state}
            onBack={() => navigate('studio')}
            onRecordPrompt={handleRecordPromptInStudio}
          />
        )}

        {view === 'pg' && (
          <ProgressView
            state={state}
            onStartChallengeDay={handleStartChallengeDay}
            onToggleChallengeDay={handleToggleChallengeDay}
            onResetChallenge={handleResetChallenge}
          />
        )}

        {view === 'set' && (
          <SettingsView
            state={state}
            onUpdate={updateState}
            onResetAll={handleResetAll}
            onOpenAbout={() => navigate('about')}
            onToast={showToast}
          />
        )}

        {view === 'about' && (
          <AboutView lang={lang} onBack={() => navigate('set')} onToast={showToast} />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <nav
        aria-label={tr(lang, 'মূল নেভিগেশন', 'Main navigation')}
        className="fixed left-1/2 -translate-x-1/2 bottom-[calc(10px+env(safe-area-inset-bottom))] w-[min(690px,calc(100%-16px))] z-40 flex gap-0.5 sm:gap-1 p-1.5 rounded-[26px] border border-[var(--bd)] shadow-2xl"
        style={{
          background: 'color-mix(in srgb, var(--card) 84%, transparent)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        }}
      >
        {navItems.map((item) => {
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 min-h-[54px] min-w-0 border-0 rounded-[20px] flex flex-col items-center justify-center gap-0.5 text-[9.5px] sm:text-[11px] px-0.5 sm:px-1 cursor-pointer transition-all ${
                active
                  ? 'studio-btn-pri font-bold'
                  : 'bg-transparent text-[var(--mu)] hover:text-[var(--tx)] font-medium'
              }`}
            >
              {item.icon}
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Practice Session Player Overlay */}
      {activeSession && (
        <PlayerOverlay
          session={activeSession}
          state={state}
          onUpdateState={updateState}
          onCompleteSession={handleCompleteSession}
          onClose={() => {
            activeChallengeDayRef.current = null;
            setActiveSession(null);
          }}
          onToast={showToast}
          onZoomImage={(id) => setZoomExId(id)}
        />
      )}

      {/* Illustration Lightbox */}
      {zoomEx && (
        <div
          className="fixed inset-0 z-[70] bg-[#050812]/92 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomExId(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-3">
            <ExerciseFigure exercise={zoomEx} lang={lang} size="lg" />
            <p className="text-[#eef0fb] font-semibold text-center m-0 text-sm sm:text-base">
              {lang === 'bn' ? zoomEx.bn : zoomEx.en} · {lang === 'bn' ? zoomEx.en : zoomEx.bn}
            </p>
            <button
              type="button"
              onClick={() => setZoomExId(null)}
              className="studio-btn-pri min-h-[46px] px-6 rounded-2xl inline-flex items-center gap-2 text-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>{tr(lang, 'বন্ধ করুন', 'Close')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-[calc(88px+env(safe-area-inset-bottom))] z-[80] max-w-[calc(100%-28px)] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-[#05261b] text-center shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #3de0b5, #2bbf95)',
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
