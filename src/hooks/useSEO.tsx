import { Helmet } from 'react-helmet-async';
import { type SEOMetadata, DEFAULT_SEO, getOpenGraphTags, getTwitterCardTags, getStructuredData } from '../utils/seo';

export const useSEO = (metadata: Partial<SEOMetadata> = {}) => {
  const seoData: SEOMetadata = {
    ...DEFAULT_SEO,
    ...metadata,
  };

  const ogTags = getOpenGraphTags(seoData);
  const twitterTags = getTwitterCardTags(seoData);
  const structuredData = getStructuredData();

  return {
    Helmet: (
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {seoData.keywords && (
          <meta name="keywords" content={seoData.keywords.join(', ')} />
        )}

        <link rel="canonical" href={seoData.url || DEFAULT_SEO.url} />

        {Object.entries(ogTags).map(([key, value]) => (
          <meta key={key} property={key} content={value} />
        ))}

        {Object.entries(twitterTags).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        <meta name="author" content={seoData.author || 'Bunzi MealPlanner'} />
        <meta name="language" content="en-NG" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />

        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {seoData.publishedDate && (
          <meta property="article:published_time" content={seoData.publishedDate} />
        )}
        {seoData.updatedDate && (
          <meta property="article:modified_time" content={seoData.updatedDate} />
        )}
      </Helmet>
    ),
    seoData,
  };
};

export default useSEO;
