import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { initialSiteSettings, SiteSettings } from '../data/store';

const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // حفظ الرسالة محلياً للمسئول
    const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
      read: false
    };
    localStorage.setItem('contactMessages', JSON.stringify([newMessage, ...savedMessages]));

    const mailtoLink = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(formData.subject || 'رسالة من موقع نقابة المحامين')}&body=${encodeURIComponent(
      `الاسم: ${formData.name}\nرقم القيد: ${formData.idNumber}\nالبريد الإلكتروني: ${formData.email}\n\nالرسالة:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    alert('تم إرسال رسالتك بنجاح وسيتم التواصل معك قريباً');
    setFormData({ name: '', idNumber: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl font-serif mb-6">تواصل معنا</h1>
          <p className="text-gray-600 mb-12 leading-relaxed">
            نحن هنا للإجابة على استفساراتكم وتقديم الدعم اللازم. يسعدنا تواصلكم معنا من خلال القنوات التالية أو زيارة مقر النقابة.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-primary p-4 rounded-2xl shadow-lg">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">المقر الرئيسي</h3>
                <p className="text-gray-500">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-primary p-4 rounded-2xl shadow-lg">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">أرقام الهاتف</h3>
                <p className="text-gray-500">{settings.contactPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-primary p-4 rounded-2xl shadow-lg">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                <p className="text-gray-500">{settings.contactEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-8">أرسل لنا رسالة</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">الاسم بالكامل</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-accent border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">رقم القيد</label>
                <input 
                  type="text" 
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  className="w-full bg-accent border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-accent border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">موضوع الرسالة</label>
              <input 
                type="text" 
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-accent border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">الرسالة</label>
              <textarea 
                rows={4} 
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-accent border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary transition-all flex items-center justify-center gap-2">
              إرسال الرسالة <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
