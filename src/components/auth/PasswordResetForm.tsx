import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

interface PasswordResetFormProps {
  onBack?: () => void;
  defaultEmail?: string;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onBack,
  defaultEmail = "",
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("メールアドレスを入力してください");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setMessage("パスワードリセットメールを送信しました");
    } catch (error: any) {
      console.error("パスワードリセットエラー:", error);

      switch (error.code) {
        case "auth/user-not-found":
          setMessage("このメールアドレスは登録されていません");
          break;
        case "auth/invalid-email":
          setMessage("無効なメールアドレスです");
          break;
        case "auth/too-many-requests":
          setMessage(
            "リクエストが多すぎます。しばらく時間をおいてから再試行してください",
          );
          break;
        default:
          setMessage("リセットメールの送信に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            メールを送信しました
          </h2>
          <p className="text-gray-600 mb-4">
            {email} にパスワードリセット用のメールを送信しました。
          </p>
          <p className="text-sm text-gray-500 mb-6">
            メールが届かない場合は、迷惑メールフォルダも確認してください。
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setMessage("");
                setEmail("");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              別のメールアドレスで再送信
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                ログイン画面に戻る
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          パスワードリセット
        </h2>
        <p className="text-gray-600">
          登録済みのメールアドレスを入力してください
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@email.com"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "送信中..." : "リセットメールを送信"}
        </button>

        {message && (
          <div
            className={`p-3 rounded-md flex items-start ${
              success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {success ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                success ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </form>

      {onBack && (
        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            ログイン画面に戻る
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordResetForm;
