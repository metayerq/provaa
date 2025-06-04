
import React, { useEffect } from 'react';
import { useSEOSettings } from '@/hooks/useSEOSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  // New props for page-specific SEO
  metaTitle?: string;
  metaDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  ogImage,
  ogType = "website",
  metaTitle,
  metaDescription
}) => {
  const { data: seoSettings } = useSEOSettings();

  useEffect(() => {
    if (!seoSettings) return;

    // Prioritize custom meta fields, then props, then global settings
    const pageTitle = metaTitle || title || seoSettings.site_title;
    const pageDescription = metaDescription || description || seoSettings.site_description;
    
    // Update document title
    document.title = pageTitle;

    // Update meta description
    updateMetaTag('description', pageDescription);

    // Update Open Graph tags
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:image', ogImage || seoSettings.og_image_url, 'property');

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', seoSettings.twitter_handle);
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', ogImage || seoSettings.og_image_url);

  }, [seoSettings, title, description, ogImage, ogType, metaTitle, metaDescription]);

  return null; // This component doesn't render anything
};

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.content = content;
    document.head.appendChild(element);
  }
};

export default SEOHead;
