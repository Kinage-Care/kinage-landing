import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import './VideoPlayer.css';

type Captions = { src: string; srclang: string; label: string };

type Props = {
  src: string;
  poster: string;
  title: string;
  /** A WebVTT subtitle track, on by default. */
  captions?: Captions;
};

type TrackMode = 'disabled' | 'hidden' | 'showing';

/** Seconds → m:ss. */
const clock = (s: number) => {
  const t = Math.max(0, Math.floor(Number.isFinite(s) ? s : 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

const IDLE_MS = 2600;

/**
 * Explainer video (Figma 562:4374): poster with the heather multiply tint and
 * the 72px mandarin play button (white glyph). Nothing autoplays; sound starts only from the
 * user's click. Once started, the player's own control bar takes over: seek,
 * play/pause, time, sound, subtitles (CC) and full screen.
 *
 * Subtitles: one <track default>. The track itself is the state — CC shows
 * `mode !== 'disabled'`, and every change (ours or the browser's own UI, e.g.
 * the iPhone full-screen player) comes back through `textTracks` "change".
 * While on, the track runs in `hidden` mode and its active cue is drawn in
 * the page (readable size on phones, above the control bar); in the iPhone's
 * native full-screen player it switches to `showing` so the system draws it.
 * The default is applied once; after the viewer turns subtitles off nothing
 * turns them back on — not playing, seeking, pausing or re-rendering.
 *
 * Full screen goes to the whole player (so the bar and subtitles come along);
 * where only the video element can go full screen (iPhone) the native player
 * is used.
 */
export function VideoPlayer({ src, poster, title, captions }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const idleTimer = useRef<number | undefined>(undefined);
  const nativeFullscreen = useRef(false);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mode, setMode] = useState<TrackMode>(captions ? 'hidden' : 'disabled');
  const [cue, setCue] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [ratio, setRatio] = useState<string | undefined>(undefined);

  const track = () => trackRef.current?.track ?? null;

  // Subtitle track: default on (once), then only ever mirrored.
  useEffect(() => {
    const video = videoRef.current;
    const t = track();
    if (!video || !t) return;
    // Our own rendering unless the system player is drawing it (iPhone full screen).
    if (t.mode !== 'hidden') t.mode = 'hidden';
    setMode('hidden');
    const readCue = () => {
      const active = t.activeCues?.[0] as VTTCue | undefined;
      setCue(active ? active.text : '');
    };
    const onChange = () => {
      // A browser that applies `default` late, or a native control, may switch
      // the track to `showing` while it is on: keep it on, draw it ourselves.
      if (t.mode === 'showing' && !nativeFullscreen.current) t.mode = 'hidden';
      setMode(t.mode as TrackMode);
      readCue();
    };
    t.addEventListener('cuechange', readCue);
    video.textTracks.addEventListener('change', onChange);
    return () => {
      t.removeEventListener('cuechange', readCue);
      video.textTracks.removeEventListener('change', onChange);
    };
  }, []);

  // Media state → UI.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => {
      setDuration(v.duration);
      if (v.videoWidth && v.videoHeight) setRatio(`${v.videoWidth} / ${v.videoHeight}`);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setMuted(v.muted);
    const onBeginNative = () => {
      nativeFullscreen.current = true;
      const t = track();
      if (t && t.mode === 'hidden') t.mode = 'showing';
    };
    const onEndNative = () => {
      nativeFullscreen.current = false;
      const t = track();
      if (t && t.mode === 'showing') t.mode = 'hidden';
    };
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('seeked', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('durationchange', onMeta);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onPause);
    v.addEventListener('volumechange', onVolume);
    v.addEventListener('webkitbeginfullscreen', onBeginNative);
    v.addEventListener('webkitendfullscreen', onEndNative);
    if (v.readyState >= 1) onMeta();
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('seeked', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('durationchange', onMeta);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onPause);
      v.removeEventListener('volumechange', onVolume);
      v.removeEventListener('webkitbeginfullscreen', onBeginNative);
      v.removeEventListener('webkitendfullscreen', onEndNative);
    };
  }, []);

  useEffect(() => {
    const onFs = () => {
      const el = document.fullscreenElement ?? (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement;
      setFullscreen(el === rootRef.current);
    };
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('webkitfullscreenchange', onFs);
    };
  }, []);

  // Controls fade after a pause in pointer activity while playing; any
  // movement, touch or focus inside the player brings them back.
  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      const v = videoRef.current;
      const active = document.activeElement;
      // Never hide the bar from someone using it with the keyboard.
      const keyboardInside = !!active && !!rootRef.current?.contains(active) && active.matches(':focus-visible');
      if (v && !v.paused && !keyboardInside) setIdle(true);
    }, IDLE_MS);
  }, []);
  useEffect(() => {
    if (playing) wake();
    else {
      window.clearTimeout(idleTimer.current);
      setIdle(false);
    }
  }, [playing, wake]);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const start = () => {
    setStarted(true);
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* Playback blocked or failed: the controls stay available. */
    });
    requestAnimationFrame(() => playRef.current?.focus({ preventScroll: true }));
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  const toggleCaptions = () => {
    const t = track();
    if (!t) return;
    t.mode = t.mode === 'disabled' ? (nativeFullscreen.current ? 'showing' : 'hidden') : 'disabled';
    setMode(t.mode as TrackMode);
    if (t.mode === 'disabled') setCue('');
    else {
      const active = t.activeCues?.[0] as VTTCue | undefined;
      setCue(active ? active.text : '');
    }
  };

  const seek = (to: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.min(Math.max(0, to), v.duration);
    setTime(v.currentTime);
  };

  const toggleFullscreen = () => {
    const root = rootRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
    if (!root || !v) return;
    if (document.fullscreenElement || doc.webkitFullscreenElement) {
      (document.exitFullscreen ?? doc.webkitExitFullscreen)?.call(document);
    } else if (root.requestFullscreen) {
      root.requestFullscreen().catch(() => {});
    } else if (root.webkitRequestFullscreen) {
      root.webkitRequestFullscreen();
    } else if (v.webkitEnterFullscreen) {
      v.webkitEnterFullscreen();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!started || e.metaKey || e.ctrlKey || e.altKey) return;
    const onSeekBar = (e.target as HTMLElement).classList.contains('video__seek');
    const key = e.key.toLowerCase();
    if (key === 'k' || (key === ' ' && e.target === rootRef.current)) togglePlay();
    else if (key === 'c') toggleCaptions();
    else if (key === 'm') toggleMute();
    else if (key === 'f') toggleFullscreen();
    else if (!onSeekBar && key === 'arrowleft') seek((videoRef.current?.currentTime ?? 0) - 5);
    else if (!onSeekBar && key === 'arrowright') seek((videoRef.current?.currentTime ?? 0) + 5);
    else return;
    e.preventDefault();
    wake();
  };

  const captionsOn = mode !== 'disabled';
  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={rootRef}
      className="video"
      data-started={started || undefined}
      data-playing={playing || undefined}
      data-idle={(started && idle) || undefined}
      data-fullscreen={fullscreen || undefined}
      style={ratio ? { aspectRatio: ratio } : undefined}
      onPointerMove={started ? wake : undefined}
      onPointerDown={started ? wake : undefined}
      onFocus={started ? wake : undefined}
      onKeyDown={onKeyDown}
    >
      <video
        ref={videoRef}
        className="video__media"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        aria-label={title}
        tabIndex={-1}
        onClick={() => {
          if (!started) return;
          // On touch, a tap on a faded player first brings the controls back.
          if (idle) wake();
          else togglePlay();
        }}
      >
        {captions && <track ref={trackRef} kind="subtitles" src={captions.src} srcLang={captions.srclang} label={captions.label} default />}
      </video>

      {!started && (
        <>
          <span className="video__tint" aria-hidden="true" />
          <button type="button" className="video__play" onClick={start}>
            {/* Figma play glyph (play.svg) on the mandarin CTA disc drawn by CSS. */}
            <svg viewBox="0 0 72 72" width="72" height="72" aria-hidden="true">
              <path
                d="M50 35.134C50.6667 35.5189 50.6667 36.4811 50 36.866L29.75 48.5574C29.0833 48.9423 28.25 48.4611 28.25 47.6913L28.25 24.3087C28.25 23.5389 29.0833 23.0577 29.75 23.4426L50 35.134Z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Play video: {title}</span>
          </button>
        </>
      )}

      {started && (
        <>
          {mode === 'hidden' && cue && (
            <div className="video__captions" aria-hidden="true">
              <span>{cue}</span>
            </div>
          )}
          <div className="video__controls" role="group" aria-label="Video controls">
            <input
              className="video__seek"
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(time, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${clock(time)} of ${clock(duration)}`}
              style={{ '--p': `${progress}%` } as CSSProperties}
            />
            <div className="video__bar">
              <button ref={playRef} type="button" className="video__btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13M16 5.5v13" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path className="fill" d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2Z" /></svg>
                )}
              </button>
              <span className="video__time">
                <span className="sr-only">Time </span>
                {clock(time)} / {clock(duration)}
              </span>
              <span className="video__spacer" />
              <button type="button" className="video__btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path className="fill" d="M4 9.5h3.2L12 5.6v12.8l-4.8-3.9H4z" />
                  {muted ? <path d="m16 9.5 5 5m0-5-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
                </svg>
              </button>
              {captions && (
                <button
                  type="button"
                  className="video__btn video__btn--cc"
                  onClick={toggleCaptions}
                  aria-pressed={captionsOn}
                  aria-label="Subtitles"
                  title={captionsOn ? 'Subtitles on (c)' : 'Subtitles off (c)'}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="2.75" y="5.25" width="18.5" height="13.5" rx="2.6" />
                    <path d="M10.4 10.1a2.4 2.4 0 1 0 0 3.8M17.2 10.1a2.4 2.4 0 1 0 0 3.8" />
                  </svg>
                </button>
              )}
              <button type="button" className="video__btn" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}>
                {fullscreen ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4.5V9H4.5M15 4.5V9h4.5M9 19.5V15H4.5M15 19.5V15h4.5" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15" /></svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
