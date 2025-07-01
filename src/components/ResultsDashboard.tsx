
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
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      label: t('motileCount'),
      value: data.motileCount.toLocaleString(),
      icon: Activity,
      color: 'text-emerald-700 dark:text-emerald-400',
      bgColor: 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20'
    },
    {
      label: t('averageSpeed'),
      value: `${data.averageSpeed} μm/s`,
      icon: BarChart3,
      color: 'text-green-600 dark:text-green-300',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10'
    },
    {
      label: t('motility'),
      value: `${data.motilityPercentage}%`,
      icon: PieChart,
      color: 'text-emerald-600 dark:text-emerald-300',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10'
    }
  ];

  return (
    <div className="space-y-6 slide-up">
      <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
          {t('results')}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-400">
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
        <h3 className={`text-lg font-semibold mb-4 text-green-800 dark:text-green-300 ${isRTL ? 'text-right' : 'text-left'}`}>
          تحليل مفصل
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-green-700 dark:text-green-400">{t('concentration')}</span>
            <span className="font-medium text-green-800 dark:text-green-300">{data.concentration} M/mL</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-green-700 dark:text-green-400">{t('morphology')}</span>
            <span className="font-medium text-green-800 dark:text-green-300">{data.morphologyNormal}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-green-700 dark:text-green-400">{t('vitality')}</span>
            <span className="font-medium text-green-800 dark:text-green-300">85%</span>
          </div>
        </div>
      </div>

      {/* Motility Visualization */}
      <div className="medical-card">
        <h3 className={`text-lg font-semibold mb-4 text-green-800 dark:text-green-300 ${isRTL ? 'text-right' : 'text-left'}`}>
          توزيع الحركة
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700 dark:text-green-400">متحركة سريعة</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-3/4"></div>
              </div>
              <span className="text-sm font-medium text-green-800 dark:text-green-300">65%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700 dark:text-green-400">متحركة بطيئة</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-1/4"></div>
              </div>
              <span className="text-sm font-medium text-green-800 dark:text-green-300">20%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700 dark:text-green-400">غير متحركة</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-600 w-1/6"></div>
              </div>
              <span className="text-sm font-medium text-green-800 dark:text-green-300">15%</span>
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
