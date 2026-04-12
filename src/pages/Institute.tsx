import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, Users, Award, BookOpen, ListChecks } from 'lucide-react';
import { useData } from '../context/DataContext';
import Linkify from '../components/Linkify';

const Institute = () => {
  const { institute: data } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-4">{data.title}</h1>
        <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          <Linkify text={data.description} />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div className="lg:col-span-3">
          <img 
            src={data.image} 
            alt="Institute" 
            className="w-full h-[400px] object-contain rounded-3xl shadow-xl mb-12 bg-gray-50"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-secondary" /> مميزات المعهد
          </h2>
          <div className="space-y-6">
            {data.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-accent rounded-xl">
                <div className="h-2 w-2 bg-secondary rounded-full shrink-0"></div>
                <p className="font-bold text-primary">
                  <Linkify text={feat} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary text-white p-10 rounded-3xl shadow-lg flex flex-col justify-center">
          <h2 className="text-3xl font-serif mb-6 flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-secondary" /> شروط الالتحاق
          </h2>
          <ul className="space-y-4 text-gray-300">
            {data.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                <span>
                  <Linkify text={req} />
                </span>
              </li>
            ))}
          </ul>
          <button className="mt-10 bg-secondary text-primary font-bold py-4 rounded-xl hover:bg-white transition-all">
            سجل الآن في الدورة القادمة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Institute;
