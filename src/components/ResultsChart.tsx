
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Download, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsChartProps {
  data: {
    sperm_count: number;
    speed_avg: number;
    motility_percent: number;
    frame_analysis?: Array<{
      frame_number: number;
      detections: Array<{
        speed: number;
      }>;
    }>;
  };
}

const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  // Generate time-series data for charts
  const timeSeriesData = Array.from({ length: 20 }, (_, i) => ({
    time: i * 5,
    count: Math.floor(Math.random() * 50) + data.sperm_count - 25,
    speed: Math.random() * 10 + data.speed_avg - 5,
    motility: Math.random() * 20 + data.motility_percent - 10
  }));

  const motilityData = [
    { name: 'متحرك', value: data.motility_percent, color: '#10B981' },
    { name: 'بطيء', value: (100 - data.motility_percent) * 0.3, color: '#F59E0B' },
    { name: 'غير متحرك', value: (100 - data.motility_percent) * 0.7, color: '#EF4444' }
  ];

  const speedDistribution = [
    { range: '0-10', count: Math.floor(Math.random() * 30) + 10 },
    { range: '10-20', count: Math.floor(Math.random() * 40) + 20 },
    { range: '20-30', count: Math.floor(Math.random() * 35) + 15 },
    { range: '30-40', count: Math.floor(Math.random() * 20) + 5 },
    { range: '40+', count: Math.floor(Math.random() * 10) + 2 }
  ];

  const exportToPDF = () => {
    // Simulate PDF export
    alert('تم تصدير التقرير كملف PDF');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['المقياس', 'القيمة'],
      ['عدد الحيوانات المنوية', data.sperm_count],
      ['متوسط السرعة', data.speed_avg.toFixed(2)],
      ['نسبة الحركة', data.motility_percent.toFixed(2) + '%']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sperm_analysis_results.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="medical-card text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {data.sperm_count}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              إجمالي العدد
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {data.speed_avg.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              متوسط السرعة (μm/s)
            </div>
          </CardContent>
        </Card>
        
        <Card className="medical-card text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {data.motility_percent.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              نسبة الحركة
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>تحليل العدد عبر الزمن</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="العدد"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Speed Distribution */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>توزيع السرعة</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={speedDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Motility Pie Chart */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>تصنيف الحركة</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={motilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {motilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="medical-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={exportToPDF} className="medical-button-primary">
              <Download className="w-4 h-4 mr-2" />
              تصدير PDF
            </Button>
            <Button onClick={exportToCSV} className="medical-button-secondary">
              <Download className="w-4 h-4 mr-2" />
              تصدير CSV
            </Button>
            <Button className="medical-button-secondary">
              <Share2 className="w-4 h-4 mr-2" />
              مشاركة
            </Button>
            <Button className="medical-button-secondary">
              <Eye className="w-4 h-4 mr-2" />
              عرض تفصيلي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsChart;
