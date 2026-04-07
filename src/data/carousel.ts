export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  link: string;
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
  {
    id: 4,
    image: 'https://picsum.photos/seed/news4/1920/1080',
    title: 'ندوة تثقيفية حول حقوق المحامين وواجباتهم',
    link: '/news/lawyers-rights',
  },
];
