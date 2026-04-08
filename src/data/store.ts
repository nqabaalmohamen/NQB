export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  link: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
}

export interface CouncilMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface ForensicService {
  id: number;
  title: string;
}

export interface ForensicData {
  title: string;
  description: string;
  image: string;
  services: ForensicService[];
  instructions: string[];
}

export interface LibraryResource {
  id: number;
  title: string;
  type: string;
  size: string;
  category: string;
  content: string;
}

export interface InstituteData {
  title: string;
  description: string;
  image: string;
  features: string[];
  requirements: string[];
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerText: string;
}

export const initialSiteSettings: SiteSettings = {
  siteName: 'نقابة المحامين بالفيوم',
  contactEmail: 'info@fayoumlawyers.org',
  contactPhone: '084-1234567',
  address: 'الفيوم - شارع المحكمة - مبنى نقابة المحامين',
  footerText: `جميع الحقوق محفوظة © ${new Date().getFullYear()} نقابة المحامين بالفيوم`
};

export const initialCarouselItems: CarouselItem[] = [
  { id: 1, image: 'https://picsum.photos/seed/news1/1920/1080', title: 'إعلان هام بخصوص تجديد الكارنيهات لعام 2024', link: '/news/renewal-2024' },
  { id: 2, image: 'https://picsum.photos/seed/news2/1920/1080', title: 'ورشة عمل حول آخر التعديلات القانونية في قانون العمل', link: '/news/labor-law-workshop' },
  { id: 3, image: 'https://picsum.photos/seed/news3/1920/1080', title: 'افتتاح الدورة التدريبية الجديدة لمعهد المحاماة', link: '/institute' },
];

export const initialNewsItems: NewsItem[] = [
  { id: 1, title: 'إعلان هام بخصوص تجديد الكارنيهات لعام 2024', content: 'تعلن نقابة المحامين بالفيوم عن بدء إجراءات تجديد العضوية السنوية وتوفير منافذ جديدة لتسهيل الإجراءات...', date: '15 مارس 2024', image: 'https://picsum.photos/seed/news1/600/400' },
  { id: 2, title: 'مواعيد العمل بمقر النقابة خلال شهر رمضان المبارك', content: 'نهنئ السادة المحامين بقرب حلول شهر رمضان المبارك، ونود إعلامكم بمواعيد العمل الرسمية...', date: '10 مارس 2024', image: 'https://picsum.photos/seed/news2/600/400' },
];

export const initialCouncilMembers: CouncilMember[] = [
  { id: 1, name: 'الأستاذ/ حازم طه', role: 'نقيب محامين الفيوم', image: 'https://picsum.photos/seed/person1/300/300' },
  { id: 2, name: 'الأستاذ/ وكيل النقابة', role: 'وكيل أول النقابة', image: 'https://picsum.photos/seed/person2/300/300' },
];

export const initialForensicData: ForensicData = {
  title: 'التنسيق مع مصلحة الطب الشرعي',
  description: 'تقدم نقابة المحامين بالفيوم خدمة التنسيق المباشر مع مصلحة الطب الشرعي لتسهيل إجراءات السادة المحامين في القضايا التي تتطلب تقارير فنية، وضمان سرعة الإنجاز والدقة.',
  image: 'https://picsum.photos/seed/medical/800/600',
  services: [
    { id: 1, title: 'طلب تقرير فني' },
    { id: 2, title: 'متابعة حالة الطلب' },
    { id: 3, title: 'استشارات فنية' },
    { id: 4, title: 'تظلمات التقارير' }
  ],
  instructions: [
    'يجب إرفاق صورة من توكيل المحامي ساري المفعول.',
    'يتم تقديم الطلبات في مقر النقابة الفرعية من الساعة 10 صباحاً.',
    'الرسوم المقررة يتم سدادها في خزينة النقابة بفيصل.'
  ]
};

export const initialLibraryResources: LibraryResource[] = [
  { id: 1, title: 'قانون المحاماة المصري', type: 'PDF', size: '2.4 MB', category: 'قوانين أساسية', content: 'محتوى قانون المحاماة...' },
  { id: 2, title: 'قانون الإجراءات الجنائية', type: 'PDF', size: '3.1 MB', category: 'قوانين أساسية', content: 'محتوى قانون الإجراءات...' },
];

export const initialInstituteData: InstituteData = {
  title: 'معهد المحاماة بالفيوم',
  description: 'يعد معهد المحاماة صرحاً تعليمياً يهدف إلى إعداد جيل جديد من المحامين القادرين على ممارسة المهنة بكفاءة واقتدار، من خلال محاضرات نظرية وتدريبات عملية يشرف عليها نخبة من كبار المحامين والقضاة.',
  image: 'https://picsum.photos/seed/study/800/600',
  features: [
    'محاضرات دورية في كافة أفرع القانون.',
    'تدريب عملي على صياغة المذكرات والعقود.',
    'ورش عمل حول فن المرافعات.'
  ],
  requirements: [
    'أن يكون المتقدم مقيداً بجدول العام.',
    'سداد الرسوم المقررة للمعهد.',
    'الالتزام بنسبة حضور لا تقل عن 75%.'
  ]
};
