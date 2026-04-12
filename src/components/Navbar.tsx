import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Scale, BookOpen, Users, Phone, Home, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useData } from '../context/DataContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { settings } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const siteNameParts = settings.siteName.split(' ');
  const mainName = siteNameParts.slice(0, 2).join(' ');
  const subName = siteNameParts.slice(2).join(' ');

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u0652]/g, '')
      .toLowerCase()
      .trim();
  };

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setIsSearchVisible(false);
    setSuggestions([]);
  }, [location]);

  useEffect(() => {
    const searchableItems = [
      'قانون المحاماة المصري',
      'قانون الإجراءات الجنائية',
      'قانون المرافعات المدنية والتجارية',
      'القانون المدني المصري',
      'قانون العقوبات المصري',
      'قانون مجلس الدولة',
      'موسوعة أحكام محكمة النقض',
      'كتاب دوري النيابة العامة',
      'معهد المحاماة',
      'الطب الشرعي',
      'مجلس النقابة'
    ];

    if (searchQuery.trim().length > 1) {
      const normalizedQuery = normalizeArabic(searchQuery);
      const filtered = searchableItems.filter(item => 
        normalizeArabic(item).includes(normalizedQuery)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { 
      name: 'الخدمات', 
      path: '#', 
      icon: Scale,
      dropdown: [
        { name: 'الطب الشرعي', path: '/forensic' },
        { name: 'معهد المحاماة', path: '/institute' },
      ]
    },
    { name: 'مجلس النقابة', path: '/council', icon: Users },
    { name: 'المكتبة القانونية', path: '/library', icon: BookOpen },
    { name: 'اتصل بنا', path: '/contact', icon: Phone },
  ];

  const handleSearch = (e: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = overrideQuery || searchQuery;
    if (!finalQuery.trim()) return;
    
    const query = normalizeArabic(finalQuery);
    
    // Specific navigation for services
    if (query.includes('طب') || query.includes('شرعي')) {
      navigate('/forensic');
    } else if (query.includes('معهد') || query.includes('تدريب')) {
      navigate('/institute');
    } else if (query.includes('مجلس') || query.includes('اعضاء')) {
      navigate('/council');
    } else if (query.includes('تواصل') || query.includes('اتصل')) {
      navigate('/contact');
    } else {
      // General search or library search - pass query to library page
      navigate(`/library?q=${encodeURIComponent(finalQuery)}`);
    }
    
    setSearchQuery('');
    setIsSearchVisible(false);
    setSuggestions([]);
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-2xl border-b-4 border-secondary" dir="rtl">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-row justify-between h-24 items-center">
          {/* Logo Section - Right side in RTL */}
          <Link to="/" className="flex items-center gap-2 md:gap-4 group">
            <div className="bg-primary text-white p-1.5 md:p-2.5 rounded-xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
              <Scale className="h-6 w-6 md:h-9 md:w-9 text-secondary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-3xl font-serif font-bold text-white tracking-tight leading-none whitespace-nowrap">
                {mainName}
              </span>
              {subName && (
                <div className="flex items-center w-full gap-2 mt-1">
                  <div className="h-[1px] flex-grow bg-secondary/30"></div>
                  <span className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-[0.15em] md:tracking-[0.25em] whitespace-nowrap">
                    {subName}
                  </span>
                  <div className="h-[1px] flex-grow bg-secondary/30"></div>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Menu - Left side in RTL */}
          <div className="hidden lg:flex items-center space-x-reverse space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <div 
                    className="flex items-center gap-1.5 cursor-pointer hover:text-secondary transition-all py-2 px-3 rounded-lg hover:bg-white/5"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="font-bold text-sm">{link.name}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", servicesOpen && "rotate-180")} />
                    
                    {/* Dropdown */}
                    <div className={cn(
                      "absolute top-full right-0 w-56 bg-white text-primary shadow-2xl rounded-xl border-t-4 border-secondary transition-all duration-300 origin-top mt-1 overflow-hidden z-50",
                      servicesOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                    )}>
                      {link.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-6 py-4 hover:bg-accent hover:text-secondary font-bold transition-colors border-b border-gray-100 last:border-0 text-right"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={link.path} 
                    className={cn(
                      "flex items-center gap-1.5 hover:text-secondary transition-all py-2 px-3 rounded-lg hover:bg-white/5 font-bold text-sm",
                      location.pathname === link.path && "text-secondary bg-white/10"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Search Button & Input */}
            <div className="relative flex items-center mr-4">
              <form onSubmit={handleSearch} className={cn(
                "flex items-center bg-white/10 rounded-full px-4 py-1.5 transition-all duration-500 border border-white/20",
                isSearchVisible ? "w-64 opacity-100" : "w-10 opacity-0 pointer-events-none overflow-hidden"
              )}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الموقع..."
                  className="bg-transparent border-0 text-white text-sm focus:ring-0 w-full placeholder:text-white/50 text-right"
                />
                <button type="submit" className="text-secondary hover:scale-110 transition-transform">
                  <Search className="h-4 w-4" />
                </button>

                {/* Desktop Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full right-0 w-full bg-white text-primary mt-2 rounded-xl shadow-2xl border-t-4 border-secondary overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {suggestions.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(null as any, item)}
                        className="w-full text-right px-4 py-3 hover:bg-accent hover:text-secondary transition-colors font-bold text-sm border-b border-gray-100 last:border-0"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </form>
              <button 
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={cn(
                  "p-2 rounded-full hover:bg-white/10 transition-colors",
                  isSearchVisible && "hidden"
                )}
              >
                <Search className="h-5 w-5 text-secondary" />
              </button>
            </div>
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsSearchVisible(!isSearchVisible)} className="p-2 text-secondary">
              <Search className="h-6 w-6" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 w-full bg-primary/95 backdrop-blur-md border-b border-secondary transition-all duration-300",
        isSearchVisible ? "max-h-[50vh] py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن الخدمات، المكتبة، أو المجلس..."
              className="flex-grow bg-white/10 border-white/20 rounded-lg text-white px-4 py-2 focus:ring-secondary"
            />
            <button type="submit" className="bg-secondary text-primary px-4 rounded-lg font-bold">
              بحث
            </button>
          </form>

          {suggestions.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(null as any, item)}
                  className="w-full text-right px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("lg:hidden bg-primary/98 backdrop-blur-lg border-t border-white/5 transition-all duration-500 ease-in-out overflow-hidden", isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0")}>
        <div className="px-4 pt-4 pb-8 space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <>
                  <button 
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full text-right px-4 py-3 flex justify-between items-center hover:bg-white/5 rounded-xl font-bold"
                  >
                    <span className="flex items-center gap-3 text-lg"><link.icon className="h-5 w-5 text-secondary" /> {link.name}</span>
                    <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", servicesOpen && "rotate-180")} />
                  </button>
                  <div className={cn("bg-white/5 rounded-xl mt-2 space-y-1 transition-all duration-300", servicesOpen ? "max-h-40 py-2" : "max-h-0 overflow-hidden")}>
                    {link.dropdown.map((sub) => (
                      <Link key={sub.name} to={sub.path} className="block px-12 py-3 text-base hover:text-secondary font-medium">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link to={link.path} className="block px-4 py-3 flex items-center gap-3 hover:bg-white/5 rounded-xl font-bold text-lg">
                  <link.icon className={cn("h-5 w-5", location.pathname === link.path ? "text-secondary" : "text-secondary/70")} /> 
                  <span className={cn(location.pathname === link.path && "text-secondary")}>{link.name}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
