
import React, { useState, useRef } from 'react';
import { Upload, Video, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const VideoUploader = ({ onVideoSelect, isAnalyzing }: VideoUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // التحقق من نوع الملف
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('يرجى اختيار ملف فيديو صحيح (MP4, AVI, MOV, WMV)');
      return;
    }

    // التحقق من حجم الملف (أقل من 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('حجم الملف كبير جداً. يرجى اختيار ملف أقل من 100 ميجابايت');
      return;
    }

    setSelectedFile(file);
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onVideoSelect(file);
          toast.success('تم رفع الفيديو بنجاح');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
          <Video className="h-6 w-6" />
          <span>رفع فيديو الحيوانات المنوية</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* منطقة السحب والإفلات */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragOver
                ? 'border-medical-primary bg-blue-50'
                : 'border-gray-300 hover:border-medical-primary hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              اسحب الفيديو هنا أو اضغط للاختيار
            </p>
            <p className="text-sm text-gray-500 mb-4">
              يدعم ملفات MP4, AVI, MOV, WMV (أقل من 100 ميجابايت)
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="medical-button"
            >
              <Upload className="mr-2 h-4 w-4" />
              اختيار فيديو
            </Button>
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
          </div>

          {/* تفاصيل الملف المختار */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <FileText className="h-5 w-5 text-medical-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-600">
                    الحجم: {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-sm text-gray-600">
                    النوع: {selectedFile.type}
                  </p>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>جاري الرفع...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {uploadProgress === 100 && (
                    <div className="flex items-center mt-2 text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">تم الرفع بنجاح</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* تعليمات الاستخدام */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">إرشادات مهمة:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• تأكد من وضوح الفيديو وجودة التصوير</li>
                  <li>• يفضل أن يكون الفيديو مدته بين 30 ثانية إلى 5 دقائق</li>
                  <li>• تأكد من أن العينة مركزة تحت المجهر</li>
                  <li>• تجنب الاهتزاز أثناء التصوير</li>
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
