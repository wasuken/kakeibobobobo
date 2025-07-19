import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      console.error("認証エラー:", error);

      // Firebase認証エラーの日本語化
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("メールアドレスまたはパスワードが間違っています");
          break;
        case "auth/email-already-in-use":
          setError("このメールアドレスは既に使用されています");
          break;
        case "auth/weak-password":
          setError("パスワードは6文字以上で入力してください");
          break;
        case "auth/invalid-email":
          setError("無効なメールアドレスです");
          break;
        default:
          setError("認証に失敗しました。もう一度お試しください");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">家計簿アプリ</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? "アカウントを作成" : "ログイン"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isSignup ? "6文字以上" : "パスワード"}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "処理中..." : isSignup ? "アカウント作成" : "ログイン"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isSignup
              ? "すでにアカウントをお持ちですか？ログイン"
              : "アカウントをお持ちでない方はこちら"}
          </button>
        </div>
      </div>
    </div>
  );
};
