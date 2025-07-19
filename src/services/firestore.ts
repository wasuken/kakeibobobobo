import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Transaction, TransactionType } from "../types";

// ユーザー別のtransactionsコレクションを取得
const getUserTransactionsCollection = (userId: string) => {
  return collection(db, `users/${userId}/transactions`);
};

// 取引を追加
export const addTransaction = async (
  userId: string,
  transaction: Omit<Transaction, "id" | "createdAt">,
) => {
  try {
    const transactionsCollection = getUserTransactionsCollection(userId);
    const docRef = await addDoc(transactionsCollection, {
      ...transaction,
      amount: Number(transaction.amount),
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error("取引の追加に失敗しました:", error);
    throw error;
  }
};

// 取引一覧を取得
export const getTransactions = async (
  userId: string,
): Promise<Transaction[]> => {
  try {
    const transactionsCollection = getUserTransactionsCollection(userId);
    const q = query(transactionsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Transaction[];
  } catch (error) {
    console.error("取引の取得に失敗しました:", error);
    throw error;
  }
};

// 収入のみ取得
export const getIncomes = async (userId: string): Promise<Transaction[]> => {
  try {
    const transactionsCollection = getUserTransactionsCollection(userId);
    const q = query(
      transactionsCollection,
      where("type", "==", "income"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Transaction[];
  } catch (error) {
    console.error("収入の取得に失敗しました:", error);
    throw error;
  }
};

// 支出のみ取得
export const getExpenses = async (userId: string): Promise<Transaction[]> => {
  try {
    const transactionsCollection = getUserTransactionsCollection(userId);
    const q = query(
      transactionsCollection,
      where("type", "==", "expense"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Transaction[];
  } catch (error) {
    console.error("支出の取得に失敗しました:", error);
    throw error;
  }
};

// 取引を削除
export const deleteTransaction = async (
  userId: string,
  transactionId: string,
) => {
  try {
    const transactionDoc = doc(
      db,
      `users/${userId}/transactions`,
      transactionId,
    );
    await deleteDoc(transactionDoc);
  } catch (error) {
    console.error("取引の削除に失敗しました:", error);
    throw error;
  }
};

// カテゴリ別の合計を取得
export const getTransactionsByCategory = async (
  userId: string,
  type?: TransactionType,
): Promise<Record<string, number>> => {
  try {
    const transactions = type
      ? type === "income"
        ? await getIncomes(userId)
        : await getExpenses(userId)
      : await getTransactions(userId);

    return transactions.reduce(
      (acc, transaction) => {
        if (!type || transaction.type === type) {
          acc[transaction.category] =
            (acc[transaction.category] || 0) + transaction.amount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  } catch (error) {
    console.error("カテゴリ別集計の取得に失敗しました:", error);
    throw error;
  }
};

// 収支サマリー取得
export const getFinancialSummary = async (userId: string) => {
  try {
    const transactions = await getTransactions(userId);

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
  } catch (error) {
    console.error("収支サマリーの取得に失敗しました:", error);
    throw error;
  }
};
