import type { PageMeta } from '../content/meta';

/** Shows a page's title and meta description in the document head. */
export function applyPageMeta({ title, description }: PageMeta) {
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
}
