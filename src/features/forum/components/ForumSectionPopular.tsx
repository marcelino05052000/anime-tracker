import { Flame } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useForumPosts } from '../hooks/useForumPosts';
import ForumPostList from './ForumPostList';

export default function ForumSectionPopular() {
  const { t } = useI18n();
  const { data, isLoading } = useForumPosts({
    sort: 'popular',
    limit: 5,
  });

  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        <Flame size={18} />
        {t.forum.home.popularPosts}
      </h2>
      <ForumPostList posts={data?.posts} isLoading={isLoading} />
    </section>
  );
}
