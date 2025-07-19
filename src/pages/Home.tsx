import React, { useState } from "react";
import { Header } from "../components/common/Header";
import { useTransactions } from "../hooks/useTransactions";
import SampleDataButton from "../components/dev/SampleDataButton";
import NavigationTabs, {
  SectionKey,
} from "../components/navigation/NavigationTabs";
import DashboardPanel from "../components/panels/DashboardPanel";
import TransactionsPanel from "../components/panels/TransactionsPanel";
import ChartsPanel from "../components/panels/ChartsPanel";
import AnalyticsPanel from "../components/panels/AnalyticsPanel";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");

  const {
    transactions,
    addTransaction,
    deleteTransaction,
    refreshTransactions,
    forceReload,
    loading,
    error,
  } = useTransactions();

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
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

        {/* 開発者用サンプルデータボタン */}
        <SampleDataButton />

        {/* メインナビゲーション */}
        <NavigationTabs
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* ローディング表示 */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <LoadingSpinner type="data" size="lg" />
          </div>
        )}

        {/* パネル表示（ローディング中は非表示） */}
        {!loading && (
          <>
            {activeSection === "dashboard" && (
              <DashboardPanel
                transactions={transactions}
                onSectionChange={handleSectionChange}
              />
            )}

            {activeSection === "transactions" && (
              <TransactionsPanel
                transactions={transactions}
                onAddTransaction={addTransaction}
                onDeleteTransaction={deleteTransaction}
              />
            )}

            {activeSection === "charts" && (
              <ChartsPanel transactions={transactions} />
            )}

            {activeSection === "analytics" && (
              <AnalyticsPanel transactions={transactions} />
            )}
          </>
        )}

        {/* 手動更新ボタン（フッター） */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={refreshTransactions}
              disabled={loading}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              }`}
            >
              <span>🔄</span>
              <span>{loading ? "更新中..." : "データ更新"}</span>
            </button>

            <button
              onClick={forceReload}
              className="flex items-center space-x-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm shadow-sm"
            >
              <span>↻</span>
              <span>ページリロード</span>
            </button>
          </div>
        </div>

        {/* デバッグ情報（開発環境のみ） */}
        {import.meta.env.VITE_SHOW_DEBUG_INFO && (
          <div className="mt-6 bg-gray-800 text-green-400 p-4 rounded-lg text-sm font-mono">
            <h4 className="font-bold mb-2">🔧 デバッグ情報</h4>
            <p>現在のセクション: {activeSection}</p>
            <p>取引件数: {transactions.length}件</p>
            <p>読み込み状態: {loading ? "読み込み中" : "完了"}</p>
            <p>エラー: {error || "なし"}</p>
            <div className="mt-2 text-xs text-gray-400">
              <p>
                環境変数制御: VITE_SHOW_DEBUG_INFO ={" "}
                {import.meta.env.VITE_SHOW_DEBUG_INFO}
              </p>
              <p>
                サンプルボタン: VITE_SHOW_SAMPLE_DATA_BUTTON ={" "}
                {import.meta.env.VITE_SHOW_SAMPLE_DATA_BUTTON}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
