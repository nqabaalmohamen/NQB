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

    if (!navigator.onLine) {
      alert('لا يوجد اتصال بالإنترنت. يرجى التأكد من اتصالك وإعادة المحاولة.');
      return false;
    }

    const cleanInput = (text: string) => {
      if (!text) return '';
      // If user pasted a full URL like https://github.com/owner/repo
      let cleaned = text.trim();
      if (cleaned.includes('github.com/')) {
        const parts = cleaned.split('github.com/')[1].split('/');
        // Return owner or repo depending on context, but here we just return the last part if it's a simple split
        // This is a helper, we'll use more specific logic below
      }
      return cleaned;
    };

    let owner = state.settings.githubOwner?.trim() || '';
    let repo = state.settings.githubRepo?.trim() || '';
    let token = state.settings.githubToken?.trim() || '';

    // Aggressive cleaning for token: only take the ghp_ or github_pat_ part
    const tokenMatch = token.match(/(ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,})/);
    if (tokenMatch) {
      token = tokenMatch[0];
    } else {
      // Cleanup prefixes if regex didn't catch it
      token = token.replace(/^(token|bearer|github_pat)\s+/i, '').trim();
    }

    // Extracting owner/repo from any format (URL, user/repo, or just name)
    const extractParts = (input: string) => {
      let parts = input.replace(/https?:\/\/github\.com\//, '').split('/').filter(Boolean);
      return parts;
    };

    const ownerParts = extractParts(owner);
    const repoParts = extractParts(repo);

    if (ownerParts.length >= 2) {
      owner = ownerParts[0];
      if (!repo) repo = ownerParts[1];
    } else if (ownerParts.length === 1) {
      owner = ownerParts[0];
    }

    if (repoParts.length >= 2) {
      if (!owner) owner = repoParts[0];
      repo = repoParts[1];
    } else if (repoParts.length === 1) {
      repo = repoParts[0];
    }

    if (!token || !repo || !owner) {
      alert('إعدادات GitHub غير مكتملة. يرجى التأكد من إدخال التوكن، اسم المستودع، والمالك.');
      return false;
    }

    setState(prev => ({ ...prev, isPublishing: true }));

    try {
      const dataToPublish = customData || {
        siteSettings: {
          siteName: state.settings.siteName,
          contactEmail: state.settings.contactEmail,
          contactPhone: state.settings.contactPhone,
          address: state.settings.address,
          footerText: state.settings.footerText,
          githubRepo: repo,
          githubOwner: owner
        },
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
      
      // Calculate size for logging
      const sizeInMB = (content.length * 0.75) / (1024 * 1024);
      console.log(`Publishing data size: ${sizeInMB.toFixed(2)} MB`);

      const encOwner = encodeURIComponent(owner);
      const encRepo = encodeURIComponent(repo);
      const apiUrl = `https://api.github.com/repos/${encOwner}/${encRepo}/contents/${path}`;

      // 1. Fetch current file info (SHA) - Increased timeout
      const controllerSHA = new AbortController();
      const timeoutSHA = setTimeout(() => controllerSHA.abort(), 60000);

      const getFileResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        mode: 'cors',
        cache: 'no-store',
        signal: controllerSHA.signal
      }).catch(err => {
        if (err.name === 'AbortError') throw new Error('فشل الحصول على بيانات المستودع (انتهت المهلة).');
        console.error('Fetch Error Detail:', err);
        throw new Error(`تعذر الاتصال بـ GitHub. يرجى التأكد من جودة الإنترنت.\n(التفاصيل: ${err.message})`);
      });

      clearTimeout(timeoutSHA);

      let sha = '';
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      } else if (getFileResponse.status === 401) {
        const errData = await getFileResponse.json().catch(() => ({}));
        if (errData.message === 'Bad credentials') {
          throw new Error('رمز الوصول (Token) غير صحيح أو انتهت صلاحيته. يرجى إنشاء Token جديد من إعدادات GitHub وإدخاله في صفحة الإعدادات.');
        }
        throw new Error(`خطأ في التوثيق: ${errData.message || 'التوكن غير صالح'}`);
      } else if (getFileResponse.status === 403) {
        const errData = await getFileResponse.json().catch(() => ({}));
        throw new Error(`التوكن لا يملك صلاحيات كافية. يرجى التأكد من تفعيل صلاحية "repo" عند إنشاء التوكن.\n(التفاصيل: ${errData.message})`);
      } else if (getFileResponse.status === 404) {
        // Continue with empty SHA if file doesn't exist
      } else {
        const errData = await getFileResponse.json().catch(() => ({}));
        throw new Error(`خطأ من GitHub (${getFileResponse.status}): ${errData.message || 'فشل الاتصال'}`);
      }

      // 2. Push Update - Increased timeout to 120 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      try {
        const updateResponse = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: `تحديث بيانات الموقع - ${new Date().toLocaleString('ar-EG')}`,
            content: content,
            sha: sha
          }),
          mode: 'cors',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (updateResponse.ok) {
          return true;
        } else {
          const errorData = await updateResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'فشل إرسال التحديث لـ GitHub');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('انتهت مهلة الرفع (2 دقيقة). حجم البيانات كبير جداً أو سرعة الرفع ضعيفة جداً.');
        }
        throw err;
      }
    } catch (error: any) {
      console.error('Publish error:', error);
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
