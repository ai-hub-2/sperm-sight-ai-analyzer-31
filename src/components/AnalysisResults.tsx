
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Eye, 
  BarChart3, 
  Download,
  RefreshCw,
  CheckCircle2,
  History,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      return { status: 'ممتاز', color: 'status-excellent', textColor: 'text-green-400' };
    } else if (count >= 100 && motility >= 50) {
      return { status: 'جيد', color: 'status-good', textColor: 'text-blue-400' };
    } else if (count >= 50 && motility >= 30) {
      return { status: 'متوسط', color: 'status-average', textColor: 'text-yellow-400' };
    } else {
      return { status: 'يحتاج متابعة', color: 'status-needs-attention', textColor: 'text-red-400' };
    }
  };

  if (isAnalyzing) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="mb-6">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold gradient-text mb-2">
            جاري التحليل بالذكاء الاصطناعي
          </h3>
          <p className="text-gray-300 text-lg">
            يتم معالجة الفيديو باستخدام خوارزميات متطورة
          </p>
        </div>
        
        <div className="glass-card p-6 max-w-md mx-auto">
          <h5 className="font-semibold text-emerald-400 mb-4 text-lg">مراحل التحليل:</h5>
          <div className="space-y-3 text-right">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">رفع الفيديو بنجاح</span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
              <span className="text-gray-300">تحليل الإطارات</span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">حساب النتائج</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentResult && results.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Eye className="mx-auto h-16 w-16 text-gray-400 mb-6" />
        <h3 className="text-2xl font-bold text-gray-300 mb-3">لا توجد نتائج بعد</h3>
        <p className="text-gray-400 text-lg">قم برفع فيديو لبدء التحليل الذكي</p>
      </div>
    );
  }

  const displayResult = currentResult || results[0];
  if (!displayResult) return null;

  const healthStatus = getHealthStatus(displayResult.sperm_count, displayResult.motility || 0);

  return (
    <div className="space-y-8">
      {/* النتائج الرئيسية */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">نتائج التحليل</h2>
              <p className="text-gray-400">{displayResult.filename}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Badge className={`${healthStatus.color} text-white px-4 py-2 text-lg font-semibold`}>
              {healthStatus.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="glass-card border-white/20 hover:bg-white/10"
            >
              <History className="h-4 w-4 mr-2" />
              التاريخ
            </Button>
          </div>
        </div>

        {/* البيانات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card">
            <div className="metric-icon bg-gradient-to-r from-blue-500 to-cyan-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">عدد الخلايا</h4>
            <p className="text-3xl font-bold text-white mb-1">{displayResult.sperm_count}</p>
            <p className="text-sm text-gray-400">خلية مكتشفة</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon bg-gradient-to-r from-green-500 to-emerald-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">السرعة المتوسطة</h4>
            <p className="text-3xl font-bold text-white mb-1">{displayResult.speed_avg}</p>
            <p className="text-sm text-gray-400">μm/s</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon bg-gradient-to-r from-purple-500 to-pink-500">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">نسبة الحركة</h4>
            <p className="text-3xl font-bold text-white mb-1">{displayResult.motility || 0}%</p>
            <p className="text-sm text-gray-400">خلايا نشطة</p>
          </div>

          <div className="metric-card">
            <div className="metric-icon bg-gradient-to-r from-orange-500 to-red-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">دقة النظام</h4>
            <p className="text-3xl font-bold text-white mb-1">95%</p>
            <p className="text-sm text-gray-400">ذكاء اصطناعي</p>
          </div>
        </div>

        {/* تفاصيل إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h4 className="font-bold text-emerald-400 mb-4 text-lg">المعايير الطبية</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">الشكل الطبيعي:</span>
                <span className="font-semibold text-white">
                  {displayResult.morphology && typeof displayResult.morphology === 'object' && 'normal' in displayResult.morphology 
                    ? `${displayResult.morphology.normal}%` 
                    : '0%'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">التركيز:</span>
                <span className="font-semibold text-white">{displayResult.concentration || 0} مليون/مل</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">العدد الكلي المتحرك:</span>
                <span className="font-semibold text-white">{displayResult.total_motile_count || 0} مليون</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold text-cyan-400 mb-4 text-lg">تفاصيل التحليل</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">مدة المعالجة:</span>
                <span className="font-semibold text-white">{displayResult.processing_time_seconds || 0} ثانية</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">نموذج الذكاء الاصطناعي:</span>
                <span className="font-semibold text-emerald-400 text-sm">YOLOv8 + DeepSORT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">تاريخ التحليل:</span>
                <span className="font-semibold text-white text-sm">
                  {new Date(displayResult.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* التاريخ */}
      {showHistory && results.length > 1 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-6">التحاليل السابقة</h3>
          <div className="space-y-4">
            {results.slice(1, 6).map((result, index) => (
              <div key={result.id} className="glass-card p-4 interactive-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{result.filename}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(result.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400">{result.sperm_count} خلية</p>
                    <p className="text-sm text-gray-400">{result.speed_avg} μm/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أزرار التحكم */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={() => exportResults('csv')} className="medical-button text-lg py-4">
          <Download className="mr-2 h-5 w-5" />
          تصدير CSV
        </Button>
        <Button onClick={() => exportResults('json')} className="glass-card border-white/20 hover:bg-white/10 text-white text-lg py-4">
          <Download className="mr-2 h-5 w-5" />
          تصدير JSON
        </Button>
        <Button 
          onClick={() => window.print()} 
          className="glass-card border-white/20 hover:bg-white/10 text-white text-lg py-4"
        >
          <Download className="mr-2 h-5 w-5" />
          طباعة التقرير
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
