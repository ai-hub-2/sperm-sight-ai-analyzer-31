
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                مرحباً بك في نظام تحليل الحيوانات المنوية بالذكاء الاصطناعي
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                نظام طبي متقدم يستخدم نماذج YOLOv8 و DeepSORT لتحليل فيديوهات الحيوانات المنوية 
                وتوفير تقارير دقيقة وشاملة مجاناً للجميع
              </p>
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  🚀 النظام مجاني ومتاح للجميع - لا يتطلب تسجيل دخول
                </p>
              </div>
            </div>
            <Dashboard />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                تحليل فيديو بالذكاء الاصطناعي
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                قم برفع فيديو الحيوانات المنوية للحصول على تحليل مفصل مجاناً
              </p>
            </div>
            
            <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}`}>
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                نتائج التحليل والتقارير
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                عرض مفصل لنتائج تحليل الحيوانات المنوية والتوصيات الطبية
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                حول النظام
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 الهدف من النظام</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  توفير تحليل دقيق ومجاني للحيوانات المنوية باستخدام أحدث تقنيات الذكاء الاصطناعي، 
                  مما يساعد الأطباء والمختصين في الحصول على نتائج سريعة وموثوقة دون تكلفة.
                </p>
              </div>

              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔬 التقنيات المستخدمة</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• YOLOv8 للكشف المتقدم عن الخلايا</li>
                  <li>• DeepSORT للتتبع الذكي للحركة</li>
                  <li>• React + TypeScript للواجهة</li>
                  <li>• Supabase للبيانات والتخزين</li>
                  <li>• تحليل سحابي متقدم</li>
                </ul>
              </div>

              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ الخصوصية والأمان</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• لا يتطلب تسجيل دخول</li>
                  <li>• حفظ آمن مشفر للبيانات</li>
                  <li>• عدم مشاركة المعلومات الطبية</li>
                  <li>• حذف تلقائي للملفات بعد التحليل</li>
                </ul>
              </div>

              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 الدعم والمساعدة</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  النظام مفتوح المصدر ومتاح على GitHub. 
                  يمكنك المساهمة في التطوير أو الحصول على الدعم التقني من خلال المجتمع.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MedicalHeader />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        {renderTabContent()}
      </main>

      {/* الشريط السفلي للجوال */}
      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}

      {/* التنقل العادي للحاسوب */}
      {!isMobile && (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="container mx-auto">
            <div className="flex justify-center space-x-8 rtl:space-x-reverse">
              {[
                { id: 'dashboard', label: 'الرئيسية' },
                { id: 'upload', label: 'تحليل فيديو' },
                { id: 'results', label: 'النتائج' },
                { id: 'about', label: 'حول النظام' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-medical-primary text-white'
                      : 'text-gray-600 hover:text-medical-primary hover:bg-blue-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-3 gap-8'}`}>
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3">
                تحليل الحيوانات المنوية بالذكاء الاصطناعي
              </h3>
              <p className="text-gray-300 text-xs md:text-sm">
                نظام طبي مجاني ومفتوح المصدر يوفر تحليل دقيق وسريع للحيوانات المنوية 
                باستخدام أحدث تقنيات الذكاء الاصطناعي
              </p>
            </div>
            
            <div>
              <h4 className="text-sm md:text-md font-semibold mb-3">الميزات</h4>
              <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                <li>• تحليل مجاني بالذكاء الاصطناعي</li>
                <li>• تتبع دقيق للخلايا المتحركة</li>
                <li>• تقارير قابلة للتصدير</li>
                <li>• واجهة متجاوبة للجوال</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm md:text-md font-semibold mb-3">مفتوح المصدر</h4>
              <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                <li>• متاح على GitHub</li>
                <li>• مساهمات المجتمع مرحبة</li>
                <li>• تطوير مستمر</li>
                <li>• دعم تقني مجاني</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4 md:pt-6 mt-6 md:mt-8 text-center">
            <p className="text-gray-400 text-xs md:text-sm">
              © 2024 نظام تحليل الحيوانات المنوية بالذكاء الاصطناعي - مجاني للجميع
            </p>
            <p className="text-gray-500 text-xs mt-2">
              مفتوح المصدر على GitHub - مدعوم بـ Supabase + Netlify
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
