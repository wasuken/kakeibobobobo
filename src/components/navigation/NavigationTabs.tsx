import React from "react";
import {
  Home,
  PlusCircle,
  BarChart3,
  TrendingUp,
  Settings,
} from "lucide-react";

export type SectionKey =
  | "dashboard"
  | "transactions"
  | "charts"
  | "analytics"
  | "settings";

interface NavigationTabsProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  className?: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeSection,
  onSectionChange,
  className = "",
}) => {
  const sections = [
    {
      key: "dashboard" as SectionKey,
      label: "ダッシュボード",
      icon: Home,
      description: "収支概要・最新状況",
      color: "blue",
    },
    {
      key: "transactions" as SectionKey,
      label: "取引管理",
      icon: PlusCircle,
      description: "収支入力・取引一覧",
      color: "green",
    },
    {
      key: "charts" as SectionKey,
      label: "チャート",
      icon: BarChart3,
      description: "月別推移・カテゴリ別",
      color: "purple",
    },
    {
      key: "analytics" as SectionKey,
      label: "分析",
      icon: TrendingUp,
      description: "トレンド・予測・目標",
      color: "orange",
    },
    {
      key: "settings" as SectionKey,
      label: "設定",
      icon: Settings,
      description: "アカウント・セキュリティ",
      color: "gray",
    },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: isActive
        ? "bg-blue-500 text-white border-blue-500"
        : "text-blue-600 border-blue-200 hover:bg-blue-50",
      green: isActive
        ? "bg-green-500 text-white border-green-500"
        : "text-green-600 border-green-200 hover:bg-green-50",
      purple: isActive
        ? "bg-purple-500 text-white border-purple-500"
        : "text-purple-600 border-purple-200 hover:bg-purple-50",
      orange: isActive
        ? "bg-orange-500 text-white border-orange-500"
        : "text-orange-600 border-orange-200 hover:bg-orange-50",
      gray: isActive
        ? "bg-gray-500 text-white border-gray-500"
        : "text-gray-600 border-gray-200 hover:bg-gray-50",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${className}`}>
      {/* デスクトップ版：横並びタブ */}
      <div className="hidden md:flex space-x-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.key;

          return (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key)}
              className={`
                flex-1 flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
                ${getColorClasses(section.color, isActive)}
                ${isActive ? "shadow-md transform scale-105" : "hover:shadow-sm"}
              `}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="font-semibold text-sm">{section.label}</span>
              <span
                className={`text-xs mt-1 ${isActive ? "text-white opacity-90" : "text-gray-500"}`}
              >
                {section.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* モバイル版：ドロップダウン */}
      <div className="md:hidden">
        <select
          value={activeSection}
          onChange={(e) => onSectionChange(e.target.value as SectionKey)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sections.map((section) => (
            <option key={section.key} value={section.key}>
              {section.label} - {section.description}
            </option>
          ))}
        </select>
      </div>

      {/* セクション説明（アクティブなもののみ） */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800">
          {sections.find((s) => s.key === activeSection)?.label}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {sections.find((s) => s.key === activeSection)?.description}
        </p>
      </div>
    </div>
  );
};

export default NavigationTabs;
