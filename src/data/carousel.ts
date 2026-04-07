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

export const initialCarouselItems: CarouselItem[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/news1/1920/1080',
    title: 'إعلان هام بخصوص تجديد الكارنيهات لعام 2024',
    link: '/news/renewal-2024',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/news2/1920/1080',
    title: 'ورشة عمل حول آخر التعديلات القانونية في قانون العمل',
    link: '/news/labor-law-workshop',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/news3/1920/1080',
    title: 'افتتاح الدورة التدريبية الجديدة لمعهد المحاماة',
    link: '/institute',
  },
];

export const initialNewsItems: NewsItem[] = [
  {
    id: 1,
    title: 'إعلان هام بخصوص تجديد الكارنيهات لعام 2024',
    content: 'تعلن نقابة المحامين بالفيوم عن بدء إجراءات تجديد العضوية السنوية وتوفير منافذ جديدة لتسهيل الإجراءات...',
    date: '15 مارس 2024',
    image: 'https://picsum.photos/seed/news1/600/400'
  },
  {
    id: 2,
    title: 'مواعيد العمل بمقر النقابة خلال شهر رمضان المبارك',
    content: 'نهنئ السادة المحامين بقرب حلول شهر رمضان المبارك، ونود إعلامكم بمواعيد العمل الرسمية...',
    date: '10 مارس 2024',
    image: 'https://picsum.photos/seed/news2/600/400'
  },
  {
    id: 3,
    title: 'توفير خدمات صحية جديدة لأعضاء النقابة وأسرهم',
    content: 'تم التعاقد مع مجموعة جديدة من المستشفيات ومعامل التحاليل لتقديم خدمات متميزة بخصومات خاصة...',
    date: '5 مارس 2024',
    image: 'https://picsum.photos/seed/news3/600/400'
  }
];

export const initialCouncilMembers: CouncilMember[] = [
  { id: 1, name: 'الأستاذ/ حازم طه', role: 'نقيب محامين الفيوم', image: 'https://picsum.photos/seed/person1/300/300' },
  { id: 2, name: 'الأستاذ/ وكيل النقابة', role: 'وكيل أول النقابة', image: 'https://picsum.photos/seed/person2/300/300' },
  { id: 3, name: 'الأستاذ/ أمين الصندوق', role: 'أمين الصندوق', image: 'https://picsum.photos/seed/person3/300/300' },
];
