import benPortrait1958 from '../assets/images/ben-terk-portrait-1958.webp';
import benPortrait979 from '../assets/images/ben-terk-portrait-979.webp';
import { withBase } from '../lib/base';

/**
 * Ben's portrait, his head breaking out of the purple rounded panel (client
 * file "Group 76", 1958 × 2413 native, same crop as the earlier 560 × 690
 * file; the panel's bottom is the image's bottom). Two copies: the native
 * size and half of it. `maxWidth` is half the native width, so the photo is
 * never drawn larger than the file allows at 2x.
 */
export const BEN_PORTRAIT = {
  src: benPortrait979,
  srcSet: `${benPortrait979} 979w, ${benPortrait1958} 1958w`,
  width: 1958,
  height: 2413,
  maxWidth: '979px',
} as const;

/**
 * The explainer video — the one final export already used on this page
 * (public/media/kinage-explainer.mp4, 63.5 s). `width` / `height` were read
 * from the file itself (1920 × 1080, square pixels) and only give the player
 * its first shape; the player re-reads the poster's and the file's own size
 * at runtime and follows those.
 */
export const EXPLAINER = {
  src: withBase('/media/kinage-explainer.mp4'),
  poster: withBase('/media/kinage-explainer-poster.jpg'),
  captions: { src: withBase('/media/kinage-explainer.en.vtt'), srclang: 'en', label: 'English' },
  title: 'Kinage explainer',
  width: 1920,
  height: 1080,
} as const;
