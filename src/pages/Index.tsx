
import React, { useState } from 'react';
import MedicalHeader from '@/components/MedicalHeader';
import VideoUploader from '@/components/VideoUploader';
import AnalysisResults from '@/components/AnalysisResults';
import Dashboard from '@/components/Dashboard';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useSpermAnalysis } from '@/hooks/useSpermAnalysis';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAnalyzing, analyzeVideo } = useSpermAnalysis();
  const isMobile = useIsMobile();

  const handleVideoSelect = async (file: File) => {
    setSelectedVideo(file);
    try {
      await analyzeVideo(file);
    } catch (error) {
      console.error('فشل في تحليل الفيديو:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4 px-2">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-3">
                تحليل الفيديو بالذكاء الاصطناعي
              </h2>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                تطبيق متقدم لتحليل الفيديو باستخدام تقنيات الذكاء الاصطناعي المتطورة
              </p>
            </div>
            <Dashboard />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-4 px-2">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-2">
                تحليل فيديو جديد
              </h2>
              <p className="text-gray-300 text-sm">
                قم برفع الفيديو للحصول على تحليل دقيق
              </p>
            </div>
            
            <div className="space-y-4">
              <VideoUploader 
                onVideoSelect={handleVideoSelect}
                isAnalyzing={isAnalyzing}
              />
              
              <AnalysisResults 
                isAnalyzing={isAnalyzing}
                videoFile={selectedVideo}
              />
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-4 px-2">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-2">
                نتائج التحليل
              </h2>
              <p className="text-gray-300 text-sm">
                عرض نتائج التحاليل السابقة
              </p>
            </div>
            
            <AnalysisResults 
              isAnalyzing={isAnalyzing}
              videoFile={selectedVideo}
            />
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4 px-2">
            <div className="text-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-blue-400 mb-2">
                حول التطبيق
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="medical-card p-4">
                <h3 className="text-md font-semibold text-blue-400 mb-3">🔬 التقنيات المستخدمة</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• تحليل بالذكاء الاصطناعي</li>
                  <li>• معالجة الفيديو المتقدمة</li>
                  <li>• تحليل الحركة والسرعة</li>
                  <li>• تقارير دقيقة ومفصلة</li>
                </ul>
              </div>

              <div className="medical-card p-4">
                <h3 className="text-md font-semibold text-blue-400 mb-3">🎯 المميزات</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• سهولة الاستخدام</li>
                  <li>• نتائج سريعة ودقيقة</li>
                  <li>• واجهة متجاوبة للهواتف</li>
                  <li>• تصدير التقارير</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <MedicalHeader />
      
      <main className="flex-1 container mx-auto py-4 pb-20 md:pb-8 max-w-4xl">
        {renderTabContent()}
      </main>

      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}

      {!isMobile && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-center space-x-6 rtl:space-x-reverse">
              {[
                { id: 'dashboard', label: 'الرئيسية' },
                { id: 'upload', label: 'تحليل جديد' },
                { id: 'results', label: 'النتائج' },
                { id: 'about', label: 'حول التطبيق' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-gray-300 py-4 border-t border-gray-700">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              © 2024 تطبيق تحليل الفيديو بالذكاء الاصطناعي
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
