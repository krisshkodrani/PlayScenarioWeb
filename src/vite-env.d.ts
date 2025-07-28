
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly MODE: string;
  // add more env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
