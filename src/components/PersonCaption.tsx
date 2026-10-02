/**
 * Ben's name and role under his photo — the home Ben section and /our-story
 * share it (styles: base.css .person-caption). One switch for both pages:
 *   ''                       left-aligned with the photo (applied)
 *   'person-caption--center' centred under the photo
 *   'person-caption--inline' name and role on one line
 */
export const PERSON_CAPTION_VARIANT = '';

export function PersonCaption({ name, role, className }: { name: string; role: string; className?: string }) {
  return (
    <figcaption className={['person-caption', PERSON_CAPTION_VARIANT, className].filter(Boolean).join(' ')}>
      <strong className="person-caption__name">{name}</strong>
      <span className="person-caption__role">{role}</span>
    </figcaption>
  );
}
