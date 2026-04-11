import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, GraduationCap, Plus, Trash2, CheckCircle, ListChecks, Upload } from 'lucide-react';
import { handleImageUpload } from '../../lib/imageUtils';
import { useData } from '../../context/DataContext';

const InstituteManager = () => {
  const { institute: data, updateInstitute, publishToGithub } = useData();
  const [localData, setLocalData] = useState(data);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      updateInstitute(localData);
      // Directly sync with GitHub
      const success = await publishToGithub();
      if (success) {
        alert('تم حفظ كافة التعديلات ونشرها على الموقع بنجاح');
      } else {
        alert('تم حفظ التعديلات محلياً، ولكن فشل النشر على GitHub. يرجى التحقق من الإعدادات.');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const base64 = await handleImageUpload(file);
        setLocalData({ ...localData, image: base64 });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('حدث خطأ أثناء رفع الصورة');
      } finally {
        setUploading(false);
      }
    }
  };

  const addItem = (field: 'features') => {
    setLocalData({ ...localData, [field]: [...localData[field], ''] });
  };

  const removeItem = (field: 'features', index: number) => {
    const newList = localData[field].filter((_, i) => i !== index);
    setLocalData({ ...localData, [field]: newList });
  };

  const updateItem = (field: 'features', index: number, text: string) => {
    const newList = localData[field].map((item, i) => i === index ? text : item);
    setLocalData({ ...localData, [field]: newList });
  };

  const addRequirement = () => {
    setLocalData({ ...localData, requirements: [...localData.requirements, ''] });
  };

  const removeRequirement = (index: number) => {
    const newList = localData.requirements.filter((_, i) => i !== index);
    setLocalData({ ...localData, requirements: newList });
  };

  const updateRequirement = (index: number, text: string) => {
    const newList = localData.requirements.map((item, i) => i === index ? text : item);
    setLocalData({ ...localData, requirements: newList });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة معهد المحاماة</h1>
            <p className="text-gray-500 mt-1">تحديث البرامج التدريبية ومتطلبات الالتحاق بالمعهد</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className={`bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md ${(saving || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            حفظ الكل
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" /> المعلومات الأساسية
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الصفحة</label>
                <input
                  type="text"
                  value={localData.title}
                  onChange={(e) => setLocalData({ ...localData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف التعريفي</label>
                <textarea
                  value={localData.description}
                  onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصورة الرئيسية</label>
                <div className="flex gap-4 items-center">
                  <div className="relative group flex-grow">
                    <input
                      type="text"
                      value={localData.image}
                      onChange={(e) => setLocalData({ ...localData, image: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <label className="bg-secondary text-primary px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white border-2 border-secondary transition-all cursor-pointer shadow-sm">
                    {uploading ? <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /> : <Upload className="h-5 w-5" />}
                    <span>{uploading ? 'جاري الرفع...' : 'رفع'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                {localData.image && (
                  <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                    <img src={localData.image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Programs List */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> البرامج التدريبية
              </h2>
              <button
                onClick={() => addItem('features')}
                className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {localData.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updateItem('features', idx, e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    onClick={() => removeItem('features', idx)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-green-500" /> شروط ومتطلبات الالتحاق
              </h2>
              <button
                onClick={addRequirement}
                className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localData.requirements.map((req, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(idx, e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    onClick={() => removeRequirement(idx)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteManager;
