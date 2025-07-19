import React, { useState, useMemo, Suspense, lazy } from "react";
import { Transaction } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";
import { useChartLazyLoading } from "../../hooks/useLazyLoading";

// チャートコンポーネントを遅延ロード
const TransactionCharts = lazy(() => import("../charts/TransactionCharts"));
const DetailedCharts = lazy(() => import("../charts/DetailedCharts"));

interface ChartsPanelProps {
  transactions: Transaction[];
}

const ChartsPanel: React.FC<ChartsPanelProps> = ({ transactions }) => {
  const [activeChartTab, setActiveChartTab] = useState<"basic" | "detailed">(
    "basic",
  );

  // チャートデータを事前に最適化
  const optimizedData = useMemo(() => {
    // データが少ない場合の警告
    if (transactions.length < 5) {
      return {
        transactions: [],
        warning: "チャート表示には5件以上のデータが必要です",
      };
    }

    // 重複除去とソート
    const uniqueTransactions = transactions
      .filter(
        (t, index, self) =>
          index ===
          self.findIndex(
            (other) =>
              other.id === t.id &&
              other.date === t.date &&
              other.amount === t.amount,
          ),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { transactions: uniqueTransactions, warning: null };
  }, [transactions]);

  // 基本チャート用遅延ローディング
  const basicChartLoading = useChartLazyLoading(optimizedData, [
    activeChartTab === "basic",
    optimizedData,
  ]);

  // 詳細チャート用遅延ローディング
  const detailedChartLoading = useChartLazyLoading(optimizedData, [
    activeChartTab === "detailed",
    optimizedData,
  ]);

  return (
    <div className="space-y-6">
      {/* パネルヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">チャート表示</h2>
        <p className="text-gray-600">
          収支データを様々なチャートで可視化します。トレンドやパターンを把握して、家計管理に活用しましょう。
        </p>

        {/* データ状況表示 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">データ件数:</span>
            <span className="font-semibold text-gray-800">
              {transactions.length}件
            </span>
          </div>
          {optimizedData.warning && (
            <div className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded">
              ⚠️ {optimizedData.warning}
            </div>
          )}
        </div>
      </div>

      {/* チャートタブ選択 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveChartTab("basic")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeChartTab === "basic"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📊 基本チャート
          </button>
          <button
            onClick={() => setActiveChartTab("detailed")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeChartTab === "detailed"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📈 詳細分析
          </button>
        </div>
      </div>

      {/* チャート表示エリア */}
      <div className="min-h-[600px]">
        {activeChartTab === "basic" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              基本チャート
            </h3>

            {basicChartLoading.loading ? (
              <LoadingSpinner
                type="chart"
                size="lg"
                className="min-h-[400px]"
              />
            ) : basicChartLoading.error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  ❌ チャートの読み込みに失敗
                </div>
                <p className="text-gray-600 mb-4">{basicChartLoading.error}</p>
                <button
                  onClick={basicChartLoading.reload}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  再読み込み
                </button>
              </div>
            ) : optimizedData.transactions.length >= 5 ? (
              <Suspense fallback={<LoadingSpinner type="chart" size="lg" />}>
                <TransactionCharts transactions={optimizedData.transactions} />
              </Suspense>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg mb-2">
                  チャート表示にはデータが不足しています
                </p>
                <p className="text-sm">取引を5件以上追加してください</p>
              </div>
            )}
          </div>
        )}

        {activeChartTab === "detailed" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              詳細分析チャート
            </h3>

            {detailedChartLoading.loading ? (
              <LoadingSpinner
                type="analysis"
                size="lg"
                className="min-h-[400px]"
              />
            ) : detailedChartLoading.error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  ❌ 分析チャートの読み込みに失敗
                </div>
                <p className="text-gray-600 mb-4">
                  {detailedChartLoading.error}
                </p>
                <button
                  onClick={detailedChartLoading.reload}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  再読み込み
                </button>
              </div>
            ) : optimizedData.transactions.length >= 10 ? (
              <Suspense fallback={<LoadingSpinner type="analysis" size="lg" />}>
                <DetailedCharts transactions={optimizedData.transactions} />
              </Suspense>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-lg mb-2">
                  詳細分析にはより多くのデータが必要です
                </p>
                <p className="text-sm">
                  取引を10件以上追加すると、詳細な分析が可能になります
                </p>
                {optimizedData.transactions.length >= 5 && (
                  <p className="text-xs text-blue-600 mt-2">
                    基本チャートタブでは現在のデータでも表示可能です
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsPanel;
