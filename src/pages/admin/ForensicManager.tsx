import React, { useState, useEffect } from 'react';
import { initialForensicData, ForensicData } from '../../data/store';
import { Save, Image as ImageIcon, CheckCircle, Plus, Trash2, AlertCircle, Upload } from 'lucide-react';
import { handleImageUpload } from '../../lib/imageUtils';

const ForensicManager = () => {
  const [data, setData] = useState<ForensicData>(initialForensicData);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('forensicData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newData: ForensicData) => {
    setData(newData);
    localStorage.setItem('forensicData', JSON.stringify(newData));
    window.dispatchEvent(new Event('forensicUpdated'));
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

  const addService = () => {
    const newService = { id: Date.now(), title: '' };
    saveToStorage({ ...data, services: [...data.services, newService] });
  };

  const removeService = (id: number) => {
    saveToStorage({ ...data, services: data.services.filter(s => s.id !== id) });
  };

  const updateService = (id: number, title: string) => {
    const newServices = data.services.map(s => s.id === id ? { ...s, title } : s);
    saveToStorage({ ...data, services: newServices });
  };

  const addInstruction = () => {
    saveToStorage({ ...data, instructions: [...data.instructions, ''] });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = data.instructions.filter((_, i) => i !== index);
    saveToStorage({ ...data, instructions: newInstructions });
  };

  const updateInstruction = (index: number, text: string) => {
    const newInstructions = data.instructions.map((instr, i) => i === index ? text : instr);
    saveToStorage({ ...data, instructions: newInstructions });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">إدارة قسم الطب الشرعي</h1>
            <p className="text-gray-500 mt-1">تحديث محتوى وتعليمات التنسيق مع الطب الشرعي</p>
          </div>
          <button
            onClick={() => saveToStorage(data)}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
          >
            <Save className="h-5 w-5" />
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
                  <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" /> قائمة الخدمات
              </h2>
              <button
                onClick={addService}
                className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {data.services.map((service) => (
                <div key={service.id} className="flex gap-2">
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(service.id, e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    onClick={() => removeService(service.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions List */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-secondary" /> التعليمات الهامة
              </h2>
              <button
                onClick={addInstruction}
                className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {data.instructions.map((instr, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={instr}
                    onChange={(e) => updateInstruction(idx, e.target.value)}
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    onClick={() => removeInstruction(idx)}
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

export default ForensicManager;
