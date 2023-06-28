/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_URL: string
  VITE_APP_SALT: string
}

interface ImportMeta {
  env: ImportMetaEnv
}

export const env = import.meta.env