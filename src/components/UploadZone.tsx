
import React, { useCallback, useState } from 'react';
import { Upload, Camera, FileVideo, Image, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpermAnalysis } from '@/hooks/useSpermAnalysis';

const UploadZone: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { analyzeFile, isAnalyzing, uploadProgress } = useSpermAnalysis();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      alert('نوع الملف غير مدعوم. يرجى رفع فيديو أو صورة');
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت');
      return;
    }

    setSelectedFile(file);
    
    try {
      await analyzeFile(file);
    } catch (error) {
      console.error('خطأ في تحليل الملف:', error);
    }
  }, [analyzeFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragActive ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''} ${isAnalyzing ? 'pointer-events-none opacity-60' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="video/*,image/*"
          onChange={handleChange}
          disabled={isAnalyzing}
        />
        
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                {isAnalyzing ? (
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
                )}
              </div>
              {!isAnalyzing && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            {isAnalyzing ? 'جاري التحليل...' : 'رفع فيديو أو صورة للتحليل'}
          </h3>
          
          <p className="text-sm text-green-700 dark:text-green-400 mb-4">
            {isAnalyzing 
              ? `جاري معالجة ${selectedFile?.name}...` 
              : 'اسحب واسقط الملف هنا أو انقر للاختيار'
            }
          </p>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="mb-4">
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {Math.round(uploadProgress)}% مكتمل
              </p>
            </div>
          )}

          {!isAnalyzing && (
            <>
              <label
                htmlFor="file-upload"
                className="medical-button-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                اختيار ملف
              </label>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-green-600 dark:text-green-400">
                <div className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  <span>فيديو</span>
                </div>
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  <span>صورة</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File Info */}
      {selectedFile && !isAnalyzing && (
        <div className="medical-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
              {selectedFile.type.startsWith('video/') ? (
                <FileVideo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800 dark:text-green-300">
                {selectedFile.name}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="medical-card">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
              إرشادات التحليل
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li>• تأكد من وضوح الصورة أو الفيديو</li>
              <li>• استخدم إضاءة جيدة ومتجانسة</li>
              <li>• للفيديو: مدة 10-30 ثانية كافية</li>
              <li>• للصورة: استخدم تكبير مناسب (×400 أو أكثر)</li>
              <li>• تجنب الاهتزاز أو الحركة المفرطة</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Camera Option */}
      <div className="text-center">
        <button 
          className="medical-button-secondary inline-flex items-center gap-2"
          onClick={() => {
            // This would open camera capture in a real implementation
            alert('ميزة التصوير المباشر ستكون متاحة قريباً');
          }}
          disabled={isAnalyzing}
        >
          <Camera className="w-4 h-4" />
          تصوير مباشر
        </button>
      </div>
    </div>
  );
};

export default UploadZone;
