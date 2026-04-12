import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, BookOpen, Newspaper, Bell } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { useData } from '../context/DataContext';

const Home = () => {
  const { news } = useData();

  return (
    <div className="flex flex-col gap-10 md:gap-16 pb-20 overflow-x-hidden">
      {/* Image Carousel Section */}
      <ImageCarousel />

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-16 md:-mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { title: 'الطب الشرعي', icon: ShieldCheck, desc: 'خدمات التنسيق مع مصلحة الطب الشرعي والتقارير الفنية.' },
            { title: 'معهد المحاماة', icon: GraduationCap, desc: 'البرامج التدريبية والدورات المتخصصة للمحامين الجدد.' },
            { title: 'المكتبة القانونية', icon: BookOpen, desc: 'أكبر مرجع رقمي للتشريعات والأحكام القضائية.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-xl shadow-xl border-b-4 border-secondary text-center"
            >
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News & Announcements */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-serif border-r-8 border-secondary pr-4">آخر الأخبار والإعلانات</h2>
          <Link to="/library" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors">
            عرض الكل <Newspaper className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md group">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Bell className="h-4 w-4" />
                  <span>{item.date}</span>
                </div>
                <h4 className="font-bold text-lg mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
