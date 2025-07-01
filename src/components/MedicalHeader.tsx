
import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

const MedicalHeader = () => {
  return (
    <header className="relative bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"></div>
      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg pulse-glow">
                <img 
                  src="/lovable-uploads/8a5e380a-b95c-4809-a2cf-e7b9b2200be3.png" 
                  alt="شعار المختبر"
                  className="h-10 w-10 object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2 floating-animation">
              تحليل الفيديو الذكي
            </h1>
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <p className="text-gray-300 text-lg">
                تقنية متطورة بالذكاء الاصطناعي
              </p>
              <Activity className="h-5 w-5 animate-pulse text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;
