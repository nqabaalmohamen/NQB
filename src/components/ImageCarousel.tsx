import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Using framer-motion for animations
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { initialCarouselItems, CarouselItem } from '../data/store';

const ImageCarousel: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadItems = () => {
      const savedItems = localStorage.getItem('carouselItems');
      if (savedItems) {
        setCarouselItems(JSON.parse(savedItems));
      } else {
        setCarouselItems(initialCarouselItems);
      }
    };

    loadItems();
    window.addEventListener('storage', loadItems);
    window.addEventListener('carouselUpdated', loadItems);

    return () => {
      window.removeEventListener('storage', loadItems);
      window.removeEventListener('carouselUpdated', loadItems);
    };
  }, []);

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
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [carouselItems]);

  if (carouselItems.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].title}
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90"></div>
          
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                {carouselItems[currentIndex].title}
              </h2>
              <Link
                to={carouselItems[currentIndex].link}
                className="bg-secondary text-primary font-bold px-8 py-3 rounded-md hover:bg-white transition-all shadow-lg inline-flex items-center justify-center"
              >
                اقرأ المزيد
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-30 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 w-2 rounded-full ${
              currentIndex === idx ? 'bg-secondary' : 'bg-white/50 hover:bg-white/80'
            } transition-colors`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
