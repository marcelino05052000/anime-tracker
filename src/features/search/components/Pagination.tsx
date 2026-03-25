import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import type { JikanPagination } from '@/types';

interface PaginationProps {
  pagination: JikanPagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, currentPage, onPageChange }: PaginationProps) {
  const { last_visible_page, has_next_page } = pagination;

  if (last_visible_page <= 1) return null;

  // Show up to 5 pages around the current page
  const range = 2;
  const start = Math.max(1, currentPage - range);
  const end = Math.min(last_visible_page, currentPage + range);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {start > 1 && (
          <>
            <PageButton page={1} current={currentPage} onClick={onPageChange} />
            {start > 2 && <span className="px-2 text-zinc-400">…</span>}
          </>
        )}

        {pages.map((page) => (
          <PageButton key={page} page={page} current={currentPage} onClick={onPageChange} />
        ))}

        {end < last_visible_page && (
          <>
            {end < last_visible_page - 1 && <span className="px-2 text-zinc-400">…</span>}
            <PageButton page={last_visible_page} current={currentPage} onClick={onPageChange} />
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!has_next_page}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function PageButton({
  page,
  current,
  onClick,
}: {
  page: number;
  current: number;
  onClick: (page: number) => void;
}) {
  const isActive = page === current;
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        isActive
          ? 'bg-violet-600 text-white'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  );
}
