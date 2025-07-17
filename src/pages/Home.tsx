// ホームページコンポーネント
import React from 'react';
import { Header } from '../components/common/Header';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import { ExpenseList } from '../components/common/ExpenseList';
import { useExpenses } from '../hooks/useExpenses';

export const Home: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useExpenses();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ExpenseForm onAddExpense={addExpense} />
          </div>
          
          <div>
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>
        </div>
      </div>
    </div>
  );
};
