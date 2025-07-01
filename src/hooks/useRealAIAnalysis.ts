
import { useState, useCallback } from 'react';
import { aiAnalysisService, defaultAnalysisConfig } from '@/services/aiAnalysisService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  id: string;
  filename: string;
  sperm_count: number;
  speed_avg: number;
  motility_percent: number;
  processing_time: number;
  detections: any[];
  annotated_video_url?: string;
  created_at: string;
  motility?: number;
  total_motile_count?: number;
  concentration?: number;
  morphology?: {
    normal?: number;
    abnormal?: number;
  };
}

export const useRealAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const analyzeFile = useCallback(async (file: File) => {
    if (!file) return;

    setIsAnalyzing(true);
    setUploadProgress(0);
    setAnalysisProgress(0);

    try {
      // رفع الملف إلى Supabase Storage
      toast.info('جاري رفع الملف...');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // محاكاة تقدم الرفع
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      clearInterval(uploadInterval);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      toast.success('تم رفع الملف بنجاح');
      setUploadProgress(100);

      // بدء التحليل باستخدام AI
      toast.info('بدء التحليل بالذكاء الاصطناعي...');
      const analysisResult = await aiAnalysisService.analyzeVideo(file, (progress) => {
        setAnalysisProgress(progress);
      });

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'فشل في التحليل');
      }

      // حفظ النتائج في قاعدة البيانات
      const { data: savedResult, error: saveError } = await supabase
        .from('analysis_results')
        .insert({
          filename: file.name,
          sperm_count: analysisResult.data.sperm_count,
          speed_avg: analysisResult.data.speed_avg,
          motility: analysisResult.data.motility_percent,
          processing_time_seconds: analysisResult.data.processing_time,
          video_url: filePath,
          movement_pattern: { detections: analysisResult.data.detections }
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving results:', saveError);
        toast.error('فشل في حفظ النتائج');
      } else {
        const newResult: AnalysisResult = {
          id: savedResult.id,
          filename: savedResult.filename,
          sperm_count: savedResult.sperm_count,
          speed_avg: savedResult.speed_avg,
          motility_percent: savedResult.motility || 0,
          processing_time: savedResult.processing_time_seconds || 0,
          detections: analysisResult.data.detections,
          annotated_video_url: analysisResult.data.annotated_video_url,
          created_at: savedResult.created_at,
          motility: savedResult.motility || 0,
          total_motile_count: Math.round((savedResult.sperm_count * (savedResult.motility || 0)) / 100),
          concentration: savedResult.concentration || Math.round(savedResult.sperm_count / 10),
          morphology: savedResult.morphology as any || { normal: 85, abnormal: 15 }
        };

        setCurrentResult(newResult);
        setResults(prev => [newResult, ...prev]);
        toast.success('تم التحليل بنجاح!');
      }

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في التحليل');
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
      setAnalysisProgress(0);
    }
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedResults: AnalysisResult[] = data.map(result => {
        const movementPattern = result.movement_pattern as any;
        const detections = movementPattern?.detections || [];
        
        return {
          id: result.id,
          filename: result.filename,
          sperm_count: result.sperm_count,
          speed_avg: result.speed_avg,
          motility_percent: result.motility || 0,
          processing_time: result.processing_time_seconds || 0,
          detections: detections,
          created_at: result.created_at,
          motility: result.motility || 0,
          total_motile_count: Math.round((result.sperm_count * (result.motility || 0)) / 100),
          concentration: result.concentration || Math.round(result.sperm_count / 10),
          morphology: result.morphology as any || { normal: 85, abnormal: 15 }
        };
      });

      setResults(formattedResults);
      if (formattedResults.length > 0 && !currentResult) {
        setCurrentResult(formattedResults[0]);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('فشل في جلب النتائج');
    }
  }, [currentResult]);

  const updateModelConfig = useCallback((config: any) => {
    aiAnalysisService.updateConfig({
      model: config.model,
      confidenceThreshold: config.confidenceThreshold,
      maxDetections: config.maxDetections,
      gpuAcceleration: config.gpuAcceleration
    });
  }, []);

  const exportResults = useCallback(async (format: 'csv' | 'json' | 'pdf') => {
    if (!currentResult) return;

    try {
      if (format === 'csv') {
        const csvContent = [
          ['المقياس', 'القيمة'],
          ['اسم الملف', currentResult.filename],
          ['عدد الحيوانات المنوية', currentResult.sperm_count.toString()],
          ['متوسط السرعة', currentResult.speed_avg.toString()],
          ['نسبة الحركة', currentResult.motility_percent.toString()],
          ['وقت المعالجة', currentResult.processing_time.toString()]
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sperm_analysis_${currentResult.id}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success('تم تصدير CSV بنجاح');
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(currentResult, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sperm_analysis_${currentResult.id}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success('تم تصدير JSON بنجاح');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('فشل في التصدير');
    }
  }, [currentResult]);

  const deleteResult = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResults(prev => prev.filter(r => r.id !== id));
      if (currentResult?.id === id) {
        setCurrentResult(null);
      }
      toast.success('تم حذف النتيجة');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('فشل في الحذف');
    }
  }, [currentResult]);

  return {
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
  };
};
