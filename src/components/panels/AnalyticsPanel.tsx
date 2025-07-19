import React from "react";
import { Transaction } from "../../types";
import { useChartData } from "../../hooks/useChartData";
import { Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AnalyticsPanelProps {
  transactions: Transaction[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ transactions }) => {
  const { monthlyData, trendData, categoryTrends } = useChartData(transactions);

  // 予測・推奨アドバイス生成
  const generateAdvice = () => {
    const advice = [];

    // 支出増加警告
    if (trendData.changePercent.expense > 20) {
      advice.push({
        type: "warning",
        title: "支出が大幅増加",
        message: `先月比${trendData.changePercent.expense.toFixed(1)}%増加しています。支出を見直しましょう。`,
        icon: AlertTriangle,
      });
    }

    // 貯蓄率アドバイス
    const savingsRate =
      trendData.currentMonth.income > 0
        ? (trendData.currentMonth.balance / trendData.currentMonth.income) * 100
        : 0;

    if (savingsRate < 10) {
      advice.push({
        type: "warning",
        title: "貯蓄率が低めです",
        message: `現在の貯蓄率は${savingsRate.toFixed(1)}%です。20%以上を目標にしましょう。`,
        icon: Target,
      });
    } else if (savingsRate >= 20) {
      advice.push({
        type: "success",
        title: "優秀な貯蓄率！",
        message: `${savingsRate.toFixed(1)}%の貯蓄率を維持しています。素晴らしいです！`,
        icon: CheckCircle,
      });
    }

    // 収入減少警告
    if (trendData.changePercent.income < -10) {
      advice.push({
        type: "warning",
        title: "収入が減少しています",
        message: `先月比${Math.abs(trendData.changePercent.income).toFixed(1)}%減少。支出の見直しを検討しましょう。`,
        icon: TrendingUp,
      });
    }

    return advice;
  };

  const advice = generateAdvice();

  // カテゴリ別支出分析
  const expenseCategories = categoryTrends.filter((trend) =>
    transactions.some(
      (t) => t.category === trend.category && t.type === "expense",
    ),
  );

  return (
    <div className="space-y-6">
      {/* パネルヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">詳細分析</h2>
        <p className="text-gray-600">
          データを深く分析して、より良い家計管理のためのインサイトを提供します。
        </p>
      </div>

      {/* AIアドバイス */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          AI家計アドバイス
        </h3>

        {advice.length > 0 ? (
          <div className="space-y-4">
            {advice.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    item.type === "warning"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-green-50 border-green-500"
                  }`}
                >
                  <div className="flex items-start">
                    <Icon
                      className={`w-5 h-5 mr-3 mt-0.5 ${
                        item.type === "warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    />
                    <div>
                      <h4
                        className={`font-semibold ${
                          item.type === "warning"
                            ? "text-yellow-800"
                            : "text-green-800"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`text-sm mt-1 ${
                          item.type === "warning"
                            ? "text-yellow-700"
                            : "text-green-700"
                        }`}
                      >
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>現在の家計状況は安定しています</p>
          </div>
        )}
      </div>

      {/* 月別パフォーマンス */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          月別パフォーマンス（直近6ヶ月）
        </h3>
        <div className="space-y-4">
          {monthlyData.slice(-6).map((month) => (
            <div
              key={month.month}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">{month.month}</p>
                <p className="text-sm text-gray-600">
                  取引{month.transactionCount}件 • 貯蓄率
                  {month.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    month.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ¥{month.balance.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        month.savingsRate >= 20
                          ? "bg-green-500"
                          : month.savingsRate >= 10
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(month.savingsRate, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {month.savingsRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* カテゴリ別支出分析 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          支出カテゴリ分析（今月vs先月）
        </h3>
        {expenseCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expenseCategories.slice(0, 6).map((category) => (
              <div key={category.category} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {category.category}
                  </h4>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      category.trend === "up"
                        ? "bg-red-100 text-red-600"
                        : category.trend === "down"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category.trend === "up"
                      ? "増加"
                      : category.trend === "down"
                        ? "減少"
                        : "安定"}
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  ¥{category.currentMonth.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  先月: ¥{category.previousMonth.toLocaleString()}
                </p>
                <p
                  className={`text-sm font-medium ${
                    category.changePercent > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {category.changePercent > 0 ? "+" : ""}
                  {category.changePercent.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>分析するデータが不足しています</p>
          </div>
        )}
      </div>

      {/* 予測・目標設定（将来実装予定） */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          将来実装予定機能
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">予算設定・管理</h4>
            <p className="text-sm text-gray-600">
              カテゴリ別の予算を設定し、超過アラートを表示
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">支出予測</h4>
            <p className="text-sm text-gray-600">
              過去のデータから月末の支出を予測
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">目標達成度</h4>
            <p className="text-sm text-gray-600">
              貯蓄目標の進捗を可視化・追跡
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">レポート出力</h4>
            <p className="text-sm text-gray-600">月次・年次レポートのPDF出力</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
