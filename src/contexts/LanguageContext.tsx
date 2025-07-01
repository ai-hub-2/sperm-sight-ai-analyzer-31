
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations = {
  ar: {
    appName: 'تحليل الحيوانات المنوية بالذكاء الاصطناعي',
    welcome: 'مرحبًا بك في نظام التحليل الذكي',
    uploadVideo: 'رفع فيديو',
    recordLive: 'تسجيل مباشر',
    startAnalysis: 'بدء التحليل',
    analyzing: 'جاري التحليل...',
    results: 'النتائج',
    spermCount: 'عدد الحيوانات المنوية',
    averageSpeed: 'السرعة المتوسطة',
    motility: 'الحركة',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    home: 'الرئيسية',
    upload: 'رفع',
    profile: 'الملف الشخصي',
    selectVideo: 'اختر فيديو للتحليل',
    dropVideo: 'اسحب الفيديو هنا أو انقر للاختيار',
    videoSelected: 'تم اختيار الفيديو',
    processing: 'معالجة...',
    completed: 'مكتمل',
    error: 'خطأ',
    retry: 'إعادة المحاولة',
    share: 'مشاركة',
    exportPdf: 'تصدير PDF',
    totalCount: 'العدد الكلي',
    motileCount: 'العدد المتحرك',
    nonMotileCount: 'العدد غير المتحرك',
    concentration: 'التركيز',
    morphology: 'الشكل',
    vitality: 'الحيوية',
  },
  en: {
    appName: 'AI-Powered Sperm Analysis',
    welcome: 'Welcome to Smart Analysis System',
    uploadVideo: 'Upload Video',
    recordLive: 'Record Live',
    startAnalysis: 'Start Analysis',
    analyzing: 'Analyzing...',
    results: 'Results',
    spermCount: 'Sperm Count',
    averageSpeed: 'Average Speed',
    motility: 'Motility',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    home: 'Home',
    upload: 'Upload',
    profile: 'Profile',
    selectVideo: 'Select video for analysis',
    dropVideo: 'Drop video here or click to select',
    videoSelected: 'Video selected',
    processing: 'Processing...',
    completed: 'Completed',
    error: 'Error',
    retry: 'Retry',
    share: 'Share',
    exportPdf: 'Export PDF',
    totalCount: 'Total Count',
    motileCount: 'Motile Count',
    nonMotileCount: 'Non-motile Count',
    concentration: 'Concentration',
    morphology: 'Morphology',
    vitality: 'Vitality',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
