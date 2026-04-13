/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public contact email (footer, legal pages). Falls back to the built-in default when unset or empty. */
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
