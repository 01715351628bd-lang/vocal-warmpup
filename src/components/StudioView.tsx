import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Camera,
  CameraOff,
  Check,
  Download,
  Edit3,
  Mic,
  MicOff,
  Pause,
  Play,
  RefreshCw,
  ScrollText,
  Share2,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { POETRY_SAMPLE_LINE, POETRY_WORDS, TW } from '../data/exercises';
import type { AppState, PitchReading, RecordedTake, StudioPrefill } from '../types/studio';
import { ensureAudioEngine, startBgSound, stopBgSound } from '../utils/audioEngine';
import { analyzeFrame, hzToNoteInfo } from '../utils/pitchDetector';
import {
  deleteTake,
  downloadTakeAsFormat,
  getTake,
  getTakes,
  saveTake,
  shareTakeAudioFile,
  updateTakeMeta,
} from '../utils/recordingDb';
import { formatNum, tr } from '../utils/storage';
import { BreathingOverlay } from './BreathingOverlay';
import { ShareTakeModal } from './ShareTakeModal';
import { VoiceSafetyCard } from './VoiceSafetyCard';

interface StudioViewProps {
  state: AppState;
  prefill: StudioPrefill | null;
  onClearPrefill: () => void;
  onOpenPoetry: () => void;
  onToast: (msg: string) => void;
}

const REC_STATES = ['idle', 'recording', 'paused'] as const;
type RecState = (typeof REC_STATES)[number];

export const StudioView: React.FC<StudioViewProps> = ({
  state,
  prefill,
  onClearPrefill,
  onOpenPoetry,
  onToast,
}) => {
  const lang = state.lang;
  const saHz = Number(state.sa) || 130.81;

  // Mic & pitch state
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string>('');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [pitch, setPitch] = useState<PitchReading>({
    hz: null,
    note: '—',
    sargam: '—',
    cents: 0,
    confidence: 0,
    rms: 0,
  });

  // Recorder state
  const [recState, setRecState] = useState<RecState>('idle');
  const [recElapsed, setRecElapsed] = useState(0);
  const [recTitle, setRecTitle] = useState('');
  const [recNote, setRecNote] = useState('');
  const [promptText, setPromptText] = useState(POETRY_SAMPLE_LINE);
  const [tanpuraPreview, setTanpuraPreview] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(tr(lang, 'ক্যামেরা চালু করতে চাপুন।', 'Tap to start camera.'));

  // Takes library state
  const [takes, setTakes] = useState<RecordedTake[]>([]);
  const [takesLoading, setTakesLoading] = useState(true);
  const [takesError, setTakesError] = useState('');
  const [compareA, setCompareA] = useState<string>('');
  const [compareB, setCompareB] = useState<string>('');
  const [nowPlayingLabel, setNowPlayingLabel] = useState('');
  const [shareTarget, setShareTarget] = useState<RecordedTake | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecordedTake | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');

  // Hardware & Web API refs
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pitchRafRef = useRef<number>(0);
  const lastHzRef = useRef<number | null>(null);
  const pitchHistoryRef = useRef<(number | null)[]>([]);
  const recPitchSamplesRef = useRef<number[]>([]);
  const pitchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveBarRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const waveSmoothedRef = useRef<Float32Array>(new Float32Array(28));
  const waveLevelTextRef = useRef<HTMLSpanElement | null>(null);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const recChunksRef = useRef<Blob[]>([]);
  const recStartedAtRef = useRef<number>(0);
  const recBaseSecRef = useRef<number>(0);
  const recTimerRef = useRef<number>(0);
  const recMetaRef = useRef<{ label: string; note: string }>({ label: '', note: '' });
  const recStateRef = useRef<RecState>('idle');

  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Apply prefill from Poetry Lab or Tongue Twisters
  useEffect(() => {
    if (prefill) {
      setRecTitle(prefill.title);
      setRecNote(prefill.note);
      setPromptText(prefill.promptText);
      onClearPrefill();
    }
  }, [prefill, onClearPrefill]);

  const refreshDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const list = await navigator.mediaDevices.enumerateDevices();
      setAudioDevices(list.filter((d) => d.kind === 'audioinput'));
    } catch {
      // ignore enumeration failures
    }
  }, []);

  const loadTakes = useCallback(async () => {
    setTakesLoading(true);
    setTakesError('');
    try {
      const list = await getTakes();
      setTakes(list);
      if (list.length > 0) {
        setCompareA((prev) => (list.some((x) => String(x.id) === prev) ? prev : String(list[0].id)));
        setCompareB((prev) =>
          list.some((x) => String(x.id) === prev) ? prev : String(list[1]?.id ?? list[0].id)
        );
      }
    } catch {
      setTakesError(
        tr(lang, 'এই ব্রাউজারে রেকর্ডিং লাইব্রেরি সমর্থিত নয়।', 'Recording library is unavailable in this browser.')
      );
    } finally {
      setTakesLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadTakes();
    refreshDevices();
    const handler = () => refreshDevices();
    navigator.mediaDevices?.addEventListener?.('devicechange', handler);
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', handler);
    };
  }, [loadTakes, refreshDevices]);

  const resetWaveMeter = useCallback(() => {
    waveSmoothedRef.current.fill(0);
    waveBarRefs.current.forEach((bar) => {
      if (bar) {
        bar.style.height = '14%';
        bar.style.opacity = '0.38';
      }
    });
    if (waveLevelTextRef.current) {
      waveLevelTextRef.current.textContent = '0%';
    }
  }, []);

  const stopPitchMonitor = useCallback(() => {
    if (pitchRafRef.current) {
      cancelAnimationFrame(pitchRafRef.current);
      pitchRafRef.current = 0;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    lastHzRef.current = null;
    pitchHistoryRef.current = [];
    resetWaveMeter();
    setPitch({ hz: null, note: '—', sargam: '—', cents: 0, confidence: 0, rms: 0 });
  }, [resetWaveMeter]);

  const releaseAllMic = useCallback(() => {
    stopPitchMonitor();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setMicActive(false);
  }, [stopPitchMonitor]);

  const releaseCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraStatus(tr(lang, 'ক্যামেরা বন্ধ আছে', 'Camera is off'));
  }, [lang]);

  const stopRecording = useCallback(() => {
    if (recTimerRef.current) {
      window.clearInterval(recTimerRef.current);
      recTimerRef.current = 0;
    }
    const rec = mediaRecRef.current;
    if (rec && rec.state !== 'inactive') {
      try {
        rec.stop();
      } catch {
        // ignore stop race
      }
    }
  }, []);

  // Cleanup everything on unmount or visibility hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (mediaRecRef.current && mediaRecRef.current.state === 'recording') {
          stopRecording();
        }
        releaseAllMic();
        releaseCamera();
        stopBgSound(true);
        setTanpuraPreview(false);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') {
        try {
          mediaRecRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (recTimerRef.current) window.clearInterval(recTimerRef.current);
      releaseAllMic();
      releaseCamera();
      stopBgSound(true);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [releaseAllMic, releaseCamera, stopRecording]);

  const acquireMicStream = async (deviceIdOverride?: string): Promise<MediaStream> => {
    if (!window.isSecureContext && !['https:', 'file:'].includes(location.protocol) && location.hostname !== 'localhost') {
      throw new Error(
        tr(lang, 'নিরাপদ HTTPS সংযোগ নেই। অ্যাপটি HTTPS ঠিকানা থেকে খুলুন।', 'Secure HTTPS origin required for microphone.')
      );
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        tr(
          lang,
          'এই ব্রাউজার/WebView-তে Microphone API নেই। Chrome/WebView আপডেট করুন এবং HTTPS ব্যবহার করুন।',
          'Microphone API unavailable in this browser/WebView. Use HTTPS and an updated browser.'
        )
      );
    }
    const devId = deviceIdOverride !== undefined ? deviceIdOverride : selectedDeviceId;
    const baseConstraints: MediaTrackConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      ...(devId ? { deviceId: { exact: devId } } : {}),
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: baseConstraints });
      refreshDevices();
      return stream;
    } catch (firstErr) {
      // Fallback with minimal constraints if advanced DSP constraints fail on certain devices
      const name = (firstErr as Error)?.name || '';
      if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError' || name === 'AbortError') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        refreshDevices();
        return stream;
      }
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        throw new Error(
          tr(
            lang,
            'মাইক্রোফোনের অনুমতি ব্লক করা আছে। ব্রাউজার অ্যাড্রেস বারের লক আইকন বা ফোন সেটিংস → অ্যাপ অনুমতি → Microphone → Allow দিন।',
            'Microphone permission denied. Allow Microphone access in browser site settings or device permissions.'
          )
        );
      }
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        throw new Error(tr(lang, 'কোনো মাইক্রোফোন পাওয়া যায়নি।', 'No microphone device found.'));
      }
      if (name === 'NotReadableError' || name === 'TrackStartError') {
        throw new Error(
          tr(
            lang,
            'মাইক্রোফোন অন্য অ্যাপ ব্যবহার করছে। অন্য অ্যাপ বন্ধ করে আবার চেষ্টা করুন।',
            'Microphone is currently in use by another app.'
          )
        );
      }
      throw new Error((firstErr as Error)?.message || tr(lang, 'মাইক্রোফোন চালু করা যায়নি।', 'Could not start microphone.'));
    }
  };

  const drawPitchCanvas = useCallback((buf: Float32Array, currentHz: number | null) => {
    const canvas = pitchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle background horizontal guide lines
    ctx.strokeStyle = 'rgba(150, 165, 255, 0.14)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach((ratio) => {
      ctx.beginPath();
      ctx.moveTo(0, h * ratio);
      ctx.lineTo(w, h * ratio);
      ctx.stroke();
    });

    // Live audio waveform overlay (subtle centered wave)
    ctx.strokeStyle = 'rgba(69, 176, 255, 0.42)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const step = Math.max(1, Math.floor(buf.length / w));
    for (let x = 0; x < w; x++) {
      const sample = buf[x * step] || 0;
      const y = h / 2 + sample * (h * 0.42);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Scrolling Pitch Contour
    const history = pitchHistoryRef.current;
    history.push(currentHz);
    if (history.length > 140) history.shift();

    const minLog = Math.log(65);
    const maxLog = Math.log(880);
    ctx.strokeStyle = '#3de0b5';
    ctx.lineWidth = 2.6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    let drawing = false;
    history.forEach((hzVal, idx) => {
      if (!hzVal) {
        drawing = false;
        return;
      }
      const x = (idx / 139) * w;
      const norm = Math.max(0, Math.min(1, (Math.log(hzVal) - minLog) / (maxLog - minLog)));
      const y = h - 8 - norm * (h - 16);
      if (!drawing) {
        ctx.moveTo(x, y);
        drawing = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }, []);

  const updateWaveMeter = useCallback((freqData: Uint8Array, rms: number) => {
    const isPaused = recStateRef.current === 'paused';
    const barsCount = 28;
    const smoothed = waveSmoothedRef.current;
    const rmsBoost = Math.min(1, rms * 4.5);

    if (waveLevelTextRef.current) {
      waveLevelTextRef.current.textContent = isPaused ? '0%' : `${Math.min(100, Math.round(rms * 380))}%`;
    }

    for (let i = 0; i < barsCount; i++) {
      const bar = waveBarRefs.current[i];
      if (!bar) continue;

      let target = 0;
      if (!isPaused) {
        // Symmetric mirror distribution from center voice fundamental/formant bins
        const distFromCenter = Math.abs(i - (barsCount - 1) / 2) / ((barsCount - 1) / 2);
        const binIndex = Math.min(freqData.length - 1, Math.floor(2 + distFromCenter * 38));
        const nextBin = Math.min(freqData.length - 1, binIndex + 1);
        const freqMag = ((freqData[binIndex] + freqData[nextBin]) * 0.5) / 255;
        target = Math.max(rmsBoost * (1 - distFromCenter * 0.45), freqMag * 0.92 + rmsBoost * 0.35);
      }

      const prev = smoothed[i];
      const nextVal = target > prev ? prev * 0.35 + target * 0.65 : prev * 0.72 + target * 0.28;
      smoothed[i] = nextVal;

      const heightPct = Math.max(12, Math.min(100, Math.round(12 + nextVal * 88)));
      bar.style.height = `${heightPct}%`;
      bar.style.opacity = isPaused ? '0.35' : String(Math.max(0.42, Math.min(1, 0.38 + nextVal * 0.75)));
      if (heightPct > 86 && recStateRef.current === 'recording') {
        bar.style.background = 'linear-gradient(180deg, #fb7185, #f59e0b)';
      } else if (recStateRef.current === 'recording') {
        bar.style.background = 'linear-gradient(180deg, #3de0b5, #45b0ff)';
      } else {
        bar.style.background = 'linear-gradient(180deg, var(--ac2), var(--ac))';
      }
    }
  }, []);

  const attachAnalyserToStream = async (stream: MediaStream) => {
    stopPitchMonitor();
    const Ctor =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio unavailable');

    const ctx = new Ctor();
    await ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.22;
    source.connect(analyser);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    const buf = new Float32Array(analyser.fftSize);
    const freqBuf = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      if (!analyserRef.current || !audioCtxRef.current) return;
      analyserRef.current.getFloatTimeDomainData(buf);
      analyserRef.current.getByteFrequencyData(freqBuf);
      const reading = analyzeFrame(buf, audioCtxRef.current.sampleRate, saHz, lang, lastHzRef.current);
      lastHzRef.current = reading.hz;
      setPitch(reading);
      if (recStateRef.current === 'recording' && reading.hz) {
        recPitchSamplesRef.current.push(reading.hz);
      }
      drawPitchCanvas(buf, reading.hz);
      updateWaveMeter(freqBuf, reading.rms);
      pitchRafRef.current = requestAnimationFrame(loop);
    };
    pitchRafRef.current = requestAnimationFrame(loop);
  };

  const handleStartMic = async (deviceIdOverride?: string): Promise<MediaStream | null> => {
    setMicError('');
    try {
      releaseAllMic();
      const stream = await acquireMicStream(deviceIdOverride);
      micStreamRef.current = stream;
      await attachAnalyserToStream(stream);
      setMicActive(true);
      return stream;
    } catch (err) {
      const msg = (err as Error)?.message || tr(lang, 'মাইক্রোফোন চালু হয়নি', 'Could not start microphone');
      setMicError(msg);
      releaseAllMic();
      onToast(msg);
      return null;
    }
  };

  const handleStopMic = () => {
    if (recState !== 'idle') {
      stopRecording();
    }
    releaseAllMic();
  };

  const handleSwitchDevice = async (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    if (micActive && recState === 'idle') {
      await handleStartMic(newDeviceId);
    }
  };

  const handleToggleTanpura = () => {
    if (tanpuraPreview) {
      stopBgSound(false);
      setTanpuraPreview(false);
    } else {
      ensureAudioEngine(state);
      startBgSound('tanpura', saHz);
      setTanpuraPreview(true);
    }
  };

  const handleStartRecording = async () => {
    if (!window.MediaRecorder) {
      onToast(
        tr(lang, 'এই ব্রাউজারে অডিও রেকর্ডিং সমর্থিত নয়।', 'Audio recording is not supported in this browser.')
      );
      return;
    }
    setMicError('');
    try {
      let stream = micStreamRef.current;
      const hasLiveTrack = stream && stream.getAudioTracks().some((t) => t.readyState === 'live');
      if (!hasLiveTrack) {
        stream = await handleStartMic();
      }
      if (!stream) return;

      const preferredMime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((type) =>
        MediaRecorder.isTypeSupported?.(type)
      );
      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);

      recChunksRef.current = [];
      recPitchSamplesRef.current = [];
      recBaseSecRef.current = 0;
      recStartedAtRef.current = Date.now();
      recMetaRef.current = { label: recTitle.trim(), note: recNote.trim() };

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        if (recTimerRef.current) {
          window.clearInterval(recTimerRef.current);
          recTimerRef.current = 0;
        }
        const totalDuration = Math.max(
          1,
          Math.round(recBaseSecRef.current + (recStateRef.current === 'recording' ? (Date.now() - recStartedAtRef.current) / 1000 : 0))
        );
        const blob = new Blob(recChunksRef.current, { type: recorder.mimeType || 'audio/webm' });

        // Compute average pitch for the saved take
        const samples = recPitchSamplesRef.current;
        let avgPitchHz: number | undefined;
        let dominantNote: string | undefined;
        if (samples.length >= 3) {
          const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
          avgPitchHz = avg;
          dominantNote = hzToNoteInfo(avg, saHz, lang).note;
        }

        recStateRef.current = 'idle';
        setRecState('idle');
        setRecElapsed(0);
        mediaRecRef.current = null;
        recChunksRef.current = [];

        if (blob.size > 0) {
          try {
            await saveTake(blob, totalDuration, {
              label: recMetaRef.current.label,
              note: recMetaRef.current.note,
              avgPitchHz,
              dominantNote,
            });
            onToast(tr(lang, 'রেকর্ডিং সংরক্ষিত হয়েছে!', 'Recording saved!'));
            await loadTakes();
          } catch (err) {
            onToast(
              tr(lang, 'রেকর্ডিং সংরক্ষণ করা যায়নি: ', 'Could not save recording: ') +
                ((err as Error)?.message || '')
            );
          }
        }
      };

      mediaRecRef.current = recorder;
      recStateRef.current = 'recording';
      setRecState('recording');
      setRecElapsed(0);
      recorder.start(250);

      recTimerRef.current = window.setInterval(() => {
        if (recStateRef.current === 'recording') {
          const sec = Math.floor(recBaseSecRef.current + (Date.now() - recStartedAtRef.current) / 1000);
          setRecElapsed(sec);
        }
      }, 250);
    } catch (err) {
      const msg = (err as Error)?.message || tr(lang, 'রেকর্ডিং চালু হয়নি', 'Could not start recording');
      onToast(msg);
    }
  };

  const handlePauseResumeRecording = () => {
    const rec = mediaRecRef.current;
    if (!rec) return;
    if (rec.state === 'recording' && rec.pause) {
      recBaseSecRef.current += (Date.now() - recStartedAtRef.current) / 1000;
      rec.pause();
      recStateRef.current = 'paused';
      setRecState('paused');
    } else if (rec.state === 'paused' && rec.resume) {
      recStartedAtRef.current = Date.now();
      rec.resume();
      recStateRef.current = 'recording';
      setRecState('recording');
    }
  };

  const handlePlayTake = async (take: RecordedTake) => {
    try {
      const fresh = await getTake(take.id);
      if (!fresh) throw new Error('Recording not found');
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = URL.createObjectURL(fresh.blob);
      const audio = audioPlayerRef.current;
      if (!audio) return;
      audio.onended = null;
      audio.src = objectUrlRef.current;
      setNowPlayingLabel(fresh.label || `${tr(lang, 'রেকর্ডিং', 'Take')} #${fresh.id}`);
      await audio.play();
    } catch (err) {
      onToast(tr(lang, 'রেকর্ডিং চালানো যায়নি: ', 'Could not play: ') + ((err as Error)?.message || ''));
    }
  };

  const handleCompareTakes = async () => {
    if (!compareA || !compareB) {
      onToast(tr(lang, 'তুলনার জন্য অন্তত একটি রেকর্ডিং দরকার', 'At least one recording is required'));
      return;
    }
    try {
      const first = await getTake(Number(compareA));
      const second = await getTake(Number(compareB));
      if (!first || !second) throw new Error('Take not found');
      const audio = audioPlayerRef.current;
      if (!audio) return;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = URL.createObjectURL(first.blob);
      audio.src = objectUrlRef.current;
      setNowPlayingLabel(
        `${tr(lang, 'তুলনা A', 'Compare A')}: ${first.label || '#' + first.id} → B: ${second.label || '#' + second.id}`
      );
      audio.onended = () => {
        audio.onended = null;
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = URL.createObjectURL(second.blob);
        audio.src = objectUrlRef.current;
        audio.play().catch(() => {});
      };
      await audio.play();
      onToast(tr(lang, 'প্রথমে A, তারপর B বাজবে', 'Playing take A, then take B'));
    } catch (err) {
      onToast(tr(lang, 'তুলনা করা যায়নি: ', 'Could not compare: ') + ((err as Error)?.message || ''));
    }
  };

  const handleQuickShare = async (take: RecordedTake) => {
    try {
      const res = await shareTakeAudioFile(take, lang, 'wav');
      onToast(res.message);
      if (res.status === 'downloaded') {
        setShareTarget(take);
      }
    } catch {
      setShareTarget(take);
    }
  };

  const handleQuickDownload = async (take: RecordedTake) => {
    try {
      const { filename } = await downloadTakeAsFormat(take, 'wav');
      onToast(tr(lang, `"${filename}" ডাউনলোড হয়েছে`, `Downloaded "${filename}"`));
    } catch (err) {
      onToast(tr(lang, 'ডাউনলোড করা যায়নি: ', 'Could not download: ') + ((err as Error)?.message || ''));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTake(deleteTarget.id);
      setDeleteTarget(null);
      await loadTakes();
      onToast(tr(lang, 'মুছে ফেলা হয়েছে', 'Deleted'));
    } catch {
      onToast(tr(lang, 'মুছতে সমস্যা হয়েছে', 'Could not delete'));
    }
  };

  const handleSaveMeta = async (id: number) => {
    try {
      await updateTakeMeta(id, { label: editTitle.trim(), note: editNote.trim() });
      setEditingId(null);
      await loadTakes();
      onToast(tr(lang, 'আপডেট হয়েছে', 'Updated'));
    } catch {
      onToast(tr(lang, 'আপডেট ব্যর্থ হয়েছে', 'Could not update'));
    }
  };

  const handleStartCamera = async () => {
    try {
      releaseCamera();
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(tr(lang, 'এই ব্রাউজারে Camera API নেই।', 'Camera API unavailable.'));
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setCameraActive(true);
      setCameraStatus(tr(lang, 'ক্যামেরা চালু হয়েছে', 'Camera is active'));
      window.setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      }, 30);
    } catch (err) {
      releaseCamera();
      const msg = (err as Error)?.message || tr(lang, 'ক্যামেরা চালু হয়নি', 'Camera failed');
      setCameraStatus(msg);
      onToast(msg);
    }
  };

  // Diagnostics
  const isSecure = typeof window !== 'undefined' && (window.isSecureContext || location.protocol === 'file:');
  const hasGum = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  const hasMr = typeof window !== 'undefined' && Boolean(window.MediaRecorder);
  const hasDb = typeof window !== 'undefined' && Boolean(window.indexedDB);

  // Pitch bar calculation (log scale 65..880 Hz)
  const pitchPercent = pitch.hz
    ? Math.min(100, Math.max(4, (Math.log(pitch.hz / 65) / Math.log(880 / 65)) * 100))
    : 0;
  const micLevelPercent = Math.min(100, Math.round(pitch.rms * 380));
  const centsOffsetPercent = Math.max(-50, Math.min(50, pitch.cents));
  const inTune = pitch.hz !== null && Math.abs(pitch.cents) <= 12;

  const promptPresets = [
    { label: tr(lang, 'নমুনা কবিতা লাইন', 'Sample poetry line'), value: POETRY_SAMPLE_LINE },
    ...POETRY_WORDS.slice(0, 4).map((w) => ({ label: `${w.w} (${w.p})`, value: `${w.w} — ${w.p}` })),
    ...TW.slice(0, 4).map((tw) => ({ label: `${tw.f}: ${tw.x.slice(0, 22)}…`, value: tw.x })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--tx)] m-0">
          {tr(lang, 'ভয়েস স্টুডিও', 'Voice Studio')}
        </h1>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg2)] text-[var(--mu)] border border-[var(--bd)]">
          🎙️ {tr(lang, 'পিচ · রেকর্ডার · শেয়ার', 'Pitch · Recorder · Share')}
        </span>
      </div>

      {/* Hero intro */}
      <section className="studio-card p-5 space-y-2" style={{ background: 'radial-gradient(circle at 88% 10%, rgba(139,124,246,.32), transparent 45%), var(--glass), var(--card)' }}>
        <h2 className="text-xl font-extrabold text-[var(--tx)] m-0">
          {tr(lang, 'নিজের কণ্ঠ শুনুন, স্বর বুঝুন ও শেয়ার করুন', 'Record your voice, track live pitch & share easily')}
        </h2>
        <p className="text-sm text-[var(--mu)] m-0">
          {tr(
            lang,
            'মাইক্রোফোন চালু করে রিয়েল-টাইমে Hz ও সরগম দেখুন, রেকর্ডিং সংরক্ষণ করুন এবং এক ক্লিকে .WAV অডিও শেয়ার করুন।',
            'Turn on your microphone to view live Hz & Sargam pitch, save recordings locally, and share .WAV audio in one tap.'
          )}
        </p>
      </section>

      {/* Main Two-Column Desktop Layout: Live Pitch + Recorder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Live Pitch Analyzer */}
        <section className="studio-card p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tx)] m-0 flex items-center gap-2">
              <span>🎚</span>
              <span>{tr(lang, 'লাইভ পিচ অ্যানালাইজার', 'Live Pitch Analyzer')}</span>
            </h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                micActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35'
                  : 'bg-[var(--bg2)] text-[var(--mu)] border border-[var(--bd)]'
              }`}
            >
              {micActive ? tr(lang, '● লাইভ চালু', '● LIVE ON') : tr(lang, 'বন্ধ', 'OFF')}
            </span>
          </div>

          {/* Pitch & Sargam readout */}
          <div className="grid grid-cols-3 gap-3 items-center p-3.5 rounded-2xl bg-[var(--bg2)]/80 border border-[var(--bd)]">
            <div className="col-span-2">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-num studio-gradient-text leading-none">
                {pitch.hz ? `${Math.round(pitch.hz)} Hz` : '— Hz'}
              </div>
              <div className="text-sm font-semibold text-[var(--tx)] mt-1.5">
                {pitch.hz
                  ? `${pitch.note} · ${pitch.sargam}`
                  : micActive
                    ? tr(lang, 'স্বাভাবিক স্বরে বলুন বা গুনগুন করুন', 'Speak or hum comfortably')
                    : tr(lang, 'মাইক্রোফোন চালু করুন', 'Start the microphone')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold text-[var(--mu)] uppercase">
                {tr(lang, 'টিউনিং', 'Tuning')}
              </div>
              <div
                className={`text-sm font-bold font-mono-num mt-0.5 ${
                  !pitch.hz ? 'text-[var(--mu)]' : inTune ? 'text-[var(--ok)]' : 'text-[var(--warn)]'
                }`}
              >
                {pitch.hz ? `${pitch.cents >= 0 ? '+' : ''}${pitch.cents}¢` : '—'}
              </div>
              <div className="text-[11px] text-[var(--mu)] mt-0.5">
                {tr(lang, 'শব্দ স্তর', 'Level')}: {micLevelPercent}%
              </div>
            </div>
          </div>

          {/* Cents Tuning & Range Bars */}
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] text-[var(--mu)] mb-1">
                <span>65 Hz</span>
                <span>{tr(lang, 'কণ্ঠের পিচ স্কেল', 'Pitch range')}</span>
                <span>880 Hz</span>
              </div>
              <div className="h-3 rounded-full bg-[var(--bg2)] border border-[var(--bd)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-75"
                  style={{
                    width: `${pitchPercent}%`,
                    background: 'linear-gradient(90deg, #3de0b5, var(--ac2), var(--ac))',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[var(--mu)] mb-1">
                <span>-50¢</span>
                <span>{inTune ? tr(lang, 'সঠিক সুরে', 'In tune') : tr(lang, 'ভয়েস লেভেল & টিউন', 'Cents deviation')}</span>
                <span>+50¢</span>
              </div>
              <div className="relative h-2.5 rounded-full bg-[var(--bg2)] border border-[var(--bd)]">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--ok)]/60 -translate-x-1/2" />
                {pitch.hz !== null && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                      inTune ? 'bg-[var(--ok)]' : 'bg-[var(--ac2)]'
                    }`}
                    style={{ left: `${50 + centsOffsetPercent}%` }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Live Waveform & Pitch Contour Graph */}
          <div className="rounded-2xl bg-[#070b18]/80 border border-[var(--bd)] p-2">
            <canvas
              ref={pitchCanvasRef}
              width={560}
              height={110}
              className="w-full h-28 block rounded-xl"
              aria-label={tr(lang, 'লাইভ পিচ এবং ওয়েভফর্ম গ্রাফ', 'Live pitch and waveform graph')}
            />
          </div>

          {/* Mic device selector */}
          {audioDevices.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
                {tr(lang, 'মাইক্রোফোন ডিভাইস', 'Microphone input')}
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => handleSwitchDevice(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3 text-sm text-[var(--tx)]"
              >
                <option value="">{tr(lang, 'ডিফল্ট মাইক্রোফোন', 'Default microphone')}</option>
                {audioDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `${tr(lang, 'মাইক্রোফোন', 'Microphone')} ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mic Start / Stop + Realistic Tanpura Reference */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleStartMic()}
              className="studio-btn-pri min-h-[48px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{micActive ? tr(lang, 'পুনরায় চালু', 'Restart mic') : tr(lang, 'মাইক্রোফোন চালু', 'Start mic')}</span>
            </button>
            <button
              type="button"
              disabled={!micActive}
              onClick={handleStopMic}
              className="studio-btn-sec min-h-[48px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer disabled:opacity-45"
            >
              <MicOff className="w-4 h-4" />
              <span>{tr(lang, 'বন্ধ করুন', 'Stop mic')}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleTanpura}
            className={`w-full min-h-[44px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
              tanpuraPreview ? 'studio-btn-pri' : 'studio-btn-sec'
            }`}
          >
            {tanpuraPreview ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[var(--ac2)]" />}
            <span>
              {tanpuraPreview
                ? tr(lang, 'তানপুরা বন্ধ করুন', 'Stop Realistic Tanpura')
                : tr(lang, `🪷 রিয়ালিস্টিক তানপুরা শুনুন (সা: ${Math.round(saHz)} Hz)`, `🪷 Play Realistic Tanpura (Sa: ${Math.round(saHz)} Hz)`)}
            </span>
          </button>

          {micError && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/35 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{micError}</span>
            </div>
          )}

          <p className="text-xs text-[var(--mu)] m-0">
            {tr(
              lang,
              'পিচ আনুমানিক মৌলিক কম্পাঙ্ক (Hz); রেকর্ডিং চলাকালেও লাইভ পিচ কাজ করবে।',
              'Pitch shows estimated fundamental frequency (Hz) & Sargam; live tracking stays active while recording.'
            )}
          </p>
        </section>

        {/* Voice Recorder */}
        <section className="studio-card p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tx)] m-0">
              🔴 {tr(lang, 'ভয়েস রেকর্ডার', 'Voice Recorder')}
            </h3>
            <span className="font-mono-num text-xl font-extrabold studio-gradient-text">
              {formatNum(
                `${String(Math.floor(recElapsed / 60)).padStart(2, '0')}:${String(recElapsed % 60).padStart(2, '0')}`,
                lang
              )}
            </span>
          </div>

          <p className="text-xs text-[var(--mu)] m-0">
            {tr(
              lang,
              'একটি কবিতা বা বাক্য বলুন, সংরক্ষণ করুন এবং সহজেই অডিও ফাইল শেয়ার করুন।',
              'Recite a poem or passage, save locally, and share the audio file effortlessly.'
            )}
          </p>

          {/* Practice Prompt Card inside recorder */}
          <div className="p-3 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--ac2)]">
                {tr(lang, 'পড়ার জন্য প্রম্পট', 'Reading Prompt')}
              </span>
              <select
                aria-label={tr(lang, 'প্রম্পট বেছে নিন', 'Choose prompt')}
                value=""
                onChange={(e) => {
                  if (e.target.value) setPromptText(e.target.value);
                }}
                className="text-xs rounded-xl border border-[var(--bd)] bg-[var(--card)] px-2.5 py-1.5 text-[var(--tx)] max-w-[190px]"
              >
                <option value="">{tr(lang, 'অন্য লাইন বাছুন…', 'Switch prompt…')}</option>
                {promptPresets.map((p, idx) => (
                  <option key={idx} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm font-semibold text-[var(--tx)] leading-relaxed m-0">{promptText}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
                {tr(lang, 'রেকর্ডিংয়ের নাম', 'Recording title')}
              </label>
              <input
                type="text"
                maxLength={60}
                value={recTitle}
                onChange={(e) => setRecTitle(e.target.value)}
                placeholder={tr(lang, 'যেমন: কবিতা আবৃত্তি – ১ম চেষ্টা', 'e.g. Poetry recitation – take 1')}
                className="w-full min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
                {tr(lang, 'নোট (ঐচ্ছিক)', 'Notes (optional)')}
              </label>
              <input
                type="text"
                maxLength={160}
                value={recNote}
                onChange={(e) => setRecNote(e.target.value)}
                placeholder={tr(lang, 'অনুশীলন সম্পর্কে লিখুন', 'Add a practice note')}
                className="w-full min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3.5 text-sm text-[var(--tx)]"
              />
            </div>
          </div>

          {/* Recorder Controls */}
          <div className="flex flex-wrap gap-2.5">
            {recState === 'idle' ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="studio-btn-pri flex-1 min-h-[48px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>{tr(lang, 'রেকর্ড শুরু', 'Start recording')}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePauseResumeRecording}
                  className="studio-btn-sec min-h-[48px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
                >
                  {recState === 'recording' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>
                    {recState === 'recording' ? tr(lang, 'বিরতি', 'Pause') : tr(lang, 'আবার শুরু', 'Resume')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="studio-btn-pri flex-1 min-h-[48px] px-4 rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>{tr(lang, 'সংরক্ষণ ও বন্ধ', 'Stop & save')}</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--mu)]">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              {recState === 'recording' && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef5365] animate-pulse" />
              )}
              {recState === 'recording'
                ? tr(lang, 'রেকর্ড হচ্ছে…', 'Recording…')
                : recState === 'paused'
                  ? tr(lang, 'রেকর্ডিং বিরতিতে', 'Recording paused')
                  : tr(lang, 'রেকর্ডিং শুরু করতে চাপুন।', 'Tap to begin recording.')}
            </span>
          </div>

          {/* Live Microphone-Reactive Recording Volume Wave Meter */}
          <div className="p-3 rounded-2xl bg-[var(--bg2)]/85 border border-[var(--bd)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--mu)]">
              <span>
                {micActive
                  ? recState === 'recording'
                    ? tr(lang, '● রিয়েল-টাইম রেকর্ডিং অডিও লেভেল', '● Real-time Recording Input Level')
                    : recState === 'paused'
                      ? tr(lang, 'রেকর্ডিং বিরতিতে', 'Recording Paused')
                      : tr(lang, 'লাইভ মাইক্রোফোন অডিও লেভেল', 'Live Microphone Input Level')
                  : tr(lang, 'রেকর্ড বা মাইক চালু করলে ওয়েভ মিটার সচল হবে', 'Wave meter activates with microphone input')}
              </span>
              <span ref={waveLevelTextRef} className="font-mono-num text-[var(--tx)] font-bold">
                0%
              </span>
            </div>
            <div
              className="flex items-center justify-between gap-[3px] h-12 px-1"
              role="meter"
              aria-label={tr(lang, 'রেকর্ডিং ভলিউম মিটার', 'Recording volume meter')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={micLevelPercent}
            >
              {Array.from({ length: 28 }, (_, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    waveBarRefs.current[i] = el;
                  }}
                  className="flex-1 rounded-full transition-[height,opacity] duration-75 ease-out"
                  style={{
                    height: '14%',
                    opacity: 0.38,
                    background: 'linear-gradient(180deg, var(--ac2), var(--ac))',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Native Playback Bar */}
          <div className="pt-1 space-y-1">
            {nowPlayingLabel && (
              <div className="text-xs font-semibold text-[var(--ac2)] truncate">
                ▶ {nowPlayingLabel}
              </div>
            )}
            <audio ref={audioPlayerRef} controls className="w-full rounded-xl" />
          </div>
        </section>
      </div>

      {/* Saved Recordings Library + One-Tap Share */}
      <section className="studio-card p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[var(--tx)] m-0">
              🎧 {tr(lang, 'আমার রেকর্ডিং', 'My recordings')} ({formatNum(takes.length, lang)})
            </h3>
            <p className="text-xs text-[var(--mu)] m-0 mt-0.5">
              {tr(
                lang,
                'প্রতিটি রেকর্ডিং .WAV ফরম্যাটে ডাউনলোড বা সরাসরি WhatsApp/Telegram-এ শেয়ার করা যায়।',
                'Play, edit notes, download as .WAV, or share directly to WhatsApp/Telegram.'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={loadTakes}
            aria-label={tr(lang, 'তালিকা রিফ্রেশ করুন', 'Refresh recordings')}
            className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-2xl grid place-items-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {takesLoading ? (
          <p className="text-sm text-[var(--mu)]">{tr(lang, 'লোড হচ্ছে…', 'Loading…')}</p>
        ) : takesError ? (
          <p className="text-sm text-[var(--danger)]">{takesError}</p>
        ) : takes.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)] text-sm text-[var(--mu)]">
            {tr(lang, 'এখনও কোনো রেকর্ডিং নেই। উপরের রেকর্ড বোতামে চাপ দিয়ে প্রথম অডিও নিন।', 'No recordings yet. Tap Start recording above to save your first take.')}
          </div>
        ) : (
          <div className="divide-y divide-[var(--bd)]">
            {takes.map((take) => {
              const isEditing = editingId === take.id;
              const durText = formatNum(
                `${Math.floor(take.duration / 60)}:${String(take.duration % 60).padStart(2, '0')}`,
                lang
              );
              const dateText = new Date(take.created).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={take.id} className="py-3.5 first:pt-1 last:pb-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <b className="text-sm sm:text-base text-[var(--tx)] truncate">
                          {take.label || `${tr(lang, 'রেকর্ডিং', 'Take')} #${formatNum(take.id, lang)}`}
                        </b>
                        <span className="text-xs font-mono-num px-2 py-0.5 rounded-full bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
                          {durText}
                        </span>
                        {take.avgPitchHz && (
                          <span className="text-xs font-mono-num px-2 py-0.5 rounded-full bg-[var(--ac)]/15 text-[var(--ac)] border border-[var(--ac)]/30">
                            ~{Math.round(take.avgPitchHz)} Hz {take.dominantNote ? `(${take.dominantNote})` : ''}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--mu)] mt-1">
                        {dateText}
                        {take.note ? ` · ${take.note}` : ''}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePlayTake(take)}
                        aria-label={tr(lang, 'চালান', 'Play')}
                        className="studio-btn-sec min-h-[44px] px-3 rounded-xl inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{tr(lang, 'শুনুন', 'Play')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShareTarget(take)}
                        aria-label={tr(lang, 'শেয়ার', 'Share')}
                        className="studio-btn-pri min-h-[44px] px-3.5 rounded-xl inline-flex items-center gap-1.5 text-xs cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{tr(lang, 'শেয়ার', 'Share')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickDownload(take)}
                        title={tr(lang, '.WAV ডাউনলোড', 'Download .WAV')}
                        aria-label={tr(lang, '.WAV ডাউনলোড', 'Download .WAV')}
                        className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-xl grid place-items-center cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[var(--ok)]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingId(null);
                          } else {
                            setEditingId(take.id);
                            setEditTitle(take.label || '');
                            setEditNote(take.note || '');
                          }
                        }}
                        title={tr(lang, 'নাম/নোট সম্পাদনা', 'Edit title/note')}
                        aria-label={tr(lang, 'সম্পাদনা', 'Edit')}
                        className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-xl grid place-items-center cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(take)}
                        title={tr(lang, 'মুছে ফেলুন', 'Delete')}
                        aria-label={tr(lang, 'মুছে ফেলুন', 'Delete')}
                        className="studio-btn-sec min-w-[44px] min-h-[44px] rounded-xl grid place-items-center text-[var(--danger)] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Share One-Tap Row for mobile convenience */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickShare(take)}
                      className="text-xs font-semibold text-[var(--ac2)] hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      ↗ {tr(lang, 'সরাসরি শেয়ার শীট খুলুন (.WAV)', 'Quick open OS share sheet (.WAV)')}
                    </button>
                  </div>

                  {isEditing && (
                    <div className="p-3 rounded-2xl bg-[var(--bg2)] border border-[var(--bd)] grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder={tr(lang, 'নতুন নাম', 'New title')}
                        className="min-h-[42px] rounded-xl border border-[var(--bd)] bg-[var(--card)] px-3 text-sm text-[var(--tx)]"
                      />
                      <input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder={tr(lang, 'নোট', 'Notes')}
                        className="min-h-[42px] rounded-xl border border-[var(--bd)] bg-[var(--card)] px-3 text-sm text-[var(--tx)]"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveMeta(take.id)}
                          className="studio-btn-pri flex-1 min-h-[42px] px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{tr(lang, 'সংরক্ষণ', 'Save')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="studio-btn-sec min-h-[42px] px-3 rounded-xl text-xs cursor-pointer"
                        >
                          {tr(lang, 'বাতিল', 'Cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Secondary Tools Row: Compare + Camera + Poetry Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compare Recordings */}
        <section className="studio-card p-5 space-y-3">
          <h3 className="text-base font-bold text-[var(--tx)] m-0 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[var(--ac2)]" />
            <span>{tr(lang, 'রেকর্ডিং তুলনা', 'Compare recordings')}</span>
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
                {tr(lang, 'রেকর্ডিং A', 'Take A')}
              </label>
              <select
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3 text-xs sm:text-sm text-[var(--tx)]"
              >
                {takes.map((x) => (
                  <option key={x.id} value={String(x.id)}>
                    #{x.id} · {x.label || new Date(x.created).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--mu)] mb-1">
                {tr(lang, 'রেকর্ডিং B', 'Take B')}
              </label>
              <select
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl border border-[var(--bd)] bg-[var(--bg2)] px-3 text-xs sm:text-sm text-[var(--tx)]"
              >
                {takes.map((x) => (
                  <option key={x.id} value={String(x.id)}>
                    #{x.id} · {x.label || new Date(x.created).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            disabled={takes.length === 0}
            onClick={handleCompareTakes}
            className="studio-btn-pri w-full min-h-[46px] rounded-2xl inline-flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-45"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{tr(lang, 'A তারপর B শুনুন', 'Play A then B')}</span>
          </button>
        </section>

        {/* Camera Posture Test */}
        <section className="studio-card p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tx)] m-0 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[var(--ac)]" />
              <span>{tr(lang, 'ক্যামেরা পরীক্ষা', 'Camera test')}</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg2)] border border-[var(--bd)] text-[var(--mu)]">
              Audio / Video
            </span>
          </div>
          <p className="text-xs text-[var(--mu)] m-0">
            {tr(
              lang,
              'মুখভঙ্গি ও শ্বাস-ভঙ্গি দেখার জন্য ক্যামেরা প্রিভিউ (ভিডিও সংরক্ষণ করা হয় না)।',
              'Preview posture & facial relaxation. Video is preview-only and is not saved.'
            )}
          </p>
          {cameraActive && (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full max-h-56 rounded-2xl bg-black object-cover"
            />
          )}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleStartCamera}
              className="studio-btn-pri flex-1 min-h-[44px] px-3 rounded-2xl inline-flex items-center justify-center gap-1.5 text-sm cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{tr(lang, 'ক্যামেরা চালু', 'Start camera')}</span>
            </button>
            <button
              type="button"
              disabled={!cameraActive}
              onClick={releaseCamera}
              className="studio-btn-sec min-h-[44px] px-4 rounded-2xl inline-flex items-center justify-center gap-1.5 text-sm font-semibold cursor-pointer disabled:opacity-45"
            >
              <CameraOff className="w-4 h-4" />
              <span>{tr(lang, 'বন্ধ', 'Stop')}</span>
            </button>
          </div>
          <p className="text-xs text-[var(--mu)] m-0">{cameraStatus}</p>
        </section>
      </div>

      {/* Poetry Lab Quick Card */}
      <section className="studio-card-conj p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--tx)] m-0 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-[#ff8a4c]" />
            <span>{tr(lang, 'কবিতা আবৃত্তি ও কঠিন শব্দ', 'Poetry recitation & difficult words')}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--mu)] m-0 mt-1">
            {tr(
              lang,
              '২০টি কঠিন বাংলা শব্দ: ভেঙে উচ্চারণ, একসঙ্গে বলা, শুনে অনুশীলন ও নমুনা আবৃত্তি।',
              '20 difficult Bengali words with chunked pronunciation, audio practice and a sample recitation.'
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPoetry}
          className="studio-btn-pri min-h-[46px] px-5 rounded-2xl text-sm shrink-0 cursor-pointer"
        >
          {tr(lang, 'আবৃত্তি ল্যাব খুলুন', 'Open recitation lab')}
        </button>
      </section>

      {/* Diagnostics + Privacy + Safety */}
      <section className="studio-card p-5 space-y-1.5">
        <h3 className="text-base font-bold text-[var(--tx)] m-0">
          🛠️ {tr(lang, 'অডিও ও ডিভাইস সামঞ্জস্য', 'Audio & Device Diagnostics')}
        </h3>
        <p className="text-xs text-[var(--mu)] m-0 leading-relaxed font-mono-num">
          Origin: {typeof window !== 'undefined' ? location.protocol : ''} ({isSecure ? 'secure' : 'not secure'}) ·
          getUserMedia: {hasGum ? 'available' : 'missing'} · MediaRecorder: {hasMr ? 'available' : 'missing'} · IndexedDB:{' '}
          {hasDb ? 'available' : 'missing'}
        </p>
      </section>

      <section className="studio-card-warn p-4 sm:p-5 space-y-1">
        <b className="text-sm text-[var(--tx)]">{tr(lang, 'গোপনীয়তা ও অনুমতি', 'Privacy & permissions')}</b>
        <p className="text-xs sm:text-sm text-[var(--mu)] m-0">
          {tr(
            lang,
            'রেকর্ডিং শুধু এই ডিভাইসের IndexedDB-তে থাকে। মাইক্রোফোন কেবল আপনি চালু করলে ব্যবহৃত হয়।',
            "Recordings stay in this device's IndexedDB. The microphone is used only after you start it."
          )}
        </p>
      </section>

      <VoiceSafetyCard lang={lang} />

      {/* Share Sheet Modal */}
      {shareTarget && (
        <ShareTakeModal
          take={shareTarget}
          lang={lang}
          onClose={() => setShareTarget(null)}
          onToast={onToast}
        />
      )}

      {/* Delete Confirmation Modal (replaces window.confirm) */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-5"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="studio-card p-5 max-w-sm w-full space-y-4">
            <p className="text-base font-bold text-[var(--tx)] m-0">
              {tr(lang, 'এই রেকর্ডিং মুছবেন?', 'Delete this recording?')}
            </p>
            <p className="text-xs text-[var(--mu)] m-0">
              {deleteTarget.label || `${tr(lang, 'রেকর্ডিং', 'Take')} #${deleteTarget.id}`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="studio-btn-sec min-h-[44px] px-4 rounded-2xl text-sm font-semibold cursor-pointer"
              >
                {tr(lang, 'বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="min-h-[44px] px-5 rounded-2xl bg-[var(--danger)] text-white text-sm font-bold border-0 cursor-pointer"
              >
                {tr(lang, 'মুছে ফেলুন', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating 4-7-8 Breathing Button */}
      <button
        type="button"
        onClick={() => setBreathingOpen(true)}
        aria-label={tr(lang, '৪-৭-৮ শ্বাস অনুশীলন খুলুন', 'Open 4-7-8 Breathing exercise')}
        className="fixed right-4 sm:right-6 bottom-[calc(86px+env(safe-area-inset-bottom))] z-30 min-h-[48px] px-4 rounded-full shadow-2xl studio-btn-pri inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold cursor-pointer border border-white/25"
        style={{
          background: 'linear-gradient(135deg, #2bbf95, #45b0ff)',
          color: '#041a14',
        }}
      >
        <Wind className="w-4 h-4" />
        <span>{tr(lang, 'Breathing · ৪-৭-৮', 'Breathing')}</span>
      </button>

      {/* 4-7-8 Guided Breathing Overlay */}
      {breathingOpen && (
        <BreathingOverlay
          lang={lang}
          muted={state.mute}
          onClose={() => setBreathingOpen(false)}
        />
      )}
    </div>
  );
};
