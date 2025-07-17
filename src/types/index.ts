// 支出データの型定義
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: Date;
}

// カテゴリの型定義
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// 月別集計の型定義
export interface MonthlyTotal {
  month: string;
  total: number;
  categoryBreakdown: Record<string, number>;
}
