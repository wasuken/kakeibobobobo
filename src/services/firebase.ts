// Firebase設定とサービス関数
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 環境変数からFirebase設定を取得
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase設定の検証
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(
  envVar => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error('⚠️ 以下のFirebase環境変数が設定されていません:');
  missingEnvVars.forEach(envVar => console.error(`  - ${envVar}`));
  console.error('⚠️ .envファイルを確認してください');
}

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firebase サービスをエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app);

// 設定が正しく読み込まれているかチェック
export const checkFirebaseConfig = () => {
  console.log('🔥 Firebase設定チェック:');
  console.log(`  - Project ID: ${firebaseConfig.projectId}`);
  console.log(`  - Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(`  - API Key: ${firebaseConfig.apiKey ? '設定済み' : '未設定'}`);
};
