import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  NewsItem, 
  CarouselItem, 
  CouncilMember, 
  LibraryResource, 
  ForensicData, 
  InstituteData, 
  SiteSettings,
  initialNewsItems,
  initialCarouselItems,
  initialCouncilMembers,
  initialLibraryResources,
  initialForensicData,
  initialInstituteData,
  initialSiteSettings
} from '../data/store';

interface DataContextType {
  news: NewsItem[];
  carousel: CarouselItem[];
  members: CouncilMember[];
  resources: LibraryResource[];
  forensic: ForensicData;
  institute: InstituteData;
  settings: SiteSettings;
  messages: any[];
  
  updateNews: (items: NewsItem[]) => void;
  updateCarousel: (items: CarouselItem[]) => void;
  updateMembers: (items: CouncilMember[]) => void;
  updateResources: (items: LibraryResource[]) => void;
  updateForensic: (data: ForensicData) => void;
  updateInstitute: (data: InstituteData) => void;
  updateSettings: (settings: SiteSettings) => void;
  updateMessages: (messages: any[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>(initialNewsItems);
  const [carousel, setCarousel] = useState<CarouselItem[]>(initialCarouselItems);
  const [members, setMembers] = useState<CouncilMember[]>(initialCouncilMembers);
  const [resources, setResources] = useState<LibraryResource[]>(initialLibraryResources);
  const [forensic, setForensic] = useState<ForensicData>(initialForensicData);
  const [institute, setInstitute] = useState<InstituteData>(initialInstituteData);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const loadFromStorage = () => {
      const savedNews = localStorage.getItem('newsItems');
      const savedCarousel = localStorage.getItem('carouselItems');
      const savedMembers = localStorage.getItem('councilMembers');
      const savedResources = localStorage.getItem('libraryResources');
      const savedForensic = localStorage.getItem('forensicData');
      const savedInstitute = localStorage.getItem('instituteData');
      const savedSettings = localStorage.getItem('siteSettings');
      const savedMessages = localStorage.getItem('contactMessages');

      if (savedNews) setNews(JSON.parse(savedNews));
      if (savedCarousel) setCarousel(JSON.parse(savedCarousel));
      if (savedMembers) setMembers(JSON.parse(savedMembers));
      if (savedResources) setResources(JSON.parse(savedResources));
      if (savedForensic) setForensic(JSON.parse(savedForensic));
      if (savedInstitute) setInstitute(JSON.parse(savedInstitute));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    };

    loadFromStorage();
    window.addEventListener('storage', loadFromStorage);
    return () => window.removeEventListener('storage', loadFromStorage);
  }, []);

  const updateNews = (items: NewsItem[]) => {
    setNews(items);
    localStorage.setItem('newsItems', JSON.stringify(items));
  };

  const updateCarousel = (items: CarouselItem[]) => {
    setCarousel(items);
    localStorage.setItem('carouselItems', JSON.stringify(items));
  };

  const updateMembers = (items: CouncilMember[]) => {
    setMembers(items);
    localStorage.setItem('councilMembers', JSON.stringify(items));
  };

  const updateResources = (items: LibraryResource[]) => {
    setResources(items);
    localStorage.setItem('libraryResources', JSON.stringify(items));
  };

  const updateForensic = (data: ForensicData) => {
    setForensic(data);
    localStorage.setItem('forensicData', JSON.stringify(data));
  };

  const updateInstitute = (data: InstituteData) => {
    setInstitute(data);
    localStorage.setItem('instituteData', JSON.stringify(data));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };

  const updateMessages = (newMessages: any[]) => {
    setMessages(newMessages);
    localStorage.setItem('contactMessages', JSON.stringify(newMessages));
  };

  return (
    <DataContext.Provider value={{
      news, carousel, members, resources, forensic, institute, settings, messages,
      updateNews, updateCarousel, updateMembers, updateResources, updateForensic, updateInstitute, updateSettings, updateMessages
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
