import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

const SettingsManager = () => {
  const { settings, updateSettings } = useData();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">إعدادات الموقع العامة</h1>
            <p className="text-gray-500 mt-1">تحديث معلومات التواصل والبيانات الأساسية للنقابة</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
          >
            <Save className="h-5 w-5" /> حفظ الإعدادات
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> اسم الموقع
                </label>
                <input
                  type="text"
                  value={localSettings.siteName}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> البريد الإلكتروني للتواصل
                </label>
                <input
                  type="email"
                  value={localSettings.contactEmail}
                  onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-left"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> رقم الهاتف
                </label>
                <input
                  type="text"
                  value={localSettings.contactPhone}
                  onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-left"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> عنوان المقر
                </label>
                <input
                  type="text"
                  value={localSettings.address}
                  onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> نص التذييل (Footer)
              </label>
              <textarea
                value={localSettings.footerText}
                onChange={(e) => setLocalSettings({ ...localSettings, footerText: e.target.value })}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
