import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import logo from '../../../design-system/brand/kinage-logo.svg';
import menu from '../../assets/figma/hero-video-menu.svg';
import play from '../../assets/figma/hero-video-play.svg';
import texture from '../../assets/figma/hero-video-texture.webp';
import { VideoPlayer, type VideoPlayerHandle } from '../../components/VideoPlayer';
import { HERO } from '../../content/home';
import { EXPLAINER } from '../../content/media';
import { lockScroll } from '../../motion/smoothScroll';
import './HeroVideo.css';

/**
 * The hero's video block (Figma North-Star 706:2809): a lavender panel inside
 * the hero card, under the actions, with a phone preview on the left (709:3505,
 * drawn in HTML from the Figma layers: the Kinage lockup, the menu icon, the
 * play disc and three skeleton lines), a white fade that crops the phone at
 * the bottom (706:2812), and the label and heading on the right.
 *
 * The whole block is one button. It opens the existing explainer
 * (content/media.ts) in the existing player (subtitles on by default, CC
 * toggle, full screen) inside a native modal dialog that reuses the contact
 * dialog's surface (.ea): page inert, Esc or the backdrop closes, focus
 * returns to the block. Playback starts from the click; closing unmounts the
 * player, so it stops.
 */
export function HeroVideo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const playerRef = useRef<VideoPlayerHandle>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    const release = lockScroll();
    // Still inside the click's user activation, so sound may start.
    const raf = requestAnimationFrame(() => playerRef.current?.start());
    return () => {
      cancelAnimationFrame(raf);
      release();
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <div className="hero__video">
      <button type="button" className="hero-video" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="hero-video__text">
          <span className="hero-video__label">{HERO.video.label}</span>
          <strong className="hero-video__title">{HERO.video.title}</strong>
        </span>
        <span className="hero-video__phone" aria-hidden="true">
          <span className="hero-video__screen">
            <img className="hero-video__texture" src={texture} alt="" width={551} height={249} />
            <img className="hero-video__logo" src={logo} alt="" width={151} height={34} />
            <span className="hero-video__menu">
              <img src={menu} alt="" width={10} height={6} />
            </span>
            <img className="hero-video__play" src={play} alt="" width={72} height={72} />
            <span className="hero-video__line" />
            <span className="hero-video__line" />
            <span className="hero-video__line" />
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="ea ea--video"
        aria-labelledby={titleId}
        style={{ '--video-ratio': EXPLAINER.width / EXPLAINER.height } as CSSProperties}
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="ea__panel ea__panel--video">
          <h2 className="sr-only" id={titleId}>
            {EXPLAINER.title}
          </h2>
          <button type="button" className="ea__close" onClick={() => setOpen(false)} aria-label="Close video">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
          {open && (
            <VideoPlayer
              ref={playerRef}
              variant="hero"
              src={EXPLAINER.src}
              poster={EXPLAINER.poster}
              title={EXPLAINER.title}
              captions={EXPLAINER.captions}
            />
          )}
        </div>
      </dialog>
    </div>
  );
}
