import React from "react";
import { Transaction } from "../../types";
import { TransactionForm } from "../forms/TransactionForm";
import { TransactionList } from "../common/TransactionList";

interface TransactionsPanelProps {
  transactions: Transaction[];
  onAddTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionsPanel: React.FC<TransactionsPanelProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  return (
    <div className="space-y-6">
      {/* パネルヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">取引管理</h2>
        <p className="text-gray-600">
          収支の記録と管理をここで行います。新しい取引を追加したり、過去の取引を確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 取引入力フォーム */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              新しい取引を追加
            </h3>
            <TransactionForm onAddTransaction={onAddTransaction} />
          </div>
        </div>

        {/* 取引一覧 */}
        <div>
          <TransactionList
            transactions={transactions}
            onDeleteTransaction={onDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPanel;
