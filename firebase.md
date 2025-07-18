# Firebase環境構築ガイド

React + TypeScript プロジェクトにFirebaseを導入するための完全ガイドです。

## 📋 目次

1. [Firebaseプロジェクト作成](#firebaseプロジェクト作成)
2. [認証設定](#認証設定)
3. [Firestore Database設定](#firestore-database設定)
4. [Firebase SDK設定](#firebase-sdk設定)
5. [環境変数設定](#環境変数設定)
6. [動作確認](#動作確認)
7. [トラブルシューティング](#トラブルシューティング)

## 🔥 Firebaseプロジェクト作成

### Step 1: Firebase Console にアクセス

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. Googleアカウントでログイン
3. 「プロジェクトを追加」をクリック

### Step 2: プロジェクト設定

```
プロジェクト名: your-app-name (任意)
プロジェクトID: your-app-name-xxxxx (自動生成)
Google Analytics: 有効（推奨）
```

### Step 3: ウェブアプリを追加

1. プロジェクト画面で「ウェブアプリ」アイコン `</>` をクリック
2. アプリ名を入力（例：`My Web App`）
3. 「Firebase Hosting も設定する」はチェックしない（後で設定可能）
4. 「アプリを登録」をクリック
5. **SDK設定をメモまたはコピーしておく**

## 🔐 認証設定

### Step 1: Authentication有効化

1. 左側メニューから「Authentication」を選択
2. 「始める」ボタンをクリック
3. 「Sign-in method」タブを選択

### Step 2: メール/パスワード認証を有効化

1. 「メール/パスワード」をクリック
2. 「有効にする」をオンに切り替え
3. 「保存」をクリック

```yaml
# 設定完了後の状態
Authentication:
  - Email/Password: ✅ 有効
  - メールリンク: ❌ 無効（オプション）
```

### Step 3: 認証ドメイン設定（本番環境時）

1. 「Settings」→「Authorized domains」
2. 本番ドメインを追加（例：`your-app.com`）

## 📊 Firestore Database設定

### Step 1: Firestore Database作成

1. 左側メニューから「Firestore Database」を選択
2. 「データベースを作成」ボタンをクリック

### Step 2: セキュリティルール選択

**開発時**：「テストモードで開始」を選択

```javascript
// テストモードのルール（30日間限定）
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

**本番時**：認証ユーザーのみアクセス可能にする

```javascript
// 本番環境用セキュリティルール
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー別データ分離
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 3: ロケーション選択

```
推奨ロケーション: asia-northeast1 (Tokyo)
理由: 日本からのアクセスで最も低レイテンシ
```

## ⚙️ Firebase SDK設定

### Step 1: Firebase インストール

```bash
npm install firebase
```

### Step 2: Firebase設定ファイル作成

```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 環境変数からFirebase設定を取得
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
n  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASURE_ID,
};

// Firebase設定の検証
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASURE_ID',
];

const missingEnvVars = requiredEnvVars.filter(
  envVar => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error('⚠️ 以下のFirebase環境変数が設定されていません:');
  missingEnvVars.forEach(envVar => console.error(`  - ${envVar}`));
  throw new Error('Firebase設定が不完全です');
}

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firebase サービスをエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app);

// デバッグ用関数
export const checkFirebaseConfig = () => {
  console.log('🔥 Firebase設定チェック:');
  console.log(`  - Project ID: ${firebaseConfig.projectId}`);
  console.log(`  - Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(`  - API Key: ${firebaseConfig.apiKey ? '設定済み' : '未設定'}`);
};
```

### Step 3: TypeScript型定義

```typescript
// src/vite-env.d.ts（Viteプロジェクトの場合）
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 🔑 環境変数設定

### Step 1: .envファイル作成

```bash
# プロジェクトルートに.envファイルを作成
touch .env
```

### Step 2: Firebase設定値を設定

Firebase Console → プロジェクト設定 → SDK設定から取得した値を設定：

```bash
# .env ファイル
# ⚠️ 重要: ダブルクォートは使用しない！

VITE_FIREBASE_API_KEY=AIzaSyC-your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=hogehoge
```

### Step 3: Git管理除外

```bash
# .gitignoreに追加
echo "" >> .gitignore
echo "# Environment variables" >> .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### Step 4: .env.example作成

```bash
# .env.example（Git管理対象）
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=hogehoge
```

## ✅ 動作確認

### Step 1: Firebase接続テスト

```typescript
// アプリのエントリーポイントで確認
import { checkFirebaseConfig } from './services/firebase';

// アプリ起動時に実行
checkFirebaseConfig();
```

### Step 2: 認証テスト

```typescript
// 簡単な認証テスト
import { auth } from './services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const testAuth = async () => {
  try {
    console.log('🔐 認証テスト開始');
    console.log('Auth instance:', auth);
    console.log('✅ 認証サービス初期化成功');
  } catch (error) {
    console.error('❌ 認証エラー:', error);
  }
};
```

### Step 3: Firestoreテスト

```typescript
// 簡単なFirestoreテスト
import { db } from './services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const testFirestore = async () => {
  try {
    console.log('📊 Firestoreテスト開始');
    console.log('Firestore instance:', db);
    console.log('✅ Firestoreサービス初期化成功');
  } catch (error) {
    console.error('❌ Firestoreエラー:', error);
  }
};
```

## 🚨 トラブルシューティング

### 1. 環境変数が読み込まれない

**症状**：`undefined` や空文字が表示される

**原因と解決**：
```bash
# 原因1: ファイル名が間違っている
# 正しいファイル名: .env

# 原因3: 開発サーバーが再起動されていない
npm run dev
```

### 2. CONFIGURATION_NOT_FOUND エラー

**症状**：Firebase接続で400エラー

**原因と解決**：

1. **Firestore Database未作成**
   ```
   Firebase Console → Firestore Database → 「データベースを作成」
   ```

2. **Authentication未有効化**
   ```
   Firebase Console → Authentication → 「始める」
   ```

3. **プロジェクトID間違い**
   ```
   Firebase ConsoleでプロジェクトIDを再確認
   .envのVITE_FIREBASE_PROJECT_IDと一致させる
   ```

### 3. 認証エラー (auth/...)

**よくあるエラーと対処法**：

```typescript
const getAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'メールアドレスまたはパスワードが間違っています';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています';
    case 'auth/weak-password':
      return 'パスワードは6文字以上で入力してください';
    case 'auth/invalid-email':
      return '無効なメールアドレスです';
    case 'auth/operation-not-allowed':
      return 'この認証方法は有効化されていません';
    default:
      return `認証エラー: ${errorCode}`;
  }
};
```

### 4. Firestoreセキュリティルールエラー

**症状**：`permission-denied` エラー

**解決**：
```javascript
// 開発時は一時的にテストモードに戻す
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // 一時的な設定
    }
  }
}
```

### 5. ネットワークエラー

**症状**：`network-request-failed`

**解決**：
```typescript
// タイムアウト設定
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

// 開発環境でエミュレータ使用（オプション）
if (import.meta.env.DEV) {
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📝 Firebase Console チェックリスト

設定完了後、以下を確認：

- ✅ **プロジェクト作成済み**
- ✅ **ウェブアプリ登録済み**
- ✅ **Authentication有効化済み**
- ✅ **メール/パスワード認証有効化済み**
- ✅ **Firestore Database作成済み**
- ✅ **セキュリティルール設定済み**
- ✅ **Firebase SDK設定取得済み**

## 🔧 本番環境への移行

### セキュリティルール更新

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証ユーザーのみアクセス可能
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 公開データ（もしあれば）
    match /public/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

### 本番環境変数

```bash
# .env.production
VITE_FIREBASE_API_KEY=production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-prod-domain.firebaseapp.com
# ... 他の本番環境設定
```
