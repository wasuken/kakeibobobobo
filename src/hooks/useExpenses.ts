import { useState, useEffect } from "react";
import { Expense } from "../types";
import { useAuth } from "../contexts/AuthContext";
import * as firestoreService from "../services/firestore";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { currentUser } = useAuth();

  // 支出一覧を読み込み
  const loadExpenses = async () => {
    if (!currentUser) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userExpenses = await firestoreService.getExpenses(currentUser.uid);
      setExpenses(userExpenses);
    } catch (err) {
      console.error("支出の読み込みに失敗:", err);
      setError("支出の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 支出を追加
  const addExpense = async (expense: Omit<Expense, "id" | "createdAt">) => {
    if (!currentUser) return;

    try {
      const expenseId = await firestoreService.addExpense(
        currentUser.uid,
        expense,
      );
      const newExpense: Expense = {
        ...expense,
        id: expenseId,
        createdAt: new Date(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err) {
      console.error("支出の追加に失敗:", err);
      setError("支出の追加に失敗しました");
    }
  };

  // 支出を削除
  const deleteExpense = async (expenseId: string) => {
    if (!currentUser) return;

    try {
      await firestoreService.deleteExpense(currentUser.uid, expenseId);
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
    } catch (err) {
      console.error("支出の削除に失敗:", err);
      setError("支出の削除に失敗しました");
    }
  };

  // ユーザーが変わったら支出を再読み込み
  useEffect(() => {
    loadExpenses();
  }, [currentUser]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    refreshExpenses: loadExpenses,
  };
};
