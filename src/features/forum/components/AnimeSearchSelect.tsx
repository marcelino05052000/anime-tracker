import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@/hooks/useI18n';
import { useDebounce } from '@/hooks/useDebounce';
import { animeService } from '@/services/jikan/anime.service';
import { Spinner } from '@/components/ui';
import type { Anime } from '@/types';

interface AnimeSearchSelectProps {
  onSelect: (anime: Anime) => void;
  selected: { mal_id: number; title: string; image_url: string } | null;
  onClear: () => void;
}

export default function AnimeSearchSelect({ onSelect, selected, onClear }: AnimeSearchSelectProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['anime-search-select', debouncedQuery],
    queryFn: () => animeService.search({ q: debouncedQuery, limit: 8, sfw: true }),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (selected) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <img
          src={selected.image_url}
          alt={selected.title}
          className="w-8 h-12 rounded object-cover"
        />
        <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {selected.title}
        </span>
        <button
          onClick={onClear}
          className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t.forum.newPost.selectAnime}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
        />
      </div>

      {open && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg z-50">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size={16} />
            </div>
          ) : data?.data && data.data.length > 0 ? (
            data.data.map((anime) => (
              <button
                key={anime.mal_id}
                onClick={() => {
                  onSelect(anime);
                  setQuery('');
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <img
                  src={anime.images?.webp?.image_url || anime.images?.jpg?.image_url || ''}
                  alt={anime.title}
                  className="w-8 h-12 rounded object-cover shrink-0"
                />
                <span className="text-sm text-zinc-100 truncate">{anime.title}</span>
              </button>
            ))
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500">
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
}
