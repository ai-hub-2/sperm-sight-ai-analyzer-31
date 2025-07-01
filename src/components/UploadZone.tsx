
import React, { useState, useCallback } from 'react';
import { Upload, Camera, Play, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UploadZoneProps {
  onVideoSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onVideoSelect, isAnalyzing }) => {
  const { t, isRTL } = useLanguage();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleStartAnalysis = () => {
    if (selectedFile) {
      onVideoSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="video-upload"
        />
        
        {!selectedFile ? (
          <label htmlFor="video-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-lg font-medium text-foreground mb-1">
                  {t('selectVideo')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('dropVideo')}
                </p>
              </div>
            </div>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-lg font-medium text-foreground mb-1">
                {t('videoSelected')}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {selectedFile && (
          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="medical-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="loading-spinner" />
                {t('analyzing')}
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {t('startAnalysis')}
              </>
            )}
          </button>
        )}

        <button className="medical-button-secondary">
          <Camera className="w-5 h-5" />
          {t('recordLive')}
        </button>
      </div>

      {/* Progress Bar for Analysis */}
      {isAnalyzing && (
        <div className="space-y-2 fade-in">
          <div className="progress-bar">
            <div className="progress-fill w-3/4"></div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {t('processing')}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
