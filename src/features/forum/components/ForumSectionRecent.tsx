import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useForumPosts } from '../hooks/useForumPosts';
import { Button } from '@/components/ui';
import ForumPostList from './ForumPostList';
import type { ForumCategory, ForumPostSort } from '@/types';

interface ForumSectionRecentProps {
  page: number;
  onPageChange: (page: number) => void;
  category?: ForumCategory;
  sort?: ForumPostSort;
}

export default function ForumSectionRecent({ page, onPageChange, category, sort }: ForumSectionRecentProps) {
  const { t } = useI18n();
  const { data, isLoading } = useForumPosts({
    page,
    limit: 10,
    sort: sort ?? 'recent',
    category,
  });

  const pagination = data?.pagination;

  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        <Clock size={18} />
        {t.forum.home.recentPosts}
      </h2>
      <ForumPostList posts={data?.posts} isLoading={isLoading} />
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-zinc-400">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </section>
  );
}
