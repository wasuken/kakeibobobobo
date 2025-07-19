import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addSampleDataToFirestore } from "../../utils/generateSampleData";

const SampleDataButton: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddSampleData = async () => {
    if (!currentUser) {
      setMessage("ログインが必要です");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await addSampleDataToFirestore(currentUser.uid, 30);
      setMessage("✅ 30件のサンプルデータを追加しました！");
    } catch (error) {
      console.error("Error adding sample data:", error);
      setMessage("❌ サンプルデータの追加に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 開発環境でのみ表示
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-yellow-800">開発者モード</h3>
          <p className="text-sm text-yellow-700 mt-1">
            チャート表示のためのサンプルデータを追加できます
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
