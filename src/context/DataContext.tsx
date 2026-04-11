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

const loadInitialData = async () => {
  try {
    // Try to fetch the latest data from GitHub first to ensure sync
    const savedSettings = localStorage.getItem('siteSettings');
    let settings = savedSettings ? JSON.parse(savedSettings) : initialSiteSettings;

    if (settings.githubToken && settings.githubRepo && settings.githubOwner) {
      const response = await fetch(
        `https://raw.githubusercontent.com/${settings.githubOwner}/${settings.githubRepo}/main/src/data/data.json?t=${Date.now()}`
      );
      if (response.ok) {
        const remoteData = await response.json();
        // Merge remote data with local messages and preserve local GitHub settings
        const localMessages = localStorage.getItem('contactMessages');
        return {
          ...remoteData,
          settings: {
            ...remoteData.siteSettings,
            githubToken: settings.githubToken,
            githubRepo: settings.githubRepo,
            githubOwner: settings.githubOwner
          },
          messages: localMessages ? JSON.parse(localMessages) : remoteData.contactMessages || []
        };
      }
    }
  } catch (e) {
    console.error('Failed to sync with GitHub, using local data');
  }

  const savedNews = localStorage.getItem('newsItems');
  const savedCarousel = localStorage.getItem('carouselItems');
  const savedMembers = localStorage.getItem('councilMembers');
  const savedResources = localStorage.getItem('libraryResources');
  const savedForensic = localStorage.getItem('forensicData');
  const savedInstitute = localStorage.getItem('instituteData');
  const savedSettings = localStorage.getItem('siteSettings');
  const savedMessages = localStorage.getItem('contactMessages');

  return {
    news: savedNews ? JSON.parse(savedNews) : initialNewsItems,
    carousel: savedCarousel ? JSON.parse(savedCarousel) : initialCarouselItems,
    members: savedMembers ? JSON.parse(savedMembers) : initialCouncilMembers,
    resources: savedResources ? JSON.parse(savedResources) : initialLibraryResources,
    forensic: savedForensic ? JSON.parse(savedForensic) : initialForensicData,
    institute: savedInstitute ? JSON.parse(savedInstitute) : initialInstituteData,
    settings: savedSettings ? JSON.parse(savedSettings) : initialSiteSettings,
    messages: savedMessages ? JSON.parse(savedMessages) : [],
  };
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    news: initialNewsItems,
    carousel: initialCarouselItems,
    members: initialCouncilMembers,
    resources: initialLibraryResources,
    forensic: initialForensicData,
    institute: initialInstituteData,
    settings: initialSiteSettings,
    messages: [],
  });

  useEffect(() => {
    const init = async () => {
      const data = await loadInitialData();
      setState(data);
    };
    init();

    const syncWithStorage = async () => {
      const data = await loadInitialData();
      setState(data);
    };

    window.addEventListener('storage', syncWithStorage);
    return () => window.removeEventListener('storage', syncWithStorage);
  }, []);

  const updateNews = (items: NewsItem[]) => {
    setState(prev => ({ ...prev, news: items }));
    localStorage.setItem('newsItems', JSON.stringify(items));
  };

  const updateCarousel = (items: CarouselItem[]) => {
    setState(prev => ({ ...prev, carousel: items }));
    localStorage.setItem('carouselItems', JSON.stringify(items));
  };

  const updateMembers = (items: CouncilMember[]) => {
    setState(prev => ({ ...prev, members: items }));
    localStorage.setItem('councilMembers', JSON.stringify(items));
  };

  const updateResources = (items: LibraryResource[]) => {
    setState(prev => ({ ...prev, resources: items }));
    localStorage.setItem('libraryResources', JSON.stringify(items));
  };

  const updateForensic = (data: ForensicData) => {
    setState(prev => ({ ...prev, forensic: data }));
    localStorage.setItem('forensicData', JSON.stringify(data));
  };

  const updateInstitute = (data: InstituteData) => {
    setState(prev => ({ ...prev, institute: data }));
    localStorage.setItem('instituteData', JSON.stringify(data));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setState(prev => ({ ...prev, settings: newSettings }));
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };

  const updateMessages = (newMessages: any[]) => {
    setState(prev => ({ ...prev, messages: newMessages }));
    localStorage.setItem('contactMessages', JSON.stringify(newMessages));
  };

  const clearAllData = () => {
    if (window.confirm('سيتم مسح كافة التعديلات والعودة للبيانات الاصلية، هل أنت متأكد؟')) {
      localStorage.clear();
      setState(loadInitialData());
      window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{
      ...state,
      updateNews, updateCarousel, updateMembers, updateResources, updateForensic, updateInstitute, updateSettings, updateMessages,
      clearAllData
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
