import React, { useState, useMemo } from "react";
import { Expense } from "../../types";
import Pagination from "./Pagination";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
}) => {
  // フィルター・検索・ページネーション用ステート
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // カテゴリ一覧を取得
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(expenses.map((expense) => expense.category)),
    );
    return ["all", ...uniqueCategories.sort()];
  }, [expenses]);

  // フィルター・検索・ソート済みの支出データ
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    // カテゴリフィルター
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory,
      );
    }

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [expenses, selectedCategory, searchTerm, sortBy, sortOrder]);

  // ページネーション計算
  const totalItems = filteredAndSortedExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExpenses = filteredAndSortedExpenses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 総計算（フィルター済み）
  const total = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // フィルター変更時はページを1に戻す
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // ソート変更
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
        <h2 className="text-xl font-semibold">支出一覧</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">
            ¥{total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">{totalItems}件の支出</div>
        </div>
      </div>

      {/* フィルター・検索エリア */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
          <div className="flex space-x-2">
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

      {/* 支出一覧 */}
      <div className="space-y-2">
        {currentExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {totalItems === 0
              ? "まだ支出が記録されていません"
              : "検索条件に一致する支出がありません"}
          </p>
        ) : (
          currentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {expense.category} • {expense.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  ¥{expense.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
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
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        showInfo={true}
        className="mt-6"
      />
    </div>
  );
};
