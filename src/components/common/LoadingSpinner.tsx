import React from "react";
import { Loader2, BarChart3, Calculator, TrendingUp } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  type?: "default" | "chart" | "data" | "analysis";
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message,
  type = "default",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const getIcon = () => {
    switch (type) {
      case "chart":
        return (
          <BarChart3
            className={`${sizeClasses[size]} animate-pulse text-purple-500`}
          />
        );
      case "data":
        return (
          <Calculator
            className={`${sizeClasses[size]} animate-pulse text-blue-500`}
          />
        );
      case "analysis":
        return (
          <TrendingUp
            className={`${sizeClasses[size]} animate-pulse text-orange-500`}
          />
        );
      default:
        return (
          <Loader2
            className={`${sizeClasses[size]} animate-spin text-blue-500`}
          />
        );
    }
  };

  const getMessages = () => {
    if (message) return [message];

    switch (type) {
      case "chart":
        return [
          "チャートを描画しています...",
          "データを可視化中...",
          "グラフを準備中...",
        ];
      case "data":
        return [
          "データを読み込んでいます...",
          "取引情報を取得中...",
          "最新データを同期中...",
        ];
      case "analysis":
        return [
          "データを分析しています...",
          "トレンドを計算中...",
          "AIが分析中...",
        ];
      default:
        return ["読み込み中..."];
    }
  };

  const messages = getMessages();
  const displayMessage = messages[Math.floor(Math.random() * messages.length)];

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
          {getIcon()}
          <p className="mt-4 text-gray-600 font-medium">{displayMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      {getIcon()}
      {(message || type !== "default") && (
        <p className="mt-4 text-gray-600 text-center font-medium">
          {displayMessage}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
