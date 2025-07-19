import React from "react";
import { Header } from "../components/common/Header";
import { TransactionForm } from "../components/forms/TransactionForm";
import { TransactionList } from "../components/common/TransactionList";
import { useTransactions } from "../hooks/useTransactions";
import SampleDataButton from "../components/dev/SampleDataButton";
import TransactionCharts from "../components/charts/TransactionCharts";
import DetailedCharts from "../components/charts/DetailedCharts";

export const Home: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    refreshTransactions,
    forceReload,
    loading,
    error,
  } = useTransactions();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  エラーが発生しました
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={refreshTransactions}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  再試行
                </button>
                <button
                  onClick={forceReload}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                >
                  リロード
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 手動リフレッシュボタン */}
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2">
            <button
              onClick={refreshTransactions}
              disabled={loading}
              className={`flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <span>🔄</span>
              <span>{loading ? "データ取得中..." : "データ更新"}</span>
            </button>

            <button
              onClick={forceReload}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
            >
              <span>↻</span>
              <span>ページリロード</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          {/* 基本チャート */}
          <SampleDataButton />
          <TransactionCharts transactions={transactions} />

          {/* 詳細チャート（新規追加） */}
          <div className="mt-8">
            <DetailedCharts transactions={transactions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TransactionForm onAddTransaction={addTransaction} />
          </div>

          <div>
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>

        {/* データ取得状況表示（開発環境のみ） */}
        {!import.meta.env.PROD && (
          <div className="mt-8 bg-gray-100 p-4 rounded text-sm text-gray-600">
            <h4 className="font-medium">🔧 デバッグ情報</h4>
            <p>取引件数: {transactions.length}件</p>
            <p>読み込み状態: {loading ? "読み込み中" : "完了"}</p>
            <p>エラー: {error || "なし"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
