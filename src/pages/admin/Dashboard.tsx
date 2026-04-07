import { Link, useNavigate } from 'react-router-dom';
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
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const stats = [
    { title: 'إجمالي الأخبار', value: '24', icon: Newspaper, color: 'bg-blue-500' },
    { title: 'صور السلايدر', value: '4', icon: ImageIcon, color: 'bg-green-500' },
    { title: 'طلبات الانضمام', value: '12', icon: Users, color: 'bg-purple-500' },
    { title: 'رسائل التواصل', value: '8', icon: MessageSquare, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col shadow-2xl shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold">لوحة التحكم</h2>
          <p className="text-white/60 text-xs mt-1">نقابة المحامين بالفيوم</p>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-2">
          {[
            { name: 'الرئيسية', icon: LayoutDashboard, active: true, path: '/admin/dashboard' },
            { name: 'إدارة السلايدر', icon: ImageIcon, path: '/admin/carousel' },
            { name: 'إدارة الأخبار', icon: Newspaper, path: '/admin/news' },
            { name: 'إدارة المجلس', icon: Users, path: '/admin/council' },
            { name: 'التنبيهات', icon: Bell, path: '/admin/notifications' },
            { name: 'الإعدادات', icon: Settings, path: '/admin/settings' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                item.active ? 'bg-secondary text-primary shadow-lg' : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-white/10">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-bold text-sm"
          >
            <Globe className="h-5 w-5" />
            العودة للموقع
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-200 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
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

            <button className="flex items-center justify-between p-6 bg-accent rounded-xl border border-gray-100 hover:border-secondary transition-all group">
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
            </button>

            <button className="flex items-center justify-between p-6 bg-accent rounded-xl border border-gray-100 hover:border-secondary transition-all group">
              <div className="flex items-center gap-4 text-right">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">تحديث المجلس</h4>
                  <p className="text-gray-500 text-xs mt-1">تعديل بيانات أعضاء المجلس</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:translate-x-[-5px] transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
