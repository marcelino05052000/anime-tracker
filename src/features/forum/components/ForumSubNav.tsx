import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Flame, Tv, Plus, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import type { ForumCategory } from '@/types';

const CATEGORIES: ForumCategory[] = [
  'discussion',
  'theories',
  'reviews',
  'spoilers',
  'news',
  'episode_discussion',
];

const subNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-violet-600 text-white'
      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
  }`;

export default function ForumSubNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-11 overflow-x-auto">
        <NavLink to="/forum" end className={subNavLinkClass}>
          <Home size={14} />
          {t.forum.nav.home}
        </NavLink>

        {/* Categories dropdown */}
        <div className="relative" ref={catRef}>
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.forum.nav.categories}
            <ChevronDown size={12} />
          </button>
          {catOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg py-1 z-50">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    navigate(`/forum?category=${cat}`);
                    setCatOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {t.forum.categories[cat]}
                </button>
              ))}
            </div>
          )}
        </div>

        <NavLink to="/forum?sort=popular" className={subNavLinkClass}>
          <Flame size={14} />
          {t.forum.nav.popular}
        </NavLink>

        <NavLink to="/forum?category=episode_discussion" className={subNavLinkClass}>
          <Tv size={14} />
          {t.forum.nav.episodesOfTheWeek}
        </NavLink>

        {isAuthenticated && (
          <NavLink to="/forum/new" className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors whitespace-nowrap">
            <Plus size={14} />
            {t.forum.nav.newPost}
          </NavLink>
        )}
      </div>
    </div>
  );
}
