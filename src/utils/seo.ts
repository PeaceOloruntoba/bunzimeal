export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
}

export const DEFAULT_SEO: SEOMetadata = {
  title: 'Bunzi MealPlanner - Smart Meal Planning for Nigerian Families',
  description:
    'Plan meals you love. Eat better every week with Bunzi MealPlanner. Nigeria\'s smartest meal planner with nutrition tracking, pantry sync, and personalized recipes.',
  keywords: [
    'meal planner',
    'meal planning',
    'nutrition tracker',
    'recipe planner',
    'meal prep',
    'Nigerian recipes',
    'healthy eating',
    'diet planning',
    'smart meal planner',
    'pantry management',
  ],
  image: 'https://bunzi-mealplanner.vercel.app/logo.jpg',
  url: 'https://bunzi-mealplanner.vercel.app',
  type: 'website',
};

export const PAGE_SEO: Record<string, SEOMetadata> = {
  landing: {
    title: 'Bunzi MealPlanner - Smart Meal Planning for Nigerian Families',
    description:
      'Plan meals you love. Eat better every week with Bunzi MealPlanner. Nigeria\'s smartest meal planner with nutrition tracking, pantry sync, and personalized recipes.',
    keywords: [
      'meal planner',
      'meal planning',
      'nutrition tracker',
      'recipe planner',
      'Nigerian recipes',
      'healthy eating',
    ],
    image: 'https://bunzi-mealplanner.vercel.app/logo.jpg',
    url: 'https://bunzi-mealplanner.vercel.app',
    type: 'website',
  },
  login: {
    title: 'Sign In - Bunzi MealPlanner',
    description: 'Sign in to your Bunzi MealPlanner account. Access your meal plans, recipes, and nutrition tracking.',
    url: 'https://bunzi-mealplanner.vercel.app/login',
  },
  signup: {
    title: 'Get Started Free - Bunzi MealPlanner',
    description: 'Join Bunzi MealPlanner today. Get 7-day free trial. Start planning meals smarter. Track nutrition. Sync your pantry.',
    keywords: [
      'free meal planner',
      'sign up',
      'meal planning app',
      'nutrition tracker',
    ],
    url: 'https://bunzi-mealplanner.vercel.app/signup',
  },
  privacy: {
    title: 'Privacy Policy - Bunzi MealPlanner',
    description: 'Read our privacy policy to understand how Bunzi MealPlanner protects your personal information.',
    url: 'https://bunzi-mealplanner.vercel.app/privacy-policy',
  },
  terms: {
    title: 'Terms and Conditions - Bunzi MealPlanner',
    description: 'Review the terms and conditions for using Bunzi MealPlanner.',
    url: 'https://bunzi-mealplanner.vercel.app/terms-and-conditions',
  },
};

export const getStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bunzi MealPlanner',
    description:
      'Smart meal planning application for Nigerian families. Track nutrition, sync pantry, and get personalized recipes.',
    url: 'https://bunzi-mealplanner.vercel.app',
    applicationCategory: 'HealthApplication',
    offers: {
      '@type': 'Offer',
      price: '1750',
      priceCurrency: 'NGN',
      name: 'Premium Subscription',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '128',
    },
  };
};

export const getOpenGraphTags = (seo: SEOMetadata) => {
  return {
    'og:title': seo.title,
    'og:description': seo.description,
    'og:image': seo.image || DEFAULT_SEO.image,
    'og:url': seo.url || DEFAULT_SEO.url,
    'og:type': seo.type || 'website',
  };
};

export const getTwitterCardTags = (seo: SEOMetadata) => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': seo.title,
    'twitter:description': seo.description,
    'twitter:image': seo.image || DEFAULT_SEO.image,
    'twitter:site': '@BunziMealPlanner',
  };
};
