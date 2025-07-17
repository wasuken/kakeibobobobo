// 支出データ管理のカスタムフック
import { useState, useEffect } from 'react';
import { Expense } from '../types';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense
  };
};
