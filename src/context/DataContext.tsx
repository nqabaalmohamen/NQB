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
  isPublishing: boolean;
  
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
    isPublishing: false,
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
    if (state.isPublishing) {
      console.warn('Publishing already in progress');
      return false;
    }

    const settings = state.settings;
    if (!settings.githubToken || !settings.githubRepo || !settings.githubOwner) {
      console.error('GitHub settings are missing');
      return false;
    }

    setState(prev => ({ ...prev, isPublishing: true }));

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
      
      // Log payload size for debugging
      const sizeInMB = (content.length * 0.75) / (1024 * 1024);
      console.log(`Publishing payload size: ~${sizeInMB.toFixed(2)} MB`);

      if (sizeInMB > 20) {
        throw new Error('حجم البيانات كبير جداً (أكثر من 20 ميجابايت). يرجى تقليل عدد الصور أو حجمها.');
      }

      // Get the SHA of the current file first
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${settings.githubOwner}/${settings.githubRepo}/contents/${path}`,
        {
          headers: {
            'Authorization': `token ${settings.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Cache-Control': 'no-cache'
          }
        }
      );

      let sha = '';
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      } else if (getFileResponse.status === 404) {
        console.warn('File not found on GitHub, will create a new one');
      } else {
        const errorData = await getFileResponse.json();
        throw new Error(`فشل الحصول على معلومات الملف من GitHub: ${errorData.message}`);
      }

      // Update the file with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      try {
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
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (updateResponse.ok) {
          console.log('Published to GitHub successfully');
          return true;
        } else {
          const errorData = await updateResponse.json();
          console.error('GitHub API Error:', errorData);
          
          let errorMsg = errorData.message || 'خطأ غير معروف';
          if (updateResponse.status === 401) errorMsg = 'التوكن غير صالح أو انتهت صلاحيته';
          if (updateResponse.status === 404) errorMsg = 'المستودع غير موجود أو لا يملك التوكن صلاحية الوصول إليه';
          if (updateResponse.status === 413) errorMsg = 'حجم الملف كبير جداً بالنسبة لـ GitHub API';
          if (updateResponse.status === 409) errorMsg = 'حدث تعارض في النسخ (Conflict)، يرجى إعادة المحاولة';

          throw new Error(errorMsg);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('انتهت مهلة الاتصال بـ GitHub. قد يكون حجم البيانات كبيراً جداً أو سرعة الإنترنت ضعيفة.');
        }
        throw err;
      }
    } catch (error: any) {
      console.error('Publish error:', error);
      // Pass the error message back to the UI
      alert(`فشل النشر: ${error.message}`);
      return false;
    } finally {
      setState(prev => ({ ...prev, isPublishing: false }));
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
