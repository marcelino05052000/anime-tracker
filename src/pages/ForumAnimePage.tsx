import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useForumPosts } from '@/features/forum/hooks/useForumPosts';
import { Button } from '@/components/ui';
import ForumPostList from '@/features/forum/components/ForumPostList';

export default function ForumAnimePage() {
  const { malId } = useParams<{ malId: string }>();
  const { t } = useI18n();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useForumPosts({
    mal_id: Number(malId),
    page,
    limit: 10,
  });

  const animeTitle = data?.posts?.[0]?.anime_title;
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Link
          to="/forum"
          className="flex items-center gap-1 text-sm text-violet-500 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft size={14} />
          {t.forum.post.forum}
        </Link>
        {animeTitle && (
          <>
            <span className="text-xs text-zinc-500">/</span>
            <span className="text-sm text-zinc-400">{animeTitle}</span>
          </>
        )}
      </div>

      <ForumPostList posts={data?.posts} isLoading={isLoading} />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => { setPage(pagination.page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
            onClick={() => { setPage(pagination.page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
