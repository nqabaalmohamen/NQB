import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Award, Briefcase } from 'lucide-react';
import { useData } from '../context/DataContext';

const Council = () => {
  const { members } = useData();

  // تصنيف الأعضاء بناءً على المنصب مع تحسين الفلاتر لتكون أكثر مرونة
  // التأكد من أن حازم طه يتم التعرف عليه كنقيب دائماً
  const chairman = members.filter(m => 
    (m.name.includes('حازم طه') || (m.role.includes('نقيب') && !m.role.includes('وكيل') && !m.role.includes('أمين') && !m.role.includes('امين')))
  );
  const viceChairmen = members.filter(m => m.role.includes('وكيل'));
  const secretaryGeneral = members.filter(m => 
    m.role.includes('أمين عام') || 
    m.role.includes('امين عام') || 
    m.role.includes('الأمين العام') || 
    m.role.includes('الامين العام') || 
    m.role.includes('السكرتير') ||
    m.role.includes('سكرتير')
  );
  const treasurer = members.filter(m => 
    m.role.includes('خزينة') || 
    m.role.includes('الصندوق') || 
    m.role.includes('أمين صندوق') || 
    m.role.includes('امين صندوق')
  );
  const youthMember = members.filter(m => m.role.includes('شباب'));
  
  // استبعاد الأعضاء المصنفين من قائمة "باقي الأعضاء"
  const classifiedIds = new Set([
    ...chairman.map(m => m.id),
    ...viceChairmen.map(m => m.id),
    ...secretaryGeneral.map(m => m.id),
    ...treasurer.map(m => m.id),
    ...youthMember.map(m => m.id)
  ]);

  const otherMembers = members.filter(m => !classifiedIds.has(m.id));

  const MemberCard = ({ member, large = false }: { member: any, large?: boolean }) => (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group w-full ${large ? 'max-w-md' : 'max-w-sm'} mx-auto`}
    >
      <div className={`${large ? 'h-64 md:h-80' : 'aspect-square'} overflow-hidden relative bg-gray-50 flex items-center justify-center`}>
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors"></div>
      </div>
      <div className="p-5 md:p-6 text-center">
        <h3 className={`${large ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'} font-bold mb-1 md:mb-2 text-gray-800`}>{member.name}</h3>
        <p className="text-secondary font-bold text-sm md:text-base">{member.role}</p>
        <div className="mt-3 md:mt-4 flex justify-center gap-3">
          <div className="bg-accent p-2 rounded-full"><Award className="h-4 w-4 text-primary" /></div>
          <div className="bg-accent p-2 rounded-full"><Briefcase className="h-4 w-4 text-primary" /></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16" dir="rtl">
      {/* النقيب - يترأس الصفحة */}
      {chairman.length > 0 && (
        <section className="mb-20 md:32">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-2">نقيب المحامين</h2>
              <div className="w-24 md:32 h-1.5 bg-secondary mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="flex justify-center px-2 w-full">
              {chairman.map(m => (
                <div key={m.id} className="relative">
                  <MemberCard member={m} large={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="text-center mb-12 md:20">
        <h1 className="text-2xl md:text-4xl font-serif mb-4 text-gray-700">مجلس نقابة المحامين بالفيوم</h1>
        <div className="w-16 md:24 h-1 bg-gray-300 mx-auto rounded-full"></div>
      </div>

      {/* الوكلاء */}
      {viceChairmen.length > 0 && (
        <section className="mb-16 md:24">
          <div className="flex items-center gap-4 mb-8 md:12 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary px-6 py-2 bg-accent/30 rounded-xl">الوكلاء</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto px-2">
            {viceChairmen.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* الأمانة العامة */}
      {secretaryGeneral.length > 0 && (
        <section className="mb-16 md:24">
          <div className="flex items-center gap-4 mb-8 md:12 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary px-6 py-2 bg-accent/30 rounded-xl">الأمانة العامة</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto px-2">
            {secretaryGeneral.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* أمانة الصندوق */}
      {treasurer.length > 0 && (
        <section className="mb-16 md:24">
          <div className="flex items-center gap-4 mb-8 md:12 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary px-6 py-2 bg-accent/30 rounded-xl">أمانة الصندوق</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto px-2">
            {treasurer.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* عضو الشباب */}
      {youthMember.length > 0 && (
        <section className="mb-16 md:24">
          <div className="flex items-center gap-4 mb-8 md:12 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary px-6 py-2 bg-accent/30 rounded-xl">عضو الشباب</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
          </div>
          <div className="flex justify-center px-2">
            {youthMember.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* باقي الأعضاء */}
      {otherMembers.length > 0 && (
        <section className="mb-16 md:24">
          <div className="flex items-center gap-4 mb-8 md:12 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
            <h2 className="text-2xl md:text-4xl font-bold text-primary px-6 py-2 bg-accent/30 rounded-xl">أعضاء المجلس</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[150px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto px-2">
            {otherMembers.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Council;
