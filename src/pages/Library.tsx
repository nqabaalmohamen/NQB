import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, FileText, Scale, Filter, Eye, X, Book } from 'lucide-react';
import { useData } from '../context/DataContext';
import Linkify from '../components/Linkify';

// Helper to normalize Arabic text for better searching
const normalizeArabic = (text: string) => {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u0652]/g, '') // Remove diacritics (Tashkeel)
    .toLowerCase()
    .trim();
};

const Library = () => {
  const { resources } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [readingDoc, setReadingDoc] = useState<any>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const categories = ['الكل', 'قوانين أساسية', 'أحكام قضائية', 'كتب قانونية', 'تعليمات إدارية'];

  const filteredResources = useMemo(() => {
    const query = normalizeArabic(searchTerm);
    let filtered = resources;
    
    if (activeCategory !== 'الكل') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (!query) return filtered;

    const keywords = query.split(/\s+/).filter(k => k.length > 0);
    return filtered.filter(item => {
      const searchableText = normalizeArabic(`${item.title} ${item.content} ${item.category}`);
      return keywords.every(keyword => searchableText.includes(keyword));
    });
  }, [searchTerm, activeCategory, resources]);

  const handleDownload = (id: number) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16" dir="rtl">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-serif mb-4">المكتبة القانونية الرقمية</h1>
          <div className="w-24 h-1 bg-secondary"></div>
        </div>
        
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="ابحث عن قوانين، أحكام، أو كتب..."
            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pr-14 pl-6 focus:ring-4 focus:ring-secondary/20 focus:border-secondary outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Categories Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-32">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Filter className="h-5 w-5 text-secondary" /> التصنيفات
            </h2>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3 rounded-xl text-right font-bold transition-all ${
                    activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg translate-x-[-4px]' 
                    : 'bg-accent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Resources Grid */}
        <div className="flex-grow">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-accent p-4 rounded-2xl text-primary group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                      <FileText className="h-8 w-8" />
                    </div>
                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 leading-tight min-h-[3.5rem]">
                    {item.title}
                  </h3>
                  
                  <div className="text-sm text-gray-400 mb-8 flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Scale className="h-4 w-4" /> {item.category}
                    </span>
                    <span>{item.size}</span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-gray-50">
                    <button 
                      onClick={() => setReadingDoc(item)}
                      className="flex items-center justify-center gap-2 bg-accent text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
                    >
                      <Eye className="h-4 w-4" /> قراءة
                    </button>
                    <button 
                      onClick={() => handleDownload(item.id)}
                      disabled={downloading === item.id}
                      className={`flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all ${
                        downloading === item.id 
                        ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                        : 'bg-secondary text-primary hover:shadow-lg'
                      }`}
                    >
                      <Download className={`h-4 w-4 ${downloading === item.id ? 'animate-bounce' : ''}`} />
                      {downloading === item.id ? 'جاري...' : 'تحميل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-3xl shadow-sm text-center border border-dashed border-gray-200">
              <div className="bg-accent w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-serif text-gray-400">لا توجد نتائج</h3>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('الكل');}}
                className="mt-6 text-secondary font-bold hover:underline"
              >
                عرض كافة الموارد
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reader Modal */}
      {readingDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" onClick={() => setReadingDoc(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-accent">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <Book className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary leading-none">{readingDoc.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{readingDoc.category}</p>
                </div>
              </div>
              <button onClick={() => setReadingDoc(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-8 lg:p-12 overflow-y-auto bg-gray-50 flex-grow text-right leading-relaxed text-gray-700 whitespace-pre-wrap font-serif text-lg">
              <Linkify text={readingDoc.content} />
            </div>
            <div className="p-6 border-t bg-white flex justify-end gap-4">
              <button onClick={() => setReadingDoc(null)} className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">إغلاق</button>
              <button onClick={() => handleDownload(readingDoc.id)} className="px-8 py-3 bg-secondary text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <Download className="h-5 w-5" /> تحميل النسخة الكاملة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
