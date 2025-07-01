
import React from 'react';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResultsData {
  totalCount: number;
  motileCount: number;
  averageSpeed: number;
  motilityPercentage: number;
  concentration: number;
  morphologyNormal: number;
}

interface ResultsDashboardProps {
  data: ResultsData;
  isLoading?: boolean;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, isLoading = false }) => {
  const { t, isRTL } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32 mx-auto"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24"></div>
          ))}
        </div>
        <div className="skeleton h-48"></div>
      </div>
    );
  }

  const stats = [
    {
      label: t('totalCount'),
      value: data.totalCount.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: t('motileCount'),
      value: data.motileCount.toLocaleString(),
      icon: Activity,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: t('averageSpeed'),
      value: `${data.averageSpeed} μm/s`,
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      label: t('motility'),
      value: `${data.motilityPercentage}%`,
      icon: PieChart,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="space-y-6 slide-up">
      <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('results')}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">
            {t('completed')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-item">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis */}
      <div className="medical-card">
        <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          تحليل مفصل
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('concentration')}</span>
            <span className="font-medium">{data.concentration} M/mL</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('morphology')}</span>
            <span className="font-medium">{data.morphologyNormal}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('vitality')}</span>
            <span className="font-medium">85%</span>
          </div>
        </div>
      </div>

      {/* Motility Visualization */}
      <div className="medical-card">
        <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          توزيع الحركة
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">متحركة سريعة</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-3/4"></div>
              </div>
              <span className="text-sm font-medium">65%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">متحركة بطيئة</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-1/4"></div>
              </div>
              <span className="text-sm font-medium">20%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">غير متحركة</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-1/6"></div>
              </div>
              <span className="text-sm font-medium">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="medical-button-secondary text-sm py-3">
          {t('share')}
        </button>
        <button className="medical-button-primary text-sm py-3">
          {t('exportPdf')}
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
