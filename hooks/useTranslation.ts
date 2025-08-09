import { useLanguage } from '../components/theme-provider';

// Solo textos en inglés - ultra minimalista
const texts = {
  // Navigation
  share: 'Share',
  sell: 'Sell', 
  buy: 'Buy',
  profile: 'Profile',
  dashboard: 'Dashboard',
  
  // Actions
  back: 'Back',
  next: 'Next',
  save: 'Save',
  cancel: 'Cancel',
  continue: 'Continue',
  
  // Profile
  contributions: 'Contributions',
  purchases: 'Purchases',
  
  // Basic labels
  home: 'Home',
  hello: 'Hello'
} as const;

type TextKey = keyof typeof texts;

export function useTranslation() {
  const t = (key: TextKey) => {
    return texts[key] || key;
  };
  
  return { t };
}
