import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { LINKS, isPending, resolveHref, type LinkKey } from '../content/links';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: LinkKey;
  children?: ReactNode;
};

/**
 * Anchor bound to a destination in content/links.ts. Pending destinations
 * resolve to their on-page fallback and carry data-destination="pending" so
 * they are easy to find; real external URLs open in a new tab.
 */
export function SmartLink({ to, children, ...rest }: Props) {
  const target = LINKS[to];
  const href = resolveHref(to);
  const pending = isPending(to);
  const opensNewTab = !pending && /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      data-destination={pending ? 'pending' : undefined}
      {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children ?? target.label}
    </a>
  );
}
