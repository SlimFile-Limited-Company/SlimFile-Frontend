import { useState, useEffect } from 'react';
import { getCurrentLanguage, t as translate, type Language } from '@/services/translationService';

/**
 * Custom hook for using translations in React components
 * Automatically re-renders when language changes
 */
export function useTranslation() {
  const [language, setLanguage] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string) => translate(key, language);

  return { t, language };
}
