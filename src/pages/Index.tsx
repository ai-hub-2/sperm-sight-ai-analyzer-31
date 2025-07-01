
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  Download,
  Trash2,
  FileText,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Brain,
  Microscope
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealAIAnalysis } from '@/hooks/useRealAIAnalysis';
import UploadZone from '@/components/UploadZone';
import AIModelConfig from '@/components/AIModelConfig';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const {
    analyzeFile,
    fetchResults,
    exportResults,
    deleteResult,
    updateModelConfig,
    isAnalyzing,
    uploadProgress,
    analysisProgress,
    currentResult,
    results
  } = useRealAIAnalysis();

  const [activeTab, setActiveTab] = useState('upload');
  const [modelConfig, setModelConfig] = useState({
    model: 'yolov8n' as const,
    confidenceThreshold: 0.5,
    maxDetections: 200,
    gpuAcceleration: true,
    pythonBackendUrl: 'http://localhost:8000'
  });

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleConfigChange = (config: typeof modelConfig) => {
    setModelConfig(config);
    updateModelConfig(config);
  };

  const getMotilityColor = (motility?: number) => {
    if (!motility) return 'text-gray-500';
    if (motility >= 40) return 'text-green-600';
    if (motility >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMotilityLabel = (motility?: number) => {
    if (!motility) return 'غير محدد';
    if (motility >= 40) return 'طبيعية';
    if (motility >= 25) return 'منخفضة';
    return 'ضعيفة جداً';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800 dark:text-green-300">
                  تحليل الحيوانات المنوية بالذكاء الاصطناعي
                </h1>
                <p className="text-sm text-green-600 dark:text-green-400">
                  نظام متقدم للتشخيص الطبي
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-300">
                <Brain className="w-3 h-3 mr-1" />
                نشط
              </Badge>
              {isAnalyzing && (
                <Badge className="bg-orange-500 animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  جاري التحليل
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid grid-cols-4 lg:w-fit mx-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              رفع وتحليل
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              النتائج
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              السجل
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <UploadZone />
              </div>
              
              {/* Real-time Analysis Status */}
              <div className="space-y-4">
                {isAnalyzing && (
                  <Card className="medical-card border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                        <Activity className="w-5 h-5 animate-pulse" />
                        حالة التحليل المباشر
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>رفع الملف</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>معالجة بالذكاء الاصطناعي</span>
                          <span>{Math.round(analysisProgress)}%</span>
                        </div>
                        <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${analysisProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Current Analysis Info */}
                {currentResult && (
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        نتائج التحليل الحالي
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            {currentResult.sperm_count.toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-500">
                            عدد الحيوانات المنوية
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className={`text-2xl font-bold ${getMotilityColor(currentResult.motility)}`}>
                            {currentResult.motility?.toFixed(1) || '0'}%
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-500">
                            نسبة الحركة
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                            {currentResult.total_motile_count?.toLocaleString() || '0'}
                          </div>
                          <div className="text-sm text-purple-600 dark:text-purple-500">
                            العدد المتحرك
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                            {currentResult.concentration?.toFixed(1) || '0'}M/ml
                          </div>
                          <div className="text-sm text-amber-600 dark:text-amber-500">
                            التركيز
                          </div>
                        </div>
                      </div>

                      {/* Morphology */}
                      {currentResult.morphology && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">الشكل المورفولوجي</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>طبيعي: {currentResult.morphology.normal || 0}%</div>
                            <div>غير طبيعي: {currentResult.morphology.abnormal || 0}%</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => exportResults('csv')}
                          size="sm"
                          className="medical-button-secondary"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          تصدير CSV
                        </Button>
                        <Button
                          onClick={() => exportResults('json')}
                          size="sm"
                          className="medical-button-secondary"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          تصدير JSON
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {currentResult ? (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Metrics */}
                <Card className="medical-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      المؤشرات الرئيسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                          {currentResult.sperm_count.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-500 mt-1">
                          العدد الكلي
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          (طبيعي: &gt;15M)
                        </div>
                      </div>

                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className={`text-3xl font-bold ${getMotilityColor(currentResult.motility)}`}>
                          {currentResult.motility?.toFixed(1) || '0'}%
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-500 mt-1">
                          الحركة
                        </div>
                        <div className={`text-xs mt-1 ${getMotilityColor(currentResult.motility)}`}>
                          {getMotilityLabel(currentResult.motility)}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                          {currentResult.speed_avg.toFixed(1)}
                        </div>
                        <div className="text-sm text-purple-600 dark:text-purple-500 mt-1">
                          متوسط السرعة
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          (μm/s)
                        </div>
                      </div>

                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                          {(currentResult.processing_time / 1000).toFixed(1)}s
                        </div>
                        <div className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                          وقت المعالجة
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          بالذكاء الاصطناعي
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Summary */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      ملخص التشخيص
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">جودة العينة</span>
                        <Badge className={currentResult.motility && currentResult.motility >= 40 ? 'bg-green-500' : 'bg-yellow-500'}>
                          {currentResult.motility && currentResult.motility >= 40 ? 'ممتازة' : 'متوسطة'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">التركيز</span>
                        <Badge variant="outline">
                          {currentResult.concentration && currentResult.concentration > 15 ? 'طبيعي' : 'منخفض'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">الحركة التقدمية</span>
                        <Badge variant="outline" className={getMotilityColor(currentResult.motility)}>
                          {getMotilityLabel(currentResult.motility)}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2">التوصيات</h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• مراجعة طبيب مختص</li>
                        <li>• إجراء فحوصات إضافية</li>
                        <li>• اتباع نظام غذائي صحي</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="medical-card text-center py-12">
                <CardContent>
                  <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    لا توجد نتائج تحليل
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    ابدأ بتحليل عينة جديدة لعرض النتائج هنا
                  </p>
                  <Button onClick={() => setActiveTab('upload')} className="medical-button-primary">
                    بدء التحليل
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  سجل التحاليل ({results.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{result.filename}</h4>
                            <Badge variant="outline" className="text-xs">
                              {formatDate(result.created_at)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>العدد: {result.sperm_count.toLocaleString()}</div>
                            <div className={getMotilityColor(result.motility)}>
                              الحركة: {result.motility?.toFixed(1) || '0'}%
                            </div>
                            <div>السرعة: {result.speed_avg.toFixed(1)} μm/s</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Set as current result to view
                              setActiveTab('results');
                            }}
                          >
                            عرض
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteResult(result.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      لا يوجد سجل تحاليل
                    </h3>
                    <p className="text-sm text-gray-500">
                      ستظهر جميع التحاليل السابقة هنا
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <AIModelConfig 
              currentConfig={modelConfig}
              onConfigChange={handleConfigChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
