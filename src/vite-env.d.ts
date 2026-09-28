/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** JSON POST endpoint for early-access requests (see src/lib/early-access.ts). */
  readonly VITE_EARLY_ACCESS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
