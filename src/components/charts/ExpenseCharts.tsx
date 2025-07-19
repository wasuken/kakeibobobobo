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
  LineChart,
  Line,
} from "recharts";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
}

interface ExpenseChartsProps {
  expenses: Expense[];
}

// カテゴリ別の色定義
const CATEGORY_COLORS: { [key: string]: string } = {
  食費: "#FF6B6B",
  交通費: "#4ECDC4",
  娯楽: "#45B7D1",
  日用品: "#96CEB4",
  衣服: "#FECA57",
  医療費: "#FF9FF3",
  その他: "#BDC3C7",
};

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
  // カテゴリ別集計データ
  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category] || "#BDC3C7",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // 日別集計データ（過去7日）
  const dailyData = useMemo(() => {
    const dailyTotals: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      const date = expense.createdAt.toISOString().split("T")[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
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
        amount: dailyTotals[dateStr] || 0,
      };
    }).reverse();

    return last7Days;
  }, [expenses]);

  // 総支出額計算
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // カスタムトゥールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            {`支出: ¥${payload[0].value.toLocaleString()}`}
          </p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">支出サマリー</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">総支出額</p>
            <p className="text-2xl font-bold text-blue-600">
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">支出件数</p>
            <p className="text-2xl font-bold text-green-600">
              {expenses.length}件
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <p className="text-sm text-gray-600">1日平均</p>
            <p className="text-2xl font-bold text-orange-600">
              ¥
              {Math.round(
                totalAmount /
                  Math.max(dailyData.filter((d) => d.amount > 0).length, 1),
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 日別支出グラフ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          過去7日間の支出
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => `¥${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* カテゴリ別円グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            カテゴリ別支出割合
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
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
        </div>

        {/* カテゴリ別棒グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            カテゴリ別支出額
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="horizontal">
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
              <Bar dataKey="amount" fill="#8884d8">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
