import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export type LangCode = 'ar' | 'en' | 'fr' | 'de' | 'tr' | 'ur' | 'fa' | 'ms' | 'id' | 'es' | 'pt' | 'ru' | 'zh' | 'hi' | 'bn' | 'sw' | 'nl' | 'it' | 'ja' | 'ko';

export interface LanguageInfo {
  code: LangCode;
  name: string;           // English name
  nativeName: string;     // Name in that language
  dir: 'rtl' | 'ltr';
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',       dir: 'rtl', flag: '🇸🇦' },
  { code: 'en', name: 'English',    nativeName: 'English',        dir: 'ltr', flag: '🇬🇧' },
  { code: 'fr', name: 'French',     nativeName: 'Français',       dir: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'German',     nativeName: 'Deutsch',        dir: 'ltr', flag: '🇩🇪' },
  { code: 'tr', name: 'Turkish',    nativeName: 'Türkçe',         dir: 'ltr', flag: '🇹🇷' },
  { code: 'ur', name: 'Urdu',       nativeName: 'اردو',           dir: 'rtl', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian',    nativeName: 'فارسی',          dir: 'rtl', flag: '🇮🇷' },
  { code: 'ms', name: 'Malay',      nativeName: 'Bahasa Melayu',  dir: 'ltr', flag: '🇲🇾' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia',dir: 'ltr', flag: '🇮🇩' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',        dir: 'ltr', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português',      dir: 'ltr', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский',        dir: 'ltr', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',           dir: 'ltr', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',         dir: 'ltr', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali',    nativeName: 'বাংলা',          dir: 'ltr', flag: '🇧🇩' },
  { code: 'sw', name: 'Swahili',    nativeName: 'Kiswahili',      dir: 'ltr', flag: '🇰🇪' },
  { code: 'nl', name: 'Dutch',      nativeName: 'Nederlands',     dir: 'ltr', flag: '🇳🇱' },
  { code: 'it', name: 'Italian',    nativeName: 'Italiano',       dir: 'ltr', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese',   nativeName: '日本語',          dir: 'ltr', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean',     nativeName: '한국어',          dir: 'ltr', flag: '🇰🇷' },
];

// ─── Core Arabic → English translations (base layer) ───────────────────────
const BASE_TRANSLATIONS: Record<'ar' | 'en', Record<string, string>> = {
  ar: {
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'تسجيل جديد',
    'nav.search': 'بحث',
    'hero.title': 'تذاكر الدخول للمتحف',
    'hero.gate': 'بوابة المتحف الكبرى',
    'hero.desc': 'مرحبًا بك في متحف الفينيق. احصل على تذكرة الدخول الخاصة بك لاستكشاف 7 طوابق غامرة تغطي الرموز العربية القديمة، والاستعارات القرآنية، والتراث الفكري العميق.',
    'hero.get_ticket': 'احصل على تذكرة الدخول',
    'hero.free_guest': 'ادخل كضيف مجاني',
    'hero.visitor': 'تذكرة زائر',
    'hero.researcher': 'تذكرة باحث',
    'hero.scholar': 'تذكرة عالم',
    'hero.free': 'مجاني',
    'hero.mo': '/ شهر',
    'hero.claim': 'احصل على التذكرة',
    'hero.museum_name_ar': 'متحف الفينيق',
    'hero.museum_name_en': 'Phoenix Museum',
    'hero.reception': 'مكتب الاستقبال والتذاكر',
    'hero.museum_of_symbols': 'متحف العنقاء للتراث والحضارة',
    'hero.admission_tickets': 'تذاكر الدخول',
    'hero.footer_desc': 'المتحف الافتراضي للرموز العربية',
    'hero.most_popular': 'الأكثر شهرة',
    'dome.enter': 'انقر على قاعة للدخول',
    'dome.timeline': 'الجدول الزمني للرموز',
    'dome.research': 'مكتبة الأبحاث',
    'dome.courses': 'الدورات والشهادات',
    'dome.archive': 'الأرشيف الملكي',
    'dome.map': 'خريطة المتحف',
    'dome.floors': 'طوابق المتحف',
    'dome.central': 'القبة المركزية الكبرى',
    'dome.locked': 'مغلق',
    'feat.all_halls': 'جميع القاعات السبع',
    'feat.symbol_search': 'البحث عن الرموز',
    'feat.basic_articles': 'المقالات الأساسية',
    'feat.full_archive': 'الأرشيف الكامل',
    'feat.all_manuscripts': 'جميع المخطوطات',
    'feat.ai_analyzer': 'محلل الذكاء الاصطناعي',
    'feat.courses_5': '5 دورات تدريبية',
    'feat.everything': 'الوصول الكامل',
    'feat.all_courses': 'جميع الدورات',
    'feat.certificates': 'الشهادات',
    'feat.consultations': 'الاستشارات',
    'modal.title': 'المتحف الافتراضي',
    'modal.desc': 'احصل على وصول حصري إلى المخطوطات القديمة، تحليل الرموز بالذكاء الاصطناعي، ودورات التاريخ التفاعلية.',
    'modal.email': 'البريد الإلكتروني',
    'modal.pass': 'كلمة المرور',
    'modal.name': 'الاسم الكامل',
    'modal.login_btn': 'تسجيل الدخول إلى المتحف',
    'modal.register_btn': 'إنشاء تذكرة دخول',
    'modal.forgot': 'هل نسيت كلمة المرور؟',
    'modal.no_account': 'ليس لديك تذكرة؟',
    'modal.has_account': 'لديك تذكرة بالفعل؟',
    'modal.register_link': 'سجل الآن',
    'modal.login_link': 'تسجيل الدخول',
    'modal.admin': 'دخول المسؤول',
    'modal.success': 'تم الدخول بنجاح!',
    'modal.error': 'يوجد خطأ',
    'lang.select': 'اختر اللغة',
    'lang.translating': 'جارٍ الترجمة...',
    'lang.auto': 'ترجمة تلقائية',
  },
  en: {
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.search': 'Search',
    'hero.title': 'Museum Admission Passes',
    'hero.gate': 'Grand Museum Gate',
    'hero.desc': "Welcome to the Phoenix Museum. Secure your admission pass to explore 7 immersive floors covering ancient Arabic symbols, Qur'anic metaphors, and deep intellectual heritage.",
    'hero.get_ticket': 'Get Admission Ticket',
    'hero.free_guest': 'Enter as Free Guest',
    'hero.visitor': 'Visitor Pass',
    'hero.researcher': 'Researcher Pass',
    'hero.scholar': 'Scholar Pass',
    'hero.free': 'Free',
    'hero.mo': '/mo',
    'hero.claim': 'Claim Pass',
    'hero.museum_name_ar': 'متحف الفينيق',
    'hero.museum_name_en': 'Phoenix Museum',
    'hero.reception': 'Reception & Tickets',
    'hero.museum_of_symbols': 'Museum of Phoenix',
    'hero.admission_tickets': 'Admission Tickets',
    'hero.footer_desc': 'The Virtual Museum of Arabic Symbols',
    'hero.most_popular': 'Most Popular',
    'dome.enter': 'Click a hall to enter',
    'dome.timeline': 'Symbol Timeline',
    'dome.research': 'Research Library',
    'dome.courses': 'Courses & Certs',
    'dome.archive': 'Royal Archive',
    'dome.map': 'Museum Map',
    'dome.floors': 'Museum Floors',
    'dome.central': 'Central Grand Dome',
    'dome.locked': 'Locked',
    'feat.all_halls': 'All 7 Halls',
    'feat.symbol_search': 'Symbol Search',
    'feat.basic_articles': 'Basic Articles',
    'feat.full_archive': 'Full Archive',
    'feat.all_manuscripts': 'All Manuscripts',
    'feat.ai_analyzer': 'AI Analyzer',
    'feat.courses_5': '5 Courses',
    'feat.everything': 'Everything',
    'feat.all_courses': 'All Courses',
    'feat.certificates': 'Certificates',
    'feat.consultations': 'Consultations',
    'modal.title': 'Virtual Museum',
    'modal.desc': 'Unlock exclusive access to ancient manuscripts, AI symbol analysis, and interactive history courses.',
    'modal.email': 'Email Address',
    'modal.pass': 'Password',
    'modal.name': 'Full Name',
    'modal.login_btn': 'Sign In to Museum',
    'modal.register_btn': 'Create Admission Pass',
    'modal.forgot': 'Forgot password?',
    'modal.no_account': "Don't have a pass?",
    'modal.has_account': 'Already have a pass?',
    'modal.register_link': 'Register',
    'modal.login_link': 'Login',
    'modal.admin': 'Admin Access',
    'modal.success': 'Success!',
    'modal.error': 'Error',
    'lang.select': 'Select Language',
    'lang.translating': 'Translating...',
    'lang.auto': 'Auto-translated',
  },
};

// ─── Auto-translate using Google Translate (no API key needed for widget) ───
async function googleTranslateText(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    // Google Translate returns nested arrays: [[["translated","original",...],...],...]
    if (Array.isArray(data) && data[0]) {
      return data[0]
        .filter(Boolean)
        .map((chunk: any[]) => chunk[0])
        .join('');
    }
    return text;
  } catch {
    return text;
  }
}

// ─── Cache: langCode → key → translated string ──────────────────────────────
const translationCache = new Map<string, Record<string, string>>();

interface LanguageContextProps {
  lang: LangCode;
  langInfo: LanguageInfo;
  isAr: boolean;
  isRtl: boolean;
  setLanguage: (code: LangCode) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LangCode>(() => {
    try { return (localStorage.getItem('museum_lang') as LangCode) || 'ar'; } catch { return 'ar'; }
  });
  const [translations, setTranslations] = useState<Record<string, string>>(BASE_TRANSLATIONS['ar']);
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingRef = useRef<LangCode | null>(null);

  const langInfo = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const isAr = lang === 'ar';
  const isRtl = langInfo.dir === 'rtl';

  // Translate all base keys to the target language
  const loadTranslations = useCallback(async (targetLang: LangCode) => {
    if (targetLang === 'ar') {
      setTranslations(BASE_TRANSLATIONS.ar);
      return;
    }
    if (targetLang === 'en') {
      setTranslations(BASE_TRANSLATIONS.en);
      return;
    }

    // Check cache
    const cached = translationCache.get(targetLang);
    if (cached) {
      setTranslations(cached);
      return;
    }

    setIsTranslating(true);
    pendingRef.current = targetLang;

    try {
      // Translate all English values to target language in batch
      const keys = Object.keys(BASE_TRANSLATIONS.en);
      const values = keys.map(k => BASE_TRANSLATIONS.en[k]);

      // Batch: join with delimiter to minimize requests
      const DELIMITER = ' |||| ';
      // Split into chunks to avoid URL length limits
      const CHUNK_SIZE = 15;
      const result: Record<string, string> = {};

      for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
        if (pendingRef.current !== targetLang) break; // cancelled
        const chunkKeys = keys.slice(i, i + CHUNK_SIZE);
        const chunkVals = values.slice(i, i + CHUNK_SIZE);
        const joined = chunkVals.join(DELIMITER);
        const translated = await googleTranslateText(joined, targetLang);
        const parts = translated.split(DELIMITER);
        chunkKeys.forEach((k, j) => {
          result[k] = parts[j]?.trim() || chunkVals[j];
        });
      }

      if (pendingRef.current === targetLang) {
        translationCache.set(targetLang, result);
        setTranslations(result);
      }
    } catch {
      // Fallback to English
      setTranslations(BASE_TRANSLATIONS.en);
    } finally {
      if (pendingRef.current === targetLang) {
        setIsTranslating(false);
        pendingRef.current = null;
      }
    }
  }, []);

  const setLanguage = useCallback((code: LangCode) => {
    setLangState(code);
    try { localStorage.setItem('museum_lang', code); } catch {}
  }, []);

  useEffect(() => {
    const info = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
    document.documentElement.dir = info.dir;
    document.documentElement.lang = lang;
    loadTranslations(lang);
  }, [lang, loadTranslations]);

  const t = useCallback((key: string): string => {
    return translations[key] || BASE_TRANSLATIONS.en[key] || key;
  }, [translations]);

  // Translate arbitrary text to current language
  const translateText = useCallback(async (text: string): Promise<string> => {
    if (lang === 'en') return text;
    return googleTranslateText(text, lang);
  }, [lang]);

  // Backward-compat: toggleLanguage flips between ar/en
  const toggleLanguage = useCallback(() => {
    setLanguage(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLanguage]);

  return (
    <LanguageContext.Provider value={{
      lang, langInfo, isAr, isRtl,
      setLanguage,
      t,
      translateText,
      isTranslating,
    }}>
      {/* Expose toggleLanguage for older components via extra prop */}
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

// Backward-compat shim: expose toggleLanguage
export const useLanguageToggle = () => {
  const { lang, setLanguage } = useLanguage();
  return useCallback(() => setLanguage(lang === 'ar' ? 'en' : 'ar'), [lang, setLanguage]);
};
