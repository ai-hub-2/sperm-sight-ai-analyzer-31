
import React, { useState } from 'react';
import { 
  BarChart, 
  Users, 
  TrendingUp, 
  Clock,
  FileVideo,
  Activity,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [stats] = useState({
    totalAnalyses: 1247,
    todayAnalyses: 23,
    averageCount: 165,
    successRate: 94.2,
    activeUsers: 342,
    avgProcessingTime: 45
  });

  const recentAnalyses = [
    {
      id: 1,
      filename: 'sample_001.mp4',
      count: 178,
      speed: 25.4,
      status: 'ممتاز',
      time: '10:30 ص',
      confidence: 96.5
    },
    {
      id: 2,
      filename: 'sample_002.mp4',
      count: 142,
      speed: 22.1,
      status: 'جيد',
      time: '10:15 ص',
      confidence: 92.3
    },
    {
      id: 3,
      filename: 'sample_003.mp4',
      count: 89,
      speed: 18.7,
      status: 'متوسط',
      time: '09:45 ص',
      confidence: 88.1
    },
    {
      id: 4,
      filename: 'sample_004.mp4',
      count: 203,
      speed: 28.9,
      status: 'ممتاز',
      time: '09:20 ص',
      confidence: 97.8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-green-500';
      case 'جيد': return 'bg-blue-500';
      case 'متوسط': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التحاليل</p>
                <p className="text-2xl font-bold text-medical-primary">{stats.totalAnalyses.toLocaleString()}</p>
              </div>
              <BarChart className="h-8 w-8 text-medical-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تحاليل اليوم</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayAnalyses}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط العدد</p>
                <p className="text-2xl font-bold text-blue-600">{stats.averageCount}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                <p className="text-2xl font-bold text-purple-600">{stats.successRate}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط المعالجة</p>
                <p className="text-2xl font-bold text-red-600">{stats.avgProcessingTime}ث</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التحاليل الأخيرة */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
            <FileVideo className="h-6 w-6" />
            <span>التحاليل الأخيرة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div 
                key={analysis.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-medical-primary/10 p-2 rounded-lg">
                    <FileVideo className="h-5 w-5 text-medical-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{analysis.filename}</h4>
                    <p className="text-sm text-gray-600">
                      العدد: {analysis.count} | السرعة: {analysis.speed} μm/s
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="text-right">
                    <p className="text-sm font-medium">{analysis.time}</p>
                    <p className="text-xs text-gray-500">ثقة: {analysis.confidence}%</p>
                  </div>
                  <Badge className={`${getStatusColor(analysis.status)} text-white`}>
                    {analysis.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تنبيهات النظام */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse text-medical-primary">
            <AlertCircle className="h-6 w-6" />
            <span>تنبيهات النظام</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 rtl:space-x-reverse bg-blue-50 p-3 rounded-lg">
              <div className="bg-blue-500 rounded-full p-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">تحديث النظام</p>
                <p className="text-xs text-blue-700">تم تحديث خوارزمية التحليل إلى الإصدار 2.1</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rtl:space-x-reverse bg-green-50 p-3 rounded-lg">
              <div className="bg-green-500 rounded-full p-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">تحسين الأداء</p>
                <p className="text-xs text-green-700">تم تقليل وقت المعالجة بنسبة 25%</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rtl:space-x-reverse bg-amber-50 p-3 rounded-lg">
              <div className="bg-amber-500 rounded-full p-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">صيانة مجدولة</p>
                <p className="text-xs text-amber-700">صيانة النظام يوم السبت من 2:00 - 4:00 صباحاً</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
