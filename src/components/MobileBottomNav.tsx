
import React from 'react';
import { Home, Upload, BarChart3, Info } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'upload', label: 'رفع', icon: Upload },
    { id: 'results', label: 'النتائج', icon: BarChart3 },
    { id: 'about', label: 'حول', icon: Info },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
