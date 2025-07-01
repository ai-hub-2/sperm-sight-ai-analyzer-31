
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
          <div className="space-y-8 px-2">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                مرحباً بك في منصة التحليل الذكي
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                تطبيق متطور يستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل مقاطع الفيديو بدقة عالية
              </p>
            </div>
            <Dashboard />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-8 px-2">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                رفع فيديو جديد للتحليل
              </h2>
              <p className="text-gray-300 text-lg">
                قم برفع الفيديو للحصول على تحليل دقيق ومفصل
              </p>
            </div>
            
            <div className="space-y-6">
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
          <div className="space-y-8 px-2">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                نتائج التحليل
              </h2>
              <p className="text-gray-300 text-lg">
                استعرض نتائج التحاليل المحفوظة
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
          <div className="space-y-8 px-2">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                حول التطبيق
              </h2>
              <p className="text-gray-300 text-lg">
                تعرف على التقنيات والمميزات المتطورة
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 interactive-hover">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-4 text-center">التقنيات المستخدمة</h3>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <span>تحليل بالذكاء الاصطناعي YOLOv8</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    <span>تتبع الكائنات DeepSORT</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>معالجة الفيديو المتقدمة</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    <span>تقارير تفاعلية مفصلة</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-8 interactive-hover">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">المميزات الرئيسية</h3>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>واجهة حديثة وسهلة الاستخدام</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span>نتائج سريعة ودقيقة</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span>متوافق مع جميع الأجهزة</span>
                  </li>
                  <li className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span>تصدير التقارير بصيغ متعددة</span>
                  </li>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <MedicalHeader />
      
      <main className="container mx-auto py-8 pb-24 md:pb-12 max-w-6xl">
        {renderTabContent()}
      </main>

      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}

      {!isMobile && (
        <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-4 py-4 z-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              {[
                { id: 'dashboard', label: 'الرئيسية' },
                { id: 'upload', label: 'تحليل جديد' },
                { id: 'results', label: 'النتائج' },
                { id: 'about', label: 'حول التطبيق' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
                      : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
