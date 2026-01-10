import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  getCurrentLanguage,
  setLanguage,
  SUPPORTED_LANGUAGES,
  type Language,
  getLanguageInfo,
} from '@/services/translationService';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLang(event.detail);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    // No need to reload - the custom event will trigger re-renders
  };

  const currentLangInfo = getLanguageInfo(currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 transition-colors"
          title="Change Language"
        >
          <Globe className="w-5 h-5 text-gray-700" />
          <span className="absolute -bottom-1 -right-1 text-xs">
            {currentLangInfo?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-2">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Select Language
          </p>
          <p className="text-xs text-gray-500">
            Choose your preferred language
          </p>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer flex items-center gap-3 px-3 py-2 ${
                currentLang === lang.code
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{lang.nativeName}</p>
                <p className="text-xs text-gray-500">{lang.name}</p>
              </div>
              {currentLang === lang.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
