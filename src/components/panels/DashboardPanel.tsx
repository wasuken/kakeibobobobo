import React from "react";
import { Transaction } from "../../types";
import { useChartData } from "../../hooks/useChartData";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Calendar,
  ArrowRight,
  Plus,
  Minus,
  BarChart3,
} from "lucide-react";

interface DashboardPanelProps {
  transactions: Transaction[];
  onSectionChange?: (section: string) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  transactions,
  onSectionChange,
}) => {
  const { trendData, monthlyData } = useChartData(transactions);

  // 最新取引5件
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // 今月の統計
  const currentMonthStats = {
    income: trendData.currentMonth.income,
    expense: trendData.currentMonth.expense,
    balance: trendData.currentMonth.balance,
    transactionCount: transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const currentMonth = new Date();
      return (
        transactionDate.getMonth() === currentMonth.getMonth() &&
        transactionDate.getFullYear() === currentMonth.getFullYear()
      );
    }).length,
  };

  // 今月の貯蓄率
  const savingsRate =
    currentMonthStats.income > 0
      ? (currentMonthStats.balance / currentMonthStats.income) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* ウェルカムメッセージ */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">お疲れ様！</h2>
        <p className="text-blue-100">今月の家計管理状況をチェックしよう</p>
      </div>

      {/* メインKPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の収入</p>
              <p className="text-2xl font-bold text-green-600">
                ¥{currentMonthStats.income.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {trendData.changePercent.income > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm ml-1 ${
                trendData.changePercent.income > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trendData.changePercent.income > 0 ? "+" : ""}
              {trendData.changePercent.income.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">前月比</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の支出</p>
              <p className="text-2xl font-bold text-red-600">
                ¥{currentMonthStats.expense.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Minus className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {trendData.changePercent.expense > 0 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span
              className={`text-sm ml-1 ${
                trendData.changePercent.expense > 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {trendData.changePercent.expense > 0 ? "+" : ""}
              {trendData.changePercent.expense.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">前月比</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今月の収支</p>
              <p
                className={`text-2xl font-bold ${
                  currentMonthStats.balance >= 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                ¥{currentMonthStats.balance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {trendData.changePercent.balance > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm ml-1 ${
                trendData.changePercent.balance > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trendData.changePercent.balance > 0 ? "+" : ""}
              {trendData.changePercent.balance.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">前月比</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">貯蓄率</p>
              <p
                className={`text-2xl font-bold ${
                  savingsRate >= 20
                    ? "text-green-600"
                    : savingsRate >= 10
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`w-full bg-gray-200 rounded-full h-2`}>
              <div
                className={`h-2 rounded-full ${
                  savingsRate >= 20
                    ? "bg-green-500"
                    : savingsRate >= 10
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">目標: 20%以上</span>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          クイックアクション
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onSectionChange?.("transactions")}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Plus className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">
              収支を追加
            </span>
          </button>

          <button
            onClick={() => onSectionChange?.("charts")}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">
              チャート表示
            </span>
          </button>

          <button
            onClick={() => onSectionChange?.("analytics")}
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">
              詳細分析
            </span>
          </button>

          <button
            onClick={() => onSectionChange?.("transactions")}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">取引一覧</span>
          </button>
        </div>
      </div>

      {/* 最新取引 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">最新の取引</h3>
          <button
            onClick={() => onSectionChange?.("transactions")}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            すべて見る
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                  transaction.type === "income"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}¥
                    {transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>まだ取引が記録されていません</p>
            <button
              onClick={() => onSectionChange?.("transactions")}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              最初の取引を追加する
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPanel;
