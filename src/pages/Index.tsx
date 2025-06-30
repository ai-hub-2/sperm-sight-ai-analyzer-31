
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalHeader from '@/components/MedicalHeader';
import VideoUploader from '@/components/VideoUploader';
import AnalysisResults from '@/components/AnalysisResults';
import Dashboard from '@/components/Dashboard';
import { Home, Upload, BarChart3, Settings } from 'lucide-react';

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    setIsAnalyzing(true);
    
    // محاكاة وقت التحليل
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 10000); // 10 ثواني
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MedicalHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Upload className="h-4 w-4" />
              <span>رفع الفيديو</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2 rtl:space-x-reverse">
              <BarChart3 className="h-4 w-4" />
              <span>النتائج</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Settings className="h-4 w-4" />
              <span>الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                مرحباً بك في نظام تحليل الحيوانات المنوية
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                نظام طبي متقدم يستخدم الذكاء الاصطناعي لتحليل فيديوهات الحيوانات المنوية 
                وتوفير تقارير دقيقة وشاملة للأطباء والمختصين
              </p>
            </div>
            <Dashboard />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  رفع فيديو للتحليل
                </h2>
                <p className="text-gray-600">
                  قم برفع فيديو الحيوانات المنوية للحصول على تحليل مفصل باستخدام الذكاء الاصطناعي
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <VideoUploader 
                    onVideoSelect={handleVideoSelect}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
                
                <div>
                  <AnalysisResults 
                    isAnalyzing={isAnalyzing}
                    videoFile={selectedVideo}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  نتائج التحليل
                </h2>
                <p className="text-gray-600">
                  عرض مفصل لنتائج تحليل الحيوانات المنوية والتوصيات الطبية
                </p>
              </div>
              
              <AnalysisResults 
                isAnalyzing={isAnalyzing}
                videoFile={selectedVideo}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  إعدادات النظام
                </h2>
                <p className="text-gray-600">
                  تخصيص إعدادات التحليل والنظام
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="medical-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات التحليل</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        دقة التحليل
                      </label>
                      <select className="medical-input">
                        <option>عالية (بطيء)</option>
                        <option>متوسطة (موصى به)</option>
                        <option>سريعة</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        حد الثقة الأدنى
                      </label>
                      <input 
                        type="range" 
                        min="70" 
                        max="99" 
                        defaultValue="85"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>70%</span>
                        <span>99%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="medical-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات التقارير</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        تضمين الصور في التقرير
                      </span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        إرسال تنبيهات عبر البريد
                      </span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        حفظ النتائج تلقائياً
                      </span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">تحليل الحيوانات المنوية بالذكاء الاصطناعي</h3>
              <p className="text-gray-300 text-sm">
                نظام طبي متقدم يوفر تحليل دقيق وسريع للحيوانات المنوية 
                باستخدام أحدث تقنيات الذكاء الاصطناعي
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-3">الميزات</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• تحليل سريع ودقيق</li>
                <li>• تقارير مفصلة</li>
                <li>• واجهة سهلة الاستخدام</li>
                <li>• دعم متعدد الصيغ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-3">التقنيات المستخدمة</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• YOLOv8 للكشف</li>
                <li>• DeepSORT للتتبع</li>
                <li>• React للواجهة</li>
                <li>• FastAPI للخادم</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 mt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 نظام تحليل الحيوانات المنوية بالذكاء الاصطناعي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
