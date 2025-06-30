
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  id: string;
  filename: string;
  sperm_count: number;
  speed_avg: number;
  motility_percentage: number;
  normal_morphology: number;
  concentration: number;
  total_volume: number;
  analysis_duration: number;
  confidence_score: number;
  video_url: string;
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
      
      toast.success('تم تحليل الفيديو بنجاح!');
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
      const response = await supabase.functions.invoke('get-analysis-results', {
        body: JSON.stringify({ limit }),
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setResults(response.data.data || []);
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
      link.download = `sperm_analysis_results.${format}`;
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
