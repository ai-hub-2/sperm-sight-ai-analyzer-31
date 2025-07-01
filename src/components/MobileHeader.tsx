
import React from 'react';
import { Settings, Circle } from 'lucide-react';
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
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Circle className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-lg font-bold text-foreground leading-tight">
                {t('appName')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('welcome')}
              </p>
            </div>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
