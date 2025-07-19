import { useState, useEffect } from "react";
import { Transaction, TransactionType } from "../types";
import { useAuth } from "../contexts/AuthContext";
import * as firestoreService from "../services/firestore";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { currentUser } = useAuth();

  // 取引一覧を読み込み
  const loadTransactions = async () => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userTransactions = await firestoreService.getTransactions(
        currentUser.uid,
      );
      setTransactions(userTransactions);
    } catch (err) {
      console.error("取引の読み込みに失敗:", err);
      setError("取引の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 取引を追加
  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => {
    if (!currentUser) return;

    try {
      const transactionId = await firestoreService.addTransaction(
        currentUser.uid,
        transaction,
      );
      const newTransaction: Transaction = {
        ...transaction,
        id: transactionId,
        createdAt: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    } catch (err) {
      console.error("取引の追加に失敗:", err);
      setError("取引の追加に失敗しました");
    }
  };

  // 取引を削除
  const deleteTransaction = async (transactionId: string) => {
    if (!currentUser) return;

    try {
      await firestoreService.deleteTransaction(currentUser.uid, transactionId);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== transactionId),
      );
    } catch (err) {
      console.error("取引の削除に失敗:", err);
      setError("取引の削除に失敗しました");
    }
  };

  // フィルター機能
  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter((t) => t.type === type);
  };

  // 収支サマリー
  const getSummary = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: transactions.length,
    };
  };

  // ユーザーが変わったら取引を再読み込み
  useEffect(() => {
    loadTransactions();
  }, [currentUser]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refreshTransactions: loadTransactions,
    getTransactionsByType,
    getSummary,
  };
};
