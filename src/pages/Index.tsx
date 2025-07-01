
import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import MobileHeader from '@/components/MobileHeader';
import MobileBottomNav from '@/components/MobileBottomNav';
import AIModelConfig from '@/components/AIModelConfig';
import VideoUploader from '@/components/VideoUploader';
import { useRealAIAnalysis } from '@/hooks/useRealAIAnalysis';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [modelConfig, setModelConfig] = useState({
    model: 'yolov8n' as const,
    confidenceThreshold: 0.5,
    maxDetections: 200,
    gpuAcceleration: true,
    pythonBackendUrl: 'https://your-python-backend.railway.app'
  });

  const isMobile = useIsMobile();
  
  const {
    analyzeFile,
    fetchResults,
    isAnalyzing,
    currentResult,
    results,
    updateModelConfig
  } = useRealAIAnalysis();

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    updateModelConfig(modelConfig);
  }, [modelConfig, updateModelConfig]);

  const handleVideoSelect = async (file: File) => {
    try {
      await analyzeFile(file);
    } catch (error) {
      console.error('Error analyzing video:', error);
    }
  };

  const handleModelConfigChange = (newConfig: typeof modelConfig) => {
    setModelConfig(newConfig);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-medical-background">
        <MobileHeader />
        <div className="pb-16 pt-16">
          {activeTab === 'upload' && (
            <div className="p-4">
              <VideoUploader 
                onVideoSelect={handleVideoSelect}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}
          {activeTab === 'results' && (
            <div className="p-4">
              <Dashboard 
                currentResult={currentResult}
                results={results}
                isLoading={isAnalyzing}
              />
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-4">
              <AIModelConfig 
                currentConfig={modelConfig}
                onConfigChange={handleModelConfigChange}
              />
            </div>
          )}
        </div>
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الأيسر - رفع الفيديو والإعدادات */}
          <div className="lg:col-span-1 space-y-6">
            <VideoUploader 
              onVideoSelect={handleVideoSelect}
              isAnalyzing={isAnalyzing}
            />
            <AIModelConfig 
              currentConfig={modelConfig}
              onConfigChange={handleModelConfigChange}
            />
          </div>

          {/* العمود الأيمن - النتائج واللوحة الرئيسية */}
          <div className="lg:col-span-2">
            <Dashboard 
              currentResult={currentResult}
              results={results}
              isLoading={isAnalyzing}
            />
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Index;
