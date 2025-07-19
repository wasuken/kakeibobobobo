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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAddTransaction({
      amount: parseInt(amount),
      type,
      category,
      description,
      date,
    });

    setAmount("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">収支を追加</h2>

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
          />
        </div>
      </div>

      <button
        type="submit"
        className={`mt-4 w-full text-white p-2 rounded-md hover:opacity-90 ${
          type === "income"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {type === "income" ? "収入を追加" : "支出を追加"}
      </button>
    </form>
  );
};
