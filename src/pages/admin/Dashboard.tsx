import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Newspaper, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Bell,
  MessageSquare,
  Globe,
  ShieldAlert,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Download,
  AlertTriangle,
  RefreshCw,
  Trash2,
  CloudUpload,
  CheckCircle2
} from 'lucide-react';

import { useData } from '../../context/DataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    news, 
    carousel, 
    members, 
    resources, 
    forensic, 
    institute, 
    settings, 
    messages, 
    clearAllData,
    publishToGithub,
    isPublishing: globalPublishing 
  } = useData();
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const stats = [
    { title: 'إجمالي الأخبار', value: news.length.toString(), icon: Newspaper, color: 'bg-blue-500' },
    { title: 'صور السلايدر', value: carousel.length.toString(), icon: ImageIcon, color: 'bg-green-500' },
    { title: 'أعضاء المجلس', value: members.length.toString(), icon: Users, color: 'bg-purple-500' },
    { title: 'المصادر المكتبية', value: resources.length.toString(), icon: BookOpen, color: 'bg-orange-500' },
  ];

  const handlePublish = async () => {
    if (globalPublishing) return;
    
    if (!settings.githubToken || !settings.githubRepo || !settings.githubOwner) {
      alert('يرجى ضبط إعدادات GitHub في صفحة الإعدادات العامة أولاً لتتمكن من النشر');
      navigate('/admin/settings');
      return;
    }

    setPublishing(true);
    setPublishStatus('loading');

    try {
      const success = await publishToGithub();
      if (success) {
        setPublishStatus('success');
        // Clear local storage overrides after successful publish to sync with remote
        const keysToClear = [
          'newsItems', 'carouselItems', 'councilMembers', 
          'libraryResources', 'forensicData', 'instituteData'
        ];
        keysToClear.forEach(key => localStorage.removeItem(key));
        
        // Force reload data from GitHub
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setPublishStatus('error');
      }
    } catch (error: any) {
      console.error('Publish error:', error);
      setPublishStatus('error');
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishStatus('idle'), 5000);
    }
  };

  const handleExportData = () => {
    const data = {
      newsItems: news,
      carouselItems: carousel,
      councilMembers: members,
      libraryResources: resources,
      forensicData: forensic,
      instituteData: institute,
      siteSettings: settings,
      contactMessages: messages,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nqb-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold font-serif tracking-tight">لوحة التحكم</span>
          </div>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {[
            { name: 'الرئيسية', icon: LayoutDashboard, path: '/admin/dashboard' },
            { name: 'السلايدر', icon: ImageIcon, path: '/admin/carousel' },
            { name: 'الأخبار', icon: Newspaper, path: '/admin/news' },
            { name: 'أعضاء المجلس', icon: Users, path: '/admin/council' },
            { name: 'المكتبة', icon: BookOpen, path: '/admin/library' },
            { name: 'الطب الشرعي', icon: ShieldAlert, path: '/admin/forensic' },
            { name: 'إدارة المعهد', icon: GraduationCap, path: '/admin/institute' },
            { name: 'رسائل التواصل', icon: MessageSquare, path: '/admin/messages' },
            { name: 'الإعدادات العامة', icon: Settings, path: '/admin/settings' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-secondary text-primary font-bold shadow-lg' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4">
          <button 
            onClick={clearAllData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all border border-red-500/30"
          >
            <Trash2 className="h-5 w-5" />
            <span>مسح كافة التعديلات</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800">مرحباً بك، أيها المسئول</h1>
            <p className="text-gray-500 mt-1">هنا يمكنك إدارة محتوى الموقع وتحديث البيانات</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-white rounded-full shadow-md text-gray-400 hover:text-primary transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <div className="w-12 h-12 rounded-full bg-secondary text-primary font-bold flex items-center justify-center shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Export & Publish Banners */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* GitHub Publish Banner */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
                  <CloudUpload className="h-8 w-8 text-secondary animate-bounce" />
                  نشر التحديثات للجمهور
                </h2>
                <p className="text-green-50/80 text-sm leading-relaxed mb-6">
                  هذا الخيار سيقوم برفع كافة تعديلاتك (صور، أخبار، إعدادات) مباشرة إلى الموقع الرسمي ليراها كافة الزوار فوراً.
                </p>
              </div>
              <button 
                onClick={handlePublish}
                disabled={publishing || globalPublishing}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                  publishStatus === 'success' 
                  ? 'bg-white text-green-600' 
                  : 'bg-secondary text-primary hover:bg-white'
                }`}
              >
                {(publishing || globalPublishing) ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : publishStatus === 'success' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <CloudUpload className="h-6 w-6" />
                )}
                <span>
                  {(publishing || globalPublishing) ? 'جاري النشر...' : publishStatus === 'success' ? 'تم النشر بنجاح' : 'انشر الموقع للجميع الآن'}
                </span>
              </button>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
          </div>

          {/* Export Data Banner */}
          <div className="bg-gradient-to-br from-primary to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
                  <Download className="h-8 w-8 text-secondary" />
                  نسخة احتياطية (JSON)
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  يفضل دائماً تحميل نسخة احتياطية من بياناتك قبل النشر، أو لإرسالها للمطور في حال واجهت أي مشكلة تقنية.
                </p>
              </div>
              <button 
                onClick={handleExportData}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
              >
                <Download className="h-6 w-6" />
                تصدير كافة البيانات
              </button>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-green-500 text-xs font-bold">+12%</span>
              </div>
              <p className="text-gray-500 text-sm font-bold">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/admin/carousel" className="flex items-center justify-between p-6 bg-accent rounded-xl border border-gray-100 hover:border-secondary transition-all group">
              <div className="flex items-center gap-4 text-right">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <ImageIcon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">إدارة السلايدر</h4>
                  <p className="text-gray-500 text-xs mt-1">تحديث صور الصفحة الرئيسية</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:translate-x-[-5px] transition-transform" />
            </Link>

            <Link to="/admin/news" className="flex items-center justify-between p-6 bg-accent rounded-xl border border-gray-100 hover:border-secondary transition-all group">
              <div className="flex items-center gap-4 text-right">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Newspaper className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">نشر خبر جديد</h4>
                  <p className="text-gray-500 text-xs mt-1">مشاركة آخر التنبيهات والأخبار</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:translate-x-[-5px] transition-transform" />
            </Link>

            <Link to="/admin/messages" className="flex items-center justify-between p-6 bg-accent rounded-xl border border-gray-100 hover:border-secondary transition-all group">
              <div className="flex items-center gap-4 text-right">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">رسائل التواصل</h4>
                  <p className="text-gray-500 text-xs mt-1">عرض والرد على رسائل المحامين</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:translate-x-[-5px] transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
