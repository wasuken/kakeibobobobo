import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addSampleDataToFirestore } from "../../utils/generateSampleData";

const SampleDataButton: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 環境変数でボタン表示を制御
  const showButton = import.meta.env.VITE_SHOW_SAMPLE_DATA_BUTTON === "true";

  const handleAddSampleData = async () => {
    if (!currentUser) {
      setMessage("ログインが必要です");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await addSampleDataToFirestore(currentUser.uid, 40);
      setMessage("✅ 40件のサンプルデータ（収支混合）を追加しました！");
    } catch (error) {
      console.error("Error adding sample data:", error);
      setMessage("❌ サンプルデータの追加に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 環境変数でfalseの場合は何も表示しない
  if (!showButton) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-yellow-800">開発者モード</h3>
          <p className="text-sm text-yellow-700 mt-1">
            収支チャート表示のためのサンプルデータを追加できます
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            環境変数 VITE_SHOW_SAMPLE_DATA_BUTTON で制御中
          </p>
        </div>
        <button
          onClick={handleAddSampleData}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded font-medium text-sm transition-colors
            ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }
          `}
        >
          {isLoading ? "追加中..." : "サンプルデータ追加"}
        </button>
      </div>

      {message && (
        <p
          className={`text-sm mt-2 ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default SampleDataButton;
