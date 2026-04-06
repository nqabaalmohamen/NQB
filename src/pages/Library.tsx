import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, Search, Download, FileText, Scale, Filter, Eye, X } from 'lucide-react';

// Helper to normalize Arabic text for better searching
const normalizeArabic = (text: string) => {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u0652]/g, '') // Remove diacritics (Tashkeel)
    .toLowerCase()
    .trim();
};

// Helper component to highlight search terms
const HighlightedText = ({ text, query }: { text: string, query: string }) => {
  if (!query.trim()) return <>{text}</>;
  
  const normalizedQuery = normalizeArabic(query);
  const keywords = normalizedQuery.split(/\s+/).filter(k => k.length > 0);
  if (keywords.length === 0) return <>{text}</>;

  // To highlight correctly, we need to match the original text but based on normalized keywords
  // This is tricky with Arabic normalization, so we'll use a simpler approach for highlighting
  const pattern = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  // Note: Highlighting might be slightly off if normalization changes string length, 
  // but for Arabic (ا/أ/ة/ه) it usually stays the same length.
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(normalizeArabic(part)) || regex.test(part) ? (
          <mark key={i} className="bg-secondary/40 text-primary font-bold rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [readingDoc, setReadingDoc] = useState<any | null>(null);

  // Sync searchTerm with URL parameter
  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Update URL parameter when searchTerm changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Use replace: true to avoid flooding history
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const categories = ['الكل', 'قوانين أساسية', 'أحكام قضائية', 'كتب قانونية', 'تعليمات إدارية'];

  const resources = useMemo(() => [
    { 
      title: 'قانون المحاماة المصري', 
      type: 'PDF', 
      size: '2.4 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: المحاماة مهنة حرة تشارك السلطة القضائية في تحقيق العدالة وفي تأكيد سيادة القانون وفي كفالة حق الدفاع عن حقوق المواطنين وحرياتهم.
      ويمارس مهنة المحاماة المحامون وحدهم في استقلال ولا سلطان عليهم في ذلك إلا لضمائرهم وأحكام القانون.
      
      مادة ٢: يعد محامياً كل من يقيد بجداول المحامين التي تنظمها النقابة، ويتمتع بالحقوق والواجبات المنصوص عليها في هذا القانون.
      
      مادة ٣: للمحامين دون غيرهم حق الحضور عن ذوي الشأن أمام المحاكم وهيئات التحقيق واللجان ذات الاختصاص القضائي.`
    },
    { 
      title: 'قانون الإجراءات الجنائية', 
      type: 'PDF', 
      size: '3.1 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: لا يجوز توقيع عقوبة جنائية إلا بمقتضى قانون، ولا يجوز القبض على أي إنسان أو حبسه إلا في الأحوال المنصوص عليها قانوناً.
      
      مادة ٢: تباشر النيابة العامة الدعوى الجنائية وتتولى التحقيق في الجرائم، ولها سلطة تحريك الدعوى أمام المحاكم المختصة.
      
      مادة ٣: لكل شخص اتهم بجريمة الحق في أن يدافع عن نفسه أو يوكل محامياً للدفاع عنه في كافة مراحل التحقيق والمحاكمة.`
    },
    { 
      title: 'قانون المرافعات المدنية والتجارية', 
      type: 'PDF', 
      size: '2.9 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: تسري قوانين المرافعات على ما لم يكن قد فصل فيه من الدعاوى أو تم من الإجراءات قبل تاريخ العمل بها.
      
      مادة ٢: لا تقبل أي دعوى كما لا يقبل أي طلب أو دفع لا يكون لصاحبه فيه مصلحة قائمة يقرها القانون.
      
      مادة ٣: تختص المحاكم بالفصل في كافة المنازعات المدنية والتجارية إلا ما استثني بنص خاص.`
    },
    { 
      title: 'القانون المدني المصري', 
      type: 'PDF', 
      size: '4.5 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: تسري النصوص التشريعية على جميع المسائل التي تتناولها هذه النصوص في لفظها أو في فحواها.
      فإذا لم يوجد نص تشريعي يمكن تطبيقه، حكم القاضي بمقتضى العرف، فإذا لم يوجد، فبمقتضى مبادئ الشريعة الإسلامية، فإذا لم يوجد، فبمقتضى مبادئ القانون الطبيعي وقواعد العدالة.
      
      مادة ٢: لا يجوز إلغاء نص تشريعي إلا بتشريع لاحق ينص صراحة على هذا الإلغاء، أو يشتمل على نص يتعارض مع نص التشريع القديم.`
    },
    { 
      title: 'قانون العقوبات المصري', 
      type: 'PDF', 
      size: '3.8 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: تسري أحكام هذا القانون على كل من يرتكب في القطر المصري جريمة من الجرائم المنصوص عليها فيه.
      
      مادة ٢: الجرائم ثلاثة أنواع: جنايات، وجنح، ومخالفات.
      
      مادة ٣: الجنايات هي الجرائم المعاقب عليها بالإعدام، أو السجن المؤبد، أو السجن المشدد، أو السجن.`
    },
    { 
      title: 'قانون مجلس الدولة', 
      type: 'PDF', 
      size: '1.5 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: مجلس الدولة هيئة قضائية مستقلة، يختص دون غيره بالفصل في المنازعات الإدارية وفي الدعاوى التأديبية.
      
      مادة ٢: يتكون مجلس الدولة من: الجمعية العمومية، والمحكمة الإدارية العليا، ومحكمة القضاء الإداري، والمحاكم الإدارية، والمحاكم التأديبية، وهيئة مفوضي الدولة.`
    },
    { 
      title: 'موسوعة أحكام محكمة النقض (جنائي)', 
      type: 'Digital', 
      size: '120 MB', 
      category: 'أحكام قضائية',
      content: `مبدأ قانوني: القصد الجنائي في جريمة القتل العمد يقتضي اتجاه إرادة الجاني إلى إزهاق روح المجني عليه.
      
      مبدأ قانوني: الاعتراف الذي يعول عليه يجب أن يكون اختيارياً صادراً عن إرادة حرة ولا يشوبه أي إكراه مادي أو معنوي.`
    },
    { 
      title: 'موسوعة أحكام محكمة النقض (مدني)', 
      type: 'Digital', 
      size: '150 MB', 
      category: 'أحكام قضائية',
      content: `مبدأ قانوني: العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين أو للأسباب التي يقررها القانون.
      
      مبدأ قانوني: المسؤولية التقصيرية تقوم على أركان ثلاثة: الخطأ والضرر وعلاقة السببية بينهما.`
    },
    { 
      title: 'أحدث أحكام المحكمة الدستورية العليا', 
      type: 'PDF', 
      size: '5.2 MB', 
      category: 'أحكام قضائية',
      content: `حكم: عدم دستورية نص المادة (...) من القانون رقم (...) بشأن (...) لمخالفته مبدأ المساواة وتكافؤ الفرص المنصوص عليه في الدستور.`
    },
    { 
      title: 'كتاب دوري النيابة العامة 2023', 
      type: 'PDF', 
      size: '1.8 MB', 
      category: 'تعليمات إدارية',
      content: `تعليمات: يجب على أعضاء النيابة العامة سرعة التصرف في القضايا المتعلقة بحقوق المواطنين وحرياتهم، والالتزام بالضوابط القانونية في الحبس الاحتياطي.`
    },
    { 
      title: 'تعليمات الشهر العقاري والتوثيق', 
      type: 'PDF', 
      size: '1.2 MB', 
      category: 'تعليمات إدارية',
      content: `تعليمات: يراعى عند توثيق عقود البيع التأكد من تسلسل الملكية وسداد الرسوم المقررة قانوناً، والتحقق من شخصية المتعاقدين.`
    },
    { 
      title: 'دليل المحامي المبتدئ في المحاكم', 
      type: 'PDF', 
      size: '2.1 MB', 
      category: 'كتب قانونية',
      content: `نصيحة ١: احرص دائماً على الحضور في الموعد المحدد للجلسة والاطلاع المسبق على ملف الدعوى.
      
      نصيحة ٢: تنظيم مذكرات الدفاع بشكل منطقي يبدأ بالدفوع الشكلية ثم الموضوعية.`
    },
    { 
      title: 'شرح قانون الإثبات في المواد المدنية', 
      type: 'PDF', 
      size: '6.4 MB', 
      category: 'كتب قانونية',
      content: `القاعدة العامة: البينة على من ادعى واليمين على من أنكر.
      طرق الإثبات: الكتابة، شهادة الشهود، القرائن، الإقرار، اليمين، المعاينة.`
    },
    { 
      title: 'الوجيز في القانون الجنائي', 
      type: 'PDF', 
      size: '5.7 MB', 
      category: 'كتب قانونية',
      content: `تعريف الجريمة: هي كل فعل أو امتناع عن فعل يجرمه القانون ويقرر له عقوبة.
      أركان الجريمة: الركن الشرعي، الركن المادي، الركن المعنوي.`
    },
    { 
      title: 'قانون العمل الجديد ولائحته التنفيذية', 
      type: 'PDF', 
      size: '1.9 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: تسري أحكام هذا القانون على العاملين بالقطاع الخاص والشركات التابعة لقطاع الأعمال العام.
      
      مادة ٢: يحظر التمييز في الأجور بسبب اختلاف الجنس أو الأصل أو اللغة أو الدين أو العقيدة.`
    },
    { 
      title: 'قانون التأمينات الاجتماعية والمعاشات', 
      type: 'PDF', 
      size: '2.3 MB', 
      category: 'قوانين أساسية',
      content: `مادة ١: يشمل نظام التأمين الاجتماعي التأمينات الآتية: تأمين الشيخوخة والعجز والوفاة، تأمين إصابات العمل، تأمين المرض، تأمين البطالة.`
    },
    { 
      title: 'مجموعة المبادئ القانونية لمحكمة القضاء الإداري', 
      type: 'PDF', 
      size: '8.1 MB', 
      category: 'أحكام قضائية',
      content: `مبدأ: القرار الإداري يجب أن يقوم على سبب يبرره صدقاً وحقاً في الواقع والقانون.`
    },
    { 
      title: 'أصول الصياغة القانونية والمذكرات', 
      type: 'PDF', 
      size: '3.2 MB', 
      category: 'كتب قانونية',
      content: `قاعدة: الوضوح والدقة هما أهم ركائز الصياغة القانونية السليمة لتجنب التأويل أو التفسير الخاطئ.`
    },
  ], []);

  const filteredResources = useMemo(() => {
    const query = normalizeArabic(searchTerm);
    if (!query) return resources.filter(item => activeCategory === 'الكل' || item.category === activeCategory);

    const keywords = query.split(/\s+/).filter(k => k.length > 0);
    
    return resources.filter(item => {
      const searchableText = normalizeArabic(`${item.title} ${item.content} ${item.category}`);
      // Check if ALL keywords are present in the searchable text
      const matchesSearch = keywords.every(keyword => searchableText.includes(keyword));
      const matchesCategory = activeCategory === 'الكل' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, resources]);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    if (downloading) return;
    setDownloading(title);
    
    // Safety timer to ensure the spinner ALWAYS stops even if something fails
    const safetyTimer = setTimeout(() => {
      setDownloading(null);
    }, 3000);

    try {
      // Using a stable sample PDF URL that is known to work well
      const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      
      // Small delay before cleanup and stopping the spinner
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        clearTimeout(safetyTimer);
        setDownloading(null);
      }, 1000);
    } catch (error) {
      console.error("Download failed:", error);
      clearTimeout(safetyTimer);
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="bg-primary text-white p-12 rounded-3xl mb-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">المكتبة القانونية الرقمية</h1>
          <p className="text-gray-300 max-w-2xl mb-10 text-lg leading-relaxed">
            بوابة المعرفة القانونية الشاملة لنقابة المحامين بالفيوم، تضم مئات التشريعات، الكتب، والأبحاث القانونية المحدثة لخدمة الزملاء.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
            <div className="relative flex-grow">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="ابحث عن كتاب، قانون، أو حكم قضائي..." 
                className="w-full bg-white text-primary px-6 py-4 rounded-xl pr-14 focus:outline-none focus:ring-4 focus:ring-secondary/30 transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
        <Scale className="absolute -left-20 -bottom-20 h-96 w-96 text-white/5 rotate-12" />
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center gap-2 text-primary font-bold ml-4">
          <Filter className="h-5 w-5" />
          <span>التصنيف:</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full font-bold transition-all border-2 ${
              activeCategory === cat 
              ? 'bg-secondary border-secondary text-primary shadow-lg' 
              : 'bg-white border-gray-200 text-gray-500 hover:border-secondary hover:text-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Results Count */}
      {searchTerm.trim() && (
        <div className="mb-8 text-gray-500 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          تم العثور على <span className="text-primary font-bold">{filteredResources.length}</span> نتيجة للبحث عن "<span className="text-primary font-bold">{searchTerm}</span>"
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-4 rounded-xl group-hover:bg-primary transition-colors">
                  <FileText className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                    <HighlightedText text={item.title} query={searchTerm} />
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-secondary/20 text-primary px-2 py-0.5 rounded font-bold">
                      <HighlightedText text={item.category} query={searchTerm} />
                    </span>
                    <span className="text-xs text-gray-400">{item.type} • {item.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setReadingDoc(item)}
                  className="p-3 rounded-xl bg-accent text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  title="قراءة الملف"
                >
                  <Eye className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => handleDownload(item.title)}
                  disabled={downloading === item.title}
                  className={`p-3 rounded-xl transition-all shadow-sm ${
                    downloading === item.title 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed animate-pulse' 
                    : 'bg-accent text-primary hover:bg-secondary hover:text-white'
                  }`}
                  title="تحميل الملف"
                >
                  {downloading === item.title ? (
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              لم نجد أي مراجع تطابق بحثك "<span className="font-bold text-primary">{searchTerm}</span>". جرب استخدام كلمات مفتاحية أخرى أو تغيير التصنيف.
            </p>
            <button 
              onClick={() => {
                handleSearchChange('');
                setActiveCategory('الكل');
              }}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg"
            >
              إعادة ضبط البحث
            </button>
          </div>
        )}
      </div>

      {/* Request Section */}
      <div className="mt-20 bg-gradient-to-r from-primary to-primary/90 p-12 rounded-3xl text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <Book className="h-16 w-16 text-secondary mx-auto mb-6" />
          <h3 className="text-3xl font-serif font-bold mb-4">هل تبحث عن مرجع قانوني غير متوفر؟</h3>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            نحن نعمل باستمرار على تحديث مكتبتنا. إذا كنت بحاجة إلى كتاب أو قانون محدد، يرجى إرسال طلبك وسنقوم بتوفيره لك في أقرب وقت ممكن.
          </p>
          <Link to="/contact" className="bg-secondary text-primary px-12 py-4 rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl inline-block">
            إرسال طلب مرجع
          </Link>
        </div>
        <Scale className="absolute right-0 top-0 h-64 w-64 text-white/5 -rotate-12" />
      </div>

      {/* Reader Modal */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between bg-primary text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{readingDoc.title}</h3>
                  <p className="text-xs text-white/60">{readingDoc.category} • {readingDoc.size}</p>
                </div>
              </div>
              <button 
                onClick={() => setReadingDoc(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            {/* Modal Content - PDF Viewer Placeholder */}
            <div className="flex-grow bg-gray-100 p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto bg-white shadow-lg p-12 min-h-full rounded-lg">
                <div className="text-center mb-12 border-b-2 border-primary/20 pb-8">
                  <h2 className="text-3xl font-serif text-primary mb-4">{readingDoc.title}</h2>
                  <p className="text-gray-500">نقابة المحامين بالفيوم - المكتبة الرقمية</p>
                </div>
                
                <div className="space-y-6 text-right leading-loose text-gray-700">
                  <p className="font-bold text-xl text-primary underline decoration-secondary decoration-4 underline-offset-8">نص المستند:</p>
                  <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 whitespace-pre-wrap font-sans text-lg">
                    <HighlightedText text={readingDoc.content} query={searchTerm} />
                  </div>
                  
                  <div className="p-6 bg-accent/30 rounded-xl border-r-4 border-primary">
                    <p className="italic">ملاحظة: هذا النص هو ملخص لأهم المواد القانونية. يمكنك تحميل النسخة الكاملة بصيغة PDF عبر زر التحميل للحصول على النص الكامل والمحدث.</p>
                  </div>

                  <p>بناءً على أحكام القانون واللوائح المنظمة، نتشرف بتقديم هذا المرجع القانوني لخدمة الزملاء المحامين في محافظة الفيوم، سعياً منا لنشر الوعي القانوني وتسهيل الوصول للمعلومات.</p>
                  
                  <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
                    <div className="text-center">
                      <Book className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400">نهاية نسخة المعاينة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
              <button 
                onClick={() => {
                  handleDownload(readingDoc.title);
                  setReadingDoc(null);
                }}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                <Download className="h-5 w-5" />
                تحميل النسخة الكاملة
              </button>
              <button 
                onClick={() => setReadingDoc(null)}
                className="px-6 py-2 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
