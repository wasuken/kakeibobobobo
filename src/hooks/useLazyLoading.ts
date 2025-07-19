import { useState, useEffect, useCallback } from "react";

interface UseLazyLoadingOptions {
  delay?: number;
  minLoadingTime?: number;
}

export const useLazyLoading = (
  loadingFunction: () => Promise<any> | any,
  dependencies: any[] = [],
  options: UseLazyLoadingOptions = {},
) => {
  const { delay = 100, minLoadingTime = 500 } = options;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const executeLoad = useCallback(async () => {
    setLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      // 少し遅延させてスムーズに見せる
      await new Promise((resolve) => setTimeout(resolve, delay));

      const result = await Promise.resolve(loadingFunction());

      // 最小ローディング時間を保証
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadingTime - elapsed),
        );
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      console.error("LazyLoading error:", err);
    } finally {
      setLoading(false);
    }
  }, [loadingFunction, delay, minLoadingTime]);

  useEffect(() => {
    executeLoad();
  }, dependencies);

  return { loading, data, error, reload: executeLoad };
};

// チャート専用の最適化フック
export const useChartLazyLoading = (
  chartData: any,
  dependencies: any[] = [],
) => {
  return useLazyLoading(
    () => {
      // チャートデータの前処理をここで実行
      if (!chartData || (Array.isArray(chartData) && chartData.length === 0)) {
        throw new Error("チャート表示に必要なデータがありません");
      }
      return chartData;
    },
    dependencies,
    { delay: 200, minLoadingTime: 800 }, // チャート用に少し長めに設定
  );
};
