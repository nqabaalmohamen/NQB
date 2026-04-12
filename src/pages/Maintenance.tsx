import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface MaintenanceProps {
  endTime?: string;
}

const Maintenance: React.FC<MaintenanceProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60))),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 text-center text-white" dir="rtl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl"
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto"
          >
            <Settings className="w-12 h-12 text-secondary" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-1/2 translate-x-12"
          >
            <AlertTriangle className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </motion.div>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">الموقع قيد التحديث الآن</h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
          نحن نعمل حالياً على تحسين تجربتكم وإضافة مميزات جديدة للموقع. 
          سنعود للعمل قريباً جداً، نشكركم على تفهمكم.
        </p>

        {timeLeft && (
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
              <span className="block text-3xl font-bold text-secondary">{timeLeft.seconds}</span>
              <span className="text-xs text-gray-400">ثانية</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
              <span className="block text-3xl font-bold text-secondary">{timeLeft.minutes}</span>
              <span className="text-xs text-gray-400">دقيقة</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
              <span className="block text-3xl font-bold text-secondary">{timeLeft.hours}</span>
              <span className="text-xs text-gray-400">ساعة</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm border-t border-white/10 pt-8">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>هذا الإجراء يتم لضمان أمان وجودة الخدمة المقدمة لكم</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
