import React from "react";
import { Header } from "../components/common/Header";
import { TransactionForm } from "../components/forms/TransactionForm";
import { TransactionList } from "../components/common/TransactionList";
import { useTransactions } from "../hooks/useTransactions";
import SampleDataButton from "../components/dev/SampleDataButton";
import TransactionCharts from "../components/charts/TransactionCharts";

export const Home: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SampleDataButton />
          <TransactionCharts transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TransactionForm onAddTransaction={addTransaction} />
          </div>

          <div>
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
