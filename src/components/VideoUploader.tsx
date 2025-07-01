import React, { useState, useRef } from 'react';
import { Upload, Video, FileText, CheckCircle, AlertCircle, Camera, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const VideoUploader = ({ onVideoSelect, isAnalyzing }: VideoUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('يرجى اختيار ملف فيديو صحيح (MP4, AVI, MOV, WMV, WebM)');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('حجم الملف كبير جداً. يرجى اختيار ملف أقل من 500 ميجابايت');
      return;
    }

    setSelectedFile(file);
    onVideoSelect(file);
    toast.success('تم اختيار الفيديو. سيتم إرساله للخادم الخلفي للتحليل...');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary text-lg">
          <Video className="h-5 w-5" />
          <span>رفع فيديو للتحليل بالذكاء الاصطناعي</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* منطقة السحب والإفلات */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-all duration-300 ${
              dragOver
                ? 'border-medical-primary bg-blue-50'
                : 'border-gray-300 hover:border-medical-primary hover:bg-gray-50'
            } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-8 md:h-12 w-8 md:w-12 text-gray-400 mb-2 md:mb-4" />
            <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
              {isMobile ? 'اضغط لاختيار الفيديو' : 'اسحب الفيديو هنا أو اضغط للاختيار'}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
              يدعم ملفات MP4, AVI, MOV, WMV, WebM (أقل من 500 MB)
            </p>
            
            <div className={`${isMobile ? 'space-y-2' : 'flex space-x-4 rtl:space-x-reverse justify-center'}`}>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="medical-button text-sm"
                size={isMobile ? "sm" : "default"}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isAnalyzing ? 'جاري المعالجة...' : 'اختيار من الملفات'}
              </Button>

              {isMobile && (
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="text-sm"
                  size="sm"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  تسجيل بالكاميرا
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            {isMobile && (
              <input
                ref={cameraInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            )}
          </div>

          {/* تفاصيل الملف المختار */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <FileText className="h-4 md:h-5 w-4 md:w-5 text-medical-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600">
                    الحجم: {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    النوع: {selectedFile.type}
                  </p>
                  
                  {!isAnalyzing && (
                    <div className="flex items-center mt-2 text-green-600">
                      <CheckCircle className="h-3 md:h-4 w-3 md:w-4 mr-2" />
                      <span className="text-xs md:text-sm">جاهز للتحليل</span>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex items-center mt-2 text-blue-600">
                      <div className="animate-spin h-3 md:h-4 w-3 md:w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                      <span className="text-xs md:text-sm">جاري التحليل بالذكاء الاصطناعي...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* تعليمات الاستخدام */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="h-4 md:h-5 w-4 md:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2 text-sm md:text-base">
                  إرشادات للحصول على أفضل النتائج:
                </h4>
                <ul className="text-xs md:text-sm text-amber-700 space-y-1">
                  <li>• تأكد من وضوح الفيديو وجودة التصوير</li>
                  <li>• يفضل مدة بين دقيقة إلى 10 دقائق</li>
                  <li>• العينة مركزة تحت المجهر بوضوح</li>
                  <li>• تجنب الاهتزاز أثناء التصوير</li>
                  <li>• استخدم إضاءة مناسبة ومتجانسة</li>
                </ul>
              </div>
            </div>
          </div>

          {/* معلومات الذكاء الاصطناعي */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <Cpu className="h-4 md:h-5 w-4 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800 mb-2 text-sm md:text-base">
                  نظام الذكاء الاصطناعي المتقدم:
                </h4>
                <ul className="text-xs md:text-sm text-green-700 space-y-1">
                  <li>• كشف باستخدام YOLOv8 عالي الدقة</li>
                  <li>• تتبع الحركة بـ DeepSORT</li>
                  <li>• معالجة بـ OpenCV المحترف</li>
                  <li>• تسريع GPU للمعالجة السريعة</li>
                  <li>• نتائج مفصلة مع إحداثيات دقيقة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUploader;
