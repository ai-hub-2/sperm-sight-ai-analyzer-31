
import React from 'react';
import { Settings, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileHeaderProps {
  onSettingsClick?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onSettingsClick }) => {
  const { t, isRTL } = useLanguage();

  return (
    <header className="medical-header">
      <div className="container mx-auto px-4 py-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-lg font-bold text-green-800 dark:text-green-300 leading-tight">
                {t('appName')}
              </h1>
              <p className="text-xs text-green-700 dark:text-green-400">
                {t('welcome')}
              </p>
            </div>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 transition-colors"
          >
            <Settings className="w-5 h-5 text-green-700 dark:text-green-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
