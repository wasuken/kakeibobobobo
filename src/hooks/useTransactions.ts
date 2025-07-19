// src/hooks/useTransactions.ts を修正
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
      setError(""); // エラーをクリア
      console.log("🔄 取引データを再取得中...");

      const userTransactions = await firestoreService.getTransactions(
        currentUser.uid,
      );
      setTransactions(userTransactions);

      console.log(`✅ ${userTransactions.length}件の取引を取得しました`);
    } catch (err) {
      console.error("取引の読み込みに失敗:", err);
      setError("取引の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 取引を追加（即座に再取得）
  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => {
    if (!currentUser) return;

    try {
      setError(""); // エラーをクリア
      console.log("💰 取引を追加中...", transaction);

      const transactionId = await firestoreService.addTransaction(
        currentUser.uid,
        transaction,
      );

      console.log(`✅ 取引追加完了 ID: ${transactionId}`);

      // 🔥 重要：追加後に即座に全データを再取得
      await loadTransactions();
    } catch (err) {
      console.error("取引の追加に失敗:", err);
      setError("取引の追加に失敗しました");
    }
  };

  // 取引を削除（即座に再取得）
  const deleteTransaction = async (transactionId: string) => {
    if (!currentUser) return;

    try {
      setError(""); // エラーをクリア
      console.log("🗑️ 取引を削除中...", transactionId);

      await firestoreService.deleteTransaction(currentUser.uid, transactionId);

      console.log(`✅ 取引削除完了 ID: ${transactionId}`);

      // 🔥 重要：削除後に即座に全データを再取得
      await loadTransactions();
    } catch (err) {
      console.error("取引の削除に失敗:", err);
      setError("取引の削除に失敗しました");
    }
  };

  // 強制リロード（最悪の場合）
  const forceReload = () => {
    console.log("🔄 ページをリロードします...");
    window.location.reload();
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
    refreshTransactions: loadTransactions, // 手動再取得
    forceReload, // 強制リロード
    getTransactionsByType,
    getSummary,
  };
};
