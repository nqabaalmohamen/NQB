import React from 'react';
import { GraduationCap, Calendar, Users, Award, BookOpen } from 'lucide-react';

const Institute = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-4">معهد المحاماة بالفيوم</h1>
        <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          المركز التدريبي المتخصص لإعداد وتأهيل المحامين الجدد، وتقديم الدورات التخصصية في مختلف فروع القانون.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { title: 'دورات تأهيلية', icon: GraduationCap, count: '12 دورة سنوياً' },
          { title: 'محاضرون خبراء', icon: Users, count: 'نخبة من المستشارين' },
          { title: 'شهادات معتمدة', icon: Award, count: 'موثقة من النقابة العامة' },
          { title: 'مكتبة متخصصة', icon: BookOpen, count: 'مراجع حصرية' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{stat.title}</h3>
            <p className="text-secondary font-medium text-sm">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-secondary" /> الجدول الدراسي الحالي
          </h2>
          <div className="space-y-6">
            {[
              { subject: 'قانون الإجراءات الجنائية', date: 'الأحد - 4:00 مساءً', teacher: 'المستشار/ فلان الفلاني' },
              { subject: 'فن المرافعة والصياغة', date: 'الثلاثاء - 5:00 مساءً', teacher: 'الأستاذ/ علان العلاني' },
              { subject: 'القانون المدني والتطبيقات', date: 'الخميس - 4:00 مساءً', teacher: 'الدكتور/ فلان بن فلان' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-accent rounded-xl">
                <div>
                  <h4 className="font-bold text-primary">{item.subject}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.teacher}</p>
                </div>
                <span className="text-sm font-bold text-secondary">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary text-white p-10 rounded-3xl shadow-lg flex flex-col justify-center">
          <h2 className="text-3xl font-serif mb-6">شروط الالتحاق بالمعهد</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 bg-secondary rounded-full mt-2 shrink-0"></div>
              <span>أن يكون المحامي مقيداً بجدول المحامين الجدد بالفيوم.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 bg-secondary rounded-full mt-2 shrink-0"></div>
              <span>سداد الرسوم الدراسية المقررة في خزينة النقابة.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-2 w-2 bg-secondary rounded-full mt-2 shrink-0"></div>
              <span>الالتزام بنسبة حضور لا تقل عن 75% من المحاضرات.</span>
            </li>
          </ul>
          <button className="mt-10 bg-secondary text-primary font-bold py-4 rounded-xl hover:bg-white transition-all">
            سجل الآن في الدورة القادمة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Institute;
