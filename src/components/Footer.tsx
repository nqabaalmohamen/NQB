import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Scale } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white border-t-4 border-secondary pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white p-2 rounded-lg border border-secondary/30 shadow-sm">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-serif font-bold leading-none">نقابة المحامين</h3>
                <div className="flex items-center w-full gap-2 mt-1">
                  <div className="h-[1px] flex-grow bg-secondary/40"></div>
                  <span className="text-secondary text-xs font-serif font-bold">بالفيوم</span>
                  <div className="h-[1px] flex-grow bg-secondary/40"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              الموقع الرسمي لنقابة المحامين بالفيوم، نسعى لتقديم أفضل الخدمات الإلكترونية والمهنية للسادة المحامين وتطوير منظومة العمل النقابي.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-r-4 border-secondary pr-3">معلومات التواصل</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-secondary" />
                <span>الفيوم، شارع المحكمة، مجمع النقابات</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary" />
                <span>084-XXXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <span>moh602913@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-r-4 border-secondary pr-3">تابعنا على</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لنقابة المحامين بالفيوم</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
