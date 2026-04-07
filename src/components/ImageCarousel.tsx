import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Using framer-motion for animations
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  link: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/news1/1920/1080',
    title: 'إعلان هام بخصوص تجديد الكارنيهات لعام 2024',
    link: '/news/renewal-2024',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/news2/1920/1080',
    title: 'ورشة عمل حول آخر التعديلات القانونية في قانون العمل',
    link: '/news/labor-law-workshop',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/news3/1920/1080',
    title: 'افتتاح الدورة التدريبية الجديدة لمعهد المحاماة',
    link: '/institute',
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/news4/1920/1080',
    title: 'ندوة تثقيفية حول حقوق المحامين وواجباتهم',
    link: '/news/lawyers-rights',
  },
];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(goToNext, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, []);

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
