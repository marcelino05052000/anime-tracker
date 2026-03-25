import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useSeasonalAnime } from '../hooks/useSeasonalAnime';
import AnimeGrid from './AnimeGrid';
import Pagination from '@/features/search/components/Pagination';

export default function SeasonalSection() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useSeasonalAnime(page);

  if (isError) return null;

  const animes = data?.data;
  const pagination = data?.pagination;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-violet-500" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t.home.thisSeason}</h2>
      </div>
      <AnimeGrid animes={animes} isLoading={isLoading && !animes} />
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
