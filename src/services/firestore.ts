import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Expense } from '../types';

// ユーザー別のexpensesコレクションを取得
const getUserExpensesCollection = (userId: string) => {
  return collection(db, `users/${userId}/expenses`);
};

// 支出を追加
export const addExpense = async (userId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => {
  try {
    const expensesCollection = getUserExpensesCollection(userId);
    const docRef = await addDoc(expensesCollection, {
      ...expense,
      amount: Number(expense.amount), // 数値として保存
      createdAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('支出の追加に失敗しました:', error);
    throw error;
  }
};

// 支出一覧を取得
export const getExpenses = async (userId: string): Promise<Expense[]> => {
  try {
    const expensesCollection = getUserExpensesCollection(userId);
    const q = query(expensesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Expense[];
  } catch (error) {
    console.error('支出の取得に失敗しました:', error);
    throw error;
  }
};

// 支出を削除
export const deleteExpense = async (userId: string, expenseId: string) => {
  try {
    const expenseDoc = doc(db, `users/${userId}/expenses`, expenseId);
    await deleteDoc(expenseDoc);
  } catch (error) {
    console.error('支出の削除に失敗しました:', error);
    throw error;
  }
};

// カテゴリ別の合計を取得
export const getExpensesByCategory = async (userId: string): Promise<Record<string, number>> => {
  try {
    const expenses = await getExpenses(userId);
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('カテゴリ別集計の取得に失敗しました:', error);
    throw error;
  }
};
