import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Using framer-motion for animations
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ImageCarousel: React.FC = () => {
  const { carousel: carouselItems } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const duration = 7000; // 7 seconds per slide

  const goToNext = () => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0);
  };

  const goToPrevious = () => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
    setProgress(0);
  };

  useEffect(() => {
    if (carouselItems.length === 0) return;
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed >= duration) {
        goToNext();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, carouselItems]);

  if (carouselItems.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
          
          <div className="absolute inset-0 flex items-end justify-center text-center text-white pb-20 md:pb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-4xl w-full"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block px-3 py-1 bg-secondary text-primary font-bold rounded-full mb-4 text-xs md:text-sm tracking-wider shadow-lg"
              >
                آخر الأخبار والتحديثات
              </motion.span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-2xl">
                {carouselItems[currentIndex].title}
              </h2>
              <Link
                to={carouselItems[currentIndex].link}
                className="bg-white text-primary font-bold px-6 py-2.5 md:px-10 md:py-3.5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl inline-flex items-center justify-center text-sm md:text-lg group/btn active:scale-95"
              >
                اقرأ التفاصيل الكاملة
                <ChevronLeft className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover/btn:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - More Responsive */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 right-2 md:right-6 -translate-y-1/2 bg-white/10 hover:bg-secondary hover:text-primary text-white p-2 md:p-4 rounded-xl md:rounded-2xl z-30 transition-all backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 left-2 md:left-6 -translate-y-1/2 bg-white/10 hover:bg-secondary hover:text-primary text-white p-2 md:p-4 rounded-xl md:rounded-2xl z-30 transition-all backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      {/* Circular Progress Indicators - Compact for Mobile */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 md:gap-6 z-30 items-center">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setProgress(0);
            }}
            className="relative flex items-center justify-center scale-75 md:scale-100"
          >
            {/* Background Circle */}
            <svg className="h-10 w-10 md:h-12 md:w-12 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-white/20 md:cx-24 md:cy-24 md:r-20"
              />
              {/* Progress Circle */}
              {currentIndex === idx && (
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={100.5}
                  strokeDashoffset={100.5 - (100.5 * progress) / 100}
                  className="text-secondary transition-all duration-50 md:cx-24 md:cy-24 md:r-20 md:strokeDasharray-125.6 md:strokeDashoffset-125.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <span className={`absolute text-[10px] md:text-xs font-bold ${currentIndex === idx ? 'text-secondary' : 'text-white/60'}`}>
              {idx + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
