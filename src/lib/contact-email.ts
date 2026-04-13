const DEFAULT_CONTACT_EMAIL = 'kovvalole@gmail.com'

function resolveContactEmail(): string {
  const v = import.meta.env.VITE_CONTACT_EMAIL
  if (typeof v === 'string' && v.trim() !== '') {
    return v.trim()
  }
  return DEFAULT_CONTACT_EMAIL
}

/** Public contact address (footer, legal pages). Set `VITE_CONTACT_EMAIL` to override. */
export const contactEmail = resolveContactEmail()
