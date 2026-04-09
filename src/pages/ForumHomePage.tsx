import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ForumSectionEpisodes from '@/features/forum/components/ForumSectionEpisodes';
import ForumSectionPopular from '@/features/forum/components/ForumSectionPopular';
import ForumSectionRecent from '@/features/forum/components/ForumSectionRecent';
import type { ForumCategory, ForumPostSort } from '@/types';

export default function ForumHomePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ForumCategory | null;
  const sortParam = searchParams.get('sort') as ForumPostSort | null;
  const [page, setPage] = useState(1);

  // If filtering by category or sort, show just the filtered list
  const isFiltered = !!categoryParam || !!sortParam;

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isFiltered) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ForumSectionRecent
          page={page}
          onPageChange={handlePageChange}
          category={categoryParam ?? undefined}
          sort={sortParam ?? undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
      <ForumSectionEpisodes />
      <ForumSectionPopular />
      <ForumSectionRecent page={page} onPageChange={handlePageChange} />
    </div>
  );
}
