import { useMemo } from "react";
import { Transaction } from "../types";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subWeeks,
} from "date-fns";
import { ja } from "date-fns/locale";

export interface ChartDataHook {
  monthlyData: MonthlyChartData[];
  weeklyData: WeeklyChartData[];
  trendData: TrendData;
  categoryTrends: CategoryTrendData[];
}

export interface MonthlyChartData {
  month: string;
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
  transactionCount: number;
}

export interface WeeklyChartData {
  week: string;
  weekNumber: number;
  income: number;
  expense: number;
  balance: number;
  dailyAverage: number;
}

export interface TrendData {
  currentMonth: {
    income: number;
    expense: number;
    balance: number;
  };
  previousMonth: {
    income: number;
    expense: number;
    balance: number;
  };
  changePercent: {
    income: number;
    expense: number;
    balance: number;
  };
}

export interface CategoryTrendData {
  category: string;
  currentMonth: number;
  previousMonth: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
}

export const useChartData = (transactions: Transaction[]): ChartDataHook => {
  // 月別データ生成（過去12ヶ月）
  const monthlyData = useMemo(() => {
    const months: MonthlyChartData[] = [];

    for (let i = 11; i >= 0; i--) {
      const targetDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expense;
      const savingsRate = income > 0 ? (balance / income) * 100 : 0;

      months.push({
        month: format(targetDate, "yyyy年M月", { locale: ja }),
        income,
        expense,
        balance,
        savingsRate,
        transactionCount: monthTransactions.length,
      });
    }

    return months;
  }, [transactions]);

  // 週別データ生成（過去8週間）
  const weeklyData = useMemo(() => {
    const weeks: WeeklyChartData[] = [];

    for (let i = 7; i >= 0; i--) {
      const targetDate = subWeeks(new Date(), i);
      const weekStart = startOfWeek(targetDate, { locale: ja });
      const weekEnd = endOfWeek(targetDate, { locale: ja });

      const weekTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      });

      const income = weekTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = weekTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expense;
      const dailyAverage = expense / 7;

      weeks.push({
        week: `${format(weekStart, "M/d", { locale: ja })}〜${format(weekEnd, "M/d", { locale: ja })}`,
        weekNumber: i + 1,
        income,
        expense,
        balance,
        dailyAverage,
      });
    }

    return weeks;
  }, [transactions]);

  // トレンドデータ（今月vs先月比較）
  const trendData = useMemo(() => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
    const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= currentMonthStart && date <= currentMonthEnd;
    });

    const previousMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= previousMonthStart && date <= previousMonthEnd;
    });

    const current = {
      income: currentMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
      expense: currentMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
      balance: 0,
    };
    current.balance = current.income - current.expense;

    const previous = {
      income: previousMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
      expense: previousMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
      balance: 0,
    };
    previous.balance = previous.income - previous.expense;

    const changePercent = {
      income:
        previous.income > 0
          ? ((current.income - previous.income) / previous.income) * 100
          : 0,
      expense:
        previous.expense > 0
          ? ((current.expense - previous.expense) / previous.expense) * 100
          : 0,
      balance:
        previous.balance !== 0
          ? ((current.balance - previous.balance) /
              Math.abs(previous.balance)) *
            100
          : 0,
    };

    return {
      currentMonth: current,
      previousMonth: previous,
      changePercent,
    };
  }, [transactions]);

  // カテゴリ別トレンド（今月vs先月）
  const categoryTrends = useMemo(() => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
    const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= currentMonthStart && date <= currentMonthEnd;
    });

    const previousMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= previousMonthStart && date <= previousMonthEnd;
    });

    // カテゴリ別集計
    const categories = Array.from(new Set(transactions.map((t) => t.category)));

    return categories
      .map((category) => {
        const currentAmount = currentMonthTransactions
          .filter((t) => t.category === category)
          .reduce((sum, t) => sum + t.amount, 0);

        const previousAmount = previousMonthTransactions
          .filter((t) => t.category === category)
          .reduce((sum, t) => sum + t.amount, 0);

        const changePercent =
          previousAmount > 0
            ? ((currentAmount - previousAmount) / previousAmount) * 100
            : currentAmount > 0
              ? 100
              : 0;

        let trend: "up" | "down" | "stable" = "stable";
        if (Math.abs(changePercent) > 5) {
          trend = changePercent > 0 ? "up" : "down";
        }

        return {
          category,
          currentMonth: currentAmount,
          previousMonth: previousAmount,
          changePercent,
          trend,
        };
      })
      .filter((item) => item.currentMonth > 0 || item.previousMonth > 0)
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  }, [transactions]);

  return {
    monthlyData,
    weeklyData,
    trendData,
    categoryTrends,
  };
};
