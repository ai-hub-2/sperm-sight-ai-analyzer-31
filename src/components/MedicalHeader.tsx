
import React from 'react';
import { Activity } from 'lucide-react';

const MedicalHeader = () => {
  return (
    <header className="bg-gray-900 text-white py-6 shadow-2xl border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-blue-600/20 p-3 rounded-full border border-blue-500/30">
              <img 
                src="/lovable-uploads/8a5e380a-b95c-4809-a2cf-e7b9b2200be3.png" 
                alt="شعار المختبر"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400">
                مختبر سينا للتحاليل الطبية
              </h1>
              <p className="text-gray-300 text-sm md:text-base">
                خبرة ودقة تحدد الأمان - تحاليل متقدمة بالذكاء الاصطناعي
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
            <Activity className="h-5 w-5 animate-pulse text-green-400" />
            <span className="text-sm text-green-400">نظام نشط</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;
