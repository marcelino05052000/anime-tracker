import { Tv } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useForumPosts } from '../hooks/useForumPosts';
import ForumPostList from './ForumPostList';

export default function ForumSectionEpisodes() {
  const { t } = useI18n();
  const { data, isLoading } = useForumPosts({
    category: 'episode_discussion',
    sort: 'recent',
    limit: 5,
  });

  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        <Tv size={18} />
        {t.forum.home.episodesOfTheWeek}
      </h2>
      <ForumPostList posts={data?.posts} isLoading={isLoading} />
    </section>
  );
}
