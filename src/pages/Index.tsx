
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
              <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4">
                مرحباً بك في مختبر سينا للتحاليل الطبية
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
                مختبر متخصص في التحاليل الطبية المتقدمة باستخدام الذكاء الاصطناعي
                لتقديم نتائج دقيقة وموثوقة في وقت قياسي
              </p>
              <div className="mt-6 p-4 bg-green-900/30 border border-green-600/30 rounded-lg">
                <p className="text-green-400 font-medium">
                  🔬 خبرة ودقة تحدد الأمان - تحاليل احترافية متقدمة
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
              <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">
                تحليل طبي بالذكاء الاصطناعي
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                قم برفع عينة الفحص للحصول على تحليل مفصل ودقيق
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
              <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">
                نتائج التحليل والتقارير الطبية
              </h2>
              <p className="text-gray-300 text-sm md:text-base">
                عرض مفصل لنتائج التحاليل والتوصيات الطبية المتخصصة
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
              <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">
                عن مختبر سينا
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">🏥 رؤيتنا</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  نسعى لتقديم أفضل الخدمات التشخيصية والتحليلية بأحدث التقنيات
                  والأجهزة المتطورة لضمان الدقة والسرعة في النتائج.
                </p>
              </div>

              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">🔬 التقنيات المتقدمة</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• تحليل بالذكاء الاصطناعي</li>
                  <li>• أجهزة تشخيصية متطورة</li>
                  <li>• فحوصات شاملة ودقيقة</li>
                  <li>• تقارير مفصلة واضحة</li>
                  <li>• نظام إدارة متكامل</li>
                </ul>
              </div>

              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">🛡️ الجودة والاعتماد</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• اعتماد وزارة الصحة</li>
                  <li>• شهادات جودة دولية</li>
                  <li>• كوادر طبية متخصصة</li>
                  <li>• ضمان دقة النتائج</li>
                </ul>
              </div>

              <div className="medical-card p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">📞 خدمة العملاء</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  نوفر خدمة عملاء متميزة على مدار الساعة للإجابة على استفساراتكم
                  وتقديم الدعم اللازم لضمان راحتكم وثقتكم.
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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <MedicalHeader />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        {renderTabContent()}
      </main>

      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}

      {!isMobile && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-4">
          <div className="container mx-auto">
            <div className="flex justify-center space-x-8 rtl:space-x-reverse">
              {[
                { id: 'dashboard', label: 'الرئيسية' },
                { id: 'upload', label: 'تحليل جديد' },
                { id: 'results', label: 'النتائج' },
                { id: 'about', label: 'عن المختبر' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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

      <footer className="bg-gray-800 text-gray-300 py-6 md:py-8 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-3 gap-8'}`}>
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 text-blue-400">
                مختبر سينا للتحاليل الطبية
              </h3>
              <p className="text-gray-400 text-xs md:text-sm">
                خبرة ودقة تحدد الأمان في مجال التحاليل الطبية المتخصصة
                باستخدام أحدث التقنيات والأجهزة المتطورة
              </p>
            </div>
            
            <div>
              <h4 className="text-sm md:text-md font-semibold mb-3 text-blue-400">خدماتنا</h4>
              <ul className="text-gray-400 text-xs md:text-sm space-y-1">
                <li>• تحاليل شاملة متقدمة</li>
                <li>• فحوصات تشخيصية دقيقة</li>
                <li>• تقارير طبية مفصلة</li>
                <li>• استشارات متخصصة</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm md:text-md font-semibold mb-3 text-blue-400">التواصل</h4>
              <ul className="text-gray-400 text-xs md:text-sm space-y-1">
                <li>• خدمة عملاء 24/7</li>
                <li>• استشارة طبية مجانية</li>
                <li>• دعم تقني متخصص</li>
                <li>• نتائج سريعة ودقيقة</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4 md:pt-6 mt-6 md:mt-8 text-center">
            <p className="text-gray-500 text-xs md:text-sm">
              © 2024 مختبر سينا للتحاليل الطبية - خبرة ودقة تحدد الأمان
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
