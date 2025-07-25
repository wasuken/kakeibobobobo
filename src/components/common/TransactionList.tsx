import React, { useState, useMemo } from "react";
import { Transaction, TransactionType } from "../../types";
import Pagination from "./Pagination";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | TransactionType>(
    "all",
  );
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // カテゴリ一覧を取得
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(transactions.map((transaction) => transaction.category)),
    );
    return ["all", ...uniqueCategories.sort()];
  }, [transactions]);

  // フィルター・検索・ソート済みのデータ
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // タイプフィルター
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === selectedType,
      );
    }

    // カテゴリフィルター
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.category === selectedCategory,
      );
    }

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // ソート
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.date || "").getTime() - new Date(b.date || "").getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    transactions,
    selectedType,
    selectedCategory,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  // ページネーション計算
  const totalItems = filteredAndSortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 合計計算（フィルター済み）
  const summary = useMemo(() => {
    const income = filteredAndSortedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredAndSortedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  }, [filteredAndSortedTransactions]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSortChange = (field: "date" | "amount" | "category") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">取引一覧</h2>
        <div className="text-right">
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-green-600 font-semibold">
                収入: ¥{summary.income.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-red-600 font-semibold">
                支出: ¥{summary.expense.toLocaleString()}
              </span>
            </div>
            <div
              className={`text-lg font-bold ${
                summary.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              収支: ¥{summary.balance.toLocaleString()}
            </div>
          </div>
          <div className="text-sm text-gray-500">{totalItems}件の取引</div>
        </div>
      </div>

      {/* フィルター・検索エリア */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* 検索 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            検索
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilterChange();
            }}
            placeholder="説明・カテゴリで検索"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* タイプフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            種別
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as "all" | TransactionType);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">すべて</option>
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </div>

        {/* カテゴリフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "全てのカテゴリ" : category}
              </option>
            ))}
          </select>
        </div>

        {/* 表示件数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            表示件数
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5件</option>
            <option value={10}>10件</option>
            <option value={20}>20件</option>
            <option value={50}>50件</option>
          </select>
        </div>

        {/* ソート */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            並び順
          </label>
          <div className="flex space-x-1">
            {[
              { key: "date", label: "日付" },
              { key: "amount", label: "金額" },
              { key: "category", label: "カテゴリ" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key as any)}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {label}
                {sortBy === key && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 取引一覧 */}
      <div className="space-y-2">
        {currentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {totalItems === 0
              ? "まだ取引が記録されていません"
              : "検索条件に一致する取引がありません"}
          </p>
        ) : (
          currentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex justify-between items-center p-3 border-l-4 border border-gray-200 rounded-md hover:bg-gray-50 ${
                transaction.type === "income"
                  ? "border-l-green-500 bg-green-50"
                  : "border-l-red-500 bg-red-50"
              }`}
            >
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-gray-500">
                  <span
                    className={`font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "収入" : "支出"}
                  </span>
                  {" • "}
                  {transaction.category} • {transaction.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}¥
                  {transaction.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        showInfo={true}
        className="mt-6"
      />
    </div>
  );
};
