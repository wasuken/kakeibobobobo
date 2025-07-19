import React from "react";
import { UserProfile } from "../auth/UserProfile";

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">家計簿アプリ</h1>
          <p className="text-blue-100">支出を記録して、家計を管理しよう</p>
        </div>
        <UserProfile />
      </div>
    </header>
  );
};
