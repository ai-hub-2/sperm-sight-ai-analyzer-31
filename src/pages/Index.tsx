
import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import MobileHeader from '@/components/MobileHeader';
import UploadZone from '@/components/UploadZone';
import ResultsDashboard from '@/components/ResultsDashboard';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useSpermAnalysis } from '@/hooks/useSpermAnalysis';
import { Button } from '@/components/ui/button';
import { Settings, Globe, Palette } from 'lucide-react';

const IndexContent = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const { isAnalyzing, analyzeVideo, currentResult } = useSpermAnalysis();

  const handleVideoSelect = async (file: File) => {
    setSelectedVideo(file);
    try {
      await analyzeVideo(file);
      setActiveTab('results');
    } catch (error) {
      console.error('فشل في تحليل الفيديو:', error);
    }
  };

  const mockResultsData = {
    totalCount: currentResult?.sperm_count || 1250,
    motileCount: currentResult?.sperm_count ? Math.floor(currentResult.sperm_count * 0.65) : 812,
    averageSpeed: currentResult?.speed_avg || 45.2,
    motilityPercentage: currentResult?.motility || 65,
    concentration: currentResult?.concentration || 35.4,
    morphologyNormal: 78
  };

  const renderTabContent = () => {
    if (showSettings) {
      return (
        <div className="space-y-6 px-4 pb-20">
          <div className="text-center py-4">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
              الإعدادات
            </h2>
            <p className="text-green-700 dark:text-green-400">
              تخصيص التطبيق حسب احتياجاتك
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="medical-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-700 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">اللغة</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">اختر لغة التطبيق</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                  العربية
                </Button>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                  English
                </Button>
              </div>
            </div>

            <div className="medical-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-green-700 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">المظهر</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">اختر مظهر التطبيق</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                  فاتح
                </Button>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                  داكن
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowSettings(false)}
            className="w-full medical-button-primary"
          >
            العودة
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 px-4 pb-20">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                مرحبًا بك في نظام التحليل الذكي
              </h2>
              <p className="text-green-700 dark:text-green-400 text-base leading-relaxed">
                تقنية متطورة لتحليل الحيوانات المنوية باستخدام الذكاء الاصطناعي
              </p>
            </div>
            <UploadZone 
              onVideoSelect={handleVideoSelect}
              isAnalyzing={isAnalyzing}
            />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6 px-4 pb-20">
            <div className="text-center py-4">
              <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                رفع فيديو جديد
              </h2>
              <p className="text-green-700 dark:text-green-400">
                اختر الفيديو المراد تحليله
              </p>
            </div>
            <UploadZone 
              onVideoSelect={handleVideoSelect}
              isAnalyzing={isAnalyzing}
            />
          </div>
        );

      case 'results':
        return (
          <div className="px-4 pb-20">
            <ResultsDashboard 
              data={mockResultsData}
              isLoading={isAnalyzing}
            />
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6 px-4 pb-20">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                حول التطبيق
              </h2>
              <p className="text-green-700 dark:text-green-400">
                نظام متطور لتحليل العينات الطبية
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="medical-card">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">المميزات الرئيسية</h3>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    تحليل بالذكاء الاصطناعي عالي الدقة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    نتائج سريعة ومفصلة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    واجهة سهلة الاستخدام
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    دعم كامل للغة العربية
                  </li>
                </ul>
              </div>

              <div className="medical-card">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">معلومات التطبيق</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">الإصدار</span>
                    <span className="font-medium text-green-800 dark:text-green-300">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">تاريخ الإصدار</span>
                    <span className="font-medium text-green-800 dark:text-green-300">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">المطور</span>
                    <span className="font-medium text-green-800 dark:text-green-300">AI Medical Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader onSettingsClick={() => setShowSettings(true)} />
      
      <main className="pt-4">
        {renderTabContent()}
      </main>

      <MobileBottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
