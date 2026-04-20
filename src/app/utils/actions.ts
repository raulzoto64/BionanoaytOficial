/**
 * Interface for CTA content
 */
export interface ActionData {
  type?: string;
  link?: string;
}

/** UUID regex — if a ctaLink looks like this, it's a popup ID, not a URL */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Detects if a given string is a popup ID rather than a navigable link. */
export const isPopupId = (value: string): boolean => 
  UUID_REGEX.test(value.trim()) || 
  value.trim().startsWith('form-') || 
  value.trim() === 'exit-intent';

/**
 * Auto-resolves the action type for a ctaLink:
 * - UUID → 'popup'
 * - Starts with '/' or '#' → 'route' (internal / anchor)
 * - Everything else → 'url' (external)
 */
export const resolveCtaAction = (value: string | undefined): 'popup' | 'route' | 'url' | null => {
  if (!value) return null;
  if (isPopupId(value)) return 'popup';
  if (value.startsWith('/') || value.startsWith('#')) return 'route';
  return 'url';
};

/**
 * Shared utility to handle ALL types of actions in the application.
 * Supports: Internal Routes (path/anchor), Popups (UUID), and External URLs.
 *
 * If `type` is omitted it is auto-detected from `value`.
 */
export const handleAction = (type: string | undefined, value: string | undefined, navigate: any, state?: any) => {
  if (!value) {
    console.warn('⚠️ [ACTION] Attempted to trigger action without value');
    return;
  }

  const normalizedType = type || resolveCtaAction(value) || 'url';

  console.log('🔘 [ACTION] Triggering:', { type: normalizedType, value, state });
  
  // ✅ Guardar origen para efecto de "regreso perfecto"
  if (state?.sectionId && typeof window !== 'undefined') {
    sessionStorage.setItem('bx_return_section', state.sectionId);
    sessionStorage.setItem('bx_return_from', window.location.pathname);
  }

  if (normalizedType === 'popup') {
    // OPEN POPUP — fire custom event; Layout's useExitIntent listens to this
    window.dispatchEvent(new CustomEvent('popup:open', { detail: { popupId: value } }));
  } else if (normalizedType === 'route') {
    // INTERNAL NAVIGATION (path or anchor)
    if (value.startsWith('#')) {
      const el = document.getElementById(value.slice(1));
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    navigate(value, { state });
  } else if (normalizedType === 'chat') {
    // OPEN CHAT BUBBLE
    window.dispatchEvent(new CustomEvent('chat:open'));
  } else {
    // EXTERNAL URL
    let url = value;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Convenience wrapper — returns an onClick handler ready to be spread onto any element.
 * Use this instead of raw <a href> whenever the link might be a popup ID.
 *
 * @example
 * <button {...makeCtaProps(section.content.ctaLink, navigate)}>
 *   {section.content.ctaText}
 * </button>
 */
export const makeCtaProps = (value: string | undefined, navigate: any) => ({
  href: undefined as undefined,  // never navigate via href — always use onClick
  onClick: (e: React.MouseEvent) => {
    e.preventDefault();
    handleAction(undefined, value, navigate);
  },
});
