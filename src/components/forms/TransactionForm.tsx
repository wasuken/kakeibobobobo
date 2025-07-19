import React, { useState } from "react";
import {
  Transaction,
  TransactionType,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "../../types";

interface TransactionFormProps {
  onAddTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
}) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentCategories = () => {
    return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  };

  // タイプ変更時にカテゴリをリセット
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const categories =
      newType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(categories[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log("📝 フォーム送信中...", {
        amount,
        type,
        category,
        description,
        date,
      });

      await onAddTransaction({
        amount: parseInt(amount),
        type,
        category,
        description,
        date,
      });

      // 送信成功時にフォームをリセット
      setAmount("");
      setDescription("");
      console.log("✅ フォーム送信完了！");
    } catch (error) {
      console.error("❌ フォーム送信エラー:", error);
      alert("データの追加に失敗しました。ページをリロードしてください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 強制リロードボタン
  const handleForceReload = () => {
    if (confirm("ページをリロードしますか？未保存のデータは失われます。")) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">収支を追加</h2>
          <button
            type="button"
            onClick={handleForceReload}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
          >
            🔄 リロード
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 収入・支出選択 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              種別
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="income"
                  checked={type === "income"}
                  onChange={(e) =>
                    handleTypeChange(e.target.value as TransactionType)
                  }
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-green-600 font-medium">収入</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="expense"
                  checked={type === "expense"}
                  onChange={(e) =>
                    handleTypeChange(e.target.value as TransactionType)
                  }
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-red-600 font-medium">支出</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              金額
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="10000"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            >
              {getCurrentCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={type === "income" ? "給与" : "ランチ"}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 w-full text-white p-2 rounded-md transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : type === "income"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isSubmitting
            ? "追加中..."
            : type === "income"
              ? "収入を追加"
              : "支出を追加"}
        </button>
      </form>

      {/* デバッグ情報（開発環境のみ） */}
      {!import.meta.env.PROD && (
        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
          <p>🔧 デバッグ: {isSubmitting ? "送信中..." : "待機中"}</p>
        </div>
      )}
    </div>
  );
};
