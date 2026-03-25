import translations from '@/i18n/translations';
import { useLanguageStore } from '@/store/languageStore';

export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  return { t: translations[language], language, setLanguage };
}
