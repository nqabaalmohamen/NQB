import initialData from './data.json';

export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  link: string;
  content?: string;
  date?: string;
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
  maintenanceMode: boolean;
  maintenanceEndTime?: string;
  githubToken?: string;
  githubRepo?: string;
  githubOwner?: string;
}
  isUnderMaintenance?: boolean;
  maintenanceMessage?: string;
  maintenanceFinishDate?: string;
}

export const initialSiteSettings: SiteSettings = initialData.siteSettings;
export const initialCarouselItems: CarouselItem[] = initialData.carouselItems;
export const initialNewsItems: NewsItem[] = initialData.newsItems;
export const initialCouncilMembers: CouncilMember[] = initialData.councilMembers;
export const initialForensicData: ForensicData = initialData.forensicData;
export const initialLibraryResources: LibraryResource[] = initialData.libraryResources;
export const initialInstituteData: InstituteData = initialData.instituteData;
