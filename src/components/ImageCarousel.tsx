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
    <div className="relative w-full h-[650px] overflow-hidden group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
          
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-5xl"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-4 py-1 bg-secondary text-primary font-bold rounded-full mb-6 text-sm tracking-wider"
              >
                آخر الأخبار والتحديثات
              </motion.span>
              <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight drop-shadow-2xl">
                {carouselItems[currentIndex].title}
              </h2>
              <Link
                to={carouselItems[currentIndex].link}
                className="bg-white text-primary font-bold px-10 py-4 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-2xl inline-flex items-center justify-center text-lg group/btn"
              >
                اقرأ التفاصيل الكاملة
                <ChevronLeft className="mr-2 h-5 w-5 group-hover/btn:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - More Professional */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/10 hover:bg-secondary hover:text-primary text-white p-4 rounded-2xl z-30 transition-all backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/10 hover:bg-secondary hover:text-primary text-white p-4 rounded-2xl z-30 transition-all backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      {/* Circular Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-30 items-center">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setProgress(0);
            }}
            className="relative flex items-center justify-center"
          >
            {/* Background Circle */}
            <svg className="h-12 w-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-white/20"
              />
              {/* Progress Circle */}
              {currentIndex === idx && (
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * progress) / 100}
                  className="text-secondary transition-all duration-50"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <span className={`absolute text-xs font-bold ${currentIndex === idx ? 'text-secondary' : 'text-white/60'}`}>
              {idx + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
