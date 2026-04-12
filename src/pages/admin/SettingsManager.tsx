import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, ShieldCheck, Github, Lock, Database, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

const SettingsManager = () => {
  const { settings, updateSettings } = useData();
  const [localSettings, setLocalSettings] = useState(settings);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const testConnection = async () => {
    if (!localSettings.githubToken || !localSettings.githubRepo || !localSettings.githubOwner) {
      alert('يرجى ملء كافة حقول GitHub أولاً');
      return;
    }

    setTesting(true);
    setTestStatus('idle');

    try {
      // Clean token before testing
      const token = localSettings.githubToken?.trim() || '';
      const cleanedToken = token.match(/(ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,})/)?.[0] 
        || token.replace(/^(token|bearer|github_pat)\s+/i, '').trim();

      const response = await fetch(
        `https://api.github.com/repos/${localSettings.githubOwner?.trim()}/${localSettings.githubRepo?.trim()}`,
        {
          headers: {
            'Authorization': `Bearer ${cleanedToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (response.ok) {
        setTestStatus('success');
        alert('تم الاتصال بنجاح! الـ Token والمستودع صحيحان.');
      } else {
        const err = await response.json();
        if (err.message === 'Bad credentials') {
          throw new Error('رمز الوصول (Token) غير صحيح أو انتهت صلاحيته. يرجى إنشاء Token جديد.');
        }
        throw new Error(err.message);
      }
    } catch (error: any) {
      setTestStatus('error');
      alert(`فشل الاتصال: ${error.message}`);
    } finally {
      setTesting(false);
    }
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

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-bold flex items-center gap-2 text-gray-700">
                <Globe className="h-5 w-5 text-primary" /> المعلومات الأساسية
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    اسم الموقع
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
                    البريد الإلكتروني للتواصل
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
                    رقم الهاتف
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
                    عنوان المقر
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

          {/* GitHub Sync Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden border-r-4 border-r-secondary">
            <div className="p-6 border-b border-gray-50 bg-secondary/5">
              <h2 className="font-bold flex items-center gap-2 text-primary">
                <Github className="h-5 w-5" /> إعدادات المزامنة مع GitHub (للنشر المباشر)
              </h2>
              <p className="text-xs text-gray-500 mt-1">هذه الإعدادات تسمح لك بنشر التعديلات فوراً لكافة الزوار</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-secondary" /> GitHub Token (PAT)
                  </label>
                  <input
                    type="password"
                    value={localSettings.githubToken || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, githubToken: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-left"
                    placeholder="ghp_xxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-secondary" /> Repository Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.githubRepo || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, githubRepo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-left"
                    placeholder="NQB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    GitHub Owner (Username)
                  </label>
                  <input
                    type="text"
                    value={localSettings.githubOwner || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, githubOwner: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-left"
                    placeholder="nqabaalmohamen"
                  />
                </div>
              </div>
              
              <div className="flex justify-start">
                <button
                  onClick={testConnection}
                  disabled={testing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    testStatus === 'success' 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : testStatus === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {testing ? <RefreshCw className="h-5 w-5 animate-spin" /> : 
                   testStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
                   testStatus === 'error' ? <XCircle className="h-5 w-5" /> :
                   <RefreshCw className="h-5 w-5" />}
                  {testing ? 'جاري التحقق...' : 
                   testStatus === 'success' ? 'الاتصال يعمل' :
                   testStatus === 'error' ? 'فشل الاتصال - أعد المحاولة' :
                   'اختبار صحة الاتصال بـ GitHub'}
                </button>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">ملاحظة هامة حول الأمان والمزامنة</h4>
                    <p className="text-xs text-blue-700 leading-relaxed mt-1">
                      يتم حفظ اسم المستودع والمالك تلقائياً لجميع الأجهزة. أما الـ <strong>GitHub Token</strong> فيجب إدخاله <strong>مرة واحدة فقط على كل جهاز جديد</strong> تستخدمه. هذا إجراء أمني لحماية موقعك من الاختراق، حيث يُمنع تقنياً حفظ "كلمة المرور" (Token) بشكل علني على الإنترنت.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a 
                    href="https://github.com/settings/tokens/new?scopes=repo&description=NQB-Admin-Panel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-3 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all shadow-sm"
                  >
                    <Lock className="h-4 w-4" />
                    اضغط هنا لإنشاء Token جديد (سريع)
                  </a>
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-3 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all shadow-sm"
                  >
                    <Github className="h-4 w-4" />
                    عرض التوكنات الحالية
                  </a>
                </div>
                <p className="text-[10px] text-blue-500 italic">
                  * ملاحظة: تأكد من تفعيل صلاحية (repo) عند إنشاء التوكن، وقم بنسخه فوراً لأنه لن يظهر مرة أخرى.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
