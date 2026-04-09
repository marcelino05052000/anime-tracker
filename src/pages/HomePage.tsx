import { Spinner } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useAnimeSearch } from '@/features/search/hooks/useAnimeSearch';
import SearchFilters from '@/features/search/components/SearchFilters';
import Pagination from '@/features/search/components/Pagination';
import AnimeGrid from '@/features/home/components/AnimeGrid';
import SeasonalSection from '@/features/home/components/SeasonalSection';
import TopAnimeSection from '@/features/home/components/TopAnimeSection';

export default function HomePage() {
  const { t } = useI18n();
  const {
    animes,
    pagination,
    isLoading,
    q,
    page,
    status,
    order,
    season,
    setQ,
    setPage,
    setStatus,
    setOrder,
    setSeason,
  } = useAnimeSearch();

  const hasQuery = !!(q || status || order || season);
  const isEmpty = hasQuery && !isLoading && animes?.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
      <SearchFilters
        q={q}
        status={status}
        order={order}
        season={season}
        onQChange={setQ}
        onStatusChange={setStatus}
        onOrderChange={setOrder}
        onSeasonChange={setSeason}
      />

      {hasQuery ? (
        <>
          {isLoading && !animes && (
            <div className="flex justify-center py-16">
              <Spinner size={36} />
            </div>
          )}

          {!isLoading && animes?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-zinc-400 gap-2 text-center">
              <p className="text-lg font-medium">{t.search.noResultsTitle}</p>
              <p className="text-sm">{t.search.noResultsSubtitle}</p>
            </div>
          )}

          {animes && animes.length > 0 && (
            <>
              <AnimeGrid animes={animes} />
              {pagination && (
                <Pagination pagination={pagination} currentPage={page} onPageChange={setPage} />
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-10 sm:gap-12">
          <SeasonalSection />
          <TopAnimeSection />
        </div>
      )}
    </div>
  );
}
