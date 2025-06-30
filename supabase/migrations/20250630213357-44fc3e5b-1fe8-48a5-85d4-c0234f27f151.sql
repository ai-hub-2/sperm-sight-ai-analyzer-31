
-- إنشاء جدول تخزين نتائج التحليل
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  sperm_count INTEGER NOT NULL,
  speed_avg FLOAT NOT NULL,
  motility_percentage FLOAT,
  normal_morphology FLOAT,
  concentration FLOAT,
  total_volume FLOAT,
  analysis_duration INTEGER,
  confidence_score FLOAT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين Row Level Security
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للسماح بقراءة البيانات للجميع (للتطبيق الطبي)
CREATE POLICY "Allow public read access" ON public.analysis_results
  FOR SELECT USING (true);

-- إنشاء سياسة للسماح بإدراج البيانات للجميع
CREATE POLICY "Allow public insert access" ON public.analysis_results
  FOR INSERT WITH CHECK (true);

-- إنشاء bucket لتخزين الفيديوهات
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true);

-- إنشاء سياسة للسماح برفع الفيديوهات
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos');

-- إنشاء سياسة للسماح بقراءة الفيديوهات
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');
