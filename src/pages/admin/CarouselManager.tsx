import React, { useState, useEffect } from 'react';
import { initialCarouselItems, CarouselItem } from '../../data/carousel';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';

const CarouselManager = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CarouselItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('carouselItems');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(initialCarouselItems);
    }
  }, []);

  const saveToStorage = (newItems: CarouselItem[]) => {
    setItems(newItems);
    localStorage.setItem('carouselItems', JSON.stringify(newItems));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
    }
  };

  const handleEdit = (item: CarouselItem) => {
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
      const newItems = [...items, newItem];
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
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة صور السلايدر</h1>
            <p className="text-gray-500 mt-1">إضافة، تعديل أو حذف صور العرض في الصفحة الرئيسية</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditForm({ id: 0, title: '', image: '', link: '' });
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
            إضافة صورة جديدة
          </button>
        </div>

        {/* Form for Adding/Editing */}
        {(isAdding || isEditing) && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {isAdding ? 'إضافة صورة جديدة' : 'تعديل الصورة'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الخبر</label>
                <input
                  type="text"
                  value={editForm?.title || ''}
                  onChange={(e) => setEditForm({ ...editForm!, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="أدخل عنوان الخبر"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رابط الصورة (URL)</label>
                <input
                  type="text"
                  value={editForm?.image || ''}
                  onChange={(e) => setEditForm({ ...editForm!, image: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">رابط التوجه عند الضغط</label>
                <input
                  type="text"
                  value={editForm?.link || ''}
                  onChange={(e) => setEditForm({ ...editForm!, link: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="/news/example"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={isAdding ? handleAdd : handleSaveEdit}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
              >
                <Save className="h-5 w-5" />
                {isAdding ? 'حفظ وإضافة' : 'حفظ التعديلات'}
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

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-3 bg-white text-primary rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-white text-red-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[3rem]">{item.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs">
                  <ImageIcon className="h-4 w-4" />
                  <span className="truncate">{item.link}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselManager;
