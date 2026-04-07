import React, { useState, useEffect } from 'react';
import { initialNewsItems, NewsItem } from '../../data/carousel';
import { Plus, Trash2, Edit2, Save, X, Newspaper, Calendar, Image as ImageIcon } from 'lucide-react';

const NewsManager = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<NewsItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('newsItems');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(initialNewsItems);
    }
  }, []);

  const saveToStorage = (newItems: NewsItem[]) => {
    setItems(newItems);
    localStorage.setItem('newsItems', JSON.stringify(newItems));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setIsEditing(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      const newItems = items.map(item => item.id === editForm.id ? editForm : item);
      saveToStorage(newItems);
      setIsEditing(null);
      setEditForm(null);
    }
  };

  const handleAdd = () => {
    if (editForm) {
      const newItem = { ...editForm, id: Date.now() };
      const newItems = [newItem, ...items];
      saveToStorage(newItems);
      setIsAdding(false);
      setEditForm(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة الأخبار والإعلانات</h1>
            <p className="text-gray-500 mt-1">نشر وتعديل الأخبار التي تظهر في الصفحة الرئيسية</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditForm({ id: 0, title: '', content: '', date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }), image: '' });
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
            نشر خبر جديد
          </button>
        </div>

        {/* Form for Adding/Editing */}
        {(isAdding || isEditing) && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {isAdding ? 'نشر خبر جديد' : 'تعديل الخبر'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الخبر</label>
                <input
                  type="text"
                  value={editForm?.title || ''}
                  onChange={(e) => setEditForm({ ...editForm!, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  placeholder="أدخل عنواناً جذاباً للخبر"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رابط صورة الخبر</label>
                <input
                  type="text"
                  value={editForm?.image || ''}
                  onChange={(e) => setEditForm({ ...editForm!, image: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://example.com/news-image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ النشر</label>
                <input
                  type="text"
                  value={editForm?.date || ''}
                  onChange={(e) => setEditForm({ ...editForm!, date: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="مثال: 15 مارس 2024"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">محتوى الخبر</label>
                <textarea
                  value={editForm?.content || ''}
                  onChange={(e) => setEditForm({ ...editForm!, content: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="اكتب تفاصيل الخبر هنا..."
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={isAdding ? handleAdd : handleSaveEdit}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
              >
                <Save className="h-5 w-5" />
                {isAdding ? 'نشر الخبر' : 'حفظ التعديلات'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setEditForm(null);
                }}
                className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all"
              >
                <X className="h-5 w-5" />
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all">
              <div className="md:w-64 h-48 shrink-0 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-accent text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{item.date}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
