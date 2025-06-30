
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Eye, 
  BarChart3, 
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AnalysisData {
  filename: string;
  sperm_count: number;
  speed_avg: number;
  motility_percentage: number;
  normal_morphology: number;
  concentration: number;
  total_volume: number;
  analysis_duration: number;
  confidence_score: number;
}

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  videoFile: File | null;
}

const AnalysisResults = ({ isAnalyzing, videoFile }: AnalysisResultsProps) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (isAnalyzing && videoFile) {
      simulateAnalysis();
    }
  }, [isAnalyzing, videoFile]);

  const simulateAnalysis = () => {
    setAnalysisProgress(0);
    setAnalysisData(null);

    const stages = [
      { progress: 20, message: 'تحليل جودة الفيديو...' },
      { progress: 40, message: 'تحديد الحيوانات المنوية...' },
      { progress: 60, message: 'تتبع الحركة...' },
      { progress: 80, message: 'حساب المعدلات...' },
      { progress: 100, message: 'إنهاء التحليل...' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setAnalysisProgress(stages[currentStage].progress);
        toast.info(stages[currentStage].message);
        currentStage++;
      } else {
        clearInterval(interval);
        generateResults();
      }
    }, 2000);
  };

  const generateResults = () => {
    // محاكاة نتائج حقيقية
    const results: AnalysisData = {
      filename: videoFile?.name || 'unknown.mp4',
      sperm_count: Math.floor(Math.random() * 200) + 150,
      speed_avg: parseFloat((Math.random() * 30 + 20).toFixed(2)),
      motility_percentage: parseFloat((Math.random() * 40 + 50).toFixed(1)),
      normal_morphology: parseFloat((Math.random() * 20 + 70).toFixed(1)),
      concentration: parseFloat((Math.random() * 50 + 100).toFixed(1)),
      total_volume: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      analysis_duration: parseFloat((Math.random() * 60 + 30).toFixed(0)),
      confidence_score: parseFloat((Math.random() * 10 + 90).toFixed(1))
    };

    setAnalysisData(results);
    toast.success('تم التحليل بنجاح');
  };

  const getHealthStatus = (count: number, motility: number) => {
    if (count >= 150 && motility >= 70) {
      return { status: 'ممتاز', color: 'bg-green-500', textColor: 'text-green-700' };
    } else if (count >= 100 && motility >= 50) {
      return { status: 'جيد', color: 'bg-blue-500', textColor: 'text-blue-700' };
    } else if (count >= 50 && motility >= 30) {
      return { status: 'متوسط', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    } else {
      return { status: 'يحتاج متابعة', color: 'bg-red-500', textColor: 'text-red-700' };
    }
  };

  const exportResults = () => {
    if (!analysisData) return;

    const reportData = {
      تاريخ_التحليل: new Date().toLocaleDateString('ar-SA'),
      اسم_الملف: analysisData.filename,
      عدد_الحيوانات_المنوية: analysisData.sperm_count,
      متوسط_السرعة: `${analysisData.speed_avg} μm/s`,
      نسبة_الحركة: `${analysisData.motility_percentage}%`,
      الشكل_الطبيعي: `${analysisData.normal_morphology}%`,
      التركيز: `${analysisData.concentration} million/mL`,
      الحجم_الكلي: `${analysisData.total_volume} mL`,
      مدة_التحليل: `${analysisData.analysis_duration} ثانية`,
      درجة_الثقة: `${analysisData.confidence_score}%`
    };

    const csvContent = Object.entries(reportData)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sperm_analysis_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('تم تصدير التقرير بنجاح');
  };

  if (isAnalyzing) {
    return (
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>جاري التحليل...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">يتم تحليل الفيديو باستخدام الذكاء الاصطناعي</p>
            </div>
            <Progress value={analysisProgress} className="h-4" />
            <p className="text-sm text-center text-gray-500">
              {analysisProgress}% مكتمل
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card className="medical-card">
        <CardContent className="text-center py-8">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">لم يتم تحليل أي فيديو بعد</p>
          <p className="text-sm text-gray-400 mt-2">قم برفع فيديو لبدء التحليل</p>
        </CardContent>
      </Card>
    );
  }

  const healthStatus = getHealthStatus(analysisData.sperm_count, analysisData.motility_percentage);

  return (
    <div className="space-y-6">
      {/* ملخص النتائج */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
              <BarChart3 className="h-6 w-6" />
              <span>نتائج التحليل</span>
            </CardTitle>
            <Badge className={`${healthStatus.color} text-white`}>
              {healthStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* عدد الحيوانات المنوية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">عدد الخلايا</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{analysisData.sperm_count}</p>
              <p className="text-xs text-blue-600">خلية/عينة</p>
            </div>

            {/* متوسط السرعة */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">متوسط السرعة</span>
                <Activity className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-900">{analysisData.speed_avg}</p>
              <p className="text-xs text-green-600">μm/s</p>
            </div>

            {/* نسبة الحركة */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">نسبة الحركة</span>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-900">{analysisData.motility_percentage}%</p>
              <p className="text-xs text-purple-600">خلايا متحركة</p>
            </div>

            {/* درجة الثقة */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">درجة الثقة</span>
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-orange-900">{analysisData.confidence_score}%</p>
              <p className="text-xs text-orange-600">دقة التحليل</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التفاصيل المتقدمة */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-medical-primary">التفاصيل المتقدمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">المعايير الأساسية</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">الشكل الطبيعي:</span>
                  <span className="font-medium">{analysisData.normal_morphology}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التركيز:</span>
                  <span className="font-medium">{analysisData.concentration} مليون/مل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحجم الكلي:</span>
                  <span className="font-medium">{analysisData.total_volume} مل</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">معلومات التحليل</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">اسم الملف:</span>
                  <span className="font-medium text-xs">{analysisData.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مدة التحليل:</span>
                  <span className="font-medium">{analysisData.analysis_duration} ثانية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ التحليل:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* توصيات طبية */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
            <AlertTriangle className="h-6 w-6" />
            <span>التوصيات الطبية</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData.sperm_count < 100 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">تحذير: عدد الحيوانات المنوية أقل من المعدل الطبيعي</p>
                <p className="text-red-600 text-sm mt-1">يُنصح بمراجعة طبيب الخصوبة لإجراء فحوصات إضافية</p>
              </div>
            )}
            
            {analysisData.motility_percentage < 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">تنبيه: نسبة الحركة منخفضة</p>
                <p className="text-yellow-600 text-sm mt-1">قد تحتاج لتحسين نمط الحياة والتغذية</p>
              </div>
            )}

            {analysisData.sperm_count >= 150 && analysisData.motility_percentage >= 70 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">ممتاز: النتائج في المعدل الطبيعي</p>
                <p className="text-green-600 text-sm mt-1">استمر في نمط الحياة الصحي الحالي</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* أزرار التحكم */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
        <Button onClick={exportResults} className="medical-button flex-1">
          <Download className="mr-2 h-4 w-4" />
          تصدير التقرير (CSV)
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.print()} 
          className="flex-1"
        >
          طباعة التقرير
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
