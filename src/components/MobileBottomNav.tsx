
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
    <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 px-3 py-3 z-50 backdrop-blur-xl">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-0 flex-1 mx-1 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-semibold truncate">
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
