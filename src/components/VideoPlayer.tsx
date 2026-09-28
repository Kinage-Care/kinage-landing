import { useRef, useState } from 'react';
import playIcon from '../assets/figma/play.svg';
import './VideoPlayer.css';

type Props = {
  src: string;
  poster: string;
  title: string;
};

/**
 * Explainer video (Figma 562:4374): poster with the heather multiply tint and
 * the 72px violet play button. Nothing autoplays; sound starts only from the
 * user's click. Once started, native controls take over (pause, seek, volume,
 * fullscreen), and the video is removed from layout shifts by its aspect box.
 */
export function VideoPlayer({ src, poster, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* Playback blocked or failed: controls stay available. */
    });
    v.focus({ preventScroll: true });
  };

  return (
    <div className="video" data-started={started || undefined}>
      <video
        ref={videoRef}
        className="video__media"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        controls={started}
        aria-label={title}
        tabIndex={started ? 0 : -1}
      />
      {!started && (
        <>
          <span className="video__tint" aria-hidden="true" />
          <button type="button" className="video__play" onClick={start}>
            <img src={playIcon} alt="" width={72} height={72} />
            <span className="sr-only">Play video: {title}</span>
          </button>
        </>
      )}
    </div>
  );
}
