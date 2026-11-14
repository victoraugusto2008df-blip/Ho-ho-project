/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `true` liga o login simulado (JWT local, sem chamar o backend). */
  readonly VITE_AUTH_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
