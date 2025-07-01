
import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import MobileHeader from '@/components/MobileHeader';
import UploadZone from '@/components/UploadZone';
import ResultsDashboard from '@/components/ResultsDashboard';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useSpermAnalysis } from '@/hooks/useSpermAnalysis';
import { useIsMobile } from '@/hooks/use-mobile';

const IndexContent = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const { isAnalyzing, analyzeVideo, currentResult } = useSpermAnalysis();
  const isMobile = useIsMobile();

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
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 px-4 pb-20">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                مرحبًا بك في نظام التحليل الذكي
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
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
              <h2 className="text-xl font-bold text-foreground mb-2">
                رفع فيديو جديد
              </h2>
              <p className="text-muted-foreground">
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
              <h2 className="text-2xl font-bold text-foreground mb-3">
                حول التطبيق
              </h2>
              <p className="text-muted-foreground">
                نظام متطور لتحليل العينات الطبية
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="medical-card">
                <h3 className="font-semibold text-foreground mb-3">المميزات الرئيسية</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    تحليل بالذكاء الاصطناعي عالي الدقة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    نتائج سريعة ومفصلة
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    واجهة سهلة الاستخدام
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    دعم كامل للغة العربية
                  </li>
                </ul>
              </div>

              <div className="medical-card">
                <h3 className="font-semibold text-foreground mb-3">معلومات التطبيق</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الإصدار</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاريخ الإصدار</span>
                    <span className="font-medium">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المطور</span>
                    <span className="font-medium">AI Medical Lab</span>
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
      <MobileHeader />
      
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
