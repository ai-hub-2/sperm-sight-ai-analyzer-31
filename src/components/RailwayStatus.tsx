
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { aiAnalysisService } from '@/services/aiAnalysisService';

const RailwayStatus: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [railwayUrl, setRailwayUrl] = useState('');

  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const isHealthy = await aiAnalysisService.checkBackendHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');
      setLastChecked(new Date());
    } catch (error) {
      setBackendStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendStatus();
    // فحص دوري كل دقيقة
    const interval = setInterval(checkBackendStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = () => {
    switch (backendStatus) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">متصل</Badge>;
      case 'offline':
        return <Badge variant="destructive">غير متصل</Badge>;
      case 'checking':
        return <Badge variant="outline">جاري الفحص...</Badge>;
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          حالة خادم الذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">حالة الاتصال:</span>
          {getStatusBadge()}
        </div>

        {lastChecked && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            آخر فحص: {lastChecked.toLocaleTimeString('ar-SA')}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={checkBackendStatus}
            disabled={backendStatus === 'checking'}
            size="sm"
            variant="outline"
            className="medical-button-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${backendStatus === 'checking' ? 'animate-spin' : ''}`} />
            إعادة فحص
          </Button>

          <Button
            onClick={() => window.open('https://railway.app/dashboard', '_blank')}
            size="sm"
            variant="outline"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Railway Dashboard
          </Button>
        </div>

        {backendStatus === 'offline' && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  الخادم الخلفي غير متاح
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                  <li>• تأكد من نشر الخادم الخلفي على Railway</li>
                  <li>• تحقق من إعدادات المتغيرات البيئية</li>
                  <li>• راجع سجلات Railway للأخطاء</li>
                  <li>• تأكد من تشغيل الخدمة بشكل صحيح</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            إعداد الخادم الخلفي على Railway
          </h4>
          <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>1. أنشئ مشروع Python جديد على Railway</li>
            <li>2. ارفع كود خادم FastAPI مع YOLOv8</li>
            <li>3. أضف متغيرات البيئة المطلوبة</li>
            <li>4. تأكد من تعيين PORT=8000</li>
            <li>5. انسخ URL المشروع وحدث الإعدادات</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default RailwayStatus;
