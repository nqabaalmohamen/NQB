import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, CheckCircle, Plus, Trash2, AlertCircle, Upload } from 'lucide-react';
import { handleImageUpload } from '../../lib/imageUtils';
import { useData } from '../../context/DataContext';

const ForensicManager = () => {
  const { forensic: data, updateForensic, publishToGithub, isPublishing } = useData();
  const [localData, setLocalData] = useState(data);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      updateForensic(localData);
      // Removed automatic sync with GitHub to allow multiple changes before publishing
    } catch (error) {
      console.error('Error saving:', error);
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

  const addService = () => {
    const newService = { id: Date.now(), title: '' };
    setLocalData({ ...localData, services: [...localData.services, newService] });
  };

  const removeService = (id: number) => {
    setLocalData({ ...localData, services: localData.services.filter(s => s.id !== id) });
  };

  const updateService = (id: number, title: string) => {
    const newServices = localData.services.map(s => s.id === id ? { ...s, title } : s);
    setLocalData({ ...localData, services: newServices });
  };

  const addInstruction = () => {
    setLocalData({ ...localData, instructions: [...localData.instructions, ''] });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = localData.instructions.filter((_, i) => i !== index);
    setLocalData({ ...localData, instructions: newInstructions });
  };

  const updateInstruction = (index: number, text: string) => {
    const newInstructions = localData.instructions.map((instr, i) => i === index ? text : instr);
    setLocalData({ ...localData, instructions: newInstructions });
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
            onClick={handleSave}
            disabled={saving || uploading || isPublishing}
            className={`bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-md ${(saving || uploading || isPublishing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {(saving || isPublishing) ? (
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
                  <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={localData.image} alt="Preview" className="w-full h-full object-contain" />
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
              {localData.services.map((service) => (
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
              {localData.instructions.map((instr, idx) => (
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
