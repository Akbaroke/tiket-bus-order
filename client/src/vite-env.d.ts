/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_MODE: string
  VITE_APP_URL: string
}

interface ImportMeta {
  env: ImportMetaEnv
}
