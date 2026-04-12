import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import Linkify from '../components/Linkify';

const Forensic = () => {
  const { forensic: data } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6 font-bold">
            <ShieldCheck className="h-5 w-5" /> خدمات الطب الشرعي
          </div>
          <h1 className="text-4xl font-serif mb-6">{data.title}</h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            <Linkify text={data.description} />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.services.map((service) => (
              <div key={service.id} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">
                  <Linkify text={service.title} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <img 
            src={data.image} 
            alt="Forensic" 
            className="rounded-3xl shadow-2xl border-8 border-white w-full h-auto object-contain bg-gray-50"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="bg-primary text-white p-10 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <AlertCircle className="h-8 w-8 text-secondary" />
          <h2 className="text-2xl font-bold">تعليمات هامة</h2>
        </div>
        <ul className="list-disc list-inside space-y-4 text-gray-300">
          {data.instructions.map((instr, idx) => (
            <li key={idx}>
              <Linkify text={instr} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Forensic;
