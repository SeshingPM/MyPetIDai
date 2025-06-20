
import { useMemo } from 'react';
import { defaultSeoConfig, getPageSeoConfig, globalResourceHints, commonPreloadAssets, alternateLanguages, mobileAppConfig, PageName } from '@/config/seo-config';
import { useLocation } from 'react-router-dom';
import logger from '@/utils/logger';

interface UseSeoProps {
  pageName: PageName;
  customTitle?: string;
  customDescription?: string;
  customCanonicalUrl?: string;
  customOgImage?: string;
  customKeywords?: string;
  additionalStructuredData?: any[];
  noIndex?: boolean;
  noFollow?: boolean;
  additionalBreadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
}

export function usePageSeo(props: UseSeoProps) {
  const {
    pageName,
    customTitle,
    customDescription,
    customCanonicalUrl,
    customOgImage,
    customKeywords,
    additionalStructuredData = [],
    noIndex = false,
    noFollow = false,
    additionalBreadcrumbs = [],
    faqItems = []
  } = props;
  
  const location = useLocation();
  
  return useMemo(() => {
    try {
      const pageConfig = getPageSeoConfig(pageName);
      
      let structuredData: any[] = [];
      try {
        structuredData = typeof pageConfig.structuredData === 'function' 
          ? pageConfig.structuredData() 
          : pageConfig.structuredData || [];
      } catch (error) {
        logger.error('Error generating structured data:', error);
        structuredData = [];
      }
      
      const breadcrumbs = [
        ...(pageConfig.breadcrumbs || []),
        ...additionalBreadcrumbs
      ];
      
      const canonicalUrl = customCanonicalUrl || pageConfig.canonicalUrl || `${defaultSeoConfig.canonicalUrl}${location.pathname}`;
      
      const currentPathname = location.pathname === '/' ? '' : location.pathname;
      const pageSpecificAlternateLanguages = alternateLanguages.map(lang => ({
        ...lang,
        url: lang.url.replace(/\/$/, '') + currentPathname
      }));
      
      return {
        title: customTitle || pageConfig.title || defaultSeoConfig.defaultTitle,
        description: customDescription || pageConfig.description || defaultSeoConfig.description,
        keywords: customKeywords || pageConfig.keywords || '',
        canonicalUrl,
        ogType: pageConfig.ogType || 'website',
        ogImage: customOgImage || pageConfig.ogImage || defaultSeoConfig.ogImage,
        structuredData: [
          ...structuredData,
          ...additionalStructuredData
        ],
        lang: 'en-US',
        alternateLanguages: pageSpecificAlternateLanguages,
        noIndex,
        noFollow,
        mobileAppConfig,
        preloadAssets: commonPreloadAssets,
        preconnectUrls: globalResourceHints.preconnectUrls,
        dnsPrefetchUrls: globalResourceHints.dnsPrefetchUrls,
        breadcrumbs,
        faqItems
      };
    } catch (error) {
      logger.error('Error in usePageSeo hook:', error);
      
      return {
        title: defaultSeoConfig.defaultTitle,
        description: defaultSeoConfig.description,
        canonicalUrl: `${defaultSeoConfig.canonicalUrl}${location.pathname}`,
        ogType: 'website',
        ogImage: defaultSeoConfig.ogImage,
      };
    }
  }, [
    pageName,
    customTitle,
    customDescription,
    customCanonicalUrl,
    customOgImage,
    customKeywords,
    additionalStructuredData,
    noIndex,
    noFollow,
    additionalBreadcrumbs,
    location.pathname,
    faqItems
  ]);
}
