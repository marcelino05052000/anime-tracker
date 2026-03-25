import { NavLink } from 'react-router-dom';
import { Moon, Sun, Tv } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import type { Language } from '@/i18n/translations';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'pt-BR', label: 'PT' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? 'text-violet-600 dark:text-violet-400'
      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
  }`;

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-violet-600 dark:text-violet-400"
        >
          <Tv size={22} />
          AniTracker
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            {t.nav.home}
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            {t.nav.search}
          </NavLink>
          <NavLink to="/my-list" className={navLinkClass}>
            {t.nav.myList}
          </NavLink>

          {/* Language selector */}
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden text-xs font-semibold">
            {LANGUAGES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setLanguage(value)}
                className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                  language === value
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                aria-label={`Switch to ${label}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
