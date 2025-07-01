
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Cpu, Zap, Target, Gauge } from 'lucide-react';

interface AIModelConfigProps {
  onConfigChange: (config: ModelConfig) => void;
  currentConfig: ModelConfig;
}

interface ModelConfig {
  model: 'yolov8n' | 'yolov8s' | 'yolov8m' | 'yolov5s';
  confidenceThreshold: number;
  maxDetections: number;
  gpuAcceleration: boolean;
  pythonBackendUrl: string;
}

const modelInfo = {
  yolov8n: { name: 'YOLOv8 Nano', accuracy: '92.5%', speed: 'سريع جداً', size: '6MB' },
  yolov8s: { name: 'YOLOv8 Small', accuracy: '94.8%', speed: 'سريع', size: '22MB' },
  yolov8m: { name: 'YOLOv8 Medium', accuracy: '96.2%', speed: 'متوسط', size: '52MB' },
  yolov5s: { name: 'YOLOv5 Small', accuracy: '91.3%', speed: 'سريع', size: '28MB' }
};

const AIModelConfig: React.FC<AIModelConfigProps> = ({ onConfigChange, currentConfig }) => {
  const [config, setConfig] = useState<ModelConfig>(currentConfig);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleConfigUpdate = (updates: Partial<ModelConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const testBackendConnection = async () => {
    setIsTestingConnection(true);
    try {
      const response = await fetch(`${config.pythonBackendUrl}/health`);
      if (response.ok) {
        alert('اتصال ناجح مع الخادم الخلفي!');
      } else {
        alert('فشل في الاتصال مع الخادم الخلفي');
      }
    } catch (error) {
      alert('خطأ في الاتصال: ' + (error as Error).message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          إعدادات نموذج الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* اختيار النموذج */}
        <div>
          <h3 className="font-semibold mb-3">اختيار النموذج</h3>
          <div className="grid gap-3">
            {Object.entries(modelInfo).map(([key, info]) => (
              <div
                key={key}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  config.model === key
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                }`}
                onClick={() => handleConfigUpdate({ model: key as any })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{info.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {info.accuracy}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {info.speed}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {info.size}
                      </Badge>
                    </div>
                  </div>
                  {config.model === key && (
                    <Badge className="bg-green-500">مختار</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* عتبة الثقة */}
        <div>
          <label className="block font-medium mb-2">
            عتبة الثقة: {config.confidenceThreshold}
          </label>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            value={config.confidenceThreshold}
            onChange={(e) => handleConfigUpdate({ confidenceThreshold: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1 (حساس)</span>
            <span>0.9 (دقيق)</span>
          </div>
        </div>

        {/* الحد الأقصى للكشف */}
        <div>
          <label className="block font-medium mb-2">
            الحد الأقصى للكشف: {config.maxDetections}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={config.maxDetections}
            onChange={(e) => handleConfigUpdate({ maxDetections: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50</span>
            <span>500</span>
          </div>
        </div>

        {/* تسريع GPU */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="font-medium">تسريع GPU</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.gpuAcceleration}
              onChange={(e) => handleConfigUpdate({ gpuAcceleration: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* عنوان الخادم الخلفي */}
        <div>
          <label className="block font-medium mb-2">عنوان الخادم الخلفي</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={config.pythonBackendUrl}
              onChange={(e) => handleConfigUpdate({ pythonBackendUrl: e.target.value })}
              placeholder="http://localhost:8000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={testBackendConnection}
              disabled={isTestingConnection}
              size="sm"
              className="medical-button-secondary"
            >
              {isTestingConnection ? 'جاري الاختبار...' : 'اختبار'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            تأكد من تشغيل خادم Python على هذا العنوان
          </p>
        </div>

        {/* معلومات النظام */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            متطلبات النظام
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• خادم Python مع FastAPI</li>
            <li>• مكتبات YOLOv8 و OpenCV</li>
            <li>• GPU للمعالجة السريعة (اختياري)</li>
            <li>• ذاكرة RAM 8GB أو أكثر</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModelConfig;
