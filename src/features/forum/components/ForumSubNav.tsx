import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Plus, ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
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

interface DropdownItem {
  label: string;
  onClick: () => void;
}

function SubNavDropdown({ label, items, open, onToggle, onClose }: {
  label: string;
  items: DropdownItem[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
      >
        {label}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1 z-50">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className="w-full text-left px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ForumSubNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<'filter' | null>(null);

  const filterItems: DropdownItem[] = [
    ...CATEGORIES.map((cat) => ({
      label: t.forum.categories[cat],
      onClick: () => navigate(`/forum?category=${cat}`),
    })),
    { label: '─────────', onClick: () => {} },
    { label: `🔥 ${t.forum.nav.popular}`, onClick: () => navigate('/forum?sort=popular') },
    { label: `📺 ${t.forum.nav.episodesOfTheWeek}`, onClick: () => navigate('/forum?category=episode_discussion') },
  ];

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-11">
        <NavLink
          to="/forum"
          end
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              isActive
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`
          }
        >
          <Home size={14} />
          {t.forum.nav.home}
        </NavLink>

        <SubNavDropdown
          label={t.forum.nav.categories}
          items={filterItems}
          open={openDropdown === 'filter'}
          onToggle={() => setOpenDropdown(openDropdown === 'filter' ? null : 'filter')}
          onClose={() => setOpenDropdown(null)}
        />

        {isAuthenticated && (
          <NavLink
            to="/forum/new"
            className="flex items-center gap-1.5 ml-auto px-3 py-1.5 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors whitespace-nowrap"
          >
            <Plus size={14} />
            {t.forum.nav.newPost}
          </NavLink>
        )}
      </div>
    </div>
  );
}
