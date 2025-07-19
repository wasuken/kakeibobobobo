// パフォーマンス最適化設定

export const PERFORMANCE_CONFIG = {
  // チャート関連
  CHART_LOADING_DELAY: 200,
  CHART_MIN_LOADING_TIME: 800,
  CHART_DEBOUNCE_TIME: 300,

  // データ処理
  DATA_CHUNK_SIZE: 100,
  LAZY_LOAD_THRESHOLD: 50,

  // UI更新
  UI_THROTTLE_TIME: 100,
  SEARCH_DEBOUNCE_TIME: 500,

  // ページネーション
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// デバウンス関数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// スロットル関数
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// パフォーマンス計測
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
    }

    return result;
  };
};
