import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, GraduationCap, BookOpen, Newspaper, Bell } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/court/1920/1080" 
            alt="Fayoum Court" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
              نقابة المحامين بالفيوم <br/>
              <span className="text-secondary font-bold">صوت الحق ومنارة العدالة</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              نعمل على تمكين المحامين وتطوير مهنة المحاماة من خلال تقديم خدمات متميزة وبرامج تدريبية متطورة.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/forensic" className="bg-secondary text-primary font-bold px-8 py-3 rounded-md hover:bg-white transition-all shadow-lg flex items-center justify-center">
                الخدمات الإلكترونية
              </Link>
              <Link to="/council" className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-md hover:bg-white hover:text-primary transition-all flex items-center justify-center">
                عن النقابة
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md group">
              <div className="h-48 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/news${i}/600/400`} 
                  alt="News" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Bell className="h-4 w-4" />
                  <span>15 مارس 2024</span>
                </div>
                <h4 className="font-bold text-lg mb-3 group-hover:text-secondary transition-colors">
                  إعلان هام بخصوص تجديد الكارنيهات لعام 2024
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  تعلن نقابة المحامين بالفيوم عن بدء إجراءات تجديد العضوية السنوية وتوفير منافذ جديدة لتسهيل الإجراءات...
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
