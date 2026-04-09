import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Tv, X, LogIn, LogOut, User, Bell } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount';
import type { Language } from '@/i18n/translations';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'pt-BR', label: 'PT' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium py-1 transition-colors ${
    isActive
      ? 'text-violet-600 dark:text-violet-400'
      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
  }`;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useI18n();
  const { user, isAuthenticated } = useAuthContext();
  const logout = useLogout();
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadCount();

  function handleCloseMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => navigate('/'),
    });
    handleCloseMobileMenu();
  }

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

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="sm:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav
          id="main-navigation"
          className={`${
            mobileMenuOpen ? 'flex' : 'hidden'
          } absolute top-16 inset-x-0 px-4 pb-4 sm:pb-0 sm:px-0 sm:static sm:flex sm:items-center sm:gap-6`}
        >
          <div className="w-full sm:w-auto rounded-xl sm:rounded-none border border-zinc-200 dark:border-zinc-800 sm:border-0 bg-white dark:bg-zinc-950 sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
              <NavLink to="/" end className={navLinkClass} onClick={handleCloseMobileMenu}>
                {t.nav.home}
              </NavLink>
              <NavLink to="/my-list" className={navLinkClass} onClick={handleCloseMobileMenu}>
                {t.nav.myList}
              </NavLink>
              <NavLink to="/forum" className={navLinkClass} onClick={handleCloseMobileMenu}>
                {t.nav.forum}
              </NavLink>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-3 pt-2 sm:pt-0 border-t border-zinc-200 dark:border-zinc-800 sm:border-t-0">
              {/* Language selector */}
              <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden text-xs font-semibold">
                {LANGUAGES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setLanguage(value);
                      handleCloseMobileMenu();
                    }}
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

              {/* Notifications */}
              {isAuthenticated && (
                <NavLink
                  to="/notifications"
                  onClick={handleCloseMobileMenu}
                  className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-violet-600 text-white text-[10px] font-bold px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              )}

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                    <User size={14} />
                    {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    aria-label={t.auth.logout}
                    title={t.auth.logout}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={handleCloseMobileMenu}
                  className="flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  <LogIn size={16} />
                  {t.auth.login}
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
