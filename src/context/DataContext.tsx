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
  publishToGithub: (customData?: any) => Promise<boolean>;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
};

const loadInitialData = async () => {
  try {
    // 1. Load basic settings first to get GitHub info
    let settings = safeParse('siteSettings', initialSiteSettings);

    const ghToken = localStorage.getItem('gh_token');
    const ghRepo = localStorage.getItem('gh_repo');
    const ghOwner = localStorage.getItem('gh_owner');

    if (ghToken) settings.githubToken = ghToken;
    if (ghRepo) settings.githubRepo = ghRepo;
    if (ghOwner) settings.githubOwner = ghOwner;

    // 2. Try to fetch the latest data from GitHub
    if (settings.githubToken && settings.githubRepo && settings.githubOwner) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${settings.githubOwner}/${settings.githubRepo}/main/src/data/data.json?t=${Date.now()}`,
          { cache: 'no-store' }
        );
        
        if (response.ok) {
          const remoteData = await response.json();
          
          // Sync remote data to localStorage to prevent future white screens
          if (remoteData.newsItems) localStorage.setItem('newsItems', JSON.stringify(remoteData.newsItems));
          if (remoteData.carouselItems) localStorage.setItem('carouselItems', JSON.stringify(remoteData.carouselItems));
          if (remoteData.councilMembers) localStorage.setItem('councilMembers', JSON.stringify(remoteData.councilMembers));
          if (remoteData.libraryResources) localStorage.setItem('libraryResources', JSON.stringify(remoteData.libraryResources));
          if (remoteData.forensicData) localStorage.setItem('forensicData', JSON.stringify(remoteData.forensicData));
          if (remoteData.instituteData) localStorage.setItem('instituteData', JSON.stringify(remoteData.instituteData));
          if (remoteData.siteSettings) localStorage.setItem('siteSettings', JSON.stringify(remoteData.siteSettings));

          const localMessages = safeParse('contactMessages', []);
          
          return {
            news: remoteData.newsItems || initialNewsItems,
            carousel: remoteData.carouselItems || initialCarouselItems,
            members: remoteData.councilMembers || initialCouncilMembers,
            resources: remoteData.libraryResources || initialLibraryResources,
            forensic: remoteData.forensicData || initialForensicData,
            institute: remoteData.instituteData || initialInstituteData,
            settings: {
              ...(remoteData.siteSettings || initialSiteSettings),
              githubToken: ghToken || (remoteData.siteSettings && remoteData.siteSettings.githubToken),
              githubRepo: ghRepo || (remoteData.siteSettings && remoteData.siteSettings.githubRepo),
              githubOwner: ghOwner || (remoteData.siteSettings && remoteData.siteSettings.githubOwner)
            },
            messages: localMessages
          };
        }
      } catch (fetchError) {
        console.error('Fetch from GitHub failed:', fetchError);
      }
    }
  } catch (e) {
    console.error('Critical error in loadInitialData:', e);
  }

  // 3. Fallback to localStorage or Initial Data if GitHub fetch fails
  const ghTokenFinal = localStorage.getItem('gh_token');
  const ghRepoFinal = localStorage.getItem('gh_repo');
  const ghOwnerFinal = localStorage.getItem('gh_owner');

  let finalSettings = safeParse('siteSettings', initialSiteSettings);
  if (ghTokenFinal) finalSettings.githubToken = ghTokenFinal;
  if (ghRepoFinal) finalSettings.githubRepo = ghRepoFinal;
  if (ghOwnerFinal) finalSettings.githubOwner = ghOwnerFinal;

  return {
    news: safeParse('newsItems', initialNewsItems),
    carousel: safeParse('carouselItems', initialCarouselItems),
    members: safeParse('councilMembers', initialCouncilMembers),
    resources: safeParse('libraryResources', initialLibraryResources),
    forensic: safeParse('forensicData', initialForensicData),
    institute: safeParse('instituteData', initialInstituteData),
    settings: finalSettings,
    messages: safeParse('contactMessages', []),
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

  const publishToGithub = async (customData?: any) => {
    const settings = state.settings;
    if (!settings.githubToken || !settings.githubRepo || !settings.githubOwner) {
      console.error('GitHub settings are missing');
      return false;
    }

    try {
      // Security: Only exclude the Token from being published to GitHub.
      // Owner and Repo name are safe to publish and help new devices auto-configure.
      const { githubToken, ...safeSettings } = settings;

      const dataToPublish = customData || {
        siteSettings: safeSettings,
        carouselItems: state.carousel,
        newsItems: state.news,
        councilMembers: state.members,
        forensicData: state.forensic,
        libraryResources: state.resources,
        instituteData: state.institute,
        contactMessages: state.messages
      };

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataToPublish, null, 2))));
      const path = 'src/data/data.json';
      
      // Get the SHA of the current file first
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${settings.githubOwner}/${settings.githubRepo}/contents/${path}`,
        {
          headers: {
            'Authorization': `token ${settings.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      let sha = '';
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      }

      // Update the file
      const updateResponse = await fetch(
        `https://api.github.com/repos/${settings.githubOwner}/${settings.githubRepo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${settings.githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update site data from admin panel ${new Date().toLocaleString()}`,
            content: content,
            sha: sha
          })
        }
      );

      if (updateResponse.ok) {
        console.log('Published to GitHub successfully');
        return true;
      } else {
        const errorData = await updateResponse.json();
        console.error('GitHub API Error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Publish error:', error);
      return false;
    }
  };

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
    
    // Also save GitHub settings specifically to ensure they persist across syncs
    if (newSettings.githubToken) localStorage.setItem('gh_token', newSettings.githubToken);
    if (newSettings.githubRepo) localStorage.setItem('gh_repo', newSettings.githubRepo);
    if (newSettings.githubOwner) localStorage.setItem('gh_owner', newSettings.githubOwner);
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
      publishToGithub,
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
