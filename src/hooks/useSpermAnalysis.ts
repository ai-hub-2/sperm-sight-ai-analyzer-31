
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  id: string;
  filename: string;
  sperm_count: number;
  speed_avg: number;
  motility: number | null;
  morphology: any;
  concentration: number | null;
  total_motile_count: number | null;
  processing_time_seconds: number | null;
  movement_pattern: any;
  video_url: string | null;
  created_at: string;
}

export const useSpermAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  const analyzeVideo = async (videoFile: File) => {
    setIsAnalyzing(true);
    setCurrentResult(null);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      console.log('بدء رفع وتحليل الفيديو:', videoFile.name);

      const response = await supabase.functions.invoke('analyze-video', {
        body: formData,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { data, analysis } = response.data;
      setCurrentResult(data);
      
      // رسالة مختلفة حسب النتيجة
      if (data.sperm_count === 0) {
        toast.info('تم تحليل الفيديو - لم يتم العثور على محتوى متحرك');
      } else {
        toast.success('تم تحليل الفيديو بنجاح!');
      }
      
      console.log('نتائج التحليل:', analysis);
      
      // تحديث قائمة النتائج
      await fetchResults();
      
      return data;
    } catch (error) {
      console.error('خطأ في تحليل الفيديو:', error);
      toast.error(`فشل في تحليل الفيديو: ${error.message}`);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchResults = async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      setResults(data || []);
    } catch (error) {
      console.error('خطأ في استرجاع النتائج:', error);
      toast.error('فشل في تحميل النتائج السابقة');
    }
  };

  const exportResults = async (format = 'csv') => {
    try {
      const response = await supabase.functions.invoke('get-analysis-results', {
        body: JSON.stringify({ format }),
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // تحميل الملف
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis_results.${format}`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('تم تصدير النتائج بنجاح');
    } catch (error) {
      console.error('خطأ في تصدير النتائج:', error);
      toast.error('فشل في تصدير النتائج');
    }
  };

  return {
    isAnalyzing,
    results,
    currentResult,
    analyzeVideo,
    fetchResults,
    exportResults,
  };
};
