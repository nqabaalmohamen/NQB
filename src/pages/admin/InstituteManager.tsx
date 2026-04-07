import React, { useState, useEffect } from 'react';
import { initialInstituteData, InstituteData } from '../../data/store';
import { Save, Image as ImageIcon, GraduationCap, Plus, Trash2, CheckCircle, ListChecks, Upload } from 'lucide-react';
import { handleImageUpload } from '../../lib/imageUtils';

const InstituteManager = () => {
  const [data, setData] = useState<InstituteData>(initialInstituteData);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('instituteData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newData: InstituteData) => {
    setData(newData);
    localStorage.setItem('instituteData', JSON.stringify(newData));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const base64 = await handleImageUpload(file);
        saveToStorage({ ...data, image: base64 });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('حدث خطأ أثناء رفع الصورة');
      } finally {
        setUploading(false);
      }
    }
  };

  const addFeature = () => {
    saveToStorage({ ...data, features: [...data.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    saveToStorage({ ...data, features: newFeatures });
  };

  const updateFeature = (index: number, text: string) => {
    const newFeatures = data.features.map((feat, i) => i === index ? text : feat);
    saveToStorage({ ...data, features: newFeatures });
  };

  const addRequirement = () => {
    saveToStorage({ ...data, requirements: [...data.requirements, ''] });
  };

  const removeRequirement = (index: number) => {
    const newReqs = data.requirements.filter((_, i) => i !== index);
    saveToStorage({ ...data, requirements: newReqs });
  };

  const updateRequirement = (index: number, text: string) => {
    const newReqs = data.requirements.map((req, i) => i === index ? text : req);
    saveToStorage({ ...data, requirements: newReqs });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة معهد المحاماة</h1>
            <p className="text-gray-500 mt-1">تحديث محتوى، مميزات، وشروط الالتحاق بمعهد المحاماة</p>
          </div>
          <button
            onClick={() => saveToStorage(data)}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
          >
            <Save className="h-5 w-5" /> حفظ الكل
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
                  value={data.title}
                  onChange={(e) => saveToStorage({ ...data, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف التعريفي</label>
                <textarea
                  value={data.description}
                  onChange={(e) => saveToStorage({ ...data, description: e.target.value })}
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
                      value={data.image}
                      onChange={(e) => saveToStorage({ ...data, image: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <label className="bg-secondary text-primary px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white border-2 border-secondary transition-all cursor-pointer shadow-sm">
                    {uploading ? <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /> : <Upload className="h-5 w-5" />}
                    <span>{uploading ? 'جاري الرفع...' : 'رفع'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                {data.image && (
                  <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-100">
                    <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-secondary" /> مميزات المعهد
              </h2>
              <button onClick={addFeature} className="text-primary hover:bg-primary/10 p-2 rounded-lg"><Plus className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {data.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button onClick={() => removeFeature(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="h-5 w-5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-green-500" /> شروط الالتحاق
              </h2>
              <button onClick={addRequirement} className="text-primary hover:bg-primary/10 p-2 rounded-lg"><Plus className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {data.requirements.map((req, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(idx, e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button onClick={() => removeRequirement(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="h-5 w-5" /></button>
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
