// 支出一覧表示コンポーネント
import React from "react";
import { Expense } from "../../types";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
}) => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">支出一覧</h2>
        <div className="text-2xl font-bold text-red-600">
          ¥{total.toLocaleString()}
        </div>
      </div>

      <div className="space-y-2">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            まだ支出が記録されていません
          </p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-md"
            >
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {expense.category} • {expense.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  ¥{expense.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
