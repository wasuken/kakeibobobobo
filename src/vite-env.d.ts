/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASURE_ID: string;

  // 開発者ツール制御
  readonly VITE_SHOW_SAMPLE_DATA_BUTTON?: string;
  readonly VITE_SHOW_DEBUG_INFO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
