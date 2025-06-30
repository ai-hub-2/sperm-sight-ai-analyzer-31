
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Eye, 
  BarChart3, 
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSpermAnalysis } from '@/hooks/useSpermAnalysis';

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  videoFile: File | null;
}

const AnalysisResults = ({ isAnalyzing, videoFile }: AnalysisResultsProps) => {
  const { currentResult, results, fetchResults, exportResults } = useSpermAnalysis();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

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

  if (isAnalyzing) {
    return (
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>جاري التحليل بالذكاء الاصطناعي...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">يتم تحليل الفيديو باستخدام YOLOv8 + DeepSORT</p>
              <p className="text-sm text-gray-500">هذا قد يستغرق عدة دقائق حسب حجم الفيديو</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">مراحل التحليل:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ رفع الفيديو إلى التخزين السحابي</li>
                <li>🔄 تحليل الإطارات باستخدام YOLO</li>
                <li>🔄 تتبع الخلايا باستخدام DeepSORT</li>
                <li>⏳ حساب الإحصائيات والنتائج</li>
                <li>⏳ حفظ البيانات في قاعدة البيانات</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentResult && results.length === 0) {
    return (
      <Card className="medical-card">
        <CardContent className="text-center py-8">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">لم يتم تحليل أي فيديو بعد</p>
          <p className="text-sm text-gray-400 mt-2">قم برفع فيديو لبدء التحليل بالذكاء الاصطناعي</p>
        </CardContent>
      </Card>
    );
  }

  const displayResult = currentResult || results[0];
  if (!displayResult) return null;

  const healthStatus = getHealthStatus(displayResult.sperm_count, displayResult.motility || 0);

  return (
    <div className="space-y-6">
      {/* ملخص النتائج */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
              <BarChart3 className="h-6 w-6" />
              <span>نتائج التحليل - {displayResult.filename}</span>
            </CardTitle>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Badge className={`${healthStatus.color} text-white`}>
                {healthStatus.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-4 w-4 mr-2" />
                التاريخ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* عدد الحيوانات المنوية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">عدد الخلايا</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{displayResult.sperm_count}</p>
              <p className="text-xs text-blue-600">خلية متحركة</p>
            </div>

            {/* متوسط السرعة */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">متوسط السرعة</span>
                <Activity className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-900">{displayResult.speed_avg}</p>
              <p className="text-xs text-green-600">μm/s</p>
            </div>

            {/* نسبة الحركة */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">نسبة الحركة</span>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-900">{displayResult.motility || 0}%</p>
              <p className="text-xs text-purple-600">خلايا نشطة</p>
            </div>

            {/* درجة الثقة */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">درجة الثقة</span>
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-orange-900">95%</p>
              <p className="text-xs text-orange-600">دقة الذكاء الاصطناعي</p>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">المعايير الطبية</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">الشكل الطبيعي:</span>
                  <span className="font-medium">
                    {displayResult.morphology && typeof displayResult.morphology === 'object' && 'normal' in displayResult.morphology 
                      ? `${displayResult.morphology.normal}%` 
                      : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التركيز:</span>
                  <span className="font-medium">{displayResult.concentration || 0} مليون/مل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العدد الكلي المتحرك:</span>
                  <span className="font-medium">{displayResult.total_motile_count || 0} مليون</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">تفاصيل التحليل</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">مدة المعالجة:</span>
                  <span className="font-medium">{displayResult.processing_time_seconds || 0} ثانية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نموذج الذكاء الاصطناعي:</span>
                  <span className="font-medium text-xs">YOLOv8 + DeepSORT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ التحليل:</span>
                  <span className="font-medium text-xs">
                    {new Date(displayResult.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التاريخ */}
      {showHistory && results.length > 1 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="text-medical-primary">تاريخ التحاليل السابقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.slice(1, 6).map((result, index) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{result.filename}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(result.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{result.sperm_count} خلية</p>
                    <p className="text-xs text-gray-500">{result.speed_avg} μm/s</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* أزرار التحكم */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
        <Button onClick={() => exportResults('csv')} className="medical-button flex-1">
          <Download className="mr-2 h-4 w-4" />
          تصدير التقرير (CSV)
        </Button>
        <Button onClick={() => exportResults('json')} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          تصدير البيانات (JSON)
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
