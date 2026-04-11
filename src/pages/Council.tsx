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
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group ${large ? 'max-w-md mx-auto' : ''}`}
    >
      <div className={`${large ? 'h-80' : 'aspect-square'} overflow-hidden relative bg-gray-50`}>
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
      </div>
      <div className="p-6 text-center">
        <h3 className={`${large ? 'text-2xl' : 'text-xl'} font-bold mb-2`}>{member.name}</h3>
        <p className="text-secondary font-bold">{member.role}</p>
        <div className="mt-4 flex justify-center gap-3">
          <div className="bg-accent p-2 rounded-full"><Award className="h-4 w-4 text-primary" /></div>
          <div className="bg-accent p-2 rounded-full"><Briefcase className="h-4 w-4 text-primary" /></div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16" dir="rtl">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-serif mb-6 text-primary">مجلس نقابة المحامين بالفيوم</h1>
        <div className="w-32 h-1.5 bg-secondary mx-auto rounded-full"></div>
      </div>

      {/* النقيب */}
      {chairman.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-3xl font-bold text-gray-800">نقيب المحامين</h2>
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="flex justify-center">
            {chairman.map(m => <MemberCard key={m.id} member={m} large={true} />)}
          </div>
        </section>
      )}

      {/* الوكلاء */}
      {viceChairmen.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-3xl font-bold text-gray-800">الوكلاء</h2>
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {viceChairmen.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* الأمانة العامة وأمانة الصندوق */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        {/* الأمانة العامة */}
        {secretaryGeneral.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10 justify-center">
              <div className="h-px bg-gray-200 flex-grow max-w-[50px]"></div>
              <h2 className="text-2xl font-bold text-gray-800">الأمانة العامة</h2>
              <div className="h-px bg-gray-200 flex-grow max-w-[50px]"></div>
            </div>
            <div className="grid grid-cols-1 gap-10">
              {secretaryGeneral.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        )}

        {/* أمانة الصندوق */}
        {treasurer.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10 justify-center">
              <div className="h-px bg-gray-200 flex-grow max-w-[50px]"></div>
              <h2 className="text-2xl font-bold text-gray-800">أمانة الصندوق</h2>
              <div className="h-px bg-gray-200 flex-grow max-w-[50px]"></div>
            </div>
            <div className="grid grid-cols-1 gap-10">
              {treasurer.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        )}
      </div>

      {/* عضو الشباب */}
      {youthMember.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-3xl font-bold text-gray-800">عضو الشباب</h2>
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="flex justify-center">
            {youthMember.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}

      {/* باقي الأعضاء */}
      {otherMembers.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
            <h2 className="text-3xl font-bold text-gray-800">أعضاء المجلس</h2>
            <div className="h-px bg-gray-200 flex-grow max-w-[100px]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {otherMembers.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Council;
