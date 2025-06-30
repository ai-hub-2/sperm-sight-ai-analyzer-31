
import React from 'react';
import { Home, Upload, BarChart3, Info } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const tabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'upload', label: 'تحليل', icon: Upload },
    { id: 'results', label: 'النتائج', icon: BarChart3 },
    { id: 'about', label: 'حول', icon: Info },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 py-2 z-50 safe-area-bottom shadow-2xl">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-400 bg-blue-900/30 shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
