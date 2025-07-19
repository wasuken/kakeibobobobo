import React, { useState } from "react";
import {
  Line,
  AreaChart,
  Area,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useChartData } from "../../hooks/useChartData";
import { Transaction } from "../../types";

interface DetailedChartsProps {
  transactions: Transaction[];
}

const DetailedCharts: React.FC<DetailedChartsProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<"monthly" | "weekly" | "trend">(
    "monthly",
  );
  const { monthlyData, weeklyData, trendData, categoryTrends } =
    useChartData(transactions);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${
                entry.dataKey === "savingsRate"
                  ? "貯蓄率"
                  : entry.dataKey === "income"
                    ? "収入"
                    : entry.dataKey === "expense"
                      ? "支出"
                      : entry.dataKey === "balance"
                        ? "収支"
                        : entry.dataKey === "dailyAverage"
                          ? "日平均支出"
                          : entry.dataKey
              }: ${
                entry.dataKey === "savingsRate"
                  ? `${entry.value.toFixed(1)}%`
                  : `¥${entry.value.toLocaleString()}`
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // トレンド表示アイコン
  const TrendIcon = ({
    value,
    className = "",
  }: {
    value: number;
    className?: string;
  }) => {
    if (value > 5)
      return <TrendingUp className={`w-4 h-4 text-green-500 ${className}`} />;
    if (value < -5)
      return <TrendingDown className={`w-4 h-4 text-red-500 ${className}`} />;
    return <Minus className={`w-4 h-4 text-gray-400 ${className}`} />;
  };

  return (
    <div className="space-y-6">
      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: "monthly", label: "月別推移", icon: Calendar },
            { key: "weekly", label: "週別推移", icon: BarChart3 },
            { key: "trend", label: "トレンド分析", icon: TrendingUp },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === key
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 月別推移チャート */}
      {activeTab === "monthly" && (
        <div className="space-y-6">
          {/* 月別収支推移 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              月別収支推移（過去12ヶ月）
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="amount"
                  tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="amount"
                  dataKey="income"
                  fill="#10B981"
                  name="収入"
                />
                <Bar
                  yAxisId="amount"
                  dataKey="expense"
                  fill="#EF4444"
                  name="支出"
                />
                <Line
                  yAxisId="amount"
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="収支"
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="savingsRate"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="貯蓄率(%)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 月別貯蓄率推移 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              月別貯蓄率推移
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(1)}%`,
                    "貯蓄率",
                  ]}
                  labelFormatter={(label) => `期間: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="savingsRate"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 週別推移チャート */}
      {activeTab === "weekly" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              週別収支推移（過去8週間）
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="収入" />
                <Bar dataKey="expense" fill="#EF4444" name="支出" />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="収支"
                />
                <Line
                  type="monotone"
                  dataKey="dailyAverage"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  name="日平均支出"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* トレンド分析 */}
      {activeTab === "trend" && (
        <div className="space-y-6">
          {/* 今月vs先月比較 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              今月 vs 先月 比較
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-green-800">収入</h4>
                  <TrendIcon value={trendData.changePercent.income} />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ¥{trendData.currentMonth.income.toLocaleString()}
                </p>
                <p className="text-sm text-green-700">
                  先月: ¥{trendData.previousMonth.income.toLocaleString()}
                </p>
                <p
                  className={`text-sm font-medium ${
                    trendData.changePercent.income > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trendData.changePercent.income > 0 ? "+" : ""}
                  {trendData.changePercent.income.toFixed(1)}%
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-red-800">支出</h4>
                  <TrendIcon value={-trendData.changePercent.expense} />
                </div>
                <p className="text-2xl font-bold text-red-600">
                  ¥{trendData.currentMonth.expense.toLocaleString()}
                </p>
                <p className="text-sm text-red-700">
                  先月: ¥{trendData.previousMonth.expense.toLocaleString()}
                </p>
                <p
                  className={`text-sm font-medium ${
                    trendData.changePercent.expense > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {trendData.changePercent.expense > 0 ? "+" : ""}
                  {trendData.changePercent.expense.toFixed(1)}%
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-blue-800">収支</h4>
                  <TrendIcon value={trendData.changePercent.balance} />
                </div>
                <p
                  className={`text-2xl font-bold ${
                    trendData.currentMonth.balance >= 0
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  ¥{trendData.currentMonth.balance.toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">
                  先月: ¥{trendData.previousMonth.balance.toLocaleString()}
                </p>
                <p
                  className={`text-sm font-medium ${
                    trendData.changePercent.balance > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trendData.changePercent.balance > 0 ? "+" : ""}
                  {trendData.changePercent.balance.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* カテゴリ別トレンド */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              カテゴリ別変化率（今月 vs 先月）
            </h3>
            {categoryTrends.length > 0 ? (
              <div className="space-y-3">
                {categoryTrends.slice(0, 8).map((trend) => (
                  <div
                    key={trend.category}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <TrendIcon value={trend.changePercent} />
                      <span className="font-medium">{trend.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ¥{trend.currentMonth.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm ${
                          trend.changePercent > 0
                            ? "text-red-600"
                            : trend.changePercent < 0
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {trend.changePercent > 0 ? "+" : ""}
                        {trend.changePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                比較データがありません
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedCharts;
