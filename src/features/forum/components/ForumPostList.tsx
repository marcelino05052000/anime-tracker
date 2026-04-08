import { useI18n } from '@/hooks/useI18n';
import ForumPostCard from './ForumPostCard';
import { Spinner } from '@/components/ui';
import type { ForumPost } from '@/types';

interface ForumPostListProps {
  posts: ForumPost[] | undefined;
  isLoading: boolean;
  emptyMessage?: string;
}

export default function ForumPostList({ posts, isLoading, emptyMessage }: ForumPostListProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size={24} />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {emptyMessage ?? t.forum.empty.noPosts}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <ForumPostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
