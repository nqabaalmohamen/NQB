import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Share2, Bookmark, Clock, Newspaper } from 'lucide-react';
import { useData } from '../context/DataContext';
import Linkify from '../components/Linkify';
import { motion } from 'framer-motion';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { news, carousel } = useData();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Try to find in news first
      let found = news?.find(n => n.id.toString() === id);
      
      // If not found in news, try in carousel items
      if (!found && carousel) {
        found = carousel.find(c => c.id.toString() === id);
      }
      
      if (found) {
        setItem(found);
      }
    }
  }, [id, news, carousel]);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold text-lg">جاري تحميل الخبر...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-12 md:py-20"
      dir="rtl"
    >
      {/* Navigation & Actions */}
      <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold"
        >
          <ArrowRight className="h-5 w-5" /> العودة للسابق
        </button>
        
        <div className="flex gap-3">
          <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-primary transition-all active:scale-95">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-primary transition-all active:scale-95">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>

      <article className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden border border-gray-50">
        {/* Main Image */}
        <div className="relative h-[300px] md:h-[500px] bg-gray-100">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-contain md:object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 right-8 left-8">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
              <Newspaper className="h-4 w-4" /> أخبار النقابة
            </div>
            <h1 className="text-2xl md:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg">
              {item.title}
            </h1>
          </div>
        </div>

        <div className="p-8 md:p-16">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-gray-100 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              <span>تاريخ النشر: {item.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              <span>وقت القراءة: 3 دقائق</span>
            </div>
          </div>

          {/* Content */}
          <div className="text-gray-700 leading-[2.2] text-lg md:text-xl whitespace-pre-wrap font-serif text-right">
            <Linkify text={item.content} />
          </div>

          {/* Footer Info */}
          <div className="mt-20 p-8 bg-accent/50 rounded-3xl border-2 border-dashed border-accent flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
            <div>
              <h4 className="font-bold text-primary text-lg mb-1">هل لديك استفسار حول هذا الخبر؟</h4>
              <p className="text-gray-500 text-sm">يمكنك التواصل مع مكتب النقابة مباشرة للحصول على مزيد من المعلومات</p>
            </div>
            <Link to="/contact" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl">
              تواصل معنا الآن
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

export default NewsDetail;
