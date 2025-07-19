import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-700">{currentUser.email}</span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
      >
        <LogOut className="w-4 h-4" />
        ログアウト
      </button>
    </div>
  );
};
