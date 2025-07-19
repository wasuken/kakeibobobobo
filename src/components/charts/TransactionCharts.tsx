import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  ComposedChart,
} from "recharts";
import { Transaction } from "../../types";

interface TransactionChartsProps {
  transactions: Transaction[];
}

// カテゴリ別の色定義
const CATEGORY_COLORS: { [key: string]: string } = {
  // 収入カテゴリ（緑系）
  給与: "#10B981",
  ボーナス: "#059669",
  副業: "#047857",
  投資: "#065F46",
  その他収入: "#064E3B",
  // 支出カテゴリ（赤・オレンジ系）
  食費: "#EF4444",
  交通費: "#F59E0B",
  娯楽: "#8B5CF6",
  日用品: "#06B6D4",
  衣服: "#EC4899",
  医療費: "#F97316",
  その他: "#6B7280",
};

const TransactionCharts: React.FC<TransactionChartsProps> = ({
  transactions,
}) => {
  // 収支サマリー
  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // カテゴリ別集計データ
  const categoryData = useMemo(() => {
    const incomeByCategory: { [key: string]: number } = {};
    const expenseByCategory: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeByCategory[transaction.category] =
          (incomeByCategory[transaction.category] || 0) + transaction.amount;
      } else {
        expenseByCategory[transaction.category] =
          (expenseByCategory[transaction.category] || 0) + transaction.amount;
      }
    });

    return {
      income: Object.entries(incomeByCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          color: CATEGORY_COLORS[category] || "#10B981",
        }))
        .sort((a, b) => b.amount - a.amount),
      expense: Object.entries(expenseByCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          color: CATEGORY_COLORS[category] || "#EF4444",
        }))
        .sort((a, b) => b.amount - a.amount),
    };
  }, [transactions]);

  // 日別収支データ（過去7日）
  const dailyData = useMemo(() => {
    const dailyTotals: { [key: string]: { income: number; expense: number } } =
      {};

    transactions.forEach((transaction) => {
      const date = transaction.createdAt.toISOString().split("T")[0];
      if (!dailyTotals[date]) {
        dailyTotals[date] = { income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        dailyTotals[date].income += transaction.amount;
      } else {
        dailyTotals[date].expense += transaction.amount;
      }
    });

    // 過去7日分のデータを生成
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("ja-JP", { weekday: "short" });

      return {
        date: dateStr,
        day: dayName,
        income: dailyTotals[dateStr]?.income || 0,
        expense: dailyTotals[dateStr]?.expense || 0,
        balance:
          (dailyTotals[dateStr]?.income || 0) -
          (dailyTotals[dateStr]?.expense || 0),
      };
    }).reverse();

    return last7Days;
  }, [transactions]);

  // カスタムトゥールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ¥${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 円グラフ用カスタムラベル
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // 5%未満は表示しない

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      {/* サマリー情報 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">収支サマリー</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">総収入</p>
            <p className="text-2xl font-bold text-green-600">
              ¥{summary.income.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <p className="text-sm text-gray-600">総支出</p>
            <p className="text-2xl font-bold text-red-600">
              ¥{summary.expense.toLocaleString()}
            </p>
          </div>
          <div
            className={`p-4 rounded ${
              summary.balance >= 0 ? "bg-blue-50" : "bg-orange-50"
            }`}
          >
            <p className="text-sm text-gray-600">収支</p>
            <p
              className={`text-2xl font-bold ${
                summary.balance >= 0 ? "text-blue-600" : "text-orange-600"
              }`}
            >
              ¥{summary.balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">取引件数</p>
            <p className="text-2xl font-bold text-gray-600">
              {summary.transactionCount}件
            </p>
          </div>
        </div>
      </div>

      {/* 日別収支グラフ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          過去7日間の収支推移
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => `¥${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="#10B981" name="収入" />
            <Bar dataKey="expense" fill="#EF4444" name="支出" />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3B82F6"
              strokeWidth={3}
              name="収支"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 収入カテゴリ別円グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            収入カテゴリ別割合
          </h3>
          {categoryData.income.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.income}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.income.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}`,
                    "金額",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              収入データがありません
            </div>
          )}
        </div>

        {/* 支出カテゴリ別円グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            支出カテゴリ別割合
          </h3>
          {categoryData.expense.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData.expense}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.expense.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}`,
                    "金額",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              支出データがありません
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 収入カテゴリ別棒グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            収入カテゴリ別金額
          </h3>
          {categoryData.income.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData.income} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `¥${value.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}`,
                    "収入額",
                  ]}
                />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              収入データがありません
            </div>
          )}
        </div>

        {/* 支出カテゴリ別棒グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            支出カテゴリ別金額
          </h3>
          {categoryData.expense.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData.expense} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `¥${value.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}`,
                    "支出額",
                  ]}
                />
                <Bar dataKey="amount" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              支出データがありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCharts;
