
import React from 'react';
import { Activity, Microscope } from 'lucide-react';

const MedicalHeader = () => {
  return (
    <header className="medical-gradient text-white py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-white/20 p-3 rounded-full">
              <Microscope className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                تحليل الحيوانات المنوية بالذكاء الاصطناعي
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                نظام تحليل طبي متقدم للخصوبة والإنجاب
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
            <Activity className="h-5 w-5 animate-pulse" />
            <span className="text-sm">نظام نشط</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;
