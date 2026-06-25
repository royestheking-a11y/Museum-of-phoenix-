import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DynamicSEO() {
  const { isAr } = useLanguage();

  useEffect(() => {
    // 1. Language and Direction
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    // 2. Title
    const title = isAr 
      ? 'متحف العنقاء للتراث والحضارة | Museum of Phoenix' 
      : 'Museum of Phoenix | Ancient History, Artifacts & Cultural Heritage Museum';
    document.title = title;

    // 3. Meta Description
    const desc = isAr
      ? 'استكشف متحف العنقاء، حيث ينبض التاريخ بالحياة من خلال القطع الأثرية النادرة والحضارات القديمة والمعارض الثقافية والتراث الخالد.'
      : 'Explore the Museum of Phoenix, where history comes alive through rare artifacts, ancient civilizations, cultural exhibitions, and timeless heritage.';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', desc);

    // 4. Meta Keywords
    const keywords = isAr
      ? 'متحف العنقاء, متحف تاريخي, قطع أثرية نادرة, تراث ثقافي, حضارات قديمة, معرض تاريخي, متحف العنقاء للتراث والحضارة'
      : 'Museum of Phoenix, Phoenix Museum, Cultural Heritage Museum, Historical Museum, Ancient artifacts, Archaeology museum, Rare collections, History exhibition, Cultural preservation, Heritage center';
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // 5. Open Graph / Social Media
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.setAttribute('content', isAr 
      ? 'نهوض من التاريخ، والحفاظ على المستقبل. يعرض متحف العنقاء القطع الأثرية القديمة والثقافة والتراث الخالد.'
      : 'Rising from history, preserving the future. Museum of Phoenix showcases ancient artifacts, culture, and timeless heritage.'
    );

    // 6. Robots / Canonical (Basic setup for SPA)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow'); // Change from noindex to index
    }

  }, [isAr]);

  return null;
}
