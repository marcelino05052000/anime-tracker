import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useTopAnime } from '../hooks/useTopAnime';
import AnimeGrid from './AnimeGrid';
import Pagination from '@/features/search/components/Pagination';

export default function TopAnimeSection() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useTopAnime(page);

  if (isError) return null;

  const animes = data?.data;
  const visibleAnimes = animes?.slice(0, 12);
  const pagination = data?.pagination;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-violet-500" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t.home.topAnime}</h2>
      </div>
      <AnimeGrid key={page} animes={visibleAnimes} isLoading={isLoading && !animes} />
      {pagination && (
        <div className="mt-5">
          <Pagination
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
          />
          {isFetching && !isLoading && (
            <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Loading page...
            </p>
          )}
        </div>
      )}
    </section>
  );
}
