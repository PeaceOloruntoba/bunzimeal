import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-5F019CG9V9';

export const initializeGA = () => {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-5F019CG9V9') {
    console.warn('Google Analytics not configured');
    return;
  }

  ReactGA.initialize(GA_MEASUREMENT_ID);
  console.log('Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
};

export const trackPageView = (path: string, title: string) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title,
  });
};

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  ReactGA.event(eventName, eventData);
};

export const trackUserInteraction = (action: string, category: string, label?: string) => {
  ReactGA.event(action, {
    category: category,
    label: label,
  });
};

export const trackConversion = (conversionType: string, value?: number) => {
  ReactGA.event('conversion', {
    conversion_type: conversionType,
    value: value,
  });
};

export const setUserProperties = (userId: string, properties?: Record<string, any>) => {
  ReactGA.set({
    user_id: userId,
    ...properties,
  });
};

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'pageview',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_RESET: 'password_reset',
  SUBSCRIBE: 'subscribe',
  UPGRADE_PLAN: 'upgrade_plan',
  CANCEL_SUBSCRIPTION: 'cancel_subscription',
  CREATE_MEAL_PLAN: 'create_meal_plan',
  VIEW_RECIPE: 'view_recipe',
  ADD_TO_PANTRY: 'add_to_pantry',
  CREATE_SHOPPING_LIST: 'create_shopping_list',
  VIEW_FAQ: 'view_faq',
  CONTACT_SUPPORT: 'contact_support',
  SHARE_CONTENT: 'share_content',
  ERROR: 'error',
  API_ERROR: 'api_error',
};

export const useAnalytics = () => {
  return {
    trackPageView,
    trackEvent,
    trackUserInteraction,
    trackConversion,
    setUserProperties,
    EVENTS: ANALYTICS_EVENTS,
  };
};

export default {
  initializeGA,
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackConversion,
  setUserProperties,
  ANALYTICS_EVENTS,
  useAnalytics,
};
