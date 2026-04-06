import React from 'react';
import { motion } from 'motion/react';
import { Users, Award, Briefcase } from 'lucide-react';

const Council = () => {
  const members = [
    { name: 'الأستاذ/ فلان الفلاني', role: 'نقيب محامين الفيوم', image: 'https://picsum.photos/seed/person1/300/300' },
    { name: 'الأستاذ/ علان العلاني', role: 'وكيل النقابة', image: 'https://picsum.photos/seed/person2/300/300' },
    { name: 'الأستاذ/ فلان بن فلان', role: 'أمين الصندوق', image: 'https://picsum.photos/seed/person3/300/300' },
    { name: 'الأستاذ/ اسم العضو', role: 'عضو مجلس', image: 'https://picsum.photos/seed/person4/300/300' },
    { name: 'الأستاذ/ اسم العضو', role: 'عضو مجلس', image: 'https://picsum.photos/seed/person5/300/300' },
    { name: 'الأستاذ/ اسم العضو', role: 'عضو مجلس', image: 'https://picsum.photos/seed/person6/300/300' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-4">مجلس النقابة</h1>
        <div className="w-24 h-1 bg-secondary mx-auto"></div>
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          نخبة من السادة المحامين المنتخبين لخدمة أعضاء الجمعية العمومية وتطوير العمل النقابي بمحافظة الفيوم.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
          >
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-secondary font-medium">{member.role}</p>
              <div className="mt-4 flex justify-center gap-3">
                <div className="bg-accent p-2 rounded-full"><Award className="h-4 w-4 text-primary" /></div>
                <div className="bg-accent p-2 rounded-full"><Briefcase className="h-4 w-4 text-primary" /></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Council;
