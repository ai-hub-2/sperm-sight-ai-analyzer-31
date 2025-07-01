
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, Zap, Eye, Settings } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  speed: string;
  description: string;
  recommended?: boolean;
}

const modelOptions: ModelOption[] = [
  {
    id: 'yolov8n',
    name: 'YOLOv8 Nano',
    version: '8.0.0',
    accuracy: 92.5,
    speed: 'سريع جداً',
    description: 'نموذج خفيف وسريع، مناسب للتحليل السريع',
    recommended: true
  },
  {
    id: 'yolov8s',
    name: 'YOLOv8 Small',
    version: '8.0.0',
    accuracy: 94.8,
    speed: 'سريع',
    description: 'توازن جيد بين السرعة والدقة'
  },
  {
    id: 'yolov8m',
    name: 'YOLOv8 Medium',
    version: '8.0.0',
    accuracy: 96.2,
    speed: 'متوسط',
    description: 'دقة عالية للتحليل المتقدم'
  },
  {
    id: 'yolov5s',
    name: 'YOLOv5 Small',
    version: '7.0.0',
    accuracy: 91.3,
    speed: 'سريع',
    description: 'نموذج مستقر ومجرب'
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          اختيار نموذج الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {modelOptions.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedModel === model.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
              }`}
              onClick={() => onModelChange(model.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    الإصدار {model.version}
                  </p>
                </div>
                <div className="flex gap-2">
                  {model.recommended && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      موصى به
                    </Badge>
                  )}
                  {selectedModel === model.id && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      مختار
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {model.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  <span>دقة: {model.accuracy}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>السرعة: {model.speed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Configuration */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            إعدادات متقدمة
          </Button>
          
          {isConfigOpen && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    عتبة الثقة
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    defaultValue="0.5"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">0.5</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحد الأقصى للكشف
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    defaultValue="200"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">200</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="gpu-acceleration" defaultChecked />
                <label htmlFor="gpu-acceleration" className="text-sm">
                  تسريع GPU (موصى به)
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="save-annotated" defaultChecked />
                <label htmlFor="save-annotated" className="text-sm">
                  حفظ الفيديو مع التعليقات التوضيحية
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelSelector;
