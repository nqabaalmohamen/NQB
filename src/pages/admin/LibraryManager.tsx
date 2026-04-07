import React, { useState, useEffect } from 'react';
import { initialLibraryResources, LibraryResource } from '../../data/store';
import { Plus, Trash2, Edit2, Save, X, Book, FileText, Search } from 'lucide-react';

const LibraryManager = () => {
  const [items, setItems] = useState<LibraryResource[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<LibraryResource | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('libraryResources');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(initialLibraryResources);
    }
  }, []);

  const saveToStorage = (newItems: LibraryResource[]) => {
    setItems(newItems);
    localStorage.setItem('libraryResources', JSON.stringify(newItems));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
    }
  };

  const handleEdit = (item: LibraryResource) => {
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

  const categories = ['قوانين أساسية', 'أحكام قضائية', 'كتب قانونية', 'تعليمات إدارية'];

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة المكتبة القانونية</h1>
            <p className="text-gray-500 mt-1">إضافة وتعديل الكتب والقوانين والمراجع</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditForm({ id: 0, title: '', type: 'PDF', size: '', category: 'قوانين أساسية', content: '' });
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
            إضافة مورد جديد
          </button>
        </div>

        {(isAdding || isEditing) && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {isAdding ? 'إضافة مورد جديد' : 'تعديل المورد'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المورد</label>
                <input
                  type="text"
                  value={editForm?.title || ''}
                  onChange={(e) => setEditForm({ ...editForm!, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
                <select
                  value={editForm?.category || ''}
                  onChange={(e) => setEditForm({ ...editForm!, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">حجم الملف (مثال: 2.4 MB)</label>
                <input
                  type="text"
                  value={editForm?.size || ''}
                  onChange={(e) => setEditForm({ ...editForm!, size: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع الملف (PDF, Digital, etc.)</label>
                <input
                  type="text"
                  value={editForm?.type || ''}
                  onChange={(e) => setEditForm({ ...editForm!, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">محتوى أو نبذة عن المورد</label>
                <textarea
                  value={editForm?.content || ''}
                  onChange={(e) => setEditForm({ ...editForm!, content: e.target.value })}
                  rows={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={isAdding ? handleAdd : handleSaveEdit} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md">
                <Save className="h-5 w-5" /> حفظ
              </button>
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
                <X className="h-5 w-5" /> إلغاء
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-primary transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-3 rounded-lg text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.category} • {item.size}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"><Edit2 className="h-5 w-5" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryManager;
