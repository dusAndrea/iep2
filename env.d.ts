/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CARBON_API_URL: string;
  readonly VITE_OPENROUTESERVICE_API_KEY: string;
  readonly VITE_GREEN_URL: string;
  readonly VITE_NEWS_API: string;
  readonly VITE_FIREBASE_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
