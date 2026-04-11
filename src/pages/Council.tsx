import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Award, Briefcase } from 'lucide-react';
import { useData } from '../context/DataContext';

const Council = () => {
  const { members } = useData();

  // تصنيف الأعضاء بناءً على المنصب
  const chairman = members.filter(m => m.role.includes('نقيب'));
  const viceChairmen = members.filter(m => m.role.includes('وكيل'));
  const secretaryGeneral = members.filter(m => m.role.includes('أمين عام') || m.role.includes('السكرتير'));
  const treasurer = members.filter(m => m.role.includes('خزينة') || m.role.includes('الصندوق'));
  const youthMember = members.filter(m => m.role.includes('شباب'));
  const otherMembers = members.filter(m => 
    !m.role.includes('نقيب') && 
    !m.role.includes('وكيل') && 
    !m.role.includes('أمين عام') && 
    !m.role.includes('السكرتير') && 
    !m.role.includes('الصندوق') && 
    !m.role.includes('خزينة') && 
    !m.role.includes('شباب')
  );

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
      <div className="text-center mb-12 md:20">
        <h1 className="text-3xl md:text-5xl font-serif mb-4 md:6 text-primary">مجلس نقابة المحامين بالفيوم</h1>
        <div className="w-24 md:32 h-1 md:1.5 bg-secondary mx-auto rounded-full"></div>
      </div>

      {/* النقيب */}
      {chairman.length > 0 && (
        <section className="mb-12 md:20">
          <div className="flex items-center gap-4 mb-6 md:10 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 px-4 py-2 bg-accent/30 rounded-lg">نقيب المحامين</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="flex justify-center px-2">
            {chairman.map(m => <MemberCard key={m.id} member={m} large={true} />)}
          </div>
        </section>
      )}

      {/* الوكلاء */}
      {viceChairmen.length > 0 && (
        <section className="mb-12 md:20">
          <div className="flex items-center gap-4 mb-6 md:10 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 px-4 py-2 bg-accent/30 rounded-lg">الوكلاء</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto px-2">
            {viceChairmen.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* الأمانة العامة وأمانة الصندوق */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 mb-12 md:20">
        {/* الأمانة العامة */}
        {secretaryGeneral.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6 md:10 justify-center">
              <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[50px]"></div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 px-4 py-2 bg-accent/30 rounded-lg">الأمانة العامة</h2>
              <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[50px]"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:gap-10 px-2">
              {secretaryGeneral.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        )}

        {/* أمانة الصندوق */}
        {treasurer.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6 md:10 justify-center">
              <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[50px]"></div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 px-4 py-2 bg-accent/30 rounded-lg">أمانة الصندوق</h2>
              <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[50px]"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:gap-10 px-2">
              {treasurer.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        )}
      </div>

      {/* عضو الشباب */}
      {youthMember.length > 0 && (
        <section className="mb-12 md:20">
          <div className="flex items-center gap-4 mb-6 md:10 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 px-4 py-2 bg-accent/30 rounded-lg">عضو الشباب</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="flex justify-center px-2">
            {youthMember.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* باقي الأعضاء */}
      {otherMembers.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6 md:10 justify-center">
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 px-4 py-2 bg-accent/30 rounded-lg">أعضاء المجلس</h2>
            <div className="hidden sm:block h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2">
            {otherMembers.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Council;
