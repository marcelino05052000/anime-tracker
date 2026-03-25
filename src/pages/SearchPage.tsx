import { Spinner } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useAnimeSearch } from '@/features/search/hooks/useAnimeSearch';
import SearchFilters from '@/features/search/components/SearchFilters';
import Pagination from '@/features/search/components/Pagination';
import AnimeGrid from '@/features/home/components/AnimeGrid';

export default function SearchPage() {
  const { t } = useI18n();
  const {
    animes,
    pagination,
    isLoading,
    q,
    page,
    status,
    order_by,
    setQ,
    setPage,
    setStatus,
    setOrderBy,
  } = useAnimeSearch();

  const hasQuery = !!(q || status || order_by);
  const isEmpty = hasQuery && !isLoading && animes?.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
      <SearchFilters
        q={q}
        status={status}
        order_by={order_by}
        onQChange={setQ}
        onStatusChange={setStatus}
        onOrderByChange={setOrderBy}
      />

      {!hasQuery && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-zinc-400 gap-2 sm:gap-3 text-center">
          <p className="text-lg font-medium">{t.search.emptyTitle}</p>
          <p className="text-sm">{t.search.emptySubtitle}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size={36} />
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-zinc-400 gap-2 text-center">
          <p className="text-lg font-medium">{t.search.noResultsTitle}</p>
          <p className="text-sm">{t.search.noResultsSubtitle}</p>
        </div>
      )}

      {!isLoading && animes && animes.length > 0 && (
        <>
          <AnimeGrid animes={animes} />
          {pagination && (
            <Pagination pagination={pagination} currentPage={page} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
