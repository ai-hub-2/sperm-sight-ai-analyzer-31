
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, Moon, Sun, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [language, setLanguage] = React.useState<'ar' | 'en'>('ar');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            الإعدادات
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
              <span className="text-sm font-medium">المظهر</span>
            </div>
            <button
              onClick={toggleTheme}
              className="medical-button-secondary px-3 py-1 text-sm"
            >
              {theme === 'light' ? 'داكن' : 'فاتح'}
            </button>
          </div>

          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">اللغة</span>
            </div>
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="medical-button-secondary px-3 py-1 text-sm"
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تحليل الحيوانات المنوية v2.0
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                نظام التحليل الطبي المتقدم
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
