import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showInfo?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showInfo = false,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];

    // 開始と終了ページを計算
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // 最初のページを追加
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push("...");
      }
    }

    // 中央のページ範囲を追加
    rangeWithDots.push(...range);

    // 最後のページを追加
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // 表示情報の計算
  const getDisplayInfo = () => {
    if (!totalItems || !itemsPerPage) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      start: startIndex + 1,
      end: endIndex,
      total: totalItems,
    };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 情報表示 */}
      {showInfo && displayInfo && (
        <div className="text-center text-sm text-gray-600">
          {displayInfo.total}件中 {displayInfo.start}-{displayInfo.end}件を表示
        </div>
      )}

      {/* ページネーション */}
      <div className="flex justify-center items-center space-x-2">
        {/* 最初へボタン */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-2 py-2 rounded-md text-sm font-medium ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="最初のページ"
        >
          ⏮
        </button>

        {/* 前へボタン */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          ← 前へ
        </button>

        {/* ページ番号 */}
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* 次へボタン */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          次へ →
        </button>

        {/* 最後へボタン */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-2 py-2 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="最後のページ"
        >
          ⏭
        </button>
      </div>

      {/* ページジャンプ（オプション） */}
      {totalPages > 10 && (
        <div className="flex justify-center items-center space-x-2 text-sm">
          <span className="text-gray-600">ページジャンプ:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-600">/ {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
