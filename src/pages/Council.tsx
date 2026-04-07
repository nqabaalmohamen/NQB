import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Award, Briefcase } from 'lucide-react';
import { initialCouncilMembers, CouncilMember } from '../data/store';

const Council = () => {
  const [members, setMembers] = useState<CouncilMember[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('councilMembers');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers(initialCouncilMembers);
    }
  }, []);

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
        {members.map((member) => (
          <motion.div
            key={member.id}
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
