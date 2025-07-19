import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PasswordResetForm from "../auth/PasswordResetForm";
import {
  User,
  Mail,
  Shield,
  Key,
  Download,
  Trash2,
  Info,
  Settings,
} from "lucide-react";

const SettingsPanel: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    // TODO: データエクスポート機能（将来実装）
    alert("データエクスポート機能は将来実装予定です");
  };

  const handleDeleteAccount = () => {
    // TODO: アカウント削除機能（将来実装）
    alert("アカウント削除機能は将来実装予定です");
  };

  if (showPasswordReset) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">設定</h2>
          <p className="text-gray-600">パスワードリセット</p>
        </div>

        <PasswordResetForm
          defaultEmail={currentUser?.email || ""}
          onBack={() => setShowPasswordReset(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* パネルヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          設定
        </h2>
        <p className="text-gray-600">
          アカウント情報の管理とアプリケーションの設定を行います。
        </p>
      </div>

      {/* アカウント情報 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          アカウント情報
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-800">メールアドレス</p>
                <p className="text-sm text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-800">ユーザーID</p>
                <p className="text-sm text-gray-600 font-mono">
                  {currentUser?.uid}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="font-medium text-gray-800">アカウント作成日</p>
                <p className="text-sm text-gray-600">
                  {currentUser?.metadata.creationTime
                    ? new Date(
                        currentUser.metadata.creationTime,
                      ).toLocaleDateString("ja-JP")
                    : "不明"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* セキュリティ設定 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          セキュリティ
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">パスワード変更</p>
              <p className="text-sm text-gray-600">
                メール経由でパスワードをリセットできます
              </p>
            </div>
            <button
              onClick={() => setShowPasswordReset(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              変更する
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">最終ログイン</p>
              <p className="text-sm text-gray-600">
                {currentUser?.metadata.lastSignInTime
                  ? new Date(
                      currentUser.metadata.lastSignInTime,
                    ).toLocaleString("ja-JP")
                  : "不明"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* データ管理 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          データ管理
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">データエクスポート</p>
              <p className="text-sm text-gray-600">
                取引データをCSV形式でダウンロード（将来実装予定）
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
            >
              エクスポート
            </button>
          </div>
        </div>
      </div>

      {/* 危険な操作 */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
        <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
          <Trash2 className="w-5 h-5 mr-2" />
          危険な操作
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-red-800">アカウント削除</p>
              <p className="text-sm text-red-600">
                全てのデータが完全に削除されます（将来実装予定）
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled
              className="bg-red-300 text-red-500 px-4 py-2 rounded-md cursor-not-allowed"
            >
              削除する
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">ログアウト</p>
              <p className="text-sm text-gray-600">
                アプリからログアウトします
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* アプリ情報 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          アプリケーション情報
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">バージョン</p>
            <p className="font-mono text-gray-800">v1.0.0-beta</p>
          </div>
          <div>
            <p className="text-gray-600">環境</p>
            <p className="font-mono text-gray-800">
              {import.meta.env.PROD ? "Production" : "Development"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">最終更新</p>
            <p className="font-mono text-gray-800">2025-01-20</p>
          </div>
          <div>
            <p className="text-gray-600">開発者ツール</p>
            <p className="font-mono text-gray-800">
              {import.meta.env.VITE_SHOW_DEBUG_INFO === "true" ? "ON" : "OFF"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
