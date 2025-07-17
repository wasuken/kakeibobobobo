// ヘッダーコンポーネント
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">家計簿</h1>
      <p className="text-blue-100">支出を記録して、家計を管理しよう</p>
    </header>
  );
};
