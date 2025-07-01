
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setCurrentResult(null);
    setUploadProgress(0);

    try {
      // Validate file type
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        throw new Error('نوع الملف غير مدعوم. يرجى رفع فيديو أو صورة');
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت');
      }

      const formData = new FormData();
      formData.append(isVideo ? 'video' : 'image', file);

      console.log(`بدء رفع وتحليل ${isVideo ? 'الفيديو' : 'الصورة'}:`, file.name);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await supabase.functions.invoke('analyze-video', {
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { data, analysis, fileType } = response.data;
      setCurrentResult(data);
      
      // Success message based on file type
      if (data.sperm_count === 0) {
        toast.info(`تم تحليل ${fileType === 'video' ? 'الفيديو' : 'الصورة'} - لم يتم العثور على خلايا`);
      } else {
        toast.success(`تم تحليل ${fileType === 'video' ? 'الفيديو' : 'الصورة'} بنجاح! تم العثور على ${data.sperm_count} خلية`);
      }
      
      console.log('نتائج التحليل:', analysis);
      
      // Update results list
      await fetchResults();
      
      return data;
    } catch (error) {
      console.error('خطأ في تحليل الملف:', error);
      const errorMessage = error.message || 'حدث خطأ غير متوقع';
      toast.error(`فشل في تحليل الملف: ${errorMessage}`);
      throw error;
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
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
      if (results.length === 0) {
        toast.info('لا توجد نتائج للتصدير');
        return;
      }

      // Create CSV or JSON export
      let exportData: string;
      let mimeType: string;
      let fileExtension: string;

      if (format === 'csv') {
        const headers = ['اسم الملف', 'عدد الخلايا', 'متوسط السرعة', 'الحركة %', 'التركيز', 'تاريخ التحليل'];
        const csvRows = [
          headers.join(','),
          ...results.map(result => [
            result.filename,
            result.sperm_count,
            result.speed_avg,
            result.motility || 0,
            result.concentration || 0,
            new Date(result.created_at).toLocaleDateString('ar-SA')
          ].join(','))
        ];
        exportData = csvRows.join('\n');
        mimeType = 'text/csv;charset=utf-8;';
        fileExtension = 'csv';
      } else {
        exportData = JSON.stringify(results, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
      }

      // Download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `نتائج_التحليل_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('تم تصدير النتائج بنجاح');
    } catch (error) {
      console.error('خطأ في تصدير النتائج:', error);
      toast.error('فشل في تصدير النتائج');
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('تم حذف النتيجة بنجاح');
      await fetchResults();
    } catch (error) {
      console.error('خطأ في حذف النتيجة:', error);
      toast.error('فشل في حذف النتيجة');
    }
  };

  return {
    isAnalyzing,
    results,
    currentResult,
    uploadProgress,
    analyzeFile,
    fetchResults,
    exportResults,
    deleteResult,
    // Legacy method name for compatibility
    analyzeVideo: analyzeFile,
  };
};
