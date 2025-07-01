import React, { useState, useEffect } from 'react';
import MobileHeader from '@/components/MobileHeader';
import MobileBottomNav from '@/components/MobileBottomNav';
import SettingsModal from '@/components/SettingsModal';
import UploadZone from '@/components/UploadZone';
import ResultsDashboard from '@/components/ResultsDashboard';
import AIModelConfig from '@/components/AIModelConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity, BarChart3, FileVideo, Image, Settings } from 'lucide-react';
import { useRealAIAnalysis } from '@/hooks/useRealAIAnalysis';
import { defaultAnalysisConfig } from '@/services/aiAnalysisService';

const Index = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showModelConfig, setShowModelConfig] = useState(false);
  const { 
    results, 
    currentResult, 
    fetchResults, 
    exportResults, 
    deleteResult,
    updateModelConfig,
    isAnalyzing,
    uploadProgress,
    analysisProgress
  } = useRealAIAnalysis();

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className={`text-center py-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl flex items-center justify-center">
                  <Activity className="w-10 h-10 text-green-600 dark:text-green-400 animate-pulse" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                {t('welcome')}
              </h1>
              <p className="text-green-700 dark:text-green-400 mb-6">
                نظام تحليل متقدم بالذكاء الاصطناعي للحيوانات المنوية
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="medical-card text-center">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    إجمالي التحاليل
                  </div>
                </div>
                <div className="medical-card text-center">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {results.length > 0 ? Math.round(results.reduce((acc, r) => acc + (r.motility || 0), 0) / results.length) : 0}%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    متوسط الحركة
                  </div>
                </div>
              </div>
            </div>
            
            {/* إضافة زر إعدادات النموذج */}
            <div className="medical-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  نظام الذكاء الاصطناعي
                </h3>
                <button
                  onClick={() => setShowModelConfig(true)}
                  className="medical-button-secondary text-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  إعدادات النموذج
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">النموذج النشط:</span>
                  <span className="font-medium text-green-800 dark:text-green-300">YOLOv8n</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">حالة الخادم:</span>
                  <span className="font-medium text-green-800 dark:text-green-300">متصل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 dark:text-green-400">تسريع GPU:</span>
                  <span className="font-medium text-green-800 dark:text-green-300">مفعل</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <UploadZone />
            
            {/* عرض التقدم إذا كان التحليل جارياً */}
            {isAnalyzing && (
              <div className="medical-card">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4">
                  حالة التحليل
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">رفع الملف</span>
                      <span className="text-sm">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">تحليل AI</span>
                      <span className="text-sm">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
                نتائج التحاليل
              </h2>
              {results.length > 0 && (
                <button
                  onClick={() => exportResults('csv')}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  تصدير CSV
                </button>
              )}
            </div>

            {/* Current Result */}
            {currentResult && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  آخر نتيجة تحليل
                </h3>
                <ResultsDashboard 
                  data={{
                    totalCount: currentResult.sperm_count,
                    motileCount: currentResult.total_motile_count || 0,
                    averageSpeed: currentResult.speed_avg,
                    motilityPercentage: currentResult.motility || 0,
                    concentration: currentResult.concentration || 0,
                    morphologyNormal: currentResult.morphology?.normal || 0
                  }}
                />
              </div>
            )}

            {/* Results History */}
            {results.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  سجل التحاليل السابقة
                </h3>
                {results.map((result) => (
                  <div key={result.id} className="medical-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
                          {result.filename.toLowerCase().includes('mp4') || result.filename.toLowerCase().includes('avi') ? 
                            <FileVideo className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                            <Image className="w-4 h-4 text-green-600 dark:text-green-400" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-300 text-sm">
                            {result.filename}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {new Date(result.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteResult(result.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-600 dark:text-green-400">العدد: </span>
                        <span className="font-medium text-green-800 dark:text-green-300">
                          {result.sperm_count.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-600 dark:text-green-400">السرعة: </span>
                        <span className="font-medium text-green-800 dark:text-green-300">
                          {result.speed_avg} μm/s
                        </span>
                      </div>
                      <div>
                        <span className="text-green-600 dark:text-green-400">الحركة: </span>
                        <span className="font-medium text-green-800 dark:text-green-300">
                          {result.motility || 0}%
                        </span>
                      </div>
                      <div>
                        <span className="text-green-600 dark:text-green-400">التركيز: </span>
                        <span className="font-medium text-green-800 dark:text-green-300">
                          {result.concentration || 0} M/mL
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  لا توجد نتائج تحليل حتى الآن
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="medical-button-primary mt-4"
                >
                  بدء التحليل الأول
                </button>
              </div>
            )}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                تحليل الحيوانات المنوية بالذكاء الاصطناعي
              </h2>
              <p className="text-green-700 dark:text-green-400">
                نظام متقدم للتحليل الطبي الآلي
              </p>
            </div>

            <div className="medical-card">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                المميزات الرئيسية
              </h3>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  تحليل تلقائي بدقة عالية
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  دعم الفيديو والصور الثابتة
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  تحليل مورفولوجي متقدم
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  تقارير شاملة قابلة للتصدير
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  واجهة سهلة الاستخدام
                </li>
              </ul>
            </div>

            <div className="medical-card">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                معلومات تقنية
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <div className="flex justify-between">
                  <span>الإصدار:</span>
                  <span className="font-medium">2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ آخر تحديث:</span>
                  <span className="font-medium">يناير 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>دقة التحليل:</span>
                  <span className="font-medium">95%+</span>
                </div>
                <div className="flex justify-between">
                  <span>أنواع الملفات المدعومة:</span>
                  <span className="font-medium">MP4, AVI, JPEG, PNG</span>
                </div>
              </div>
            </div>

            <div className="medical-card">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                الدعم والمساعدة
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                للحصول على المساعدة التقنية أو الاستفسارات الطبية، يرجى التواصل معنا.
              </p>
              <div className="flex gap-2">
                <button className="medical-button-secondary text-sm flex-1">
                  دليل الاستخدام
                </button>
                <button className="medical-button-secondary text-sm flex-1">
                  تواصل معنا
                </button>
              </div>
            </div>
            
            {/* إضافة معلومات تقنية محدثة */}
            <div className="medical-card">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                المواصفات التقنية
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <div className="flex justify-between">
                  <span>نموذج الكشف:</span>
                  <span className="font-medium">YOLOv8n/s/m</span>
                </div>
                <div className="flex justify-between">
                  <span>نموذج التتبع:</span>
                  <span className="font-medium">DeepSORT</span>
                </div>
                <div className="flex justify-between">
                  <span>معالجة الصور:</span>
                  <span className="font-medium">OpenCV 4.8+</span>
                </div>
                <div className="flex justify-between">
                  <span>الخادم الخلفي:</span>
                  <span className="font-medium">Python FastAPI</span>
                </div>
                <div className="flex justify-between">
                  <span>قاعدة البيانات:</span>
                  <span className="font-medium">Supabase PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span>التطبيق المحمول:</span>
                  <span className="font-medium">Capacitor Android</span>
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
    <div className="app-container">
      <MobileHeader onSettingsClick={() => setShowSettings(true)} />

      <main className="content">
        <div className="container mx-auto px-4 py-8">
          {renderTabContent()}
        </div>
      </main>

      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      {showModelConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AIModelConfig
              currentConfig={defaultAnalysisConfig}
              onConfigChange={updateModelConfig}
            />
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowModelConfig(false)}
                className="medical-button-primary"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
