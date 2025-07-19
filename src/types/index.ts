// 収支統合の型定義
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  createdAt: Date;
}

// 収入・支出カテゴリ定義
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

// 月別集計の型定義
export interface MonthlyTotal {
  month: string;
  income: number;
  expense: number;
  balance: number;
  categoryBreakdown: {
    income: Record<string, number>;
    expense: Record<string, number>;
  };
}

// カテゴリ定数
export const INCOME_CATEGORIES = [
  "給与",
  "ボーナス",
  "副業",
  "投資",
  "その他収入",
] as const;

export const EXPENSE_CATEGORIES = [
  "食費",
  "交通費",
  "娯楽",
  "日用品",
  "衣服",
  "医療費",
  "その他",
] as const;

// チャート専用型定義
export interface ChartConfig {
  showMonthly: boolean;
  showWeekly: boolean;
  showTrend: boolean;
  timeRange: "last3months" | "last6months" | "last12months";
}

export interface FinancialTrend {
  period: string;
  value: number;
  changeFromPrevious: number;
  changePercent: number;
}
