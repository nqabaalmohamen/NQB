import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Using framer-motion for animations
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ImageCarousel: React.FC = () => {
  const { carousel: carouselItems } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const duration = 7000; // 7 seconds per slide

  const goToNext = () => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (carouselItems.length === 0) return;
    
    const timer = setInterval(() => {
      goToNext();
    }, duration);

    return () => clearInterval(timer);
  }, [currentIndex, carouselItems]);

  if (carouselItems.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden group bg-primary">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "linear" }}
          className="absolute inset-0"
        >
          <img
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center md:justify-end items-center text-center text-white pb-12 md:pb-24 pt-20 md:pt-24 px-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="max-w-4xl w-full bg-black/20 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-none p-4 rounded-2xl"
            >
              <h2 className="text-xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight drop-shadow-lg line-clamp-4 md:line-clamp-none">
                {carouselItems[currentIndex].title}
              </h2>
              <Link
                to={carouselItems[currentIndex].link}
                className="bg-secondary text-primary font-bold px-6 py-2 md:px-10 md:py-3 rounded-xl hover:bg-white transition-all shadow-xl inline-flex items-center justify-center text-sm md:text-lg active:scale-95"
              >
                عرض التفاصيل
                <ChevronLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Simple & Fast */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/20 hover:bg-secondary hover:text-primary text-white p-2 rounded-full z-30 transition-all backdrop-blur-sm md:flex hidden"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/20 hover:bg-secondary hover:text-primary text-white p-2 rounded-full z-30 transition-all backdrop-blur-sm md:flex hidden"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Simple Dot Indicators - Better for performance */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 transition-all duration-300 rounded-full ${
              currentIndex === idx ? 'w-8 bg-secondary' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
