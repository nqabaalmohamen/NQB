import React, { useState, useEffect } from 'react';
import { initialCouncilMembers, CouncilMember } from '../../data/store';
import { Plus, Trash2, Edit2, Save, X, Award, Briefcase, User, Upload } from 'lucide-react';
import { handleImageUpload } from '../../lib/imageUtils';

const CouncilManager = () => {
  const [items, setItems] = useState<CouncilMember[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CouncilMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('councilMembers');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(initialCouncilMembers);
    }
  }, []);

  const saveToStorage = (newItems: CouncilMember[]) => {
    setItems(newItems);
    localStorage.setItem('councilMembers', JSON.stringify(newItems));
    window.dispatchEvent(new Event('councilUpdated'));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editForm) {
      setUploading(true);
      try {
        const base64 = await handleImageUpload(file);
        setEditForm({ ...editForm, image: base64 });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('حدث خطأ أثناء رفع الصورة');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العضو من المجلس؟')) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
    }
  };

  const handleEdit = (item: CouncilMember) => {
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
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة مجلس النقابة</h1>
            <p className="text-gray-500 mt-1">تحديث بيانات وصور أعضاء مجلس نقابة المحامين بالفيوم</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditForm({ id: 0, name: '', role: '', image: '' });
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
            إضافة عضو جديد
          </button>
        </div>

        {/* Form for Adding/Editing */}
        {(isAdding || isEditing) && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {isAdding ? 'إضافة عضو مجلس جديد' : 'تعديل بيانات العضو'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم العضو</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={editForm?.name || ''}
                    onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-3 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    placeholder="الأستاذ/ ..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المنصب النقابي</label>
                <div className="relative">
                  <Award className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={editForm?.role || ''}
                    onChange={(e) => setEditForm({ ...editForm!, role: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="مثال: عضو مجلس"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصورة</label>
                <div className="flex gap-4 items-center">
                  <div className="relative group flex-grow">
                    <input
                      type="text"
                      value={editForm?.image || ''}
                      onChange={(e) => setEditForm({ ...editForm!, image: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="رابط الصورة أو ارفع ملفاً"
                    />
                  </div>
                  <label className="bg-secondary text-primary px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white border-2 border-secondary transition-all cursor-pointer shadow-sm">
                    {uploading ? <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /> : <Upload className="h-5 w-5" />}
                    <span>{uploading ? 'جاري الرفع...' : 'رفع'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                {editForm?.image && (
                  <div className="mt-4 relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 mx-auto">
                    <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={isAdding ? handleAdd : handleSaveEdit}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
              >
                <Save className="h-5 w-5" />
                {isAdding ? 'حفظ العضو' : 'حفظ التعديلات'}
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

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
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
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{item.name}</h3>
                <p className="text-secondary font-bold text-sm">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouncilManager;
